const axios = require('axios');

class ScraperService {
  constructor() {
    this.apiBaseUrl = 'https://www.moviehunt.fr/api/films';
  }

  /**
   * Scrape une URL de MovieHunt en utilisant l'API JSON
   */
  async scrapeUrl(url) {
    try {
      console.log(`🔍 Scraping de l'URL: ${url}`);
      
      // Extraire le slug de l'URL
      const slug = this.extractSlugFromUrl(url);
      if (!slug) {
        throw new Error('Impossible d\'extraire le slug de l\'URL');
      }

      console.log(`📝 Slug extrait: ${slug}`);

      // Récupérer les données via l'API JSON
      const filmData = await this.fetchFilmData(slug);

      // Transformer les données pour le format attendu
      const scrapedData = this.transformFilmData(filmData, url);

      console.log(`✅ Scraping réussi: ${scrapedData.title}`);
      return scrapedData;
    } catch (error) {
      console.error(`❌ Erreur de scraping: ${error.message}`);
      throw new Error(`Échec du scraping: ${error.message}`);
    }
  }

  /**
   * Extrait le slug de l'URL MovieHunt
   */
  extractSlugFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      
      // Format attendu: /films/[slug] ou juste /[slug]
      if (pathParts.length >= 2 && pathParts[0] === 'films') {
        return pathParts[1];
      } else if (pathParts.length >= 1) {
        return pathParts[pathParts.length - 1];
      }
      
      return null;
    } catch (error) {
      console.error('Erreur d\'extraction du slug:', error);
      return null;
    }
  }

  /**
   * Récupère les données du film via l'API JSON
   */
  async fetchFilmData(slug) {
    try {
      const apiUrl = `${this.apiBaseUrl}/${slug}`;
      console.log(`🌐 Appel API: ${apiUrl}`);

      const response = await axios.get(apiUrl, {
        headers: {
          'User-Agent': 'MovieHunt-Blog-Bot/1.0',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      if (response.status === 200 && response.data) {
        return response.data;
      }

      throw new Error('Réponse API invalide');
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Film "${slug}" non trouvé sur MovieHunt`);
      }
      throw new Error(`Erreur API: ${error.message}`);
    }
  }

  /**
   * Transforme les données de l'API en format attendu par le générateur d'articles
   */
  transformFilmData(filmData, sourceUrl) {
    if (!filmData || !filmData.sections) {
      throw new Error('Données du film invalides ou incomplètes');
    }

    // Construire le contenu textuel à partir des sections
    const contentParts = [];
    
    filmData.sections.forEach(section => {
      contentParts.push(`${section.heading}\n${section.content}\n`);
    });

    const fullContent = contentParts.join('\n');

    // Extraire le casting de manière structurée
    const castingSection = filmData.sections.find(s => s.heading === 'Casting');
    if (!castingSection) {
      throw new Error('Section Casting manquante dans les données du film');
    }
    const actors = this.extractActorsFromCasting(castingSection.content);

    // Construire l'objet de données scrapées
    return {
      title: filmData.title,
      content: fullContent,
      images: this.getFilmImages(filmData, sourceUrl),
      metadata: {
        movieTitle: filmData.title,
        releaseYear: filmData.year ? filmData.year.toString() : '',
        genre: filmData.genres || [],
        score: filmData.score,
        hunted: filmData.hunted || false,
        hiddenGem: filmData.hidden_gem || false, // Films méconnus
        slug: filmData.slug,
        // Sections structurées
        highlights: this.getSectionContent(filmData.sections, 'Pourquoi le voir ?'),
        review: this.getSectionContent(filmData.sections, 'Notre avis'),
        synopsis: this.getSectionContent(filmData.sections, 'Synopsis'),
        casting: castingSection?.content || '',
        actors: actors,
      },
      rawData: filmData,
    };
  }

  /**
   * Récupère le contenu d'une section spécifique
   */
  getSectionContent(sections, heading) {
    const section = sections.find(s => s.heading === heading);
    return section ? section.content : '';
  }

  /**
   * Extrait les acteurs du texte de casting
   */
  extractActorsFromCasting(castingText) {
    // Format: "Kurt Russell (Acteur (Jimmy Harrell)), John Malkovich (Acteur (Donald Vidrine))"
    const actors = [];
    const matches = castingText.match(/([^,]+)\s*\(Acteur/g);
    
    if (matches) {
      matches.forEach(match => {
        const actorName = match.replace(/\s*\(Acteur.*/, '').trim();
        if (actorName) {
          actors.push(actorName);
        }
      });
    }
    
    return actors;
  }

  /**
   * Récupère les images du film
   */
  getFilmImages(filmData, sourceUrl) {
    const images = [];
    
    // Image de couverture basée sur le slug (convention MovieHunt)
    const coverImage = `https://www.moviehunt.fr/images/films/${filmData.slug}.jpg`;
    images.push(coverImage);
    
    // Image Open Graph alternative
    const ogImage = `https://www.moviehunt.fr/og-images/${filmData.slug}.jpg`;
    images.push(ogImage);
    
    return images;
  }

  /**
   * Récupère la liste de tous les films disponibles
   */
  async getAllFilms() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/list`, {
        headers: {
          'User-Agent': 'MovieHunt-Blog-Bot/1.0',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      if (response.status === 200 && response.data?.films) {
        return response.data.films;
      }

      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des films:', error);
      return [];
    }
  }

  /**
   * Valide si une URL est valide pour MovieHunt
   */
  isValidMovieHuntUrl(url) {
    try {
      const urlObj = new URL(url);
      const validDomains = ['moviehunt.fr', 'www.moviehunt.fr'];
      return validDomains.includes(urlObj.hostname);
    } catch (error) {
      return false;
    }
  }

  /**
   * Construit l'URL complète d'un film à partir du slug
   */
  buildFilmUrl(slug) {
    return `https://www.moviehunt.fr/films/${slug}`;
  }
}

module.exports = new ScraperService();
