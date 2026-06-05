import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import BackCTA from "@/components/ui/BackCTA";
import HubSectionHeader from "@/components/learning-hub/HubSectionHeader";
import EventPreviewCard from "@/components/learning-hub/EventPreviewCard";
import ArticlePreviewCard from "@/components/ArticlePreviewCard";
import HubCard from "@/components/learning-hub/HubCard";
import { getEvents } from "@/lib/data/events";
import { getArticles } from "@/lib/data/articles";
import { CalendarDays, BookOpen, FileText } from "lucide-react";

export default async function LearningHubPage() {
  const [events, articles] = await Promise.all([getEvents(), getArticles()]);

  const recentEvents = events.slice(0, 3);
  const recentArticles = articles.slice(0, 3);

  const navigationItems = [
    {
      title: "Event Alumni",
      description: "Webinar, mentoring, sharing session, dan kolaborasi.",
      href: "/learning-hub/events",
      icon: CalendarDays,
    },
    {
      title: "Konten Unggulan",
      description: "Artikel persiapan, karier, akademik, komunitas.",
      href: "/learning-hub/articles",
      icon: BookOpen,
    },
    {
      title: "Resources",
      description: "Template, contoh essay, dan panduan berkas.",
      href: "/learning-hub/resources",
      icon: FileText,
    },
  ];

  return (
    <main className="relative min-h-screen pb-24">
      {/* Background is already handled by the parent layout */}

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

          {/* QUICK LINKS GRID */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationItems.map((item) => (
              <HubCard key={item.title} {...item} />
            ))}
          </div>

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
        </div>
      </section>
    </main>
  );
}