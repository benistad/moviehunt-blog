const { createClient } = require('@supabase/supabase-js');

/**
 * Client Supabase utilisé uniquement pour valider les JWT utilisateurs.
 * On utilise l'URL + l'anon key (la service role key sert ailleurs pour les opérations admin DB).
 * `getUser(token)` accepte un access token JWT et retourne l'utilisateur s'il est valide.
 */
const supabaseAuthClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

/**
 * Middleware Express : exige un JWT Supabase valide dans le header Authorization.
 * Format attendu: `Authorization: Bearer <access_token>`
 *
 * En cas de succès, attache `req.user` (objet utilisateur Supabase) puis next().
 * En cas d'échec, renvoie 401.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise',
      });
    }

    const { data, error } = await supabaseAuthClient.auth.getUser(token);

    if (error || !data || !data.user) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide ou expiré',
      });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Erreur requireAuth:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Échec de l\'authentification',
    });
  }
}

module.exports = requireAuth;
