export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BackCTA from "@/components/ui/BackCTA";
import ContentHistoryList from "@/components/shared/ContentHistoryList";
import SectionHeading from "@/components/shared/SectionHeading";

export default async function AlumniHistoryPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Base Profile to check status or role if needed
  const { data: baseProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = baseProfile?.role === "ADMIN";

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href={isAdmin ? "/admin" : "/alumni"} label="Kembali ke Dashboard" className="mb-6" />

        <SectionHeading
          title="Semua Riwayat Konten"
          subtitle="Daftar lengkap artikel, event, dan resource yang pernah Anda buat."
        />

        <ContentHistoryList userId={user.id} title="Riwayat Aktivitas Saya" limit={false} />
      </div>
    </section>
  );
}
