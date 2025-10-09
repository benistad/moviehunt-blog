/**
 * Convertit une URL d'image TMDB en URL proxifiée via notre backend
 * pour éviter les problèmes CORS
 */
export const getProxiedImageUrl = (tmdbImageUrl) => {
  if (!tmdbImageUrl) return null;
  
  // Si c'est déjà une URL complète TMDB
  if (tmdbImageUrl.includes('image.tmdb.org')) {
    const imagePath = tmdbImageUrl.split('/original/')[1];
    if (imagePath) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      return `${apiUrl}/proxy/image/${imagePath}`;
    }
  }
  
  // Si c'est juste le chemin de l'image
  if (tmdbImageUrl.startsWith('/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${apiUrl}/proxy/image${tmdbImageUrl}`;
  }
  
  // Sinon, retourner l'URL telle quelle
  return tmdbImageUrl;
};
