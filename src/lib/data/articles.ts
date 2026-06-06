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
  profiles?: { role: string } | null;
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

  if (error || !data) {
    console.error("Error fetching articles:", error);
    return [];
  }

  const creatorIds = data.map(a => a.creator_id).filter(Boolean);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role")
    .in("id", creatorIds);
    
  const roleMap = new Map(profiles?.map(p => [p.id, p.role]) || []);

  return data.map(a => ({
    ...a,
    profiles: { role: roleMap.get(a.creator_id) || "USER" }
  }));
}

export async function getArticleDetail(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("status", "PUBLISHED")
    .single();

  if (error || !data) {
    console.error("Error fetching article detail:", error);
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.creator_id)
    .single();

  return { ...data, profiles: profile || { role: "USER" } };
}