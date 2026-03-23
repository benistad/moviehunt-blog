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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header - Redesign */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Nom */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-8 h-8">
                <Image 
                  src="/logo.png" 
                  alt="MovieHunt Blog" 
                  width={32}
                  height={32}
                  className="object-contain" 
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                MovieHunt <span className="font-normal">Blog</span>
              </span>
            </Link>

            {/* Barre de recherche + Navigation */}
            <div className="flex items-center space-x-6">
              {/* Barre de recherche */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                <input
                  type="text"
                  placeholder="Recherche..."
                  className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-500"
                />
                <button className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 ml-2 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Accueil
                </Link>
                <a
                  href="https://www.moviehunt.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  MovieHunt
                </a>
              </nav>
            </div>
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
