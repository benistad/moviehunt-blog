# 🔧 Scripts de maintenance

Ce dossier contient des scripts utilitaires pour la maintenance et la migration de la base de données.

## 📝 Scripts disponibles

### `migrateArticleMetadata.js`

**Objectif** : Migrer les métadonnées des articles existants pour ajouter le score et autres informations manquantes.

**Quand l'utiliser** :
- Après avoir ajouté de nouveaux champs dans les métadonnées
- Pour mettre à jour les articles existants avec le score MovieHunt
- Après une mise à jour du système de scraping

**Comment l'exécuter** :

```bash
# Depuis la racine du projet
npm run migrate:metadata
```

**Ce que fait le script** :
1. Récupère tous les articles de la base de données
2. Vérifie si le score existe dans `scrapedData.metadata` mais pas dans `metadata`
3. Met à jour les métadonnées avec :
   - `score` : Note MovieHunt (1-10)
   - `hunted` : Badge "Hunted by MovieHunt"
   - `hiddenGem` : Film méconnu
   - Et autres métadonnées manquantes si nécessaire

**Résultat attendu** :
```
🔄 Début de la migration des métadonnées des articles...

📊 3 article(s) trouvé(s)

📝 Mise à jour: "Deepwater - La critique du film"
   Score: 7/10
   ✅ Métadonnées mises à jour

⏭️  Ignoré: "Autre film" (score déjà présent: 8/10)

============================================================
📊 RÉSUMÉ DE LA MIGRATION
============================================================
✅ Articles mis à jour: 1
⏭️  Articles ignorés: 2
📈 Total: 3
============================================================

✨ Migration terminée avec succès !
💡 Les logos de notation s'afficheront maintenant sur ces articles.
```

**Sécurité** :
- ✅ Le script ne supprime aucune donnée existante
- ✅ Il fusionne les nouvelles métadonnées avec les anciennes
- ✅ Peut être exécuté plusieurs fois sans risque

## 🆘 En cas de problème

Si le script échoue :
1. Vérifiez que votre fichier `.env` est correctement configuré
2. Vérifiez que la base de données est accessible
3. Consultez les logs d'erreur pour plus de détails

## 📚 Ajouter un nouveau script

Pour ajouter un nouveau script de maintenance :

1. Créez un fichier `.js` dans ce dossier
2. Ajoutez une commande dans `package.json` :
   ```json
   "scripts": {
     "mon-script": "node server/scripts/monScript.js"
   }
   ```
3. Documentez-le dans ce README

## 🔐 Bonnes pratiques

- Toujours tester les scripts sur une copie de la base de données d'abord
- Faire une sauvegarde avant d'exécuter un script de migration
- Documenter les changements apportés
- Ajouter des logs détaillés pour suivre l'exécution
