"use client";

import React from 'react';
import { FadeUp, HoverGlowCard } from '../animations/motion-elements';

const products = [
  {
    id: 1,
    name: "Pro Vita Sabor Vainilla",
    brand: "Power Factor",
    desc: "Fórmula proteica al 40% con calostro bovino, DHA y prebióticos. Nutrición de grado clínico para una recuperación superior.",
    image: "/assets/productos_raw/ProVita_Vainilla_PowerFactor.png"
  },
  {
    id: 2,
    name: "Citrato de Magnesio",
    brand: "Magnesium Citrate",
    desc: "Polvo soluble en agua de fórmula alemana. Máxima biodisponibilidad para calmar el sistema nervioso sin efecto laxante.",
    image: "/assets/productos_raw/Citrato_Magnesio_Powder.png"
  },
  {
    id: 3,
    name: "Sulfato de Magnesio",
    brand: "Kallpa Luz",
    desc: "Cristales premium Epsom importados de Alemania. Relajación física y mental profunda en cada baño terapéutico.",
    image: "/assets/productos_raw/Sulfato_Magnesio_KallpaLuz.png"
  },
  {
    id: 4,
    name: "Treonato de Magnesio",
    brand: "Nanita Foods",
    desc: "Fórmula de máxima biodisponibilidad diseñada para potenciar la función cognitiva y el descanso profundo. Calidad farmacéutica innegociable.",
    image: "/assets/productos_raw/Treonato_Magnesio_NanitaFoods.png"
  },
  {
    id: 5,
    name: "Sal de Epsom Maxx",
    brand: "Natural Maxx",
    desc: "Cápsulas 100% naturales con Vitamina C y Magnesio. Soporte diario para tu sistema nervioso, grado premium sin aditivos.",
    image: "/assets/productos_raw/Sal_Epsom_NaturalMaxx.png"
  },
  {
    id: 6,
    name: "ResverAge",
    brand: "NNF Novoamérica",
    desc: "Antioxidante premium a base de uva borgoña, camu camu y açaí berry. Combate el estrés oxidativo célula a célula, sin azúcar añadida.",
    image: "/assets/productos_raw/ResverAge_NNF.png"
  },
  {
    id: 7,
    name: "Glicinato de Magnesio",
    brand: "Nanita Foods",
    desc: "Polvo instantáneo premium sin azúcar. La forma más suave y absorbible de magnesio para una relajación y sueño profundo.",
    image: "/assets/productos_raw/Glicinato_Magnesio_NanitaFoods.png"
  },
  {
    id: 8,
    name: "Multivitamínicos en Gomitas",
    brand: "TMX Wellness",
    desc: "70 gomitas sabor fresa con graviola, moringa y complejo B1-B12, A, C, D, E. Nutrición completa en formato delicioso, sin azúcar.",
    image: "/assets/productos_raw/Multivitaminas_Gomitas_TMX.png"
  },
  {
    id: 9,
    name: "BioVit C Maxx",
    brand: "Natural Maxx",
    desc: "Vitamina C concentrada de alta pureza. Antioxidante natural que fortalece tu sistema inmune día a día.",
    image: "/assets/productos_raw/BioVitC_VitaminaC_NaturalMaxx.png"
  },
  {
    id: 10,
    name: "Propóleo Tutuma + Ajos",
    brand: "Natural Maxx",
    desc: "Bebida herbal a base de propóleo, tutuma y ajos con camu camu y miel de abejas. Blindaje natural para tus defensas.",
    image: "/assets/productos_raw/Propoleo_Tutuma_Ajos_NaturalMaxx.png"
  },
  {
    id: 11,
    name: "Gomitas Probióticas",
    brand: "Nanita Foods",
    desc: "Gomitas con tocish, muña y cultivos probióticos vivos. Equilibra tu flora intestinal con sabor a fresa, sin azúcar añadida.",
    image: "/assets/productos_raw/Probiotico_Gomitas_NanitaFoods.png"
  },
  {
    id: 12,
    name: "Xtreme Moringa Gummies",
    brand: "Pharma Xtreme",
    desc: "Gomitas de moringa potenciadas con Omega 3, 6 y 9. Energía vegetal y protección celular en cada dosis diaria.",
    image: "/assets/productos_raw/Moringa_Gummies_XtremeFX.png"
  },
  {
    id: 13,
    name: "Savia de Plátano Herbal",
    brand: "Natural Maxx",
    desc: "Bebida herbal a base de savia de plátano, camu camu y propóleo. Equilibrio digestivo con pureza 100% vegetal.",
    image: "/assets/productos_raw/SaviaPlatano_Herbal_NaturalMaxx.png"
  },
  {
    id: 14,
    name: "Sábila Herbal",
    brand: "Natural Maxx",
    desc: "Extracto herbal de sábila, uña de gato y propóleo. Regeneración natural para tu sistema digestivo y tus defensas.",
    image: "/assets/productos_raw/Sabila_Herbal_NaturalMaxx.png"
  },
  {
    id: 15,
    name: "Gummix Relax",
    brand: "Gummix",
    desc: "Gomitas con glicinato de magnesio, L-teanina y B6 sabor limón. Calma el estrés y serena tu mente sin efecto sedante.",
    image: "/assets/productos_raw/Gummix_Relax_GlicinatoMagnesio.png"
  },
  {
    id: 16,
    name: "Aceite de Coco",
    brand: "CocoLife",
    desc: "Aceite de coco 100% extra virgen, prensado en frío. Pureza amazónica para tu piel, cabello y bienestar diario.",
    image: "/assets/productos_raw/AceiteCoco_CocoLife_BioSelva.png"
  },
  {
    id: 17,
    name: "Vitatrum Multivitamin",
    brand: "Mason Natural",
    desc: "Fórmula multivitamínica y multimineral en tableta reducida. Bienestar general respaldado desde 1967.",
    image: "/assets/productos_raw/Vitatrum_Multivitamin_MasonNatural.png"
  },
  {
    id: 18,
    name: "Helix Original",
    brand: "Colágeno Hidrolizado",
    desc: "Colágeno hidrolizado enriquecido con magnesio. Regeneración articular y muscular para cuerpos en movimiento constante.",
    image: "/assets/productos_raw/Colageno_HelixOriginal_Magnesio.png"
  }
];

export default function ProductsList() {
  return (
    <section id="productos" className="py-24 bg-[#030712] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-4">
              Nuestra <span className="text-[#d4af37]">Colección Premium</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Suplementos puros, desarrollados con la más alta biodisponibilidad.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <FadeUp key={product.id} delay={index * 0.08}>
              <HoverGlowCard className="bg-[#0b0f19] flex flex-col h-full">
                <div className="aspect-square w-full overflow-hidden bg-[#050810]">
                  <img
                    src={product.image}
                    alt={`${product.name} - ${product.brand}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest mb-1">{product.brand}</span>
                  <h3 className="text-lg font-bold text-white font-display mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{product.desc}</p>
                </div>
              </HoverGlowCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
