import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Une erreur est survenue';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// Articles
export const articlesAPI = {
  getAll: (params = {}) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  getBySlug: (slug) => api.get(`/articles/slug/${slug}`),
  generate: (url) => api.post('/articles/generate', { url }),
  regenerate: (id) => api.post(`/articles/${id}/regenerate`),
  update: (id, data) => api.put(`/articles/${id}`, data),
  publish: (id) => api.post(`/articles/${id}/publish`),
  delete: (id) => api.delete(`/articles/${id}`),
  getStats: () => api.get('/articles/stats'),
  getTags: () => api.get('/articles/tags/all'),
};

// Queue
export const queueAPI = {
  getAll: (status) => api.get('/queue', { params: { status } }),
  process: (limit) => api.post('/queue/process', { limit }),
  retry: () => api.post('/queue/retry'),
  delete: (id) => api.delete(`/queue/${id}`),
};

// Webhook
export const webhookAPI = {
  health: () => api.get('/webhook/health'),
};

export default api;
