import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Charger Admin uniquement côté client
const Admin = dynamic(() => import('../../src/pages/Admin'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Chargement...</div>
});

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection vers login (temporaire, sans auth)
    router.push('/login');
  }, [router]);

  return <Admin />;
}

// Désactiver le SSG pour cette page
export async function getServerSideProps() {
  return {
    props: {},
  };
}
