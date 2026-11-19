import { createClient } from "../supabase/server";

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
      .eq("mime_type", "application/pdf")
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
