import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export default function HubCard({
  title,
  description,
  href,
  icon: Icon,
}: Props) {
  return (
    <Link href={href} className="group block">
      <GlassCard className="p-6 transition hover:bg-white/15">
      {/* ICON + TITLE */}
      <div className="flex items-start gap-4">
        {/* PERFECT CIRCLE WRAPPER */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
          <Icon className="h-5 w-5 text-white/85" />
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg">
            {title}
          </h3>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-4 text-white/70 text-sm leading-relaxed">
        {description}
      </p>

      {/* CTA */}
      <div className="mt-6 flex items-center text-white/80 font-medium text-sm group-hover:text-white transition">
        <span>Buka</span>
        <span className="ml-2 transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
      </GlassCard>
    </Link>
  );
}
