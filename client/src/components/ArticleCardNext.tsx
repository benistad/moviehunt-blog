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
    <Link href={`/article/${article.slug}`} className="group h-full">
      <article className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-xl h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {article.coverImage && (
            <img
              src={getProxiedImageUrl(article.coverImage)}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {/* Overlay gradient au hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {article.metadata?.score && (
            <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1.5 rounded-full font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              {article.metadata.score}/10
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">{article.excerpt}</p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span className="font-medium">
                {format(new Date(article.publishedAt), 'dd MMM yyyy', {
                  locale: fr,
                })}
              </span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center space-x-1.5 bg-primary-50 px-3 py-1 rounded-full">
                <Tag className="w-3.5 h-3.5 text-primary-600" />
                <span className="text-xs font-medium text-primary-700">{article.tags[0]}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
