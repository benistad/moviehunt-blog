# 📦 Edge Function Supabase - Keep Alive

## 📋 Ce dossier contient

- **`index.ts`** - Code de l'Edge Function à copier-coller dans Supabase
- **`deno.json`** - Configuration Deno (pour éviter les erreurs de lint)

## 🚀 Comment l'utiliser ?

**NE PAS déployer ce dossier directement !**

### Étape 1 : Copier le code
1. Ouvrez le fichier `index.ts`
2. Copiez tout le code

### Étape 2 : Créer la fonction dans Supabase
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Menu : **Edge Functions** → **Create a new function**
4. Nom : `keep-alive`
5. Collez le code
6. Déployez

### Étape 3 : Activer le Cron
1. Dans votre fonction, allez dans **Settings** ou **Cron**
2. Activez le Cron
3. Expression : `*/5 * * * *` (toutes les 5 minutes)
4. Sauvegardez

## ✅ C'est tout !

Pour plus de détails, consultez :
- **[../START_HERE_KEEP_ALIVE.md](../START_HERE_KEEP_ALIVE.md)** - Guide de démarrage
- **[../COPIER_COLLER_SUPABASE.md](../COPIER_COLLER_SUPABASE.md)** - Instructions copier-coller
- **[../GUIDE_VISUEL_SUPABASE.md](../GUIDE_VISUEL_SUPABASE.md)** - Guide visuel détaillé

## ℹ️ Note

Les erreurs TypeScript dans ce dossier sont normales - c'est du code Deno qui sera exécuté dans l'environnement Supabase Edge Functions, pas dans Node.js.
