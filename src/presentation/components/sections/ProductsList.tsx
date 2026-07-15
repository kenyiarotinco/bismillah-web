"use client";

import React from 'react';
import { FadeUp, HoverGlowCard } from '../animations/motion-elements';

const products = [
  {
    id: 1,
    name: "Citrato de Magnesio",
    brand: "Magnesium Citrate",
    desc: "Polvo soluble en agua, fórmula alemana. Alta absorción para el sistema nervioso.",
    image: "/images/productos/citrato-magnesio.jpeg"
  },
  {
    id: 2,
    name: "Glicinato de Magnesio",
    brand: "Nanita Foods",
    desc: "Polvo instantáneo premium sin azúcar. Ideal para relajación y sueño profundo.",
    image: "/images/productos/glicinato-magnesio.jpeg"
  },
  {
    id: 3,
    name: "Treonato de Magnesio",
    brand: "Nanita Foods",
    desc: "100 unidades de 500mg, sin preservantes. Diseñado para la salud cognitiva y memoria.",
    image: "/images/productos/treonato-magnesio.jpeg"
  },
  {
    id: 4,
    name: "Sulfato de Magnesio",
    brand: "Kallpa Luz",
    desc: "Cristales premium Epsom para baños relajantes. Relajación física y mental.",
    image: "/images/productos/sulfato-magnesio.jpeg"
  },
  {
    id: 5,
    name: "Sal de Epsom Maxx",
    brand: "Natural Maxx",
    desc: "100 cápsulas 100% naturales para el sistema nervioso y bienestar diario.",
    image: "/images/productos/sal-epsom.jpeg"
  },
  {
    id: 6,
    name: "ResverAge",
    brand: "NNF Novoamérica",
    desc: "Antioxidante a base de uva borgoña, maíz morado, arándanos y açaí berry. Sin azúcar añadida.",
    image: "/images/productos/resverage.jpeg"
  },
  {
    id: 7,
    name: "Multivitamínicos en Gomitas",
    brand: "TMX Wellness",
    desc: "70 unidades sabor a fresa con graviola, moringa, camu camu y complejo de vitaminas B1-B12, A, C, D, E.",
    image: "/images/productos/multivitaminicos-gomitas.jpeg"
  },
  {
    id: 8,
    name: "BioVit C Maxx",
    brand: "Natural Maxx",
    desc: "Vitamina C concentrada, antioxidante natural para fortalecer tu sistema inmune.",
    image: "/images/productos/biovit-c.jpeg"
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
