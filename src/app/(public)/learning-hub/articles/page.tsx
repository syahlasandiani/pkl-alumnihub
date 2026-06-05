import { getArticles } from "@/lib/data/articles";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import BackCTA from "@/components/ui/BackCTA";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen pb-24 relative">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-8">
          <BackCTA href="/learning-hub" />
        </div>
        <SectionHeading 
          title="Konten Unggulan"
          subtitle="Temukan kisah inspiratif, tips, dan update terbaru dari dunia alumni Beasiswa Unggulan."
          align="left"
        />

        {articles.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <Link key={art.id} href={`/learning-hub/articles/${art.id}`} className="group block">
                <GlassCard className="h-full overflow-hidden flex flex-col transition-all duration-500 hover:translate-y-[-8px] hover:bg-white/10 relative">
                  {art.profiles?.role === 'ADMIN' && (
                    <div className="absolute top-4 left-4 bg-[#7dd3d3] text-[#0f172a] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full z-10 shadow-sm backdrop-blur-md">
                      Official
                    </div>
                  )}
                  {/* Cover Image */}
                  <div className="aspect-[16/10] overflow-hidden bg-white/5 relative">
                    {art.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={art.cover_url} 
                        alt={art.title} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/10 font-bold text-2xl">
                        NO COVER
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Content */}
                  <div className="p-7 flex flex-col flex-1">
                    <div className="mb-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-[#7dd3d3]" />
                        {new Date(art.published_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-[#7dd3d3] transition-colors">
                      {art.title}
                    </h3>

                    <p className="text-sm text-white/50 line-clamp-3 mb-6 flex-1">
                      {art.content}
                    </p>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <User className="h-3 w-3" />
                        {art.author_name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#7dd3d3] opacity-0 group-hover:opacity-100 transition-opacity">
                        Baca Selengkapnya
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-20 rounded-[40px] border border-white/5 bg-white/5 p-24 text-center backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white">Belum Ada Artikel</h3>
            <p className="mt-2 text-white/40">Bagikan kisah inspiratifmu sekarang juga!</p>
          </div>
        )}
      </div>
    </main>
  );
}
