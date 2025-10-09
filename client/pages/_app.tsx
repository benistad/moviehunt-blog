import type { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../src/contexts/AuthContext';
import Layout from '../src/components/LayoutNext';
import '../src/index.css';

// Force rebuild - v2
export default function App({ Component, pageProps }: AppProps) {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </HelmetProvider>
  );
}
