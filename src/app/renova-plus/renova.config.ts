import { buildWhatsAppUrl, WHATSAPP_CONFIG } from "../../presentation/config/whatsapp";

export const RENOVA_CONFIG = {
  route: "/renova-plus",
  productName: "RENÖVA+",
  parentBrand: "BISMILLAH Wellness",
  concept: "Belleza, vitalidad y bienestar desde el interior.",
  heroMessage: "Belleza, vitalidad y bienestar desde el interior.",
  heroSubhead:
    "RENÖVA+ va más allá de un colágeno tradicional. Cada toma aporta 11,4 g de colágeno doblemente hidrolizado con biopéptidos activos, complementados con Resveratrol, CoQ10, vitaminas, minerales y fibra.",
  microClaim: "NO ES SOLO COLÁGENO. ES RENÖVA+.",
  images: {
    hero: "/images/renova-plus/00-portada/renova-plus-hero-berries-v2.png",
    dailyRitualSlides: [
      {
        src: "/images/renova-plus/00-portada/renova-carousel-02-preparacion.png",
        alt: "Bebida rosa sabor berries de RENÖVA+ en preparación.",
        label: "11,4 g de colágeno + biopéptidos",
        objectPosition: "center center",
      },
      {
        src: "/images/renova-plus/00-portada/renova-carousel-03-ritual.png",
        alt: "Ritual diario de bienestar con RENÖVA+ Berries.",
        label: "Tu ritual diario RENÖVA+",
        objectPosition: "center center",
      },
    ],
    front: "/images/renova-plus/renova-front-authentic.png",
    blackJar: "/images/renova-plus/renova-frasco-negro-referencia-fwp.png",
    whiteJar: "/images/renova-plus/renova-frasco-blanco-referencia-fwp.png",
    nutrition: "/images/renova-plus/renova-nutrition-authentic.png",
    label: "/images/renova-plus/renova-label-authentic.png",
  },
  verifiedLabelData: {
    netWeightGrams: 315,
    servingSizeGrams: 15,
    servingCount: 21,
    collagenPerServingGrams: 11.4,
    preparation: "Mezcla una porción de 15 g en un vaso con 250 ml de agua.",
    storage: "Conserva el envase cerrado en un lugar fresco y seco, lejos de fuentes de calor.",
    flavor: "Berries",
    zeroClaims: {
      fats: "0 g",
      sugar: "0 g",
      carbs: "0 g",
    },
    composition: {
      base: "11,4 g de colágeno doblemente hidrolizado con biopéptidos activos",
      antioxidants: ["Resveratrol", "Coenzima Q10"],
      vitamins: ["A", "C", "D3", "E", "K1", "B2", "B3", "B6", "B9", "B12"],
      minerals: ["Magnesio", "Zinc", "Hierro"],
      other: ["Biotina", "Fibra"],
    },
    components: [
      "11,4 g Colágeno doblemente hidrolizado",
      "Biopéptidos activos",
      "Resveratrol",
      "Coenzima Q10",
      "Vitamina C",
      "Biotina",
      "Magnesio",
      "Zinc",
      "Hierro",
      "Fibra",
    ],
  },
  packages: [
    {
      id: "individual",
      name: "1 Unidad",
      units: 1,
      price: 159,
      unitPrice: 159,
      priceDisplay: "S/159",
      unitPriceDisplay: undefined as string | undefined,
      description: "1 unidad de RENÖVA+ (315 g) para tu ritual diario de belleza y bienestar.",
      recommended: false,
      badge: null,
    },
    {
      id: "pack-3",
      name: "Pack 3 Unidades",
      units: 3,
      price: 327,
      unitPrice: 109,
      priceDisplay: "S/327 total",
      unitPriceDisplay: "S/109 c/u" as string | undefined,
      description: "3 unidades de RENÖVA+ a S/109 c/u. El pack más conveniente para tu continuidad.",
      recommended: true,
      badge: "MÁS CONVENIENTE",
    },
  ],
  commercial: {
    approvedPricesAvailable: true,
    whatsappNumber: WHATSAPP_CONFIG.phoneNumber,
    paymentOnDelivery: "Pago contra entrega sujeto a cobertura y condiciones logísticas según provincia",
    availabilityLabel: "Stock disponible para envío inmediato",
  },
} as const;

export type RenovaPackageId = (typeof RENOVA_CONFIG.packages)[number]["id"];

export type RenovaOrderDetails = {
  packageId: RenovaPackageId;
  source: string;
  name?: string;
  phone?: string;
  district?: string;
  address?: string;
};

export function getRenovaPackage(packageId: RenovaPackageId) {
  return RENOVA_CONFIG.packages.find((item) => item.id === packageId) ?? RENOVA_CONFIG.packages[1];
}

export function buildRenovaWhatsAppUrl(details: RenovaOrderDetails): string {
  const selectedPackage = getRenovaPackage(details.packageId);
  const isPack3 = selectedPackage.id === "pack-3";

  const introLine = isPack3
    ? `Hola, vi ${RENOVA_CONFIG.productName} en Bismillah y quiero pedir el pack de 3 unidades por S/327 (S/109 c/u).`
    : `Hola, vi ${RENOVA_CONFIG.productName} en Bismillah y quiero pedir 1 unidad a S/159.`;

  const lines = [
    introLine,
    "¿Me confirman disponibilidad y cobertura para pago contra entrega?",
    details.name?.trim() ? `Nombre: ${details.name.trim()}.` : undefined,
    details.phone?.trim() ? `Celular: ${details.phone.trim()}.` : undefined,
    details.district?.trim() ? `Distrito: ${details.district.trim()}.` : undefined,
    details.address?.trim() ? `Dirección: ${details.address.trim()}.` : undefined,
    details.source ? `Origen: ${details.source}.` : undefined,
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join("\n"));
}

