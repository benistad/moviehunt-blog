import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../src/contexts/AuthContextNext';
import Layout from '../src/components/LayoutNext';
import '../src/index.css';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

// AuthProvider Next.js compatible - v5
export default function App({ Component, pageProps }: AppProps) {
  return (
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
        <div className={poppins.className}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
    </AuthProvider>
  );
}
