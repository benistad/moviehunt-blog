import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { articlesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import MovieRating from '../components/MovieRating';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesAPI.getBySlug(slug);
      setArticle(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement de l'article..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorMessage message={error} onRetry={fetchArticle} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorMessage message="Article non trouvé" />
      </div>
    );
  }

  const formattedDate = format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/"
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
              e.target.style.display = 'none';
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
        <Link to="/" className="btn-primary">
          Voir plus d'articles
        </Link>
      </div>
    </article>
  );
}
