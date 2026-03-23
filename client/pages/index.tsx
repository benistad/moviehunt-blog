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
  const trendingArticles = initialArticles.slice(1, 5); // 4 articles au lieu de 3
  const critiques = initialCritiques; // Prendre toutes les critiques disponibles
  const lists = initialLists.slice(0, 8);

  return (
    <>
      <SEONext
        title="Accueil - Critiques et analyses de films"
        description="Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques méconnues et des recommandations de qualité."
        url="/"
      />

      {/* ═══ ARTICLE PRINCIPAL + TRENDING — avec image arrière-plan ═══ */}
      <section className="relative w-full">
        {/* Image d'arrière-plan du dernier article prenant tout le haut (sous le header) */}
        {heroArticle?.coverImage && (
          <div className="absolute top-0 left-0 right-0 h-[600px] z-0">
            <Image
              src={heroArticle.coverImage}
              alt=""
              fill
              priority
              className="object-cover object-center"
            />
            {/* Overlay dégradé vers le blanc en bas */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-50 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* HERO CARD - Chevauchement */}
            {heroArticle && (
              <div className="lg:w-[58%] flex flex-col">
                <Link href={`/article/${heroArticle.slug}`} className="flex-1">
                  <div className="bg-white p-1.5 pb-0 rounded-[32px] shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100">
                    <div className="relative h-[320px] sm:h-[380px] overflow-hidden rounded-[26px]">
                      <Image
                        src={heroArticle.coverImage || '/placeholder.jpg'}
                        alt={heroArticle.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500 rounded-[26px]"
                      />
                      {heroArticle.metadata?.score != null && (
                        <div className="absolute top-3 right-3 bg-[#e93d40] rounded-[20px] px-4 py-2 flex items-center justify-center shadow-lg" style={{ zIndex: 10 }}>
                          <span className="text-white text-3xl font-extrabold">{heroArticle.metadata.score}</span>
                          <span className="text-white/80 text-lg font-bold ml-1">/10</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 pt-5 flex flex-col flex-1">
                      <span className={`self-start text-white text-[12px] font-bold px-4 py-1.5 rounded-full mb-3 ${heroArticle.category === 'list' ? 'bg-[#FF7300]' : 'bg-[#e93d40]'}`}>
                        {heroArticle.category === 'review' ? 'Critique' : heroArticle.category === 'list' ? 'Liste' : 'Article'}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">{heroArticle.title}</h3>
                      <p className="text-gray-500 text-base leading-relaxed line-clamp-2 mb-5 flex-1">{heroArticle.excerpt}</p>
                      <span className="self-start inline-flex items-center bg-black text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:bg-gray-800 transition-colors">
                        Lire l'article
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* TRENDING BOX - Glassmorphism avec liseré */}
            <div className="lg:w-[42%] rounded-[32px] p-3 flex flex-col border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
              {/* Effet de glow coloré derrière */}
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/30 via-transparent to-red-500/30 rounded-[32px] blur-xl z-0 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full pt-1 px-1 pb-1">
                <h3 className="text-white text-[22px] font-extrabold tracking-wider mb-2.5 px-2 drop-shadow-md">TRENDING</h3>
                <div className="flex flex-col justify-between flex-1 gap-2">
                  {trendingArticles.map((article) => (
                    <Link key={article._id} href={`/article/${article.slug}`}>
                      <div className="flex items-center gap-4 bg-white rounded-[28px] p-1.5 shadow-lg hover:-translate-y-1 transition-transform cursor-pointer h-[145px]">
                        <div className="relative w-[133px] h-[133px] rounded-[24px] overflow-hidden flex-shrink-0 shadow-inner">
                          <Image src={article.coverImage || '/placeholder.jpg'} alt={article.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 pr-3 flex flex-col justify-between h-full py-2">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-extrabold text-[19px] text-gray-900 line-clamp-3 leading-[1.2] tracking-tight flex-1">{article.title}</h4>
                            {article.metadata?.score != null && (
                              <span className="bg-[#e93d40] text-white text-[15px] font-extrabold px-3 py-1.5 rounded-[14px] flex-shrink-0 shadow-sm">{article.metadata.score}<span className="text-[11px] font-medium opacity-90">/10</span></span>
                            )}
                          </div>
                          <span className={`inline-block self-start text-white text-[13px] font-bold px-3.5 py-1.5 rounded-full mt-auto tracking-wide ${article.category === 'list' ? 'bg-[#FF7300]' : 'bg-[#e93d40]'}`}>
                            {article.category === 'review' ? 'Critique' : article.category === 'list' ? 'Liste' : 'Article'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CRITIQUES DE FILMS ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-[#e93d40] tracking-tight">Critiques de films</h2>
          <div className="flex gap-2">
            <button
              onClick={() => { const el = document.getElementById('critiques-carousel'); if (el) el.scrollBy({ left: -300, behavior: 'smooth' }); }}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => { const el = document.getElementById('critiques-carousel'); if (el) el.scrollBy({ left: 300, behavior: 'smooth' }); }}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div id="critiques-carousel" className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`#critiques-carousel::-webkit-scrollbar { display: none; }`}</style>
          
          {/* GRANDE CARD GAUCHE - Fond violet */}
          {critiques[0] && (
            <div className="w-[300px] flex-shrink-0 snap-start">
              <Link href={`/article/${critiques[0].slug}`}>
                <div className="bg-gradient-to-b from-red-500 via-purple-600 to-violet-700 rounded-[32px] p-2 flex flex-col h-[380px] shadow-lg hover:-translate-y-1 transition-transform cursor-pointer group relative">
                  <div className="relative h-[240px] rounded-[24px] overflow-hidden">
                    <Image src={critiques[0].coverImage || '/placeholder.jpg'} alt={critiques[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {critiques[0].metadata?.score != null && (
                      <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-md rounded-full w-[52px] h-[52px] flex items-center justify-center shadow-lg border border-white/20">
                        <span className="text-white text-lg font-bold">{critiques[0].metadata.score}</span>
                        <span className="text-white/70 text-[10px] ml-0.5 mt-1">/10</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col justify-center flex-1">
                    <h3 className="font-bold text-white text-lg line-clamp-3 leading-snug drop-shadow-md">{critiques[0].title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-4 flex-1 min-w-[500px]">
            {/* CARD HAUT DROITE - Horizontale fond rouge */}
            {critiques[1] && (
              <Link href={`/article/${critiques[1].slug}`} className="flex-shrink-0 snap-start">
                <div className="bg-[#e93d40] rounded-[32px] p-2 flex h-[180px] shadow-lg hover:-translate-y-1 transition-transform cursor-pointer group">
                  <div className="relative w-[50%] rounded-[24px] overflow-hidden">
                    <Image src={critiques[1].coverImage || '/placeholder.jpg'} alt={critiques[1].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {critiques[1].metadata?.score != null && (
                      <div className="absolute top-2 right-2 bg-purple-700/90 backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center justify-center shadow-lg border border-white/20">
                        <span className="text-white text-base font-bold">{critiques[1].metadata.score}</span>
                        <span className="text-white/70 text-[10px] ml-0.5 mt-0.5">/10</span>
                      </div>
                    )}
                  </div>
                  <div className="w-[50%] p-4 flex flex-col justify-center">
                    <h3 className="font-bold text-white text-xl line-clamp-3 leading-tight mb-3 drop-shadow-md">{critiques[1].title}</h3>
                    <span className="self-start bg-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Critique</span>
                  </div>
                </div>
              </Link>
            )}

            {/* CARDS BAS DROITE - 2 petites cards */}
            <div className="flex gap-4 h-[180px]">
              {[critiques[2], critiques[3]].filter(Boolean).map((article) => (
                <Link key={article!._id} href={`/article/${article!.slug}`} className="flex-1 snap-start">
                  <div className="relative rounded-[32px] overflow-hidden shadow-lg hover:-translate-y-1 transition-transform cursor-pointer h-full group bg-black">
                    <Image src={article!.coverImage || '/placeholder.jpg'} alt={article!.title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    {article!.metadata?.score != null && (
                      <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center justify-center shadow-lg border border-white/20 z-10">
                        <span className="text-white text-base font-bold">{article!.metadata.score}</span>
                        <span className="text-white/70 text-[10px] ml-0.5 mt-0.5">/10</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                      <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight mb-2 drop-shadow-md">{article!.title}</h3>
                      <span className="inline-block bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Critique</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Reste des critiques formatées en petites cartes (colonnes de 2) pour le scroll */}
          {Array.from({ length: Math.ceil((critiques.length - 4) / 2) }).map((_, colIndex) => {
            const index1 = 4 + colIndex * 2;
            const index2 = 4 + colIndex * 2 + 1;
            const article1 = critiques[index1];
            const article2 = critiques[index2];

            if (!article1) return null;

            return (
              <div key={colIndex} className="flex flex-col gap-4 w-[350px] flex-shrink-0 snap-start">
                <Link href={`/article/${article1.slug}`} className="flex-1">
                  <div className="relative rounded-[32px] overflow-hidden shadow-lg hover:-translate-y-1 transition-transform cursor-pointer h-[180px] group bg-black">
                    <Image src={article1.coverImage || '/placeholder.jpg'} alt={article1.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    {article1.metadata?.score != null && (
                      <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center justify-center shadow-lg border border-white/10 z-10">
                        <span className="text-white text-xl font-bold">{article1.metadata.score}</span>
                        <span className="text-white/80 text-sm ml-0.5">/10</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="font-bold text-white text-lg line-clamp-2 leading-tight mb-3 drop-shadow-md">{article1.title}</h3>
                      <span className="inline-block bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full">Critique</span>
                    </div>
                  </div>
                </Link>

                {article2 ? (
                  <Link href={`/article/${article2.slug}`} className="flex-1">
                    <div className="relative rounded-[32px] overflow-hidden shadow-lg hover:-translate-y-1 transition-transform cursor-pointer h-[180px] group bg-black">
                      <Image src={article2.coverImage || '/placeholder.jpg'} alt={article2.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      {article2.metadata?.score != null && (
                        <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center justify-center shadow-lg border border-white/10 z-10">
                          <span className="text-white text-xl font-bold">{article2.metadata.score}</span>
                          <span className="text-white/80 text-sm ml-0.5">/10</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="font-bold text-white text-lg line-clamp-2 leading-tight mb-3 drop-shadow-md">{article2.title}</h3>
                        <span className="inline-block bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full">Critique</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ LISTES — Carousel ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-3xl font-extrabold text-[#FF7300] tracking-tight">Listes</h2>
          <div className="flex gap-4">
            <button
              onClick={() => { const el = document.getElementById('lists-carousel'); if (el) el.scrollBy({ left: -260, behavior: 'smooth' }); }}
              className="text-[#FF7300] hover:text-[#FF7300]/80 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => { const el = document.getElementById('lists-carousel'); if (el) el.scrollBy({ left: 260, behavior: 'smooth' }); }}
              className="text-[#FF7300] hover:text-[#FF7300]/80 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div id="lists-carousel" className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`#lists-carousel::-webkit-scrollbar { display: none; }`}</style>
          {lists.map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`} className="flex-shrink-0 snap-start">
              <div className="relative rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer w-[280px] h-[280px] group bg-black">
                <Image src={article.coverImage || '/placeholder.jpg'} alt={article.title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors duration-300" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <h3 className="font-extrabold text-white text-[26px] leading-[1.15] tracking-tight drop-shadow-lg">{article.title}</h3>
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
