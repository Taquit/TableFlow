#!/bin/sh
set -e

echo "⏳ Esperando a que la base de datos esté lista..."
# Espera hasta que postgres acepte conexiones
until node -e "
  import('pg').then(({ default: pg }) => {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    client.connect().then(() => { client.end(); process.exit(0); }).catch(() => process.exit(1));
  });
" 2>/dev/null; do
  echo "   DB no disponible, reintentando en 2s..."
  sleep 2
done

echo "✅ Base de datos lista"
echo "🔄 Corriendo migraciones..."
pnpm exec prisma migrate deploy

echo "🚀 Iniciando servidor..."
exec node src/index.js
