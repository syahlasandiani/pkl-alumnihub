import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Image from "next/image";

// kalo bg nya gelap
// export default function PublicLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative min-h-screen">
//       {/* Background GLOBAL (nempel full layar) */}
//       <Image
//         src="/assets/backgrounds/beranda1-bg.png"
//         alt="Background"
//         fill
//         priority
//         className="fixed inset-0 -z-10 object-cover blur-sm brightness-25"
//       />

//       <Header />

//       {/* kasih ruang biar konten gak ketiban header */}
//       <main className="pt-28">{children}</main>

//       <Footer />
//     </div>
//   );
// }

// kalo bg nya terang
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-bg.jpg)" }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 -z-10 bg-black/35" />

      <Header />

      <main className="pt-28">{children}</main>

      <Footer />
    </div>
  );
}