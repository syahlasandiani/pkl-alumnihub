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

  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "PUBLISHED")
    .lte("published_at", now)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error.message, error.details, error.hint);
    return [];
  }

  if (articles && articles.length > 0) {
    const creatorIds = Array.from(new Set(articles.map(a => a.creator_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, role")
      .in("id", creatorIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    return articles.map(a => ({
      ...a,
      profiles: profileMap.get(a.creator_id) || null
    }));
  }

  return articles || [];
}

export async function getArticleDetail(id: string) {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("status", "PUBLISHED")
    .single();

  if (error || !article) {
    console.error("Error fetching article detail:", error);
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", article.creator_id)
    .single();

  return {
    ...article,
    profiles: profile || null
  };
}