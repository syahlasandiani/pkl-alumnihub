export const dynamic = "force-dynamic";

import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAlumniProfile, getAlumniExperiences } from "@/lib/data/alumni";
import { User, Lock } from "lucide-react";
import BackCTA from "@/components/ui/BackCTA";
import GlassCard from "@/components/ui/GlassCard";
import CTAButton from "@/components/ui/CTAButton";
import ContentHistoryList from "@/components/shared/ContentHistoryList";

const quickActions = [
  {
    title: "Buat Konten",
    desc: "Tulis artikel/post komunitas",
    href: "/alumni/create-post",
  },
  {
    title: "Buat Event",
    desc: "Bagikan kegiatan atau sesi alumni",
    href: "/alumni/create-event",
  },
  {
    title: "Upload Resource",
    desc: "Tambahkan dokumen belajar untuk komunitas",
    href: "/alumni/upload-resource",
  },
];

export default async function AlumniDashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Base Profile (for verification status)
  const { data: baseProfile } = await supabase
    .from("profiles")
    .select("verification_status, display_name")
    .eq("id", user.id)
    .single();

  const isVerified = baseProfile?.verification_status === "VERIFIED";

  // Fetch Real Data
  const profile = await getAlumniProfile(user.id);
  const experiences = await getAlumniExperiences(user.id);

  const displayName = baseProfile?.display_name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "";
  const verificationStatusText = baseProfile?.verification_status || "NONE";

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        {/* Top Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <BackCTA href="/" label="Kembali ke Beranda" />
          <span className="rounded-full border border-white/10 bg-[#7dd3d3]/20 px-4 py-1.5 text-xs font-bold text-[#7dd3d3]">
            {isVerified ? "Verified" : "Unverified"}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] items-start">
          {/* Kolom Kiri: Profil & Experiences */}
          <div className="space-y-6">
            {/* Kartu Profil Utama */}
            <GlassCard className="p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="h-24 w-24 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/50">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                  <div className="text-center sm:text-left mt-2 sm:mt-0">
                    <h1 className="typo-section-title text-white">{displayName}</h1>
                    <p className="text-sm text-white/70 mt-2">Email: {userEmail}</p>
                    <p className="text-sm text-white/70 mt-0.5">
                      Status Verifikasi: <span className="font-semibold text-white">{verificationStatusText}</span>
                    </p>
                  </div>
                </div>

                <CTAButton
                  variant="secondary"
                  href="/alumni/profile"
                  className="whitespace-nowrap"
                >
                  Edit Profil
                </CTAButton>
              </div>

              <div className="mt-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Social Links</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">Instagram</p>
                    <p className="text-sm text-white/90 truncate">{profile?.instagram_url || "-"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">LinkedIn</p>
                    <p className="text-sm text-white/90 truncate">{profile?.linkedin_url || "-"}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Kartu Bawah Kiri (Kondisional) */}
            {isVerified ? (
              <GlassCard className="p-8">
                <h2 className="typo-card-title text-white mb-4">Pengalaman & Pekerjaan</h2>
                {experiences.length > 0 ? (
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                        <p className="font-semibold text-white">{exp.role_name}</p>
                        <p className="text-sm text-white/70">{exp.organization}</p>
                        <p className="text-xs text-white/50 mt-1">
                          {exp.start_year} - {exp.end_year || "Sekarang"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-white/50 mb-4">Belum ada pengalaman yang ditambahkan.</p>
                    <Link
                      href="/alumni/profile"
                      className="text-sm font-medium text-[#7dd3d3] hover:text-white transition-colors"
                    >
                      + Tambah Pengalaman
                    </Link>
                  </div>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-8">
                <h2 className="typo-card-title text-white mb-2">Ingin terhubung dengan alumni lain?</h2>
                <p className="text-sm text-white/60 mb-6 leading-relaxed max-w-xl">
                  Akun kamu belum memiliki akses fitur penuh Alumni Hub (seperti forum, sharing resource, dan posting). Jika
                  kamu adalah alumni, ajukan verifikasi sekarang.
                </p>
                <CTAButton
                  href="/verify-alumni"
                >
                  Gabung sebagai Alumni
                </CTAButton>
              </GlassCard>
            )}
          </div>

          {/* Kolom Kanan: Quick Actions */}
          <div className="space-y-4">
            {quickActions.map((item) => {
              if (isVerified) {
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group block transition hover:translate-y-[-4px]"
                  >
                    <GlassCard className="flex flex-col p-6 bg-white/5 hover:bg-white/10 transition-colors h-full">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#7dd3d3] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/50">{item.desc}</p>
                      <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                        BUKA
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </GlassCard>
                  </Link>
                );
              } else {
                return (
                  <GlassCard
                    key={item.title}
                    className="group flex flex-col p-6 bg-white/5 opacity-60"
                  >
                    <h3 className="text-xl font-bold text-white/50 flex items-center gap-2">
                      {item.title}
                      <Lock className="w-4 h-4 text-white/30" />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/30">{item.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/20">
                      BUTUH VERIFIED
                    </div>
                  </GlassCard>
                );
              }
            })}
          </div>
        </div>

        <ContentHistoryList userId={user.id} title="Riwayat Konten Saya" limit={true} />
      </div>
    </section>
  );
}