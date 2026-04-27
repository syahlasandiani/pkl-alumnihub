"use client";

import * as React from "react";
import { createPortal } from "react-dom";

type Tone = "info" | "success" | "danger";

type Props = {
  open: boolean;
  tone?: Tone;
  title: string;
  message: React.ReactNode;
  ctaLabel?: string;
  onClose: () => void;
};

function toneStyles(tone: Tone) {
  // muted glass vibes (nggak norak)
  if (tone === "success") {
    return {
      badge: "bg-emerald-400/15 text-emerald-100 border-emerald-300/20",
      ring: "ring-emerald-300/20",
    };
  }
  if (tone === "danger") {
    return {
      badge: "bg-rose-400/15 text-rose-100 border-rose-300/20",
      ring: "ring-rose-300/20",
    };
  }
  return {
    badge: "bg-sky-400/15 text-sky-100 border-sky-300/20",
    ring: "ring-sky-300/20",
  };
}

export default function GlassDialog({
  open,
  tone = "info",
  title,
  message,
  ctaLabel = "Oke",
  onClose,
}: Props) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const t = toneStyles(tone);

  const node = (
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <button
        aria-label="Tutup dialog"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
        type="button"
      />

      {/* center wrapper */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          className={[
            "w-full max-w-md rounded-3xl border border-white/15",
            "bg-white/10 backdrop-blur-2xl shadow-2xl",
            "p-6 text-white ring-1",
            t.ring,
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* ada tulisan gagal warna merah
              <div
                className={[
                  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                  t.badge,
                ].join(" ")}
              >
                {tone === "success"
                  ? "Sukses"
                  : tone === "danger"
                  ? "Gagal"
                  : "Info"}
              </div> */}

              <div className="mt-3 text-lg font-semibold leading-tight">
                {title}
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm leading-relaxed text-white/80">
            {message}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="h-10 px-5 rounded-2xl border border-white/15 bg-white/15 hover:bg-white/20 transition text-sm font-medium"
              type="button"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}