"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import BackCTA from "@/components/ui/BackCTA";

export type VerifyState = "NONE" | "PENDING" | "REJECTED";

type VerifyAlumniPageClientProps = {
  initialState: VerifyState;
  initialFullName?: string;
  initialIntakeYear?: string;
  initialProgram?: string;
  initialInstitution?: string;
  adminNote?: string | null;
};

export default function VerifyAlumniPageClient({
  initialState,
  initialFullName = "",
  initialIntakeYear = "",
  initialProgram = "",
  initialInstitution = "",
  adminNote,
}: VerifyAlumniPageClientProps) {
  const [viewState, setViewState] = useState<VerifyState>(initialState);

  const [fullName, setFullName] = useState(initialFullName);
  const [intakeYear, setIntakeYear] = useState(initialIntakeYear);
  const [program, setProgram] = useState(initialProgram);
  const [institution, setInstitution] = useState(initialInstitution);
  const [documentName, setDocumentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pageMeta = useMemo(() => {
    if (viewState === "PENDING") {
      return {
        title: "Status Verifikasi Alumni",
        subtitle:
          "Pengajuanmu sedang ditinjau admin. Selama menunggu, akunmu tetap aktif sebagai Public User.",
      };
    }

    if (viewState === "REJECTED") {
      return {
        title: "Pengajuan Perlu Diperbarui",
        subtitle:
          "Pengajuanmu ditolak. Kamu masih bisa mengajukan ulang dengan data dan dokumen yang diperbarui.",
      };
    }

    return {
      title: "Ajukan Verifikasi Alumni",
      subtitle:
        "Lengkapi data dasar dan unggah bukti agar akunmu bisa mendapatkan akses Alumni Hub.",
    };
  }, [viewState]);

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!documentFile) {
        throw new Error("Dokumen bukti wajib diunggah.");
      }

      // Upload file ke storage
      const fileExt = documentFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('verification_documents')
        .upload(filePath, documentFile);

      if (uploadError) {
        throw new Error("Gagal mengunggah dokumen: " + uploadError.message);
      }

      // Dapatkan public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification_documents')
        .getPublicUrl(filePath);

      const response = await fetch("/api/verify-alumni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          intakeYear,
          program,
          institution,
          documentUrl: publicUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Gagal mengirim pengajuan.");
      }

      setSuccessMessage(result?.message || "Pengajuan berhasil dikirim.");
      setViewState("PENDING");
    } catch (error: any) {
      setErrorMessage(error?.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetToForm() {
    setViewState("NONE");
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-5xl w-full pt-6 pb-24">
        {/* Back CTA */}
        <BackCTA href="/alumni" label="Kembali" className="mb-6" />

        {/* Form Card */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            {viewState === "NONE" && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {pageMeta.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    {pageMeta.subtitle}
                  </p>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
                    {successMessage}
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Nama Lengkap*"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Masukkan nama lengkap"
                  />
                  <Field
                    label="Tahun Penerimaan*"
                    value={intakeYear}
                    onChange={setIntakeYear}
                    placeholder="Contoh: 2022"
                    type="number"
                  />
                  <Field
                    label="Program*"
                    value={program}
                    onChange={setProgram}
                    placeholder="Contoh: Beasiswa Unggulan"
                  />
                  <Field
                    label="Institusi / Kampus*"
                    value={institution}
                    onChange={setInstitution}
                    placeholder="Masukkan institusi"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm text-white/85">
                    Dokumen Bukti*
                  </p>
                  <label className="flex min-h-[180px] cursor-pointer items-center justify-center rounded-[26px] border border-dashed border-white/15 bg-white/5 text-center transition hover:bg-white/10">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setDocumentFile(file);
                        setDocumentName(file?.name || "");
                      }}
                    />
                    <div>
                      <p className="text-base text-white/90">
                        Klik untuk pilih file
                      </p>
                      <p className="mt-2 text-sm text-white/50">
                        Sertifikat, surat penetapan, atau email resmi
                      </p>
                      {documentName ? (
                        <p className="mt-3 text-sm font-medium text-[#c8ffff]">
                          {documentName}
                        </p>
                      ) : null}
                    </div>
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Link
                    href="/alumni"
                    className="rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/15 hover:text-white"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/15 disabled:opacity-60"
                  >
                    {submitting ? "Mengirim..." : "Ajukan Verifikasi"}
                  </button>
                </div>
              </form>
            )}

            {viewState === "PENDING" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Status: Pending
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    Pengajuanmu sudah diterima dan sedang menunggu review dari
                    admin.
                  </p>
                </div>

                <StatusCard
                  title="Dokumen sedang ditinjau"
                  description="Kamu tidak perlu mengirim ulang selama status masih pending."
                />
                <StatusCard
                  title="Akses akun saat ini"
                  description="Kamu tetap bisa menggunakan akunmu sebagai Public User."
                />
                <StatusCard
                  title="Setelah disetujui"
                  description="Akunmu akan mendapat akses ke dashboard alumni, event, resource, dan konten."
                />

                <div className="flex justify-end">
                  <Link
                    href="/alumni"
                    className="rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/15 hover:text-white"
                  >
                    Kembali ke Dashboard
                  </Link>
                </div>
              </div>
            )}

            {viewState === "REJECTED" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Status: Rejected
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    Pengajuanmu belum bisa disetujui. Silakan cek catatan admin
                    lalu ajukan ulang.
                  </p>
                </div>

                <div className="rounded-[26px] border border-rose-300/20 bg-rose-300/10 p-5">
                  <p className="text-sm font-semibold text-rose-100">
                    Catatan Admin
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-rose-50/85">
                    {adminNote ||
                      "Dokumen pendukung belum cukup jelas. Silakan unggah bukti yang lebih valid atau lengkap."}
                  </p>
                </div>

                <StatusCard
                  title="Hak akses akun saat ini"
                  description="Kamu tetap punya akses sebagai Public User."
                />
                <StatusCard
                  title="Ajukan ulang"
                  description="Perbarui data atau unggah bukti yang lebih sesuai, lalu kirim ulang pengajuan."
                />

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Link
                    href="/alumni"
                    className="rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/15 hover:text-white"
                  >
                    Nanti Saja
                  </Link>
                  <button
                    type="button"
                    onClick={resetToForm}
                    className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/15"
                  >
                    Ajukan Ulang
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">
              Bantuan Singkat
            </h2>
            <div className="mt-4 space-y-3">
              <InfoItem
                title="Siapa yang boleh mengajukan?"
                desc="User login yang belum verified."
              />
              <InfoItem
                title="Dokumen yang bisa dipakai"
                desc="Sertifikat, surat penetapan, atau email resmi yang relevan."
              />
              <InfoItem
                title="Kalau ditolak?"
                desc="Kamu masih bisa memperbarui data dan mengajukan ulang."
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm text-white/85">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-xl"
      />
    </label>
  );
}

function StatusCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{description}</p>
    </div>
  );
}

function InfoItem({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-white/70">{desc}</p>
    </div>
  );
}