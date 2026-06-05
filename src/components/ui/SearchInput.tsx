"use client";

import { Search } from "lucide-react";
import React from "react";

type Props = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  value,
  defaultValue,
  onChange,
  placeholder = "Cari...",
  className = "",
}: Props) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md ${className}`}
    >
      <Search className="h-4 w-4 text-white/70" />
      <input
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-white placeholder:text-white/50 outline-none text-sm"
      />
    </div>
  );
}