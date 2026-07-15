"use client";

import React from 'react';
import Navbar from '../presentation/components/layout/Navbar';
import Hero from '../presentation/components/sections/Hero';
import ProgramsList from '../presentation/components/sections/ProgramsList';
import FeatureGrid from '../presentation/components/sections/FeatureGrid';
import QuienesSomos from '../presentation/components/sections/QuienesSomos';
import ProductsList from '../presentation/components/sections/ProductsList';
import Testimonials from '../presentation/components/sections/Testimonials';
import LogisticaEnvios from '../presentation/components/sections/LogisticaEnvios';
import FAQAccordion from '../presentation/components/sections/FAQAccordion';
import InfraestructuraB2B from '../presentation/components/sections/InfraestructuraB2B';
import Footer from '../presentation/components/layout/Footer';
import FloatingWhatsApp from '../presentation/components/layout/FloatingWhatsApp';
import { ScrollProgress } from '../presentation/components/animations/motion-elements';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-white overflow-hidden flex flex-col font-sans">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProgramsList />
        <ProductsList />
        <FeatureGrid />
        <QuienesSomos />
        <Testimonials />
        <LogisticaEnvios />
        <FAQAccordion />
        <InfraestructuraB2B />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
