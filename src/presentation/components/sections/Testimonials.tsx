"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { FadeUp, HoverGlowCard } from '../animations/motion-elements';

const testimonials = [
  {
    name: "María Fernanda T.",
    role: "Cliente Verificada",
    content: "Desde que empecé el programa de Sueño & Recuperación con Citrato de Magnesio y Ashwagandha, mi descanso es profundo y continuo. Despierto con energía real.",
    rating: 5,
    avatar: "/images/testimonios/maria-fernanda.png"
  },
  {
    name: "Carlos R.",
    role: "Deportista",
    content: "El programa de Articulaciones me ayudó muchísimo con los dolores de rodilla. El colágeno premium se nota a las pocas semanas.",
    rating: 5,
    avatar: "/images/testimonios/carlos-r.png"
  },
  {
    name: "Lucía M.",
    role: "Cliente Verificada",
    content: "La asesoría por WhatsApp es excelente. Me guiaron para elegir el suplemento exacto que necesitaba para mi ritmo de trabajo.",
    rating: 5,
    avatar: "/images/testimonios/lucia-m.png"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#030712] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-4">
              Resultados <span className="text-[#d4af37]">Reales</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Descubre cómo nuestros programas han transformado vidas.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeUp key={index} delay={index * 0.1}>
              <HoverGlowCard className="p-8 bg-[#0b0f19] flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                </div>
                <p className="font-serif text-gray-300 text-lg mb-8 italic flex-1 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#d4af37]/30"
                  />
                  <div>
                    <h4 className="text-white font-bold font-display">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </HoverGlowCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
