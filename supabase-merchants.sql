-- Création de la table merchants pour la page Commerces
CREATE TABLE IF NOT EXISTS public.merchants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  btc_map_url TEXT,
  contact_url TEXT,
  image_url TEXT NOT NULL,
  discount TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour tout le monde
CREATE POLICY "Merchants are viewable by everyone." 
ON public.merchants FOR SELECT 
USING (true);

-- L'insertion, modification et suppression sont réservées à l'admin (via service_role ou auth)
CREATE POLICY "Enable insert for authenticated users only" 
ON public.merchants FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" 
ON public.merchants FOR UPDATE
TO authenticated 
USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" 
ON public.merchants FOR DELETE
TO authenticated 
USING (true);

-- Insérer les données par défaut (similaires à l'ancien DUMMY_MERCHANTS)
INSERT INTO public.merchants (name, category, description, address, city, btc_map_url, contact_url, image_url, discount, tags) VALUES
('Café Satoshi', 'Restauration', 'Le meilleur café de Cotonou, torréfié sur place. Venez déguster nos pâtisseries en payant directement sur le Lightning Network.', 'Quartier Haie Vive, Rue 234', 'Cotonou', 'https://btcmap.org/map', 'https://wa.me/12345678', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1447&auto=format&fit=crop', '10% de réduction en BTC', ARRAY['Café', 'Pâtisserie', 'Lightning']),
('TechHub Bénin', 'Boutique', 'Boutique spécialisée dans la vente de matériel informatique, hardware wallets (Trezor/Ledger) et accessoires.', 'Avenue Steinmetz', 'Cotonou', 'https://btcmap.org/map', 'https://wa.me/12345678', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1501&auto=format&fit=crop', NULL, ARRAY['Électronique', 'Wallets', 'Accessoires']),
('Hôtel La Boussole', 'Hébergement', 'Hôtel moderne et confortable au centre de Bohicon. Accepte les paiements Bitcoin pour les réservations de chambres et le restaurant.', 'Centre Ville', 'Bohicon', 'https://btcmap.org/map', 'https://wa.me/12345678', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop', 'Petit déjeuner offert en BTC', ARRAY['Hôtel', 'Tourisme', 'Restaurant']);
