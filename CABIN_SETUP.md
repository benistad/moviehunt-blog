# 📊 Configuration de Cabin Analytics

Ce guide vous explique comment configurer Cabin Analytics pour votre blog MovieHunt.

## 🌟 Pourquoi Cabin ?

- ✅ **Respectueux de la vie privée** : Pas de cookies, pas de tracking personnel
- ✅ **Conforme RGPD** : Pas besoin de bannière de consentement
- ✅ **Léger** : Script de 1KB seulement
- ✅ **Simple** : Dashboard clair et intuitif
- ✅ **Gratuit** : Jusqu'à 100,000 pages vues/mois

## 🚀 Étape 1 : Créer un compte Cabin

1. Allez sur https://withcabin.com/
2. Cliquez sur **"Start Free Trial"** ou **"Sign Up"**
3. Créez votre compte (email + mot de passe)
4. C'est gratuit pour commencer !

## 🏗️ Étape 2 : Ajouter votre domaine

1. Une fois connecté, cliquez sur **"Add Site"**
2. Entrez votre domaine :
   - **En développement** : `localhost:5173`
   - **En production** : `blog.moviehunt.fr` (ou votre domaine)
3. Cliquez sur **"Add Site"**

## ✅ Étape 3 : C'est tout !

Avec l'installation **Basic**, Cabin détecte automatiquement votre domaine.

**Pas besoin de Site ID, pas de configuration supplémentaire !**

Le script dans votre HTML suffit :
```html
<script async src="https://scripts.withcabin.com/hello.js"></script>
```

## 🧪 Étape 4 : Tester l'installation

1. Démarrez votre serveur :
```bash
npm run dev
```

2. Ouvrez votre blog : `http://localhost:5173`

3. Allez sur votre dashboard Cabin : https://withcabin.com/dashboard

4. Vous devriez voir votre visite apparaître dans les 1-2 minutes !

## 📊 Ce qui est tracké automatiquement

### Pages vues
- ✅ Page d'accueil
- ✅ Articles individuels
- ✅ Toutes les pages du blog

### Données collectées (anonymes)
- URL de la page
- Référent (d'où vient le visiteur)
- Pays/Région (basé sur l'IP, mais IP non stockée)
- Appareil (Desktop/Mobile/Tablet)
- Navigateur
- Système d'exploitation

### Données NON collectées
- ❌ Pas d'adresse IP
- ❌ Pas de cookies
- ❌ Pas de fingerprinting
- ❌ Pas de données personnelles

## 🎯 Événements personnalisés (optionnel)

Vous pouvez tracker des événements spécifiques :

```javascript
import { trackEvent } from './utils/analytics';

// Exemple : Quand un utilisateur clique sur "Lire l'article"
trackEvent('article_click', {
  article: 'Deepwater',
  category: 'Action'
});

// Exemple : Quand un utilisateur partage un article
trackEvent('article_share', {
  article: 'The Wave',
  platform: 'Twitter'
});
```

## 📈 Dashboard Cabin

Dans votre dashboard Cabin, vous verrez :

### Vue d'ensemble
- Visiteurs uniques
- Pages vues totales
- Temps moyen sur le site
- Taux de rebond

### Pages populaires
- Articles les plus lus
- Pages les plus visitées

### Sources de trafic
- Direct
- Réseaux sociaux
- Moteurs de recherche
- Référents

### Géographie
- Pays des visiteurs
- Villes principales

### Technologie
- Navigateurs utilisés
- Systèmes d'exploitation
- Types d'appareils (Desktop/Mobile)

## 🔒 Confidentialité

Cabin est **100% conforme RGPD** :
- Pas de cookies
- Pas de tracking cross-site
- Données agrégées uniquement
- Pas besoin de bannière de consentement

## 💰 Tarification

- **Gratuit** : Jusqu'à 100,000 pages vues/mois
- **Pro** : $19/mois pour plus de trafic
- **Business** : Plans personnalisés

Pour un blog qui démarre, le plan gratuit est largement suffisant !

## 🆘 Dépannage

### "Cabin Analytics: Script non chargé"
→ Vérifiez que le script est bien dans `index.html` :
```html
<script async defer src="https://scripts.withcabin.com/hello.js"></script>
```

### "VITE_CABIN_SITE_ID non configuré"
→ Vérifiez que votre `.env` contient bien :
```env
VITE_CABIN_SITE_ID=cabin_xxxxx
```

### Pas de données dans le dashboard
→ Attendez quelques minutes, les données peuvent prendre 1-2 minutes à apparaître

### Le Site ID ne fonctionne pas
→ Vérifiez que vous avez bien copié le Site ID depuis les Settings de Cabin

## 📚 Ressources

- **Documentation** : https://docs.withcabin.com/
- **Dashboard** : https://withcabin.com/dashboard
- **Support** : support@withcabin.com

## 🎉 C'est prêt !

Votre blog MovieHunt utilise maintenant Cabin Analytics !

Avantages immédiats :
- ✅ Analytics respectueux de la vie privée
- ✅ Conforme RGPD sans effort
- ✅ Dashboard simple et clair
- ✅ Pas de ralentissement du site
- ✅ Gratuit pour commencer

Bon tracking avec Cabin ! 📊✨
