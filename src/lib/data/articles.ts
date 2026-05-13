import { createClient } from "@/lib/supabase/server";

export interface AlumniArticle {
  id?: string;
  creator_id: string;
  title: string;
  content: string;
  cover_url?: string | null;
  author_name: string;
  published_at: string;
  created_at?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "HIDDEN";
}

export async function getArticles() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "PUBLISHED")
    .lte("published_at", now)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  return data;
}

export async function getArticleDetail(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("status", "PUBLISHED")
    .single();

  if (error) {
    console.error("Error fetching article detail:", error);
    return null;
  }

  return data;
}