"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    currentStatus === "VERIFIED" || currentStatus === "REJECTED";

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
    <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-semibold text-white">Aksi Review</h2>
      <p className="mt-2 text-sm text-white/70">
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
        <button
          type="button"
          disabled={isResolved || loadingAction !== null}
          onClick={() => handleAction("APPROVE")}
          className="w-full rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 disabled:opacity-50"
        >
          {loadingAction === "APPROVE" ? "Memproses..." : "Approve"}
        </button>

        <button
          type="button"
          disabled={isResolved || loadingAction !== null}
          onClick={() => handleAction("REJECT")}
          className="w-full rounded-full border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/15 disabled:opacity-50"
        >
          {loadingAction === "REJECT" ? "Memproses..." : "Reject"}
        </button>
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
    </div>
  );
}