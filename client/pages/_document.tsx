import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        
        {/* Preconnect pour les domaines externes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://moviehunt-blog-api.vercel.app" />
        
        {/* Fonts optimisées - Poppins avec display=swap pour éviter FOIT */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        
        {/* CKEditor - chargé de manière asynchrone */}
        <script async src="https://cdn.ckbox.io/ckbox/2.6.1/ckbox.js" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
        
        {/* Cabin Analytics - déjà async */}
        <script async defer src="https://scripts.withcabin.com/hello.js" />
      </body>
    </Html>
  );
}
