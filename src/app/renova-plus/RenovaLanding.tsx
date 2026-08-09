"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Droplet,
  Heart,
  Info,
  Layers,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Zap,
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
    number: "01",
    territory: "BELLEZA",
    subtitle: "Piel · Cabello · Uñas",
    components: ["Colágeno hidrolizado", "Biopéptidos activos", "Vitamina C", "Biotina", "Zinc"],
    description: "Una combinación pensada para acompañar tu rutina de belleza desde el interior.",
    icon: Sparkles,
  },
  {
    number: "02",
    territory: "VITALIDAD",
    subtitle: "Energía y función corporal",
    components: ["Coenzima Q10", "Complejo B", "Magnesio", "Hierro"],
    description: "Nutrientes esenciales que acompañan la energía celular y el rendimiento diario.",
    icon: Zap,
  },
  {
    number: "03",
    territory: "PROTECCIÓN",
    subtitle: "Soporte antioxidante",
    components: ["Resveratrol", "Coenzima Q10", "Vitamina C", "Vitamina E"],
    description: "Antioxidantes seleccionados para apoyar la protección celular contra el estrés oxidativo diario.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    territory: "MOVIMIENTO",
    subtitle: "Músculos · Huesos · Articulaciones",
    components: ["Colágeno hidrolizado", "Vitamina D3", "Vitamina K1", "Magnesio", "Zinc"],
    description: "Un soporte de nutrientes clave para mantener la movilidad activa y el bienestar estructural.",
    icon: Activity,
  },
] as const;

const faqs = [
  {
    question: "¿Qué hace diferente a RENÖVA+?",
    answer:
      "RENÖVA+ combina 11,4 g de colágeno doblemente hidrolizado con biopéptidos activos por toma, enriquecido con Resveratrol, CoQ10, 10 vitaminas, 3 minerales y fibra en una sola fórmula sabor Berries.",
  },
  {
    question: "¿Qué significa doblemente hidrolizado?",
    answer:
      "Es un proceso de micro-fragmentación avanzada que reduce el tamaño de las moléculas de colágeno, facilitando su digestión y biodisponibilidad para el organismo.",
  },
  {
    question: "¿Cuánto colágeno contiene cada toma?",
    answer:
      "Cada porción de 15 g aporta exactamente 11,4 g de colágeno doblemente hidrolizado con biopéptidos activos.",
  },
  {
    question: "¿Qué son los biopéptidos activos?",
    answer:
      "Son fracciones específicas de aminoácidos obtenidas por hidrólisis dirigida, diseñadas para una absorción y utilización óptimas en tu rutina corporal.",
  },
  {
    question: "¿Qué otros componentes contiene?",
    answer:
      "La fórmula incluye Resveratrol, Coenzima Q10, Vitaminas (A, C, D3, E, K1 y Complejo B completo), Minerales (Magnesio, Zinc, Hierro), Biotina y Fibra.",
  },
  {
    question: "¿Cuántas porciones contiene?",
    answer:
      "Cada envase contiene 315 g de contenido neto, equivalente a 21 porciones de 15 g cada una.",
  },
  {
    question: "¿Cómo se prepara?",
    answer:
      "Mezcla una porción de 15 g en un vaso con 250 ml de agua o tu bebida favorita. Se disuelve fácilmente y tiene un sabor fresco a Berries.",
  },
  {
    question: "¿A qué sabe?",
    answer:
      "Tiene un suave y refrescante sabor a Berries, formulado sin azúcar añadida (0 g azúcar).",
  },
  {
    question: "¿Cuánto cuesta?",
    answer:
      "La unidad individual cuesta S/159. El Pack de 3 Unidades tiene un valor de S/327 total (S/109 c/u), siendo la opción más conveniente para tu continuidad.",
  },
  {
    question: "¿Cómo funciona el pago contra entrega?",
    answer:
      "Pides tu producto por WhatsApp sin pago previo. Coordinamos la dirección y abonas al recibir en tu domicilio (sujeto a disponibilidad y cobertura).",
  },
] as const;

const gallery: { key: ImageKey; label: string; alt: string }[] = [
  { key: "blackJar", label: "Frasco negro", alt: "Frasco negro auténtico de RENÖVA+." },
  { key: "whiteJar", label: "Frasco blanco", alt: "Frasco blanco auténtico de RENÖVA+." },
  { key: "nutrition", label: "Tabla Nutricional", alt: "Información nutricional auténtica del envase de RENÖVA+." },
  { key: "label", label: "Etiqueta y Uso", alt: "Etiqueta auténtica con modo de preparación y conservación de RENÖVA+." },
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
  const [selectedPackage, setSelectedPackage] = useState<RenovaPackageId>("pack-3");
  const [activeImage, setActiveImage] = useState<ImageKey>("blackJar");
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

  const scrollToFormula = () => {
    document.getElementById("diferenciador")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateField = (field: OrderField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOrder((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateOrder = (): OrderErrors => {
    const nextErrors: OrderErrors = {};
    if (order.name.trim().length < 2) nextErrors.name = "Ingresa tu nombre para coordinar la solicitud.";
    if (!/^9\d{8}$/.test(order.phone.replace(/\D/g, ""))) {
      nextErrors.phone = "Ingresa un celular de 9 dígitos que empiece con 9.";
    }
    if (order.district.trim().length < 2) nextErrors.district = "Indica tu distrito para verificar la entrega.";
    if (order.address.trim().length < 8) nextErrors.address = "Ingresa una dirección o referencia suficiente.";
    if (!order.consent) nextErrors.consent = "Acepta autorizar la comunicación por WhatsApp para enviar.";
    return nextErrors;
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateOrder();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormStatus("Por favor completa los campos señalados antes de continuar.");
      return;
    }

    trackRenovaEvent("renova_consultation_start", { package: selectedPackage });
    trackRenovaEvent("renova_order_submit", { package: selectedPackage });
    setFormStatus("Abriendo WhatsApp con los datos de tu pedido...");
    openWhatsApp("Formulario de pedido RENÖVA+", order);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#contenido">
        Ir al contenido principal
      </a>

      {/* HEADER */}
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Ir al inicio de Bismillah">
          <Image src="/images/brand/bismillah-icon.png" alt="Bismillah Logo" width={34} height={34} />
          <span>BISMILLAH</span>
          <i aria-hidden="true" />
          <strong>RENÖVA+</strong>
        </Link>
        <nav className={styles.navigation} aria-label="Navegación de RENÖVA+">
          <a href="#diferenciador">Diferencia</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#formula">Composición</a>
          <a href="#ritual">Ritual</a>
          <a href="#oferta">Precios</a>
          <a href="#faq">Preguntas</a>
        </nav>
        <button
          className={styles.headerCta}
          type="button"
          onClick={() => openWhatsApp("Header CTA", undefined, "pack-3")}
        >
          <MessageCircle aria-hidden="true" /> Pedir por WhatsApp
        </button>
      </header>

      <div id="contenido">
        {/* HERO SECTION */}
        <section className={styles.hero} aria-labelledby="renova-title">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>BISMILLAH WELLNESS PRESENTA</p>
            <h1 id="renova-title">
              Belleza, vitalidad y bienestar <em>desde el interior.</em>
            </h1>
            <p className={styles.heroSubhead}>
              RENÖVA+ va más allá de un colágeno tradicional. Cada toma aporta <strong>11,4 g de colágeno doblemente hidrolizado con biopéptidos activos</strong>, complementados con Resveratrol, CoQ10, vitaminas, minerales y fibra.
            </p>

            <div className={styles.microClaimBadge}>
              <Sparkles aria-hidden="true" />
              <span>{RENOVA_CONFIG.microClaim}</span>
            </div>

            <ul className={styles.heroChips} aria-label="Beneficios principales de RENÖVA+">
              <li><Check aria-hidden="true" /> <strong>11,4 g</strong> de colágeno*</li>
              <li><Check aria-hidden="true" /> Doble hidrólisis</li>
              <li><Check aria-hidden="true" /> Biopéptidos activos</li>
              <li><Check aria-hidden="true" /> Resveratrol + CoQ10</li>
              <li><Check aria-hidden="true" /> Sabor Berries</li>
              <li><Check aria-hidden="true" /> {RENOVA_CONFIG.verifiedLabelData.netWeightGrams} g netos</li>
            </ul>
            <p className={styles.microNote}>*por toma de 15 g.</p>

            <div className={styles.heroActions}>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => openWhatsApp("Hero Button Primary", undefined, "pack-3")}
              >
                <MessageCircle aria-hidden="true" /> PEDIR RENÖVA+ POR WHATSAPP
              </button>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={scrollToFormula}
              >
                DESCUBRIR LA FÓRMULA <ArrowRight aria-hidden="true" />
              </button>
            </div>
            <p className={styles.heroGuaranteeNote}>
              <ShieldCheck aria-hidden="true" /> Pago contra entrega disponible · Envío directo a domicilio
            </p>
          </div>

          <div className={styles.heroProduct}>
            <div className={styles.productAura} aria-hidden="true" />
            <Image
              src={RENOVA_CONFIG.images.front}
              alt="Envase auténtico de RENÖVA+ en su presentación de 315g."
              width={941}
              height={1671}
              priority
              sizes="(max-width: 880px) 82vw, (max-width: 1280px) 44vw, 520px"
              className={styles.heroProductImage}
            />
            <Image
              src={RENOVA_CONFIG.images.whiteJar}
              alt="Frasco blanco de referencia auténtico de RENÖVA+."
              width={230}
              height={345}
              sizes="(max-width: 880px) 30vw, 160px"
              className={styles.heroWhiteJarImage}
            />
            <p className={styles.imageCaption}>Presentación auténtica original (315 g netos · 21 porciones).</p>
          </div>
        </section>

        {/* SECCIÓN DIFERENCIADORA */}
        <section id="diferenciador" className={styles.diferenciador} aria-labelledby="diferenciador-title">
          <div className={styles.sectionHeadingCenter}>
            <p className={styles.sectionEyebrow}>UNA FÓRMULA QUE VA MÁS ALLÁ</p>
            <h2 id="diferenciador-title">¿Qué hace diferente a RENÖVA+?</h2>
            <p className={styles.sectionLeadText}>
              No es solo colágeno. RENÖVA+ combina <strong>11,4 g de colágeno doblemente hidrolizado con biopéptidos activos</strong> con una fórmula enriquecida con antioxidantes, vitaminas, minerales y fibra.
            </p>
          </div>

          <div className={styles.diferenciadorArchitecture}>
            {/* CENTRAL HERO CORE */}
            <div className={styles.coreCard}>
              <div className={styles.coreTag}>NÚCLEO PROTAGONISTA</div>
              <span className={styles.coreValue}>11,4 g</span>
              <h3>COLÁGENO DOBLEMENTE HIDROLIZADO</h3>
              <p className={styles.coreSubtitle}>+ BIOPÉPTIDOS ACTIVOS</p>
              <p className={styles.coreDesc}>
                Micro-fragmentación enzimática dirigida para asegurar la máxima biodisponibilidad y asimilación corporal en cada toma.
              </p>
            </div>

            {/* SURROUNDING SECONDARY GRID */}
            <div className={styles.surroundingGrid}>
              <article className={styles.surroundingCard}>
                <div className={styles.cardHeader}>
                  <Sparkles aria-hidden="true" className={styles.cardIcon} />
                  <h4>Resveratrol</h4>
                </div>
                <p>Antioxidante natural de alta pureza para la protección celular.</p>
              </article>

              <article className={styles.surroundingCard}>
                <div className={styles.cardHeader}>
                  <Zap aria-hidden="true" className={styles.cardIcon} />
                  <h4>Coenzima Q10</h4>
                </div>
                <p>Nutriente bioactivo que acompaña la bioenergía celular y la vitalidad.</p>
              </article>

              <article className={styles.surroundingCard}>
                <div className={styles.cardHeader}>
                  <Sun aria-hidden="true" className={styles.cardIcon} />
                  <h4>10 Vitaminas</h4>
                </div>
                <p>A, C, D3, E, K1 y Complejo B completo (B2, B3, B6, B9, B12).</p>
              </article>

              <article className={styles.surroundingCard}>
                <div className={styles.cardHeader}>
                  <Layers aria-hidden="true" className={styles.cardIcon} />
                  <h4>3 Minerales Clave</h4>
                </div>
                <p>Magnesio, Zinc y Hierro para el soporte metabólico y estructural.</p>
              </article>

              <article className={styles.surroundingCard}>
                <div className={styles.cardHeader}>
                  <Heart aria-hidden="true" className={styles.cardIcon} />
                  <h4>Biotina</h4>
                </div>
                <p>Micronutriente clave en la rutina diaria de cuidado personal.</p>
              </article>

              <article className={styles.surroundingCard}>
                <div className={styles.cardHeader}>
                  <Droplet aria-hidden="true" className={styles.cardIcon} />
                  <h4>Fibra</h4>
                </div>
                <p>Aporte de fibra para complementar el equilibrio digestivo diario.</p>
              </article>
            </div>
          </div>
        </section>

        {/* BENEFICIOS: 4 PILARES */}
        <section id="beneficios" className={styles.benefits} aria-labelledby="benefits-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>CUATRO PILARES</p>
            <h2 id="benefits-title">Soporte nutricional pensado para tu día a día.</h2>
            <p>La información describe áreas de soporte nutricional y acompañamiento consciente en tu rutina personal.</p>
          </div>
          <div className={styles.benefitGrid}>
            {benefits.map((b) => {
              const IconComp = b.icon;
              return (
                <article className={styles.benefitCard} key={b.territory}>
                  <div className={styles.benefitCardTop}>
                    <span className={styles.benefitNumber}>{b.number}</span>
                    <IconComp aria-hidden="true" className={styles.benefitIcon} />
                  </div>
                  <p className={styles.benefitTerritory}>{b.territory}</p>
                  <h3>{b.subtitle}</h3>
                  <div className={styles.benefitTags}>
                    {b.components.map((comp) => (
                      <span key={comp}>{comp}</span>
                    ))}
                  </div>
                  <p className={styles.benefitDesc}>{b.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* COMPOSICIÓN COMPLETA */}
        <section id="formula" className={styles.formulaSection} aria-labelledby="formula-title">
          <div className={styles.sectionHeadingCenter}>
            <p className={styles.sectionEyebrow}>COMPOSICIÓN COMPLETA</p>
            <h2 id="formula-title">Una fórmula. Múltiples componentes.</h2>
            <p className={styles.sectionLeadText}>
              Cada porción de 15 g ha sido diseñada con ingredientes transparentes declarados en la etiqueta original.
            </p>
          </div>

          <div className={styles.formulaLevel1}>
            <div className={styles.level1Badge}>NIVEL 1 — BASE PROTAGONISTA</div>
            <div className={styles.level1Value}>11,4 g</div>
            <h3>COLÁGENO DOBLEMENTE HIDROLIZADO CON BIOPÉPTIDOS ACTIVOS</h3>
            <p>Aporte concentrado de biopéptidos hidrolizados de máxima asimilación por toma diaria de 15 g.</p>
          </div>

          <div className={styles.formulaLevel2Grid}>
            <article className={styles.compactGroup}>
              <div className={styles.groupHeader}>
                <Sparkles aria-hidden="true" />
                <h3>ANTIOXIDANTES</h3>
              </div>
              <ul>
                <li>Resveratrol</li>
                <li>Coenzima Q10</li>
              </ul>
            </article>

            <article className={styles.compactGroup}>
              <div className={styles.groupHeader}>
                <Sun aria-hidden="true" />
                <h3>VITAMINAS</h3>
              </div>
              <ul>
                <li>Vitamina A · C · D3 · E · K1</li>
                <li>Complejo B (B2, B3, B6, B9, B12)</li>
              </ul>
            </article>

            <article className={styles.compactGroup}>
              <div className={styles.groupHeader}>
                <Layers aria-hidden="true" />
                <h3>MINERALES</h3>
              </div>
              <ul>
                <li>Magnesio</li>
                <li>Zinc</li>
                <li>Hierro</li>
              </ul>
            </article>

            <article className={styles.compactGroup}>
              <div className={styles.groupHeader}>
                <Heart aria-hidden="true" />
                <h3>OTROS COMPONENTES</h3>
              </div>
              <ul>
                <li>Biotina</li>
                <li>Fibra</li>
              </ul>
            </article>
          </div>
        </section>

        {/* BLOQUE NUTRICIONAL */}
        <section id="nutricion" className={styles.nutritionBlock} aria-labelledby="nutrition-title">
          <div className={styles.nutritionContent}>
            <p className={styles.sectionEyebrow}>INFORMACIÓN NUTRICIONAL VERIFICADA</p>
            <h2 id="nutrition-title">Transparencia absoluta en cada toma.</h2>
            <p>Acreditación de valores según etiqueta original del producto físico.</p>

            <div className={styles.nutritionStatsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>{RENOVA_CONFIG.verifiedLabelData.zeroClaims.fats}</span>
                <span className={styles.statLabel}>GRASAS</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>{RENOVA_CONFIG.verifiedLabelData.zeroClaims.sugar}</span>
                <span className={styles.statLabel}>AZÚCAR</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNumber}>{RENOVA_CONFIG.verifiedLabelData.zeroClaims.carbs}</span>
                <span className={styles.statLabel}>CARBOHIDRATOS</span>
              </div>
              <div className={styles.statBoxHighlight}>
                <span className={styles.statNumber}>{RENOVA_CONFIG.verifiedLabelData.netWeightGrams} g</span>
                <span className={styles.statLabel}>CONTENIDO NETO</span>
              </div>
              <div className={styles.statBoxHighlight}>
                <span className={styles.statNumber}>{RENOVA_CONFIG.verifiedLabelData.servingCount}</span>
                <span className={styles.statLabel}>PORCIONES DE 15 g</span>
              </div>
            </div>
          </div>
        </section>

        {/* RITUAL */}
        <section id="ritual" className={styles.ritual} aria-labelledby="ritual-title">
          <div className={styles.ritualHeader}>
            <p className={styles.sectionEyebrow}>RITUAL DE USO DIARIO</p>
            <h2 id="ritual-title">UN PEQUEÑO RITUAL. TODOS LOS DÍAS.</h2>
            <p>Integra RENÖVA+ fácilmente a tu mañana o rutina preferida en solo 4 pasos.</p>
          </div>

          <ol className={styles.ritualStepsGrid}>
            <li className={styles.ritualStepCard}>
              <span className={styles.stepNum}>01</span>
              <h3>PREPARA</h3>
              <p>Mide una porción de 15 g con la cuchara medidora incluida.</p>
            </li>
            <li className={styles.ritualStepCard}>
              <span className={styles.stepNum}>02</span>
              <h3>MEZCLA</h3>
              <p>{RENOVA_CONFIG.verifiedLabelData.preparation}</p>
            </li>
            <li className={styles.ritualStepCard}>
              <span className={styles.stepNum}>03</span>
              <h3>DISFRUTA</h3>
              <p>Sabor suave a Berries, disolución instantánea sin grumos.</p>
            </li>
            <li className={styles.ritualStepCard}>
              <span className={styles.stepNum}>04</span>
              <h3>HAZLO TU RUTINA</h3>
              <p>Mantén la constancia día a día para integrar el hábito de bienestar.</p>
            </li>
          </ol>

          <div className={styles.labelFacts}>
            <span><PackageCheck aria-hidden="true" /> {RENOVA_CONFIG.verifiedLabelData.netWeightGrams} g netos</span>
            <span><Clock3 aria-hidden="true" /> {RENOVA_CONFIG.verifiedLabelData.servingCount} porciones</span>
            <span><Heart aria-hidden="true" /> Sabor {RENOVA_CONFIG.verifiedLabelData.flavor}</span>
            <span><ShieldCheck aria-hidden="true" /> Conservar en lugar fresco y seco</span>
          </div>
        </section>

        {/* COMPARATIVA PRUDENTE */}
        <section className={styles.comparison} aria-labelledby="comparison-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>ELECCIÓN CONSCIENTE</p>
            <h2 id="comparison-title">DE UN SOLO INGREDIENTE A UNA FÓRMULA INTEGRAL.</h2>
          </div>
          <div className={styles.comparisonGrid}>
            <article className={styles.comparisonStandard}>
              <p className={styles.cardEyebrow}>COLÁGENO CONVENCIONAL</p>
              <h3>Colágeno como ingrediente protagonista único.</h3>
              <ul>
                <li><Check aria-hidden="true" /> Enfocado principalmente en una sola fuente proteica.</li>
                <li><Check aria-hidden="true" /> Requiere comprar vitaminas y suplementos adicionales por separado.</li>
                <li><Check aria-hidden="true" /> Sin biopéptidos específicos ni antioxidantes complementarios.</li>
              </ul>
            </article>

            <article className={styles.comparisonFeatured}>
              <div className={styles.featuredBadge}>FÓRMULA RENÖVA+</div>
              <p className={styles.cardEyebrow}>RENÖVA+</p>
              <h3>Una mezcla integral multicomponente con biopéptidos.</h3>
              <ul>
                <li><Check aria-hidden="true" /> <strong>11,4 g de colágeno doblemente hidrolizado</strong> + biopéptidos activos por toma.</li>
                <li><Check aria-hidden="true" /> Enriquecido con Resveratrol, Coenzima Q10, 10 Vitaminas y 3 Minerales.</li>
                <li><Check aria-hidden="true" /> Aporte adicional de Biotina y Fibra con delicioso sabor Berries.</li>
                <li><Check aria-hidden="true" /> Formato de 315 g (21 porciones) con opción de Pago Contra Entrega.</li>
              </ul>
            </article>
          </div>
        </section>

        {/* SECCIÓN DE ETIQUETA AUTÉNTICA (GALERÍA FOTOGRÁFICA) */}
        <section id="etiqueta" className={styles.labelSection} aria-labelledby="label-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>GALERÍA Y TRANSPARENCIA</p>
            <h2 id="label-title">Fotografías reales del producto físico.</h2>
            <p>Consulta la etiqueta auténtica y las presentaciones reales sin filtros ni alteraciones digitales.</p>
          </div>
          <div className={styles.galleryLayout}>
            <div className={styles.galleryImageFrame}>
              <Image
                src={RENOVA_CONFIG.images[activeImage]}
                alt={gallery.find((image) => image.key === activeImage)?.alt ?? "Envase auténtico de RENÖVA+."}
                width={941}
                height={1672}
                sizes="(max-width: 880px) 90vw, 460px"
                className={`${styles.galleryImage} ${styles.galleryImageContain}`}
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
              <p className={styles.galleryNotice}>
                <Info aria-hidden="true" /> Porción de 15 g · 21 porciones por envase · 315 g de contenido neto total.
              </p>
            </div>
          </div>
        </section>

        {/* OFERTA Y PEDIDOS */}
        <section id="oferta" className={styles.offer} aria-labelledby="offer-title">
          <div className={styles.offerIntro}>
            <p className={styles.sectionEyebrow}>PRESENTACIONES Y PRECIOS</p>
            <h2 id="offer-title">Elige tu RENÖVA+</h2>
            <p>Selecciona tu presentación y coordina tu pedido directo con atención personalizada por WhatsApp.</p>
          </div>

          <div className={styles.packageGrid}>
            {RENOVA_CONFIG.packages.map((item) => {
              const isRecommended = item.recommended;
              return (
                <article
                  className={isRecommended ? styles.packageRecommended : styles.packageCard}
                  key={item.id}
                >
                  {isRecommended && (
                    <span className={styles.packageBadge}>
                      <Star aria-hidden="true" /> MÁS CONVENIENTE
                    </span>
                  )}
                  <p className={styles.packageName}>{item.name}</p>
                  <div className={styles.priceContainer}>
                    <span className={styles.mainPrice}>{item.priceDisplay}</span>
                    {item.unitPriceDisplay && (
                      <span className={styles.unitPriceHighlight}>{item.unitPriceDisplay}</span>
                    )}
                  </div>
                  <span className={styles.availability}>
                    <Check aria-hidden="true" /> {RENOVA_CONFIG.commercial.availabilityLabel}
                  </span>
                  <p className={styles.packageDescription}>{item.description}</p>
                  <button
                    className={isRecommended ? styles.packagePrimary : styles.packageSecondary}
                    type="button"
                    onClick={() => {
                      selectPackage(item.id, "Tarjeta de oferta");
                      openWhatsApp("Tarjeta de oferta", undefined, item.id);
                    }}
                  >
                    <MessageCircle aria-hidden="true" /> PEDIR POR WHATSAPP
                  </button>
                </article>
              );
            })}
          </div>

          {/* GARANTÍA DE PAGO CONTRA ENTREGA */}
          <div className={styles.guaranteeBanner}>
            <ShieldCheck aria-hidden="true" className={styles.guaranteeIcon} />
            <div>
              <h3>PAGO CONTRA ENTREGA</h3>
              <p>Pide hoy. Paga al recibir en tu domicilio.</p>
              <small>*Sujeto a disponibilidad y cobertura geográfica en Perú.</small>
            </div>
          </div>

          {/* FORMULARIO DE ASISTENCIA Y PEDIDO */}
          <form className={styles.orderForm} onSubmit={submitOrder} noValidate>
            <div className={styles.formHeading}>
              <p className={styles.sectionEyebrow}>PEDIDO RÁPIDO ASISTIDO</p>
              <h3>Déjanos tus datos para coordinar tu envío.</h3>
              <p>Al enviar, abriremos WhatsApp con tu mensaje formateado para coordinar directamente con el equipo de Bismillah.</p>
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
                  <span>
                    <strong>{item.name}</strong> · {item.priceDisplay} {item.unitPriceDisplay ? `(${item.unitPriceDisplay})` : ""}
                  </span>
                </label>
              ))}
            </div>

            <div className={styles.formGrid}>
              <label>
                Nombre completo
                <input
                  value={order.name}
                  onChange={updateField("name")}
                  autoComplete="name"
                  placeholder="Tu nombre y apellido"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "renova-name-error" : undefined}
                />
                {errors.name && <small id="renova-name-error">{errors.name}</small>}
              </label>

              <label>
                Celular de contacto
                <input
                  value={order.phone}
                  onChange={updateField("phone")}
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="9XXXXXXXX"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "renova-phone-error" : undefined}
                />
                {errors.phone && <small id="renova-phone-error">{errors.phone}</small>}
              </label>

              <label>
                Distrito (Envío)
                <input
                  value={order.district}
                  onChange={updateField("district")}
                  autoComplete="address-level2"
                  placeholder="Ej. Miraflores, Surco, Trujillo..."
                  aria-invalid={Boolean(errors.district)}
                  aria-describedby={errors.district ? "renova-district-error" : undefined}
                />
                {errors.district && <small id="renova-district-error">{errors.district}</small>}
              </label>

              <label>
                Dirección o referencia
                <input
                  value={order.address}
                  onChange={updateField("address")}
                  autoComplete="street-address"
                  placeholder="Av, calle, número y referencia de entrega"
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? "renova-address-error" : undefined}
                />
                {errors.address && <small id="renova-address-error">{errors.address}</small>}
              </label>
            </div>

            <label className={styles.consentLabel}>
              <input
                type="checkbox"
                checked={order.consent}
                onChange={(event) => {
                  setOrder((current) => ({ ...current, consent: event.target.checked }));
                  setErrors((current) => ({ ...current, consent: undefined }));
                }}
              />
              <span>Autorizo abrir WhatsApp para coordinar mi pedido comercial con Bismillah.</span>
            </label>
            {errors.consent && <small className={styles.formError}>{errors.consent}</small>}

            <div className={styles.formFooter}>
              <button className={styles.primaryButton} type="submit">
                <MessageCircle aria-hidden="true" /> ENVIAR PEDIDO POR WHATSAPP
              </button>
              <p aria-live="polite">{formStatus}</p>
            </div>
          </form>
        </section>

        {/* FAQS */}
        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>PREGUNTAS FRECUENTES</p>
            <h2 id="faq-title">Respuestas directas sobre RENÖVA+</h2>
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

        {/* BLOQUE FINAL DE CIERRE */}
        <section className={styles.closing} aria-labelledby="closing-title">
          <div className={styles.closingContent}>
            <p className={styles.sectionEyebrow}>RENÖVA+ · BISMILLAH WELLNESS</p>
            <h2 id="closing-title">Eleva tu ritual diario desde dentro.</h2>
            <p>Haz espacio para una nutrición completa con 11,4 g de colágeno doblemente hidrolizado, biopéptidos activos, Resveratrol y CoQ10.</p>
            <div className={styles.heroActions}>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => openWhatsApp("Cierre Button Primary", undefined, "pack-3")}
              >
                <MessageCircle aria-hidden="true" /> PEDIR RENÖVA+ POR WHATSAPP
              </button>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={scrollToOffer}
              >
                VER PRESENTACIONES <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <Image
            src={RENOVA_CONFIG.images.front}
            alt="Envase auténtico de RENÖVA+ al cierre."
            width={941}
            height={1671}
            sizes="(max-width: 880px) 60vw, 360px"
            className={styles.closingImage}
          />
        </section>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className={styles.mobileCta}>
        <div className={styles.mobileCtaText}>
          <strong>RENÖVA+</strong>
          <span>Desde S/109 c/u*</span>
          <small>*Pack 3 unidades</small>
        </div>
        <button
          type="button"
          onClick={() => openWhatsApp("Sticky Mobile CTA", undefined, "pack-3")}
        >
          <MessageCircle aria-hidden="true" /> PEDIR POR WHATSAPP
        </button>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <button
        className={styles.floatingWhatsApp}
        type="button"
        onClick={() => openWhatsApp("Floating Button RENÖVA+", undefined, "pack-3")}
        aria-label="Pedir RENÖVA+ por WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
      </button>
    </main>
  );
}
