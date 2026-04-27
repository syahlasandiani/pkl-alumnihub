import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import Script from "next/script";

export const metadata = {
  title: "Website Alumni Hub Beasiswa Unggulan",
  description: "Platform resmi untuk alumni Beasiswa Unggulan: direktori alumni, pembelajaran, dan kolaborasi komunitas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans antialiased bg-white text-gray-800">
        <AuthProvider>{children}</AuthProvider>
      </body>

      <Script src="https://code.highcharts.com/maps/highmaps.js" strategy="afterInteractive" />
      <Script src="https://code.highcharts.com/maps/modules/exporting.js" strategy="afterInteractive" />
      <Script src="https://code.highcharts.com/mapdata/countries/id/id-all.js" strategy="afterInteractive" />
    </html>
  );
}