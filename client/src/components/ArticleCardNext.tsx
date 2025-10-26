import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getProxiedImageUrl } from '../utils/imageProxy';
import { blurDataURL } from '../utils/imageOptimization';

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

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCardNext({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group h-full">
      <article className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-xl h-full flex flex-col">
        {/* Image - Optimisée avec Next.js Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {article.coverImage ? (
            <Image
              src={getProxiedImageUrl(article.coverImage)}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              quality={70}
              loading="lazy"
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Overlay gradient au hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badge catégorie */}
          <div className="absolute top-4 left-4 z-10">
            {article.category === 'list' ? (
              <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full font-semibold text-xs shadow-lg">
                📋 Liste
              </div>
            ) : (
              <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full font-semibold text-xs shadow-lg">
                Critique
              </div>
            )}
          </div>

          {article.metadata?.score && (
            <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1.5 rounded-full font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 z-10">
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
