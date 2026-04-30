# 🔧 Fix : `git push` qui se bloque ou ne fait rien sur macOS

## 🐛 Le symptôme

Tu lances `git push origin main` dans le Terminal et :
- Soit le terminal **se fige** (curseur clignote, rien ne s'affiche)
- Soit ça affiche `Everything up-to-date` alors que **rien n'a été poussé**
- Soit `git commit` semble fonctionner mais le code n'arrive jamais sur GitHub
- Vercel ne redéploie pas → le site live n'a pas tes changements

## 🎯 La cause racine

**GitHub n'accepte plus les mots de passe en HTTPS depuis août 2021.**
Il faut obligatoirement un **Personal Access Token (PAT)**.

Quand `git push` tente de s'authentifier, deux scénarios :

1. **Pas de credential helper configuré** → git attend que tu tapes un username/password,
   mais sur certains terminaux macOS le prompt **ne s'affiche pas** → ça paraît bloqué.
2. **Anciennes credentials en cache** (mauvais mot de passe) → erreur silencieuse,
   `git push` retourne `Everything up-to-date` parce que les commits **n'ont jamais été acceptés**.

## ✅ La solution définitive (à faire UNE SEULE FOIS)

### 1. Créer un Personal Access Token GitHub

1. Va sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique **Generate new token (classic)**
3. Nom : `MovieHunt Blog Local`
4. Expiration : **No expiration** (ou 1 an)
5. Coche au minimum : `repo` (full control of private repositories)
6. Clique **Generate token**
7. **Copie le token immédiatement** (`ghp_...`) — il ne s'affiche qu'une fois

### 2. Configurer le credential helper macOS

```bash
git config --global credential.helper osxkeychain
```

Ça stocke les credentials dans le **Keychain macOS** (sécurisé, persistant).

### 3. Premier push avec le token

```bash
GIT_TERMINAL_PROMPT=1 git push origin main
```

Quand le prompt apparaît :
- **Username** : ton pseudo GitHub (ex: `benistad`)
- **Password** : **colle ton PAT** (`ghp_...`) — pas ton mot de passe GitHub

Le Keychain va sauvegarder ces credentials. Les `git push` suivants fonctionneront sans rien demander.

### 4. Si d'anciennes credentials sont déjà dans le Keychain et bloquent tout

```bash
# Supprimer les credentials GitHub du Keychain
git credential-osxkeychain erase <<EOF
protocol=https
host=github.com
EOF
```

Puis refaire l'étape 3.

---

## 🚨 Particularité du projet : iCloud Drive

Le projet est dans :
```
/Users/benoitdurand/Library/Mobile Documents/com~apple~CloudDocs/DEV/WINDSURF/MovieHunt le Blog
```

**iCloud Drive peut occasionnellement verrouiller des fichiers dans `.git/`** pendant qu'il les synchronise → git devient temporairement bloqué.

**Astuce** : si un `git push` reste bloqué sans prompter, fais `Ctrl+C` et relance — la deuxième tentative passe en général.

---

## 🛠 Workflow recommandé : `./push.sh`

Pour éviter tout problème à l'avenir, utilise le script `push.sh` à la racine du projet :

```bash
./push.sh "ton message de commit"
```

Il fait tout dans le bon ordre avec des vérifications claires :
1. Vérifie que `git status` est sain
2. `git add` les fichiers (en excluant les fichiers de test/data)
3. `git commit` avec ton message
4. `git push origin main` avec `GIT_TERMINAL_PROMPT=1`
5. Affiche le SHA local vs remote pour confirmer

---

## 📋 Comment vérifier qu'un push a vraiment marché

Toujours ces 3 commandes après un push :

```bash
# 1. Le commit est-il bien dans l'historique local ?
git log --oneline -3

# 2. Y a-t-il des changements non commités qui traînent ?
git status

# 3. Le remote a-t-il bien le même SHA que local ?
git ls-remote origin main
git rev-parse main
```

Si les SHA des étapes 2 et 3 sont **identiques** → le push est OK.
Si différents → le push n'a pas marché malgré le message "up-to-date".

---

## 🔄 Vercel ne redéploie pas après un push ?

1. Va sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Ouvre le projet `moviehunt-blog`
3. Onglet **Deployments** : vérifie qu'un nouveau déploiement s'est lancé après ton commit
4. Si non : Settings → Git → vérifie que la branche `main` est bien connectée
5. Tu peux aussi forcer un redéploiement : bouton **⋯** sur le dernier déploiement → **Redeploy**

---

## 📝 Checklist anti-blocage avant chaque push

- [ ] Credential helper configuré : `git config --global credential.helper`
- [ ] PAT GitHub valide (pas expiré)
- [ ] `git status` propre, on sait ce qu'on commite
- [ ] Message de commit clair
- [ ] Vérification post-push avec `git ls-remote origin main`
