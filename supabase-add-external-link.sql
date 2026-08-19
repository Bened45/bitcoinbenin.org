-- Ajouter la colonne external_link à la table albums
ALTER TABLE albums ADD COLUMN IF NOT EXISTS external_link TEXT;
