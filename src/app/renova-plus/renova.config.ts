import { buildWhatsAppUrl, WHATSAPP_CONFIG } from "../../presentation/config/whatsapp";

export const RENOVA_CONFIG = {
  route: "/renova-plus",
  productName: "RENÖVA+",
  parentBrand: "BISMILLAH Wellness",
  concept: "Belleza estructural desde el interior.",
  heroMessage: "Tu ritual diario de belleza comienza desde dentro.",
  images: {
    front: "/images/renova-plus/renova-front-authentic.png",
    blackJar: "/images/renova-plus/renova-frasco-negro-referencia-fwp.webp",
    whiteJar: "/images/renova-plus/renova-frasco-blanco-referencia-fwp.webp",
    nutrition: "/images/renova-plus/renova-nutrition-authentic.png",
    label: "/images/renova-plus/renova-label-authentic.png",
  },
  verifiedLabelData: {
    netWeightGrams: 315,
    servingSizeGrams: 15,
    servingCount: 21,
    preparation: "Mezcla una porción de 15 g en un vaso con 250 ml de agua.",
    storage: "Conserva el envase cerrado en un lugar fresco y seco, lejos de fuentes de calor.",
    flavor: "Berries",
    components: [
      "Colágeno hidrolizado",
      "Vitamina C",
      "Resveratrol",
      "Coenzima Q10",
      "Zinc",
      "Magnesio",
    ],
  },
  packages: [
    {
      id: "discovery",
      name: "Descubrimiento",
      units: 1,
      description: "Una unidad para incorporar RENÖVA+ a tu ritual.",
      recommended: false,
    },
    {
      id: "continuity",
      name: "Continuidad",
      units: 2,
      description: "Dos unidades para planificar tu continuidad.",
      recommended: true,
    },
    {
      id: "transformation",
      name: "Transformación",
      units: 3,
      description: "Tres unidades para organizar tu siguiente etapa.",
      recommended: false,
    },
  ],
  commercial: {
    approvedPricesAvailable: false,
    whatsappNumber: WHATSAPP_CONFIG.phoneNumber,
    availabilityLabel: "Consultar disponibilidad",
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
  return RENOVA_CONFIG.packages.find((item) => item.id === packageId) ?? RENOVA_CONFIG.packages[0];
}

export function buildRenovaWhatsAppUrl(details: RenovaOrderDetails): string {
  const selectedPackage = getRenovaPackage(details.packageId);
  const lines = [
    `Hola, vi ${RENOVA_CONFIG.productName} en bismillah.com.pe${RENOVA_CONFIG.route}.`,
    `Deseo consultar disponibilidad del paquete ${selectedPackage.name} (${selectedPackage.units} ${selectedPackage.units === 1 ? "unidad" : "unidades"}).`,
    details.name ? `Nombre: ${details.name}.` : undefined,
    details.phone ? `Celular: ${details.phone}.` : undefined,
    details.district ? `Distrito: ${details.district}.` : undefined,
    details.address ? `Dirección: ${details.address}.` : undefined,
    `Origen: ${details.source}.`,
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join("\n"));
}
