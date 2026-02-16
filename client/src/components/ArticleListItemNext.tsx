import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  category?: string;
  metadata?: {
    score?: number;
    movieTitle?: string;
  };
}

interface ArticleListItemProps {
  article: Article;
}

export default function ArticleListItemNext({ article }: ArticleListItemProps) {
  if (!article) return null;

  const formattedDate = format(new Date(article.publishedAt), 'dd MMM yyyy', { locale: fr });
  
  const getCategoryBadge = () => {
    if (article.category === 'list') {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-orange-500 text-white rounded-full font-semibold text-xs">
          Liste
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded-full font-semibold text-xs">
        Critique
      </span>
    );
  };

  const getGenreBadge = () => {
    if (article.tags && article.tags.length > 0) {
      return (
        <span className="text-xs text-gray-500">
          {article.tags[0]}
        </span>
      );
    }
    return null;
  };

  return (
    <Link 
      href={`/article/${article.slug}`}
      className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        {/* Score Badge */}
        {article.metadata?.score && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
            {article.metadata.score}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top - Badges */}
        <div className="flex items-center gap-2 mb-2">
          {getCategoryBadge()}
          {getGenreBadge()}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors mb-auto">
          {article.title}
        </h3>

        {/* Date */}
        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
