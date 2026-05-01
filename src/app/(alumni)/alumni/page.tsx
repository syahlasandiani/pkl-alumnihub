import Link from "next/link";
import AlumniShell from "@/components/alumni/AlumniShell";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAlumniProfile, getAlumniExperiences, getAlumniDashboardStats } from "@/lib/data/alumni";

const quickActions = [
  {
    title: "Edit Profil",
    desc: "Lengkapi profil profesional",
    href: "/alumni/profile",
  },
  {
    title: "Buat Konten",
    desc: "Tulis artikel/post komunitas",
    href: "/alumni/create-article",
  },
  {
    title: "Buat Event",
    desc: "Bagikan kegiatan atau sesi alumni.",
    href: "/alumni/create-event",
  },
  {
    title: "Upload Resource",
    desc: "Tambahkan dokumen belajar untuk komunitas.",
    href: "/alumni/upload-resource",
  },
];

export default async function AlumniDashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Real Data
  const profile = await getAlumniProfile(user.id);
  const experiences = await getAlumniExperiences(user.id);
  const { stats, activities } = await getAlumniDashboardStats(user.id);

  // Calculate Progress
  const checklist = [
    { label: "Foto profil", done: Boolean(profile?.avatar_url) },
    { label: "Bio singkat", done: Boolean(profile?.short_bio) },
    { label: "Pekerjaan saat ini", done: Boolean(profile?.current_position || profile?.current_company) },
    { label: "Pengalaman", done: experiences.length > 0 },
    { label: "Social link (LinkedIn/Portofolio)", done: Boolean(profile?.linkedin_url || profile?.website_url) },
  ];

  const progress = Math.round(
    (checklist.filter((item) => item.done).length / checklist.length) * 100
  );

  return (
    <AlumniShell
      title="Dashboard Alumni"
      subtitle="Kelola kontribusi dan aktivitasmu sebagai alumni terverifikasi."
    >
      <div className="space-y-6">
        <div className="text-sm text-white/75">
          <span className="rounded-full border border-white/10 bg-[#7dd3d3]/20 px-3 py-1 text-xs font-bold text-[#7dd3d3]">
            Verified Alumni
          </span>
          <span className="ml-3 font-medium">
            {profile?.full_name || user.user_metadata?.username} • Alumni BU {profile?.graduation_year || '-'} • {profile?.current_position || 'Member'}
          </span>
        </div>

        {/* PROFILE COMPLETION SECTION */}
        <section className="rounded-[30px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Kelengkapan Profil
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Lengkapi profil supaya lebih mudah ditemukan dan dipercaya oleh komunitas.
              </p>
            </div>

            <Link
              href="/alumni/profile"
              className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Lengkapi Profil
            </Link>
          </div>

          <div className="mb-3 flex items-center justify-between text-sm font-bold">
            <span className="text-white/40 uppercase tracking-widest text-[10px]">Progress Pengisian</span>
            <span className="text-[#7dd3d3]">{progress}%</span>
          </div>

          <div className="h-3 rounded-full bg-white/5 p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7dd3d3] to-[#5eb8b8] shadow-[0_0_15px_rgba(125,211,211,0.3)] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10"
              >
                <span className="text-sm text-white/80">{item.label}</span>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${item.done ? 'bg-[#7dd3d3]/20 text-[#7dd3d3]' : 'bg-white/5 text-white/20'}`}>
                  {item.done ? "✓" : "–"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:bg-white/10 hover:translate-y-[-4px]"
            >
              <h3 className="text-xl font-bold text-white group-hover:text-[#7dd3d3] transition-colors">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{item.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                Buka
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1.8fr]">
          {/* MY STATS */}
          <div className="rounded-[40px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">
              Ringkasan Milikku
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Kontribusi yang telah kamu berikan.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/5 bg-white/5 px-6 py-7 transition hover:bg-white/10"
                >
                  <p className="text-4xl font-black text-white">
                    {item.value}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITIES */}
          <div className="rounded-[40px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">
              Aktivitas Terbaru
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Lacak jejak aktivitas kamu di platform.
            </p>

            <div className="mt-8 space-y-4">
              {activities.length > 0 ? activities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 px-6 py-5 md:flex-row md:items-center md:justify-between transition hover:bg-white/10"
                >
                  <p className="text-sm font-medium text-white/90">{item.title}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{item.meta}</p>
                </div>
              )) : (
                <div className="py-12 text-center text-white/20 font-medium italic">
                  Belum ada aktivitas terbaru.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AlumniShell>
  );
}