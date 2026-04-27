// src/components/content/Hero.tsx
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";

const pedoman = [
  {
    title: "Masyarakat Berprestasi",
    image: "/assets/content/mapres.jpg",
    href: "/assets/pedoman/PEDOMAN-BU-MAPRES-2025.pdf",
  },
  {
    title: "Pegawai Kemendikdasmen",
    image: "/assets/content/pegawai.jpg",
    href: "/assets/pedoman/PEDOMAN-BU-PEGAWAI-2025.pdf",
  },
];

export default function Hero() {
  return (
    <section id="beranda" className="px-6 scroll-mt-32 min-h-[calc(100vh-96px)] flex items-center">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
          {/* LEFT */}
          <div className="flex-1 min-w-0">
            <h1 className="typo-hero-title text-white leading-[1.02]">
              Beasiswa Unggulan
            </h1>

            <h2 className="mt-3 typo-hero-subtitle text-white/85 leading-tight">
              Jejaring Alumni, Kolaborasi, dan Pembelajaran Berkelanjutan
            </h2>

            <p className="mt-8 max-w-2xl typo-body-lg text-white/70">
              BU Alumni Hub merupakan platform komunitas dan jejaring alumni Beasiswa Unggulan 
              yang dirancang untuk mempertemukan para awardee dan alumni dalam satu ekosistem kolaboratif. 
              Melalui platform ini, alumni dapat saling terhubung, berbagi pengalaman dan pengetahuan,
              mengembangkan jejaring profesional, serta berpartisipasi dalam berbagai kegiatan dan diskusi 
              yang memberikan manfaat bagi alumni maupun calon penerima Beasiswa Unggulan.
            </p>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[460px] lg:shrink-0 lg:self-start">
            <GlassCard className="backdrop-blur-xl overflow-hidden">
              <div className="p-5">
                <p className="text-white font-semibold text-lg">
                  Pedoman Beasiswa Unggulan
                </p>
              </div>

              <div className="px-5 pb-5 space-y-4">
                {pedoman.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-2xl border border-white/10"
                  >
                    <div className="relative w-full aspect-[16/6]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/15" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                      <span className="text-white font-semibold text-xl drop-shadow">
                        {item.title}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}