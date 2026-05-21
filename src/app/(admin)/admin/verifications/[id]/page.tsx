import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import VerificationReviewPanel from "@/components/admin/VerificationReviewPanel";

type VerificationDetail = {
  id: string;
  user_id: string;
  full_name: string;
  intake_year: number;
  program: string;
  institution: string;
  document_url: string | null;
  status: string;
  submission_number: number;
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
};

function formatDateTime(dateString: string | null) {
  if (!dateString) return "-";

  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

export default async function AdminVerificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("verification_requests")
    .select(
      `
        id,
        user_id,
        full_name,
        intake_year,
        program,
        institution,
        status,
        submission_number,
        admin_note,
        created_at,
        reviewed_at,
        verification_documents(file_path)
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    notFound();
  }

  const rawItem = data as any;
  const item: VerificationDetail = {
    id: rawItem.id,
    user_id: rawItem.user_id,
    full_name: rawItem.full_name,
    intake_year: rawItem.intake_year,
    program: rawItem.program,
    institution: rawItem.institution,
    document_url: rawItem.verification_documents?.[0]?.file_path || null,
    status: rawItem.status,
    submission_number: rawItem.submission_number,
    admin_note: rawItem.admin_note,
    created_at: rawItem.created_at,
    reviewed_at: rawItem.reviewed_at,
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-admin.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/45 backdrop-[1px]" />

      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/admin/verifications"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/15 hover:text-white"
            >
              ← Kembali ke Verifications
            </Link>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>

          <section className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex rounded-full border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1 text-xs font-semibold text-[#c8ffff]">
                  Detail Verifikasi
                </div>

                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  {item.full_name}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
                  Tinjau detail pengajuan alumni, lalu lanjutkan ke proses approve
                  atau reject.
                </p>
              </div>

              <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-white">
                  Ringkasan Review
                </h2>
                <div className="mt-4 space-y-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    Pengajuan ke-{item.submission_number}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    Dibuat: {formatDateTime(item.created_at)}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    Direview: {formatDateTime(item.reviewed_at)}
                  </div>
                </div>
              </div>
            </div>
          </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">
            Data Pengajuan
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailField label="Nama Lengkap" value={item.full_name} />
            <DetailField
                label="Tahun Penerimaan"
                value={String(item.intake_year)}
            />
            <DetailField label="Program" value={item.program} />
            <DetailField label="Institusi / Kampus" value={item.institution} />
            <DetailField label="User ID" value={item.user_id} />
            <DetailField label="Status Saat Ini" value={item.status} />
            </div>

            <div className="mt-6 rounded-[26px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">Dokumen Bukti</p>
            {item.document_url ? (
              <a 
                href={item.document_url} 
                target="_blank" 
                rel="noreferrer" 
                className="mt-3 inline-flex items-center rounded-xl bg-[#7dd3d3]/20 px-4 py-2 text-sm font-medium text-[#c8ffff] transition hover:bg-[#7dd3d3]/30"
              >
                Buka Dokumen ↗
              </a>
            ) : (
              <p className="mt-2 text-sm text-white/50">Pengguna tidak melampirkan dokumen (pengajuan versi lama).</p>
            )}
            </div>

            <div className="mt-6 rounded-[26px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">
                Catatan Admin Saat Ini
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
                {item.admin_note || "Belum ada catatan admin."}
            </p>
            </div>
        </div>

        <VerificationReviewPanel
            requestId={item.id}
            currentStatus={item.status}
            initialAdminNote={item.admin_note}
        />
        </section>
        </div>
      </section>
    </main>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}