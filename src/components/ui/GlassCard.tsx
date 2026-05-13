// src/components/ui/GlassCard.tsx
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  // Base class = jangan diubah biar UI tetap sama
  const base = "rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md";

  return <div className={`${base} ${className}`}>{children}</div>;
}