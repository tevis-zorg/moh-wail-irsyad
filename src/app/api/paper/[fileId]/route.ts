import { Readable } from "node:stream";

import { getDriveClient } from "../../../../lib/google-drive/client";
import { createClient } from "../../../../lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

<<<<<<< HEAD
const DOCUMENT_MIME_TYPES = new Set([
=======
const DOC_MIME_TYPE = new Set([
>>>>>>> 00e4b8b5effe414292674de3c70ac2f94db043da
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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

function normalizeMimeType(value: string | null | undefined) {
  return value?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
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
      .from("research_papers")
      .select("drive_file_id, mime_type")
      .eq("drive_file_id", fileId)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      return errorResponse("Paper is temporarily unavailable.", 500);
    }

    record = data;
  } catch {
    return errorResponse("Paper is temporarily unavailable.", 500);
  }

  if (!record) {
    return errorResponse("Paper not found.", 404);
  }

  if (!DOCUMENT_MIME_TYPES.has(record.mime_type)) {
    return errorResponse("Unsupported paper type.", 415);
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
      !DOCUMENT_MIME_TYPES.has(metadataMimeType)
    ) {
      return errorResponse("Paper is unavailable.", 502);
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
    const upstreamMimeType = mediaHeaderMimeType || metadataMimeType;

    if (
      mediaResponse.status !== 200 ||
      (mediaHeaderMimeType && mediaHeaderMimeType !== record.mime_type) ||
      !DOCUMENT_MIME_TYPES.has(upstreamMimeType)
    ) {
      mediaResponse.data.destroy();
      return errorResponse("Paper is unavailable.", 502);
    }

    const headers = new Headers({
      "Content-Type": upstreamMimeType,
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "X-Content-Type-Options": "nosniff",
    });

    const contentLength = mediaResponse.headers["content-length"];
    if (contentLength && /^\d+$/.test(contentLength)) {
      headers.set("Content-Length", contentLength);
    }

    const body = Readable.toWeb(mediaResponse.data) as ReadableStream<Uint8Array>;
    return new Response(body, { status: 200, headers });
  } catch (error) {
    const upstreamStatus = getGoogleStatus(error);
    const status = upstreamStatus === 404 ? 404 : 502;
    const message = status === 404 ? "Paper not found." : "Paper is unavailable.";
    return errorResponse(message, status);
  }
}
