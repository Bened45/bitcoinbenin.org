'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

interface Merchant {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  btc_map_url: string | null;
  contact_url: string | null;
  image_url: string;
  discount: string | null;
  tags: string[] | null;
  created_at: string;
}

const CATEGORIES = ['Restauration', 'Boutique', 'Hébergement', 'Services'];

export default function AdminCommercesPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [form, setForm] = useState({
    name: '',
    category: 'Restauration',
    description: '',
    address: '',
    city: '',
    btc_map_url: '',
    contact_url: '',
    image_url: '',
    discount: '',
    tags: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      fetchMerchants();
    };
    init();
  }, [router]);

  const fetchMerchants = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMerchants(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      category: 'Restauration',
      description: '',
      address: '',
      city: '',
      btc_map_url: '',
      contact_url: '',
      image_url: '',
      discount: '',
      tags: ''
    });
    setImageFile(null);
    setEditingMerchant(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!supabase) return;
    if (!form.name || !form.category || !form.description || !form.address || !form.city) {
      alert('Veuillez remplir les champs obligatoires (nom, catégorie, description, adresse, ville).');
      return;
    }

    if (!imageFile && !form.image_url) {
      alert('Veuillez fournir une image.');
      return;
    }

    try {
      setUploading(true);
      let finalImageUrl = form.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `merchant_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `merchants/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);
          
        finalImageUrl = publicUrl;
      }

      const tagsArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        address: form.address,
        city: form.city,
        btc_map_url: form.btc_map_url || null,
        contact_url: form.contact_url || null,
        image_url: finalImageUrl,
        discount: form.discount || null,
        tags: tagsArray,
        updated_at: new Date().toISOString()
      };

      if (editingMerchant) {
        const { error } = await supabase
          .from('merchants')
          .update(payload)
          .eq('id', editingMerchant.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('merchants')
          .insert([payload]);
        if (error) throw error;
      }

      fetchMerchants();
      resetForm();
    } catch (error) {
      console.error('Erreur sauvegarde commerce:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (m: Merchant) => {
    setForm({
      name: m.name,
      category: m.category,
      description: m.description,
      address: m.address,
      city: m.city,
      btc_map_url: m.btc_map_url || '',
      contact_url: m.contact_url || '',
      image_url: m.image_url,
      discount: m.discount || '',
      tags: m.tags ? m.tags.join(', ') : ''
    });
    setEditingMerchant(m);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commerce ?')) return;
    if (!supabase) return;
    try {
      const { error } = await supabase.from('merchants').delete().eq('id', id);
      if (error) throw error;
      setMerchants(merchants.filter(m => m.id !== id));
    } catch (error) {
      console.error('Erreur suppression commerce:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Chargement...</div>;

  return (
    <div className="p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
            Gestion des <span className="text-brand-green ml-3">Commerces</span>
          </h1>
          <p className="text-xl text-gray-400">Gérez l'annuaire des commerçants acceptant Bitcoin au Bénin.</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button variant="primary" onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark border-brand-green">
            <FaPlus /> Nouveau commerce
          </Button>
        </div>

        {showForm && (
          <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold text-white">
                {editingMerchant ? 'Modifier le commerce' : 'Nouveau commerce'}
              </h3>
              <Button variant="ghost" size="sm" onClick={resetForm} className="p-2"><FaTimes /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nom *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Catégorie *</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">Description *</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none" rows={3} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Adresse *</label>
                <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Ville *</label>
                <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">URL BTC Map</label>
                <input type="url" value={form.btc_map_url} onChange={e => setForm({...form, btc_map_url: e.target.value})} className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Contact URL (WhatsApp/etc)</label>
                <input type="url" value={form.contact_url} onChange={e => setForm({...form, contact_url: e.target.value})} className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">Image du commerce *</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-dark border border-white/10 text-gray-300 rounded-lg hover:border-brand-green/50 cursor-pointer transition-colors"
                  >
                    <FaPlus />
                    {imageFile ? imageFile.name : 'Choisir une image locale'}
                  </label>
                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                  {!imageFile && form.image_url && (
                    <span className="text-brand-green text-sm">Image actuelle conservée</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Promotion (ex: 10% de réduction en BTC)</label>
                <input type="text" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Tags (séparés par des virgules)</label>
                <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Café, Pâtisserie" className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-green focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="primary" onClick={handleSave} disabled={uploading} className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark border-brand-green text-white disabled:opacity-50">
                <FaSave /> {uploading ? 'Téléchargement...' : (editingMerchant ? 'Mettre à jour' : 'Créer')}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {merchants.map(m => (
            <div key={m.id} className="bg-brand-charcoal/30 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-32 h-32 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-brand-dark">
                {m.image_url && <Image src={m.image_url} alt={m.name} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white flex items-center flex-wrap gap-2">
                  {m.name} 
                  <span className="text-xs font-normal text-brand-green border border-brand-green/30 bg-brand-green/10 px-2 py-0.5 rounded-full">{m.category}</span>
                </h3>
                <p className="text-gray-400 text-sm mt-1">{m.address}, {m.city}</p>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{m.description}</p>
              </div>
              <div className="flex gap-2 sm:ml-auto">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(m)} className="p-2"><FaEdit className="text-brand-green text-lg" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)} className="p-2"><FaTrash className="text-red-400 text-lg" /></Button>
              </div>
            </div>
          ))}
          {merchants.length === 0 && <p className="text-gray-400 text-center py-10">Aucun commerce trouvé.</p>}
        </div>
      </div>
    </div>
  );
}
