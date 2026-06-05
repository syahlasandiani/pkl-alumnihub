import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import GlassCard from "@/components/ui/GlassCard";
import CTAButton from "@/components/ui/CTAButton";

type VerificationRequestRow = {
  id: string;
  full_name: string;
  intake_year: number;
  program: string;
  institution: string;
  status: string;
  submission_number: number;
  admin_note: string | null;
  created_at: string;
};

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

function getStatusBadge(status: string) {
  if (status === "PENDING") {
    return "border-amber-300/20 bg-amber-300/10 text-amber-100";
  }

  if (status === "VERIFIED" || status === "APPROVED") {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-100";
  }

  if (status === "REJECTED") {
    return "border-rose-300/20 bg-rose-300/10 text-rose-100";
  }

  return "border-white/10 bg-white/10 text-white/80";
}

export default async function AdminVerificationsPage() {
  const supabase = await createServerClient();

  const { data: requests, error } = await supabase
    .from("verification_requests")
    .select(
      `
        id,
        full_name,
        intake_year,
        program,
        institution,
        status,
        submission_number,
        admin_note,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  const verificationRequests = (requests ?? []) as VerificationRequestRow[];

  const pendingCount = verificationRequests.filter(
    (item) => item.status === "PENDING"
  ).length;

  return (
    <div className="w-full">
      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <CTAButton
              variant="secondary"
              href="/admin"
            >
              ← Kembali ke Dashboard Admin
            </CTAButton>

            <span className="rounded-full border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1 text-xs font-semibold text-[#c8ffff]">
              Admin Verifications
            </span>
          </div>

          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex rounded-full border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1 text-xs font-semibold text-[#c8ffff]">
                  Verifikasi Alumni
                </div>

                <h1 className="typo-section-title text-white">
                  Daftar Pengajuan Verifikasi
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-white/70 typo-body">
                  Tinjau pengajuan alumni, cek status terbaru, dan lanjutkan ke
                  detail review.
                </p>
              </div>

              <div className="w-full max-w-sm rounded-[24px] border border-white/10 bg-white/5 p-5 text-center">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/45">
                  Ringkasan Cepat
                </h2>
                <div className="mt-3">
                  <p className="text-4xl font-extrabold text-[#c8ffff]">
                    {pendingCount}
                  </p>
                  <p className="mt-1 text-xs text-white/60">Pengajuan Pending</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="mt-6 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="typo-card-title text-white">
                  Antrian Pengajuan
                </h2>
                <p className="mt-1 text-sm text-white/70 typo-body">
                  Klik salah satu item untuk melihat detail verifikasi.
                </p>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                Gagal memuat data pengajuan: {error.message}
              </div>
            ) : null}

            {!error && verificationRequests.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-white/70">
                Belum ada pengajuan verifikasi.
              </div>
            ) : null}

            {!error ? (
              <div className="mt-4 space-y-3">
                {verificationRequests.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/verifications/${item.id}`}
                    className="block rounded-[26px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-base font-semibold text-white">
                            {item.full_name}
                          </p>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-white/70">
                          {item.program} • {item.institution}
                        </p>

                        <p className="mt-1 text-sm text-white/55">
                          Tahun masuk {item.intake_year} • Pengajuan ke-
                          {item.submission_number}
                        </p>

                        {item.admin_note ? (
                          <p className="mt-2 line-clamp-2 text-sm text-white/55">
                            Catatan admin: {item.admin_note}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs text-white/50">
                          {formatDate(item.created_at)}
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#c8ffff]">
                          Lihat Detail →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </GlassCard>
        </div>
      </section>
    </div>
  );
}