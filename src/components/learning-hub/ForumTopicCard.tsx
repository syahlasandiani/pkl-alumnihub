import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { Tag, Clock3 } from "lucide-react";

type Props = {
  title: string;
  tag: string;
  meta: string;
  href: string;
};

export default function ForumTopicCard({ title, tag, meta, href }: Props) {
  return (
    <GlassCard className="p-5">
      <div className="text-white font-semibold">{title}</div>

      <div className="mt-3 space-y-2 text-white/70 text-sm">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" /> {tag}
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" /> {meta}
        </div>
      </div>

      <Link href={href} className="mt-4 inline-flex text-white/85 hover:text-white text-sm font-medium">
        Buka
      </Link>
    </GlassCard>
  );
}