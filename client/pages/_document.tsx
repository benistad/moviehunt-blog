import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        
        {/* Preconnect pour les domaines externes */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://moviehunt-blog-api.vercel.app" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Fallback font system - rendu immédiat sans attendre Poppins */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            }
          `
        }} />

        {/* Poppins chargée de façon non-bloquante après le rendu */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=optional';
                link.onload = function() {
                  document.body.style.fontFamily = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";
                };
                document.head.appendChild(link);
              })();
            `,
          }}
        />
        
        {/* CKEditor - Chargé uniquement si nécessaire (admin) */}
        
        {/* Google Analytics - Chargement différé */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                var script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=G-C32K63D702';
                document.head.appendChild(script);
                
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-C32K63D702');
              });
            `,
          }}
        />
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
