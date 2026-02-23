'use client';

import { useState, useEffect } from 'react';
import { supabase, clearSupabaseSession } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { FaImages, FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { createEvent, updateEvent as updateEventAction, deleteEvent as deleteEventAction } from './event-actions';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  location_link?: string;
  image?: string;
  registration_link?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'events'>('gallery');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    location_link: '',
    image: '',
    registration_link: ''
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        router.replace('/login');
        return;
      }

      fetchEvents();
    };

    init();
  }, [router]);

  const handleLogout = async () => {
    try {
      await clearSupabaseSession();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      router.replace('/login');
    }
  };

  const fetchEvents = async () => {
    console.log('fetchEvents appelé, supabase:', !!supabase);
    
    if (!supabase) {
      console.log('Supabase non configuré, arrêt');
      setLoading(false);
      return;
    }

    try {
      console.log('Tentative de chargement des événements...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des événements:', error);
        console.error('Détails erreur:', error.message, error.code, error.details);
      } else {
        console.log('Événements chargés:', data?.length || 0);
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Erreur catch:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.location) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    console.log('📝 Formulaire brut:', eventForm);
    
    // Nettoyage et validation des données
    const cleanTitle = String(eventForm.title).trim();
    const cleanDescription = String(eventForm.description).trim();
    const cleanDate = String(eventForm.date).trim();
    const cleanTime = String(eventForm.time).trim();
    const cleanLocation = String(eventForm.location).trim();
    const cleanLocationLink = eventForm.location_link ? String(eventForm.location_link).trim() : undefined;
    const cleanImage = eventForm.image ? String(eventForm.image).trim() : undefined;
    const cleanRegistrationLink = eventForm.registration_link ? String(eventForm.registration_link).trim() : undefined;

    console.log('📝 Données nettoyées:', {
      cleanTitle,
      cleanDate,
      cleanLocation,
      originalDate: eventForm.date,
      dateType: typeof eventForm.date
    });

    // Validation finale après nettoyage
    if (cleanTitle === '') {
      alert('Le titre ne peut pas être vide');
      return;
    }
    if (cleanDate === '') {
      alert('La date ne peut pas être vide');
      return;
    }
    if (cleanLocation === '') {
      alert('Le lieu ne peut pas être vide');
      return;
    }

    console.log('📝 Envoi formulaire nettoyé:', {
      title: cleanTitle,
      date: cleanDate,
      location: cleanLocation
    });

    try {
      setUploadingPoster(true);
      
      const result = await createEvent(
        cleanTitle,
        cleanDescription,
        cleanDate,
        cleanTime,
        cleanLocation,
        cleanLocationLink,
        cleanImage,
        cleanRegistrationLink,
        posterFile || undefined
      );
      
      if (result.success) {
        setEvents([result.data, ...events]);
        resetEventForm();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de l\'événement');
    } finally {
      setUploadingPoster(false);
    }
  };

  const updateEventLocal = async () => {
    if (!editingEvent) return;

    try {
      setUploadingPoster(true);
      
      const result = await updateEventAction(
        editingEvent.id,
        String(eventForm.title),
        String(eventForm.description),
        String(eventForm.date),
        String(eventForm.time),
        String(eventForm.location),
        eventForm.location_link ? String(eventForm.location_link) : undefined,
        eventForm.image ? String(eventForm.image) : undefined,
        eventForm.registration_link ? String(eventForm.registration_link) : undefined,
        posterFile || undefined
      );
      
      if (result.success) {
        setEvents(events.map(e => e.id === editingEvent.id ? result.data : e));
        resetEventForm();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour de l\'événement');
    } finally {
      setUploadingPoster(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      const result = await deleteEventAction(eventId);
      
      if (result.success) {
        setEvents(events.filter(e => e.id !== eventId));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'événement');
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      location_link: '',
      image: '',
      registration_link: ''
    });
    setPosterFile(null);
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      location_link: event.location_link || '',
      image: event.image || '',
      registration_link: event.registration_link || ''
    });
    setShowEventForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Configuration requise</h2>
          <p className="text-gray-400">Veuillez configurer Supabase pour accéder à l&apos;administration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              Administration
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2">
                Bitcoin Bénin
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Gérez la gallery et les événements de la communauté.
            </p>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400"
          >
            <FaSignOutAlt />
            Déconnexion
          </Button>
        </div>

        {/* Navigation par onglets */}
        <div className="flex justify-center mb-8">
          <div className="bg-brand-charcoal/50 border border-white/5 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'gallery'
                  ? 'bg-brand-green text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaImages className="mr-2" />
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'events'
                  ? 'bg-brand-green text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaCalendarAlt className="mr-2" />
              Événements
            </button>
          </div>
        </div>

        {/* Contenu dynamique */}
        {activeTab === 'gallery' && (
          <div>
            <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Gestion de la Gallery</h2>
              <p className="text-gray-400 mb-6">
                Accédez à l&apos;interface complète de gestion des albums et photos.
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/admin/gallery'}
                className="inline-flex items-center gap-2"
              >
                <FaImages />
                Gérer la Gallery
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Gestion des événements</h2>
              <p className="text-gray-400 mb-6">
                Accédez à l&apos;interface complète de gestion des événements.
              </p>
              <Button
                variant="primary"
                onClick={() => (window.location.href = '/admin/events')}
                className="inline-flex items-center gap-2"
              >
                <FaCalendarAlt />
                Gérer les événements
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
