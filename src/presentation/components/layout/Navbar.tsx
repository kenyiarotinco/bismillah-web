"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '../uikit';
import { MagneticButton } from '../animations/motion-elements';
import { cn } from '../uikit/utils';
import { buildWhatsAppUrl } from '../../config/whatsapp';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Programas', href: '#programas' },
    { name: 'Productos', href: '#productos' },
    { name: 'Beneficios', href: '#beneficios' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(), '_blank');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b",
        isScrolled
          ? "bg-[#030712]/80 backdrop-blur-md border-white/10 py-4 shadow-lg shadow-black/20"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg font-display">B</span>
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-white">BISMILLAH</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <MagneticButton>
            <Button variant="luxury" onClick={handleWhatsApp} className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Contacto
            </Button>
          </MagneticButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#030712] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button variant="luxury" onClick={handleWhatsApp} className="mt-4 w-full justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Contacto
          </Button>
        </div>
      )}
    </header>
  );
}
