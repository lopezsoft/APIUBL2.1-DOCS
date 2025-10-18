#!/bin/bash

# Build Matias Docs con variables de entorno

set -e

echo "🔨 Compilando Matias Docs v1.4.0..."
echo ""

# Cargar variables de entorno
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
fi

# Compilar
echo "📦 Ejecutando: npm run build"
npm run build

echo ""
echo "✅ Build completado exitosamente"
echo ""
echo "📍 Ubicación build: ./build/"
echo "🌍 Dominio: https://docs.matias-api.com"
echo "🔧 Backend: https://api-docs.matias-api.com"
echo ""
echo "Próximos pasos:"
echo "1. Copiar carpeta build/ a servidor"
echo "2. Iniciar Node.js en api-docs.matias-api.com"
echo "3. Verificar: curl https://docs.matias-api.com"
