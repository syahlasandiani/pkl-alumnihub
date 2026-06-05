import Link from "next/link";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import GlassPill from "@/components/ui/GlassPill";

type Props = {
  title: string;
  category: string;
  href: string;
  cover: string;
  isOfficial?: boolean;
};

export default function ArticlePreviewCard({ title, category, href, cover, isOfficial }: Props) {
  return (
    <GlassCard className="overflow-hidden relative">
      {isOfficial && (
        <GlassPill as="div" className="absolute top-4 left-4 !bg-[#7dd3d3] !border-transparent !text-[#0f172a] text-[10px] font-bold uppercase tracking-wider px-3 py-1 z-10 shadow-sm hover:!bg-[#7dd3d3]">
          Official
        </GlassPill>
      )}
      <div className="relative w-full aspect-[16/9]">
        <Image src={cover} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <div className="p-5">
        <div className="text-white/70 typo-small">{category}</div>
        <div className="mt-2 text-white typo-card-title">{title}</div>

        <Link
          href={href}
          className="mt-4 inline-flex text-white/85 hover:text-white typo-small font-medium"
        >
          Lihat Selengkapnya
        </Link>
      </div>
    </GlassCard>
  );
}