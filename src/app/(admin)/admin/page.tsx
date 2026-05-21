import Link from "next/link";

import AdminDashboardClient from "./AdminDashboardClient";
import {
  getAdminDashboardStats,
  getAdminUsers,
  getAdminEvents,
  getAdminArticles,
  getAdminResources,
} from "./actions";

export default async function AdminDashboardPage() {
  const [stats, users, events, articles, resources] = await Promise.all([
    getAdminDashboardStats(),
    getAdminUsers(),
    getAdminEvents(),
    getAdminArticles(),
    getAdminResources(),
  ]);

  const data = {
    users,
    events,
    articles,
    resources,
  };
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
                  Prioritaskan pengajuan verifikasi alumni yang masih menunggu tindakan review Anda.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    <span className="font-semibold text-[#c8ffff]">{stats.pendingVerifications}</span> pengajuan verifikasi pending
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    <span className="font-semibold text-[#c8ffff]">{stats.events}</span> total event aktif
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

          <AdminDashboardClient stats={stats} data={data} />
        </div>
      </section>
    </main>
  );
}