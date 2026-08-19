import { describe, expect, it } from "vitest";
import { BIOPROST_CONFIG, buildBioProstWhatsAppUrl, getBioProstOffer } from "./bioprost.config";

describe("Bio Prost configuration", () => {
  it("uses the verified 30-tablet presentation", () => {
    expect(BIOPROST_CONFIG.verifiedProductData.units).toBe(30);
    expect(BIOPROST_CONFIG.verifiedProductData.presentation).toBe("1 frasco");
  });

  it("uses only the central corporate WhatsApp number", () => {
    expect(BIOPROST_CONFIG.commercial.whatsappNumber).toBe("51938128411");
  });

  it("configures the regular reference price", () => {
    expect(BIOPROST_CONFIG.commercial.regularPrice).toBe(159);
  });

  it("configures the single-unit offer", () => {
    const single = getBioProstOffer("single");
    expect(single).toBeDefined();
    expect(single?.units).toBe(1);
    expect(single?.total).toBe(89);
    expect(single?.savings).toBe(70);
  });

  it("configures the double-unit offer as featured", () => {
    const double = getBioProstOffer("double");
    expect(double).toBeDefined();
    expect(double?.units).toBe(2);
    expect(double?.total).toBe(149);
    expect(double?.unitPrice).toBe(74.5);
    expect(double?.savings).toBe(169);
    expect(double?.featured).toBe(true);
    expect(double?.badge).toBe("Más conveniente");
  });

  it("configures the wholesale offer", () => {
    const wholesale = getBioProstOffer("wholesale");
    expect(wholesale).toBeDefined();
    expect(wholesale?.units).toBe(5);
    expect(wholesale?.total).toBe(295);
    expect(wholesale?.unitPrice).toBe(59);
  });

  it("keeps the ingredients scoped to the 30-tablet presentation only", () => {
    const names = BIOPROST_CONFIG.verifiedProductData.ingredients.map((i) => i.name);
    expect(names).toEqual(["Saw Palmetto", "Uña de gato", "Licopeno", "Vitaminas y minerales"]);
    expect(names).not.toContain("L-Arginina");
  });

  it("registers the approved official assets", () => {
    expect(BIOPROST_CONFIG.images.front).toBe("/images/bioprost-premium/bioprost-front-official.png");
    expect(BIOPROST_CONFIG.images.editorial).toBe("/images/bioprost-premium/bioprost-editorial-lifestyle.png");
  });

  it("creates an encoded WhatsApp URL for the single offer", () => {
    const url = buildBioProstWhatsAppUrl({ offerId: "single", source: "Hero card 1 frasco" });
    const parsed = new URL(url);

    expect(parsed.origin).toBe("https://wa.me");
    expect(parsed.pathname).toBe("/51938128411");
    expect(parsed.searchParams.get("text")).toContain("1 Bio Prost por S/89");
    expect(parsed.searchParams.get("text")).toContain("Hero card 1 frasco");
  });

  it("creates an encoded WhatsApp URL for the double offer", () => {
    const url = buildBioProstWhatsAppUrl({ offerId: "double", source: "Hero card 2 frascos" });
    const parsed = new URL(url);

    expect(parsed.searchParams.get("text")).toContain("2 Bio Prost por S/149 total");
  });

  it("creates an encoded WhatsApp URL for the wholesale offer", () => {
    const url = buildBioProstWhatsAppUrl({ offerId: "wholesale", source: "Mayorista hero" });
    const parsed = new URL(url);

    expect(parsed.searchParams.get("text")).toContain("al por mayor: 5 unidades por S/295");
  });

  it("includes optional order details in the WhatsApp message when present", () => {
    const url = buildBioProstWhatsAppUrl({
      offerId: "single",
      source: "Formulario",
      name: "Ana Pérez",
      phone: "999999999",
      district: "Miraflores",
      address: "Av. Test 123",
    });
    const text = new URL(url).searchParams.get("text") ?? "";

    expect(text).toContain("Ana Pérez");
    expect(text).toContain("999999999");
    expect(text).toContain("Miraflores");
    expect(text).toContain("Av. Test 123");
  });

  it("exposes exactly 10 FAQ entries", () => {
    expect(BIOPROST_CONFIG.faqs).toHaveLength(10);
  });

  it("does not carry stale 60-tablet or L-Arginina data anywhere in the config", () => {
    const serialized = JSON.stringify(BIOPROST_CONFIG);
    expect(serialized).not.toContain("60 tabletas");
    expect(serialized).not.toContain("L-Arginina");
    expect(serialized).not.toContain("800 mg");
  });
});
