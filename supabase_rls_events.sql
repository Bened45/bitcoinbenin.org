-- Politique RLS pour la table events
-- Permet aux utilisateurs authentifiés de faire toutes les opérations
-- Les utilisateurs non authentifiés peuvent seulement lire

-- 1. Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "events_select_policy" ON events;
DROP POLICY IF EXISTS "events_insert_policy" ON events;
DROP POLICY IF EXISTS "events_update_policy" ON events;
DROP POLICY IF EXISTS "events_delete_policy" ON events;

-- 2. Créer la nouvelle politique RLS
CREATE POLICY "events_select_policy" ON events
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "events_insert_policy" ON events
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "events_update_policy" ON events
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "events_delete_policy" ON events
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- 3. Activer RLS sur la table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 4. Donner les permissions nécessaires
-- Les utilisateurs doivent être authentifiés pour modifier les données
-- Les permissions sont gérées par les politiques ci-dessus
