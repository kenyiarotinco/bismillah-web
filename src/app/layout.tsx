import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { SITE_CONFIG } from "../presentation/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bismillah.com.pe"),
  title: "Bismillah Mayorista | Fórmulas de bienestar y atención por WhatsApp",
  description: "Conoce las fórmulas seleccionadas de Bismillah Mayorista, revisa sus presentaciones y consulta disponibilidad por WhatsApp.",
  keywords: ["Bismillah", "suplementos", "bienestar", "RENÖVA+", "BioProst", "mayorista", "Perú"],
  authors: [{ name: "Bismillah Mayorista" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Bismillah Mayorista | Fórmulas de bienestar y atención por WhatsApp",
    description: "Conoce las fórmulas seleccionadas de Bismillah Mayorista, revisa sus presentaciones y consulta disponibilidad por WhatsApp.",
    url: "https://bismillah.com.pe",
    siteName: "BISMILLAH",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://bismillah.com.pe",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global JSON-LD Schema for the Bismillah commercial organization.
  // Only real, known fields are included — see src/presentation/config/site.ts.
  // No street address is published unless NEXT_PUBLIC_BUSINESS_STREET_ADDRESS is set.
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_CONFIG.businessName,
    "image": `${SITE_CONFIG.siteUrl}/images/brand/bismillah-icon.png`,
    "@id": `${SITE_CONFIG.siteUrl}/#organization`,
    "url": SITE_CONFIG.siteUrl,
    "telephone": SITE_CONFIG.phoneDisplay,
    "email": SITE_CONFIG.email,
  };

  if (SITE_CONFIG.streetAddress) {
    jsonLd.address = {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.streetAddress,
      "addressLocality": SITE_CONFIG.city,
      ...(SITE_CONFIG.postalCode ? { postalCode: SITE_CONFIG.postalCode } : {}),
      "addressCountry": SITE_CONFIG.country,
    };
  }

  return (
    <html
      lang="es"
      className={`${inter.variable} ${jakarta.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics 4 — only loads when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured */}
        {SITE_CONFIG.gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${SITE_CONFIG.gaMeasurementId}');
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel — only loads when NEXT_PUBLIC_META_PIXEL_ID is configured */}
        {SITE_CONFIG.metaPixelId && (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${SITE_CONFIG.metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
