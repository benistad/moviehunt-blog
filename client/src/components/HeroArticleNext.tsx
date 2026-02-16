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

interface HeroArticleProps {
  article: Article;
}

export default function HeroArticleNext({ article }: HeroArticleProps) {
  if (!article) return null;

  const formattedDate = format(new Date(article.publishedAt), 'dd MMM yyyy', { locale: fr });
  
  const getCategoryBadge = () => {
    if (article.category === 'list') {
      return (
        <span className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full font-semibold text-sm shadow-lg">
          📋 Liste
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-full font-semibold text-sm shadow-lg">
        🎬 Critique
      </span>
    );
  };

  const getGenreBadge = () => {
    if (article.tags && article.tags.length > 0) {
      const genre = article.tags[0];
      return (
        <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
          {genre}
        </span>
      );
    }
    return null;
  };

  return (
    <Link 
      href={`/article/${article.slug}`}
      className="block relative rounded-2xl overflow-hidden shadow-2xl group h-full"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Gradient Overlay - Dark blue/purple gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/90 to-indigo-800/95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between min-h-[500px]">
        {/* Top Section - Badges */}
        <div className="flex items-start justify-between">
          {getCategoryBadge()}
          
          {article.metadata?.score && (
            <div className="bg-primary-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              {article.metadata.score}/10
            </div>
          )}
        </div>

        {/* Bottom Section - Content */}
        <div className="space-y-4">
          {/* Genre Badge */}
          <div className="flex items-center gap-2">
            {getGenreBadge()}
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight group-hover:text-orange-400 transition-colors duration-300">
            {article.title}
          </h2>

          {/* Excerpt */}
          <p className="text-white/90 text-base md:text-lg leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>

            <button className="inline-flex items-center px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-orange-400 hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-xl">
              Lire la critique →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
