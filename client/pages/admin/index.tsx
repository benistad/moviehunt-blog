import dynamic from 'next/dynamic';

// Charger Admin uniquement côté client (avec la logique d'auth)
const Admin = dynamic(() => import('../../src/pages/Admin'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Chargement...</div>
});

export default function AdminPage() {
  return <Admin />;
}

// Désactiver le SSG pour cette page
export async function getServerSideProps() {
  return {
    props: {},
  };
}
