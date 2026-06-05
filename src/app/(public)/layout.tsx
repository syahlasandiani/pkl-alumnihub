import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import LayoutBackground from "@/components/ui/LayoutBackground";

// kalo bg nya terang
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <LayoutBackground />

      <Header />

      <main className="pt-28">{children}</main>

      <Footer />
    </div>
  );
}