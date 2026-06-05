"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

type CTAButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
};

export default function CTAButton({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  loading = false,
}: CTAButtonProps) {
  // Base classes for consistent layout and hover effects
  const baseClass = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  // Variant classes
  let variantClass = "";
  if (variant === "primary") {
    variantClass = "bg-[#7dd3d3] text-[#0f172a] hover:bg-[#6ec2c2] shadow-md shadow-[#7dd3d3]/10";
  } else if (variant === "secondary") {
    variantClass = "border border-white/15 bg-white/10 text-white/90 hover:bg-white/15 hover:text-white backdrop-blur-md";
  } else if (variant === "danger") {
    variantClass = "border border-rose-500/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/15";
  } else if (variant === "success") {
    variantClass = "border border-emerald-500/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15";
  }

  const combinedClasses = `${baseClass} ${variantClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={onClick as any}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-1.5">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Memproses...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
