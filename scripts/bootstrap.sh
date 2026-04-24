#!/usr/bin/env bash
# Paraná — Bootstrap script
#
# Uso:
#   ./scripts/bootstrap.sh
#
# Levanta Postgres + backend en Docker, corre migraciones y sembrado con los CSVs
# reales de Rosario Burletes, y deja todo listo para arrancar landing + app.

set -e

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "📝 Creando .env a partir de backend/.env.example"
  cp backend/.env.example .env
  echo ""
  echo "⚠️  Editá .env y poné tu ANTHROPIC_API_KEY si querés activar la IA real."
  echo "    Sin la clave, el agente IA responde en modo demo."
  echo ""
fi

echo "🐳 Levantando Postgres + backend con docker-compose…"
docker compose up -d db backend

echo "⏳ Esperando a que el backend esté saludable…"
until curl -sf http://localhost:8000/health > /dev/null 2>&1; do
  sleep 2
done

echo "🌱 Sembrando base con datos reales de Rosario Burletes…"
docker compose exec backend python -m scripts.seed

echo ""
echo "✅ Paraná listo."
echo ""
echo "Servicios:"
echo "  • API backend:         http://localhost:8000/docs"
echo "  • Postgres:            localhost:5432 (parana/parana)"
echo ""
echo "Para la app dashboard (puerto 3001):"
echo "  cd app && npm install && npm run dev"
echo ""
echo "Para la landing pública (puerto 3000):"
echo "  cd landing && npm install && npm run dev"
echo ""
echo "Login demo: admin@rosarioburletes.com / parana2026"
