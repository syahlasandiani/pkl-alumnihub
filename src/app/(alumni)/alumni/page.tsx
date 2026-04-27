import Link from "next/link";
import AlumniShell from "@/components/alumni/AlumniShell";

const checklist = [
  { label: "Foto profil", done: true },
  { label: "Bio singkat", done: false },
  { label: "Pekerjaan saat ini", done: true },
  { label: "Pengalaman", done: false },
  { label: "Social link (LinkedIn/Portofolio)", done: true },
];

const quickActions = [
  {
    title: "Edit Profil",
    desc: "Lengkapi profil profesional",
    href: "/alumni/profile",
  },
  {
    title: "Buat Konten",
    desc: "Tulis artikel/post komunitas",
    href: "/learning-hub/articles",
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

const stats = [
  { label: "Konten", value: 3 },
  { label: "Resource", value: 2 },
  { label: "Event Aktif", value: 1 },
  { label: "Thread", value: 5 },
];

const activities = [
  { title: "Thread: Tips nulis esai BU 2026", meta: "Forum • 2 jam lalu" },
  { title: "Resource: Template CV Beasiswa", meta: "Resources • 1 hari lalu" },
  { title: "Event: Sharing Session Alumni BU", meta: "Event • 3 hari lalu" },
];

export default function AlumniDashboardPage() {
  const progress = Math.round(
    (checklist.filter((item) => item.done).length / checklist.length) * 100
  );

  return (
    <AlumniShell
      title="Dashboard Alumni"
      subtitle="Kelola kontribusi dan aktivitasmu sebagai alumni terverifikasi."
      backHref="/"
      backLabel="Kembali ke Beranda"
    >
      <div className="space-y-6">
        <div className="text-sm text-white/75">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">
            Verified Alumni
          </span>
          <span className="ml-3">
            Eka • Alumni BU 2024 • Software Engineer
          </span>
        </div>

        <section className="rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Kelengkapan Profil
              </h2>
              <p className="mt-1 text-sm text-white/65">
                Lengkapi profil supaya lebih mudah ditemukan dan dipercaya.
              </p>
            </div>

            <Link
              href="/alumni/profile"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white"
            >
              Lengkapi Profil
            </Link>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm text-white/75">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-white/70"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="text-sm text-white/80">{item.label}</span>
                <span className="text-sm text-white/70">
                  {item.done ? "✓" : "–"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[26px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-xl transition hover:bg-white/15"
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.desc}</p>
              <p className="mt-6 text-sm font-medium text-white">Buka →</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_2fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">
              Ringkasan Milikku
            </h2>
            <p className="mt-1 text-sm text-white/65">
              Kontribusi kamu di Alumni Hub.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5"
                >
                  <p className="text-3xl font-semibold text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-white/65">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">
              Aktivitas Terbaru
            </h2>
            <p className="mt-1 text-sm text-white/65">
              Update terbaru dari akun kamu.
            </p>

            <div className="mt-5 space-y-3">
              {activities.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <p className="text-sm text-white">{item.title}</p>
                  <p className="text-xs text-white/55">{item.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AlumniShell>
  );
}