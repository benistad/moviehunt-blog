# Guide d'Utilisation de l'API MovieHunt

Ce guide explique comment le blog utilise l'API JSON de MovieHunt pour générer automatiquement des articles.

## ✅ Configuration Automatique

**Bonne nouvelle !** Le scraping est déjà entièrement configuré pour utiliser l'API JSON de MovieHunt. Vous n'avez **rien à configurer** !

## 🎯 Comment ça fonctionne

### 1. Analyser la structure HTML de moviehunt.fr

Ouvrez une page de moviehunt.fr dans votre navigateur et inspectez le code HTML (clic droit > Inspecter).

Identifiez les sélecteurs CSS pour :
- Le titre du film
- La description/synopsis
- L'image de couverture
- Les métadonnées (année, genre, réalisateur, acteurs)

### 2. Exemples de sélecteurs à adapter

#### Titre du film
```javascript
extractTitle($) {
  // Remplacez ces sélecteurs par ceux de votre site
  const selectors = [
    'h1.movie-title',        // Exemple 1
    '.film-header h1',       // Exemple 2
    '[data-movie-title]',    // Exemple 3
  ];
  
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length) {
      const title = element.text().trim();
      if (title) return title;
    }
  }
  
  return 'Sans titre';
}
```

#### Contenu/Description
```javascript
extractContent($) {
  const selectors = [
    '.movie-description',    // Sélecteur principal
    '.synopsis',             // Alternative 1
    '[itemprop="description"]', // Alternative 2
  ];
  
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length) {
      const content = element.text().trim();
      if (content && content.length > 50) {
        return content;
      }
    }
  }
  
  return '';
}
```

#### Images
```javascript
extractImages($) {
  const images = [];
  
  // Image principale (Open Graph)
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) images.push(ogImage);
  
  // Image de poster
  const posterImage = $('.movie-poster img').attr('src');
  if (posterImage) images.push(posterImage);
  
  // Autres images
  $('.gallery img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) images.push(src);
  });
  
  return images;
}
```

#### Métadonnées du film
```javascript
extractMetadata($) {
  return {
    // Titre du film
    movieTitle: $('.film-title').text().trim() || 
                $('[itemprop="name"]').text().trim(),
    
    // Année de sortie
    releaseYear: $('.release-year').text().trim() || 
                 $('[itemprop="datePublished"]').text().trim(),
    
    // Genres (tableau)
    genre: $('.genre-tag').map((i, el) => $(el).text().trim()).get() ||
           $('[itemprop="genre"]').map((i, el) => $(el).text().trim()).get(),
    
    // Réalisateur
    director: $('.director-name').text().trim() ||
              $('[itemprop="director"]').text().trim(),
    
    // Acteurs (tableau)
    actors: $('.actor-name').map((i, el) => $(el).text().trim()).get() ||
            $('[itemprop="actor"]').map((i, el) => $(el).text().trim()).get(),
  };
}
```

### 3. Tester le scraping

Une fois les sélecteurs configurés, testez avec une URL réelle :

```bash
# Démarrez le serveur
npm run server

# Dans un autre terminal, testez l'API
curl -X POST http://localhost:5000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://moviehunt.fr/votre-page-test"}'
```

### 4. Outils utiles pour trouver les sélecteurs

#### Dans le navigateur (Chrome/Firefox)
1. Clic droit sur l'élément > Inspecter
2. Clic droit sur le code HTML > Copy > Copy selector
3. Utilisez ce sélecteur dans votre code

#### Console du navigateur
```javascript
// Testez vos sélecteurs directement dans la console
document.querySelector('h1.movie-title').textContent
document.querySelectorAll('.genre-tag')
```

#### Extension SelectorGadget
- Chrome: https://chrome.google.com/webstore/detail/selectorgadget
- Facilite la création de sélecteurs CSS

### 5. Exemples de structures HTML courantes

#### Structure avec Schema.org
```html
<div itemscope itemtype="http://schema.org/Movie">
  <h1 itemprop="name">Titre du film</h1>
  <span itemprop="datePublished">2024</span>
  <span itemprop="genre">Action</span>
  <div itemprop="description">Synopsis...</div>
</div>
```

Sélecteurs :
```javascript
movieTitle: $('[itemprop="name"]').text().trim()
releaseYear: $('[itemprop="datePublished"]').text().trim()
genre: $('[itemprop="genre"]').map((i, el) => $(el).text().trim()).get()
```

#### Structure avec classes CSS
```html
<div class="movie-card">
  <h1 class="movie-title">Titre du film</h1>
  <span class="movie-year">2024</span>
  <div class="movie-genres">
    <span class="genre">Action</span>
    <span class="genre">Thriller</span>
  </div>
</div>
```

Sélecteurs :
```javascript
movieTitle: $('.movie-title').text().trim()
releaseYear: $('.movie-year').text().trim()
genre: $('.genre').map((i, el) => $(el).text().trim()).get()
```

### 6. Gestion des URLs relatives

Si les images utilisent des URLs relatives, ajoutez cette fonction :

```javascript
resolveUrl(url, baseUrl) {
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return new URL(url, baseUrl).href;
  return url;
}

// Utilisation
extractImages($, sourceUrl) {
  const images = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) {
      images.push(this.resolveUrl(src, sourceUrl));
    }
  });
  return images;
}
```

### 7. Debugging

Ajoutez des logs pour voir ce qui est extrait :

```javascript
extractTitle($) {
  const title = $('h1.movie-title').text().trim();
  console.log('📝 Titre extrait:', title);
  return title;
}
```

### 8. Validation des données

Ajoutez des validations pour vous assurer que les données sont correctes :

```javascript
scrapeUrl(url) {
  // ... code de scraping ...
  
  // Validation
  if (!scrapedData.title || scrapedData.title === 'Sans titre') {
    throw new Error('Impossible d\'extraire le titre');
  }
  
  if (!scrapedData.content || scrapedData.content.length < 100) {
    throw new Error('Contenu insuffisant');
  }
  
  return scrapedData;
}
```

## 🚀 Prochaines étapes

1. **Analysez** la structure HTML de moviehunt.fr
2. **Identifiez** les sélecteurs CSS appropriés
3. **Modifiez** `server/services/scraperService.js`
4. **Testez** avec des URLs réelles
5. **Ajustez** les sélecteurs si nécessaire

## 💡 Conseils

- Commencez par les sélecteurs les plus spécifiques
- Prévoyez plusieurs alternatives (fallbacks)
- Testez avec différentes pages pour vérifier la cohérence
- Utilisez les métadonnées Open Graph quand disponibles
- Nettoyez le contenu extrait (supprimez scripts, styles, etc.)

## 📞 Besoin d'aide ?

Si vous rencontrez des difficultés :
1. Vérifiez les logs du serveur
2. Testez vos sélecteurs dans la console du navigateur
3. Assurez-vous que l'URL est accessible
4. Vérifiez que le site ne bloque pas le scraping
