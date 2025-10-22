import { GetStaticPaths, GetStaticProps, GetServerSideProps } from 'next';
import Link from 'next/link';
import { Calendar, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import SEO from '../../components/SEO';
import ArticleSchema from '../../src/components/ArticleSchema';
import MovieRating from '../../src/components/MovieRating';

interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  sourceUrl: string;
  tags: string[];
  category?: string;
  metadata?: {
    score?: number;
    movieTitle?: string;
    releaseYear?: string;
    genre?: string[];
    director?: string;
    actors?: string[];
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

interface ArticlePageProps {
  article: Article | null;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
        <Link href="/" className="text-primary-600 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // Protection contre les erreurs de rendu
  try {

  const formattedDate = format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr });

  // Préparer les données SEO
  const seoKeywords = [
    ...(article.tags || []),
    article.metadata?.movieTitle,
    ...(article.metadata?.genre || []),
    ...(article.metadata?.actors?.slice(0, 3) || []),
  ].filter(Boolean) as string[];

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title={article.seo?.metaTitle || article.title}
        description={article.seo?.metaDescription || article.excerpt}
        image={article.coverImage}
        url={`/article/${article.slug}`}
        type="article"
        keywords={article.seo?.keywords || seoKeywords}
        article={{
          publishedAt: article.publishedAt,
          modifiedAt: article.updatedAt,
          author: 'MovieHunt',
          tags: article.tags,
        }}
      />

      {/* Schema.org JSON-LD */}
      <ArticleSchema article={article} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux articles</span>
        </Link>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-xl mb-8 bg-gray-200 relative">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {article.metadata?.score && (
              <div className="absolute top-4 right-4">
                <MovieRating rating={article.metadata.score} size="xl" />
              </div>
            )}
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            {/* Badge catégorie */}
            {article.category && (
              <div className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
                article.category === 'list' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {article.category === 'list' ? '📋 Liste de films' : 'Critique de film'}
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#526FDA] text-white rounded-lg hover:bg-[#4159c9] transition-colors font-medium shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Lire la fiche sur MovieHunt</span>
              </a>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-xl text-gray-700 font-medium mb-8 pb-8 border-b border-gray-200">
            {article.excerpt}
          </div>

          <ReactMarkdown 
            className="markdown-content"
            rehypePlugins={[rehypeRaw]}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Movie Metadata */}
        {article.metadata && (article.metadata.movieTitle || article.metadata.director) && (
          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Informations sur le film</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.metadata.movieTitle && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Titre</dt>
                  <dd className="text-base text-gray-900">{article.metadata.movieTitle}</dd>
                </div>
              )}
              {article.metadata.releaseYear && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Année</dt>
                  <dd className="text-base text-gray-900">{article.metadata.releaseYear}</dd>
                </div>
              )}
              {article.metadata.director && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Réalisateur</dt>
                  <dd className="text-base text-gray-900">{article.metadata.director}</dd>
                </div>
              )}
              {article.metadata.genre && article.metadata.genre.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Genre</dt>
                  <dd className="text-base text-gray-900">{article.metadata.genre.join(', ')}</dd>
                </div>
              )}
              {article.metadata.score && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Note MovieHunt</dt>
                  <dd className="text-base text-gray-900 flex items-center">
                    <MovieRating rating={article.metadata.score} size="sm" />
                    <span className="ml-2 font-semibold">{article.metadata.score}/10</span>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/" className="btn-primary">
            Voir plus d'articles
          </Link>
        </div>
      </article>
    </>
  );
  } catch (error) {
    console.error('[ArticlePage] Render error:', error);
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Erreur de rendu</h1>
        <p className="mb-4">Une erreur est survenue lors de l'affichage de l'article.</p>
        <Link href="/" className="text-primary-600 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }
}

// Temporairement désactivé - utilise getServerSideProps
// export const getStaticPaths: GetStaticPaths = async () => {
//   try {
//     const apiUrl = process.env.API_URL || 'http://localhost:5000/api';
//     const response = await axios.get(`${apiUrl}/articles`, {
//       params: {
//         limit: 100,
//         status: 'published',
//       },
//     });

//     const paths = response.data.data.articles.map((article: Article) => ({
//       params: { slug: article.slug },
//     }));

//     return {
//       paths,
//       fallback: 'blocking',
//     };
//   } catch (error) {
//     console.error('Error in getStaticPaths:', error);
//     return {
//       paths: [],
//       fallback: 'blocking',
//     };
//   }
// };

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://moviehunt-blog-api.vercel.app/api';
    console.log('[SSR] API URL:', apiUrl);
    console.log('[SSR] Fetching article:', params?.slug);
    const response = await axios.get(`${apiUrl}/articles/slug/${params?.slug}`);
    
    console.log('[SSR] Response status:', response.status);
    console.log('[SSR] Article found:', response.data?.data?.title);

    return {
      props: {
        article: response.data.data,
      },
    };
  } catch (error: any) {
    console.error('[SSR] Error fetching article:', error.message);
    console.error('[SSR] Error details:', error.response?.status, error.response?.data);
    return {
      notFound: true,
    };
  }
};
