# 🚀 Déployer le Cron Supabase

## Prérequis

Vous devez avoir installé Supabase CLI :
```bash
npm install -g supabase
```

## Étapes de déploiement

### 1. Se connecter à Supabase

```bash
supabase login
```

### 2. Lier votre projet

```bash
cd "/Users/benoitdurand/Library/Mobile Documents/com~apple~CloudDocs/DEV/WINDSURF/MovieHunt le Blog"
supabase link --project-ref VOTRE_PROJECT_REF
```

**Pour trouver votre PROJECT_REF** :
- Allez dans Supabase Dashboard
- Settings → General  
- Copiez le "Reference ID" (exemple: `abcdefghijklmnop`)

### 3. Déployer la fonction avec le Cron

```bash
supabase functions deploy keep-alive
```

### 4. Vérifier le déploiement

```bash
# Voir les logs
supabase functions logs keep-alive

# Tester manuellement
supabase functions invoke keep-alive
```

## ✅ Vérification

Après le déploiement :

1. Allez dans Supabase Dashboard → Edge Functions → keep-alive
2. Allez dans l'onglet "Logs"
3. Attendez 5 minutes
4. Vous devriez voir des exécutions automatiques apparaître

## 📋 Structure des fichiers

```
supabase/
├── config.toml              # Configuration du Cron
└── functions/
    └── keep-alive/
        └── index.ts         # Code de la fonction
```

## 🔧 Modifier la fréquence

Éditez `supabase/config.toml` :

```toml
[functions.keep-alive.cron]
# Toutes les 5 minutes
schedule = "*/5 * * * *"

# Ou toutes les 10 minutes
# schedule = "*/10 * * * *"

# Ou toutes les heures
# schedule = "0 */1 * * *"
```

Puis redéployez :
```bash
supabase functions deploy keep-alive
```

## ❓ Problèmes courants

**Erreur "Project not linked"** :
```bash
supabase link --project-ref VOTRE_PROJECT_REF
```

**Erreur "Not logged in"** :
```bash
supabase login
```

**Voir les erreurs** :
```bash
supabase functions logs keep-alive --tail
```

## 🎉 C'est terminé !

Une fois déployé, votre fonction s'exécutera automatiquement toutes les 5 minutes et maintiendra votre Supabase actif !
