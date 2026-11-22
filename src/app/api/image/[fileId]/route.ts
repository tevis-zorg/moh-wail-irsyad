import { Readable } from "node:stream";

import { getDriveClient } from "../../../../lib/google-drive/client";
import { createClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const FILE_ID_PATTERN = /^[A-Za-z0-9_-]{10,200}$/;

function errorResponse(message: string, status: number) {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function normalizeMimeType(value: string | null | undefined) {
  return value?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
}

function logDriveFailure(stage: string, error: unknown) {
  const status = getGoogleStatus(error);
  console.error("Google Drive image request failed", {
    stage,
    status: status ?? "unknown",
  });
}

function getGoogleStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  if ("code" in error && typeof error.code === "number") {
    return error.code;
  }

  if (!("response" in error)) {
    return undefined;
  }

  const response = error.response;
  if (typeof response !== "object" || response === null || !("status" in response)) {
    return undefined;
  }

  return typeof response.status === "number" ? response.status : undefined;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await context.params;

  if (!FILE_ID_PATTERN.test(fileId)) {
    return errorResponse("Invalid file ID.", 400);
  }

  let record: { drive_file_id: string; mime_type: string } | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("performances")
      .select("drive_file_id, mime_type")
      .eq("drive_file_id", fileId)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      return errorResponse("Media is temporarily unavailable.", 500);
    }

    record = data;
  } catch {
    return errorResponse("Media is temporarily unavailable.", 500);
  }

  if (!record) {
    return errorResponse("Image not found.", 404);
  }

  if (!IMAGE_MIME_TYPES.has(record.mime_type)) {
    return errorResponse("Unsupported image type.", 415);
  }

  try {
    const drive = getDriveClient();
    const metadataResponse = await drive.files.get({
      fileId: record.drive_file_id,
      fields: "id,mimeType",
      supportsAllDrives: true,
    });

    const metadataMimeType = normalizeMimeType(metadataResponse.data.mimeType);

    if (
      metadataResponse.status !== 200 ||
      metadataResponse.data.id !== record.drive_file_id ||
      metadataMimeType !== record.mime_type ||
      !IMAGE_MIME_TYPES.has(metadataMimeType)
    ) {
      console.error("Google Drive image metadata mismatch", {
        stage: "metadata-validation",
        status: metadataResponse.status,
        registeredMimeType: record.mime_type,
        upstreamMimeType: metadataMimeType || "missing",
      });
      return errorResponse("Image is unavailable.", 502);
    }

    const mediaResponse = await drive.files.get(
      {
        fileId: record.drive_file_id,
        alt: "media",
        supportsAllDrives: true,
      },
      { responseType: "stream" },
    );

    const mediaHeaderMimeType = normalizeMimeType(mediaResponse.headers["content-type"]);
    // Some Drive media responses omit Content-Type even after metadata has
    // verified the exact file's MIME type. Keep that verified metadata as the
    // fallback, but reject a present conflicting header.
    const upstreamMimeType = mediaHeaderMimeType || metadataMimeType;

    if (
      mediaResponse.status !== 200 ||
      (mediaHeaderMimeType && mediaHeaderMimeType !== record.mime_type) ||
      !IMAGE_MIME_TYPES.has(upstreamMimeType)
    ) {
      mediaResponse.data.destroy();
      console.error("Google Drive image media mismatch", {
        stage: "media-validation",
        status: mediaResponse.status,
        registeredMimeType: record.mime_type,
        upstreamMimeType: upstreamMimeType || "missing",
      });
      return errorResponse("Image is unavailable.", 502);
    }

    const headers = new Headers({
      "Content-Type": upstreamMimeType,
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    });

    const contentLength = mediaResponse.headers["content-length"];
    if (contentLength && /^\d+$/.test(contentLength)) {
      headers.set("Content-Length", contentLength);
    }

    const body = Readable.toWeb(mediaResponse.data) as ReadableStream<Uint8Array>;
    return new Response(body, { status: 200, headers });
  } catch (error) {
    logDriveFailure("request", error);
    const upstreamStatus = getGoogleStatus(error);
    const status = upstreamStatus === 404 ? 404 : 502;
    const message = status === 404 ? "Image not found." : "Image is unavailable.";
    return errorResponse(message, status);
  }
}
