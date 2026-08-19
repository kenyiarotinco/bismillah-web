import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Bio Prost | Bienestar Masculino | Bismillah",
  description:
    "Bio Prost en presentación de 30 tabletas. Conoce su fórmula, opciones de compra, precio retail y mayorista y consulta disponibilidad por WhatsApp.",
  alternates: {
    canonical: "/bioprost-premium",
  },
  openGraph: {
    title: "Bio Prost | BISMILLAH Men's Wellness",
    description: "Cuidado masculino que sí puede formar parte de tu rutina.",
    url: "/bioprost-premium",
    siteName: "BISMILLAH Wellness",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bio Prost | BISMILLAH Men's Wellness",
    description: "Cuidado masculino que sí puede formar parte de tu rutina.",
  },
};

export const viewport: Viewport = {
  themeColor: "#19382F",
  colorScheme: "light",
};

export default function BioProstPremiumLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
