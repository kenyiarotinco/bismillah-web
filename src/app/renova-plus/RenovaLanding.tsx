"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  FlaskConical,
  Heart,
  Info,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import {
  buildRenovaWhatsAppUrl,
  type RenovaPackageId,
  RENOVA_CONFIG,
} from "./renova.config";
import styles from "./renova.module.css";

type OrderField = "name" | "phone" | "district" | "address";
type OrderState = Record<OrderField, string> & { consent: boolean };
type OrderErrors = Partial<Record<OrderField | "consent", string>>;
type ImageKey = keyof typeof RENOVA_CONFIG.images;

const benefits = [
  {
    title: "Piel",
    description: "Un pilar para acompañar tu rutina diaria de cuidado personal.",
  },
  {
    title: "Cabello",
    description: "Un enfoque integral para quienes valoran la constancia en su rutina.",
  },
  {
    title: "Uñas",
    description: "Una categoría de cuidado incluida en una experiencia de bienestar diario.",
  },
  {
    title: "Articulaciones",
    description: "Un pilar de bienestar estructural para acompañar hábitos de vida activos.",
  },
] as const;

const faqs = [
  {
    question: "¿Qué contiene RENÖVA+?",
    answer:
      "La etiqueta provista identifica una mezcla en polvo sabor berries con colágeno hidrolizado y componentes como vitamina C, resveratrol, Coenzima Q10, zinc y magnesio. Revisa siempre el envase para la información vigente.",
  },
  {
    question: "¿Cómo se prepara?",
    answer:
      "Según la etiqueta, mezcla una porción de 15 g en un vaso con 250 ml de agua. Sigue las indicaciones completas impresas en el envase.",
  },
  {
    question: "¿Cuántas porciones contiene?",
    answer:
      "El envase fotografiado indica 315 g de contenido neto, 21 porciones y una porción de 15 g.",
  },
  {
    question: "¿Cómo se conserva?",
    answer:
      "Mantén el envase cerrado en un lugar fresco y seco, lejos de fuentes de calor. Consulta la etiqueta para cualquier actualización o advertencia.",
  },
  {
    question: "¿Cómo consulto entrega, stock o medios de pago?",
    answer:
      "Selecciona la presentación que te interesa y envía la consulta. El equipo de Bismillah confirmará disponibilidad, entrega y condiciones por WhatsApp antes de coordinar tu pedido.",
  },
] as const;

const gallery: { key: ImageKey; label: string; alt: string }[] = [
  { key: "front", label: "Envase", alt: "Vista frontal auténtica del envase de RENÖVA+." },
  { key: "nutrition", label: "Información", alt: "Información nutricional auténtica del envase de RENÖVA+." },
  { key: "label", label: "Uso", alt: "Etiqueta auténtica con preparación y conservación de RENÖVA+." },
];

function trackRenovaEvent(event: string, detail?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, eventDetail?: Record<string, string>) => void;
  };
  const eventDetail = { product: RENOVA_CONFIG.productName, ...detail };

  analyticsWindow.dataLayer?.push({ event, ...eventDetail });
  analyticsWindow.gtag?.("event", event, eventDetail);
}

export default function RenovaLanding() {
  const [selectedPackage, setSelectedPackage] = useState<RenovaPackageId>("continuity");
  const [activeImage, setActiveImage] = useState<ImageKey>("front");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [order, setOrder] = useState<OrderState>({
    name: "",
    phone: "",
    district: "",
    address: "",
    consent: false,
  });
  const [errors, setErrors] = useState<OrderErrors>({});
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    trackRenovaEvent("renova_view");
    const firedThresholds = new Set<number>();
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const progress = window.scrollY / scrollableHeight;
      if (progress >= 0.5 && !firedThresholds.has(50)) {
        trackRenovaEvent("renova_scroll_50");
        firedThresholds.add(50);
      }
      if (progress >= 0.9 && !firedThresholds.has(90)) {
        trackRenovaEvent("renova_scroll_90");
        firedThresholds.add(90);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openWhatsApp = (
    source: string,
    details?: Partial<OrderState>,
    packageId: RenovaPackageId = selectedPackage,
  ) => {
    const url = buildRenovaWhatsAppUrl({
      packageId,
      source,
      name: details?.name,
      phone: details?.phone,
      district: details?.district,
      address: details?.address,
    });

    trackRenovaEvent("renova_whatsapp_click", { source, package: packageId });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const selectPackage = (packageId: RenovaPackageId, source: string) => {
    setSelectedPackage(packageId);
    trackRenovaEvent("renova_offer_select", { source, package: packageId });
  };

  const scrollToOffer = () => {
    document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateField = (field: OrderField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    trackRenovaEvent("renova_consultation_start", { package: selectedPackage });
    trackRenovaEvent("renova_order_submit", { package: selectedPackage });
    setFormStatus("Abrimos WhatsApp con tu solicitud. Confirma los datos con el equipo antes de coordinar el pedido.");
    openWhatsApp("Formulario de pedido RENÖVA+", order);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#contenido">
        Ir al contenido principal
      </a>

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Ir al inicio de Bismillah">
          <Image src="/images/brand/bismillah-icon.png" alt="" width={34} height={34} />
          <span>BISMILLAH</span>
          <i aria-hidden="true" />
          <strong>RENÖVA+</strong>
        </Link>
        <nav className={styles.navigation} aria-label="Navegación de RENÖVA+">
          <a href="#beneficios">Beneficios</a>
          <a href="#formula">Fórmula</a>
          <a href="#ritual">Cómo usar</a>
          <a href="#acompanamiento">Acompañamiento</a>
          <a href="#faq">Preguntas</a>
        </nav>
        <button className={styles.headerCta} type="button" onClick={scrollToOffer}>
          Consultar disponibilidad
        </button>
      </header>

      <div id="contenido">
        <section className={styles.hero} aria-labelledby="renova-title">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>BISMILLAH WELLNESS PRESENTA</p>
            <h1 id="renova-title">
              Tu ritual diario de belleza comienza <em>desde dentro.</em>
            </h1>
            <p className={styles.heroCopy}>
              RENÖVA+ es una mezcla en polvo sabor berries para acompañar una rutina de cuidado integral, con información clara de etiqueta y orientación comercial personalizada.
            </p>
            <ul className={styles.heroChecks} aria-label="Información verificada de RENÖVA+">
              <li><Check aria-hidden="true" /> {RENOVA_CONFIG.verifiedLabelData.netWeightGrams} g de contenido neto</li>
              <li><Check aria-hidden="true" /> {RENOVA_CONFIG.verifiedLabelData.servingCount} porciones de {RENOVA_CONFIG.verifiedLabelData.servingSizeGrams} g</li>
              <li><Check aria-hidden="true" /> Sabor {RENOVA_CONFIG.verifiedLabelData.flavor}</li>
            </ul>
            <div className={styles.heroActions}>
              <button className={styles.primaryButton} type="button" onClick={scrollToOffer}>
                Elegir presentación <ArrowRight aria-hidden="true" />
              </button>
              <button className={styles.secondaryButton} type="button" onClick={() => openWhatsApp("Hero RENÖVA+")}>
                <MessageCircle aria-hidden="true" /> Hablar por WhatsApp
              </button>
            </div>
            <p className={styles.heroNote}>
              Stock, entrega y condiciones se confirman por WhatsApp antes de coordinar cualquier pedido.
            </p>
          </div>
          <div className={styles.heroProduct}>
            <div className={styles.productAura} aria-hidden="true" />
            <Image
              src={RENOVA_CONFIG.images.front}
              alt="Envase auténtico de RENÖVA+ con su etiqueta original visible."
              width={941}
              height={1671}
              priority
              sizes="(max-width: 880px) 82vw, (max-width: 1280px) 44vw, 520px"
              className={styles.heroProductImage}
            />
            <p className={styles.imageCaption}>Fotografía auténtica del producto. Etiqueta sin alteraciones.</p>
          </div>
        </section>

        <section className={styles.intro} aria-labelledby="intro-title">
          <div>
            <p className={styles.sectionEyebrow}>CUIDADO CON INTENCIÓN</p>
            <h2 id="intro-title">¿Tu rutina exterior ya no parece suficiente?</h2>
          </div>
          <p>
            RENÖVA+ propone una pausa sencilla: complementar tus hábitos de cuidado con una mezcla diaria, pensada para quienes quieren dar atención consciente a piel, cabello, uñas y bienestar estructural.
          </p>
        </section>

        <section id="formula" className={styles.formula} aria-labelledby="formula-title">
          <div className={styles.formulaVisual}>
            <div className={styles.orbit} aria-hidden="true" />
            <Image
              src={RENOVA_CONFIG.images.front}
              alt="Envase auténtico de RENÖVA+ como protagonista de la fórmula."
              width={941}
              height={1671}
              sizes="(max-width: 880px) 64vw, 380px"
              className={styles.formulaProductImage}
            />
            {RENOVA_CONFIG.verifiedLabelData.components.map((component, index) => (
              <span className={`${styles.ingredientTag} ${styles[`ingredient${index}`]}`} key={component}>
                {component}
              </span>
            ))}
          </div>
          <div className={styles.formulaContent}>
            <p className={styles.sectionEyebrow}>FÓRMULA CON INFORMACIÓN VISIBLE</p>
            <h2 id="formula-title">Una rutina simple, explicada desde la etiqueta.</h2>
            <p>
              La fórmula reúne componentes identificados en el envase. La experiencia está diseñada para que puedas revisar qué eliges, cómo prepararlo y cómo consultar sus condiciones de compra sin promesas exageradas.
            </p>
            <div className={styles.componentList}>
              {RENOVA_CONFIG.verifiedLabelData.components.map((component) => (
                <span key={component}><FlaskConical aria-hidden="true" /> {component}</span>
              ))}
            </div>
            <a className={styles.inlineLink} href="#etiqueta">
              Ver información de etiqueta <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="beneficios" className={styles.benefits} aria-labelledby="benefits-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>CUATRO PILARES</p>
            <h2 id="benefits-title">Un espacio para acompañar tu cuidado diario.</h2>
            <p>La información de esta página describe categorías de cuidado y no sustituye recomendaciones profesionales de salud.</p>
          </div>
          <div className={styles.benefitGrid}>
            {benefits.map((benefit, index) => (
              <article className={styles.benefitCard} key={benefit.title}>
                <span className={styles.benefitNumber}>0{index + 1}</span>
                <Sparkles aria-hidden="true" />
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.comparison} aria-labelledby="comparison-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>ELECCIÓN INFORMADA</p>
            <h2 id="comparison-title">De un ingrediente aislado a un ritual acompañado.</h2>
          </div>
          <div className={styles.comparisonGrid}>
            <article>
              <p className={styles.cardEyebrow}>COLÁGENO BÁSICO</p>
              <h3>Una elección centrada en un ingrediente.</h3>
              <ul>
                <li><Check aria-hidden="true" /> Una sola categoría de producto.</li>
                <li><Check aria-hidden="true" /> Compra de un frasco.</li>
                <li><Check aria-hidden="true" /> Consulta y continuidad por definir.</li>
              </ul>
            </article>
            <article className={styles.comparisonFeatured}>
              <p className={styles.cardEyebrow}>RENÖVA+</p>
              <h3>Una fórmula multicomponente, con una conversación antes de comprar.</h3>
              <ul>
                <li><Check aria-hidden="true" /> Componentes identificados en la etiqueta.</li>
                <li><Check aria-hidden="true" /> Presentaciones para consultar según disponibilidad.</li>
                <li><Check aria-hidden="true" /> Acompañamiento comercial por WhatsApp.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="ritual" className={styles.ritual} aria-labelledby="ritual-title">
          <div className={styles.ritualCopy}>
            <p className={styles.sectionEyebrow}>RITUAL DE USO</p>
            <h2 id="ritual-title">Lo esencial, sin letra pequeña.</h2>
            <p>La preparación y conservación se transcriben de la etiqueta proporcionada. Para cualquier actualización, prevalece siempre la información del envase físico.</p>
          </div>
          <ol className={styles.ritualSteps}>
            <li><span>01</span><strong>Prepara</strong><p>{RENOVA_CONFIG.verifiedLabelData.preparation}</p></li>
            <li><span>02</span><strong>Integra</strong><p>Incorpórala a tu rutina siguiendo la etiqueta y tus hábitos personales.</p></li>
            <li><span>03</span><strong>Conserva</strong><p>{RENOVA_CONFIG.verifiedLabelData.storage}</p></li>
          </ol>
          <div className={styles.labelFacts}>
            <span><PackageCheck aria-hidden="true" /> {RENOVA_CONFIG.verifiedLabelData.netWeightGrams} g netos</span>
            <span><Clock3 aria-hidden="true" /> {RENOVA_CONFIG.verifiedLabelData.servingCount} porciones</span>
            <span><Heart aria-hidden="true" /> Sabor {RENOVA_CONFIG.verifiedLabelData.flavor}</span>
          </div>
        </section>

        <section id="etiqueta" className={styles.labelSection} aria-labelledby="label-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>TRANSPARENCIA DE PRODUCTO</p>
            <h2 id="label-title">Consulta el envase auténtico.</h2>
            <p>Las fotografías mantienen la etiqueta original. No reemplazan la lectura del producto físico antes de usarlo.</p>
          </div>
          <div className={styles.galleryLayout}>
            <div className={styles.galleryImageFrame}>
              <Image
                src={RENOVA_CONFIG.images[activeImage]}
                alt={gallery.find((image) => image.key === activeImage)?.alt ?? "Envase auténtico de RENÖVA+."}
                width={941}
                height={1672}
                sizes="(max-width: 880px) 90vw, 460px"
                className={styles.galleryImage}
              />
            </div>
            <div className={styles.galleryControls} role="group" aria-label="Vistas del producto">
              {gallery.map((image) => (
                <button
                  className={activeImage === image.key ? styles.galleryButtonActive : styles.galleryButton}
                  key={image.key}
                  type="button"
                  onClick={() => setActiveImage(image.key)}
                  aria-pressed={activeImage === image.key}
                >
                  <span>{image.label}</span>
                  <ArrowRight aria-hidden="true" />
                </button>
              ))}
              <p><Info aria-hidden="true" /> Porción: {RENOVA_CONFIG.verifiedLabelData.servingSizeGrams} g · {RENOVA_CONFIG.verifiedLabelData.servingCount} porciones · {RENOVA_CONFIG.verifiedLabelData.netWeightGrams} g netos.</p>
            </div>
          </div>
        </section>

        <section id="oferta" className={styles.offer} aria-labelledby="offer-title">
          <div className={styles.offerIntro}>
            <p className={styles.sectionEyebrow}>PRESENTACIONES</p>
            <h2 id="offer-title">Elige cómo quieres comenzar.</h2>
            <p>No mostramos precios ni descuentos sin aprobación comercial. Selecciona una presentación y te confirmaremos stock, entrega y medios de pago por WhatsApp.</p>
          </div>
          <div className={styles.packageGrid}>
            {RENOVA_CONFIG.packages.map((item) => (
              <article className={item.recommended ? styles.packageRecommended : styles.packageCard} key={item.id}>
                {item.recommended && <span className={styles.packageBadge}><Star aria-hidden="true" /> Recomendado</span>}
                <p>{item.name}</p>
                <h3>{item.units} {item.units === 1 ? "unidad" : "unidades"}</h3>
                <span className={styles.availability}>{RENOVA_CONFIG.commercial.availabilityLabel}</span>
                <p className={styles.packageDescription}>{item.description}</p>
                <button
                  className={item.recommended ? styles.packagePrimary : styles.packageSecondary}
                  type="button"
                  onClick={() => {
                    selectPackage(item.id, "Tarjeta de presentación");
                    openWhatsApp("Tarjeta de presentación", undefined, item.id);
                  }}
                >
                  Consultar por WhatsApp <MessageCircle aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>

          <form className={styles.orderForm} onSubmit={submitOrder} noValidate>
            <div className={styles.formHeading}>
              <p className={styles.sectionEyebrow}>PEDIDO ASISTIDO</p>
              <h3>Deja lista tu consulta.</h3>
              <p>Al enviar, se abre WhatsApp con los datos que confirmes. Bismillah no guarda este formulario en un servicio externo.</p>
            </div>
            <div className={styles.packageSelector} aria-label="Selecciona una presentación">
              {RENOVA_CONFIG.packages.map((item) => (
                <label key={item.id} className={selectedPackage === item.id ? styles.radioActive : styles.radioLabel}>
                  <input
                    type="radio"
                    name="package"
                    value={item.id}
                    checked={selectedPackage === item.id}
                    onChange={() => selectPackage(item.id, "Formulario")}
                  />
                  <span>{item.name} · {item.units} {item.units === 1 ? "unidad" : "unidades"}</span>
                </label>
              ))}
            </div>
            <div className={styles.formGrid}>
              <label>
                Nombre
                <input value={order.name} onChange={updateField("name")} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "renova-name-error" : undefined} />
                {errors.name && <small id="renova-name-error">{errors.name}</small>}
              </label>
              <label>
                Celular peruano
                <input value={order.phone} onChange={updateField("phone")} inputMode="numeric" autoComplete="tel" placeholder="9XXXXXXXX" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "renova-phone-error" : undefined} />
                {errors.phone && <small id="renova-phone-error">{errors.phone}</small>}
              </label>
              <label>
                Distrito
                <input value={order.district} onChange={updateField("district")} autoComplete="address-level2" aria-invalid={Boolean(errors.district)} aria-describedby={errors.district ? "renova-district-error" : undefined} />
                {errors.district && <small id="renova-district-error">{errors.district}</small>}
              </label>
              <label>
                Dirección o referencia
                <input value={order.address} onChange={updateField("address")} autoComplete="street-address" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "renova-address-error" : undefined} />
                {errors.address && <small id="renova-address-error">{errors.address}</small>}
              </label>
            </div>
            <label className={styles.consentLabel}>
              <input type="checkbox" checked={order.consent} onChange={(event) => { setOrder((current) => ({ ...current, consent: event.target.checked })); setErrors((current) => ({ ...current, consent: undefined })); }} />
              <span>Autorizo abrir WhatsApp para coordinar esta consulta comercial.</span>
            </label>
            {errors.consent && <small className={styles.formError}>{errors.consent}</small>}
            <div className={styles.formFooter}>
              <button className={styles.primaryButton} type="submit"><MessageCircle aria-hidden="true" /> Enviar consulta por WhatsApp</button>
              <p aria-live="polite">{formStatus}</p>
            </div>
          </form>
        </section>

        <section id="acompanamiento" className={styles.support} aria-labelledby="support-title">
          <div>
            <p className={styles.sectionEyebrow}>ACOMPAÑAMIENTO Y EXPERIENCIA DE COMPRA</p>
            <h2 id="support-title">Una consulta clara antes de decidir.</h2>
            <p>No publicamos reseñas ni resultados no verificables. En su lugar, te orientamos sobre disponibilidad, entrega, autenticidad del producto y continuidad desde un canal oficial.</p>
          </div>
          <div className={styles.trustGrid}>
            <article><ShieldCheck aria-hidden="true" /><h3>Etiqueta visible</h3><p>La información de esta página parte de las fotografías reales provistas.</p></article>
            <article><Truck aria-hidden="true" /><h3>Entrega por confirmar</h3><p>Distrito, plazos y condiciones se revisan contigo antes de coordinar.</p></article>
            <article><MessageCircle aria-hidden="true" /><h3>Atención directa</h3><p>La conversación comercial continúa por WhatsApp, con los datos que tú confirmes.</p></article>
          </div>
        </section>

        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>PREGUNTAS FRECUENTES</p>
            <h2 id="faq-title">Información sencilla para elegir con calma.</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <article className={styles.faqItem} key={faq.question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`renova-faq-${index}`}
                      onClick={() => {
                        setOpenFaq(isOpen ? null : index);
                        trackRenovaEvent("renova_faq_open", { item: String(index + 1) });
                      }}
                    >
                      <span><CircleHelp aria-hidden="true" /> {faq.question}</span>
                      <ChevronDown aria-hidden="true" className={isOpen ? styles.chevronOpen : undefined} />
                    </button>
                  </h3>
                  <div id={`renova-faq-${index}`} className={isOpen ? styles.faqAnswerOpen : styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <div className={styles.closingContent}>
            <p className={styles.sectionEyebrow}>RENÖVA+ · BISMILLAH WELLNESS</p>
            <h2 id="closing-title">Haz espacio para un ritual que puedas entender.</h2>
            <p>Consulta la presentación que te interesa y confirma disponibilidad, entrega y condiciones con el equipo de Bismillah.</p>
            <div className={styles.heroActions}>
              <button className={styles.primaryButton} type="button" onClick={scrollToOffer}>Consultar disponibilidad <ArrowRight aria-hidden="true" /></button>
              <button className={styles.secondaryButton} type="button" onClick={() => openWhatsApp("Cierre RENÖVA+")}><MessageCircle aria-hidden="true" /> WhatsApp</button>
            </div>
          </div>
          <Image src={RENOVA_CONFIG.images.front} alt="Envase auténtico de RENÖVA+ al cierre de la página." width={941} height={1671} sizes="(max-width: 880px) 60vw, 360px" className={styles.closingImage} />
        </section>
      </div>

      <div className={styles.mobileCta}>
        <span>{RENOVA_CONFIG.commercial.availabilityLabel}</span>
        <button type="button" onClick={scrollToOffer}>Ver presentaciones <ArrowRight aria-hidden="true" /></button>
      </div>
      <button className={styles.floatingWhatsApp} type="button" onClick={() => openWhatsApp("Botón flotante RENÖVA+")} aria-label="Consultar RENÖVA+ por WhatsApp">
        <MessageCircle aria-hidden="true" />
      </button>
    </main>
  );
}
