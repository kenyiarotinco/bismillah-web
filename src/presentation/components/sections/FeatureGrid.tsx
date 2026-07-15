"use client";

import React from 'react';
import { Moon, Zap, Activity, Bone, Dumbbell, HeartPulse } from 'lucide-react';
import { FadeUp, HoverGlowCard } from '../animations/motion-elements';

const benefits = [
  { icon: Moon, title: "Sueño Profundo", desc: "Regula el ciclo circadiano y mejora la calidad del descanso." },
  { icon: Zap, title: "Energía Sostenida", desc: "Optimiza la producción celular de ATP para vitalidad diaria." },
  { icon: Activity, title: "Recuperación Celular", desc: "Acelera los procesos regenerativos del sistema nervioso." },
  { icon: Bone, title: "Sistema Óseo", desc: "Fija el calcio y fortalece la estructura ósea." },
  { icon: Dumbbell, title: "Función Muscular", desc: "Previene calambres y mejora la contracción muscular." },
  { icon: HeartPulse, title: "Salud Cardiovascular", desc: "Regula la presión arterial y protege el corazón." }
];

export default function FeatureGrid() {
  return (
    <section id="beneficios" className="py-24 bg-[#030712] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-4">
              Beneficios <span className="text-[#d4af37]">Clínicos</span>
            </h2>
            <p className="text-gray-400 text-lg">
              El impacto del magnesio y suplementos premium en tu biología.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <FadeUp key={index} delay={index * 0.1}>
              <HoverGlowCard className="p-8 bg-[#0b0f19] flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-amber-600/5 border border-[#d4af37]/20 flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="text-xl font-bold text-white font-display mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{benefit.desc}</p>
              </HoverGlowCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
