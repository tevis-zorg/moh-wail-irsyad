import { createClient } from "../supabase/server";

const APPROVED_DOCUMENTS_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export type PublishedResearchPaper = {
  id: string;
  title: string;
  authors: string | null;
  publication_name: string | null;
  year: number | null;
  abstract: string | null;
  drive_file_id: string;
};

export type PublishedResearchPapersResult =
  | { records: PublishedResearchPaper[]; error: false }
  | { records: []; error: true };

export async function getPublishedResearchPapers(): Promise<PublishedResearchPapersResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("research_papers")
      .select(
        "id, title, authors, publication_name, year, abstract, drive_file_id",
      )
      .eq("is_published", true)
      .in("mime_type", APPROVED_DOCUMENTS_MIME_TYPES)
      .order("publication_name", { ascending: true, nullsFirst: false })
      .order("year", { ascending: false, nullsFirst: false })
      .order("title", { ascending: true });

    if (error) {
      return { records: [], error: true };
    }

    return { records: data ?? [], error: false };
  } catch {
    return { records: [], error: true };
  }
}
