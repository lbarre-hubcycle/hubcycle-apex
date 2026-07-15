import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Apex — the Performance Intelligence Platform by Hubcycle",
  description:
    "Assess natural contribution styles, culture alignment, role match and team dynamics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
