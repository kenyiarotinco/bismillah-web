"use client";

import React from 'react';
import { Moon, Activity, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../uikit';
import { FadeUp, HoverGlowCard } from '../animations/motion-elements';

const programs = [
  {
    id: 1,
    title: "Sueño & Recuperación",
    icon: Moon,
    description: "Restaura tu ciclo de sueño y despierta con energía renovada.",
    products: ["Citrato de Magnesio", "Ashwagandha", "Sleep Gummies"],
    color: "from-blue-500/20 to-indigo-500/5",
    iconColor: "text-blue-400"
  },
  {
    id: 2,
    title: "Articulaciones & Movimiento",
    icon: Activity,
    description: "Regenera tus cartílagos y recupera tu flexibilidad natural.",
    products: ["Citrato de Magnesio", "Colágeno", "Glucosamina"],
    color: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-400"
  },
  {
    id: 3,
    title: "Corazón & Energía",
    icon: Heart,
    description: "Protege tu sistema cardiovascular y eleva tu vitalidad.",
    products: ["Omega 3", "Vitamina D3", "Complejo B"],
    color: "from-rose-500/20 to-red-500/5",
    iconColor: "text-rose-400"
  }
];

export default function ProgramsList() {
  const handleWhatsApp = (programName: string) => {
    window.open(`https://wa.me/51938128411?text=Hola%20BISMILLAH,%20me%20interesa%20el%20Programa%20${encodeURIComponent(programName)}`, '_blank');
  };

  return (
    <section id="programas" className="py-24 bg-[#030712] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-4">
              Programas de <span className="text-[#d4af37]">Bienestar</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Soluciones integrales diseñadas para resultados específicos.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <FadeUp key={program.id} delay={index * 0.1}>
              <HoverGlowCard className="h-full flex flex-col p-8 bg-[#0b0f19]">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${program.color} border border-white/5 flex items-center justify-center mb-6`}>
                  <program.icon className={`w-7 h-7 ${program.iconColor}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 font-display">{program.title}</h3>
                <p className="text-gray-400 mb-8 flex-1">{program.description}</p>
                
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Incluye</h4>
                  <ul className="space-y-2">
                    {program.products.map((prod, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                        {prod}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full justify-between group border-white/10 hover:bg-white/5 text-white"
                  onClick={() => handleWhatsApp(program.title)}
                >
                  Ver Programa
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </HoverGlowCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
