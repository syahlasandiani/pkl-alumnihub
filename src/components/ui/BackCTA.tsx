"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

type Props = {
  /** Kalau diisi, BackCTA jadi link */
  href?: string;
  /** Kalau diisi, BackCTA jadi button */
  onClick?: () => void;
  /** Default: "Kembali" */
  label?: string;
  className?: string;
};

export default function BackCTA({
  href,
  onClick,
  label = "Kembali",
  className = "",
}: Props) {
  const router = useRouter();

  const base =
    "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-white/90 hover:bg-white/15 transition";

  // Prioritas: onClick -> href -> router.back()
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${className}`}>
        <ChevronLeft className="h-4 w-4" />
        {label}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        <ChevronLeft className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`${base} ${className}`}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </button>
  );
}