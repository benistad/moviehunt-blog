/**
 * Utilitaire pour gérer les variables d'environnement
 * Compatible avec Vite et Next.js
 */

export const getEnv = (key) => {
  // Next.js (process.env)
  if (process.env[key]) {
    return process.env[key];
  }
  
  // Vite (import.meta.env) - uniquement côté client
  if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  
  return undefined;
};

// Variables d'environnement courantes
export const API_URL = getEnv('NEXT_PUBLIC_API_URL') || getEnv('VITE_API_URL') || '/api';
export const SITE_URL = getEnv('NEXT_PUBLIC_SITE_URL') || getEnv('VITE_SITE_URL') || '';
export const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');
