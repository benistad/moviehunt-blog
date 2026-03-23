import { useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import SEONext from '../src/components/SEONext';

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

interface HomeProps {
  initialArticles: Article[];
  initialCritiques: Article[];
  initialLists: Article[];
}

export default function Home({ 
  initialArticles = [], 
  initialCritiques = [],
  initialLists = [],
}: Partial<HomeProps>) {
  const heroArticle = initialArticles[0];
  const trendingArticles = initialArticles.slice(1, 4);
  const critiques = initialCritiques.slice(0, 6);
  const lists = initialLists.slice(0, 8);

  return (
    <>
      <SEONext
        title="Accueil - Critiques et analyses de films"
        description="Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques méconnues et des recommandations de qualité."
        url="/"
      />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Hero Card - Article principal (3/5) */}
          {heroArticle && (
            <div className="lg:col-span-3">
              <Link href={`/article/${heroArticle.slug}`}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                  {/* Image dans la card */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={heroArticle.coverImage || '/placeholder.jpg'}
                      alt={heroArticle.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Note badge - cercle blanc sur l'image */}
                    {heroArticle.metadata?.score != null && (
                      <div className="absolute top-4 right-4 bg-white rounded-full w-16 h-16 flex items-center justify-baseline shadow-lg">
                        <span className="text-red-500 text-2xl font-extrabold ml-3">{heroArticle.metadata.score}</span>
                        <span className="text-gray-500 text-sm font-medium">/10</span>
                      </div>
                    )}
                  </div>

                  {/* Contenu sous l'image */}
                  <div className="p-5">
                    {/* Badge catégorie */}
                    <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {heroArticle.category === 'review' ? 'Critique' : heroArticle.category === 'list' ? 'Liste' : 'Article'}
                    </span>

                    {/* Titre */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {heroArticle.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {heroArticle.excerpt}
                    </p>

                    {/* Bouton outline */}
                    <span className="inline-flex items-center border-2 border-gray-900 text-gray-900 px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-900 hover:text-white transition-colors">
                      Lire l&apos;article
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Trending Sidebar (2/5) - fond dégradé rose/violet */}
          <div className="lg:col-span-2 bg-gradient-to-br from-pink-500 via-red-400 to-purple-500 rounded-3xl p-5 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-5 tracking-wide">TRENDING</h3>
            <div className="space-y-4">
              {trendingArticles.map((article) => (
                <Link key={article._id} href={`/article/${article.slug}`}>
                  <div className="flex items-start space-x-3 bg-white/15 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/25 transition-colors cursor-pointer group">
                    {/* Image */}
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={article.coverImage || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Texte + note */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm text-white line-clamp-2 flex-1 mr-2">
                          {article.title}
                        </h4>
                        {/* Badge note */}
                        {article.metadata?.score != null && (
                          <span className="bg-white/90 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            {article.metadata.score}/10
                          </span>
                        )}
                      </div>
                      <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mt-1.5">
                        {article.category === 'review' ? 'Critique' : article.category === 'list' ? 'Liste' : 'Article'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Critiques de films */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Critiques de films</h2>
        
        {/* Première ligne : 1 grande à gauche + 2 empilées à droite */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Grande card à gauche */}
          {critiques[0] && (
            <Link href={`/article/${critiques[0].slug}`} className="md:row-span-2">
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full min-h-[320px] group">
                <Image
                  src={critiques[0].coverImage || '/placeholder.jpg'}
                  alt={critiques[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                {critiques[0].metadata?.score != null && (
                  <div className="absolute top-3 right-3 bg-white rounded-full w-12 h-12 flex items-center justify-baseline shadow-lg z-10">
                    <span className="text-red-500 text-lg font-extrabold ml-2">{critiques[0].metadata.score}</span>
                    <span className="text-gray-400 text-xs">/10</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3 className="font-bold text-white text-xl line-clamp-2">
                    {critiques[0].title}
                  </h3>
                </div>
              </div>
            </Link>
          )}
          {/* 2 cards empilées à droite */}
          {critiques.slice(1, 3).map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-40 group">
                <Image
                  src={article.coverImage || '/placeholder.jpg'}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                {article.metadata?.score != null && (
                  <div className="absolute top-3 right-3 bg-white rounded-full w-10 h-10 flex items-center justify-baseline shadow z-10">
                    <span className="text-red-500 text-sm font-extrabold ml-1.5">{article.metadata.score}</span>
                    <span className="text-gray-400 text-[10px]">/10</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <span className="inline-block bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                    Critique
                  </span>
                  <h3 className="font-bold text-white text-sm line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Deuxième ligne : 3 cards égales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {critiques.slice(3, 6).map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-48 group">
                <Image
                  src={article.coverImage || '/placeholder.jpg'}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                {article.metadata?.score != null && (
                  <div className="absolute top-3 right-3 bg-white rounded-full w-10 h-10 flex items-center justify-baseline shadow z-10">
                    <span className="text-red-500 text-sm font-extrabold ml-1.5">{article.metadata.score}</span>
                    <span className="text-gray-400 text-[10px]">/10</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <span className="inline-block bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                    Critique
                  </span>
                  <h3 className="font-bold text-white text-sm line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Listes - Carousel horizontal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Listes</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                const el = document.getElementById('lists-carousel');
                if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('lists-carousel');
                if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel scrollable */}
        <div id="lists-carousel" className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {lists.map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`} className="flex-shrink-0 snap-start">
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer w-56 h-72 group">
                <Image
                  src={article.coverImage || '/placeholder.jpg'}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="font-bold text-white text-base line-clamp-3 leading-snug">
                    {article.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

// SSG avec ISR
export const getStaticProps: GetStaticProps = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://moviehunt-blog-api.vercel.app/api';

  try {
    const [articlesResponse, critiquesResponse, listsResponse] = await Promise.all([
      axios.get(`${apiUrl}/articles`, {
        params: { page: 1, limit: 12, status: 'published' },
        timeout: 8000,
      }),
      axios.get(`${apiUrl}/articles`, {
        params: { page: 1, limit: 10, status: 'published', category: 'review' },
        timeout: 8000,
      }),
      axios.get(`${apiUrl}/articles`, {
        params: { page: 1, limit: 10, status: 'published', category: 'list' },
        timeout: 8000,
      }),
    ]);

    return {
      props: {
        initialArticles: articlesResponse.data.data.articles || [],
        initialCritiques: critiquesResponse.data.data.articles || [],
        initialLists: listsResponse.data.data.articles || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialArticles: [],
        initialCritiques: [],
        initialLists: [],
      },
      revalidate: 60,
    };
  }
};
