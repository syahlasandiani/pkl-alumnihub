import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { Calendar, MapPin, Video } from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: string;
  event_date: string;
  event_time: string;
  description: string;
  location?: string;
  link?: string;
  creator?: {
    full_name: string;
  };
}

export default function AlumniEventsSection({ events }: { events: any[] }) {
  if (events.length === 0) return null;

  return (
    <section id="event-alumni" className="px-6 scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Agenda & Event Alumni"
          subtitle="Ikuti berbagai kegiatan seru dari para alumni Beasiswa Unggulan."
          align="left"
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <GlassCard key={event.id} className="group relative overflow-hidden p-8 transition hover:bg-white/15">
              <div className="absolute top-0 right-0 h-24 w-24 bg-[#7dd3d3]/10 blur-3xl group-hover:bg-[#7dd3d3]/20 transition-all" />
              
              <div className="flex items-center gap-2 mb-4">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  event.type === 'online' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {event.type}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                {event.title}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <Calendar className="w-4 h-4 text-[#7dd3d3]" />
                  {new Date(event.event_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} • {event.event_time.slice(0, 5)} WIB
                </div>
                
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  {event.type === 'online' ? (
                    <>
                      <Video className="w-4 h-4 text-cyan-400" />
                      <span className="truncate">Via Online Platform</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="truncate">{event.location || "Lokasi menyusul"}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-[10px] text-white/40">
                  Oleh <span className="text-white/60 font-medium">Alumni Beasiswa Unggulan</span>
                </div>
                <Link 
                  href={`/learning-hub/events/${event.id}`}
                  className="text-xs font-bold text-[#7dd3d3] hover:underline transition"
                >
                  Lihat Detail
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/learning-hub/events"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/15"
          >
            Lihat Semua Event
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
