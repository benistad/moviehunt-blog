-- Test manuel pour vérifier que la colonne category fonctionne

-- 1. Voir tous les articles avec leur catégorie actuelle
SELECT id, title, category, status 
FROM articles 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Tester la mise à jour manuelle d'un article
-- Remplacez 'VOTRE_ID_ARTICLE' par un vrai ID d'article
-- UPDATE articles 
-- SET category = 'list' 
-- WHERE id = 'VOTRE_ID_ARTICLE';

-- 3. Vérifier que la mise à jour a fonctionné
-- SELECT id, title, category 
-- FROM articles 
-- WHERE id = 'VOTRE_ID_ARTICLE';

-- Si cette mise à jour manuelle fonctionne, le problème vient du code backend
-- Si elle ne fonctionne pas, il y a un problème avec la colonne ou les permissions
