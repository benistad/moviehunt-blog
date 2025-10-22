-- Migration pour ajouter le champ category à la table articles
-- Permet de catégoriser les articles en "Listes de films" ou "Critiques de films"

-- 1. Ajouter la colonne category avec une valeur par défaut
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'review' 
CHECK (category IN ('review', 'list'));

-- 2. Créer un index pour optimiser les recherches par catégorie
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- 3. Mettre à jour les articles existants (optionnel, ils auront déjà 'review' par défaut)
-- UPDATE articles SET category = 'review' WHERE category IS NULL;

-- Explication:
-- category = 'review' : Critiques de films (par défaut)
-- category = 'list' : Listes de films
