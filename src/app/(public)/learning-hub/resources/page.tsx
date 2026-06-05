import { getResources } from "@/lib/data/resources";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";
import { FileText, Download, FileArchive, File as FileIcon } from "lucide-react";
import BackCTA from "@/components/ui/BackCTA";
import SearchInput from "@/components/ui/SearchInput";
import GlassPill from "@/components/ui/GlassPill";

export default async function ResourcesPage() {
  const resources = await getResources();

  const getFileIcon = (type: string | undefined) => {
    const t = type?.toLowerCase();
    if (t === 'pdf') return <FileText className="h-10 w-10 text-red-400" />;
    if (t === 'zip' || t === 'rar') return <FileArchive className="h-10 w-10 text-amber-400" />;
    return <FileIcon className="h-10 w-10 text-[#7dd3d3]" />;
  };

  const formatSize = (bytes: number | undefined) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <main className="min-h-screen pb-24 relative">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-8">
          <BackCTA href="/learning-hub" />
        </div>
        <SectionHeading 
          title="Resources & Dokumen Alumni"
          subtitle="Kumpulan dokumen, template, dan materi pembelajaran yang dibagikan oleh alumni untuk komunitas."
          align="left"
        />

        {/* Filter & Search Bar */}
        <div className="mt-10 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <SearchInput placeholder="Cari resource..." className="w-full py-3" />
          </div>
          <div className="flex gap-2">
             {['Semua', 'PDF', 'Doc', 'Zip'].map(tab => (
               <GlassPill 
                 key={tab} 
                 active={tab === 'Semua'}
                 className={tab === 'Semua' ? '!bg-[#7dd3d3] !text-[#0f172a] !border-transparent font-bold' : ''}
               >
                 {tab}
               </GlassPill>
             ))}
          </div>
        </div>

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <GlassCard key={res.id} className="group flex flex-col p-7 transition hover:bg-white/10 relative overflow-hidden">
                {res.profiles?.role === "ADMIN" && (
                  <GlassPill as="div" className="absolute top-0 right-0 !rounded-none !rounded-bl-xl !bg-[#7dd3d3] !border-transparent !text-[#0f172a] text-[10px] font-bold uppercase tracking-wider px-3 py-1 z-10 shadow-sm hover:!bg-[#7dd3d3]">
                    Official
                  </GlassPill>
                )}
                <div className="mb-6 flex items-start justify-between mt-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-transform group-hover:scale-110">
                    {getFileIcon(res.file_type)}
                  </div>
                  <div className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {res.file_type || 'FILE'}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-[#7dd3d3] transition-colors">
                    {res.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50 line-clamp-2">
                    {res.description || "Tidak ada deskripsi tambahan untuk resource ini."}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ukuran File</p>
                    <p className="text-sm font-semibold text-white/70">{formatSize(res.file_size)}</p>
                  </div>
                  
                  <a 
                    href={res.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7dd3d3] text-[#0f172a] shadow-lg shadow-[#7dd3d3]/20 transition hover:bg-[#6ec2c2] hover:scale-110 active:scale-95"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="rounded-[40px] border border-white/5 bg-white/5 p-20 text-center backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5">
              <FileIcon className="h-10 w-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white">Belum ada Resource</h3>
            <p className="mt-2 text-white/40">Jadilah alumni pertama yang membagikan materi pembelajaran!</p>
          </div>
        )}
      </div>
    </main>
  );
}
