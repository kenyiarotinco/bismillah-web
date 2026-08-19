import { buildWhatsAppUrl, WHATSAPP_CONFIG } from "../../presentation/config/whatsapp";

export const BIOPROST_CONFIG = {
  route: "/bioprost-premium",
  productName: "Bio Prost",
  parentBrand: "BISMILLAH Men's Wellness",
  images: {
    front: "/images/bioprost-premium/bioprost-front-official.png",
    editorial: "/images/bioprost-premium/bioprost-editorial-lifestyle.png",
  },
  verifiedProductData: {
    presentation: "1 frasco",
    units: 30,
    origin: "MADE IN USA",
    sanitaryRegistry: "DIGESA N8332621N/NAPAEI",
    usageNote: "Sigue únicamente la indicación del envase o la recomendación de un profesional de salud.",
    ingredients: [
      {
        name: "Saw Palmetto",
        copy: "Extracto botánico utilizado habitualmente en fórmulas orientadas al bienestar masculino.",
      },
      {
        name: "Uña de gato",
        copy: "Ingrediente botánico incorporado como parte de la combinación de Bio Prost.",
      },
      {
        name: "Licopeno",
        copy: "Carotenoide incluido dentro del enfoque nutricional de la fórmula.",
      },
      {
        name: "Vitaminas y minerales",
        copy: "Micronutrientes que complementan la composición nutricional del producto.",
      },
    ],
    formulaTags: ["Saw Palmetto", "Uña de gato", "Licopeno", "Vitaminas", "Minerales"],
  },
  pillars: [
    {
      n: "01",
      eyebrow: "Bienestar masculino",
      title: "Cuidado integral",
      copy: "Una fórmula orientada a complementar una rutina consciente de bienestar masculino.",
    },
    {
      n: "02",
      eyebrow: "Fórmula botánica",
      title: "Ingredientes seleccionados",
      copy: "Saw Palmetto, Uña de gato, Licopeno, vitaminas y minerales reunidos en una presentación práctica.",
    },
    {
      n: "03",
      eyebrow: "Vitalidad",
      title: "Rutina activa",
      copy: "Una propuesta nutricional pensada para hombres adultos que buscan incorporar el cuidado personal a su día a día.",
    },
    {
      n: "04",
      eyebrow: "Constancia",
      title: "30 tabletas",
      copy: "Un formato práctico diseñado para facilitar su incorporación dentro de una rutina.",
    },
  ],
  routine: [
    {
      n: "01",
      title: "Revisa la presentación",
      copy: "Comprueba las indicaciones del envase antes de iniciar.",
    },
    {
      n: "02",
      title: "Sigue la indicación del envase",
      copy: "Utiliza únicamente la cantidad indicada en el etiquetado o por un profesional.",
    },
    {
      n: "03",
      title: "Incorpóralo a tu rutina",
      copy: "La constancia permite convertir el cuidado personal en un hábito.",
    },
    {
      n: "04",
      title: "Consulta si lo necesitas",
      copy: "Si utilizas medicamentos o tienes una condición médica, consulta con un profesional de salud.",
    },
  ],
  facts: [
    { value: "30", label: "Tabletas" },
    { value: "1", label: "Frasco" },
    { value: "Nueva", label: "Fórmula" },
    { value: "100%", label: "Natural" },
    { value: "USA", label: "Made in" },
  ],
  comparison: {
    generic: {
      title: "Suplemento genérico",
      points: ["Información limitada", "Compra sin acompañamiento", "Una única ruta comercial"],
    },
    bioprost: {
      title: "Bio Prost + Bismillah",
      points: [
        "Información del producto",
        "Atención directa",
        "Pago contra entrega",
        "Delivery según cobertura",
        "Opciones retail y mayorista",
      ],
    },
  },
  faqs: [
    {
      question: "¿Qué es Bio Prost?",
      answer: "Bio Prost es un suplemento alimenticio orientado al bienestar masculino, presentado en un frasco de 30 tabletas.",
    },
    {
      question: "¿Cuántas tabletas contiene?",
      answer: "Cada frasco de Bio Prost contiene 30 tabletas.",
    },
    {
      question: "¿Qué ingredientes destacados contiene?",
      answer:
        "Saw Palmetto, Uña de gato, Licopeno, vitaminas y minerales. Consulta siempre el envase físico para verificar la composición vigente.",
    },
    {
      question: "¿Cómo se utiliza?",
      answer: "Sigue la indicación del envase o la recomendación de un profesional de salud.",
    },
    {
      question: "¿Cuál es el precio?",
      answer: "1 frasco cuesta S/89 (precio regular de referencia S/159).",
    },
    {
      question: "¿Cuál es la promoción por 2 unidades?",
      answer: "2 frascos por S/149 en total, equivalente a S/74.50 c/u — ahorras S/169 frente al valor regular.",
    },
    {
      question: "¿Tienen precio mayorista?",
      answer: "Sí. Desde 5 unidades por S/295 en total (S/59 c/u). Escríbenos por WhatsApp para coordinar.",
    },
    {
      question: "¿Puedo pagar contra entrega?",
      answer: "Sí, Bio Prost se puede pagar contra entrega.",
    },
    {
      question: "¿El delivery es gratis?",
      answer: "El delivery es gratuito según cobertura disponible.",
    },
    {
      question: "¿Cómo realizo mi pedido?",
      answer: "Elige tu oferta y escríbenos por WhatsApp; el equipo confirma disponibilidad, precio vigente y entrega antes de coordinar.",
    },
  ],
  commercial: {
    regularPrice: 159,
    offers: [
      {
        id: "single",
        label: "1 frasco",
        formLabel: "1 Bio Prost — S/89",
        units: 1,
        total: 89,
        unitPrice: 89,
        savings: 70,
        featured: false,
        badge: null as string | null,
        ctaLabel: "Pedir 1 — S/89",
      },
      {
        id: "double",
        label: "2 frascos",
        formLabel: "2 Bio Prost — S/149",
        units: 2,
        total: 149,
        unitPrice: 74.5,
        savings: 169,
        featured: true,
        badge: "Más conveniente" as string | null,
        ctaLabel: "Pedir 2 — S/149",
      },
      {
        id: "wholesale",
        label: "Mayorista",
        formLabel: "Mayorista 5 unidades — S/295",
        units: 5,
        total: 295,
        unitPrice: 59,
        savings: 500,
        featured: false,
        badge: null as string | null,
        ctaLabel: "Consultar mayorista",
      },
    ],
    paymentOnDelivery: "Pago contra entrega",
    freeDelivery: "Delivery gratis según cobertura",
    whatsappNumber: WHATSAPP_CONFIG.phoneNumber,
    disclaimer: "Promociones, entrega y cobertura sujetas a disponibilidad.",
  },
} as const;

export type BioProstOfferId = (typeof BIOPROST_CONFIG.commercial.offers)[number]["id"];

export function getBioProstOffer(offerId: string) {
  return BIOPROST_CONFIG.commercial.offers.find((offer) => offer.id === offerId);
}

const OFFER_INTRO_MESSAGES: Record<BioProstOfferId, string> = {
  single:
    "Hola Bismillah, quiero pedir 1 Bio Prost por S/89. Deseo confirmar disponibilidad, delivery gratis y pago contra entrega.",
  double:
    "Hola Bismillah, quiero aprovechar la promoción de 2 Bio Prost por S/149 total. Deseo confirmar disponibilidad, delivery gratis y pago contra entrega.",
  wholesale:
    "Hola Bismillah, estoy interesado en Bio Prost al por mayor: 5 unidades por S/295. Quisiera confirmar disponibilidad y condiciones de entrega.",
};

export type BioProstOrderDetails = {
  offerId: BioProstOfferId;
  source: string;
  name?: string;
  phone?: string;
  district?: string;
  address?: string;
};

export function buildBioProstWhatsAppUrl(details: BioProstOrderDetails): string {
  const lines = [
    OFFER_INTRO_MESSAGES[details.offerId],
    details.name ? `Nombre: ${details.name}.` : undefined,
    details.phone ? `Celular: ${details.phone}.` : undefined,
    details.district ? `Distrito: ${details.district}.` : undefined,
    details.address ? `Dirección: ${details.address}.` : undefined,
    `Origen: ${details.source}.`,
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join("\n"));
}
