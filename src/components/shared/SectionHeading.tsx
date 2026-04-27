// src/components/home/SectionHeading.tsx
type Props = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ title, subtitle, align = "left" }: Props) {
  if (align === "center") {
    return (
      <div className="text-center">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="typo-section-title text-white">{title}</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="mt-4 mx-auto w-full max-w-4xl relative">
          <div className="h-px bg-white/15" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-[1px] h-[3px] w-28 rounded-full bg-white/80" />
        </div>

        {subtitle ? <p className="mt-4 typo-body text-white/70">{subtitle}</p> : null}
      </div>
    );
  }

  return (
    <div>
      <h2 className="typo-section-title text-white">{title}</h2>

      <div className="mt-4 w-full max-w-4xl relative">
        <div className="h-px bg-white/15" />
        <div className="absolute left-0 -top-[1px] h-[3px] w-28 rounded-full bg-white/80" />
      </div>

      {subtitle ? <p className="mt-4 typo-body text-white/70">{subtitle}</p> : null}
    </div>
  );
}