'use client';

import { useState, useEffect } from 'react';
import { supabase, GalleryImage } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Button from './ui/Button';
import { FaImages, FaArrowRight } from 'react-icons/fa';

export default function GalleryPreview() {
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState(false);

  useEffect(() => {
    // Vérifier si Supabase est configuré
    if (!supabase) {
      setSupabaseError(true);
      setLoading(false);
      return;
    }
    fetchRecentImages();
  }, []);

  const fetchRecentImages = async () => {
    try {
      const { data, error } = await supabase!
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);

      if (error) {
        console.error('Erreur lors du chargement des images:', error);
        setSupabaseError(true);
      } else {
        setRecentImages(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSupabaseError(true);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (filePath: string) => {
    if (!supabase) return '';
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <section className="py-20 bg-brand-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-white">Chargement de la gallery...</div>
          </div>
        </div>
      </section>
    );
  }

  if (supabaseError || recentImages.length === 0) {
    return null; // Ne pas afficher la section si Supabase n'est pas configuré ou s'il n'y a pas d'images
  }

  return (
    <section className="py-20 bg-brand-charcoal/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaImages className="text-3xl text-brand-green" />
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              Gallery
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2">
                Photos
              </span>
            </h2>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Découvrez les moments forts de notre communauté Bitcoin Bénin à travers nos photos d&apos;événements et meetups.
          </p>
          <Link href="/gallery">
            <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
              Voir toute la gallery
              <FaArrowRight />
            </Button>
          </Link>
        </div>

        {/* Grid d'images récentes (Staggered Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 pt-8 pb-12 max-w-6xl mx-auto">
          {recentImages.slice(0, 4).map((image, index) => {
            // Calcul des décalages pour reproduire l'effet de l'image
            let translateY = '';
            if (index === 0) translateY = 'md:translate-y-12 translate-y-4';
            else if (index === 1) translateY = 'md:-translate-y-8 -translate-y-2';
            else if (index === 2) translateY = 'md:translate-y-4 translate-y-6';
            else if (index === 3) translateY = 'md:translate-y-16 -translate-y-4';

            const isLast = index === 3;
            const showOverlay = isLast && recentImages.length > 4;
            const remainingCount = recentImages.length - 3;

            return (
              <Link 
                href="/gallery" 
                key={image.id}
                className={`group relative aspect-[9/16] md:aspect-[3/5] rounded-3xl overflow-hidden bg-brand-dark/50 border border-white/10 hover:border-brand-green/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] ${translateY}`}
              >
                <Image
                  src={getImageUrl(image.file_path)}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Texte et infos */}
                {!showOverlay && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm md:text-base font-bold truncate drop-shadow-md mb-1">{image.title}</p>
                    {image.event_date && (
                      <p className="text-brand-green text-xs md:text-sm font-semibold drop-shadow-md">
                        {new Date(image.event_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                )}

                {/* Overlay pour la dernière image s'il y a plus de 4 photos */}
                {showOverlay && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 group-hover:bg-black/60 group-hover:backdrop-blur-sm">
                    <span className="text-white text-4xl md:text-5xl font-black drop-shadow-2xl">
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
