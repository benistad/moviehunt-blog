# 🤖 Règles pour l'Assistant (Cascade)

## ⚠️ RÈGLE ABSOLUE : TOUJOURS REDÉMARRER BACKEND ET FRONTEND

**Après CHAQUE modification de code, je DOIS TOUJOURS :**

### 1. Redémarrer le BACKEND
```bash
pkill -9 node && sleep 1 && PORT=5001 node server/index.js &
```

### 2. Redémarrer le FRONTEND
```bash
pkill -f "vite" && sleep 1 && cd client && npm run dev &
```

### 3. Vérifier que tout fonctionne
```bash
sleep 3 && curl -s http://localhost:5001/api/health && curl -s http://localhost:5173 | head -3
```

## 🚨 POURQUOI C'EST CRITIQUE

- Node.js ne recharge PAS automatiquement les modules
- Vite peut avoir des problèmes de cache
- Les modifications ne sont PAS visibles sans redémarrage
- Cela évite des heures de débogage inutile

## 📝 CHECKLIST APRÈS CHAQUE MODIFICATION

- [ ] Modification effectuée
- [ ] Backend redémarré (OBLIGATOIRE)
- [ ] Frontend redémarré (OBLIGATOIRE)
- [ ] Tests effectués (curl ou navigateur)
- [ ] Confirmation que ça fonctionne

## 🔄 COMMANDE TOUT-EN-UN

```bash
pkill -9 node && pkill -f "vite" && sleep 1 && PORT=5001 node server/index.js & sleep 2 && cd client && npm run dev
```

## ⛔ NE JAMAIS

- ❌ Modifier du code sans redémarrer
- ❌ Redémarrer seulement le backend
- ❌ Redémarrer seulement le frontend
- ❌ Supposer que HMR (Hot Module Replacement) suffit

## ✅ TOUJOURS

- ✅ Redémarrer BACKEND ET FRONTEND après CHAQUE modification
- ✅ Attendre 2-3 secondes entre les redémarrages
- ✅ Vérifier que les serveurs répondent
- ✅ Tester dans le navigateur

---

## 📅 RÈGLE : DATE DE MISE À JOUR SUR LES ARTICLES MODIFIÉS

**À chaque fois qu'un article est modifié (contenu, SEO, titres…), je DOIS :**

1. M'assurer que le script de mise à jour inclut `updated_at: new Date().toISOString()` dans l'update Supabase.
2. La page article `[slug].tsx` affiche automatiquement "Mis à jour le X" si `updatedAt` est plus récent que `publishedAt` (logique déjà en place).

### Articles déjà mis à jour (afficheront la date de MAJ automatiquement)
| Article | Slug | Date de MAJ |
|---|---|---|
| Leviathan (1989) | `leviathan-plongee-dans-les-profondeurs-des-annees-80` | 30 avril 2026 |
| Quel film regarder en famille | `quel-film-regarder-en-famille` | 30 avril 2026 |
| Films pour ados | `idee-de-film-pour-ado-10-films-incontournables` | 30 avril 2026 |
| Level 16 | `level-16-une-dystopie-intrigante-mais-une-execution-decevante` | 30 avril 2026 |

### Règle pour les prochains articles modifiés
- Toujours inclure `updated_at: new Date().toISOString()` dans les scripts d'update Supabase.
- Si `updatedAt` > `publishedAt` de plus d'1 jour → le composant affiche "Mis à jour le X" à la place de la date de publication.

---

**Cette règle est NON-NÉGOCIABLE et doit être suivie à 100% du temps.**
