'use client';

import { useState, useEffect } from 'react';
import { getFeaturedEvent } from '@/app/lib/events';
import { FeaturedEvent } from '@/app/types/events';

export function useEventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);
  const [featuredEvent, setFeaturedEvent] = useState<FeaturedEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Vérifier si l'utilisateur a déjà vu la modal
      const hasSeen = localStorage.getItem('event-modal-seen');
      setHasSeenModal(!!hasSeen);

      // Charger l'événement vedette depuis Supabase
      const event = await getFeaturedEvent();
      setFeaturedEvent(event);
      setLoading(false);

      // Afficher la modal après 3 secondes si pas encore vue et événement actif
      if (!hasSeen && event && event.is_active) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3000);

        return () => clearTimeout(timer);
      }
    };

    loadData();
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const dontShowAgain = () => {
    localStorage.setItem('event-modal-seen', 'true');
    setHasSeenModal(true);
    setIsOpen(false);
  };

  return {
    isOpen,
    hasSeenModal,
    featuredEvent,
    loading,
    openModal,
    closeModal,
    dontShowAgain
  };
}
