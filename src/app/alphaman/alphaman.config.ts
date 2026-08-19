export const ALPHAMAN_CONFIG = {
  productName: "AlphaMan",
  tagline: "Premium Masculine Wellness",
  images: {
    hero: "/images/alphaman/alphaman-front.png",
    ingredients: "/images/alphaman/alphaman-ingredients.png",
    routine: "/images/alphaman/alphaman-routine.png",
  },
  verifiedLabelData: {
    netWeightGrams: 315,
    servingCount: 21,
    preparation: "En 250 ml de agua o tu bebida favorita.",
    flavor: "Premium Blend",
    zeroClaims: { sugar: "0 g", fats: "0 g", carbs: "0 g" },
  },
  packages: [
    { id: "single", name: "1 Unit", priceDisplay: "S/79", regularPrice: 95, promotionalPrice: 79, savings: 16, savingsPercent: 17, description: "Prueba completa del ritual AlphaMan.", recommended: false, unitPriceDisplay: null },
    { id: "duo", name: "2 Units", priceDisplay: "S/129", regularPrice: 190, promotionalPrice: 129, savings: 61, savingsPercent: 32, description: "Ahorras S/61 · S/64.50 c/u", recommended: true, unitPriceDisplay: "S/64.50 c/u" },
    { id: "wholesale", name: "5+ Units (B2B)", priceDisplay: "S/55 c/u", regularPrice: 275, promotionalPrice: 275, savings: 0, savingsPercent: 0, description: "Distribuidor mayorista · 5 unidades mínimo · S/275 total", recommended: false, unitPriceDisplay: null },
  ],
  commercial: { paymentOnDelivery: "Pago contra entrega disponible en zonas seleccionadas.", availabilityLabel: "Disponible" },
} as const;

export type AlphamanPackageId = typeof ALPHAMAN_CONFIG.packages[number]["id"];

export function buildAlphamanWhatsAppUrl({ packageId, source, name, phone, district, address }: { packageId: AlphamanPackageId; source: string; name?: string; phone?: string; district?: string; address?: string }): string {
  const pkg = ALPHAMAN_CONFIG.packages.find((p) => p.id === packageId);
  if (!pkg) return "https://wa.me/";
  const lines = ["¡Hola Bismillah! Quiero pedir AlphaMan.", "", `📦 Presentación: ${pkg.name}`, `💰 Precio: ${pkg.priceDisplay}`, `📍 Origen: ${source}`];
  if (name) lines.push(`👤 Nombre: ${name}`);
  if (phone) lines.push(`📱 Teléfono: ${phone}`);
  if (district) lines.push(`🏘️ Distrito: ${district}`);
  if (address) lines.push(`📍 Dirección: ${address}`);
  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/?text=${message}`;
}
