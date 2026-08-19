import { describe, it, expect } from "vitest";
import { ALPHAMAN_CONFIG, buildAlphaManWhatsAppUrl } from "./alphaman.config";

describe("ALPHAMAN_CONFIG", () => {
  it("debe contener 20 cápsulas", () => {
    expect(ALPHAMAN_CONFIG.verifiedProductData.capsules).toBe(20);
  });

  it("debe tener origen Perú", () => {
    expect(ALPHAMAN_CONFIG.verifiedProductData.origin).toBe("Perú");
  });

  it("debe contener exactamente 10 ingredientes", () => {
    expect(ALPHAMAN_CONFIG.ingredients).toHaveLength(10);
  });

  it("debe tener precios correctos", () => {
    const offers = ALPHAMAN_CONFIG.offers;
    expect(offers[0].price).toBe(79); // 1 unidad
    expect(offers[1].price).toBe(129); // 2 unidades (opción principal)
    expect(offers[2].price).toBe(275); // 5 unidades distribuidor
  });

  it("debe contener 5 beneficios", () => {
    expect(ALPHAMAN_CONFIG.benefits).toHaveLength(5);
  });

  it("debe contener 10 FAQs", () => {
    expect(ALPHAMAN_CONFIG.faqs).toHaveLength(10);
  });

  it("debe marcar oferta de 2 unidades como highlighted", () => {
    const doubleOffer = ALPHAMAN_CONFIG.offers.find((o) => o.id === "double");
    expect(doubleOffer?.highlighted).toBe(true);
  });

  it("ingredientes deben tener nombre, categoria y copy", () => {
    ALPHAMAN_CONFIG.ingredients.forEach((ing) => {
      expect(ing.name).toBeDefined();
      expect(ing.category).toMatch(/^(energía|botánicos|frutos)$/);
      expect(ing.copy).toBeDefined();
    });
  });
});

describe("buildAlphaManWhatsAppUrl", () => {
  it("debe generar URL para 1 unidad", () => {
    const url = buildAlphaManWhatsAppUrl({ source: "test", offerId: "single" });
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Hola Bismillah");
    expect(decoded).toContain("1 AlphaMan");
    expect(decoded).toContain("S/79");
  });

  it("debe generar URL para 2 unidades", () => {
    const url = buildAlphaManWhatsAppUrl({ source: "test", offerId: "double" });
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("2 AlphaMan");
    expect(decoded).toContain("S/129");
  });

  it("debe generar URL para distribuidor", () => {
    const url = buildAlphaManWhatsAppUrl({ source: "test", offerId: "wholesale" });
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("5 unidades");
    expect(decoded).toContain("S/275");
  });

  it("debe incluir datos de usuario si se proporcionan", () => {
    const url = buildAlphaManWhatsAppUrl({
      source: "test",
      offerId: "single",
      name: "Juan",
      phone: "987654321",
      district: "Lima",
      address: "Calle 123",
    });
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Juan");
    expect(decoded).toContain("987654321");
    expect(decoded).toContain("Lima");
    expect(decoded).toContain("Calle 123");
  });

  it("debe contar con todas las imágenes configuradas", () => {
    expect(ALPHAMAN_CONFIG.images.front).toBeDefined();
    expect(ALPHAMAN_CONFIG.images.editorial).toBeDefined();
    expect(ALPHAMAN_CONFIG.images.ingredients).toBeDefined();
    expect(ALPHAMAN_CONFIG.images.routine).toBeDefined();
  });
});

describe("Ingredientes organizados por categoría", () => {
  it("debe haber ingredientes de energía", () => {
    const energyIngredients = ALPHAMAN_CONFIG.ingredients.filter((i) => i.category === "energía");
    expect(energyIngredients.length).toBeGreaterThan(0);
  });

  it("debe haber ingredientes botánicos", () => {
    const botanicalIngredients = ALPHAMAN_CONFIG.ingredients.filter((i) => i.category === "botánicos");
    expect(botanicalIngredients.length).toBeGreaterThan(0);
  });

  it("debe haber ingredientes de frutos", () => {
    const fruitIngredients = ALPHAMAN_CONFIG.ingredients.filter((i) => i.category === "frutos");
    expect(fruitIngredients.length).toBeGreaterThan(0);
  });
});
