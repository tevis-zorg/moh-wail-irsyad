"use server";

import { revalidatePath } from "next/cache";

import { getAdminSupabaseClient } from "../../../lib/supabase/admin";

type ActionState = {
  status: "success" | "error";
  message: string;
};

function readText(formData: FormData, name: string): string | null {
  const value = formData.get(name);

  if (value === null) {
    return "";
  }

  return typeof value === "string" ? value.trim() : null;
}

function isDuplicateError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

export async function createResearchPaper(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await getAdminSupabaseClient();
  if (!supabase) {
    return { status: "error", message: "Admin access is required." };
  }

  const title = readText(formData, "title");
  const authors = readText(formData, "authors");
  const abstract = readText(formData, "abstract");
  const publicationName = readText(formData, "publication_name");
  const yearValue = readText(formData, "year");
  const driveFileId = readText(formData, "drive_file_id");
  const mimeType = readText(formData, "mime_type");
  const publishedValue = readText(formData, "is_published");
  const rightsConfirmation = readText(formData, "confirm_public_rights");

  if (
    title === null ||
    authors === null ||
    abstract === null ||
    publicationName === null ||
    yearValue === null ||
    driveFileId === null ||
    mimeType === null ||
    publishedValue === null ||
    rightsConfirmation === null
  ) {
    return { status: "error", message: "Please submit valid text values." };
  }

  if (!title || title.length > 300) {
    return {
      status: "error",
      message: "Enter a title with no more than 300 characters.",
    };
  }

  if (authors.length > 2000 || abstract.length > 20000 || publicationName.length > 500) {
    return { status: "error", message: "One or more fields exceed the allowed length." };
  }

  let year: number | null = null;
  if (yearValue) {
    if (!/^\d{4}$/.test(yearValue)) {
      return { status: "error", message: "Enter a four-digit publication year." };
    }

    year = Number(yearValue);
    if (year < 1900 || year > 2200) {
      return { status: "error", message: "The publication year must be between 1900 and 2200." };
    }
  }

  if (!/^[A-Za-z0-9_-]{10,200}$/.test(driveFileId)) {
    return { status: "error", message: "Enter a valid Google Drive File ID." };
  }

  if (mimeType !== "application/pdf") {
    return { status: "error", message: "Research papers must use application/pdf." };
  }

  let isPublished = false;
  if (publishedValue === "true" || publishedValue === "on") {
    isPublished = true;
  } else if (publishedValue !== "" && publishedValue !== "false" && publishedValue !== "off") {
    return { status: "error", message: "Invalid publication status." };
  }

  if (
    isPublished &&
    rightsConfirmation !== "true" &&
    rightsConfirmation !== "on"
  ) {
    return {
      status: "error",
      message: "Confirm public viewing and download rights before publishing this paper.",
    };
  }

  try {
    const { error } = await supabase.from("research_papers").insert({
      title,
      authors: authors || null,
      abstract: abstract || null,
      publication_name: publicationName || null,
      year,
      drive_file_id: driveFileId,
      mime_type: "application/pdf",
      is_published: isPublished,
    });

    if (error) {
      if (isDuplicateError(error)) {
        return {
          status: "error",
          message: "That Google Drive File ID is already registered.",
        };
      }

      return { status: "error", message: "The research paper could not be saved." };
    }
  } catch {
    return { status: "error", message: "The research paper could not be saved." };
  }

  revalidatePath("/admin/research-papers");
  return { status: "success", message: "Research paper created." };
}
