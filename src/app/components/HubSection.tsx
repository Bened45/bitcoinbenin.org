'use client';

import { motion } from 'framer-motion';
import { FaLaptopCode, FaUsers, FaGraduationCap } from 'react-icons/fa';

export default function HubSection() {
  const features = [
    {
      icon: <FaUsers className="text-3xl text-brand-orange" />,
      title: "Coworking & Échanges",
      description: "Un espace ouvert pour travailler, rencontrer d'autres passionnés et construire l'avenir de l'économie circulaire."
    },
    {
      icon: <FaGraduationCap className="text-3xl text-brand-green" />,
      title: "Formations & Ateliers",
      description: "Des sessions régulières pour comprendre le protocole, la sécurité et le Lightning Network."
    },
    {
      icon: <FaLaptopCode className="text-3xl text-brand-blue" />,
      title: "Incubateur de Projets",
      description: "Un soutien technique et stratégique pour les développeurs et entrepreneurs de l'écosystème."
    }
  ];

  return (
    <section className="py-24 bg-brand-charcoal/20 border-y border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >

            <h2 className="text-4xl md:text-5xl font-black text-white font-display mb-6 leading-tight">
              Le <span className="text-brand-orange">Bitcoin Benin</span> HUB
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Plus qu'un simple local, le HUB sera le cœur battant de notre communauté. 
              Un espace physique 100% dédié à l'adoption, l'éducation et l'innovation autour de Bitcoin et du Lightning Network en Afrique de l'Ouest.
            </p>

            <a 
              href="/hub" 
              className="inline-block px-8 py-4 bg-white text-brand-dark font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
            >
              Découvrir
            </a>
          </motion.div>

          {/* Right content (Features) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6"
          >
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-brand-dark border border-white/10 p-6 rounded-2xl flex gap-6 items-start hover:border-brand-orange/30 transition-colors group"
              >
                <div className="p-4 bg-brand-charcoal rounded-xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
