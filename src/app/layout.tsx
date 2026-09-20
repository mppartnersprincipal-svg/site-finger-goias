import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Open_Sans, Source_Serif_4 } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { JsonLd } from "@/components/ui/JsonLd";
import { LogoSprite } from "@/components/ui/Logo";
import { site } from "@/content/site";
import { storeLd } from "@/lib/seo/jsonld";
import "./globals.css";

// Fontes do DS, self-hosted pelo next/font (o tokens/fonts.css do DS usa @import do Google: não copiar).
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });
// Corpo em serifa: pesos estáticos (só baixa o arquivo do peso/estilo realmente usado na página) e
// sem preload, para o caminho crítico ficar com o pôster do hero e a Open Sans dos títulos.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
  preload: false,
});
// Ephesis aparece em uma palavra por tela. O arquivo do Google pesa 51 KB; este é um subset com o
// alfabeto pt-BR (16 KB), gerado com fonttools a partir do TTF oficial (licença OFL em src/fonts).
const ephesis = localFont({
  src: "../fonts/ephesis-ptbr.woff2",
  weight: "400",
  variable: "--font-ephesis",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Móveis planejados em Goiânia`, template: `%s | ${site.shortName}` },
  description: site.description,
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#FFFCF2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${openSans.variable} ${sourceSerif.variable} ${ephesis.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only rounded-full bg-dark-eerie px-4 py-3 font-heading text-sm font-semibold text-neutral-floral focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          Pular para o conteúdo
        </a>
        <LogoSprite />
        <Navbar />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <MotionProvider />
        <JsonLd data={storeLd()} />
        {/* Métricas sem cookies (só ativas em deploy na Vercel): dispensam banner de consentimento. */}
        {process.env.VERCEL === "1" && <Analytics />}
        {process.env.VERCEL === "1" && <SpeedInsights />}
      </body>
    </html>
  );
}
