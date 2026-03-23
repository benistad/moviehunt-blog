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
  const critiques = initialCritiques.slice(0, 5);
  const lists = initialLists.slice(0, 4);

  return (
    <>
      <SEONext
        title="Accueil - Critiques et analyses de films"
        description="Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques méconnues et des recommandations de qualité."
        url="/"
      />

      {/* Hero Section avec image de fond */}
      <section 
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: heroArticle?.coverImage 
            ? `url(${heroArticle.coverImage})` 
            : 'url(/placeholder-hero.jpg)',
        }}
      >
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-end pb-8">
            {/* Hero Card - Article principal */}
            {heroArticle && (
              <div className="lg:col-span-2">
                <Link href={`/article/${heroArticle.slug}`}>
                  <div className="bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    {/* Badge catégorie */}
                    <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {heroArticle.category === 'review' ? 'Critique' : 'Liste'}
                    </span>

                    {/* Note */}
                    {heroArticle.metadata?.score && (
                      <div className="absolute top-6 right-6 bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold">{heroArticle.metadata.score}</span>
                        <span className="text-xs">/10</span>
                      </div>
                    )}

                    {/* Titre */}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {heroArticle.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {heroArticle.excerpt}
                    </p>

                    {/* Bouton */}
                    <button className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center">
                      Lire l'article
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </Link>
              </div>
            )}

            {/* Trending Sidebar */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm mr-2">
                  TRENDING
                </span>
              </h3>
              <div className="space-y-3">
                {trendingArticles.map((article, index) => (
                  <Link key={article._id} href={`/article/${article.slug}`}>
                    <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={article.coverImage || '/placeholder.jpg'}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Badge note */}
                        {article.metadata?.score && (
                          <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            {article.metadata.score}/10
                          </div>
                        )}
                      </div>

                      {/* Texte */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-red-500 transition-colors">
                          {article.title}
                        </h4>
                        <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded mt-1">
                          {article.category === 'review' ? 'Critique' : 'Liste'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Critiques de films */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Critiques de films</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {critiques.map((article, index) => (
            <Link key={article._id} href={`/article/${article.slug}`}>
              <div 
                className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-64 ${
                  index === 0 ? 'md:col-span-2 md:row-span-2 h-auto' : ''
                }`}
              >
                {/* Image de fond */}
                <div className="absolute inset-0">
                  <Image
                    src={article.coverImage || '/placeholder.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                {/* Note */}
                {article.metadata?.score && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-10">
                    <div className="text-center">
                      <span className="text-xl font-bold">{article.metadata.score}</span>
                      <span className="text-xs block">/10</span>
                    </div>
                  </div>
                )}

                {/* Contenu */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                    Critique
                  </span>
                  <h3 className={`font-bold text-white mb-2 ${index === 0 ? 'text-2xl' : 'text-lg'} line-clamp-2`}>
                    {article.title}
                  </h3>
                  {index === 0 && (
                    <p className="text-gray-200 text-sm line-clamp-2">{article.excerpt}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Listes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Listes</h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lists.map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-64">
                {/* Image de fond */}
                <div className="absolute inset-0">
                  <Image
                    src={article.coverImage || '/placeholder.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                </div>

                {/* Contenu */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="font-bold text-white text-lg line-clamp-3">
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
