# 🗄️ Configuration de Supabase

Ce guide vous explique comment configurer Supabase comme base de données pour votre blog MovieHunt.

## 🚀 Pourquoi Supabase ?

- ✅ **Gratuit** : 500 MB de base de données gratuite
- ✅ **Hébergé** : Pas besoin d'installer MongoDB localement
- ✅ **Scalable** : Croissance automatique avec votre blog
- ✅ **API REST** : API générée automatiquement
- ✅ **Temps réel** : Mises à jour en temps réel (optionnel)
- ✅ **Backups** : Sauvegardes automatiques

## 📝 Étape 1 : Créer un compte Supabase

1. Allez sur https://supabase.com
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub (recommandé) ou email
4. C'est gratuit, aucune carte bancaire requise !

## 🏗️ Étape 2 : Créer un nouveau projet

1. Cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `moviehunt-blog`
   - **Database Password** : Générez un mot de passe fort (sauvegardez-le !)
   - **Region** : Choisissez la région la plus proche (ex: Europe West)
   - **Pricing Plan** : Free (gratuit)
3. Cliquez sur **"Create new project"**
4. Attendez 2-3 minutes que le projet soit créé

## 🔑 Étape 3 : Récupérer les clés API

1. Une fois le projet créé, allez dans **Settings** (⚙️) dans la sidebar
2. Cliquez sur **API** dans le menu Settings
3. Vous verrez 3 informations importantes :

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
→ Copiez cette URL

### API Keys

**anon / public key** (commence par `eyJ...`)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Copiez cette clé

**service_role / secret key** (commence par `eyJ...`)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Copiez cette clé (⚠️ Gardez-la secrète !)

## 📋 Étape 4 : Configurer le fichier .env

Ouvrez votre fichier `.env` et ajoutez :

```env
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Choix de la base de données
DATABASE_TYPE=supabase
```

## 🗃️ Étape 5 : Créer les tables

### Option A : Via l'interface Supabase (Recommandé)

1. Dans votre projet Supabase, allez dans **Table Editor**
2. Cliquez sur **"New table"**
3. Créez les tables suivantes :

#### Table `articles`

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  source_url TEXT NOT NULL,
  scraped_data JSONB DEFAULT '{}',
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  generated_by TEXT DEFAULT 'manual' CHECK (generated_by IN ('auto', 'manual')),
  metadata JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Table `url_queue`

```sql
CREATE TABLE url_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  added_by TEXT DEFAULT 'manual' CHECK (added_by IN ('auto', 'manual', 'webhook')),
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_url_queue_status ON url_queue(status);
CREATE INDEX idx_url_queue_url ON url_queue(url);
CREATE INDEX idx_url_queue_created_at ON url_queue(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER update_url_queue_updated_at BEFORE UPDATE ON url_queue
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Option B : Via SQL Editor

1. Allez dans **SQL Editor** dans la sidebar
2. Cliquez sur **"New query"**
3. Copiez-collez tout le SQL ci-dessus
4. Cliquez sur **"Run"** (ou Ctrl+Enter)

## ✅ Étape 6 : Vérifier la configuration

1. Redémarrez votre serveur :
```bash
npm run dev
```

2. Vous devriez voir dans les logs :
```
✅ Supabase client initialisé
```

3. Testez en générant un article !

## 🔄 Migration depuis MongoDB (Optionnel)

Si vous avez déjà des données dans MongoDB :

1. Exportez vos données MongoDB :
```bash
mongoexport --db moviehunt-blog --collection articles --out articles.json
mongoexport --db moviehunt-blog --collection urlqueues --out urlqueues.json
```

2. Importez dans Supabase via l'interface ou un script

## 🎯 Avantages de Supabase

### 1. Interface visuelle
- Voir et éditer vos données facilement
- Filtres et recherches intégrés
- Pas besoin de MongoDB Compass

### 2. API automatique
- API REST générée automatiquement
- Documentation Swagger intégrée
- Authentification gérée

### 3. Hébergement
- Pas besoin d'héberger MongoDB
- Backups automatiques
- Monitoring intégré

### 4. Gratuit
- 500 MB de base de données
- 1 GB de stockage fichiers
- 2 GB de bande passante
- Largement suffisant pour commencer !

## 🔐 Sécurité

### Row Level Security (RLS)

Par défaut, Supabase active RLS. Pour votre blog, vous pouvez :

**Option 1 : Désactiver RLS (Simple, pour commencer)**
```sql
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE url_queue DISABLE ROW LEVEL SECURITY;
```

**Option 2 : Configurer RLS (Recommandé en production)**
```sql
-- Lecture publique des articles publiés
CREATE POLICY "Articles publiés lisibles par tous"
ON articles FOR SELECT
USING (status = 'published');

-- Tout accès pour le service_role
CREATE POLICY "Service role a tous les droits"
ON articles FOR ALL
USING (auth.role() = 'service_role');
```

## 📊 Monitoring

Dans votre dashboard Supabase :

1. **Database** : Voir l'utilisation de la base
2. **API** : Logs des requêtes API
3. **Logs** : Logs en temps réel
4. **Reports** : Statistiques d'utilisation

## 🆘 Dépannage

### Erreur : "Invalid API key"
→ Vérifiez que vous avez bien copié la `service_role` key, pas la `anon` key

### Erreur : "relation does not exist"
→ Les tables n'ont pas été créées. Exécutez le SQL de l'étape 5

### Erreur : "row-level security policy"
→ Désactivez RLS ou configurez les policies (voir section Sécurité)

## 📚 Ressources

- **Documentation** : https://supabase.com/docs
- **Dashboard** : https://supabase.com/dashboard
- **API Docs** : Dans votre projet → API Docs
- **Community** : https://github.com/supabase/supabase/discussions

## 🎉 C'est prêt !

Votre blog MovieHunt utilise maintenant Supabase comme base de données !

Avantages immédiats :
- ✅ Pas besoin de MongoDB local
- ✅ Accessible de partout
- ✅ Interface visuelle pour gérer les données
- ✅ Backups automatiques
- ✅ Gratuit pour commencer

Bon blogging avec Supabase ! 🚀
