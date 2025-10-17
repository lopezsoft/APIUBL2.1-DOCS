#!/bin/bash

# ============================================================================
# Script: Generador de Variables Seguras para .env.production
# Uso: chmod +x setup-env-production.sh && ./setup-env-production.sh
# ============================================================================

set -e

echo "════════════════════════════════════════════════════════════════════"
echo "🔧 Generador de Configuración Segura para Producción"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# 1. Generar JWT_SECRET
# ============================================================================
echo -e "${BLUE}[1/5]${NC} Generando JWT_SECRET..."
JWT_SECRET=$(openssl rand -hex 32)
echo -e "${GREEN}✓ JWT_SECRET generado${NC}"
echo -e "   ${YELLOW}$JWT_SECRET${NC}"
echo ""

# ============================================================================
# 2. Información del dominio
# ============================================================================
echo -e "${BLUE}[2/5]${NC} Configuración del dominio"
DOMAIN="docs.matias-api.com"
echo -e "   ${GREEN}✓ Dominio${NC}: $DOMAIN"
echo -e "   ${GREEN}✓ Base URL${NC}: https://$DOMAIN"
echo -e "   ${GREEN}✓ API URL${NC}: https://$DOMAIN/api"
echo ""

# ============================================================================
# 3. Información de rutas SSL
# ============================================================================
echo -e "${BLUE}[3/5]${NC} Rutas de Certificados SSL"
SSL_CERT="/etc/ssl/certs/${DOMAIN}.crt"
SSL_KEY="/etc/ssl/private/${DOMAIN}.key"
echo -e "   ${GREEN}✓ Certificado${NC}: $SSL_CERT"
echo -e "   ${GREEN}✓ Clave Privada${NC}: $SSL_KEY"
echo ""

# ============================================================================
# 4. Generar contraseña segura para base de datos
# ============================================================================
echo -e "${BLUE}[4/5]${NC} Generando contraseña segura para base de datos..."
DB_PASSWORD=$(openssl rand -base64 32)
echo -e "${GREEN}✓ DB_PASSWORD generado${NC}"
echo -e "   ${YELLOW}$DB_PASSWORD${NC}"
echo ""

# ============================================================================
# 5. Generar valores adicionales
# ============================================================================
echo -e "${BLUE}[5/5]${NC} Datos adicionales"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/backups/env-production-${TIMESTAMP}"
echo -e "   ${GREEN}✓ Timestamp${NC}: $TIMESTAMP"
echo ""

# ============================================================================
# Generar resumen
# ============================================================================
echo "════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ VALORES GENERADOS EXITOSAMENTE${NC}"
echo "════════════════════════════════════════════════════════════════════"
echo ""

echo "📋 VALORES A AGREGAR EN .env.production:"
echo ""
echo -e "${YELLOW}# JWT Security${NC}"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo -e "${YELLOW}# Database Credentials${NC}"
echo "DB_PASSWORD=$DB_PASSWORD"
echo ""
echo -e "${YELLOW}# SSL Configuration${NC}"
echo "SSL_CERT_PATH=$SSL_CERT"
echo "SSL_KEY_PATH=$SSL_KEY"
echo ""
echo -e "${YELLOW}# Application URLs${NC}"
echo "REACT_APP_API_BACKEND=https://$DOMAIN"
echo "APP_URL=https://$DOMAIN"
echo ""

# ============================================================================
# Guardar en archivo temporal
# ============================================================================
OUTPUT_FILE="/tmp/env-production-values-${TIMESTAMP}.txt"
cat > "$OUTPUT_FILE" << EOF
# ============================================================================
# Valores Generados - .env.production
# Generado: $(date)
# Dominio: docs.matias-api.com
# ============================================================================

# JWT Security (REEMPLAZAR INMEDIATAMENTE)
JWT_SECRET=$JWT_SECRET

# Database Credentials (REEMPLAZAR INMEDIATAMENTE)
DB_PASSWORD=$DB_PASSWORD

# SSL Configuration
SSL_CERT_PATH=$SSL_CERT
SSL_KEY_PATH=$SSL_KEY

# Application URLs
REACT_APP_API_BACKEND=https://$DOMAIN
APP_URL=https://$DOMAIN

# Timestamp
GENERATED_AT=$(date)

# ⚠️ SEGURIDAD
# 1. Este archivo contiene valores sensibles - ALMACENAR DE FORMA SEGURA
# 2. Nunca comitear estos valores en Git
# 3. Usar secretos manager (AWS Secrets Manager, HashiCorp Vault, etc.)
# 4. Eliminar este archivo después de usarlo
# 5. Auditar quién tiene acceso a estos valores

EOF

echo -e "${GREEN}✓ Archivo guardado${NC}: $OUTPUT_FILE"
echo ""

# ============================================================================
# Instrucciones siguientes
# ============================================================================
echo "════════════════════════════════════════════════════════════════════"
echo "📝 PASOS SIGUIENTES:"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  Editar .env.production:"
echo "   nano .env.production"
echo ""
echo "2️⃣  Reemplazar ESTOS VALORES:"
echo "   - JWT_SECRET"
echo "   - DB_PASSWORD"
echo "   - OPENAI_API_KEY"
echo "   - Otras claves de API"
echo ""
echo "3️⃣  Verificar certificado SSL:"
echo "   ls -la /etc/ssl/certs/${DOMAIN}.crt"
echo "   ls -la /etc/ssl/private/${DOMAIN}.key"
echo ""
echo "   Si no existe, generar con:"
echo "   sudo certbot certonly --standalone -d ${DOMAIN}"
echo ""
echo "4️⃣  Copiar .env.production al servidor:"
echo "   scp .env.production usuario@${DOMAIN}:/var/www/html/"
echo ""
echo "5️⃣  Instalar dependencias:"
echo "   npm install"
echo ""
echo "6️⃣  Compilar:"
echo "   npm run build"
echo ""
echo "7️⃣  Iniciar en producción:"
echo "   NODE_ENV=production node server.js"
echo ""
echo "8️⃣  Verificar:"
echo "   curl https://${DOMAIN}/api/health"
echo ""

# ============================================================================
# Mostrar archivo generado
# ============================================================================
echo "════════════════════════════════════════════════════════════════════"
echo "📄 CONTENIDO GUARDADO EN: $OUTPUT_FILE"
echo "════════════════════════════════════════════════════════════════════"
echo ""
cat "$OUTPUT_FILE"
echo ""

# ============================================================================
# Warning final
# ============================================================================
echo "════════════════════════════════════════════════════════════════════"
echo -e "${RED}⚠️  ADVERTENCIA DE SEGURIDAD${NC}"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "✓ Nunca comitear .env.production en Git"
echo "✓ Guardar el archivo de salida en lugar seguro"
echo "✓ Cambiar permisos: chmod 600 .env.production"
echo "✓ Auditar acceso a los valores sensibles"
echo "✓ Rotar claves regularmente"
echo "✓ Usar secretos manager en producción"
echo ""
echo -e "${GREEN}✅ Script completado exitosamente${NC}"
echo ""
