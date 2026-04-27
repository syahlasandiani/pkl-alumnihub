import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import type { HubEvent } from "@/lib/types/learninghub.ts";

export default function EventCard({ event }: { event: HubEvent }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white font-semibold leading-snug">
            {event.title}
          </p>
          <p className="mt-2 text-white/75 text-sm">
            {event.mode}
          </p>
          <p className="mt-1 text-white/70 text-sm">
            {event.dateLabel}
          </p>
          <p className="mt-1 text-white/70 text-sm">
            {event.timeLabel}
          </p>
          <p className="mt-1 text-white/60 text-xs">
            {event.locationLabel}
          </p>
        </div>

        <span
          className={[
            "shrink-0 rounded-full px-3 py-1 text-xs border",
            event.mode === "Online"
              ? "border-white/20 text-white/80 bg-white/10"
              : "border-white/20 text-white/80 bg-white/10",
          ].join(" ")}
        >
          {event.mode}
        </span>
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