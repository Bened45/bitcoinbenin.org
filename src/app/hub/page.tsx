import React from 'react';
import type { Metadata } from 'next';
import { PageTransition } from '../components/Animations';
import { FaLaptopCode, FaUsers, FaGraduationCap } from 'react-icons/fa';

export const metadata: Metadata = {
  title: "Le HUB | Bitcoin Bénin",
  description: "Découvrez le futur Bitcoin Benin HUB : un espace dédié à l'adoption, l'éducation et l'innovation autour de Bitcoin.",
};

export default function HubPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-brand-dark pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">

            <h1 className="text-4xl md:text-6xl font-black text-white font-display mb-6">
              Le Bitcoin Benin <span className="text-brand-orange">HUB</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Nous construisons un espace physique communautaire dédié à l'écosystème Bitcoin. 
              Cette page est en cours de construction et sera bientôt mise à jour avec plus de détails !
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="mt-16 w-full max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-orange/10 bg-brand-charcoal/50 flex flex-col items-center justify-center group">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(247,147,26,0.1)] group-hover:shadow-[0_0_40px_rgba(247,147,26,0.3)] group-hover:border-brand-orange/30">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-brand-orange border-b-[10px] border-b-transparent ml-2"></div>
              </div>
              <p className="text-gray-400 font-medium tracking-wide">Vidéo de présentation à venir</p>
              
              {/* INSTRUCTIONS D'INTÉGRATION CLOUDINARY
                Quand votre vidéo sera prête, remplacez cette <div> par :
                
                <iframe
                  src="VOTRE_URL_CLOUDINARY_ICI"
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                ></iframe>
              */}
            </div>
          </div>

        </div>
      </main>
    </PageTransition>
  );
}
