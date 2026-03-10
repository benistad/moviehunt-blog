import Head from 'next/head';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.moviehunt-blog.fr';
const SITE_NAME = 'MovieHunt Blog';
const DEFAULT_DESCRIPTION = 'Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques à ne pas manquer.';

interface ArticleMeta {
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  tags?: string[];
}

interface SEONextProps {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: string;
  article?: ArticleMeta | null;
  keywords?: string[];
}

export default function SEONext({
  title,
  description,
  image = null,
  url,
  type = 'website',
  article = null,
  keywords = [],
}: SEONextProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const finalImage = image || `${SITE_URL}/og-image.jpg`;
  const finalUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  const finalKeywords = [
    'critique film',
    'avis film',
    'analyse cinéma',
    'MovieHunt',
    'recommandation film',
    ...keywords,
  ].join(', ');

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Article spécifique */}
      {article?.publishedAt && (
        <meta property="article:published_time" content={article.publishedAt} />
      )}
      {article?.modifiedAt && (
        <meta property="article:modified_time" content={article.modifiedAt} />
      )}
      {article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
    </Head>
  );
}
