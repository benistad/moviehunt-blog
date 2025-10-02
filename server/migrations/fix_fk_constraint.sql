-- Migration pour corriger la contrainte de clé étrangère url_queue_article_id_fkey
-- Cette contrainte empêche la mise à jour et la suppression des articles

-- 1. Supprimer l'ancienne contrainte
ALTER TABLE url_queue 
DROP CONSTRAINT IF EXISTS url_queue_article_id_fkey;

-- 2. Recréer la contrainte avec ON DELETE SET NULL et ON UPDATE CASCADE
ALTER TABLE url_queue 
ADD CONSTRAINT url_queue_article_id_fkey 
FOREIGN KEY (article_id) 
REFERENCES articles(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Explication:
-- ON DELETE SET NULL : Quand un article est supprimé, article_id devient NULL dans url_queue
-- ON UPDATE CASCADE : Quand l'ID d'un article change, la référence est mise à jour automatiquement
