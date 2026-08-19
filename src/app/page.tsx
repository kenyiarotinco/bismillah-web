import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleHelp,
  MessageCircle,
  PackageCheck,
  Store,
  Truck,
} from "lucide-react";
import { buildWhatsAppUrl } from "../presentation/config/whatsapp";
import { SITE_CONFIG } from "../presentation/config/site";
import styles from "./page.module.css";

const generalWhatsAppUrl = buildWhatsAppUrl("Hola Bismillah, quiero orientación para elegir un producto.");
const wholesaleWhatsAppUrl = buildWhatsAppUrl("Hola Bismillah, quiero información para compras mayoristas.");

const products = [
  {
    name: "RENÖVA+ Berries",
    description:
      "Una fórmula en polvo con colágeno doblemente hidrolizado, biopéptidos, vitaminas, minerales y fibra en presentación de 315 g.",
    note: "Conoce la presentación, la rutina y las opciones disponibles.",
    href: "/renova-plus",
    cta: "Conocer RENÖVA+",
    image: "/images/renova-plus/renova-front-authentic.png",
    imageAlt: "Frasco oficial de RENÖVA+ Berries.",
    tone: "renova",
  },
  {
    name: "Bio Prost",
    description:
      "Fórmula de bienestar masculino en presentación de 30 tabletas, desarrollada con ingredientes seleccionados para acompañar una rutina consciente de cuidado masculino.",
    note: "Conoce su composición y consulta disponibilidad antes de coordinar tu pedido.",
    href: "/bioprost-premium",
    cta: "Conocer Bio Prost",
    image: "/images/bioprost-premium/bioprost-front-official.png",
    imageAlt: "Frasco Bio Prost de 30 tabletas.",
    tone: "bioprost",
  },
  {
    name: "AlphaMan",
    description:
      "Fórmula natural de bienestar masculino en presentación de 20 cápsulas, desarrollada con ingredientes seleccionados para acompañar la energía, vitalidad y confianza.",
    note: "Conoce su composición y consulta disponibilidad antes de coordinar tu pedido.",
    href: "/alphaman",
    cta: "Conocer AlphaMan",
    image: "/images/alphaman/alphaman-front.png",
    imageAlt: "Frasco AlphaMan de 20 cápsulas.",
    tone: "alphaman",
  },
] as const;

const questions = [
  {
    question: "¿Cómo sé cuál es la fórmula adecuada para mí?",
    answer:
      "Empieza por revisar la presentación y la información del producto. Si tienes dudas, escríbenos por WhatsApp y te ayudamos a entender las opciones disponibles; una consulta comercial no sustituye la orientación de un profesional de salud.",
  },
  {
    question: "¿Puedo consultar disponibilidad antes de pedir?",
    answer:
      "Sí. Antes de coordinar cualquier pedido confirmamos la presentación disponible, el precio vigente y la modalidad de entrega.",
  },
  {
    question: "¿Atienden pedidos mayoristas?",
    answer:
      "Sí. Si tienes una tienda, emprendimiento o necesitas evaluar una compra por volumen, escríbenos para conversar sobre disponibilidad y condiciones comerciales.",
  },
] as const;

export default function Home() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#contenido">
        Ir al contenido principal
      </a>

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Ir al inicio de Bismillah Mayorista">
          <Image
            src="/images/brand/bismillah-icon.png"
            alt=""
            width={38}
            height={38}
            className={styles.brandMark}
          />
          <span>
            <strong>BISMILLAH</strong>
            <small>Mayorista · Perú</small>
          </span>
        </Link>

        <nav className={styles.navigation} aria-label="Navegación principal">
          <a href="#productos">Productos</a>
          <a href="#proceso">Cómo comprar</a>
          <a href="#mayoristas">Mayoristas</a>
          <a href="#preguntas">Preguntas</a>
        </nav>

        <a className={styles.headerCta} href={generalWhatsAppUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" size={17} />
          Consultar
        </a>
      </header>

      <div id="contenido">
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroContent}>
            <p className={styles.heroBrand}>Bismillah Mayorista</p>
            <h1 id="home-title">Bienestar que eliges con información clara.</h1>
            <p className={styles.heroCopy}>
              Conoce fórmulas seleccionadas para tu rutina, revisa su presentación real y conversa con nuestro equipo antes de decidir.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#productos">
                Explorar productos <ArrowRight aria-hidden="true" size={18} />
              </a>
              <a className={styles.secondaryAction} href={generalWhatsAppUrl} target="_blank" rel="noopener noreferrer">
                Hablar por WhatsApp
              </a>
            </div>
            <ul className={styles.heroReassurance} aria-label="Información de servicio">
              <li><Check aria-hidden="true" size={16} /> Presentaciones reales</li>
              <li><Check aria-hidden="true" size={16} /> Consulta antes de comprar</li>
              <li><Check aria-hidden="true" size={16} /> Entregas según cobertura</li>
            </ul>
          </div>

          <div className={styles.heroVisual} aria-label="Productos destacados de Bismillah">
            <div className={styles.heroGlow} aria-hidden="true" />
            <article className={styles.renovaFrame}>
              <div className={styles.renovaCopy}>
                <span>Fórmula destacada</span>
                <strong>RENÖVA+</strong>
                <small>Berries · 315 g</small>
              </div>
              <Image
                src="/images/renova-plus/renova-front-authentic.png"
                alt="Frasco oficial de RENÖVA+ Berries."
                fill
                preload
                sizes="(max-width: 760px) 78vw, (max-width: 1100px) 46vw, 430px"
                className={styles.renovaImage}
              />
            </article>
            <article className={styles.bioprostFrame}>
              <Image
                src="/images/bioprost-premium/bioprost-front-official.png"
                alt="Frasco Bio Prost de 30 tabletas."
                fill
                sizes="(max-width: 760px) 35vw, 190px"
                className={styles.bioprostImage}
              />
              <span>Bio Prost</span>
            </article>
          </div>
        </section>

        <section className={styles.serviceStrip} aria-label="Forma de atención de Bismillah">
          <p><PackageCheck aria-hidden="true" size={19} /> Revisas la presentación antes de pedir</p>
          <p><MessageCircle aria-hidden="true" size={19} /> Consultas directamente con el equipo</p>
          <p><Truck aria-hidden="true" size={19} /> Coordinamos la entrega contigo</p>
        </section>

        <section id="productos" className={styles.products} aria-labelledby="products-title">
          <div className={styles.sectionHeading}>
            <h2 id="products-title">Empieza por una fórmula que sí puedas conocer.</h2>
            <p>
              Dos rutas claras, información de cada presentación y atención directa cuando necesites resolver una duda.
            </p>
          </div>

          <div className={styles.productGrid}>
            {products.map((product) => (
              <article className={`${styles.productCard} ${product.tone === "renova" ? styles.productRenova : styles.productBioprost}`} key={product.name}>
                <div className={styles.productVisual}>
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 840px) 100vw, 50vw"
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productContent}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <small>{product.note}</small>
                  <Link className={styles.productLink} href={product.href}>
                    {product.cta} <ArrowRight aria-hidden="true" size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="proceso" className={styles.process} aria-labelledby="process-title">
          <div className={styles.processHeading}>
            <h2 id="process-title">Comprar sin adivinar.</h2>
            <p>El proceso es simple porque la conversación llega después de que ya viste lo importante.</p>
          </div>
          <ol className={styles.processList}>
            <li>
              <span>Explora</span>
              <p>Revisa qué contiene cada presentación y para qué tipo de rutina fue creada.</p>
            </li>
            <li>
              <span>Consulta</span>
              <p>Escríbenos para confirmar disponibilidad, precio vigente y la modalidad de entrega.</p>
            </li>
            <li>
              <span>Coordina</span>
              <p>Definimos contigo los detalles del pedido antes de enviar o entregar.</p>
            </li>
          </ol>
        </section>

        <section id="mayoristas" className={styles.wholesale} aria-labelledby="wholesale-title">
          <div>
            <Store aria-hidden="true" size={28} strokeWidth={1.6} />
            <h2 id="wholesale-title">Una conversación distinta para compras por volumen.</h2>
          </div>
          <div className={styles.wholesaleCopy}>
            <p>
              Si tienes una tienda, emprendimiento o quieres evaluar una compra mayorista, conversemos sobre disponibilidad y condiciones comerciales.
            </p>
            <a href={wholesaleWhatsAppUrl} target="_blank" rel="noopener noreferrer">
              Consultar por mayor <ArrowRight aria-hidden="true" size={17} />
            </a>
          </div>
        </section>

        <section id="preguntas" className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}>
            <h2 id="faq-title">Lo importante, antes de escribirnos.</h2>
            <p>Respuestas claras para que tu consulta empiece desde un lugar informado.</p>
          </div>
          <div className={styles.faqList}>
            {questions.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <CircleHelp aria-hidden="true" size={20} />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div>
          <Link className={styles.footerBrand} href="/">BISMILLAH</Link>
          <p>Fórmulas de bienestar, información clara y atención por WhatsApp.</p>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/renova-plus">RENÖVA+</Link>
          <Link href="/bioprost-premium">Bio Prost</Link>
          <a href={generalWhatsAppUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
        </div>
        <p className={styles.footerLegal}>© {new Date().getFullYear()} Bismillah Mayorista · Lima, Perú</p>
      </footer>

      <a className={styles.floatingWhatsApp} href={generalWhatsAppUrl} target="_blank" rel="noopener noreferrer" aria-label="Hablar con Bismillah por WhatsApp">
        <MessageCircle aria-hidden="true" size={25} />
      </a>
    </main>
  );
}
