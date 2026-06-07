import { createServerClient } from "@/lib/supabase/server";
import HistoryTabsClient from "./HistoryTabsClient";
import GlassCard from "@/components/ui/GlassCard";

interface ContentHistoryListProps {
  userId: string;
  title?: string;
  isAdmin?: boolean;
}

export default async function ContentHistoryList({ userId, title = "Riwayat Konten Saya", isAdmin = false }: ContentHistoryListProps) {
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

  return (
    <GlassCard className="p-8 mt-8">
      <h2 className="typo-card-title text-white mb-6">{title}</h2>
      <HistoryTabsClient 
        articles={articles || []} 
        events={events || []} 
        resources={resources || []} 
        isAdmin={isAdmin}
      />
    </GlassCard>
  );
}
