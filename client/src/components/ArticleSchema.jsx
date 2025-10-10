import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../utils/env';

/**
 * Composant pour ajouter les données structurées Schema.org (JSON-LD) pour les articles
 * Améliore le SEO et l'affichage dans les résultats de recherche Google
 */
export default function ArticleSchema({ article }) {
  const siteUrl = SITE_URL || 'https://blog.moviehunt.fr';
  
  // Extraire le texte brut du contenu HTML pour la description
  const getPlainText = (html) => {
    // Vérifier si on est côté client
    if (typeof window === 'undefined') {
      // Côté serveur : simple regex pour retirer les tags HTML
      return html.replace(/<[^>]*>/g, '').trim();
    }
    // Côté client : utiliser le DOM
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'MovieHunt',
      url: 'https://www.moviehunt.fr'
    },
    publisher: {
      '@type': 'Organization',
      name: 'MovieHunt Blog',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/article/${article.slug}`
    },
    keywords: article.tags?.join(', ') || '',
    articleBody: getPlainText(article.content),
  };

  // Si c'est un article sur un film, ajouter les données du film
  if (article.metadata?.movieTitle) {
    schema.about = {
      '@type': 'Movie',
      name: article.metadata.movieTitle,
      dateCreated: article.metadata.releaseYear,
      genre: article.metadata.genre?.join(', '),
    };

    // Ajouter la note si disponible
    if (article.metadata.score) {
      schema.about.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: article.metadata.score,
        bestRating: 10,
        worstRating: 0,
        ratingCount: 1
      };
    }

    // Ajouter le réalisateur si disponible
    if (article.metadata.director) {
      schema.about.director = {
        '@type': 'Person',
        name: article.metadata.director
      };
    }

    // Ajouter les acteurs si disponibles
    if (article.metadata.actors && article.metadata.actors.length > 0) {
      schema.about.actor = article.metadata.actors.map(actor => ({
        '@type': 'Person',
        name: actor
      }));
    }
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
