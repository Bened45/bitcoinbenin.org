'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaWhatsapp, FaExternalLinkAlt, FaBitcoin, FaTag, FaSearch, FaMap } from 'react-icons/fa';

// Fausse base de données pour valider le design
const DUMMY_MERCHANTS = [
  {
    id: '1',
    name: 'Café Satoshi',
    category: 'Restauration',
    description: 'Le meilleur café de Cotonou, torréfié sur place. Venez déguster nos pâtisseries en payant directement sur le Lightning Network.',
    address: 'Quartier Haie Vive, Rue 234',
    city: 'Cotonou',
    btcMapUrl: 'https://btcmap.org/map',
    contactUrl: 'https://wa.me/12345678',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1447&auto=format&fit=crop',
    discount: '10% de réduction en BTC',
    tags: ['Café', 'Pâtisserie', 'Lightning']
  },
  {
    id: '2',
    name: 'TechHub Bénin',
    category: 'Boutique',
    description: 'Boutique spécialisée dans la vente de matériel informatique, hardware wallets (Trezor/Ledger) et accessoires.',
    address: 'Avenue Steinmetz',
    city: 'Cotonou',
    btcMapUrl: 'https://btcmap.org/map',
    contactUrl: 'https://wa.me/12345678',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1501&auto=format&fit=crop',
    discount: null,
    tags: ['Électronique', 'Wallets', 'Accessoires']
  },
  {
    id: '3',
    name: 'Hôtel La Boussole',
    category: 'Hébergement',
    description: 'Hôtel moderne et confortable au centre de Bohicon. Accepte les paiements Bitcoin pour les réservations de chambres et le restaurant.',
    address: 'Centre Ville',
    city: 'Bohicon',
    btcMapUrl: 'https://btcmap.org/map',
    contactUrl: 'https://wa.me/12345678',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop',
    discount: 'Petit déjeuner offert en BTC',
    tags: ['Hôtel', 'Tourisme', 'Restaurant']
  }
];

const CATEGORIES = ['Tous', 'Restauration', 'Boutique', 'Hébergement', 'Services'];

export default function CommercesPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMerchants = DUMMY_MERCHANTS.filter(merchant => {
    const matchesCategory = activeCategory === 'Tous' || merchant.category === activeCategory;
    const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          merchant.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-brand-dark pb-24">
      {/* ─── HERO SECTION ──────────────────────────────── */}
      <section className="relative overflow-hidden pt-56 md:pt-64 pb-20 md:pb-28">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-[#1a0e00] to-brand-dark" />
        <motion.div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/8 rounded-full blur-[150px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Large faded Bitcoin symbol */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 0.04, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="text-brand-orange"
          >
            <FaBitcoin size={500} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/30 rounded-full text-sm font-bold mb-8 backdrop-blur-sm">
              <FaBitcoin className="text-lg animate-pulse" /> Adoption Circulaire
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              Dépensez vos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange">
                Bitcoin
              </span>
              <br className="hidden md:block" /> au Bénin
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
              Soutenez l&apos;économie locale et l&apos;adoption circulaire en achetant des biens et services
              directement en Bitcoin chez nos commerçants partenaires.
            </p>
          </motion.div>



          {/* Search + Filters integrated in hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col gap-4 p-5 bg-brand-charcoal/60 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl shadow-black/30">
              {/* Search bar */}
              <div className="relative w-full">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Rechercher un commerce, une ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-dark/80 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white text-lg focus:outline-none focus:border-brand-orange/60 focus:shadow-[0_0_20px_rgba(247,147,26,0.1)] transition-all placeholder:text-gray-500"
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeCategory === category 
                        ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LISTE DES COMMERCES ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredMerchants.map((merchant) => (
              <motion.div
                key={merchant.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-charcoal/30 border border-white/10 rounded-3xl overflow-hidden flex flex-col group hover:border-brand-orange/50 hover:shadow-[0_0_30px_rgba(247,147,26,0.1)] transition-all"
              >
                {/* Image Cover */}
                <div className="relative h-56 w-full overflow-hidden bg-brand-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={merchant.imageUrl}
                    alt={merchant.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent opacity-90"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    {merchant.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-white group-hover:text-brand-orange transition-colors">
                      {merchant.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <FaMapMarkerAlt className="text-brand-orange" />
                    <span>{merchant.address}, <strong className="text-white">{merchant.city}</strong></span>
                  </div>

                  {merchant.discount && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-orange/10 border border-brand-orange/20 rounded-lg text-brand-orange text-xs font-bold mb-4 w-fit">
                      <FaTag /> {merchant.discount}
                    </div>
                  )}

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                    {merchant.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-white/5">
                    <a 
                      href={merchant.btcMapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors border border-white/5"
                    >
                      <FaMap className="text-brand-green" /> Voir sur BTC Map
                    </a>
                    <a 
                      href={merchant.contactUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-xl text-sm font-bold transition-colors"
                    >
                      <FaWhatsapp className="text-xl" /> Contacter
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMerchants.length === 0 && (
          <div className="text-center py-20 bg-brand-charcoal/20 rounded-3xl border border-white/5">
            <FaSearch className="text-4xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucun commerce trouvé</h3>
            <p className="text-gray-400">Essayez de modifier vos filtres de recherche.</p>
          </div>
        )}
      </section>
      
      {/* ─── ADD YOUR BUSINESS CTA ─────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mt-24">
        <div className="bg-gradient-to-br from-brand-orange/20 to-brand-dark border border-brand-orange/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4">Vous acceptez Bitcoin ?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Ajoutez gratuitement votre commerce à notre annuaire et gagnez en visibilité auprès de la communauté crypto locale et internationale.
            </p>
            <a 
              href="/accepter-bitcoin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-brand-orange/20"
            >
              Ajouter mon commerce <FaExternalLinkAlt />
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
