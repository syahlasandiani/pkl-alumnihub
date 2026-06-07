export const dynamic = "force-dynamic";

import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import BackCTA from "@/components/ui/BackCTA";
import HubSectionHeader from "@/components/learning-hub/HubSectionHeader";
import EventPreviewCard from "@/components/learning-hub/EventPreviewCard";
import ArticlePreviewCard from "@/components/ArticlePreviewCard";
import { getEvents } from "@/lib/data/events";
import { getArticles } from "@/lib/data/articles";
import { getResources } from "@/lib/data/resources";
import { FileText, Download, FileArchive, File as FileIcon } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlassPill from "@/components/ui/GlassPill";

export default async function LearningHubPage() {
  const [events, articles, resources] = await Promise.all([
    getEvents(),
    getArticles(),
    getResources(),
  ]);

  const recentEvents = events.slice(0, 3);
  const recentArticles = articles.slice(0, 3);
  const recentResources = resources.slice(0, 3);

  const getFileIcon = (type: string | undefined) => {
    const t = type?.toLowerCase();
    if (t === "pdf") return <FileText className="h-8 w-8 text-red-400" />;
    if (t === "zip" || t === "rar") return <FileArchive className="h-8 w-8 text-amber-400" />;
    return <FileIcon className="h-8 w-8 text-[#7dd3d3]" />;
  };

  const formatSize = (bytes: number | undefined) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <main className="relative min-h-screen pb-24">
      <section className="px-6">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="mb-8">
            <BackCTA href="/" />
          </div>

          <SectionHeading
            title="Learning Hub"
            subtitle="Pusat pengembangan diri komunitas Beasiswa Unggulan. Akses event, konten unggulan, dan resources terbaik dari para alumni."
            align="left"
          />

          {/* EVENT SECTION */}
          <div className="mt-24">
            <HubSectionHeader title="Event Alumni" />

            {recentEvents.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentEvents.map((e) => (
                  <EventPreviewCard
                    key={e.id}
                    title={e.title}
                    date={new Date(e.event_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    time={e.event_time}
                    mode={e.type === "online" ? "Online" : "Offline"}
                    href={`/learning-hub/events/${e.id}`}
                    isOfficial={e.profiles?.role === "ADMIN"}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl bg-white/5 p-12 text-center border border-white/5">
                <p className="text-white/40 italic">
                  Belum ada event mendatang.
                </p>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/learning-hub/events"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Lihat Semua Event <span>→</span>
              </Link>
            </div>
          </div>

          {/* ARTICLES SECTION */}
          <div className="mt-24">
            <HubSectionHeader title="Konten Unggulan" />

            {recentArticles.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentArticles.map((a) => (
                  <ArticlePreviewCard
                    key={a.id}
                    title={a.title}
                    category="Inspirasi"
                    href={`/learning-hub/articles/${a.id}`}
                    cover={
                      a.cover_url || "/assets/placeholders/article-placeholder.jpg"
                    }
                    isOfficial={a.profiles?.role === "ADMIN"}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl bg-white/5 p-12 text-center border border-white/5">
                <p className="text-white/40 italic">
                  Belum ada konten unggulan terbaru.
                </p>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/learning-hub/articles"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Baca Semua Konten <span>→</span>
              </Link>
            </div>
          </div>

          {/* RESOURCES SECTION */}
          <div className="mt-24">
            <HubSectionHeader title="Resources & Dokumen" />

            {recentResources.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentResources.map((res) => (
                  <GlassCard key={res.id} className="group flex flex-col p-6 transition hover:bg-white/10 relative overflow-hidden">
                    {res.profiles?.role === "ADMIN" && (
                      <GlassPill as="div" className="absolute top-0 right-0 !rounded-none !rounded-bl-xl !bg-[#7dd3d3] !border-transparent !text-[#0f172a] text-[10px] font-bold uppercase tracking-wider px-3 py-1 z-10 shadow-sm hover:!bg-[#7dd3d3]">
                        Official
                      </GlassPill>
                    )}
                    <div className="mb-5 flex items-start justify-between mt-1">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-transform group-hover:scale-110">
                        {getFileIcon(res.file_type ?? undefined)}
                      </div>
                      <div className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        {res.file_type || "FILE"}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#7dd3d3] transition-colors">
                        {res.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/50 line-clamp-2">
                        {res.description || "Tidak ada deskripsi tambahan."}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ukuran</p>
                        <p className="text-sm font-semibold text-white/70">{formatSize(res.file_size ?? undefined)}</p>
                      </div>
                      <a
                        href={res.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7dd3d3] text-[#0f172a] shadow-lg shadow-[#7dd3d3]/20 transition hover:bg-[#6ec2c2] hover:scale-110 active:scale-95"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl bg-white/5 p-12 text-center border border-white/5">
                <p className="text-white/40 italic">
                  Belum ada resource yang tersedia.
                </p>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/learning-hub/resources"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Lihat Semua Resources <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}