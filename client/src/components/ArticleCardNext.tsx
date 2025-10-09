import Link from 'next/link';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getProxiedImageUrl } from '../utils/imageProxy';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  metadata?: {
    score?: number;
    movieTitle?: string;
  };
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCardNext({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group">
      <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          {article.coverImage && (
            <img
              src={getProxiedImageUrl(article.coverImage)}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {article.metadata?.score && (
            <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full font-bold">
              {article.metadata.score}/10
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {article.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(article.publishedAt), 'dd MMMM yyyy', {
                  locale: fr,
                })}
              </span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span className="text-xs">{article.tags[0]}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
