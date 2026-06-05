import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GlassPill from "@/components/ui/GlassPill";
import { Clock, Video, MapPin } from "lucide-react";

type Props = {
  title: string;
  date: string;
  time: string;
  mode: "Online" | "Offline";
  href: string;
  isOfficial?: boolean;
};

export default function EventPreviewCard({ title, date, time, mode, href, isOfficial }: Props) {
  return (
    <GlassCard className="p-5 relative overflow-hidden">
      {isOfficial && (
        <GlassPill as="div" className="absolute top-0 right-0 !rounded-none !rounded-bl-xl !bg-[#7dd3d3] !border-transparent !text-[#0f172a] text-[10px] font-bold uppercase tracking-wider px-3 py-1 z-10 shadow-sm hover:!bg-[#7dd3d3]">
          Official
        </GlassPill>
      )}
      <div className={`text-white typo-card-title ${isOfficial ? "pr-12" : ""}`}>{title}</div>

      <div className="mt-3 space-y-2 text-white/70 typo-body">
        <div>{date}</div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" /> {time}
        </div>
        <div className="flex items-center gap-2">
          {mode === "Online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
          {mode}
        </div>
      </div>

      <div className="mt-4">
        <Link href={href} className="text-white/85 hover:text-white typo-small font-medium">
          Lihat Detail
        </Link>
      </div>
    </GlassCard>
  );
}