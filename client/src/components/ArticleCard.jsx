import { Link } from 'react-router-dom';
import { Calendar, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import MovieRating from './MovieRating';
import { getProxiedImageUrl } from '../utils/imageProxy';

export default function ArticleCard({ article }) {
  const formattedDate = format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr });

  return (
    <Link to={`/article/${article.slug}`} className="card hover:shadow-lg transition-shadow duration-300">
      {article.coverImage && (
        <div className="aspect-video w-full overflow-hidden bg-gray-200 relative">
          <img
            src={getProxiedImageUrl(article.coverImage)}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {article.metadata?.score && (
            <div className="absolute top-3 right-3">
              <MovieRating rating={article.metadata.score} size="md" />
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{Math.ceil(article.content.length / 1000)} min</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
          {article.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
