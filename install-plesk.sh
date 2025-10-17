#!/bin/bash

###############################################################################
# 🚀 Script de Instalación Automatizada para Plesk
# Matias API Documentation v1.4.0
#
# Este script automatiza la instalación en un servidor con Plesk
# 
# Uso: chmod +x install.sh && ./install.sh
###############################################################################

set -e  # Salir si hay error

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
DOMAIN=${1:-"docs.matias-api.com"}
APP_NAME="matias-docs"
APP_PATH="/var/www/vhosts/${DOMAIN}/applications/${APP_NAME}"
DOCS_ROOT="/var/www/vhosts/${DOMAIN}/httpdocs"
PORT=3000

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 Instalación de Matias API Docs v1.4.0 en Plesk        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. VERIFICAR SI SOMOS ROOT
echo -e "${YELLOW}[1/10] Verificando permisos...${NC}"
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Este script debe ejecutarse como root (sudo)${NC}"
   exit 1
fi
echo -e "${GREEN}✅ Permisos verificados${NC}"
echo ""

# 2. VERIFICAR DEPENDENCIAS
echo -e "${YELLOW}[2/10] Verificando dependencias...${NC}"

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 no está instalado${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ $1 encontrado${NC}"
    return 0
}

check_command "node" || { echo "Instalar Node.js primero"; exit 1; }
check_command "npm" || { echo "Instalar npm primero"; exit 1; }
check_command "git" || { echo "Instalar git primero"; exit 1; }
echo ""

# 3. CREAR ESTRUCTURA DE CARPETAS
echo -e "${YELLOW}[3/10] Creando estructura de carpetas...${NC}"

mkdir -p "$APP_PATH"
mkdir -p "$DOCS_ROOT"
mkdir -p "/var/www/vhosts/${DOMAIN}/logs"
mkdir -p "/var/www/vhosts/${DOMAIN}/tmp"

chmod 755 "$DOCS_ROOT"
chmod 755 "$APP_PATH"

echo -e "${GREEN}✅ Carpetas creadas${NC}"
echo ""

# 4. CLONAR REPOSITORIO
echo -e "${YELLOW}[4/10] Clonando repositorio...${NC}"

if [ -d "$APP_PATH/.git" ]; then
    echo -e "${YELLOW}📂 Repositorio ya existe, actualizando...${NC}"
    cd "$APP_PATH"
    git fetch origin
    git checkout main
    git pull origin main
else
    echo -e "${YELLOW}📥 Descargando repositorio...${NC}"
    git clone https://github.com/lopezsoft/APIUBL2.1-DOCS.git "$APP_PATH"
    cd "$APP_PATH"
    git checkout main
fi

echo -e "${GREEN}✅ Repositorio listo${NC}"
echo ""

# 5. INSTALAR DEPENDENCIAS
echo -e "${YELLOW}[5/10] Instalando dependencias npm...${NC}"

cd "$APP_PATH"
npm install --production

echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# 6. COMPILAR PROYECTO
echo -e "${YELLOW}[6/10] Compilando proyecto...${NC}"

cd "$APP_PATH"
npm run clear 2>/dev/null || true
npm run build

if [ ! -d "$APP_PATH/build" ]; then
    echo -e "${RED}❌ Error en compilación${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Proyecto compilado${NC}"
echo ""

# 7. CREAR server.js
echo -e "${YELLOW}[7/10] Creando servidor Node.js...${NC}"

cat > "$APP_PATH/server.js" << 'EOF'
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middlewares
app.use(compression());
app.use(cors());
app.use(express.json());

// Logs
const logDir = '/var/www/vhosts/docs.matias-api.com/logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'build')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.4.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Búsqueda en documentación
app.post('/api/ai/search', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query requerido' });
    }

    const docsPath = path.join(__dirname, 'docs');
    const results = [];

    function searchDocs(dir) {
      try {
        const files = fs.readdirSync(dir, { recursive: true });
        for (const file of files) {
          if (typeof file === 'string' && file.endsWith('.md')) {
            try {
              const filePath = path.join(dir, file);
              const content = fs.readFileSync(filePath, 'utf8');
              
              if (content.toLowerCase().includes(query.toLowerCase())) {
                const matches = (content.match(new RegExp(query, 'gi')) || []).length;
                results.push({
                  file: file.replace(/\.md$/, ''),
                  matches: matches,
                  preview: content.substring(0, 200)
                });
              }
            } catch (e) {
              // Skip arquivos con error
            }
          }
        }
      } catch (e) {
        // Directory error
      }
    }

    if (fs.existsSync(docsPath)) {
      searchDocs(docsPath);
    }

    res.json({
      success: true,
      query,
      results: results.slice(0, 10),
      count: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Error en búsqueda',
      message: error.message 
    });
  }
});

// SPA - Servir index.html para rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 📚 Matias Docs running on port ${PORT}`);
  console.log(`[${timestamp}] Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`[${timestamp}] Health: /api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
EOF

echo -e "${GREEN}✅ Servidor creado${NC}"
echo ""

# 8. CREAR ARCHIVOS DE CONFIGURACIÓN
echo -e "${YELLOW}[8/10] Configurando ambiente...${NC}"

cat > "$APP_PATH/.env" << EOF
NODE_ENV=production
PORT=3000
LOG_DIR=/var/www/vhosts/${DOMAIN}/logs
EOF

chmod 644 "$APP_PATH/.env"

echo -e "${GREEN}✅ Configuración creada${NC}"
echo ""

# 9. ESTABLECER PERMISOS
echo -e "${YELLOW}[9/10] Estableciendo permisos...${NC}"

chown -R psaserv:psacln "$APP_PATH" || chown -R nobody:nobody "$APP_PATH"
chmod -R 755 "$APP_PATH"
chmod -R 755 "$DOCS_ROOT"

echo -e "${GREEN}✅ Permisos establecidos${NC}"
echo ""

# 10. INSTRUCCIONES FINALES
echo -e "${YELLOW}[10/10] Finalizando...${NC}"

echo -e "${GREEN}✅ Instalación completada!${NC}"
echo ""

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  📋 Próximos Pasos                                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}1. Acceder al Panel Plesk${NC}"
echo -e "   URL: https://tu-servidor.com:8443"
echo ""
echo -e "${YELLOW}2. Configurar Node.js para el dominio${NC}"
echo -e "   - Dominio → Node.js → Agregar Aplicación"
echo -e "   - Nombre: matias-docs"
echo -e "   - Ruta: $APP_PATH"
echo -e "   - Versión: 18.x"
echo -e "   - Puerto: 3000"
echo -e "   - Script: server.js"
echo ""
echo -e "${YELLOW}3. Verificar que está funcionando${NC}"
echo -e "   curl https://$DOMAIN/api/health"
echo ""
echo -e "${YELLOW}4. Ver logs${NC}"
echo -e "   tail -f /var/www/vhosts/$DOMAIN/logs/stdout"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ Documentación lista en: https://${DOMAIN}${NC}"
echo ""
