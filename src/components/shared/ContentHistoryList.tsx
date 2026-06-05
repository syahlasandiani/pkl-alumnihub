import { createServerClient } from "@/lib/supabase/server";
import HistoryTabsClient from "./HistoryTabsClient";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";

interface ContentHistoryListProps {
  userId: string;
  title?: string;
  limit?: boolean;
}

export default async function ContentHistoryList({ 
  userId, 
  title = "Riwayat Konten Saya",
  limit = false 
}: ContentHistoryListProps) {
  const supabase = await createServerClient();

  const [
    { data: articles },
    { data: events },
    { data: resources }
  ] = await Promise.all([
    supabase.from("articles").select("*").eq("creator_id", userId).order("created_at", { ascending: false }),
    supabase.from("events").select("*").eq("creator_id", userId).order("created_at", { ascending: false }),
    supabase.from("resources").select("*").eq("creator_id", userId).order("created_at", { ascending: false })
  ]);

  const displayedArticles = limit ? (articles || []).slice(0, 5) : (articles || []);
  const displayedEvents = limit ? (events || []).slice(0, 5) : (events || []);
  const displayedResources = limit ? (resources || []).slice(0, 5) : (resources || []);

  const hasMore = limit && (
    (articles && articles.length > 5) ||
    (events && events.length > 5) ||
    (resources && resources.length > 5)
  );

  return (
    <GlassCard className="p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="typo-card-title text-white">{title}</h2>
        {hasMore && (
          <Link 
            href="/alumni/history" 
            className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold text-[#7dd3d3] hover:text-white transition"
          >
            Lihat Semua
          </Link>
        )}
      </div>
      <HistoryTabsClient 
        articles={displayedArticles} 
        events={displayedEvents} 
        resources={displayedResources} 
      />
    </GlassCard>
  );
}

