# 🚀 GUÍA RÁPIDA: Configurar .env para docs.matias-api.com

**⏱️ Tiempo estimado:** 15 minutos  
**📋 Complejidad:** Media  
**🎯 Objetivo:** Configurar ambiente para producción

---

## 📌 Paso 1: Generar Valores Seguros (2 minutos)

```bash
cd /ruta/a/APIUBL2.1-DOCS

# Hacer script ejecutable
chmod +x setup-env-production.sh

# Ejecutar generador
./setup-env-production.sh
```

**Salida esperada:**
```
════════════════════════════════════════════════════════════════════
✅ VALORES GENERADOS EXITOSAMENTE
════════════════════════════════════════════════════════════════════

JWT_SECRET=a1b2c3d4e5f6... (32 caracteres)
DB_PASSWORD=xyz123abc... (base64)
SSL_CERT_PATH=/etc/ssl/certs/docs.matias-api.com.crt
SSL_KEY_PATH=/etc/ssl/private/docs.matias-api.com.key
```

📝 **Guardar estos valores en lugar seguro** (los necesitarás en 5 minutos)

---

## 📌 Paso 2: Copiar .env.production (1 minuto)

```bash
# Si .env.production no existe
cp .env.example .env.production

# O si ya existe, realizar backup
cp .env.production .env.production.backup
```

---

## 📌 Paso 3: Editar .env.production (5 minutos)

### Abrir el archivo
```bash
nano .env.production
# O con tu editor favorito: code, vim, gedit, etc.
```

### Buscar y reemplazar ESTOS valores:

**1. JWT_SECRET**
```bash
# ANTES:
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE_CHANGE_THIS

# DESPUÉS:
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6  # (el generado en Paso 1)
```

**2. OPENAI_API_KEY**
```bash
# ANTES:
OPENAI_API_KEY=sk-proj-YOUR_PRODUCTION_KEY_HERE

# DESPUÉS:
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx  # (tu clave real)
```

**3. DB_PASSWORD (si usas BD)**
```bash
# ANTES:
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# DESPUÉS:
DB_PASSWORD=xyz123abc...  # (el generado en Paso 1)
```

### Verificar que están correctos:

```bash
# SSL habilitado
SSL_ENABLED=true ✓

# Dominio correcto
REACT_APP_API_BACKEND=https://docs.matias-api.com ✓
APP_URL=https://docs.matias-api.com ✓
CORS_ORIGIN=https://docs.matias-api.com ✓

# Desarrollo deshabilitado
NODE_ENV=production ✓

# Rutas SSL correctas
SSL_CERT_PATH=/etc/ssl/certs/docs.matias-api.com.crt ✓
SSL_KEY_PATH=/etc/ssl/private/docs.matias-api.com.key ✓
```

---

## 📌 Paso 4: Guardar y Verificar Permisos (1 minuto)

```bash
# Salir del editor (Ctrl+X en nano, :wq en vim)

# Verificar que se guardó
cat .env.production | grep JWT_SECRET

# Cambiar permisos (solo tú puedes leer)
chmod 600 .env.production

# Verificar
ls -la .env.production
# Debe mostrar: -rw------- ... .env.production
```

---

## 📌 Paso 5: Obtener Certificado SSL (3 minutos - O ya lo tienes)

### ¿Ya tienes certificado SSL?
Si ya lo tienes en `/etc/ssl/certs/docs.matias-api.com.crt`, **saltar a Paso 6**.

### Si NO lo tienes, generar con Let's Encrypt:

```bash
# Instalar Certbot (si no lo tienes)
sudo apt-get install certbot python3-certbot-apache
# O en CentOS/Plesk: sudo yum install certbot

# Generar certificado
sudo certbot certonly --standalone -d docs.matias-api.com

# Debería preguntar por email y TOS - aceptar todo

# Instalar en rutas correctas
sudo cp /etc/letsencrypt/live/docs.matias-api.com/fullchain.pem \
    /etc/ssl/certs/docs.matias-api.com.crt
    
sudo cp /etc/letsencrypt/live/docs.matias-api.com/privkey.pem \
    /etc/ssl/private/docs.matias-api.com.key

# Asegurar permisos
sudo chmod 644 /etc/ssl/certs/docs.matias-api.com.crt
sudo chmod 600 /etc/ssl/private/docs.matias-api.com.key

# Verificar que existen
ls -la /etc/ssl/certs/docs.matias-api.com.crt
ls -la /etc/ssl/private/docs.matias-api.com.key
```

---

## 📌 Paso 6: Compilar y Probar (3 minutos)

```bash
cd /ruta/a/APIUBL2.1-DOCS

# Instalar dependencias (si es primera vez)
npm install

# Compilar
npm run build

# Debería terminar con:
# [SUCCESS] Generated static files in "build"
```

---

## 📌 Paso 7: Iniciar Servidor en Producción (1 minuto)

### Opción A: Directo (para testing)
```bash
# Cargar .env y ejecutar
NODE_ENV=production node server.js

# Debería mostrar:
# Server running at https://localhost:443
# O puerto especificado en .env
```

### Opción B: Con PM2 (recomendado)
```bash
# Instalar PM2 (si no lo tienes)
npm install -g pm2

# Iniciar
pm2 start "NODE_ENV=production node server.js" --name "matias-docs"

# Ver status
pm2 status

# Ver logs
pm2 logs matias-docs
```

### Opción C: En Plesk
Ver: `GUIA_PLESK.md` para pasos específicos en Plesk.

---

## 📌 Paso 8: Verificar Funcionamiento (2 minutos)

```bash
# 1. Health check
curl https://docs.matias-api.com/api/health

# Respuesta esperada:
# {"status":"ok"}


# 2. Search API
curl "https://docs.matias-api.com/api/ai/search?q=factura"

# Debe retornar documentación


# 3. Verificar certificado SSL
openssl x509 -in /etc/ssl/certs/docs.matias-api.com.crt -text -noout | grep "Not After"

# Debe mostrar fecha futura (ej: Not After : Oct 17 00:00:00 2026 GMT)


# 4. Ver logs
pm2 logs matias-docs | tail -20

# No debe haber errores rojos
```

---

## ✅ Checklist Final

- [ ] `.env.production` creado y editado
- [ ] `JWT_SECRET` reemplazado (no es el valor por defecto)
- [ ] `OPENAI_API_KEY` actualizado
- [ ] `DB_PASSWORD` actualizado (si usas BD)
- [ ] Certificado SSL existe en rutas correctas
- [ ] `chmod 600 .env.production` ejecutado
- [ ] `npm run build` completó exitosamente
- [ ] Servidor inicia sin errores
- [ ] `curl https://docs.matias-api.com/api/health` → `{"status":"ok"}`
- [ ] Logs no muestran errores críticos

---

## 🚨 Errores Comunes y Soluciones

### ❌ Error: "No such file or directory: .env.production"
```bash
# Solución:
cp .env.example .env.production
# Luego editar y agregar valores
```

### ❌ Error: "ENOENT: no such file: /etc/ssl/certs/docs.matias-api.com.crt"
```bash
# Solución:
# Generar certificado SSL con Certbot
sudo certbot certonly --standalone -d docs.matias-api.com
```

### ❌ Error: "Error: listen EACCES: permission denied :443"
```bash
# Solución (usar puerto alternativo):
# Cambiar en .env.production:
PORT=3443
# O ejecutar con sudo:
sudo NODE_ENV=production node server.js
```

### ❌ Error: "Cannot find module 'express'"
```bash
# Solución:
npm install
# Luego:
npm run build
```

### ❌ Error: "OPENAI_API_KEY is not defined"
```bash
# Solución:
# Verificar que en .env.production está:
grep OPENAI_API_KEY .env.production
# Si no aparece o dice "YOUR_PRODUCTION_KEY_HERE":
# Editar y agregar tu clave real
```

### ❌ Error: "Health check: connection refused"
```bash
# Solución:
# El servidor no está corriendo
pm2 status  # Ver si está ejecutándose
pm2 logs    # Ver si hay errores
pm2 start "NODE_ENV=production node server.js" --name "matias-docs"
```

---

## 📱 Probar APIs Manualmente

### Health Check
```bash
curl -X GET https://docs.matias-api.com/api/health \
  -H "Content-Type: application/json"

# Respuesta:
{"status":"ok"}
```

### Search
```bash
curl -X GET "https://docs.matias-api.com/api/ai/search?q=factura+electronica" \
  -H "Content-Type: application/json"

# Respuesta:
[
  {
    "title": "Factura Electrónica v1.9",
    "path": "/docs/factura-electronica/intro",
    "snippet": "..."
  }
]
```

### Chat (POST)
```bash
curl -X POST https://docs.matias-api.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué es una factura electrónica?",
    "context": "factura-electronica"
  }'

# Respuesta:
{
  "response": "Una factura electrónica es...",
  "sources": [...]
}
```

---

## 🔄 Comando Rápido (Todo en uno)

```bash
#!/bin/bash
set -e

echo "🚀 Configurando producción para docs.matias-api.com..."

# 1. Generar valores
./setup-env-production.sh

# 2. Copiar y editar
cp .env.example .env.production
echo "⚠️  Edita .env.production y reemplaza valores sensibles"
echo "   Abre: nano .env.production"
read -p "Presiona ENTER cuando hayas terminado de editar..."

# 3. Permisos
chmod 600 .env.production

# 4. Compilar
npm install
npm run build

# 5. Iniciar con PM2
pm2 start "NODE_ENV=production node server.js" --name "matias-docs"

# 6. Verificar
echo "✅ Servidor iniciado. Verificando..."
sleep 2
curl -s https://docs.matias-api.com/api/health && echo "✅ Health check OK" || echo "❌ Error en health check"

echo "✅ Configuración completada!"
```

---

## 📞 Soporte

**Si algo sale mal:**

1. Revisar logs: `pm2 logs matias-docs`
2. Ver variables: `cat .env.production | grep -E "^[^#]"` (filtrar comentarios)
3. Verificar procesos: `ps aux | grep node`
4. Comprobar puertos: `netstat -tulpn | grep 443`
5. Revisar guía completa: `DOCUMENTACION/ENV_CONFIGURATION.md`

---

## 🎯 Resumen

| Paso | Tarea | Tiempo |
|------|-------|--------|
| 1 | Generar valores seguros | 2 min |
| 2 | Copiar .env.production | 1 min |
| 3 | Editar valores | 5 min |
| 4 | Permisos y verificación | 1 min |
| 5 | SSL (si necesario) | 3 min |
| 6 | Compilar | 3 min |
| 7 | Iniciar servidor | 1 min |
| 8 | Verificar | 2 min |
| **TOTAL** | **Configuración completa** | **~18 min** |

---

**✅ ¡Listo! Tu aplicación está configurada para producción en docs.matias-api.com**

Próximo paso: Monitorear con `pm2 logs` y revisar health check regularmente.

---

*Guía rápida - Versión 1.0 - Octubre 17, 2025*
