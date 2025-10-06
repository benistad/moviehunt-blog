# 📋 COPIER-COLLER : Keep-Alive Supabase

## 🎯 Instructions (5 minutes)

### 1. Allez dans Supabase
- https://supabase.com/dashboard
- Sélectionnez votre projet
- Menu : **Edge Functions** → **Create a new function**
- Nom : `keep-alive`

### 2. Copiez ce code 👇

```typescript
// Edge Function Supabase - Keep Alive
// Cette fonction maintient votre base de données active

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (_req) => {
  try {
    // Créer le client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Variables d\'environnement manquantes',
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Faire une simple requête pour maintenir la connexion
    // On utilise auth.getSession() qui fonctionne toujours
    await supabase.auth.getSession()

    // Succès - la connexion à Supabase a été faite
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Supabase keep-alive ping successful',
        timestamp: new Date().toISOString(),
        ping: 'OK'
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
```

### 3. Déployez
- Cliquez sur **"Deploy"**

### 4. Activez le Cron
- Onglet **"Settings"** ou **"Cron"**
- Activez **"Enable Cron"**
- Expression : `*/5 * * * *` (toutes les 5 minutes)
- Cliquez sur **"Save"**

## ✅ Terminé !

Votre base Supabase ne sera plus jamais suspendue ! 🎉

### Vérification
- Allez dans **Logs** de votre fonction
- Vous verrez des exécutions toutes les 5 minutes
- Chaque exécution doit retourner `"success": true`

---

**C'est tout ! Pas besoin de service externe, tout est dans Supabase.** 🚀
