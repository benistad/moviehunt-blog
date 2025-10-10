import dynamic from 'next/dynamic';

// Charger ArticleEditor uniquement côté client (avec la logique d'auth)
const ArticleEditor = dynamic(() => import('../../../src/pages/ArticleEditor'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Chargement de l'éditeur...</div>
});

export default function EditArticlePage() {
  return <ArticleEditor />;
}

// Désactiver le SSG pour cette page (nécessite authentification)
export async function getServerSideProps() {
  return {
    props: {},
  };
}
