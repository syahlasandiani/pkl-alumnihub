import { createClient } from "@/lib/supabase/server";

export interface AlumniEvent {
  id?: string;
  creator_id: string;
  title: string;
  type: "online" | "offline" | string;
  event_date: string;
  event_time: string;
  description?: string | null;
  location?: string | null;
  link?: string | null;
  image_url?: string | null;
  created_at?: string;
  status?: "PUBLISHED" | "CANCELLED" | "ARCHIVED" | "HIDDEN";
  profiles?: { role: string } | null;
}

export async function getEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*, profiles:creator_id(role)")
    .eq("status", "PUBLISHED")
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data;
}

export async function getEventDetail(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*, profiles:creator_id(role)")
    .eq("id", id)
    .eq("status", "PUBLISHED")
    .single();

  if (error) {
    console.error("Error fetching event detail:", error);
    return null;
  }

  return data;
}