"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeUp, HoverGlowCard } from '../animations/motion-elements';
import { cn } from '../uikit/utils';

const faqs = [
  {
    q: "¿Por qué el Citrato de Magnesio es mejor que otras formas?",
    a: "El Citrato de Magnesio tiene una de las tasas de absorción (biodisponibilidad) más altas en comparación con el óxido o cloruro, lo que significa que tu cuerpo lo aprovecha mejor sin efectos laxantes severos."
  },
  {
    q: "¿Cuánto tiempo tardaré en notar los beneficios?",
    a: "Los efectos en el sueño y relajación nerviosa pueden notarse en la primera semana. Para beneficios óseos, articulares y musculares profundos, recomendamos un uso continuo de 1 a 3 meses."
  },
  {
    q: "¿Puedo combinar diferentes suplementos?",
    a: "Sí, nuestros programas están diseñados específicamente con sinergias. Por ejemplo, el magnesio potencia la absorción de la Vitamina D3, y ambos trabajan perfecto con Omega 3."
  },
  {
    q: "¿Hacen envíos a todo el Perú?",
    a: "Sí, realizamos envíos seguros y garantizados a nivel nacional. En Lima Metropolitana la entrega es en 24-48 horas."
  },
  {
    q: "¿Cómo funciona la asesoría personalizada?",
    a: "Al adquirir cualquier programa, tienes acceso directo a nuestro canal de WhatsApp donde resolvemos tus dudas sobre dosificación, horarios y hábitos."
  },
  {
    q: "¿Tienen contraindicaciones?",
    a: "Nuestros suplementos son 100% naturales, pero si tienes insuficiencia renal grave, problemas cardíacos severos o estás embarazada, sugerimos consultar primero con tu médico."
  },
  {
    q: "¿A qué hora es mejor tomar el magnesio?",
    a: "Depende del tipo. El Glicinato y Citrato son ideales por la noche para inducir el sueño. El Treonato puede tomarse de día para enfoque mental."
  },
  {
    q: "¿Son productos originales?",
    a: "Totalmente. Trabajamos directamente con laboratorios certificados y todos nuestros productos cuentan con registro sanitario y sellos de calidad."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#030712] relative border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-4">
              Preguntas <span className="text-[#d4af37]">Frecuentes</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Resolvemos tus dudas sobre suplementación inteligente.
            </p>
          </div>
        </FadeUp>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <FadeUp key={index} delay={index * 0.05}>
              <HoverGlowCard className="bg-[#0b0f19]">
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => toggleOpen(index)}
                >
                  <span className="font-semibold text-white font-display text-lg">{faq.q}</span>
                  <ChevronDown className={cn("w-5 h-5 text-[#d4af37] transition-transform duration-300 shrink-0", openIndex === index && "rotate-180")} />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
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
