"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Check, MessageCircle, ShieldCheck } from "lucide-react";
import { ALPHAMAN_CONFIG, type AlphamanPackageId, buildAlphamanWhatsAppUrl } from "./alphaman.config";
import styles from "./alphaman.module.css";

type OrderField = "name" | "phone" | "district" | "address";
type OrderState = Record<OrderField, string> & { consent: boolean };
type OrderErrors = Partial<Record<OrderField | "consent", string>>;

function trackAlphamanEvent(event: string, detail?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, eventDetail?: Record<string, string>) => void;
  };
  const eventDetail = { product: ALPHAMAN_CONFIG.productName, ...detail };
  analyticsWindow.dataLayer?.push({ event, ...eventDetail });
  analyticsWindow.gtag?.("event", event, eventDetail);
}

export default function AlphamanLanding() {
  const [selectedPackage, setSelectedPackage] = useState<AlphamanPackageId>("duo");
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
    trackAlphamanEvent("alphaman_view");
  }, []);

  const openWhatsApp = (
    source: string,
    details?: Partial<OrderState>,
    packageId: AlphamanPackageId = selectedPackage,
  ) => {
    const url = buildAlphamanWhatsAppUrl({
      packageId,
      source,
      name: details?.name,
      phone: details?.phone,
      district: details?.district,
      address: details?.address,
    });
    trackAlphamanEvent("alphaman_whatsapp_click", { source, package: packageId });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const selectPackage = (packageId: AlphamanPackageId, source: string) => {
    setSelectedPackage(packageId);
    trackAlphamanEvent("alphaman_offer_select", { source, package: packageId });
  };

  const updateField = (field: OrderField) => (event: ChangeEvent<HTMLInputElement>) => {
    setOrder((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateOrder = (): OrderErrors => {
    const nextErrors: OrderErrors = {};
    if (order.name.trim().length < 2) nextErrors.name = "Ingresa tu nombre.";
    if (!/^9\d{8}$/.test(order.phone.replace(/\D/g, ""))) {
      nextErrors.phone = "Celular de 9 dígitos que empiece con 9.";
    }
    if (order.district.trim().length < 2) nextErrors.district = "Indica tu distrito.";
    if (order.address.trim().length < 8) nextErrors.address = "Dirección clara o referencia.";
    if (!order.consent) nextErrors.consent = "Autoriza la comunicación por WhatsApp.";
    return nextErrors;
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateOrder();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormStatus("Completa los campos señalados.");
      return;
    }
    trackAlphamanEvent("alphaman_order_submit", { package: selectedPackage });
    setFormStatus("Abriendo WhatsApp...");
    openWhatsApp("Formulario AlphaMan", order);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#contenido">
        Ir al contenido principal
      </a>

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Ir al inicio">
          <Image src="/images/brand/bismillah-icon.png" alt="Bismillah" width={34} height={34} />
          <span>BISMILLAH</span>
          <i aria-hidden="true" />
          <strong>ALPHAMAN</strong>
        </Link>
        <nav className={styles.navigation} aria-label="Navegación">
          <a href="#oferta">Precios</a>
          <a href="#faq">Preguntas</a>
        </nav>
        <button
          className={styles.headerCta}
          type="button"
          onClick={() => openWhatsApp("Header", undefined, "duo")}
        >
          <MessageCircle aria-hidden="true" /> Pedir por WhatsApp
        </button>
      </header>

      <div id="contenido">
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>BISMILLAH WELLNESS PRESENTA</p>
            <h1>
              Premium masculino,<em> para el hombre moderno.</em>
            </h1>
            <p className={styles.heroSubhead}>
              AlphaMan es más que un producto. Es un <strong>ritual de bienestar editorial</strong> diseñado con precisión para el cuidado masculino premium.
            </p>

            <div className={styles.heroOffer} aria-label="Precios de AlphaMan">
              <div>
                <span>Antes S/95</span>
                <strong>Ahora S/79</strong>
                <small>Ahorras S/16 · 17%</small>
              </div>
              <div>
                <span>Pack 2 Unidades</span>
                <strong>S/129 total</strong>
                <small>S/64.50 c/u · Ahorras S/61</small>
              </div>
            </div>

            <ul className={styles.heroChips} aria-label="Información de AlphaMan">
              <li><Check aria-hidden="true" /> <strong>Fórmula premium</strong> · 315 g</li>
              <li><Check aria-hidden="true" /> <strong>21 porciones</strong> · Editorial design</li>
              <li><Check aria-hidden="true" /> Pago contra entrega disponible</li>
            </ul>

            <div className={styles.heroActions}>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => openWhatsApp("Hero", undefined, "duo")}
              >
                <MessageCircle aria-hidden="true" /> PEDIR ALPHAMAN
              </button>
            </div>
            <p className={styles.heroGuaranteeNote}>
              <ShieldCheck aria-hidden="true" /> Garantía de pago contra entrega en zonas seleccionadas.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src={ALPHAMAN_CONFIG.images.hero}
              alt="AlphaMan front view"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className={styles.heroVisualImage}
            />
            <p className={styles.imageCaption}>AlphaMan Premium · Presentación 315 g netos.</p>
          </div>
        </section>

        <section id="oferta" className={styles.offer}>
          <div className={styles.offerIntro}>
            <p className={styles.eyebrow}>PRESENTACIONES Y PRECIOS</p>
            <h2>Elige tu AlphaMan</h2>
            <p>Selecciona tu presentación y coordina tu pedido directo por WhatsApp.</p>
          </div>

          <div className={styles.packageGrid}>
            {ALPHAMAN_CONFIG.packages.map((item) => {
              const isRecommended = item.recommended;
              return (
                <article
                  className={isRecommended ? styles.packageRecommended : styles.packageCard}
                  key={item.id}
                >
                  {isRecommended && (
                    <span className={styles.packageBadge}>
                      ✦ MÁS CONVENIENTE
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
                    <Check aria-hidden="true" /> Disponible
                  </span>
                  <p className={styles.packageDescription}>{item.description}</p>
                  <button
                    className={isRecommended ? styles.packagePrimary : styles.packageSecondary}
                    type="button"
                    onClick={() => {
                      selectPackage(item.id, "Tarjeta de oferta");
                      openWhatsApp("Oferta", undefined, item.id);
                    }}
                  >
                    <MessageCircle aria-hidden="true" /> PEDIR POR WHATSAPP
                  </button>
                </article>
              );
            })}
          </div>

          <div className={styles.guaranteeBanner}>
            <ShieldCheck aria-hidden="true" className={styles.guaranteeIcon} />
            <div>
              <h3>PAGO CONTRA ENTREGA</h3>
              <p>Pide hoy. Paga al recibir en tu domicilio.</p>
              <small>*Sujeto a disponibilidad y cobertura en Perú.</small>
            </div>
          </div>

          <form className={styles.orderForm} onSubmit={submitOrder} noValidate>
            <div className={styles.formHeading}>
              <p className={styles.eyebrow}>PEDIDO RÁPIDO</p>
              <h3>Coordina tu envío</h3>
            </div>

            <div className={styles.packageSelector} aria-label="Selecciona presentación">
              {ALPHAMAN_CONFIG.packages.map((item) => (
                <label key={item.id} className={selectedPackage === item.id ? styles.radioActive : styles.radioLabel}>
                  <input
                    type="radio"
                    name="package"
                    value={item.id}
                    checked={selectedPackage === item.id}
                    onChange={() => selectPackage(item.id, "Formulario")}
                  />
                  <span>
                    <strong>{item.name}</strong> · {item.priceDisplay}
                  </span>
                </label>
              ))}
            </div>

            <div className={styles.formGrid}>
              <label>
                Nombre
                <input
                  value={order.name}
                  onChange={updateField("name")}
                  placeholder="Tu nombre"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <small>{errors.name}</small>}
              </label>

              <label>
                Teléfono
                <input
                  value={order.phone}
                  onChange={updateField("phone")}
                  inputMode="numeric"
                  placeholder="9XXXXXXXX"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <small>{errors.phone}</small>}
              </label>

              <label>
                Distrito
                <input
                  value={order.district}
                  onChange={updateField("district")}
                  placeholder="Ej. Miraflores, Surco..."
                  aria-invalid={Boolean(errors.district)}
                />
                {errors.district && <small>{errors.district}</small>}
              </label>

              <label>
                Dirección
                <input
                  value={order.address}
                  onChange={updateField("address")}
                  placeholder="Av, calle, número y referencia"
                  aria-invalid={Boolean(errors.address)}
                />
                {errors.address && <small>{errors.address}</small>}
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
              <span>Autorizo abrir WhatsApp para coordinar mi pedido.</span>
            </label>
            {errors.consent && <small className={styles.formError}>{errors.consent}</small>}

            <div className={styles.formFooter}>
              <button className={styles.primaryButton} type="submit">
                <MessageCircle aria-hidden="true" /> ENVIAR PEDIDO
              </button>
              <p aria-live="polite">{formStatus}</p>
            </div>
          </form>
        </section>

        <section id="faq" className={styles.faq}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>PREGUNTAS FRECUENTES</p>
            <h2>Respuestas sobre AlphaMan</h2>
          </div>
          <div className={styles.faqGrid}>
            <article className={styles.faqItem}>
              <h3>¿Cuál es la dosis recomendada?</h3>
              <p>Una porción de 15 g diarios en 250 ml de agua o tu bebida favorita. Cada envase contiene 21 porciones.</p>
            </article>
            <article className={styles.faqItem}>
              <h3>¿Cuál es el sabor?</h3>
              <p>Premium Blend con perfil fresco y equilibrado. Diseñado para complementar tu rutina sin interferir con otros sabores.</p>
            </article>
            <article className={styles.faqItem}>
              <h3>¿Tiene azúcar o grasas?</h3>
              <p>No. AlphaMan contiene 0 g de azúcar, 0 g de grasas y 0 g de carbohidratos por porción.</p>
            </article>
            <article className={styles.faqItem}>
              <h3>¿Cuánto pesa cada envase?</h3>
              <p>Cada presentación contiene 315 g de contenido neto, equivalente a 21 porciones de 15 g.</p>
            </article>
            <article className={styles.faqItem}>
              <h3>¿Cuál es el tiempo de envío?</h3>
              <p>Pago contra entrega disponible en zonas seleccionadas de Perú. Coordina el detalle exacto de entrega directamente por WhatsApp después de tu pedido.</p>
            </article>
            <article className={styles.faqItem}>
              <h3>¿Cómo funciona el pago contra entrega?</h3>
              <p>Pides por WhatsApp sin pago previo. Coordinamos contigo la dirección y abonas cuando recibas el producto en tu domicilio (sujeto a disponibilidad y cobertura).</p>
            </article>
          </div>
        </section>
      </div>

      <div className={styles.mobileCta}>
        <div className={styles.mobileCtaText}>
          <strong>ALPHAMAN</strong>
          <span>Desde S/64.50 c/u*</span>
        </div>
        <button type="button" onClick={() => openWhatsApp("Sticky Mobile CTA", undefined, "duo")}>
          <MessageCircle aria-hidden="true" /> PEDIR
        </button>
      </div>

      <button
        className={styles.floatingWhatsApp}
        type="button"
        onClick={() => openWhatsApp("Floating", undefined, "duo")}
        aria-label="Pedir AlphaMan por WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
      </button>
    </main>
  );
}
