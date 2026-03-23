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

      {/* ═══ HERO ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Hero Card (gauche ~58%) */}
          {heroArticle && (
            <div className="lg:w-[58%]">
              <Link href={`/article/${heroArticle.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group h-full flex flex-col">
                  {/* Image dans la card */}
                  <div className="relative h-[260px] sm:h-[300px] overflow-hidden">
                    <Image
                      src={heroArticle.coverImage || '/placeholder.jpg'}
                      alt={heroArticle.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    {heroArticle.metadata?.score != null && (
                      <div className="absolute top-4 right-4 bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-10">
                        <span className="text-red-500 text-xl font-extrabold">{heroArticle.metadata.score}</span>
                        <span className="text-gray-400 text-xs font-semibold">/10</span>
                      </div>
                    )}
                  </div>
                  {/* Texte */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="self-start bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                      {heroArticle.category === 'review' ? 'Critique' : heroArticle.category === 'list' ? 'Liste' : 'Article'}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 leading-snug line-clamp-2">{heroArticle.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{heroArticle.excerpt}</p>
                    <span className="self-start inline-flex items-center border-2 border-gray-900 text-gray-900 px-5 py-2 rounded-full text-sm font-semibold group-hover:bg-gray-900 group-hover:text-white transition-colors">
                      Lire l&apos;article
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Trending (droite ~42%) */}
          <div className="lg:w-[42%] bg-gradient-to-br from-pink-500 via-red-400 to-purple-600 rounded-2xl p-5 flex flex-col">
            <h3 className="text-white text-lg font-extrabold tracking-wider uppercase mb-4">Trending</h3>
            <div className="flex flex-col gap-3 flex-1 justify-around">
              {trendingArticles.map((article) => (
                <Link key={article._id} href={`/article/${article.slug}`}>
                  <div className="flex items-center gap-3 bg-white/20 rounded-xl p-2.5 hover:bg-white/30 transition-colors cursor-pointer">
                    <div className="relative w-[76px] h-[58px] rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={article.coverImage || '/placeholder.jpg'} alt={article.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-[13px] text-white line-clamp-2 leading-tight flex-1">{article.title}</h4>
                        {article.metadata?.score != null && (
                          <span className="bg-white text-red-500 text-[11px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">{article.metadata.score}/10</span>
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

      {/* ═══ CRITIQUES DE FILMS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Critiques de films</h2>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Grande card gauche — haute, occupe ~35% de la largeur */}
          {critiques[0] && (
            <div className="md:w-[35%] flex-shrink-0">
              <Link href={`/article/${critiques[0].slug}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-[300px] md:h-full group">
                  <Image src={critiques[0].coverImage || '/placeholder.jpg'} alt={critiques[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {critiques[0].metadata?.score != null && (
                    <div className="absolute top-3 right-3 bg-white rounded-full w-11 h-11 flex items-center justify-center shadow z-10">
                      <span className="text-red-500 text-sm font-extrabold">{critiques[0].metadata.score}</span>
                      <span className="text-gray-400 text-[10px]">/10</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-bold text-white text-lg line-clamp-3 leading-snug">{critiques[0].title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grille 2×2 droite — 4 petites cards */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
            {/* Card 2 : image avec note (petite, carrée) */}
            {critiques[1] && (
              <Link href={`/article/${critiques[1].slug}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full min-h-[140px] group">
                  <Image src={critiques[1].coverImage || '/placeholder.jpg'} alt={critiques[1].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {critiques[1].metadata?.score != null && (
                    <div className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10">
                      <span className="text-red-500 text-xs font-extrabold">{critiques[1].metadata.score}</span>
                      <span className="text-gray-400 text-[9px]">/10</span>
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Card 3 : layout horizontal — image gauche + texte droite */}
            {critiques[2] && (
              <Link href={`/article/${critiques[2].slug}`}>
                <div className="flex bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full min-h-[140px] group">
                  <div className="relative w-[45%] flex-shrink-0">
                    <Image src={critiques[2].coverImage || '/placeholder.jpg'} alt={critiques[2].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {critiques[2].metadata?.score != null && (
                      <div className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10">
                        <span className="text-red-500 text-xs font-extrabold">{critiques[2].metadata.score}</span>
                        <span className="text-gray-400 text-[9px]">/10</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-3 leading-snug">{critiques[2].title}</h3>
                    <span className="self-start bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Critique</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Card 4 : overlay classique */}
            {critiques[3] && (
              <Link href={`/article/${critiques[3].slug}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full min-h-[140px] group">
                  <Image src={critiques[3].coverImage || '/placeholder.jpg'} alt={critiques[3].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {critiques[3].metadata?.score != null && (
                    <div className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10">
                      <span className="text-red-500 text-xs font-extrabold">{critiques[3].metadata.score}</span>
                      <span className="text-gray-400 text-[9px]">/10</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">Critique</span>
                    <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">{critiques[3].title}</h3>
                  </div>
                </div>
              </Link>
            )}

            {/* Card 5 : overlay classique */}
            {critiques[4] && (
              <Link href={`/article/${critiques[4].slug}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full min-h-[140px] group">
                  <Image src={critiques[4].coverImage || '/placeholder.jpg'} alt={critiques[4].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {critiques[4].metadata?.score != null && (
                    <div className="absolute top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow z-10">
                      <span className="text-red-500 text-xs font-extrabold">{critiques[4].metadata.score}</span>
                      <span className="text-gray-400 text-[9px]">/10</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">Critiques</span>
                    <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">{critiques[4].title}</h3>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══ LISTES — Carousel ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Listes</h2>
          <div className="flex gap-2">
            <button
              onClick={() => { const el = document.getElementById('lists-carousel'); if (el) el.scrollBy({ left: -260, behavior: 'smooth' }); }}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => { const el = document.getElementById('lists-carousel'); if (el) el.scrollBy({ left: 260, behavior: 'smooth' }); }}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div id="lists-carousel" className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`#lists-carousel::-webkit-scrollbar { display: none; }`}</style>
          {lists.map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`} className="flex-shrink-0 snap-start">
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer w-44 h-60 group">
                <Image src={article.coverImage || '/placeholder.jpg'} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <h3 className="font-bold text-white text-[14px] line-clamp-3 leading-snug">{article.title}</h3>
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
