import { GetServerSideProps } from 'next';
import axios from 'axios';

interface Article {
  slug: string;
  updatedAt: string;
  publishedAt: string;
}

function generateSiteMap(articles: Article[]) {
  const siteUrl = 'https://www.moviehunt-blog.fr';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Page d'accueil -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Articles -->
  ${articles
    .map((article) => {
      return `
  <url>
    <loc>${siteUrl}/article/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt || article.publishedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('')}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moviehunt-blog-api.vercel.app/api';
    
    // Récupérer tous les articles publiés
    const response = await axios.get(`${apiUrl}/articles`, {
      params: {
        status: 'published',
        limit: 1000, // Tous les articles
      },
    });

    const articles = response.data.data.articles;

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
    console.error('Error generating sitemap:', error);
    
    // Retourner un sitemap minimal en cas d'erreur
    const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.moviehunt-blog.fr/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(minimalSitemap);
    res.end();

    return {
      props: {},
    };
  }
};

export default SiteMap;
