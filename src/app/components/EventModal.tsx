'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeaturedEvent } from '@/app/types/events';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
  featuredEvent: FeaturedEvent | null;
}

export default function EventModal({ isOpen, onClose, onDontShowAgain, featuredEvent }: EventModalProps) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    if (!isOpen || !featuredEvent) return;

    const targetDate = new Date(featuredEvent.start_date);
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds, isPast: false });
      } else {
        // Événement en cours - temps écoulé depuis le début
        const elapsed = Math.abs(difference);
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        
        setCountdown({ days: 0, hours, minutes, seconds, isPast: true });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Toutes les secondes

    return () => clearInterval(interval);
  }, [isOpen, featuredEvent]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-gradient-to-br from-brand-dark via-brand-charcoal to-brand-dark border border-brand-orange/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-sm font-semibold mb-4"
              >
                <span className="text-lg">🔥</span>
                ÉVÉNEMENT EN VEDETTE
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2">
                {featuredEvent?.title || 'Événement Bitcoin Bénin'}
              </h3>

              {/* Date & Location */}
              <div className="text-gray-300 mb-4 space-y-1">
                {featuredEvent && (
                  <>
                    <p className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(featuredEvent.start_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {featuredEvent.end_date && featuredEvent.end_date !== featuredEvent.start_date && (
                        <> - {new Date(featuredEvent.end_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</>
                      )}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {featuredEvent.location}
                    </p>
                  </>
                )}
              </div>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-black/30 rounded-lg p-4 sm:p-6 mb-6"
              >
                <p className="text-brand-orange font-bold text-sm sm:text-lg text-center mb-3 sm:mb-4">
                  {countdown.isPast ? 'Événement en cours' : 'Événement commence dans'}
                </p>
                
                {!countdown.isPast ? (
                  <div className="flex justify-center items-center gap-1 sm:gap-3 text-center">
                    <motion.div
                      key={`days-${countdown.days}`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-brand-dark/50 rounded-lg p-1.5 sm:p-3 flex-1 min-w-0"
                    >
                      <div className="text-base sm:text-2xl font-bold text-white">
                        {String(countdown.days).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">J</div>
                      <div className="text-xs text-gray-400 sm:hidden">J</div>
                    </motion.div>
                    
                    <div className="text-sm sm:text-xl font-bold text-brand-orange flex-shrink-0">:</div>
                    
                    <motion.div
                      key={`hours-${countdown.hours}`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-brand-dark/50 rounded-lg p-1.5 sm:p-3 flex-1 min-w-0"
                    >
                      <div className="text-base sm:text-2xl font-bold text-white">
                        {String(countdown.hours).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">H</div>
                      <div className="text-xs text-gray-400 sm:hidden">H</div>
                    </motion.div>
                    
                    <div className="text-sm sm:text-xl font-bold text-brand-orange flex-shrink-0">:</div>
                    
                    <motion.div
                      key={`minutes-${countdown.minutes}`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-brand-dark/50 rounded-lg p-1.5 sm:p-3 flex-1 min-w-0"
                    >
                      <div className="text-base sm:text-2xl font-bold text-white">
                        {String(countdown.minutes).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">M</div>
                      <div className="text-xs text-gray-400 sm:hidden">M</div>
                    </motion.div>
                    
                    <div className="text-sm sm:text-xl font-bold text-brand-orange flex-shrink-0">:</div>
                    
                    <motion.div
                      key={`seconds-${countdown.seconds}`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-brand-orange/20 rounded-lg p-1.5 sm:p-3 flex-1 min-w-0 border border-brand-orange/30"
                    >
                      <div className="text-base sm:text-2xl font-bold text-brand-orange">
                        {String(countdown.seconds).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-brand-orange hidden sm:block">S</div>
                      <div className="text-xs text-brand-orange sm:hidden">S</div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-brand-orange mb-2">
                      🎉 EN COURS 🎉
                    </div>
                    <div className="text-base sm:text-lg text-white">
                      Depuis {countdown.hours}h {countdown.minutes}min {countdown.seconds}s
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <p className="text-gray-300 mb-6">
                {featuredEvent?.description || 'Rejoignez-nous pour cet événement exceptionnel !'}
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => featuredEvent?.registration_url && window.open(featuredEvent.registration_url, '_blank')}
                  className="w-full bg-gradient-to-r from-brand-orange to-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                   S'inscrire maintenant
                </motion.button>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.open('/events', '_self')}
                    className="flex-1 border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                     Voir tous les événements
                  </button>
                  
                  <button
                    onClick={onDontShowAgain}
                    className="flex-1 border border-gray-600 text-gray-400 py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                     Ne plus afficher
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
