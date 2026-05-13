"use client";

import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import GlassPill from "@/components/ui/GlassPill";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function GlassConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Ya",
  cancelLabel = "Tidak",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onCancel}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* modal */}
          <motion.div
            initial={{ y: 12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative w-full max-w-[440px]"
          >
            <GlassCard className="p-6">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{title}</h3>
                {message ? (
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">
                    {message}
                  </p>
                ) : null}

                <div className="mt-6 flex items-center justify-end gap-3">
                  <GlassPill type="button" onClick={onCancel}>
                    {cancelLabel}
                  </GlassPill>

                  <GlassPill
                    type="button"
                    onClick={onConfirm}
                    className="border-red-300/40 bg-red-500/15 text-red-100 hover:bg-red-500/20"
                  >
                    {confirmLabel}
                  </GlassPill>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}