import AdminDashboardClient from "./AdminDashboardClient";
import CTAButton from "@/components/ui/CTAButton";
import ContentHistoryList from "@/components/shared/ContentHistoryList";
import { createServerClient } from "@/lib/supabase/server";
import {
  getAdminDashboardStats,
  getAdminUsers,
  getAdminEvents,
  getAdminArticles,
  getAdminResources,
} from "./actions";

export default async function AdminDashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [stats, users, events, articles, resources] = await Promise.all([
    getAdminDashboardStats(),
    getAdminUsers(),
    getAdminEvents(),
    getAdminArticles(),
    getAdminResources(),
  ]);

  const data = { users, events, articles, resources };

  return (
    <div className="w-full">
      <section className="px-6">
        <div className="mx-auto max-w-6xl pt-8 pb-24">
          {/* Top nav bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <CTAButton variant="secondary" href="/">
              ← Kembali ke Beranda
            </CTAButton>
            <span className="rounded-full border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1 text-xs font-semibold text-[#c8ffff]">
              Admin
            </span>
          </div>

          {/* Main dashboard */}
          <AdminDashboardClient stats={stats} data={data} />

          {/* Riwayat konten admin di bawah */}
          {user && (
            <ContentHistoryList userId={user.id} title="Riwayat Konten Admin" />
          )}
        </div>
      </section>
    </div>
  );
}