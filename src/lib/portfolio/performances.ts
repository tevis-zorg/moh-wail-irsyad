import { createClient } from "../supabase/server";

const APPROVED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export type PublishedPerformance = {
  id: string;
  title: string;
  event_name: string;
  description: string | null;
  year: number | null;
  drive_file_id: string;
};

export type PublishedPerformancesResult =
  | { records: PublishedPerformance[]; error: false }
  | { records: []; error: true };

export async function getPublishedPerformances(): Promise<PublishedPerformancesResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("performances")
      .select("id, title, event_name, description, year, drive_file_id")
      .eq("is_published", true)
      .in("mime_type", APPROVED_IMAGE_MIME_TYPES)
      .order("event_name", { ascending: true })
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
