import { buildWhatsAppUrl, WHATSAPP_CONFIG } from "../../presentation/config/whatsapp";

export const ALPHAMAN_CONFIG = {
  route: "/alphaman",
  productName: "AlphaMan",
  commercialName: "AlphaMan Cápsulas",
  parentBrand: "BISMILLAH Men's Wellness",

  verifiedProductData: {
    presentation: "1 frasco",
    capsules: 20,
    origin: "Perú",
    sanitaryRegistry: "DIGESA N8332621N/NAPAEI",
    usageNote: "Sigue únicamente la indicación del envase o la recomendación de un profesional de salud.",
  },

  ingredients: [
    {
      name: "Maca Negra",
      category: "energía",
      title: "Vitalidad masculina",
      copy: "Ingrediente andino incorporado a la fórmula para acompañar la energía, la vitalidad y el bienestar masculino.",
    },
    {
      name: "Huanarpo Macho",
      category: "botánicos",
      title: "Tradición masculina",
      copy: "Ingrediente botánico tradicionalmente utilizado dentro de formulaciones orientadas al vigor y bienestar masculino.",
    },
    {
      name: "Algarroba",
      category: "energía",
      title: "Energía para tu rutina",
      copy: "Ingrediente natural que complementa una fórmula orientada a acompañar la energía física y el rendimiento cotidiano.",
    },
    {
      name: "Guaraná",
      category: "energía",
      title: "Energía y activación",
      copy: "Ingrediente utilizado tradicionalmente en fórmulas energizantes para acompañar la vitalidad y reducir la sensación de cansancio.",
    },
    {
      name: "Camu Camu",
      category: "frutos",
      title: "Soporte antioxidante",
      copy: "Fruto amazónico reconocido por su perfil nutricional y antioxidante, incorporado como parte de la fórmula AlphaMan.",
    },
    {
      name: "Mashua",
      category: "botánicos",
      title: "Bienestar masculino",
      copy: "Ingrediente andino que forma parte de la combinación botánica desarrollada para AlphaMan.",
    },
    {
      name: "Chuchuhuasi",
      category: "botánicos",
      title: "Raíz amazónica",
      copy: "Ingrediente botánico tradicional incorporado dentro de la composición natural de AlphaMan.",
    },
    {
      name: "Clavo Huasca",
      category: "botánicos",
      title: "Tradición amazónica",
      copy: "Componente botánico utilizado tradicionalmente dentro de distintas preparaciones orientadas al bienestar y vitalidad.",
    },
    {
      name: "Sandía",
      category: "frutos",
      title: "Nutrición natural",
      copy: "Incorpora componentes naturales que complementan el perfil de la fórmula.",
    },
    {
      name: "Iporuro",
      category: "botánicos",
      title: "Componente botánico",
      copy: "Ingrediente tradicional integrado dentro de la combinación natural de AlphaMan.",
    },
  ],

  benefits: [
    {
      n: "01",
      title: "Vigor",
      subtitle: "Energía que acompaña tu ritmo",
      copy: "AlphaMan ayuda a complementar la vitalidad y el vigor dentro de una rutina masculina activa.",
    },
    {
      n: "02",
      title: "Desempeño",
      subtitle: "Confianza para tus momentos importantes",
      copy: "Una fórmula orientada a acompañar el bienestar, la energía y el desempeño masculino.",
    },
    {
      n: "03",
      title: "Vitalidad Íntima",
      subtitle: "Conecta con tu energía",
      copy: "Sus componentes naturales ayudan a complementar la vitalidad y el bienestar dentro de tu vida íntima.",
    },
    {
      n: "04",
      title: "Resistencia",
      subtitle: "Energía cuando la necesitas",
      copy: "Ingredientes seleccionados para acompañar la energía física y ayudar a reducir la sensación de fatiga.",
    },
    {
      n: "05",
      title: "Confianza",
      subtitle: "Bienestar que también se siente",
      copy: "Sentirte bien contigo mismo también forma parte de una vida íntima más segura y consciente.",
    },
  ],

  usage: {
    frequent: {
      dosage: "1 cápsula interdiaria",
      copy: "Un día sí y un día no, siguiendo siempre las indicaciones del producto.",
    },
    occasional: {
      dosage: "1 a 2 cápsulas aproximadamente media hora antes",
      copy: "Respeta siempre la cantidad indicada y evita exceder el consumo recomendado.",
    },
    hydration: "Acompaña tu rutina con una hidratación adecuada. Aproximadamente 2 litros de agua al día dentro de una hidratación normal, salvo indicación diferente de un profesional.",
    note: "Si utilizas medicamentos, tienes una condición médica o tienes dudas sobre su consumo, consulta con un profesional de salud.",
  },

  commercial: {
    whatsappNumber: WHATSAPP_CONFIG.phoneNumber,
  },

  offers: [
    {
      id: "single",
      label: "1 AlphaMan",
      quantity: 1,
      price: 79,
      total: 79,
      cta: "PEDIR 1 — S/79",
      badge: undefined,
      unitPrice: undefined,
      highlighted: false,
    },
    {
      id: "double",
      label: "2 AlphaMan",
      quantity: 2,
      price: 129,
      total: 129,
      unitPrice: 64.5,
      cta: "PEDIR 2 — S/129",
      badge: "MÁS CONVENIENTE",
      highlighted: true,
    },
    {
      id: "wholesale",
      label: "5 AlphaMan Mayorista",
      quantity: 5,
      price: 275,
      total: 275,
      unitPrice: 55,
      cta: "CONSULTAR DISTRIBUIDOR",
      badge: "DESDE 5 UNIDADES",
      highlighted: false,
    },
  ],

  faqs: [
    {
      question: "¿Qué es AlphaMan?",
      answer: "AlphaMan es un suplemento natural para hombres presentado en un frasco de 20 cápsulas.",
    },
    {
      question: "¿Cuántas cápsulas contiene?",
      answer: "20 cápsulas.",
    },
    {
      question: "¿Qué ingredientes contiene?",
      answer: "Maca Negra, Huanarpo Macho, Algarroba, Guaraná, Camu Camu, Mashua, Chuchuhuasi, Clavo Huasca, Sandía e Iporuro.",
    },
    {
      question: "¿Para qué está pensado?",
      answer: "Para acompañar una rutina de energía, vitalidad y bienestar masculino.",
    },
    {
      question: "¿Cómo se utiliza?",
      answer: "Consulta las dos modalidades en la sección Rutina. Si tienes dudas, comunícate por WhatsApp.",
    },
    {
      question: "¿Cuánto cuesta?",
      answer: "1 AlphaMan: S/79.",
    },
    {
      question: "¿Cuál es la promoción de 2 unidades?",
      answer: "2 AlphaMan: S/129 total.",
    },
    {
      question: "¿Existe precio para distribuidores?",
      answer: "Sí. La opción comienza desde 5 unidades, con 5 AlphaMan por S/275.",
    },
    {
      question: "¿Cómo realizo mi pedido?",
      answer: "Mediante atención directa de Bismillah por WhatsApp.",
    },
    {
      question: "¿Es un medicamento?",
      answer: "No. AlphaMan se comercializa como suplemento y no sustituye la orientación de un profesional de salud.",
    },
  ],

  images: {
    front: "/images/alphaman/alphaman-front.png",
    editorial: "/images/alphaman/alphaman-editorial.png",
    ingredients: "/images/alphaman/alphaman-ingredients.png",
    routine: "/images/alphaman/alphaman-routine.png",
  },
} as const;

export type AlphaManOrderDetails = {
  source: string;
  offerId?: string;
  name?: string;
  phone?: string;
  district?: string;
  address?: string;
};

export function buildAlphaManWhatsAppUrl(details: AlphaManOrderDetails): string {
  const offer = ALPHAMAN_CONFIG.offers.find((o) => o.id === details.offerId) || ALPHAMAN_CONFIG.offers[0];

  let message = "";
  if (details.offerId === "single") {
    message = "Hola Bismillah, quiero pedir 1 AlphaMan por S/79. Quisiera confirmar disponibilidad y coordinar la entrega.";
  } else if (details.offerId === "double") {
    message = "Hola Bismillah, quiero aprovechar la promoción de 2 AlphaMan por S/129 total. Quisiera confirmar disponibilidad y coordinar la entrega.";
  } else if (details.offerId === "wholesale") {
    message = "Hola Bismillah, estoy interesado en AlphaMan para distribución. Quiero iniciar con 5 unidades por S/275 y conocer las condiciones para pedidos mayores.";
  }

  if (details.name) message += `\nNombre: ${details.name}.`;
  if (details.phone) message += `\nCelular: ${details.phone}.`;
  if (details.district) message += `\nDistrito: ${details.district}.`;
  if (details.address) message += `\nDirección: ${details.address}.`;

  return buildWhatsAppUrl(message);
}
