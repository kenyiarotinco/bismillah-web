import { describe, expect, it } from "vitest";
import {
  buildRenovaWhatsAppUrl,
  getRenovaPackage,
  RENOVA_CONFIG,
} from "./renova.config";

describe("RENÖVA+ V2.1 configuration", () => {
  it("uses only the central corporate WhatsApp number", () => {
    expect(RENOVA_CONFIG.commercial.whatsappNumber).toBe("51938128411");
  });

  it("enables approved commercial pricing", () => {
    expect(RENOVA_CONFIG.commercial.approvedPricesAvailable).toBe(true);
  });

  it("contains label-confirmed composition and serving information", () => {
    expect(RENOVA_CONFIG.verifiedLabelData.netWeightGrams).toBe(315);
    expect(RENOVA_CONFIG.verifiedLabelData.servingSizeGrams).toBe(15);
    expect(RENOVA_CONFIG.verifiedLabelData.servingCount).toBe(21);
    expect(RENOVA_CONFIG.verifiedLabelData.collagenPerServingGrams).toBe(11.4);
    expect(RENOVA_CONFIG.verifiedLabelData.flavor).toBe("Berries");
  });

  it("configures approved commercial packages and pricing rules", () => {
    const individual = RENOVA_CONFIG.packages.find((p) => p.id === "individual");
    const pack3 = RENOVA_CONFIG.packages.find((p) => p.id === "pack-3");

    expect(individual).toBeDefined();
    expect(individual?.price).toBe(159);
    expect(individual?.units).toBe(1);

    expect(pack3).toBeDefined();
    expect(pack3?.price).toBe(327);
    expect(pack3?.unitPrice).toBe(109);
    expect(pack3?.units).toBe(3);

    // Verify S/109 is never assigned as single unit price
    expect(individual?.unitPrice).not.toBe(109);
  });

  it("creates encoded WhatsApp URLs for individual package", () => {
    const url = buildRenovaWhatsAppUrl({
      packageId: "individual",
      source: "Formulario RENÖVA+",
      name: "Ana Pérez",
    });
    const parsed = new URL(url);

    expect(parsed.origin).toBe("https://wa.me");
    expect(parsed.pathname).toBe("/51938128411");
    expect(parsed.searchParams.get("text")).toContain("1 unidad a S/159");
    expect(parsed.searchParams.get("text")).toContain("Ana Pérez");
  });

  it("creates encoded WhatsApp URLs for pack 3 package", () => {
    const url = buildRenovaWhatsAppUrl({
      packageId: "pack-3",
      source: "Hero CTA",
    });
    const parsed = new URL(url);

    expect(parsed.searchParams.get("text")).toContain("pack de 3 unidades por S/327 (S/109 c/u)");
    expect(parsed.searchParams.get("text")).toContain("Hero CTA");
  });

  it("keeps pack-3 as the recommended package for continuity", () => {
    expect(getRenovaPackage("pack-3").recommended).toBe(true);
    expect(getRenovaPackage("pack-3").badge).toBe("MÁS CONVENIENTE");
  });

  it("registers approved authentic image assets", () => {
    expect(RENOVA_CONFIG.images.hero).toBe(
      "/images/renova-plus/00-portada/renova-plus-hero-berries-v2.png",
    );
    expect(RENOVA_CONFIG.images.dailyRitualSlides).toHaveLength(2);
    expect(RENOVA_CONFIG.images.dailyRitualSlides[0].src).toBe(
      "/images/renova-plus/00-portada/renova-carousel-02-preparacion.png",
    );
    expect(RENOVA_CONFIG.images.dailyRitualSlides[1].src).toBe(
      "/images/renova-plus/00-portada/renova-carousel-03-ritual.png",
    );
    expect(RENOVA_CONFIG.images.front).toBe("/images/renova-plus/renova-front-authentic.png");
    expect(RENOVA_CONFIG.images.blackJar).toBe("/images/renova-plus/renova-frasco-negro-referencia-fwp.png");
    expect(RENOVA_CONFIG.images.whiteJar).toBe("/images/renova-plus/renova-frasco-blanco-referencia-fwp.png");
    expect(RENOVA_CONFIG.images.nutrition).toBe("/images/renova-plus/renova-nutrition-authentic.png");
    expect(RENOVA_CONFIG.images.label).toBe("/images/renova-plus/renova-label-authentic.png");
  });
});
