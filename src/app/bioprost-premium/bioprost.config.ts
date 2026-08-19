import { buildWhatsAppUrl, WHATSAPP_CONFIG } from "../../presentation/config/whatsapp";

export const BIOPROST_CONFIG = {
  route: "/bioprost-premium",
  productName: "BioProst Premium",
  parentBrand: "BISMILLAH Men's Wellness",
  heroMessage: "Cuidarte también es parte de ser fuerte.",
  images: {
    front: "/images/bioprost-premium/bioprost-front-official.png",
    pack: "/images/bioprost-premium/bioprost-pack-2-official.png",
  },
  verifiedProductData: {
    presentation: "Frasco Premium",
    units: 30,
    origin: "Estados Unidos",
    sanitaryRegistry: "DIGESA N8332621N/NAPAEI",
    usageNote: "Tomar según indicación del envase o recomendación profesional.",
    ingredients: [
      {
        name: "Saw Palmetto",
        copy: "Extracto botánico presente en fórmulas orientadas al bienestar masculino.",
      },
      {
        name: "Uña de gato",
        copy: "Ingrediente de origen vegetal incorporado dentro de la combinación de Bio Prost.",
      },
      {
        name: "Licopeno",
        copy: "Carotenoide incluido dentro de la formulación nutricional.",
      },
      {
        name: "Vitaminas y minerales",
        copy: "Complejo de vitaminas y minerales presente en la fórmula de Bio Prost.",
      },
    ],
  },
  pillars: [
    {
      n: "01",
      title: "Vitalidad diaria",
      copy: "Una fórmula pensada para complementar una rutina activa.",
    },
    {
      n: "02",
      title: "Bienestar masculino",
      copy: "Una combinación desarrollada específicamente para el hombre adulto.",
    },
    {
      n: "03",
      title: "Constancia",
      copy: "Un formato práctico que facilita incorporarlo a los hábitos cotidianos.",
    },
    {
      n: "04",
      title: "Elección informada",
      copy: "Ingredientes, presentación e información de uso disponibles antes de decidir.",
    },
  ],
  faqs: [
    {
      question: "¿Qué es BioProst Premium?",
      answer:
        "BioProst Premium es un suplemento nutricional para adultos presentado en un frasco de 30 tabletas y formulado con diferentes ingredientes nutricionales y botánicos.",
    },
    {
      question: "¿Qué contiene?",
      answer:
        "La información recopilada para esta presentación identifica Saw Palmetto, Uña de gato, Licopeno, vitaminas y minerales. Consulta siempre el envase físico para verificar la composición vigente.",
    },
    {
      question: "¿Cuántas tabletas contiene?",
      answer: "30 unidades.",
    },
    {
      question: "¿Cómo se toma?",
      answer: "Tomar según indicación del envase o recomendación profesional.",
    },
    {
      question: "¿Es un medicamento?",
      answer:
        "No. BioProst Premium se comercializa como suplemento alimenticio/nutricional y no reemplaza tratamientos ni evaluaciones médicas.",
    },
    {
      question: "¿Puede utilizarse para tratar enfermedades de la próstata?",
      answer:
        "BioProst Premium no se presenta como tratamiento de enfermedades. Si existen síntomas, diagnóstico previo o tratamiento médico, corresponde consultar con un profesional de salud.",
    },
    {
      question: "¿Puedo consumirlo si tomo medicamentos?",
      answer:
        "Quienes utilizan medicamentos o tienen una condición médica deben revisar la etiqueta y consultar con un profesional de salud antes de incorporar suplementos.",
    },
    {
      question: "¿Dónde se fabrica?",
      answer: "Estados Unidos.",
    },
    {
      question: "¿Tiene registro sanitario?",
      answer: "Sí. Registro Sanitario DIGESA N8332621N/NAPAEI, correspondiente a esta presentación.",
    },
    {
      question: "¿Cómo consulto precio y entrega?",
      answer:
        "Mediante el canal oficial de WhatsApp de Bismillah. El equipo confirma disponibilidad, precio vigente, cobertura y condiciones antes de coordinar.",
    },
  ],
  commercial: {
    approvedPricesAvailable: true,
    price: 99.0,
    whatsappNumber: WHATSAPP_CONFIG.phoneNumber,
    availabilityLabel: "Consultar disponibilidad",
  },
} as const;

export type BioProstOrderDetails = {
  source: string;
  name?: string;
  phone?: string;
  district?: string;
  address?: string;
  quantity?: string;
};

export function buildBioProstWhatsAppUrl(details: BioProstOrderDetails): string {
  const lines = [
    `Hola, vi ${BIOPROST_CONFIG.productName} en bismillah.com.pe${BIOPROST_CONFIG.route}.`,
    "Deseo consultar disponibilidad, precio vigente y entrega.",
    details.name ? `Nombre: ${details.name}.` : undefined,
    details.phone ? `Celular: ${details.phone}.` : undefined,
    details.district ? `Distrito: ${details.district}.` : undefined,
    details.address ? `Dirección: ${details.address}.` : undefined,
    details.quantity ? `Cantidad: ${details.quantity}.` : undefined,
    `Origen: ${details.source}.`,
  ].filter(Boolean);

  return buildWhatsAppUrl(lines.join("\n"));
}
