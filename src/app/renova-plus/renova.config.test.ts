import { describe, expect, it } from "vitest";
import {
  buildRenovaWhatsAppUrl,
  getRenovaPackage,
  RENOVA_CONFIG,
} from "./renova.config";

describe("RENÖVA+ configuration", () => {
  it("uses only the existing central WhatsApp number", () => {
    expect(RENOVA_CONFIG.commercial.whatsappNumber).toBe("51938128411");
  });

  it("keeps commercial pricing unavailable until approved", () => {
    expect(RENOVA_CONFIG.commercial.approvedPricesAvailable).toBe(false);
  });

  it("contains label-confirmed serving information", () => {
    expect(RENOVA_CONFIG.verifiedLabelData.netWeightGrams).toBe(315);
    expect(RENOVA_CONFIG.verifiedLabelData.servingSizeGrams).toBe(15);
    expect(RENOVA_CONFIG.verifiedLabelData.servingCount).toBe(21);
  });

  it("creates an encoded WhatsApp consultation URL with package context", () => {
    const url = buildRenovaWhatsAppUrl({
      packageId: "continuity",
      source: "Formulario RENÖVA+",
      name: "Ana Pérez",
    });
    const parsed = new URL(url);

    expect(parsed.origin).toBe("https://wa.me");
    expect(parsed.pathname).toBe("/51938128411");
    expect(parsed.searchParams.get("text")).toContain("Continuidad");
    expect(url).toContain("%20");
  });

  it("keeps the recommended package deterministic", () => {
    expect(getRenovaPackage("continuity").recommended).toBe(true);
  });

  it("registers the approved black and white jar assets", () => {
    expect(RENOVA_CONFIG.images.blackJar).toBe(
      "/images/renova-plus/renova-frasco-negro-referencia-fwp.webp",
    );
    expect(RENOVA_CONFIG.images.whiteJar).toBe(
      "/images/renova-plus/renova-frasco-blanco-referencia-fwp.webp",
    );
  });

});
