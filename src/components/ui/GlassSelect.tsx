// src/components/ui/GlassSelect.tsx
import { ChevronDown } from "lucide-react";

type Option = { label: string; value: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
};

export default function GlassSelect({
  value,
  onChange,
  options,
  className = "",
  ariaLabel,
}: Props) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "appearance-none",
          "rounded-full",
          "border border-white/15",
          "bg-white/10",
          "backdrop-blur-md",
          "text-white/90",
          "text-sm",
          "px-4 py-2 pr-10",
          "outline-none",
          "focus:ring-2 focus:ring-white/25",
          "hover:bg-white/15",
          "transition",
        ].join(" ")}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0b0f14] text-white">
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
      />
    </div>
  );
}