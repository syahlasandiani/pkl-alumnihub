import { notFound } from "next/navigation";
import { getArticleDetail } from "@/lib/data/articles";
import Link from "next/link";
import { Calendar, User, ChevronLeft } from "lucide-react";

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleDetail(id);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-24 relative">
      <div className="mx-auto max-w-4xl px-6 pt-10">
        <Link 
          href="/learning-hub/articles" 
          className="group mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[#7dd3d3] transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Konten Unggulan
        </Link>

        {/* Cover Image Header */}
        <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-2xl">
          {article.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={article.cover_url} 
              alt={article.title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/5 font-black text-6xl">
              KONTEN
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Article Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-[0.3em] text-[#7dd3d3]">
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(article.published_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2 text-white/40">
                <User className="h-3.5 w-3.5" />
                {article.author_name}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed text-white/70">
              {article.content}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
