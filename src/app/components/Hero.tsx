'use client';

import { motion } from 'framer-motion';
import Button from './ui/Button';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Bitcoin Benin Hero Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/90 via-brand-dark/80 to-brand-dark"></div>
      </div>

      {/* Background Ambience Simple */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-green/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white mb-6">
            L&apos;avenir de la finance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent drop-shadow-lg">
              se construit ici.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-400 leading-relaxed">
            Rejoignez la première communauté dédiée à l&apos;éducation, l&apos;adoption et le développement de l&apos;écosystème Bitcoin au Bénin.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" size="lg" onClick={() => window.open('https://t.me/+vUzohmB0EFMzZTI8', '_blank')}>
              Rejoindre la Communauté
            </Button>
            <Button variant="secondary" size="lg" onClick={() => window.location.href = '/NosRessources'}>
              Explorer les Ressources
            </Button>
          </div>
        </motion.div>

        {/* Metrics */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Membres', value: '500+' },
            { label: 'Meetups', value: '20+' },
            { label: 'Projets', value: '10+' },
            { label: 'Partenaires', value: '5+' },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center group hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-display font-black text-white mb-1 group-hover:text-brand-green transition-colors">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
