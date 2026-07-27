import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu, Amiri, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { PortalSettingsProvider } from "@/lib/settings/context";
import { ThemeProvider } from "@/lib/theme/context";
import { Toaster } from "sonner";

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nastaliq",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "الحکمہ مدرسہ و سکول مینجمنٹ سسٹم | Al-Hikmah System",
  description: "Bilingual (Urdu / English) Free-to-Host School and Madrasa Management Portal with RTL Support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" dir="rtl" className={`${notoNastaliq.variable} ${amiri.variable} ${inter.variable} ${outfit.variable}`}>
      <body className="font-ur bg-background text-foreground antialiased min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <PortalSettingsProvider>
            <LanguageProvider>
              {children}
              <Toaster position="top-center" richColors closeButton />
            </LanguageProvider>
          </PortalSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

