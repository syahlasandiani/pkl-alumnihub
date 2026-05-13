import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export default function GlassPill({ active, className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
        "border-white/20 bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/15",
        active ? "bg-white/20 text-white border-white/30" : "",
        className,
      ].join(" ")}
    />
  );
}