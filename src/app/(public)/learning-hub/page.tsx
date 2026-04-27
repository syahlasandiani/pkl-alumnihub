// src/app/(public)/learning-hub/page.tsx
import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import BackCTA from "@/components/ui/BackCTA";

import HubSectionHeader from "@/components/learning-hub/HubSectionHeader";
import EventPreviewCard from "@/components/learning-hub/EventPreviewCard";
import ArticlePreviewCard from "@/components/ArticlePreviewCard";
import ForumTopicCard from "@/components/learning-hub/ForumTopicCard";

import GlassCard from "@/components/ui/GlassCard";

import {
  eventPreview,
  articlePreview,
  resourcesPreview,
  forumPreview,
} from "@/lib/data/mock/learningHub.mock";

export default function LearningHubPage() {
  return (
    <main className="relative min-h-screen">
      {/* BACKGROUND + OVERLAY (biar konsisten kayak /alumni) */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-bg.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/35" />

      <section className="px-6 scroll-mt-32">
        <div className="max-w-6xl mx-auto pt-6 md:pt-8 pb-24">
          {/* CTA Kembali */}
          <div className="mb-6">
            <BackCTA href="/#learning-hub" />
          </div>

          <SectionHeading
            title="Learning Hub"
            subtitle="Pusat pembelajaran komunitas Beasiswa Unggulan: event, konten unggulan, resources persiapan, dan forum diskusi."
            align="left"
          />

          {/* EVENT */}
          <HubSectionHeader title="Event Alumni" />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventPreview.map((e) => (
              <EventPreviewCard key={e.href} {...e} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              href="/learning-hub/events"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 text-white px-7 py-3 font-semibold hover:bg-white/15 transition"
            >
              Lihat Semua Event <span className="ml-2">→</span>
            </Link>
          </div>

          {/* ARTICLES */}
          <HubSectionHeader title="Konten Unggulan" />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlePreview.map((a) => (
              <ArticlePreviewCard key={a.href} {...a} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              href="/learning-hub/articles"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 text-white px-7 py-3 font-semibold hover:bg-white/15 transition"
            >
              Lihat Semua Artikel <span className="ml-2">→</span>
            </Link>
          </div>

          {/* RESOURCES */}
          <HubSectionHeader title="Resources" />
          <GlassCard className="mt-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(resourcesPreview).map(([group, items]) => (
                <div key={group}>
                  <div className="text-white font-semibold">{group}</div>
                  <div className="mt-4 space-y-3">
                    {items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className="block text-white/75 hover:text-white transition text-sm"
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          <div className="mt-6 flex justify-center">
            <Link
              href="/learning-hub/resources"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 text-white px-7 py-3 font-semibold hover:bg-white/15 transition"
            >
              Buka Semua Resources <span className="ml-2">→</span>
            </Link>
          </div>

          {/* FORUM */}
          <HubSectionHeader title="Forum Diskusi" />
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forumPreview.map((t) => (
              <ForumTopicCard key={t.href} {...t} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              href="/learning-hub/forum"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 text-white px-7 py-3 font-semibold hover:bg-white/15 transition"
            >
              Masuk Forum Diskusi <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}