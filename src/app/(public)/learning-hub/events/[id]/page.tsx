import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventDetail } from "@/lib/data/events";
import { Calendar, MapPin, Video, Clock, User } from "lucide-react";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventDetail(id);

  if (!event) {
    notFound();
  }

  return (
    <main className="relative min-h-screen text-white selection:bg-white/20">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-10">
        {/* Tombol Kembali */}
        <Link
          href="/learning-hub/events"
          className="group mb-12 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium transition hover:bg-white/10 backdrop-blur-md"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Kembali ke Event
        </Link>

        {/* Event Content Section */}
        <div className="space-y-12">
          {/* Title & Type Badge */}
          <div className="space-y-6">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
              event.type === 'online' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {event.type === 'online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              {event.type}
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl max-w-4xl leading-[1.1]">
              {event.title}
            </h1>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-white/10 py-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <Calendar className="h-6 w-6 text-[#7dd3d3]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Tanggal Acara</p>
                <p className="text-lg font-semibold">
                  {new Date(event.event_date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <Clock className="h-6 w-6 text-[#7dd3d3]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Waktu Pelaksanaan</p>
                <p className="text-lg font-semibold">{event.event_time.slice(0, 5)} WIB</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                {event.type === 'online' ? <Video className="h-6 w-6 text-cyan-400" /> : <MapPin className="h-6 w-6 text-amber-400" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
                  {event.type === 'online' ? 'Link Pertemuan' : 'Lokasi Acara'}
                </p>
                {event.type === 'online' ? (
                  event.link ? (
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-[#7dd3d3] hover:underline">
                      Klik untuk Join Meeting
                    </a>
                  ) : <p className="text-lg font-semibold text-white/50">Link belum tersedia</p>
                ) : (
                  <p className="text-lg font-semibold">{event.location || "Lokasi menyusul"}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <User className="h-6 w-6 text-white/40" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Penyelenggara</p>
                <p className="text-lg font-semibold">{event.organizer?.full_name || "Alumni Beasiswa Unggulan"}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Deskripsi Event</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-white/70 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {/* Action Button - Premium Style */}
          <div className="pt-8">
            <button className="rounded-2xl bg-[#7dd3d3] px-12 py-4 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#7dd3d3]/20 transition hover:bg-[#6ec2c2] hover:scale-[1.02] active:scale-100">
              Registrasi Sekarang
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
