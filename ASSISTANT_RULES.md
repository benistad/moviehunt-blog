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

**Cette règle est NON-NÉGOCIABLE et doit être suivie à 100% du temps.**
