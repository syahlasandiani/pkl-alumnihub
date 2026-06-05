"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import CTAButton from "@/components/ui/CTAButton";

export default function VerificationReviewPanel({
  requestId,
  currentStatus,
  initialAdminNote,
}: {
  requestId: string;
  currentStatus: string;
  initialAdminNote?: string | null;
}) {
  const router = useRouter();
  const [adminNote, setAdminNote] = useState(initialAdminNote || "");
  const [loadingAction, setLoadingAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isResolved =
    currentStatus === "VERIFIED" ||
    currentStatus === "APPROVED" ||
    currentStatus === "REJECTED";

  async function handleAction(action: "APPROVE" | "REJECT") {
    setLoadingAction(action);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/admin/verifications/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          adminNote,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Gagal memproses pengajuan.");
      }

      setSuccessMessage(result?.message || "Berhasil diproses.");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error?.message || "Terjadi kesalahan.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <GlassCard className="p-6">
      <h2 className="typo-card-title text-white">Aksi Review</h2>
      <p className="mt-2 text-sm text-white/70 typo-body">
        Setujui atau tolak pengajuan alumni ini.
      </p>

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        <CTAButton
          type="button"
          variant="success"
          disabled={isResolved || loadingAction !== null}
          loading={loadingAction === "APPROVE"}
          onClick={() => handleAction("APPROVE")}
          className="w-full"
        >
          Approve
        </CTAButton>

        <CTAButton
          type="button"
          variant="danger"
          disabled={isResolved || loadingAction !== null}
          loading={loadingAction === "REJECT"}
          onClick={() => handleAction("REJECT")}
          className="w-full"
        >
          Reject
        </CTAButton>
      </div>

      <div className="mt-5 rounded-[26px] border border-white/10 bg-white/5 p-5">
        <label className="block">
          <p className="mb-2 text-sm font-semibold text-white">
            Catatan Admin
          </p>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Tulis alasan review atau alasan penolakan."
            disabled={isResolved || loadingAction !== null}
            className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none disabled:opacity-60"
          />
        </label>
      </div>
    </GlassCard>
  );
}