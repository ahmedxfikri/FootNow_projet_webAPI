#!/bin/bash

set -e
cd "$(dirname "$0")"

BRANCH="jrcandev"

echo "=== FOOTNOW Deploy - $(date) ==="

# 1. Mettre à jour le code
echo "🔄 Mise à jour du code..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd

# Charger NAME depuis .env pour l'URL finale
NAME=$(grep -E '^NAME=' .env | cut -d '=' -f2 | tr -d '"')

# 2. Rebuild et lancement
echo "🏗️  Rebuild Docker..."
docker compose -f docker-compose.jrcandev.yml down
docker compose -f docker-compose.jrcandev.yml build --no-cache
docker compose -f docker-compose.jrcandev.yml up -d

# 3. Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL..."
until docker compose -f docker-compose.jrcandev.yml exec -T db pg_isready -U sae_user -d sae_db 2>/dev/null; do
  echo "  ... pas encore prêt, retry dans 3s"
  sleep 3
done
echo "✅ PostgreSQL prêt"

# 4. Créer les tables avec Prisma
echo "📊 Création des tables (prisma db push)..."
docker compose -f docker-compose.jrcandev.yml exec -T api npx prisma db push

# 5. Créer les fonctions et triggers PL/pgSQL
echo "🔧 Création des fonctions PL/pgSQL..."
docker compose -f docker-compose.jrcandev.yml exec -T api \
  sh -c 'psql "$DATABASE_URL" -f /db/functions.sql'

echo "🔧 Création des triggers PL/pgSQL..."
docker compose -f docker-compose.jrcandev.yml exec -T api \
  sh -c 'psql "$DATABASE_URL" -f /db/triggers.sql'

# 6. Seed (données + admin + prédictions)
echo "🌱 Import des données (seed)..."
docker compose -f docker-compose.jrcandev.yml exec -T api npx prisma db seed

# 7. Vérification des prédictions
echo "✅ Vérification des prédictions..."
PREDICTIONS=$(docker compose -f docker-compose.jrcandev.yml exec -T db \
  psql -U sae_user -d sae_db -t -c "SELECT COUNT(*) FROM prediction;" | tr -d ' \r\n')
echo "📊 $PREDICTIONS prédictions en base"

# 8. Vérification de l'API
echo "🔍 Vérification de l'API..."
sleep 5
if curl -sf "http://localhost:3070/api/health" > /dev/null; then
  echo "🎉 API HEALTHY !"
else
  echo "⚠️  API non disponible. Logs :"
  docker compose -f docker-compose.jrcandev.yml logs api --tail=30
fi

echo ""
echo "🌐 Site : https://${NAME}.jrcan.dev"
echo "=== Déploiement terminé à $(date) ==="