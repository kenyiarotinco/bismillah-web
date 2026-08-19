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
import { BIOPROST_CONFIG, type BioProstPackageId, buildBioProstWhatsAppUrl } from "./bioprost.config";
import styles from "./bioprost.module.css";

type OrderField = "name" | "phone" | "district" | "address";
type OrderState = Record<OrderField, string> & { quantity: string; consent: boolean };
type OrderErrors = Partial<Record<OrderField | "consent", string>>;

function trackBioProstEvent(event: string, detail?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, eventDetail?: Record<string, string>) => void;
  };
  const eventDetail = {
    product_slug: "bioprost-premium",
    product_name: BIOPROST_CONFIG.productName,
    presentation: `${BIOPROST_CONFIG.verifiedProductData.units} tabletas`,
    ...detail,
  };

  analyticsWindow.dataLayer?.push({ event, ...eventDetail });
  analyticsWindow.gtag?.("event", event, eventDetail);
}

export default function BioProstLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [order, setOrder] = useState<OrderState>({
    name: "",
    phone: "",
    district: "",
    address: "",
    quantity: "1",
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

  const openWhatsApp = (source: string, details?: Partial<OrderState>) => {
    const url = buildBioProstWhatsAppUrl({
      source,
      name: details?.name,
      phone: details?.phone,
      district: details?.district,
      address: details?.address,
      quantity: details?.quantity,
    });

    trackBioProstEvent("click_bioprost_whatsapp", { cta_location: source });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const scrollToOffer = () => {
    document.getElementById("pedido")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToFormula = () => {
    document.getElementById("formula")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openWhatsAppPackage = (packageId: BioProstPackageId, source: string) => {
    const url = buildBioProstWhatsAppUrl({ source, packageId });
    trackBioProstEvent("click_bioprost_whatsapp", { cta_location: source, package: packageId });
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

    trackBioProstEvent("submit_bioprost_consultation", { quantity: order.quantity });
    setFormStatus("Abrimos WhatsApp con tu solicitud. Confirma los datos con el equipo antes de coordinar el pedido.");
    openWhatsApp("Formulario de pedido BioProst Premium", order);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#contenido">
        Ir al contenido principal
      </a>

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Ir al inicio de Bismillah">
          <span>BISMILLAH</span>
          <strong>BioProst Premium</strong>
        </Link>
        <nav className={styles.navigation} aria-label="Navegación de BioProst Premium">
          <a href="#formula">Fórmula</a>
          <a href="#ingredientes">Ingredientes</a>
          <a href="#rutina">Rutina</a>
          <a href="#faq">Preguntas</a>
        </nav>
        <button className={styles.headerCta} type="button" onClick={scrollToOffer}>
          Consultar disponibilidad
        </button>
      </header>

      <div id="contenido">
        <section className={styles.hero} aria-labelledby="bioprost-title">
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Bienestar masculino</p>
            <h1 id="bioprost-title">Bio Prost</h1>
            <p className={styles.heroCopy}>
              Una fórmula de bienestar masculino en presentación de {BIOPROST_CONFIG.verifiedProductData.units}{" "}
              tabletas para acompañar una rutina consciente de cuidado y vitalidad.
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
              <li className={styles.chip}>Bienestar masculino</li>
            </ul>

            <div className={styles.heroCommercial} aria-label="Precios de Bio Prost">
              <p className={styles.regularPrice}>
                Precio regular <s>S/{BIOPROST_CONFIG.commercial.regularPrice}</s>
              </p>
              <div className={styles.offerGridHero}>
                <div className={styles.offerCard}>
                  <span className={styles.offerLabel}>{BIOPROST_CONFIG.packages[0].name}</span>
                  <strong className={styles.offerPrice}>S/{BIOPROST_CONFIG.packages[0].price}</strong>
                  <span className={styles.offerSavings}>Ahorras S/{BIOPROST_CONFIG.packages[0].savings}</span>
                </div>
                <div className={`${styles.offerCard} ${styles.offerCardFeatured}`}>
                  {BIOPROST_CONFIG.packages[1].badge && (
                    <span className={styles.offerBadge}>{BIOPROST_CONFIG.packages[1].badge}</span>
                  )}
                  <span className={styles.offerLabel}>{BIOPROST_CONFIG.packages[1].name}</span>
                  <strong className={styles.offerPrice}>
                    S/{BIOPROST_CONFIG.packages[1].price} <small>total</small>
                  </strong>
                  <span className={styles.offerUnit}>S/{BIOPROST_CONFIG.packages[1].unitPrice.toFixed(2)} c/u</span>
                  <span className={styles.offerSavings}>Ahorras S/{BIOPROST_CONFIG.packages[1].savings}</span>
                </div>
              </div>
            </div>

            <div className={styles.heroWholesale}>
              <p className={styles.wholesaleEyebrow}>Mayorista</p>
              <p className={styles.wholesaleDetail}>
                Desde {BIOPROST_CONFIG.wholesale.minUnits} unidades — {BIOPROST_CONFIG.wholesale.minUnits} por S/
                {BIOPROST_CONFIG.wholesale.totalPrice}{" "}
                <span>(S/{BIOPROST_CONFIG.wholesale.unitPrice} c/u)</span>
              </p>
              <button
                className={styles.wholesaleButton}
                type="button"
                onClick={() => openWhatsAppPackage("wholesale", "Mayorista hero")}
              >
                Consultar mayorista <ArrowRight aria-hidden="true" size={14} />
              </button>
            </div>

            <div className={styles.heroActions}>
              <button
                className={styles.heroPrimaryButton}
                type="button"
                onClick={() => openWhatsAppPackage("double", "Hero Bio Prost")}
              >
                <MessageCircle aria-hidden="true" size={16} /> Pedir Bio Prost
              </button>
              <button className={styles.heroSecondaryButton} type="button" onClick={scrollToFormula}>
                Conocer la fórmula <ArrowRight aria-hidden="true" size={16} />
              </button>
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

        <section className={styles.strip} aria-label="Datos clave del producto">
          <div className={styles.stripInner}>
            <div className={styles.stripItem}>
              <strong>{BIOPROST_CONFIG.verifiedProductData.units}</strong>
              <span>Tabletas</span>
            </div>
            <div className={styles.stripItem}>
              <strong>100%</strong>
              <span>Natural</span>
            </div>
            <div className={styles.stripItem}>
              <strong>Nueva</strong>
              <span>Fórmula</span>
            </div>
            <div className={styles.stripItem}>
              <strong>USA</strong>
              <span>Origen declarado</span>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="context-title">
          <div className={`${styles.grid} ${styles.editorialGrid}`}>
            <div>
              <p className={styles.eyebrow}>Bienestar masculino</p>
              <div className={styles.sectionHeading}>
                <h2 id="context-title">Hay partes de tu bienestar que no deberían quedarse para después.</h2>
              </div>
              <p className={styles.body}>
                Entre trabajo, responsabilidades y rutina, el cuidado personal masculino suele quedar en segundo
                plano. BioProst Premium propone algo más sencillo: incorporar una decisión consciente dentro de tus
                hábitos diarios.
              </p>
            </div>
            <div className={styles.editorialImageWrap}>
              <Image
                src={BIOPROST_CONFIG.images.editorial}
                alt="Bio Prost como parte de una rutina de cuidado masculino."
                fill
                sizes="(max-width: 700px) 100vw, 40vw"
                className={styles.editorialImage}
              />
            </div>
          </div>
        </section>

        <section id="formula" className={styles.section} aria-labelledby="formula-title">
          <p className={styles.eyebrow}>Fórmula Bio Prost</p>
          <div className={styles.sectionHeading}>
            <h2 id="formula-title">Una combinación pensada para el bienestar masculino.</h2>
          </div>
          <p className={styles.body}>
            Saw Palmetto, uña de gato, licopeno, vitaminas y minerales: ingredientes seleccionados reunidos en una
            presentación práctica de {BIOPROST_CONFIG.verifiedProductData.units} tabletas.
          </p>
        </section>

        <section id="ingredientes" className={styles.section} aria-labelledby="ingredients-title">
          <p className={styles.eyebrow}>Fórmula Bio Prost</p>
          <div className={styles.sectionHeading}>
            <h2 id="ingredients-title">Ingredientes de la fórmula.</h2>
          </div>
          <div className={`${styles.grid} ${styles.grid2}`}>
            {BIOPROST_CONFIG.verifiedProductData.ingredients.map((ingredient) => (
              <article className={styles.card} key={ingredient.name}>
                <p className={styles.ingredientName}>{ingredient.name}</p>
                <p className={styles.ingredientCopy}>{ingredient.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="pillars-title">
          <p className={styles.eyebrow}>Una rutina pensada para ti</p>
          <div className={styles.sectionHeading}>
            <h2 id="pillars-title">Bienestar masculino desde una mirada integral.</h2>
          </div>
          <div className={`${styles.grid} ${styles.grid4}`}>
            {BIOPROST_CONFIG.pillars.map((pillar) => (
              <div key={pillar.n}>
                <p className={styles.pillarNumber}>{pillar.n}</p>
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

        <section id="rutina" className={styles.section} aria-labelledby="routine-title">
          <p className={styles.eyebrow}>Rutina de uso</p>
          <div className={styles.sectionHeading}>
            <h2 id="routine-title">Modo de uso.</h2>
          </div>
          <p className={styles.body}>{BIOPROST_CONFIG.verifiedProductData.usageNote}</p>
        </section>

        <section className={styles.section} aria-labelledby="transparency-title">
          <p className={styles.eyebrow}>Información clara</p>
          <div className={styles.sectionHeading}>
            <h2 id="transparency-title">Antes de comprar, sabes qué estás eligiendo.</h2>
          </div>
          <div className={styles.transparencyTable}>
            <div className={styles.transparencyRow}>
              <span>Producto</span>
              <span>{BIOPROST_CONFIG.productName}</span>
            </div>
            <div className={styles.transparencyRow}>
              <span>Presentación</span>
              <span>{BIOPROST_CONFIG.verifiedProductData.presentation}</span>
            </div>
            <div className={styles.transparencyRow}>
              <span>Unidades</span>
              <span>{BIOPROST_CONFIG.verifiedProductData.units} tabletas</span>
            </div>
            <div className={styles.transparencyRow}>
              <span>Ingredientes</span>
              <span>{BIOPROST_CONFIG.verifiedProductData.ingredients.map((i) => i.name).join(", ")}</span>
            </div>
            <div className={styles.transparencyRow}>
              <span>Procedencia</span>
              <span>{BIOPROST_CONFIG.verifiedProductData.origin}</span>
            </div>
            <div className={styles.transparencyRow}>
              <span>Registro sanitario</span>
              <span>{BIOPROST_CONFIG.verifiedProductData.sanitaryRegistry}</span>
            </div>
          </div>
          <p className={styles.note}>
            La información vigente del envase físico prevalece ante cualquier actualización comercial de esta
            página.
          </p>
        </section>

        <section id="pedido" className={styles.section} aria-labelledby="offer-title">
          <div className={`${styles.grid} ${styles.grid2} ${styles.offerGrid}`}>
            <div>
              <p className={styles.eyebrow}>Presentación comercial</p>
              <div className={styles.sectionHeading}>
                <h2 id="offer-title">
                  {BIOPROST_CONFIG.productName} · {BIOPROST_CONFIG.verifiedProductData.units} tabletas
                </h2>
              </div>
              <p className={styles.price}>Desde S/{BIOPROST_CONFIG.packages[1].unitPrice.toFixed(2)} c/u</p>
              <span className={styles.availability}>{BIOPROST_CONFIG.commercial.availabilityLabel}</span>
              <p className={styles.body}>
                Precio referencial aprobado. Disponibilidad, entrega y medios de pago se confirman por WhatsApp
                antes de coordinar tu pedido.
              </p>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => openWhatsApp("Presentación comercial")}
              >
                Consultar por WhatsApp <MessageCircle aria-hidden="true" size={16} />
              </button>
            </div>

            <form className={styles.form} onSubmit={submitOrder} noValidate>
              <p className={styles.formHeading}>Pedido asistido</p>
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
              <div className={styles.field}>
                <label htmlFor="bioprost-quantity">Cantidad de frascos</label>
                <select
                  id="bioprost-quantity"
                  value={order.quantity}
                  onChange={(event) => setOrder((current) => ({ ...current, quantity: event.target.value }))}
                >
                  <option value="1">1 frasco</option>
                  <option value="2">2 frascos</option>
                  <option value="3">3 frascos</option>
                </select>
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
          </div>
        </section>

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
          <p className={styles.eyebrow}>BioProst Premium · Bismillah Men&apos;s Wellness</p>
          <h2 id="closing-title">Haz espacio para un cuidado que puedas entender.</h2>
          <p>Consulta disponibilidad, precio vigente y entrega con el equipo de Bismillah.</p>
          <div className={styles.heroActions} style={{ justifyContent: "center" }}>
            <button className={styles.primaryButton} type="button" onClick={scrollToOffer}>
              Consultar disponibilidad <ArrowRight aria-hidden="true" size={16} />
            </button>
            <button className={styles.secondaryButton} type="button" onClick={() => openWhatsApp("Cierre BioProst Premium")}>
              <MessageCircle aria-hidden="true" size={16} /> WhatsApp
            </button>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>
            Bio Prost es un suplemento alimenticio y no sustituye el diagnóstico, tratamiento ni orientación de un
            profesional de salud.
          </p>
          <p>Registro Sanitario {BIOPROST_CONFIG.verifiedProductData.sanitaryRegistry}. Distribuido por Bismillah.</p>
        </footer>
      </div>

      <div className={styles.mobileCta}>
        <span>{BIOPROST_CONFIG.commercial.availabilityLabel}</span>
        <button type="button" onClick={scrollToOffer}>
          Ver presentación <ArrowRight aria-hidden="true" size={14} />
        </button>
      </div>
      <button
        className={styles.floatingWhatsApp}
        type="button"
        onClick={() => openWhatsApp("Botón flotante BioProst Premium")}
        aria-label="Consultar BioProst Premium por WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
      </button>
    </main>
  );
}
