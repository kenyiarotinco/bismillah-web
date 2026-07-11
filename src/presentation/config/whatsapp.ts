/**
 * BISMILLAH WhatsApp Business configuration.
 * Centraliza el número y el mensaje precargado para evitar hardcodeo en los componentes.
 */

export const WHATSAPP_CONFIG = {
  phoneNumber: "51938128411",
  defaultMessage:
    "Hola, quiero conocer más sobre los suplementos premium de Bismillah 🌿",
} as const;

export function buildWhatsAppUrl(message: string = WHATSAPP_CONFIG.defaultMessage): string {
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(message)}`;
}
