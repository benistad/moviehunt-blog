#!/bin/bash
# Script de push robuste pour MovieHunt Blog
# Usage : ./push.sh "message de commit"

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ -z "$1" ]; then
  echo -e "${RED}❌ Usage : ./push.sh \"message de commit\"${NC}"
  exit 1
fi

COMMIT_MSG="$1"

cd "$(dirname "$0")"

echo -e "${BLUE}━━━ 1/5 État git actuel ━━━${NC}"
git status --short
echo

echo -e "${BLUE}━━━ 2/5 Stage des fichiers (sans les .json/test) ━━━${NC}"
# On ajoute tout sauf les fichiers de test/data
git add -A
git reset HEAD \
  article_plot_twist_updated.json \
  article-netflix-10-films.json \
  tmdb_results.json \
  test_tmdb.js \
  create_article.js 2>/dev/null || true

git status --short
echo

# Vérifie qu'il y a quelque chose à commiter
if git diff --cached --quiet; then
  echo -e "${YELLOW}⚠️  Aucun fichier à commiter — abandon.${NC}"
  exit 0
fi

echo -e "${BLUE}━━━ 3/5 Commit ━━━${NC}"
git commit -m "$COMMIT_MSG"
echo

LOCAL_SHA=$(git rev-parse main)
echo -e "${GREEN}✅ Commit local : ${LOCAL_SHA:0:8}${NC}"
echo

echo -e "${BLUE}━━━ 4/5 Push vers origin/main ━━━${NC}"
GIT_TERMINAL_PROMPT=1 git push origin main
echo

echo -e "${BLUE}━━━ 5/5 Vérification remote ━━━${NC}"
REMOTE_SHA=$(git ls-remote origin main | awk '{print $1}')
echo -e "Local  : ${LOCAL_SHA:0:8}"
echo -e "Remote : ${REMOTE_SHA:0:8}"

if [ "$LOCAL_SHA" = "$REMOTE_SHA" ]; then
  echo -e "${GREEN}✅ Push confirmé — Vercel va redéployer dans 1-2 min${NC}"
else
  echo -e "${RED}❌ ATTENTION : SHA local ≠ remote — le push n'a pas marché !${NC}"
  echo -e "${YELLOW}Voir GIT_PUSH_FIX.md pour résoudre le problème d'authentification.${NC}"
  exit 1
fi
