import dynamic from 'next/dynamic';

// Charger CKEditor uniquement côté client (pas de SSR)
const CKEditorComponent = dynamic(() => import('./CKEditorComponent'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Chargement de l'éditeur...</div>
});

export default CKEditorComponent;
