import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        
        {/* CKEditor */}
        <script src="https://cdn.ckbox.io/ckbox/2.6.1/ckbox.js" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
        
        {/* Cabin Analytics */}
        <script async src="https://scripts.withcabin.com/hello.js" />
      </body>
    </Html>
  );
}
