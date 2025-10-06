# 📸 Guide Visuel : Keep-Alive Supabase

## 🎯 Objectif
Empêcher Supabase de suspendre votre base après 7 jours d'inactivité.

## 📋 Étapes avec captures

### Étape 1 : Accéder aux Edge Functions

1. Allez sur : **https://supabase.com/dashboard**
2. Sélectionnez votre projet
3. Dans le menu de gauche, cherchez **"Edge Functions"**
4. Cliquez dessus

### Étape 2 : Créer la fonction

1. Cliquez sur le bouton **"Create a new function"** (en haut à droite)
2. Une popup s'ouvre :
   ```
   Function name: keep-alive
   ```
3. Cliquez sur **"Create function"**

### Étape 3 : Copier le code

1. Vous êtes maintenant dans l'éditeur de code
2. **SUPPRIMEZ** tout le code existant (Ctrl+A puis Suppr)
3. Ouvrez le fichier **`COPIER_COLLER_SUPABASE.md`** de ce projet
4. **COPIEZ** tout le code TypeScript (section 2)
5. **COLLEZ** dans l'éditeur Supabase
6. Cliquez sur **"Deploy"** (bouton en haut à droite)

### Étape 4 : Configurer le Cron (Automatique)

1. Dans votre fonction `keep-alive`, cherchez l'onglet **"Cron Jobs"** ou **"Settings"**
2. Vous verrez une section **"Cron Schedule"**
3. Activez le toggle **"Enable Cron"**
4. Dans le champ **"Cron expression"**, entrez :
   ```
   */5 * * * *
   ```
   (Cela signifie : toutes les 5 minutes)
5. Cliquez sur **"Save"** ou **"Update"**

### Étape 5 : Tester

1. Retournez dans l'onglet principal de votre fonction
2. Cliquez sur **"Invoke"** ou **"Test"**
3. Vous devriez voir une réponse comme :
   ```json
   {
     "success": true,
     "message": "Base de données active",
     "timestamp": "2025-10-03T12:30:00.000Z",
     "ping": "OK"
   }
   ```

### Étape 6 : Vérifier les logs

1. Allez dans l'onglet **"Logs"**
2. Attendez 5 minutes
3. Vous devriez voir des nouvelles entrées apparaître automatiquement
4. Chaque entrée doit montrer `"success": true`

## ✅ C'est terminé !

Votre fonction va maintenant s'exécuter automatiquement toutes les 5 minutes et maintenir votre base Supabase active !

## 🔍 Que se passe-t-il ?

- **Toutes les 5 minutes** : Supabase exécute automatiquement votre fonction
- **La fonction** : Fait une simple requête SELECT sur votre table `articles`
- **Résultat** : Supabase voit de l'activité et ne suspend pas votre base
- **Coût** : 0€ (inclus dans le plan gratuit)

## ❓ FAQ

**Q: Ça consomme beaucoup de ressources ?**  
R: Non, c'est une simple requête SELECT qui lit 1 ligne. Très léger.

**Q: C'est vraiment gratuit ?**  
R: Oui, Supabase offre 500 000 invocations gratuites par mois. À 5 min d'intervalle, vous utilisez ~8 640 invocations/mois.

**Q: Je peux changer la fréquence ?**  
R: Oui ! Modifiez l'expression cron :
- `*/10 * * * *` = toutes les 10 minutes
- `*/15 * * * *` = toutes les 15 minutes
- `0 */1 * * *` = toutes les heures

**Q: Que se passe-t-il si la fonction échoue ?**  
R: Vous verrez l'erreur dans les logs. Mais normalement, ça ne devrait jamais échouer.

**Q: Je dois faire quelque chose d'autre ?**  
R: Non ! Une fois configuré, c'est 100% automatique. Vous n'avez plus rien à faire.

## 🎉 Avantages

✅ **Simple** : Copier-coller, 5 minutes  
✅ **Gratuit** : Inclus dans Supabase  
✅ **Automatique** : Aucune maintenance  
✅ **Fiable** : Géré par Supabase  
✅ **Logs** : Vous voyez tout  

---

**Temps total : 5 minutes**  
**Maintenance : 0 minute/mois**  
**Coût : 0€**  

🚀 **C'est la solution la plus simple !**
