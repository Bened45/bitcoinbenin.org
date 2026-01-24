'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from './ui/Button';
import { PARTNERS } from '../data';

export default function Partners() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-10">
          Ils nous soutiennent
        </p>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 mb-16">
          {PARTNERS.map((partner, index) => (
            <div key={index} className="relative h-12 w-40 hover:opacity-100 transition-opacity hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain filter invert brightness-0 hover:invert-0 hover:brightness-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-8 md:p-12 border border-white/10 bg-brand-charcoal/40 backdrop-blur-md max-w-4xl mx-auto shadow-glass relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full pointer-events-none"></div>

          <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Envie de soutenir notre initiative ?</h3>
          <p className="text-gray-400 mb-8 relative z-10">
            Participez au développement de l&apos;écosystème Bitcoin au Bénin en devenant partenaire.
          </p>
          <Link href="/nous-soutenir" className="relative z-10">
            <Button variant="primary">Faire un don</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
