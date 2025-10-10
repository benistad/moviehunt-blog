import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: string;
  article?: {
    publishedAt?: string;
    modifiedAt?: string;
    author?: string;
    tags?: string[];
  } | null;
  keywords?: string[];
}

export default function SEO({
  title,
  description,
  image = null,
  url,
  type = 'website',
  article = null,
  keywords = [],
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.moviehunt.fr';
  const siteName = 'MovieHunt Blog';
  const defaultDescription = 'Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques à ne pas manquer.';
  const defaultImage = `${siteUrl}/og-image.jpg`;

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Générer les keywords
  const finalKeywords = [
    'critique film',
    'avis film',
    'analyse cinéma',
    'MovieHunt',
    'recommandation film',
    ...keywords
  ].join(', ');

  return (
    <Head>
      {/* Balises de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Article spécifique */}
      {article && (
        <>
          {article.publishedAt && (
            <meta property="article:published_time" content={article.publishedAt} />
          )}
          {article.modifiedAt && (
            <meta property="article:modified_time" content={article.modifiedAt} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    </Head>
  );
}
