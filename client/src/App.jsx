import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ArticleEditor from './pages/ArticleEditor';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
        </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
