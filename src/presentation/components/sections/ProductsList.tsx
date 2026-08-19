"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FadeUp, HoverGlowCard } from '../animations/motion-elements';

type FeaturedProduct = {
  id: string;
  name: string;
  productLine?: string;
  brand: string;
  territory: string;
  description: string;
  image: string | null;
  imageAlt: string | null;
  imageFit: string;
  imageClassName: string;
  href: string | null;
  cta: string;
  accentClassName: string;
};

const featuredProducts = [
  {
    id: 'renova',
    name: 'RENÖVA+',
    brand: 'FWP',
    territory: 'Belleza · Vitalidad · Bienestar',
    description: 'Colágeno doblemente hidrolizado con biopéptidos activos, Resveratrol, CoQ10, vitaminas, minerales y fibra.',
    image: '/images/renova-plus/renova-front-authentic.png',
    imageAlt: 'Frasco oficial de RENÖVA+ de FWP.',
    imageFit: 'object-contain p-6',
    imageClassName: 'bg-[#f5eee6]',
    href: '/renova-plus',
    cta: 'DESCUBRIR RENÖVA+',
    accentClassName: 'text-[#df4da3]',
  },
  {
    id: 'bioprost',
    name: 'BioProst Premium',
    brand: 'Bismillah Men\'s Wellness',
    territory: 'Bienestar masculino',
    description: 'BioProst Premium es un suplemento nutricional para adultos presentado en un frasco de 30 tabletas y formulado con diferentes ingredientes nutricionales y botánicos.',
    image: '/images/bioprost-premium/bioprost-front-official.png',
    imageAlt: 'Frasco de BioProst Premium en presentación de 30 tabletas.',
    imageFit: 'object-cover',
    imageClassName: 'bg-[#0d1616]',
    href: '/bioprost-premium',
    cta: 'DESCUBRIR BIOPROST',
    accentClassName: 'text-[#d4af37]',
  },
  {
    id: 'naturalmaxx',
    name: 'NaturalMaxx',
    productLine: 'Cappuccino Moringa Coffee Maxx',
    brand: 'NaturalMaxx',
    territory: 'Café funcional · Vitalidad',
    description: 'Cappuccino con moringa pensado para acompañar tu ritual diario de café y bienestar.',
    image: null,
    imageAlt: null,
    imageFit: '',
    imageClassName: '',
    href: null,
    cta: 'PRÓXIMAMENTE',
    accentClassName: 'text-[#b9c476]',
  },
] satisfies readonly FeaturedProduct[];

const products = [
  {
    id: 1,
    name: 'Pro Vita Sabor Vainilla',
    brand: 'Power Factor',
    desc: 'Fórmula proteica al 40% con calostro bovino, DHA y prebióticos. Nutrición de grado clínico para una recuperación superior.',
    image: '/assets/productos_raw/ProVita_Vainilla_PowerFactor.png'
  },
  {
    id: 2,
    name: 'Citrato de Magnesio',
    brand: 'Magnesium Citrate',
    desc: 'Polvo soluble en agua de fórmula alemana. Máxima biodisponibilidad para calmar el sistema nervioso sin efecto laxante.',
    image: '/assets/productos_raw/Citrato_Magnesio_Powder.png'
  },
  {
    id: 3,
    name: 'Sulfato de Magnesio',
    brand: 'Kallpa Luz',
    desc: 'Cristales premium Epsom importados de Alemania. Relajación física y mental profunda en cada baño terapéutico.',
    image: '/assets/productos_raw/Sulfato_Magnesio_KallpaLuz.png'
  },
  {
    id: 4,
    name: 'Treonato de Magnesio',
    brand: 'Nanita Foods',
    desc: 'Fórmula de máxima biodisponibilidad diseñada para potenciar la función cognitiva y el descanso profundo. Calidad farmacéutica innegociable.',
    image: '/assets/productos_raw/Treonato_Magnesio_NanitaFoods.png'
  },
  {
    id: 5,
    name: 'Sal de Epsom Maxx',
    brand: 'Natural Maxx',
    desc: 'Cápsulas 100% naturales con Vitamina C y Magnesio. Soporte diario para tu sistema nervioso, grado premium sin aditivos.',
    image: '/assets/productos_raw/Sal_Epsom_NaturalMaxx.png'
  },
  {
    id: 6,
    name: 'ResverAge',
    brand: 'NNF Novoamérica',
    desc: 'Antioxidante premium a base de uva borgoña, camu camu y açaí berry. Combate el estrés oxidativo célula a célula, sin azúcar añadida.',
    image: '/assets/productos_raw/ResverAge_NNF.png'
  },
  {
    id: 7,
    name: 'Glicinato de Magnesio',
    brand: 'Nanita Foods',
    desc: 'Polvo instantáneo premium sin azúcar. La forma más suave y absorbible de magnesio para una relajación y sueño profundo.',
    image: '/assets/productos_raw/Glicinato_Magnesio_NanitaFoods.png'
  },
  {
    id: 8,
    name: 'Multivitamínicos en Gomitas',
    brand: 'TMX Wellness',
    desc: '70 gomitas sabor fresa con graviola, moringa y complejo B1-B12, A, C, D, E. Nutrición completa en formato delicioso, sin azúcar.',
    image: '/assets/productos_raw/Multivitaminas_Gomitas_TMX.png'
  },
  {
    id: 9,
    name: 'BioVit C Maxx',
    brand: 'Natural Maxx',
    desc: 'Vitamina C concentrada de alta pureza. Antioxidante natural que fortalece tu sistema inmune día a día.',
    image: '/assets/productos_raw/BioVitC_VitaminaC_NaturalMaxx.png'
  },
  {
    id: 10,
    name: 'Propóleo Tutuma + Ajos',
    brand: 'Natural Maxx',
    desc: 'Bebida herbal a base de propóleo, tutuma y ajos con camu camu y miel de abejas. Blindaje natural para tus defensas.',
    image: '/assets/productos_raw/Propoleo_Tutuma_Ajos_NaturalMaxx.png'
  },
  {
    id: 11,
    name: 'Gomitas Probióticas',
    brand: 'Nanita Foods',
    desc: 'Gomitas con tocish, muña y cultivos probióticos vivos. Equilibra tu flora intestinal con sabor a fresa, sin azúcar añadida.',
    image: '/assets/productos_raw/Probiotico_Gomitas_NanitaFoods.png'
  },
  {
    id: 12,
    name: 'Xtreme Moringa Gummies',
    brand: 'Pharma Xtreme',
    desc: 'Gomitas de moringa potenciadas con Omega 3, 6 y 9. Energía vegetal y protección celular en cada dosis diaria.',
    image: '/assets/productos_raw/Moringa_Gummies_XtremeFX.png'
  },
  {
    id: 13,
    name: 'Savia de Plátano Herbal',
    brand: 'Natural Maxx',
    desc: 'Bebida herbal a base de savia de plátano, camu camu y propóleo. Equilibrio digestivo con pureza 100% vegetal.',
    image: '/assets/productos_raw/SaviaPlatano_Herbal_NaturalMaxx.png'
  },
  {
    id: 14,
    name: 'Sábila Herbal',
    brand: 'Natural Maxx',
    desc: 'Extracto herbal de sábila, uña de gato y propóleo. Regeneración natural para tu sistema digestivo y tus defensas.',
    image: '/assets/productos_raw/Sabila_Herbal_NaturalMaxx.png'
  },
  {
    id: 15,
    name: 'Gummix Relax',
    brand: 'Gummix',
    desc: 'Gomitas con glicinato de magnesio, L-teanina y B6 sabor limón. Calma el estrés y serena tu mente sin efecto sedante.',
    image: '/assets/productos_raw/Gummix_Relax_GlicinatoMagnesio.png'
  },
  {
    id: 16,
    name: 'Aceite de Coco',
    brand: 'CocoLife',
    desc: 'Aceite de coco 100% extra virgen, prensado en frío. Pureza amazónica para tu piel, cabello y bienestar diario.',
    image: '/assets/productos_raw/AceiteCoco_CocoLife_BioSelva.png'
  },
  {
    id: 17,
    name: 'Vitatrum Multivitamin',
    brand: 'Mason Natural',
    desc: 'Fórmula multivitamínica y multimineral en tableta reducida. Bienestar general respaldado desde 1967.',
    image: '/assets/productos_raw/Vitatrum_Multivitamin_MasonNatural.png'
  },
  {
    id: 18,
    name: 'Helix Original',
    brand: 'Colágeno Hidrolizado',
    desc: 'Colágeno hidrolizado enriquecido con magnesio. Regeneración articular y muscular para cuerpos en movimiento constante.',
    image: '/assets/productos_raw/Colageno_HelixOriginal_Magnesio.png'
  }
];

function FeaturedProductCard({ product }: { product: FeaturedProduct }) {
  const card = (
    <HoverGlowCard className="flex h-full min-h-[530px] flex-col border-white/10 bg-[#0b0f19] shadow-[0_24px_80px_-42px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:-translate-y-1">
      <div className={`relative aspect-[4/3] w-full overflow-hidden ${product.imageClassName}`}>
        {product.image && product.imageAlt ? (
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className={product.imageFit}
          />
        ) : (
          <div className="absolute inset-0 overflow-hidden bg-[#241b18]" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_28%,rgba(185,196,118,0.24),transparent_29%),radial-gradient(circle_at_20%_100%,rgba(191,130,75,0.34),transparent_40%)]" />
            <div className="absolute inset-x-9 top-10 h-px bg-[#d8b782]/40" />
            <div className="absolute inset-x-9 bottom-10 flex items-end justify-between text-[#f5e7ce]/75">
              <span className="font-display text-3xl font-semibold tracking-tight">NaturalMaxx</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">Próximamente</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className={`text-[10px] font-bold uppercase tracking-[0.28em] ${product.accentClassName}`}>{product.brand}</p>
        <h3 id={`featured-${product.id}-title`} className="mt-3 min-h-[3.75rem] font-display text-2xl font-bold leading-tight text-white">
          {product.name}
          {product.productLine ? <span className="mt-1 block text-sm font-medium leading-snug text-white/70">{product.productLine}</span> : null}
        </h3>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">{product.territory}</p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{product.description}</p>
        <span className={`mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${product.accentClassName}`}>
          {product.cta}
          {product.href ? <span aria-hidden="true">→</span> : null}
        </span>
      </div>
    </HoverGlowCard>
  );

  return product.href ? (
    <Link href={product.href} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050812]">
      {card}
    </Link>
  ) : (
    <article className="h-full" aria-labelledby={`featured-${product.id}-title`}>
      {card}
    </article>
  );
}

export default function ProductsList() {
  return (
    <>
      <section id="productos-destacados" aria-labelledby="productos-destacados-title" className="relative border-t border-white/5 bg-[#050812] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeUp>
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#d4af37]">Productos destacados</p>
              <h2 id="productos-destacados-title" className="font-display text-3xl font-black text-white md:text-5xl">
                Tres fórmulas. <span className="text-[#d4af37]">Tres formas</span> de cuidar tu bienestar.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-400">
                Conoce los productos protagonistas de Bismillah, seleccionados para acompañar diferentes momentos de tu rutina.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <FadeUp key={product.id} delay={index * 0.08} className="h-full">
                <FeaturedProductCard product={product} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section id="productos" aria-labelledby="coleccion-premium-title" className="relative border-t border-white/5 bg-[#030712] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="coleccion-premium-title" className="text-3xl md:text-5xl font-black text-white font-display mb-4">
              Nuestra <span className="text-[#d4af37]">Colección Premium</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Suplementos puros, desarrollados con la más alta biodisponibilidad.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const card = (
              <HoverGlowCard className="flex flex-col h-full bg-[#0b0f19]">
                <div className="relative aspect-square w-full overflow-hidden bg-[#050810]">
                  <Image
                    src={product.image}
                    alt={`${product.name} - ${product.brand}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest mb-1">{product.brand}</span>
                  <h3 className="text-lg font-bold text-white font-display mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{product.desc}</p>
                </div>
              </HoverGlowCard>
            );

            return (
              <FadeUp key={product.id} delay={index * 0.08}>
                {card}
              </FadeUp>
            );
          })}
        </div>
      </div>
      </section>
    </>
  );
}
