import LayoutBackground from "@/components/ui/LayoutBackground";

export default function AdminRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <LayoutBackground isAdmin={true} />
      {children}
    </div>
  );
}
