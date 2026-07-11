import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
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
  title: "BISMILLAH | Centro de Bienestar Digital",
  description: "Suplementos premium con respaldo científico y programas personalizados para el bienestar integral.",
  keywords: ["Bismillah", "suplementos", "bienestar", "magnesio", "ashwagandha", "omega 3", "salud", "Perú"],
  authors: [{ name: "BISMILLAH Wellness OS" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "BISMILLAH | Centro de Bienestar Digital",
    description: "Suplementos premium con respaldo científico y programas personalizados para el bienestar integral.",
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
  // Global JSON-LD Schema for Local Wellness Center business SEO optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "BISMILLAH Centro de Bienestar",
    "image": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400",
    "@id": "https://bismillah.pe/#organization",
    "url": "https://bismillah.pe",
    "telephone": "+51987654321",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Javier Prado Este 1200",
      "addressLocality": "San Isidro, Lima",
      "postalCode": "15046",
      "addressCountry": "PE"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    }
  };

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
        
        {/* Mock integrations pre-loaded for Meta Pixel & Google Analytics (GA4) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // DataLayer initialization
              window.dataLayer = window.dataLayer || [];
              window.gtag = function(){ dataLayer.push(arguments); };
              window.gtag('js', new Date());
              window.gtag('config', 'GA_MEASUREMENT_ID');
              
              // Meta Pixel Mock init
              window.fbq = function(){
                if(window.fbq.callMethod) {
                  window.fbq.callMethod.apply(window.fbq, arguments);
                } else {
                  window.fbq.queue.push(arguments);
                }
              };
              window.fbq.queue = [];
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
