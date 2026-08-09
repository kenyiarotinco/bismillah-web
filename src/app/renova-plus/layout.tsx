import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";

const dmSerif = DM_Serif_Display({
  variable: "--font-renova-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-renova-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RENÖVA+ | Colágeno Doblemente Hidrolizado con Biopéptidos | Bismillah",
  description:
    "RENÖVA+: 11,4 g de colágeno doblemente hidrolizado con biopéptidos activos por toma, Resveratrol, CoQ10, vitaminas, minerales y fibra. Sabor Berries, 315 g.",
  alternates: {
    canonical: "/renova-plus",
  },
  openGraph: {
    title: "RENÖVA+ | Colágeno Doblemente Hidrolizado con Biopéptidos",
    description:
      "11,4 g de colágeno doblemente hidrolizado con biopéptidos activos por toma, Resveratrol, CoQ10, vitaminas, minerales y fibra. Belleza, vitalidad y bienestar desde el interior.",
    url: "/renova-plus",
    siteName: "BISMILLAH Wellness",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/images/renova-plus/renova-front-authentic.png",
        width: 941,
        height: 1671,
        alt: "Envase auténtico de RENÖVA+.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RENÖVA+ | Colágeno Doblemente Hidrolizado con Biopéptidos",
    description:
      "11,4 g de colágeno doblemente hidrolizado con biopéptidos activos por toma, Resveratrol, CoQ10, vitaminas, minerales y fibra.",
    images: ["/images/renova-plus/renova-front-authentic.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#111014",
  colorScheme: "light",
};

export default function RenovaPlusLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${dmSerif.variable} ${manrope.variable}`}>{children}</div>;
}
