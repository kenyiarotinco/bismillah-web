import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "BioProst Premium 30 Tabletas | Bismillah",
  description:
    "Conoce BioProst Premium en presentación de 30 tabletas. Revisa su fórmula, ingredientes e información de uso y consulta disponibilidad con Bismillah.",
  alternates: {
    canonical: "/bioprost-premium",
  },
  openGraph: {
    title: "BioProst Premium | BISMILLAH Men's Wellness",
    description: "Cuidarte también es parte de ser fuerte.",
    url: "/bioprost-premium",
    siteName: "BISMILLAH Wellness",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BioProst Premium | BISMILLAH Men's Wellness",
    description: "Cuidarte también es parte de ser fuerte.",
  },
};

export const viewport: Viewport = {
  themeColor: "#19382F",
  colorScheme: "light",
};

export default function BioProstPremiumLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
