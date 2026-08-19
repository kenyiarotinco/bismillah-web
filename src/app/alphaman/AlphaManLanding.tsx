"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  MessageCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ALPHAMAN_CONFIG, buildAlphaManWhatsAppUrl } from "./alphaman.config";
import styles from "./alphaman.module.css";

type OrderField = "name" | "phone" | "district" | "address";
type OrderState = Record<OrderField, string> & { offerId: string; consent: boolean };
type OrderErrors = Partial<Record<OrderField | "consent", string>>;

function trackAlphaManEvent(event: string, detail?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, eventDetail?: Record<string, string>) => void;
  };
  const eventDetail = {
    product_slug: "alphaman",
    product_name: ALPHAMAN_CONFIG.productName,
    presentation: `${ALPHAMAN_CONFIG.verifiedProductData.capsules} cápsulas`,
    ...detail,
  };

  analyticsWindow.dataLayer?.push({ event, ...eventDetail });
  analyticsWindow.gtag?.("event", event, eventDetail);
}

export default function AlphaManLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [order, setOrder] = useState<OrderState>({
    name: "",
    phone: "",
    district: "",
    address: "",
    offerId: "double",
    consent: false,
  });
  const [errors, setErrors] = useState<OrderErrors>({});
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    trackAlphaManEvent("view_alphaman");
    const firedThresholds = new Set<number>();
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const progress = window.scrollY / scrollableHeight;
      if (progress >= 0.5 && !firedThresholds.has(50)) {
        trackAlphaManEvent("view_alphaman_benefits");
        firedThresholds.add(50);
      }
      if (progress >= 0.85 && !firedThresholds.has(85)) {
        trackAlphaManEvent("view_alphaman_offer");
        firedThresholds.add(85);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openWhatsApp = (source: string, details?: Partial<OrderState>) => {
    const offerId = details?.offerId || "single";
    const url = buildAlphaManWhatsAppUrl({
      source,
      offerId,
      name: details?.name,
      phone: details?.phone,
      district: details?.district,
      address: details?.address,
    });

    trackAlphaManEvent("click_alphaman_whatsapp", { cta_location: source });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const scrollToPricing = () => {
    document.getElementById("precios")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateField = (field: OrderField | "offerId") => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOrder((current) => ({ ...current, [field]: event.target.value }));
    if (field !== "offerId") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validateOrder = (): OrderErrors => {
    const nextErrors: OrderErrors = {};
    if (order.name.trim().length < 2) nextErrors.name = "Ingresa tu nombre para identificar la consulta.";
    if (!/^9\d{8}$/.test(order.phone.replace(/\D/g, ""))) {
      nextErrors.phone = "Ingresa un celular peruano de 9 dígitos que empiece con 9.";
    }
    if (order.district.trim().length < 2) nextErrors.district = "Indica tu distrito para consultar la entrega.";
    if (order.address.trim().length < 8) nextErrors.address = "Ingresa una dirección o referencia suficiente para coordinar.";
    if (!order.consent) nextErrors.consent = "Necesitamos tu consentimiento para abrir la consulta por WhatsApp.";
    return nextErrors;
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateOrder();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormStatus("Revisa los campos indicados antes de continuar.");
      return;
    }

    trackAlphaManEvent("submit_alphaman_consultation", { offerId: order.offerId });
    setFormStatus("Abrimos WhatsApp con tu solicitud. Confirma los datos con el equipo antes de coordinar el pedido.");
    openWhatsApp("Formulario de pedido AlphaMan", order);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#contenido">
        Ir al contenido principal
      </a>

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Ir al inicio de Bismillah">
          <span>BISMILLAH</span>
          <strong>AlphaMan</strong>
        </Link>
        <nav className={styles.navigation} aria-label="Navegación de AlphaMan">
          <a href="#beneficios">Beneficios</a>
          <a href="#formula">Fórmula</a>
          <a href="#ingredientes">Ingredientes</a>
          <a href="#rutina">Rutina</a>
          <a href="#precios">Precios</a>
          <a href="#faq">Preguntas</a>
        </nav>
        <button className={styles.headerCta} type="button" onClick={scrollToPricing}>
          Pedir AlphaMan
        </button>
      </header>

      <div id="contenido">
        <section className={styles.hero} aria-labelledby="alphaman-title">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>Bismillah Men's Wellness</p>
              <h1 id="alphaman-title">AlphaMan</h1>
              <p className={styles.heroHeadline}>
                Fortaleza masculina para acompañar tu mejor versión.
              </p>
              <p className={styles.heroCopy}>
                Una fórmula natural de {ALPHAMAN_CONFIG.verifiedProductData.capsules} cápsulas desarrollada con
                ingredientes seleccionados para acompañar la energía, la vitalidad y el bienestar masculino.
              </p>
              <ul className={styles.heroChips} aria-label="Datos clave de AlphaMan">
                <li className={styles.chip}>{ALPHAMAN_CONFIG.verifiedProductData.capsules} cápsulas</li>
                <li className={styles.chip}>100% Natural</li>
                <li className={styles.chip}>Fórmula botánica</li>
                <li className={styles.chip}>Bienestar masculino</li>
              </ul>

              <div className={styles.heroPricing}>
                <div className={styles.priceCard}>
                  <p className={styles.priceLabel}>1 AlphaMan</p>
                  <p className={styles.price}>S/79</p>
                  <button
                    className={styles.primaryButton}
                    type="button"
                    onClick={() => openWhatsApp("Hero - 1 unidad", { offerId: "single" })}
                  >
                    Pedir 1
                  </button>
                </div>

                <div className={`${styles.priceCard} ${styles.highlighted}`}>
                  <div className={styles.badge}>Más conveniente</div>
                  <p className={styles.priceLabel}>2 AlphaMan</p>
                  <p className={styles.price}>S/129</p>
                  <span className={styles.total}>total</span>
                  <button
                    className={styles.primaryButton}
                    type="button"
                    onClick={() => openWhatsApp("Hero - 2 unidades", { offerId: "double" })}
                  >
                    Pedir 2
                  </button>
                </div>

                <div className={styles.priceCard}>
                  <p className={styles.priceLabel}>Distribuidor</p>
                  <p className={styles.priceSmall}>Desde 5 unidades</p>
                  <p className={styles.price}>S/275</p>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => openWhatsApp("Hero - Distribuidor", { offerId: "wholesale" })}
                  >
                    Consultar
                  </button>
                </div>
              </div>

              <div className={styles.heroActions}>
                <button className={styles.primaryButton} type="button" onClick={scrollToPricing}>
                  Consultar AlphaMan <ArrowRight aria-hidden="true" size={16} />
                </button>
                <a className={styles.secondaryButton} href="#formula">
                  Conocer la fórmula
                </a>
              </div>

              <p className={styles.heroNote}>
                Disponibilidad, precio vigente, entrega y medios de pago se confirman antes de coordinar el pedido.
              </p>
            </div>

            <div className={styles.heroVisual}>
              <Image
                src={ALPHAMAN_CONFIG.images.front}
                alt="Frasco AlphaMan de 20 cápsulas."
                width={280}
                height={380}
                priority
                sizes="(max-width: 900px) 70vw, 280px"
                className={styles.heroImage}
              />
            </div>
          </div>
        </section>

        <section className={styles.trustStrip} aria-label="Datos clave del producto">
          <div className={styles.trustInner}>
            <div className={styles.trustItem}>
              <strong>{ALPHAMAN_CONFIG.verifiedProductData.capsules}</strong>
              <span>Cápsulas</span>
            </div>
            <div className={styles.trustItem}>
              <strong>100%</strong>
              <span>Natural</span>
            </div>
            <div className={styles.trustItem}>
              <strong>10</strong>
              <span>Ingredientes destacados</span>
            </div>
            <div className={styles.trustItem}>
              <strong>1</strong>
              <span>Fórmula</span>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="story-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Fortaleza masculina</p>
            <h2 id="story-title">La energía también forma parte de cómo te sientes.</h2>
          </div>
          <p className={styles.body}>
            Trabajo, responsabilidades, cansancio y rutina pueden afectar la forma en que vivimos nuestro bienestar.
            AlphaMan propone incorporar una fórmula natural dentro de una rutina masculina más consciente, activa y
            segura.
          </p>
          {ALPHAMAN_CONFIG.images.editorial && (
            <div className={styles.storyImage}>
              <Image
                src={ALPHAMAN_CONFIG.images.editorial}
                alt="AlphaMan como parte de una rutina de bienestar masculino."
                width={600}
                height={400}
                sizes="(max-width: 900px) 100vw, 600px"
                className={styles.image}
              />
            </div>
          )}
        </section>

        <section id="beneficios" className={styles.section} aria-labelledby="benefits-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Tu bienestar</p>
            <h2 id="benefits-title">Más energía. Más confianza. Más Alpha.</h2>
          </div>
          <div className={styles.benefitsGrid}>
            {ALPHAMAN_CONFIG.benefits.map((benefit) => (
              <div key={benefit.n} className={styles.benefitCard}>
                <div className={styles.benefitNumber}>{benefit.n}</div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitSubtitle}>{benefit.subtitle}</p>
                <p className={styles.benefitCopy}>{benefit.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="formula" className={styles.section} aria-labelledby="formula-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Fórmula AlphaMan</p>
            <h2 id="formula-title">Naturaleza, tradición y vitalidad en una sola fórmula.</h2>
          </div>
          {ALPHAMAN_CONFIG.images.ingredients && (
            <div className={styles.formulaImage}>
              <Image
                src={ALPHAMAN_CONFIG.images.ingredients}
                alt="Ingredientes naturales de AlphaMan."
                width={600}
                height={400}
                sizes="(max-width: 900px) 100vw, 600px"
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.formulaTags}>
            {ALPHAMAN_CONFIG.ingredients.map((ing) => (
              <span key={ing.name} className={styles.tag}>
                {ing.name}
              </span>
            ))}
          </div>
        </section>

        <section id="ingredientes" className={styles.section} aria-labelledby="ingredients-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Lo que hay dentro importa</p>
            <h2 id="ingredients-title">Ingredientes de la fórmula.</h2>
          </div>

          <div className={styles.ingredientsGroups}>
            {["energía", "botánicos", "frutos"].map((category) => {
              const ingredients = ALPHAMAN_CONFIG.ingredients.filter((ing) => ing.category === category);
              const categoryLabel =
                category === "energía"
                  ? "Energía"
                  : category === "botánicos"
                    ? "Botánicos"
                    : "Frutos";

              return (
                <div key={category} className={styles.ingredientGroup}>
                  <h3 className={styles.groupTitle}>{categoryLabel}</h3>
                  <div className={styles.ingredientsList}>
                    {ingredients.map((ingredient) => (
                      <article key={ingredient.name} className={styles.ingredientCard}>
                        <p className={styles.ingredientName}>{ingredient.name}</p>
                        <p className={styles.ingredientTitle}>{ingredient.title}</p>
                        <p className={styles.ingredientCopy}>{ingredient.copy}</p>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="rutina" className={styles.section} aria-labelledby="routine-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Tu rutina AlphaMan</p>
            <h2 id="routine-title">Una rutina sencilla para acompañar tu bienestar.</h2>
          </div>

          {ALPHAMAN_CONFIG.images.routine && (
            <div className={styles.routineImage}>
              <Image
                src={ALPHAMAN_CONFIG.images.routine}
                alt="Rutina de consumo de AlphaMan."
                width={600}
                height={400}
                sizes="(max-width: 900px) 100vw, 600px"
                className={styles.image}
              />
            </div>
          )}

          <div className={styles.usageGuide}>
            <div className={styles.usageOption}>
              <h3>Si tienes actividad íntima frecuente</h3>
              <p className={styles.dosage}>{ALPHAMAN_CONFIG.usage.frequent.dosage}</p>
              <p>{ALPHAMAN_CONFIG.usage.frequent.copy}</p>
            </div>

            <div className={styles.usageOption}>
              <h3>Si la actividad es menos frecuente</h3>
              <p className={styles.dosage}>{ALPHAMAN_CONFIG.usage.occasional.dosage}</p>
              <p>{ALPHAMAN_CONFIG.usage.occasional.copy}</p>
            </div>
          </div>

          <div className={styles.usageNote}>
            <p>
              <strong>Hidratación:</strong> {ALPHAMAN_CONFIG.usage.hydration}
            </p>
            <p style={{ marginTop: "1rem" }}>
              <strong>Importante:</strong> {ALPHAMAN_CONFIG.usage.note}
            </p>
          </div>
        </section>

        <section id="precios" className={styles.section} aria-labelledby="pricing-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Elige tu opción</p>
            <h2 id="pricing-title">AlphaMan según tu forma de comprar.</h2>
          </div>

          <div className={styles.pricingCards}>
            {ALPHAMAN_CONFIG.offers.map((offer) => (
              <div
                key={offer.id}
                className={`${styles.pricingCard} ${offer.highlighted ? styles.highlighted : ""}`}
              >
                {offer.badge && <div className={styles.badge}>{offer.badge}</div>}
                <p className={styles.offerLabel}>{offer.label}</p>
                <p className={styles.price}>S/{offer.total}</p>
                {offer.unitPrice && <p className={styles.unitPrice}>S/{offer.unitPrice} c/u</p>}
                <button
                  className={offer.highlighted ? styles.primaryButton : styles.secondaryButton}
                  type="button"
                  onClick={() =>
                    offer.id === "wholesale"
                      ? openWhatsApp(`Pricing - ${offer.label}`, { offerId: offer.id })
                      : openWhatsApp(`Pricing - ${offer.label}`, { offerId: offer.id })
                  }
                >
                  {offer.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="form-title">
          <form className={styles.consultForm} onSubmit={submitOrder}>
            <div className={styles.formHeading}>
              <h2 id="form-title">Pedido asistido</h2>
              <p>Completa tu información y abrimos WhatsApp para coordinar contigo.</p>
            </div>

            <div className={styles.formField}>
              <label htmlFor="offer">Oferta</label>
              <select
                id="offer"
                value={order.offerId}
                onChange={updateField("offerId")}
                className={styles.input}
              >
                {ALPHAMAN_CONFIG.offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.label} — S/{offer.total}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                value={order.name}
                onChange={updateField("name")}
                className={`${styles.input} ${errors.name ? styles.error : ""}`}
                placeholder="Tu nombre"
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            <div className={styles.formField}>
              <label htmlFor="phone">Celular peruano</label>
              <input
                id="phone"
                type="tel"
                value={order.phone}
                onChange={updateField("phone")}
                className={`${styles.input} ${errors.phone ? styles.error : ""}`}
                placeholder="9XXXXXXXX"
              />
              {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
            </div>

            <div className={styles.formField}>
              <label htmlFor="district">Distrito</label>
              <input
                id="district"
                type="text"
                value={order.district}
                onChange={updateField("district")}
                className={`${styles.input} ${errors.district ? styles.error : ""}`}
                placeholder="Tu distrito"
              />
              {errors.district && <span className={styles.errorMessage}>{errors.district}</span>}
            </div>

            <div className={styles.formField}>
              <label htmlFor="address">Dirección o referencia</label>
              <input
                id="address"
                type="text"
                value={order.address}
                onChange={updateField("address")}
                className={`${styles.input} ${errors.address ? styles.error : ""}`}
                placeholder="Dirección o referencia"
              />
              {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
            </div>

            <div className={styles.formField}>
              <label>
                <input
                  type="checkbox"
                  checked={order.consent}
                  onChange={(e) => {
                    setOrder((current) => ({ ...current, consent: e.target.checked }));
                    setErrors((current) => ({ ...current, consent: undefined }));
                  }}
                  className={styles.checkbox}
                />
                <span>Autorizo abrir WhatsApp para coordinar esta consulta comercial.</span>
              </label>
              {errors.consent && <span className={styles.errorMessage}>{errors.consent}</span>}
            </div>

            {formStatus && <p className={styles.formStatus}>{formStatus}</p>}

            <button type="submit" className={styles.primaryButton}>
              Enviar consulta por WhatsApp
            </button>
          </form>
        </section>

        <section id="faq" className={styles.section} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Preguntas frecuentes</p>
            <h2 id="faq-title">Información sencilla para elegir con calma.</h2>
          </div>

          <div className={styles.faqList}>
            {ALPHAMAN_CONFIG.faqs.map((faq, idx) => (
              <article key={idx} className={styles.faqItem}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className={styles.faqButton}
                    aria-expanded={openFaq === idx}
                  >
                    {faq.question}
                    <ChevronDown aria-hidden="true" size={20} className={styles.chevron} />
                  </button>
                </h3>
                {openFaq === idx && <p className={styles.faqAnswer}>{faq.answer}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaFinal}>
          <div className={styles.ctaInner}>
            <h2>Activa tu mejor versión.</h2>
            <p>Energía, vitalidad y una fórmula natural pensada para acompañar el bienestar masculino.</p>
            <div className={styles.ctaButtons}>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => openWhatsApp("CTA Final")}
              >
                Pedir AlphaMan
              </button>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => openWhatsApp("CTA Final - Distribuir", { offerId: "wholesale" })}
              >
                Quiero Distribuir
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <p>
          AlphaMan es un suplemento alimenticio. No sustituye el diagnóstico, tratamiento ni orientación de un
          profesional de salud.
        </p>
        <p>Registro Sanitario DIGESA N8332621N/NAPAEI. Distribuido por Bismillah.</p>
      </footer>
    </main>
  );
}
