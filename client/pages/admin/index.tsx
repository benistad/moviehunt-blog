import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/contexts/AuthContextNext';
import dynamic from 'next/dynamic';

// Charger Admin uniquement côté client
const Admin = dynamic(() => import('../../src/pages/Admin'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Chargement...</div>
});

const LoadingSpinner = dynamic(() => import('../../src/components/LoadingSpinner'), {
  ssr: false,
});

export default function AdminPage() {
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

  return <Admin />;
}

// Désactiver le SSG pour cette page
export async function getServerSideProps() {
  return {
    props: {},
  };
}
