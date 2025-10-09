import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import SEO from '../src/components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page non trouvée - 404"
        description="La page que vous recherchez n'existe pas ou a été déplacée."
        url="/404"
      />

      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page non trouvée
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center justify-center">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Link>
            <Link href="/" className="btn-secondary inline-flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Rechercher un article
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
