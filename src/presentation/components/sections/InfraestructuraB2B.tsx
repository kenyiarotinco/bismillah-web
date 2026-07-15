"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../uikit';
import { FadeUp } from '../animations/motion-elements';
import { buildWhatsAppUrl } from '../../config/whatsapp';

export default function InfraestructuraB2B() {
  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl('Hola BISMILLAH, quiero información para ser distribuidor mayorista'), '_blank');
  };

  return (
    <section className="relative isolate py-28 lg:py-36 overflow-hidden border-t border-white/5">
      <img
        src="/images/secciones/infraestructura-almacen.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#030712] via-[#030712]/90 to-[#030712]/50" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <FadeUp>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Infraestructura y Mayoristas B2B
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-6 leading-tight">
              Infraestructura que Respalda tu Demanda.
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Contamos con la capacidad instalada para satisfacer al mercado a gran escala. Ya sea que busques transformar tu salud personal o convertirte en un socio distribuidor estratégico, nuestro centro de distribución garantiza disponibilidad inmediata y liquidez de inventario permanente.
            </p>
            <Button variant="luxury" size="lg" onClick={handleWhatsApp} className="gap-2">
              <MessageCircle className="w-4 h-4" /> Ser Distribuidor Mayorista
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
