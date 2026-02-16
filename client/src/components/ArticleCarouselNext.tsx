import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ArticleCardNext from './ArticleCardNext';

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

interface ArticleCarouselProps {
  title: string;
  articles: Article[];
  viewAllLink: string;
  icon?: string;
}

export default function ArticleCarouselNext({ title, articles, viewAllLink, icon }: ArticleCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(() => {
      updateArrows();
    }, 300);
  };

  const updateArrows = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 10);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
    );
  };

  return (
    <div className="mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {icon && <span className="text-3xl">{icon}</span>}
          {title}
        </h2>
        <Link 
          href={viewAllLink}
          className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 transition-colors"
        >
          Voir toutes les {title.toLowerCase()} →
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
            aria-label="Suivant"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={updateArrows}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {articles.map((article) => (
            <div key={article._id} className="flex-none w-[320px]">
              <ArticleCardNext article={article} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
