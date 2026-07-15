"use client";

import React from 'react';
import { FadeUp } from '../animations/motion-elements';

export default function LogisticaEnvios() {
  return (
    <section className="py-24 bg-[#030712] relative border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <FadeUp className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" /> Logística y Envíos
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-6 leading-tight">
            Precisión Logística. <span className="text-[#d4af37]">Cero Excusas.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Sabemos que tu salud no puede esperar. Nuestras estaciones de despacho operan bajo protocolos de trazabilidad estrictos. Procesamiento inmediato, empaquetado seguro y despachos exactos. Recibes tu inversión de manera rápida y en perfectas condiciones.
          </p>
        </FadeUp>

        <FadeUp delay={0.15} className="order-1 lg:order-2">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/images/secciones/logistica-despacho.png"
              alt="Estación de despacho y etiquetado de pedidos Bismillah"
              className="w-full h-full object-cover"
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
