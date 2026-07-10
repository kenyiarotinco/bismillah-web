"use client";

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#030712] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs font-display">B</span>
            </div>
            <span className="font-display font-bold text-lg tracking-wide text-white">BISMILLAH</span>
          </div>
          <p className="text-sm text-gray-400">
            Tu bienestar comienza con decisiones inteligentes. Suplementos premium para una vida mejor.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Empresa</h4>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-[#d4af37] transition-colors">Sobre Nosotros</a></li>
            <li><a href="#beneficios" className="hover:text-[#d4af37] transition-colors">Beneficios</a></li>
            <li><a href="#faq" className="hover:text-[#d4af37] transition-colors">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Políticas</h4>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-[#d4af37] transition-colors">Términos de Servicio</a></li>
            <li><a href="#" className="hover:text-[#d4af37] transition-colors">Privacidad</a></li>
            <li><a href="#" className="hover:text-[#d4af37] transition-colors">Envíos y Devoluciones</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contacto</h4>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li>Lima, Perú</li>
            <li>contacto@bismillah.pe</li>
            <li>+51 938 128 411</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} BISMILLAH Wellness. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-4 text-gray-500 text-xs">
          Diseñado para el bienestar integral.
        </div>
      </div>
    </footer>
  );
}
