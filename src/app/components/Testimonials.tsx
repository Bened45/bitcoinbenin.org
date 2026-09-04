'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Aurel",
    role: "Développeur",
    content: "La communauté m'a permis de comprendre les enjeux techniques du protocole Bitcoin et de lancer mon propre nœud."
  },
  {
    name: "SarahK",
    role: "Entrepreneure",
    content: "Grâce aux meetups, j'ai pu intégrer le paiement Bitcoin dans ma boutique en ligne facilement."
  },
  {
    name: "David",
    role: "Étudiant",
    content: "Une source d'information fiable et des passionnés toujours prêts à aider. Je recommande !"
  },
  {
    name: "Romain",
    role: "Investisseur",
    content: "J'ai passé un moment merveilleux lors des conférences. Un grand merci à toute l'équipe pour l'incroyable organisation !"
  },
  {
    name: "Aminata",
    role: "Commerçante",
    content: "Très heureuse d'avoir pris part aux dernières sessions. L'intégration de paiements en Bitcoin a transformé mon activité."
  },
  {
    name: "Jean-Paul",
    role: "Développeur",
    content: "Une belle richesse de possibilités de collaboration. L'écosystème local est très dynamique."
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 border-t border-white/5 bg-brand-charcoal/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white font-display text-center">
            Ce qu&apos;en disent nos membres
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-brand-dark border border-white/10 p-8 flex flex-col h-full z-10 transition-transform duration-300 hover:-translate-y-1 hover:-translate-x-1"
            >
              {/* Wireframe shadow effect adapted to dark theme */}
              <div className="absolute inset-0 border border-brand-green/70 translate-x-3 translate-y-3 -z-10 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"></div>

              <div className="text-5xl font-serif text-brand-green/40 mb-2 leading-none h-6">&ldquo;</div>
              
              <p className="text-gray-300 mb-12 flex-1 leading-relaxed">
                {t.content}
              </p>
              
              <div className="mt-auto">
                <span className="font-bold text-white text-sm">{t.name}</span>
                <span className="text-brand-green text-sm">, {t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
