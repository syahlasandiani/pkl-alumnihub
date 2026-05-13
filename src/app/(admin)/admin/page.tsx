import Link from "next/link";

const quickActions = [
  {
    title: "Kelola Verifikasi",
    desc: "Lihat dan proses pengajuan verifikasi alumni.",
    href: "/admin/verifications",
  },
  {
    title: "Moderasi Forum",
    desc: "Tinjau thread dan komentar yang perlu dimoderasi.",
    href: "/admin/moderation",
  },
  {
    title: "Kelola Pengguna",
    desc: "Nonaktifkan atau aktifkan kembali akun pengguna.",
    href: "/admin/users",
  },
  {
    title: "Kurasi Konten",
    desc: "Pilih konten atau resource unggulan untuk beranda.",
    href: "/admin/highlights",
  },
];

const stats = [
  { label: "Pending Verifikasi", value: 8 },
  { label: "Alumni Verified", value: 124 },
  { label: "Thread Aktif", value: 37 },
  { label: "Resource Publik", value: 21 },
];

const activities = [
  {
    title: "3 pengajuan verifikasi baru menunggu review",
    meta: "Verifikasi • Hari ini",
  },
  {
    title: "1 thread dilaporkan oleh pengguna",
    meta: "Forum • 2 jam lalu",
  },
  {
    title: "2 resource baru diunggah oleh alumni",
    meta: "Resource • 1 hari lalu",
  },
  {
    title: "1 akun pengguna dinonaktifkan",
    meta: "User • 2 hari lalu",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-admin.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/35" />

      <section className="px-6">
        <div className="mx-auto max-w-6xl pt-8 pb-24">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-xl hover:text-white"
            >
              ← Kembali ke Beranda
            </Link>

            <span className="rounded-full border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1 text-xs font-semibold text-[#c8ffff]">
              Admin
            </span>
          </div>

          <section className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex rounded-full border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1 text-xs font-semibold text-[#c8ffff]">
                  Dashboard Admin
                </div>

                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  Panel Admin
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
                  Pantau verifikasi, moderasi komunitas, dan aktivitas sistem
                  dari satu tempat.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/65">
                  <span className="font-medium text-white/90">
                    Administrator
                  </span>
                  <span className="text-white/30">•</span>
                  <span>Akses penuh sistem</span>
                </div>
              </div>

              <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-white">
                  Fokus Hari Ini
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Prioritaskan pengajuan verifikasi dan laporan forum yang masih
                  menunggu tindakan.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    8 pengajuan verifikasi pending
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    1 laporan thread baru
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    2 resource menunggu peninjauan
                  </div>
                </div>

                <Link
                  href="/admin/verifications"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/15"
                >
                  Buka Verifikasi
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl transition hover:bg-white/15"
              >
                <p className="text-base font-semibold text-white">
                  {action.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {action.desc}
                </p>
                <p className="mt-5 text-sm font-semibold text-[#c8ffff]">
                  Buka →
                </p>
              </Link>
            ))}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl xl:col-span-1">
              <h2 className="text-xl font-semibold text-white">
                Ringkasan Sistem
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Statistik singkat aktivitas dan komunitas.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <p className="text-2xl font-semibold text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-white/60">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl xl:col-span-2">
              <h2 className="text-xl font-semibold text-white">
                Aktivitas Terbaru
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Ringkasan antrian kerja admin terbaru.
              </p>

              <div className="mt-5 space-y-3">
                {activities.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm font-medium text-white/90">
                      {item.title}
                    </p>
                    <p className="text-xs text-white/50">{item.meta}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}