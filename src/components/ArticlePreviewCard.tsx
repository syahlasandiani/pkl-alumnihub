import Link from "next/link";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";

type Props = {
  title: string;
  category: string;
  href: string;
  cover: string;
};

export default function ArticlePreviewCard({ title, category, href, cover }: Props) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="relative w-full aspect-[16/9]">
        <Image src={cover} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <div className="p-5">
        <div className="text-white/70 text-xs">{category}</div>
        <div className="mt-2 text-white font-semibold leading-snug">{title}</div>

        <Link
          href={href}
          className="mt-4 inline-flex text-white/85 hover:text-white text-sm font-medium"
        >
          Lihat Selengkapnya
        </Link>
      </div>
    </GlassCard>
  );
}