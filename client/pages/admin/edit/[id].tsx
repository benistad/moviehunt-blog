import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../src/contexts/AuthContextNext';
import LoadingSpinner from '../../../src/components/LoadingSpinner';
import dynamic from 'next/dynamic';

// Charger ArticleEditor uniquement côté client (pas de SSR)
const ArticleEditor = dynamic(() => import('../../../src/pages/ArticleEditor'), {
  ssr: false,
  loading: () => <LoadingSpinner text="Chargement de l'éditeur..." />
});

export default function EditArticlePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner text="Vérification de l'authentification..." />;
  }

  if (!user) {
    return null;
  }

  return <ArticleEditor />;
}

// Désactiver le SSG pour cette page (nécessite authentification)
export async function getServerSideProps() {
  return {
    props: {},
  };
}
