// src/components/home/FaqSection.tsx
import SectionHeading from "@/components/shared/SectionHeading";

const faqA = {
  title: "FAQ Beasiswa Unggulan Masyarakat Berprestasi & Penyandang Disabilitas",
  items: [
    { q: "Apa itu Afirmasi Pendidikan Menengah ?", a: "Isi jawaban sesuai dokumen resmi (placeholder dulu)." },
    {
      q: "Siapa saja yang dapat menerima Beasiswa Unggulan?",
      a: "Masyarakat Berprestasi: memiliki prestasi akademik/non-akademik tingkat nasional/internasional.\nPenyandang Disabilitas: mahasiswa disabilitas fisik, intelektual, mental, atau sensorik.",
    },
    { q: "Bagaimana cara mendaftar?", a: "Isi alur pendaftaran singkat + arahkan ke halaman info resmi." },
  ],
};

const faqB = {
  title: "FAQ Beasiswa Unggulan Pegawai Kemendikdasmen",
  items: [
    { q: "Apa tujuan utama Beasiswa Unggulan bagi Pegawai KEMENDIKDASMEN?", a: "Isi jawaban (placeholder dulu)." },
    {
      q: "Siapa yang menjadi pemberi bantuan Beasiswa Unggulan ini?",
      a: "Beasiswa diberikan oleh Pusat Layanan Pembiayaan Pendidikan (Puslapdik), Kemendikdasmen.",
    },
    { q: "Bagaimana cara mendaftar?", a: "Isi alur pendaftaran singkat + link info resmi." },
  ],
};

function FaqBlock({
  title,
  items,
}: {
  title: string;
  items: { q: string; a: string }[];
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 md:p-8">
      <div className="text-white font-semibold">{title}</div>

      <div className="mt-4 space-y-3">
        {items.map((it, i) => {
          const no = String(i + 1).padStart(2, "0");
          return (
            <details
              key={it.q}
              className="group rounded-2xl border border-white/10 bg-white/5 px-5 py-4 open:bg-white/10 transition"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-white/70 font-medium w-10 shrink-0">{no}</div>
                  <div className="text-white font-medium">{it.q}</div>
                </div>
                <div className="text-white/70 text-xl group-open:rotate-45 transition-transform">+</div>
              </summary>

              <div className="mt-3 pl-14 text-sm leading-relaxed text-white/70 whitespace-pre-line">
                {it.a}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section id="faq" className="px-6 py-24 md:py-32 scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Frequently Asked Questions" align="center" />

        <div className="mt-8 space-y-6">
          <FaqBlock title={faqA.title} items={faqA.items} />
          <FaqBlock title={faqB.title} items={faqB.items} />
        </div>
      </div>
    </section>
  );
}