import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { Clock, Video, MapPin } from "lucide-react";

type Props = {
  title: string;
  date: string;
  time: string;
  mode: "Online" | "Offline";
  href: string;
};

export default function EventPreviewCard({ title, date, time, mode, href }: Props) {
  return (
    <GlassCard className="p-5">
      <div className="text-white font-semibold leading-snug">{title}</div>

      <div className="mt-3 space-y-2 text-white/70 text-sm">
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
        <Link href={href} className="text-white/85 hover:text-white text-sm font-medium">
          Lihat Detail
        </Link>
      </div>
    </GlassCard>
  );
}