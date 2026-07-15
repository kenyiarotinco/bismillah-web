"use client";

import React from 'react';
import { MessageCircle, ArrowDown, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../uikit';
import { FadeUp, FadeLeft, FloatingElement } from '../animations/motion-elements';
import { buildWhatsAppUrl } from '../../config/whatsapp';

export default function Hero() {
  const handlePrograms = () => {
    const el = document.getElementById('programas');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(), '_blank');
  };

  return (
    <section id="inicio" className="relative min-h-screen pt-28 pb-16 flex items-center bg-[#030712] overflow-hidden">
      {/* Background ambient lighting - Champagne Gold */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#d4af37]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#d4af37]/10 blur-[150px] pointer-events-none" />
      
      {/* Modern dotted grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left Copy Content */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-widest backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" /> Wellness Tech
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] font-display max-w-2xl">
              Pureza que transforma. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-amber-200">Calidad que exige resultados.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.3}>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg font-sans">
              Suplementación de grado farmacéutico diseñada para quienes no negocian su bienestar y exigen lo mejor.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="flex flex-wrap items-center gap-4 w-full mt-4">
              <Button
                variant="luxury"
                size="lg"
                onClick={handlePrograms}
                className="w-full sm:w-auto justify-center"
              >
                Eleva tu Estándar Hoy
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWhatsApp}
                className="w-full sm:w-auto justify-center gap-2 border-white/20 hover:bg-white/5"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={0.5}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2 pt-6 border-t border-white/10 w-full">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" /> 100% Natural
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Truck className="w-4 h-4 text-[#d4af37]" /> Envíos a Todo el Perú
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MessageCircle className="w-4 h-4 text-[#d4af37]" /> Asesoría Personalizada
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Right Cinematic Supplement Floating Showcase */}
        <div className="lg:col-span-5 relative flex justify-center items-center h-[420px] hidden md:flex">
          <FadeLeft delay={0.3}>
            <div className="relative w-[340px] h-[340px] rounded-full border border-white/5 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-3xl flex items-center justify-center">
              
              <div className="absolute -top-6 -right-6 scale-90 sm:scale-100 z-20">
                <FloatingElement duration={3.5}>
                  <div className="p-4 rounded-2xl bg-[#0b0f19]/90 border border-emerald-500/20 backdrop-blur-md shadow-2xl flex flex-col gap-2 w-44">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Alta Absorción</span>
                    <span className="text-sm font-black text-white leading-none">Citrato Magnesio</span>
                    <div className="h-1 w-8 bg-emerald-500 rounded" />
                  </div>
                </FloatingElement>
              </div>

              <div className="absolute top-1/3 -left-12 scale-90 sm:scale-100 z-10">
                <FloatingElement duration={4.2}>
                  <div className="p-4 rounded-2xl bg-[#0b0f19]/90 border border-[#d4af37]/20 backdrop-blur-md shadow-2xl flex flex-col gap-2 w-48">
                    <span className="text-[9px] font-bold text-[#d4af37] uppercase tracking-wider">Regeneración</span>
                    <span className="text-sm font-black text-white leading-none">Colágeno Premium</span>
                    <div className="h-1 w-8 bg-[#d4af37] rounded" />
                  </div>
                </FloatingElement>
              </div>

              <div className="absolute -bottom-8 right-4 scale-90 sm:scale-100 z-20">
                <FloatingElement duration={3.8}>
                  <div className="p-4 rounded-2xl bg-[#0b0f19]/90 border border-emerald-500/20 backdrop-blur-md shadow-2xl flex flex-col gap-2 w-40">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Sueño Profundo</span>
                    <span className="text-sm font-black text-white leading-none">Ashwagandha</span>
                    <div className="h-1 w-8 bg-emerald-500 rounded" />
                  </div>
                </FloatingElement>
              </div>

              {/* Core product showcase bubble */}
              <div className="w-56 h-56 rounded-full overflow-hidden border border-[#d4af37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative">
                <img
                  src="/images/secciones/hero-omega3.png"
                  alt="Suplemento premium Omega 3 grado farmacéutico Bismillah"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
              </div>
            </div>
          </FadeLeft>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500 text-xs cursor-pointer" onClick={handlePrograms}>
        <span>Descubre más</span>
        <ArrowDown className="w-4 h-4 animate-bounce mt-2" />
      </div>
    </section>
  );
}
