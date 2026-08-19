import { buildWhatsAppUrl, WHATSAPP_CONFIG } from "../../presentation/config/whatsapp";

export const BIOPROST_CONFIG = {
  route: "/bioprost-premium",
  productName: "Bio Prost Premium",
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
        copy: "Ingrediente botánico utilizado habitualmente en suplementos orientados al bienestar masculino.",
      },
      {
        name: "Uña de gato",
        copy: "Ingrediente de origen botánico incorporado dentro de la combinación de Bio Prost.",
      },
      {
        name: "Licopeno",
        copy: "Carotenoide con actividad antioxidante que contribuye al perfil nutricional de la fórmula.",
      },
      {
        name: "Vitaminas y minerales",
        copy: "Micronutrientes que ayudan a complementar el aporte nutricional del producto.",
      },
    ],
    formulaTags: ["Saw Palmetto", "Uña de gato", "Licopeno", "Vitaminas", "Minerales"],
    formulaMicrocopy: "Ingredientes seleccionados reunidos en una presentación práctica para hombres adultos.",
  },
  pillarsIntro:
    "Bio Prost reúne ingredientes seleccionados dentro de una presentación práctica que ayuda a complementar una rutina consciente de bienestar masculino.",
  pillars: [
    {
      n: "01",
      eyebrow: "Bienestar masculino",
      title: "Cuidado que también te incluye",
      copy: "Una propuesta pensada para hombres adultos que buscan incorporar el cuidado personal dentro de su rutina cotidiana.",
    },
    {
      n: "02",
      eyebrow: "Fórmula botánica",
      title: "Ingredientes seleccionados",
      copy: "Saw Palmetto, Uña de gato y Licopeno forman parte de una fórmula complementada con vitaminas y minerales.",
    },
    {
      n: "03",
      eyebrow: "Vitalidad",
      title: "Acompaña una rutina activa",
      copy: "Bio Prost ayuda a complementar hábitos de bienestar y cuidado personal dentro del ritmo diario.",
    },
    {
      n: "04",
      eyebrow: "Constancia",
      title: "Una presentación práctica",
      copy: "Sus 30 tabletas ofrecen un formato sencillo para integrar el producto dentro de una rutina organizada.",
    },
  ],
  routineNote: "Si utilizas medicamentos o tienes una condición médica, consulta con un profesional de salud.",
  routine: [
    {
      n: "01",
      title: "Conoce tu producto",
      copy: "Revisa la presentación y la información del envase antes de iniciar.",
    },
    {
      n: "02",
      title: "Sigue la indicación",
      copy: "Utiliza Bio Prost de acuerdo con las instrucciones presentes en el etiquetado.",
    },
    {
      n: "03",
      title: "Crea constancia",
      copy: "Organiza su consumo dentro de una rutina diaria que te resulte fácil de mantener.",
    },
    {
      n: "04",
      title: "Acompaña tu bienestar",
      copy: "Combínalo con hábitos conscientes de alimentación, actividad y cuidado personal.",
    },
  ],
  facts: [
    { value: "30", label: "Tabletas" },
    { value: "1", label: "Frasco" },
    { value: "100%", label: "Natural" },
    { value: "Nueva", label: "Fórmula" },
  ],
  comparison: {
    product: {
      title: "Bio Prost",
      points: [
        "Presentación clara",
        "Ingredientes destacados",
        "30 tabletas",
        "Fórmula botánica",
        "Información antes de comprar",
      ],
    },
    bismillah: {
      title: "Bismillah",
      points: [
        "Atención directa",
        "Opciones retail",
        "Precio mayorista",
        "Pago contra entrega",
        "Delivery según cobertura",
        "Coordinación por WhatsApp",
      ],
    },
  },
  faqs: [
    {
      question: "¿Qué es Bio Prost?",
      answer: "Bio Prost es un suplemento alimenticio de bienestar masculino presentado en un frasco de 30 tabletas.",
    },
    {
      question: "¿Cuántas tabletas contiene?",
      answer: "30 tabletas.",
    },
    {
      question: "¿Qué ingredientes destacados contiene?",
      answer: "Saw Palmetto, Uña de gato, Licopeno, vitaminas y minerales.",
    },
    {
      question: "¿Para qué está pensado?",
      answer: "Para ayudar a complementar una rutina consciente de bienestar y cuidado masculino.",
    },
    {
      question: "¿Cómo se utiliza?",
      answer: "Siguiendo las indicaciones del envase físico.",
    },
    {
      question: "¿Cuánto cuesta?",
      answer: "1 frasco está disponible en promoción por S/89.",
    },
    {
      question: "¿Cuánto cuestan 2?",
      answer: "2 frascos cuestan S/149 total.",
    },
    {
      question: "¿Existe precio mayorista?",
      answer: "Sí. Desde 5 unidades por S/295 total.",
    },
    {
      question: "¿Hay pago contra entrega?",
      answer: "Sí, según cobertura.",
    },
    {
      question: "¿El delivery es gratis?",
      answer: "Sí, según cobertura disponible.",
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
        formLabel: "5 Bio Prost Mayorista — S/295",
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
