require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const errorHandler = require('./middleware/errorHandler');

// Vérification des variables d'environnement Supabase
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERREUR: SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis dans .env');
  process.exit(1);
}

console.log('📦 Utilisation de Supabase comme base de données');
console.log('✅ Système de catégories activé (v2.1 - REDEPLOY FORCE)');

// Routes
const articlesRoutes = require('./routes/articles');
const queueRoutes = require('./routes/queue');
const webhookRoutes = require('./routes/webhook');
const importRoutes = require('./routes/import');
const tmdbRoutes = require('./routes/tmdb');
const sitemapRoutes = require('./routes/sitemap');
const proxyRoutes = require('./routes/proxy');

// Vérification des variables d'environnement requises
if (!process.env.PORT) {
  console.error('❌ ERREUR: PORT est requis dans .env');
  process.exit(1);
}

if (!process.env.CLIENT_URL) {
  console.error('❌ ERREUR: CLIENT_URL est requis dans .env');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Configuration CORS - Restreindre aux origines connues
const allowedOrigins = [
  'https://www.moviehunt-blog.fr',
  'https://moviehunt-blog.fr',
  'http://localhost:3000',
  'http://localhost:3001',
];
// Autoriser les previews Vercel via une regex (*.vercel.app)
const allowedOriginRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

app.use(cors({
  origin: (origin, cb) => {
    // Requêtes server-to-server (sans header Origin) : autorisées
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin) || allowedOriginRegex.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`Origin non autorisée: ${origin}`));
  },
  credentials: false, // Auth via Bearer token, pas de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Webhook-Secret'],
}));

// Limite de taille des requêtes (Vercel a une limite stricte de 4.5MB)
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true, limit: '4mb' }));

// Routes
app.use('/api/articles', articlesRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/import', importRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/proxy', proxyRoutes);
app.use('/api', sitemapRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MovieHunt Blog API opérationnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
  });
});

// Gestionnaire d'erreurs
app.use(errorHandler);

// Démarrage du serveur (uniquement en développement local)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║   🎬 MovieHunt Blog API                       ║
║   🚀 Serveur démarré sur le port ${PORT}        ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║   📝 Documentation: http://localhost:${PORT}/api  ║
╚═══════════════════════════════════════════════╝
  `);
  });

  // Gestion des erreurs non capturées
  process.on('unhandledRejection', (err) => {
    console.error('❌ Erreur non gérée:', err);
    process.exit(1);
  });
}

// Export pour Vercel
module.exports = app;
