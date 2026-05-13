import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Background - sama persis dengan public layout */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-bg.jpg)" }}
      />

      {/* Overlay - sama persis dengan public layout */}
      <div className="fixed inset-0 -z-10 bg-black/35" />

      <Header />

      <main className="pt-28">{children}</main>

      <Footer />
    </div>
  );
}
