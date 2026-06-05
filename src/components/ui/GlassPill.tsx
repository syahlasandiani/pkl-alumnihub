import React from "react";

type Props<T extends React.ElementType> = {
  active?: boolean;
  as?: T;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export default function GlassPill<T extends React.ElementType = "button">({
  active,
  as,
  className = "",
  ...props
}: Props<T>) {
  const Component = as || "button";
  return (
    <Component
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition",
        "border-white/20 bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/15",
        active ? "bg-white/20 text-white border-white/30" : "",
        className,
      ].join(" ")}
    />
  );
}