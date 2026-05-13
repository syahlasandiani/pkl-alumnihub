// src/components/home/ScheduleSection.tsx
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

const scheduleItems = [
  { label: "Pendaftaran", value: "20 Jan – 10 Feb 2026" },
  { label: "Seleksi Administrasi", value: "11 – 15 Feb 2026" },
  { label: "Pengumuman Tahap 1", value: "20 Feb 2026" },
  { label: "Pembekalan", value: "25 – 28 Feb 2026" },
];

export default function ScheduleSection() {
  return (
    <section id="jadwal" className="px-6 py-24 md:py-32 scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Jadwal Pendaftaran dan Seleksi Beasiswa Unggulan"
          align="left"
        />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {scheduleItems.map((it) => (
            <GlassCard key={it.label} className="px-6 py-7">
              <div className="text-white/70 text-sm">{it.label}</div>
              <div className="typo-date text-white">
                {it.value}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}