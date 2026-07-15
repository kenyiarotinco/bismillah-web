"use client";

import React from 'react';
import { FadeUp } from '../animations/motion-elements';

export default function QuienesSomos() {
  return (
    <section id="nosotros" className="py-24 bg-[#030712] relative border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <FadeUp>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/images/secciones/quienes-somos-sala.png"
              alt="Sala de reuniones corporativa Bismillah con vista al almacén"
              className="w-full h-full object-cover"
            />
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" /> Quiénes Somos
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-6 leading-tight">
            Decisiones Respaldadas por la <span className="text-[#d4af37]">Ciencia</span> y la Transparencia.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            No somos simples intermediarios, somos los arquitectos de tu bienestar. Cada fórmula de BISMILLAH nace en nuestras instalaciones con un único objetivo: entregar una pureza innegociable. Operamos sin filtros, controlando nuestra cadena de valor para garantizar que lo que promete la etiqueta, es exactamente lo que recibe tu cuerpo.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
