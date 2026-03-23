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

      {/* ═══ Hero Section ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">

          {/* Hero Card — Article principal (3/5) */}
          {heroArticle && (
            <div className="lg:col-span-3">
              <Link href={`/article/${heroArticle.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group h-full flex flex-col">
                  {/* Image intégrée dans la card */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                    <Image
                      src={heroArticle.coverImage || '/placeholder.jpg'}
                      alt={heroArticle.title}
                      fill
                      priority
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Note — cercle blanc sur l'image */}
                    {heroArticle.metadata?.score != null && (
                      <div className="absolute top-4 right-4 bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                        <span className="text-red-500 text-xl font-extrabold leading-none">{heroArticle.metadata.score}</span>
                        <span className="text-gray-400 text-xs font-semibold">/10</span>
                      </div>
                    )}
                  </div>

                  {/* Contenu sous l'image */}
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="inline-block bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-2 self-start">
                      {heroArticle.category === 'review' ? 'Critique' : heroArticle.category === 'list' ? 'Liste' : 'Article'}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                      {heroArticle.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                      {heroArticle.excerpt}
                    </p>
                    <span className="inline-flex items-center self-start border-2 border-gray-900 text-gray-900 px-5 py-2 rounded-full font-semibold text-sm group-hover:bg-gray-900 group-hover:text-white transition-colors">
                      Lire l&apos;article
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Trending Sidebar (2/5) — dégradé rose → violet */}
          <div className="lg:col-span-2 bg-gradient-to-br from-pink-500 via-red-400 to-purple-600 rounded-2xl p-5 shadow-md flex flex-col">
            <h3 className="text-lg font-extrabold text-white mb-4 tracking-wider uppercase">Trending</h3>
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              {trendingArticles.map((article) => (
                <Link key={article._id} href={`/article/${article.slug}`}>
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-2.5 hover:bg-white/30 transition-colors cursor-pointer group">
                    {/* Mini image */}
                    <div className="relative w-[72px] h-[56px] rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={article.coverImage || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Texte */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-[13px] text-white line-clamp-2 leading-tight flex-1">
                          {article.title}
                        </h4>
                        {article.metadata?.score != null && (
                          <span className="bg-white text-red-500 text-[11px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 leading-tight">
                            {article.metadata.score}/10
                          </span>
                        )}
                      </div>
                      <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
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

      {/* ═══ Critiques de films ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Critiques de films</h2>

        {/* Ligne 1 : 1 grande card gauche (span 2 rows) + 2×2 petites cards droite */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-3 mb-3">
          {/* Grande card gauche — occupe 1 col × 2 rows */}
          {critiques[0] && (
            <Link href={`/article/${critiques[0].slug}`} className="md:row-span-2">
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full min-h-[280px] group">
                <Image src={critiques[0].coverImage || '/placeholder.jpg'} alt={critiques[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {critiques[0].metadata?.score != null && (
                  <div className="absolute top-3 right-3 bg-white rounded-full w-11 h-11 flex items-center justify-center shadow z-10">
                    <span className="text-red-500 text-sm font-extrabold leading-none">{critiques[0].metadata.score}</span>
                    <span className="text-gray-400 text-[10px]">/10</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="font-bold text-white text-lg line-clamp-2 leading-snug">{critiques[0].title}</h3>
                </div>
              </div>
            </Link>
          )}

          {/* 4 petites cards — occupent 2 cols × 2 rows */}
          {critiques.slice(1, 5).map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-[136px] group">
                <Image src={article.coverImage || '/placeholder.jpg'} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {article.metadata?.score != null && (
                  <div className="absolute top-2 right-2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow z-10">
                    <span className="text-red-500 text-xs font-extrabold leading-none">{article.metadata.score}</span>
                    <span className="text-gray-400 text-[9px]">/10</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">Critique</span>
                  <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">{article.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ Listes — Carousel horizontal ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Listes</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => { const el = document.getElementById('lists-carousel'); if (el) el.scrollBy({ left: -280, behavior: 'smooth' }); }}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => { const el = document.getElementById('lists-carousel'); if (el) el.scrollBy({ left: 280, behavior: 'smooth' }); }}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div id="lists-carousel" className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {lists.map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`} className="flex-shrink-0 snap-start">
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer w-48 h-64 group">
                <Image src={article.coverImage || '/placeholder.jpg'} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10">
                  <h3 className="font-bold text-white text-[15px] line-clamp-3 leading-snug">{article.title}</h3>
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
