import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GlassPill from "@/components/ui/GlassPill";
import type { HubEvent } from "@/lib/types/learninghub.ts";

export default function EventCard({ event }: { event: HubEvent }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="typo-card-title text-white">
            {event.title}
          </p>
          <p className="mt-2 text-white/75 typo-small">
            {event.mode}
          </p>
          <p className="mt-1 text-white/70 typo-date">
            {event.dateLabel}
          </p>
          <p className="mt-1 text-white/70 typo-small">
            {event.timeLabel}
          </p>
          <p className="mt-1 text-white/60 typo-small">
            {event.locationLabel}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          {event.profiles?.role === "ADMIN" && (
            <GlassPill as="span" className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider !text-[#0f172a] !bg-[#7dd3d3] !border-transparent hover:!bg-[#7dd3d3]/90">
              Official
            </GlassPill>
          )}
          <GlassPill as="span" className="px-3 py-1 text-xs">
            {event.mode}
          </GlassPill>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/learning-hub/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition text-sm"
        >
          Lihat Detail <span>→</span>
        </Link>
      </div>
    </GlassCard>
  );
}