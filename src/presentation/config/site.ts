/**
 * BISMILLAH site-wide configuration: canonical domain, business contact info,
 * and third-party analytics IDs.
 *
 * Rule: only real values live here. Anything not yet provided is left
 * `undefined` — consuming code must skip that field entirely (omit it from
 * JSON-LD, skip loading the script, etc.) rather than render a placeholder.
 *
 * To configure, set these in `.env` (see `.env.example`):
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID          — Google Analytics 4 measurement ID
 *   NEXT_PUBLIC_META_PIXEL_ID              — Meta (Facebook/Instagram) Pixel ID
 *   NEXT_PUBLIC_BUSINESS_STREET_ADDRESS    — physical storefront address, if any
 *   NEXT_PUBLIC_BUSINESS_POSTAL_CODE       — postal code for the address above
 */

export const SITE_CONFIG = {
  siteUrl: "https://bismillah.com.pe",
  businessName: "BISMILLAH Wellness",
  email: "contacto@bismillah.pe",
  // Same number used for the WhatsApp CTA (see whatsapp.ts), formatted for display.
  phoneDisplay: "+51 938 128 411",
  city: "Lima, Perú",
  country: "PE",

  // Not currently known — left unset rather than fabricated. Set the env vars
  // above if/when a physical address should be published in SEO metadata.
  streetAddress: process.env.NEXT_PUBLIC_BUSINESS_STREET_ADDRESS || undefined,
  postalCode: process.env.NEXT_PUBLIC_BUSINESS_POSTAL_CODE || undefined,

  // Not currently known — analytics scripts only load when these are set.
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined,
} as const;
