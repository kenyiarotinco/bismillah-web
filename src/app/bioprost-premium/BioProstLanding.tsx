"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { BIOPROST_CONFIG, type BioProstOfferId, buildBioProstWhatsAppUrl, getBioProstOffer } from "./bioprost.config";
import styles from "./bioprost.module.css";

type OrderField = "name" | "phone" | "district" | "address";
type OrderState = Record<OrderField, string> & { offerId: BioProstOfferId; consent: boolean };
type OrderErrors = Partial<Record<OrderField | "consent", string>>;

const DEFAULT_OFFER: BioProstOfferId = "double";

function trackBioProstEvent(event: string, detail?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, eventDetail?: Record<string, string>) => void;
  };
  const eventDetail = {
    product_slug: "bioprost-premium",
    product_name: BIOPROST_CONFIG.productName,
    ...detail,
  };

  analyticsWindow.dataLayer?.push({ event, ...eventDetail });
  analyticsWindow.gtag?.("event", event, eventDetail);
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function BioProstLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [order, setOrder] = useState<OrderState>({
    name: "",
    phone: "",
    district: "",
    address: "",
    offerId: DEFAULT_OFFER,
    consent: false,
  });
  const [errors, setErrors] = useState<OrderErrors>({});
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    trackBioProstEvent("view_bioprost");
    const firedThresholds = new Set<number>();
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const progress = window.scrollY / scrollableHeight;
      if (progress >= 0.5 && !firedThresholds.has(50)) {
        trackBioProstEvent("view_bioprost_formula");
        firedThresholds.add(50);
      }
      if (progress >= 0.85 && !firedThresholds.has(85)) {
        trackBioProstEvent("view_bioprost_offer");
        firedThresholds.add(85);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openWhatsAppOffer = (offerId: BioProstOfferId, source: string, details?: Partial<OrderState>) => {
    const url = buildBioProstWhatsAppUrl({
      offerId,
      source,
      name: details?.name,
      phone: details?.phone,
      district: details?.district,
      address: details?.address,
    });

    trackBioProstEvent("click_bioprost_whatsapp", { cta_location: source, offer: offerId });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const updateField = (field: OrderField) => (event: ChangeEvent<HTMLInputElement>) => {
    setOrder((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
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

    trackBioProstEvent("submit_bioprost_consultation", { offer: order.offerId });
    setFormStatus("Abrimos WhatsApp con tu solicitud. Confirma los datos con el equipo antes de coordinar el pedido.");
    openWhatsAppOffer(order.offerId, "Formulario de pedido Bio Prost", order);
  };

  const offers = BIOPROST_CONFIG.commercial.offers;
  const singleOffer = getBioProstOffer("single")!;
  const doubleOffer = getBioProstOffer("double")!;
  const wholesaleOffer = getBioProstOffer("wholesale")!;

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#contenido">
        Ir al contenido principal
      </a>

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Ir al inicio de Bismillah">
          <span>BISMILLAH</span>
          <strong>Bio Prost</strong>
        </Link>
        <nav className={styles.navigation} aria-label="Navegación de Bio Prost">
          <a href="#beneficios">Beneficios</a>
          <a href="#formula">Fórmula</a>
          <a href="#rutina">Rutina</a>
          <a href="#precios">Precios</a>
          <a href="#faq">Preguntas</a>
        </nav>
        <button className={styles.headerCta} type="button" onClick={() => scrollToId("precios")}>
          Pedir Bio Prost
        </button>
      </header>

      <div id="contenido">
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="bioprost-title">
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Bismillah Men&apos;s Wellness</p>
            <h1 id="bioprost-title">Bio Prost</h1>
            <p className={styles.heroSubheadline}>Cuidado masculino que sí puede formar parte de tu rutina.</p>
            <p className={styles.heroCopy}>
              Una fórmula de bienestar masculino en presentación de {BIOPROST_CONFIG.verifiedProductData.units}{" "}
              tabletas, desarrollada con ingredientes seleccionados para acompañar una rutina consciente de cuidado y
              vitalidad.
            </p>

            <div className={styles.heroVisual}>
              <Image
                src={BIOPROST_CONFIG.images.front}
                alt="Frasco Bio Prost de 30 tabletas."
                fill
                priority
                sizes="(max-width: 960px) 72vw, 45vw"
                className={styles.heroVisualImage}
              />
            </div>

            <ul className={styles.heroChips} aria-label="Datos clave de Bio Prost">
              <li className={styles.chip}>{BIOPROST_CONFIG.verifiedProductData.units} tabletas</li>
              <li className={styles.chip}>Nueva fórmula</li>
              <li className={styles.chip}>Fórmula botánica</li>
              <li className={styles.chip}>Bienestar masculino</li>
            </ul>

            <div className={styles.heroCommercial} aria-label="Precios de Bio Prost">
              <p className={styles.regularPrice}>
                Precio regular <s>S/{BIOPROST_CONFIG.commercial.regularPrice}</s>
              </p>
              <div className={styles.offerGridHero}>
                <div className={styles.offerCard}>
                  <span className={styles.offerLabel}>{singleOffer.label}</span>
                  <strong className={styles.offerPrice}>S/{singleOffer.total}</strong>
                  <span className={styles.offerSavings}>Ahorras S/{singleOffer.savings}</span>
                  <button
                    className={styles.offerCardCta}
                    type="button"
                    onClick={() => openWhatsAppOffer("single", "Hero card 1 frasco")}
                  >
                    {singleOffer.ctaLabel} <ArrowRight aria-hidden="true" size={14} />
                  </button>
                </div>
                <div className={`${styles.offerCard} ${styles.offerCardFeatured}`}>
                  {doubleOffer.badge && <span className={styles.offerBadge}>{doubleOffer.badge}</span>}
                  <span className={styles.offerLabel}>{doubleOffer.label}</span>
                  <strong className={styles.offerPrice}>
                    S/{doubleOffer.total} <small>total</small>
                  </strong>
                  <span className={styles.offerUnit}>S/{doubleOffer.unitPrice.toFixed(2)} c/u</span>
                  <span className={styles.offerSavings}>Ahorras S/{doubleOffer.savings}</span>
                  <button
                    className={styles.offerCardCtaFeatured}
                    type="button"
                    onClick={() => openWhatsAppOffer("double", "Hero card 2 frascos")}
                  >
                    {doubleOffer.ctaLabel} <ArrowRight aria-hidden="true" size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.heroWholesale}>
              <p className={styles.wholesaleEyebrow}>Mayorista</p>
              <p className={styles.wholesaleDetail}>
                Desde {wholesaleOffer.units} unidades — {wholesaleOffer.units} por S/{wholesaleOffer.total}{" "}
                <span>(S/{wholesaleOffer.unitPrice} c/u)</span>
              </p>
              <button
                className={styles.wholesaleButton}
                type="button"
                onClick={() => openWhatsAppOffer("wholesale", "Mayorista hero")}
              >
                Consultar mayorista <ArrowRight aria-hidden="true" size={14} />
              </button>
            </div>

            <div className={styles.heroActions}>
              <a className={styles.heroSecondaryButton} href="#formula">
                Conocer la fórmula
              </a>
            </div>

            <div className={styles.heroTrust}>
              <ul className={styles.trustListHero}>
                <li>
                  <Check aria-hidden="true" size={15} /> Pago contra entrega
                </li>
                <li>
                  <Check aria-hidden="true" size={15} /> Delivery gratis según cobertura
                </li>
                <li>
                  <Check aria-hidden="true" size={15} /> Atención directa por WhatsApp
                </li>
              </ul>
              <p className={styles.fineprint}>{BIOPROST_CONFIG.commercial.disclaimer}</p>
            </div>
          </div>
        </section>

        {/* PRODUCT FACTS */}
        <section className={styles.strip} aria-label="Datos clave del producto">
          <div className={styles.stripInner}>
            {BIOPROST_CONFIG.facts.map((fact) => (
              <div className={styles.stripItem} key={fact.label}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* EDITORIAL / STORYTELLING */}
        <section className={styles.section} aria-labelledby="context-title">
          <div className={`${styles.grid} ${styles.editorialGrid}`}>
            <div className={styles.editorialImageWrap}>
              <Image
                src={BIOPROST_CONFIG.images.editorial}
                alt="Bio Prost como parte de una rutina de cuidado masculino."
                fill
                sizes="(max-width: 700px) 100vw, 40vw"
                className={styles.editorialImage}
              />
            </div>
            <div>
              <p className={styles.eyebrow}>Bienestar masculino</p>
              <div className={styles.sectionHeading}>
                <h2 id="context-title">Cuidarte no debería quedar para después.</h2>
              </div>
              <p className={styles.body}>
                Entre trabajo, responsabilidades y rutina, el cuidado personal suele quedar en segundo plano. Bio
                Prost propone una forma simple de incorporar una decisión consciente dentro de tus hábitos
                cotidianos.
              </p>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section id="beneficios" className={styles.section} aria-labelledby="beneficios-title">
          <p className={styles.eyebrow}>Cuatro pilares</p>
          <div className={styles.sectionHeading}>
            <h2 id="beneficios-title">Bienestar masculino pensado para tu día a día.</h2>
          </div>
          <p className={styles.body}>{BIOPROST_CONFIG.pillarsIntro}</p>
          <div className={styles.pillarsGrid}>
            {BIOPROST_CONFIG.pillars.map((pillar) => (
              <div className={styles.pillarItem} key={pillar.n}>
                <p className={styles.pillarNumber}>{pillar.n}</p>
                <p className={styles.pillarEyebrow}>{pillar.eyebrow}</p>
                <p className={styles.pillarTitle}>{pillar.title}</p>
                <p className={styles.pillarCopy}>{pillar.copy}</p>
              </div>
            ))}
          </div>
          <p className={styles.note}>
            Esta información describe el posicionamiento nutricional del producto y no sustituye una evaluación
            médica.
          </p>
        </section>

        {/* FÓRMULA — sección protagonista */}
        <section id="formula" className={styles.formulaSection} aria-labelledby="formula-title">
          <div className={styles.formulaInner}>
            <p className={styles.eyebrow}>Fórmula Bio Prost</p>
            <div className={styles.sectionHeading}>
              <h2 id="formula-title" className={styles.formulaHeading}>
                Una fórmula botánica pensada para acompañar el bienestar masculino.
              </h2>
            </div>

            <div className={styles.formulaCore}>
              <div className={styles.formulaMedallion}>
                <span>Bio Prost</span>
                <strong>{BIOPROST_CONFIG.verifiedProductData.units} tabletas</strong>
              </div>
              <ul className={styles.formulaTags}>
                {BIOPROST_CONFIG.verifiedProductData.formulaTags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
            <p className={styles.formulaMicrocopy}>{BIOPROST_CONFIG.verifiedProductData.formulaMicrocopy}</p>
          </div>
        </section>

        {/* INGREDIENTES */}
        <section id="ingredientes" className={styles.section} aria-labelledby="ingredientes-title">
          <div className={styles.sectionHeading}>
            <h2 id="ingredientes-title">Conoce lo que forma parte de Bio Prost.</h2>
          </div>
          <ul className={styles.ingredientList}>
            {BIOPROST_CONFIG.verifiedProductData.ingredients.map((ingredient, index) => (
              <li className={styles.ingredientRow} key={ingredient.name}>
                <span className={styles.ingredientIndex}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className={styles.ingredientName}>{ingredient.name}</p>
                  <p className={styles.ingredientCopy}>{ingredient.copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* RUTINA */}
        <section id="rutina" className={styles.section} aria-labelledby="routine-title">
          <p className={styles.eyebrow}>Tu rutina Bio Prost</p>
          <div className={styles.sectionHeading}>
            <h2 id="routine-title">Haz del cuidado personal parte de tu día.</h2>
          </div>
          <div className={styles.routineGrid}>
            {BIOPROST_CONFIG.routine.map((step) => (
              <div className={styles.routineItem} key={step.n}>
                <p className={styles.pillarNumber}>{step.n}</p>
                <p className={styles.pillarTitle}>{step.title}</p>
                <p className={styles.pillarCopy}>{step.copy}</p>
              </div>
            ))}
          </div>
          <p className={styles.note}>{BIOPROST_CONFIG.routineNote}</p>
        </section>

        {/* POR QUÉ BIO PROST */}
        <section className={styles.section} aria-labelledby="comparativa-title">
          <p className={styles.eyebrow}>Una decisión informada</p>
          <div className={styles.sectionHeading}>
            <h2 id="comparativa-title">Más que comprar un suplemento: saber qué estás eligiendo.</h2>
          </div>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <p className={styles.comparisonTitle}>{BIOPROST_CONFIG.comparison.product.title}</p>
              <ul className={styles.comparisonList}>
                {BIOPROST_CONFIG.comparison.product.points.map((point) => (
                  <li key={point}>
                    <Check aria-hidden="true" size={15} /> {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${styles.comparisonCard} ${styles.comparisonCardFeatured}`}>
              <p className={styles.comparisonTitle}>{BIOPROST_CONFIG.comparison.bismillah.title}</p>
              <ul className={styles.comparisonList}>
                {BIOPROST_CONFIG.comparison.bismillah.points.map((point) => (
                  <li key={point}>
                    <Check aria-hidden="true" size={15} /> {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PRECIOS (segunda aparición) */}
        <section id="precios" className={styles.section} aria-labelledby="precios-title">
          <p className={styles.eyebrow}>Elige tu opción</p>
          <div className={styles.sectionHeading}>
            <h2 id="precios-title">Una alternativa para cada forma de comprar.</h2>
          </div>

          <div className={styles.pricingGridFull}>
            {offers.map((offer) => (
              <div
                className={`${styles.pricingCard} ${offer.featured ? styles.pricingCardFeatured : ""}`}
                key={offer.id}
              >
                {offer.badge && <span className={styles.offerBadge}>{offer.badge}</span>}
                <span className={styles.offerLabel}>{offer.label}</span>
                <strong className={styles.offerPrice}>
                  S/{offer.total} {offer.units > 1 && <small>total</small>}
                </strong>
                {offer.units > 1 && <span className={styles.offerUnit}>S/{offer.unitPrice.toFixed(2)} c/u</span>}
                <span className={styles.offerSavings}>Ahorras S/{offer.savings}</span>
                <button
                  className={offer.featured ? styles.offerCardCtaFeatured : styles.offerCardCta}
                  type="button"
                  onClick={() => openWhatsAppOffer(offer.id, `Precios ${offer.id}`)}
                >
                  {offer.ctaLabel} <ArrowRight aria-hidden="true" size={14} />
                </button>
              </div>
            ))}
          </div>

          <ul className={styles.trustListHero}>
            <li>
              <Check aria-hidden="true" size={15} /> {BIOPROST_CONFIG.commercial.paymentOnDelivery}
            </li>
            <li>
              <Check aria-hidden="true" size={15} /> {BIOPROST_CONFIG.commercial.freeDelivery}
            </li>
          </ul>

          <form className={styles.form} onSubmit={submitOrder} noValidate>
            <p className={styles.formHeading}>Pedido asistido</p>
            <div className={styles.field}>
              <label htmlFor="bioprost-offer">Oferta</label>
              <select
                id="bioprost-offer"
                value={order.offerId}
                onChange={(event) =>
                  setOrder((current) => ({ ...current, offerId: event.target.value as BioProstOfferId }))
                }
              >
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.formLabel}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="bioprost-name">Nombre</label>
              <input
                id="bioprost-name"
                value={order.name}
                onChange={updateField("name")}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "bioprost-name-error" : undefined}
              />
              {errors.name && (
                <p className={styles.fieldError} id="bioprost-name-error">
                  {errors.name}
                </p>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="bioprost-phone">Celular peruano</label>
              <input
                id="bioprost-phone"
                value={order.phone}
                onChange={updateField("phone")}
                inputMode="numeric"
                autoComplete="tel"
                placeholder="9XXXXXXXX"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "bioprost-phone-error" : undefined}
              />
              {errors.phone && (
                <p className={styles.fieldError} id="bioprost-phone-error">
                  {errors.phone}
                </p>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="bioprost-district">Distrito</label>
              <input
                id="bioprost-district"
                value={order.district}
                onChange={updateField("district")}
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.district)}
                aria-describedby={errors.district ? "bioprost-district-error" : undefined}
              />
              {errors.district && (
                <p className={styles.fieldError} id="bioprost-district-error">
                  {errors.district}
                </p>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="bioprost-address">Dirección o referencia</label>
              <input
                id="bioprost-address"
                value={order.address}
                onChange={updateField("address")}
                autoComplete="street-address"
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? "bioprost-address-error" : undefined}
              />
              {errors.address && (
                <p className={styles.fieldError} id="bioprost-address-error">
                  {errors.address}
                </p>
              )}
            </div>
            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={order.consent}
                onChange={(event) => {
                  setOrder((current) => ({ ...current, consent: event.target.checked }));
                  setErrors((current) => ({ ...current, consent: undefined }));
                }}
              />
              <span>Autorizo abrir WhatsApp para coordinar esta consulta comercial.</span>
            </label>
            {errors.consent && <p className={styles.fieldError}>{errors.consent}</p>}
            <button className={styles.submitButton} type="submit">
              <MessageCircle aria-hidden="true" size={16} /> Enviar consulta por WhatsApp
            </button>
            <p className={styles.formStatus} aria-live="polite">
              {formStatus}
            </p>
          </form>
        </section>

        {/* CONFIANZA */}
        <section className={styles.section} aria-labelledby="support-title">
          <p className={styles.eyebrow}>Confianza Bismillah</p>
          <div className={styles.sectionHeading}>
            <h2 id="support-title">Una consulta clara antes de decidir.</h2>
          </div>
          <div className={styles.trustGrid}>
            <article>
              <ShieldCheck aria-hidden="true" />
              <h3>Producto identificable</h3>
              <p>Registro sanitario e ingredientes verificables antes de tu compra.</p>
            </article>
            <article>
              <MessageCircle aria-hidden="true" />
              <h3>Atención directa</h3>
              <p>La conversación comercial continúa por WhatsApp, con los datos que tú confirmes.</p>
            </article>
            <article>
              <Truck aria-hidden="true" />
              <h3>Entrega por confirmar</h3>
              <p>Distrito, plazos y condiciones se revisan contigo antes de coordinar.</p>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className={styles.section} aria-labelledby="faq-title">
          <p className={styles.eyebrow}>Preguntas frecuentes</p>
          <div className={styles.sectionHeading}>
            <h2 id="faq-title">Información sencilla para elegir con calma.</h2>
          </div>
          <div className={styles.faqList}>
            {BIOPROST_CONFIG.faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <article className={styles.faqItem} key={faq.question}>
                  <h3>
                    <button
                      type="button"
                      className={styles.faqButton}
                      aria-expanded={isOpen}
                      aria-controls={`bioprost-faq-${index}`}
                      onClick={() => {
                        setOpenFaq(isOpen ? null : index);
                        trackBioProstEvent("open_bioprost_faq", { cta_location: `faq-${index + 1}` });
                      }}
                    >
                      <span>
                        <CircleHelp aria-hidden="true" size={16} /> {faq.question}
                      </span>
                      <ChevronDown aria-hidden="true" className={isOpen ? styles.chevronOpen : undefined} size={16} />
                    </button>
                  </h3>
                  <div id={`bioprost-faq-${index}`} className={isOpen ? styles.faqAnswerOpen : styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <p className={styles.eyebrow}>Bio Prost · Bismillah Men&apos;s Wellness</p>
          <h2 id="closing-title">Tu bienestar también merece un lugar en tu rutina.</h2>
          <p>Conoce Bio Prost, elige tu presentación y coordina tu pedido directamente con Bismillah.</p>
          <div className={styles.heroActions} style={{ justifyContent: "center" }}>
            <button
              className={styles.heroPrimaryButton}
              type="button"
              onClick={() => openWhatsAppOffer(DEFAULT_OFFER, "Cierre Bio Prost")}
            >
              <MessageCircle aria-hidden="true" size={16} /> Pedir Bio Prost
            </button>
            <button
              className={styles.heroSecondaryButton}
              type="button"
              onClick={() => openWhatsAppOffer("wholesale", "Cierre Bio Prost mayorista")}
            >
              Consultar mayorista
            </button>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>
            Bio Prost es un suplemento alimenticio. No sustituye el diagnóstico, tratamiento ni orientación de un
            profesional de salud.
          </p>
          <p>Registro Sanitario {BIOPROST_CONFIG.verifiedProductData.sanitaryRegistry}. Distribuido por Bismillah.</p>
        </footer>
      </div>

      <div className={styles.mobileCta}>
        <div className={styles.mobileCtaText}>
          <strong>Bio Prost</strong>
          <span>Desde S/{singleOffer.total}</span>
        </div>
        <button type="button" onClick={() => scrollToId("precios")}>
          Pedir <ArrowRight aria-hidden="true" size={14} />
        </button>
      </div>
      <button
        className={styles.floatingWhatsApp}
        type="button"
        onClick={() => openWhatsAppOffer(DEFAULT_OFFER, "Botón flotante Bio Prost")}
        aria-label="Consultar Bio Prost por WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
      </button>
    </main>
  );
}
