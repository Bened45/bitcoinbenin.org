import React from 'react';
import type { Metadata } from 'next';

import AcceptBitcoinHero from '../components/AcceptBitcoinHero';
import HowToIntegrate from '../components/HowToIntegrate';

export const metadata: Metadata = {
  title: "Accepter Bitcoin | Bitcoin Benin",
  description: "Découvrez comment accepter Bitcoin dans votre commerce au Bénin. Solutions de paiement, formations gratuites et accompagnement personnalisé pour les commerçants.",
};

export default function AcceptBitcoinPage() {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AcceptBitcoinHero />

        <div className="my-12"></div>

        <HowToIntegrate />

        {/* Call to Action Section */}
        <section className="glass-panel p-12 rounded-3xl text-center border border-white/5 relative overflow-hidden mt-20">
          <div className="absolute inset-0 bg-brand-orange/5 blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Besoin d&apos;aide ?</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              La communauté Bitcoin Bénin vous accompagne gratuitement dans la mise en place de solutions de paiement Bitcoin pour votre commerce. Contactez-nous pour une consultation personnalisée.
            </p>
            <a
              href="mailto:benedoffice@gmail.com"
              className="inline-block px-8 py-4 rounded-full font-bold text-white bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange transition-all duration-300"
            >
              Contactez-nous
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
