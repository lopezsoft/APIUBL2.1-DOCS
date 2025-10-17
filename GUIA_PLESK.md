# 🚀 Guía de Publicación en Plesk - Matias API Documentation v1.4.0

## 📌 Introducción

Esta guía te ayudará a publicar **Matias API Documentation v1.4.0** en un servidor con **Plesk** (hosting compartido o VPS).

### Requisitos
- ✅ Acceso a Panel Plesk
- ✅ Dominio configurado: `docs.matias-api.com`
- ✅ Certificado SSL/TLS (generalmente incluido en Plesk)
- ✅ Node.js v18+ instalado en el servidor
- ✅ npm v9+ instalado
- ✅ Git instalado

---

## 📋 Tabla de Contenidos

1. [Preparación en Plesk](#preparación-en-plesk)
2. [Configuración de Aplicación Node.js](#configuración-de-aplicación-nodejs)
3. [Clonación del Repositorio](#clonación-del-repositorio)
4. [Instalación y Build](#instalación-y-build)
5. [Configuración del Servidor](#configuración-del-servidor)
6. [Verificación](#verificación)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Preparación en Plesk

### Paso 1: Acceder a Plesk

```
URL: https://tu-servidor.com:8443
Usuario: Admin o tu usuario
Contraseña: Tu contraseña Plesk
```

### Paso 2: Seleccionar el Dominio

1. En el panel principal, ve a **Dominios**
2. Busca y haz clic en `docs.matias-api.com`
3. Se abrirá el panel de control del dominio

### Paso 3: Verificar Certificado SSL

1. Ve a **SSL/TLS Certificados**
2. Verifica que tengas un certificado válido
   - Si no hay, crea uno:
     - Haz clic en **Agregar Certificado SSL/TLS**
     - Selecciona **Let's Encrypt**
     - Marca `docs.matias-api.com`
     - Haz clic en **Generar**

### Paso 4: Configurar Directorio Raíz (Document Root)

1. Ve a **Configuración del Dominio**
2. En **Directorio Raíz de Documentos**, configura:
   ```
   /var/www/vhosts/docs.matias-api.com/httpdocs
   ```
3. Guarda los cambios

---

## 🟢 Configuración de Aplicación Node.js

### Paso 1: Instalar Node.js en Plesk (si no está)

**Vía Terminal SSH:**
```bash
# Conectar a tu servidor
ssh usuario@tu-servidor.com

# Verificar si Node.js está instalado
node --version
npm --version

# Si no está, instalar (CentOS/RHEL):
sudo yum install nodejs npm

# O para Debian/Ubuntu:
sudo apt-get install nodejs npm
```

### Paso 2: Crear la Estructura de Carpetas

```bash
# Conectar por SSH
ssh usuario@tu-servidor.com

# Ir al directorio del dominio
cd /var/www/vhosts/docs.matias-api.com/

# Crear carpetas necesarias
mkdir -p httpdocs
mkdir -p applications
mkdir -p logs
mkdir -p tmp

# Cambiar permisos
chmod 755 httpdocs
chmod 755 applications
chmod 755 logs
```

### Paso 3: Configurar Aplicación Node.js en Plesk

1. En el panel de Plesk, ve a **Extensiones** → **Node.js**
   - Si no está instalada, ve a **Actualizar Extensiones** e instálala

2. En el panel del dominio, ve a **Node.js**

3. Haz clic en **Agregar Aplicación**

4. Completa los datos:
   ```
   Nombre de la aplicación: matias-docs
   Ruta de acceso: /var/www/vhosts/docs.matias-api.com/applications/matias-docs
   Versión de Node.js: 18.x (o superior)
   Puerto: 3000
   Script de inicio: server.js
   Ambiente: production
   ```

5. Haz clic en **OK**

---

## 📥 Clonación del Repositorio

### Paso 1: Clonar el Repositorio

```bash
# Conectar por SSH
ssh usuario@tu-servidor.com

# Ir a la carpeta de aplicaciones
cd /var/www/vhosts/docs.matias-api.com/applications

# Clonar el repositorio
git clone https://github.com/lopezsoft/APIUBL2.1-DOCS.git matias-docs

# Entrar a la carpeta
cd matias-docs
```

### Paso 2: Verificar Rama Correcta

```bash
# Ver rama actual
git branch

# Cambiar a main (versión de producción)
git checkout main

# Actualizar a última versión
git pull origin main
```

---

## 🔨 Instalación y Build

### Paso 1: Instalar Dependencias

```bash
# Estar en la carpeta del proyecto
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs

# Instalar dependencias (solo producción)
npm install --production

# Alternativa: Instalar todo para verificación
npm install
```

**Tiempo estimado:** 5-10 minutos

### Paso 2: Compilar para Producción

```bash
# Limpiar caché anterior
npm run clear

# Compilar
npm run build

# Verificar que se creó la carpeta build/
ls -la build/
```

**Tiempo estimado:** 3-5 minutos

**Salida esperada:**
```
[SUCCESS] Generated static files in "build".
```

### Paso 3: Crear Script de Servidor para Plesk

**Crear archivo:** `server.js` (en la raíz del proyecto)

```javascript
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();

// Middlewares
app.use(compression());
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del build
app.use(express.static(path.join(__dirname, 'build')));

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.4.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Búsqueda en documentación (si está disponible)
const fs = require('fs');
app.post('/api/ai/search', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query requerido' });
    }

    const docsPath = path.join(__dirname, 'docs');
    const results = [];

    function searchDocs(dir) {
      const files = fs.readdirSync(dir, { recursive: true });
      for (const file of files) {
        if (typeof file === 'string' && file.endsWith('.md')) {
          const filePath = path.join(dir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (content.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              file: file.replace(/\.md$/, ''),
              matches: (content.match(new RegExp(query, 'gi')) || []).length
            });
          }
        }
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
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📚 Matias Docs servidor ejecutándose en puerto ${PORT}`);
});
```

### Paso 4: Reinstalar Dependencias (incluyendo compression)

```bash
npm install compression --save-prod
npm install --production
```

---

## ⚙️ Configuración del Servidor

### Paso 1: Configurar Proxy Inverso (Nginx/Apache en Plesk)

#### **Opción A: Plesk Manager (Recomendado)**

1. En el panel de Plesk, ve al dominio `docs.matias-api.com`
2. Ve a **Node.js**
3. Selecciona tu aplicación `matias-docs`
4. Verifica que esté **Habilitada**
5. Haz clic en **Aceptar**

Plesk configurará automáticamente el proxy.

#### **Opción B: Configuración Manual (Apache/Nginx)

**Si usas Apache (archivo `.htaccess`):**

Crear archivo: `/var/www/vhosts/docs.matias-api.com/httpdocs/.htaccess`

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Redirigir todo a Node.js
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,QSA,L]
  
  # Proxy headers
  RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"
  RequestHeader set X-Forwarded-Proto "https"
</IfModule>
```

**Si usas Nginx:**

Plesk configura esto automáticamente, pero puedes verificar en:
`/etc/nginx/conf.d/` o `/etc/nginx/sites-available/`

### Paso 2: Configurar HTTPS Permanente

1. Ve a **Configuración del Dominio**
2. En **HTTPS**, selecciona:
   - ✅ **Hacer permanente HTTPS (HTTP a HTTPS redirect)**
3. Guarda

### Paso 3: Configurar Headers de Seguridad

En Plesk, ve a **Configuración del Dominio** → **Apache & Nginx Settings**

Agregar en el campo de configuración adicional:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

---

## ✅ Verificación

### Paso 1: Verificar que Plesk Detecta la Aplicación

1. En el panel de Plesk, ve a tu dominio
2. Ve a **Node.js**
3. Deberías ver `matias-docs` con estado **Verde** (ejecutándose)

### Paso 2: Verificar Acceso

```bash
# Desde tu máquina local
curl -I https://docs.matias-api.com
# Esperado: HTTP/2 200 OK

# Verificar health
curl https://docs.matias-api.com/api/health
# Esperado: {"status":"ok","version":"1.4.0",...}
```

### Paso 3: Ver Logs

```bash
# Conectar por SSH
ssh usuario@tu-servidor.com

# Ver logs de Node.js
tail -f /var/www/vhosts/docs.matias-api.com/applications/matias-docs/logs/stderr
tail -f /var/www/vhosts/docs.matias-api.com/applications/matias-docs/logs/stdout

# O en el Panel Plesk:
# Dominio → Node.js → Seleccionar app → Logs
```

### Paso 4: Verificar en el Navegador

Abre en tu navegador:
```
https://docs.matias-api.com
```

Deberías ver:
- ✅ Página de inicio de Matias API
- ✅ Marco Regulatorio DIAN
- ✅ Enlaces a documentación

---

## 🔄 Actualizaciones Futuras

### Actualizar a Nuevas Versiones

```bash
# Conectar por SSH
ssh usuario@tu-servidor.com

# Ir al proyecto
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs

# Traer cambios
git pull origin main

# Reinstalar dependencias
npm install --production

# Recompilar
npm run build

# En Plesk: Reiniciar la aplicación
# Dominio → Node.js → Click en app → Restart
```

---

## 🆘 Troubleshooting

### Problema 1: "Application can't start"

**Causa:** Error en `server.js` o puerto en uso

**Solución:**
```bash
# Verificar si el puerto 3000 está disponible
sudo lsof -i :3000

# Si está en uso, matar el proceso
sudo kill -9 <PID>

# O cambiar puerto en Plesk (Node.js Settings → Puerto: 3001)
```

### Problema 2: "Cannot find module"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs
npm install --production
npm install compression cors express --save-prod
```

### Problema 3: "Error 502 Bad Gateway"

**Causa:** Node.js no está respondiendo

**Solución:**
```bash
# Reiniciar la aplicación en Plesk
# Dominio → Node.js → Seleccionar app → Restart

# O por SSH:
pm2 restart all  # Si usas PM2
```

### Problema 4: "Build failed with error"

**Causa:** Error durante compilación

**Solución:**
```bash
npm run clear
rm -rf node_modules
npm install
npm run build
```

### Problema 5: "Cannot GET /"

**Causa:** `build/` no existe o rutas incorrectas

**Solución:**
```bash
# Verificar que existe build/
ls -la build/
ls -la build/index.html

# Si no existe, recompilar
npm run build
```

### Problema 6: "SSL certificate not valid"

**Solución en Plesk:**
1. Ve a **SSL/TLS Certificados**
2. Selecciona tu certificado
3. Haz clic en **Renovar**
4. Si es Let's Encrypt, se renovará automáticamente

---

## 📊 Monitoreo en Plesk

### Ver Uso de Recursos

1. En el panel, ve a tu dominio
2. Ve a **Estadísticas de recursos**
3. Observa:
   - Uso de CPU
   - Uso de memoria
   - Conexiones

### Configurar Alertas

1. Ve a **Configuración de la Suscripción**
2. Ve a **Alertas**
3. Configura alertas para:
   - Uso de CPU > 80%
   - Uso de disco > 90%
   - Errores en aplicación

### Limpiar Caché

```bash
npm run clear
rm -rf build/
npm run build
```

---

## 🔐 Consideraciones de Seguridad

### Proteger Ruta de Administración

En Plesk, ve a **Configuración del Dominio** → **Protección de Directorios**

```
Proteger: /admin/
Usuario: admin
Contraseña: contraseña-fuerte
```

### Actualizar Dependencias Regularmente

```bash
npm outdated
npm update --production
npm audit fix
```

### Backups Automáticos

En Plesk:
1. Ve a **Suscripción**
2. Ve a **Backup**
3. Configura backup diario

---

## 📱 URLs de Administración

| Función | URL |
|---------|-----|
| **Panel Plesk** | `https://tu-servidor.com:8443` |
| **Documentación** | `https://docs.matias-api.com` |
| **Health Check** | `https://docs.matias-api.com/api/health` |
| **Búsqueda API** | `https://docs.matias-api.com/api/ai/search` |

---

## 🎯 Checklist Final

- [ ] Acceder a Panel Plesk
- [ ] Verificar SSL certificado
- [ ] Configurar Document Root
- [ ] Clonar repositorio
- [ ] Instalar dependencias
- [ ] Compilar proyecto (npm run build)
- [ ] Crear server.js
- [ ] Configurar Node.js en Plesk
- [ ] Verificar que aplicación está ejecutándose
- [ ] Probar en navegador: https://docs.matias-api.com
- [ ] Verificar /api/health
- [ ] Configurar SSL permanente
- [ ] Configurar headers de seguridad
- [ ] Ver logs
- [ ] Configurar backups
- [ ] Documentar credenciales

---

## 📞 Soporte

**Si tienes problemas:**

1. **Ver logs:** 
   ```bash
   tail -f /var/www/vhosts/docs.matias-api.com/applications/matias-docs/logs/stderr
   ```

2. **Contactar soporte Plesk:**
   - Panel Plesk → Ayuda → Centro de Soporte

3. **Nuestro equipo:**
   - 📧 support@matias-api.com

---

**Versión:** 1.4.0  
**Actualizado:** Octubre 17, 2025  
**Status:** ✅ Listo para Plesk

¡Tu documentación debería estar funcionando en `https://docs.matias-api.com`! 🎉
