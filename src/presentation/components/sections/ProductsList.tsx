"use client";

import React from 'react';
import { Package } from 'lucide-react';
import { FadeUp, HoverGlowCard } from '../animations/motion-elements';

const products = [
  { id: 1, name: "Citrato de Magnesio", desc: "Alta absorción para el sistema nervioso." },
  { id: 2, name: "Glicinato de Magnesio", desc: "Ideal para relajación y sueño profundo." },
  { id: 3, name: "Treonato de Magnesio", desc: "Diseñado para la salud cognitiva y memoria." },
  { id: 4, name: "Cloruro de Magnesio", desc: "Apoyo fundamental para huesos y músculos." },
  { id: 5, name: "Magnesio en Gomitas", desc: "Formato delicioso y práctico para el día a día." }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <FadeUp key={product.id} delay={index * 0.1}>
              <HoverGlowCard className="p-6 bg-[#0b0f19] flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-amber-600/5 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display mb-1">{product.name}</h3>
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
