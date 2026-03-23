import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useEffect, ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Raccourci clavier Ctrl+Shift+A pour accéder à l'admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Détecter le scroll pour ajouter une ombre à la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - Transparent au top, Blanc translucide au scroll */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent pt-8 pb-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo + Nom */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <Image 
                src="/logo.png" 
                alt="MovieHunt" 
                width={48}
                height={48}
                className="object-contain w-10 h-10 md:w-12 md:h-12" 
              />
              <span className={`text-4xl md:text-5xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-gray-900' : 'text-white drop-shadow-lg'}`}>
                MovieHunt <span className="font-normal text-[#E50914]">Blog</span>
              </span>
            </Link>

            {/* Barre de recherche centrale */}
            <div className="hidden lg:flex flex-1 justify-center max-w-md mx-4">
              <div className={`flex items-center rounded-full px-5 py-2 w-full transition-all ${isScrolled ? 'bg-gray-100 border border-transparent shadow-inner focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-md' : 'bg-white shadow-lg border border-white/50'}`}>
                <input
                  type="text"
                  placeholder="Recherche..."
                  className="bg-transparent border-none outline-none text-sm w-full text-gray-800 placeholder-gray-500"
                />
                <button className="bg-[#E50914] hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center ml-2 transition-colors flex-shrink-0 shadow-md">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation droite */}
            <nav className="hidden md:flex items-center gap-6 shrink-0">
              <Link
                href="/"
                className={`font-medium text-base transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] ${isScrolled ? 'text-gray-900 hover:text-[#E50914] after:bg-[#E50914]' : 'text-white hover:text-white/80 drop-shadow-md after:bg-white'}`}
              >
                Accueil
              </Link>
              <a
                href="https://www.moviehunt.fr"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium text-base transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white drop-shadow-md'}`}
              >
                MovieHunt
              </a>
            </nav>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Violet */}
      <footer className="bg-purple-700 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/logo.png" alt="MovieHunt Blog" width={40} height={40} className="object-contain" />
                <span className="text-xl font-bold text-white">
                  MovieHunt Blog
                </span>
              </div>
              <p className="text-purple-200 leading-relaxed">
                Découvrez des critiques et analyses de films sélectionnés par MovieHunt. Des pépites cinématographiques et des recommandations de qualité.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-purple-200 hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://www.moviehunt.fr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-200 hover:text-white transition-colors"
                  >
                    MovieHunt
                  </a>
                </li>
                <li>
                  <Link href="/" className="text-purple-200 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-purple-200 hover:text-white transition-colors">
                    Recherche
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">À propos</h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                Critiques et analyses de films basées sur les contenus de moviehunt.fr. Votre compagnon ultime pour des idées de films et des recommandations sur mesure.
              </p>
            </div>
          </div>

          <div className="border-t border-purple-600 mt-8 pt-8 text-center">
            <p className="text-purple-200 text-sm">
              &copy; {new Date().getFullYear()} MovieHunt Blog. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
