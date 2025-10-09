import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/contexts/AuthContext';
import Admin from '../../src/pages/Admin';
import LoadingSpinner from '../../src/components/LoadingSpinner';

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
