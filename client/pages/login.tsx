import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/AuthContext';
import dynamic from 'next/dynamic';

// Charger Login uniquement côté client (pas de SSR)
const Login = dynamic(() => import('../src/pages/Login'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Chargement...</div>
});

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  return <Login />;
}

// Désactiver le SSG pour cette page
export async function getServerSideProps() {
  return {
    props: {},
  };
}
