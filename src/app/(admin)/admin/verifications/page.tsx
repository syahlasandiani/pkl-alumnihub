import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

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

  if (status === "VERIFIED") {
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
    <main className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-admin.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/35" />

      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/15 hover:text-white"
            >
              ← Kembali ke Dashboard Admin
            </Link>

            <span className="rounded-full border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1 text-xs font-semibold text-[#c8ffff]">
              Admin Verifications
            </span>
          </div>

          <section className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex rounded-full border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1 text-xs font-semibold text-[#c8ffff]">
                  Verifikasi Alumni
                </div>

                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  Daftar Pengajuan Verifikasi
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
                  Tinjau pengajuan alumni, cek status terbaru, dan lanjutkan ke
                  detail review.
                </p>
              </div>

              <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-white">
                  Ringkasan Cepat
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-2xl font-semibold text-white">
                      {verificationRequests.length}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Total Pengajuan
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-2xl font-semibold text-white">
                      {pendingCount}
                    </p>
                    <p className="mt-1 text-sm text-white/60">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Antrian Pengajuan
                </h2>
                <p className="mt-1 text-sm text-white/70">
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
          </section>
        </div>
      </section>
    </main>
  );
}