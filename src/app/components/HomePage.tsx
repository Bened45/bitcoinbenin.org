'use client';

import Hero from "./Hero";
import Mission from "./Mission";
import JoinUs from "./JoinUs";
import Testimonials from "./Testimonials";
import GalleryPreview from "./GalleryPreview";
import Partners from "./Partners";
import EventModal from "./EventModal";
import { useEventModal } from "../hooks/useEventModal";
import { PageTransition } from "./Animations";

export default function HomePage() {
  const { isOpen, closeModal, dontShowAgain, featuredEvent, loading } = useEventModal();

  if (loading) {
    return (
      <PageTransition>
        <Hero />
        <Mission />
        <JoinUs />
        <GalleryPreview />
        <Testimonials />
        <Partners />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Hero />
      <Mission />
      <JoinUs />
      <GalleryPreview />
      <Testimonials />
      <Partners />
      <EventModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        onDontShowAgain={dontShowAgain}
        featuredEvent={featuredEvent}
      />
    </PageTransition>
  );
}
