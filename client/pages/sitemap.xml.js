// Sitemap dynamique Next.js
// Ce fichier génère un sitemap XML pour le SEO

const SITE_URL = 'https://www.moviehunt-blog.fr';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moviehunt-blog-api.vercel.app/api';

function generateSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Homepage -->
     <url>
       <loc>${SITE_URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     
     <!-- Articles -->
     ${articles
       .map((article) => {
         return `
       <url>
         <loc>${SITE_URL}/article/${article.slug}</loc>
         <lastmod>${new Date(article.updatedAt || article.publishedAt).toISOString()}</lastmod>
         <changefreq>weekly</changefreq>
         <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  try {
    // Récupérer tous les articles publiés depuis l'API
    const response = await fetch(`${API_URL}/articles?status=published&limit=1000`);
    const data = await response.json();
    const articles = data.data || [];

    // Générer le sitemap XML
    const sitemap = generateSiteMap(articles);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Erreur génération sitemap:', error);
    
    // En cas d'erreur, générer un sitemap minimal
    const minimalSitemap = generateSiteMap([]);
    res.setHeader('Content-Type', 'text/xml');
    res.write(minimalSitemap);
    res.end();

    return {
      props: {},
    };
  }
}

// Composant par défaut (ne sera jamais rendu)
export default function SiteMap() {
  return null;
}
