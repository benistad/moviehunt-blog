import dynamic from 'next/dynamic';

// Charger Login uniquement côté client (pas de SSR)
const Login = dynamic(() => import('../src/pages/Login'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Chargement...</div>
});

export default function LoginPage() {
  return <Login />;
}

// Désactiver le SSG pour cette page
export async function getServerSideProps() {
  return {
    props: {},
  };
}
