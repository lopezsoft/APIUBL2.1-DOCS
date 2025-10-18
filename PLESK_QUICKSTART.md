# ⚡ Referencia Rápida - Plesk + Matias Docs

## 🎯 Instalación en 5 Minutos

### Opción 1: Script Automatizado (RECOMENDADO)

```bash
# 1. Conectar al servidor
ssh usuario@tu-servidor.com

# 2. Bajar script de instalación
cd /tmp
wget https://raw.githubusercontent.com/lopezsoft/APIUBL2.1-DOCS/main/install-plesk.sh
chmod +x install-plesk.sh

# 3. Ejecutar instalación
sudo ./install-plesk.sh

# 4. Esperar a que termine (~5 minutos)
```

**¿Listo?** Ve a https://docs.matias-api.com

---

### Opción 2: Instalación Manual

```bash
# 1. Conectar
ssh usuario@tu-servidor.com

# 2. Crear carpetas
mkdir -p /var/www/vhosts/docs.matias-api.com/applications/matias-docs
mkdir -p /var/www/vhosts/docs.matias-api.com/httpdocs
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs

# 3. Clonar repo
git clone https://github.com/lopezsoft/APIUBL2.1-DOCS.git .
git checkout main

# 4. Instalar
npm install --production

# 5. Compilar
npm run build

# 6. Crear server.js (copiar de GUIA_PLESK.md)

# 7. En Plesk: Dominio → Node.js → Agregar Aplicación
#    Nombre: matias-docs
#    Ruta: /var/www/vhosts/docs.matias-api.com/applications/matias-docs
#    Script: server.js
#    Puerto: 3000
```

---

## 📋 Checklist Plesk

### ✅ Paso 1: Acceso Plesk
- [ ] Panel: `https://tu-servidor.com:8443`
- [ ] Usuario: admin o tu usuario
- [ ] Contraseña: tu contraseña

### ✅ Paso 2: Dominio
- [ ] Seleccionar: `docs.matias-api.com`
- [ ] SSL: Verificar certificado válido
- [ ] Document Root: `/var/www/vhosts/docs.matias-api.com/httpdocs`

### ✅ Paso 3: Node.js
- [ ] Extensión instalada (Node.js en Plesk)
- [ ] Aplicación creada: `matias-docs`
- [ ] Puerto: `3000`
- [ ] Script: `server.js`
- [ ] Estado: Verde ✅

### ✅ Paso 4: Verificación
- [ ] `curl -I https://docs.matias-api.com` → HTTP 200
- [ ] `curl https://docs.matias-api.com/api/health` → JSON
- [ ] Navegador: `https://docs.matias-api.com` → Página visible

---

## 🔍 Comandos Útiles

```bash
# Ver estado de la aplicación
ps aux | grep node

# Ver logs
tail -f /var/www/vhosts/docs.matias-api.com/applications/matias-docs/logs/stdout
tail -f /var/www/vhosts/docs.matias-api.com/applications/matias-docs/logs/stderr

# Reiniciar manualmente
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs
pm2 restart all  # Si usas PM2

# O en Plesk:
# Dominio → Node.js → Seleccionar app → Restart

# Verificar puerto
netstat -tlnp | grep :3000

# Ver espacio
du -sh /var/www/vhosts/docs.matias-api.com/

# Actualizar código
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs
git pull origin main
npm install --production
npm run build
# Reiniciar en Plesk
```

---

## 🆘 Problemas Comunes

### ❌ "Cannot start application"
```bash
# Verificar logs
tail -f /var/www/vhosts/docs.matias-api.com/applications/matias-docs/logs/stderr

# Verificar dependencias
npm install --production

# Verificar Node.js
node --version
```

### ❌ "502 Bad Gateway"
```bash
# Reiniciar aplicación en Plesk
# O por SSH:
sudo systemctl restart psa-daemon

# Esperar 30 segundos
sleep 30

# Verificar
curl https://docs.matias-api.com/api/health
```

### ❌ "SSL certificate error"
- En Plesk: SSL/TLS → Renovar Let's Encrypt
- O: Agregar nuevo certificado

### ❌ "Cannot find module 'express'"
```bash
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs
npm install express cors compression
```

---

## 📊 URLs Importantes

| Recurso | URL |
|---------|-----|
| Documentación | `https://docs.matias-api.com` |
| Health API | `https://docs.matias-api.com/api/health` |
| Búsqueda | `https://docs.matias-api.com/api/ai/search` |
| Panel Plesk | `https://tu-servidor.com:8443` |

---

## 🚀 Actualizar a Nueva Versión

```bash
# 1. Conectar
ssh usuario@tu-servidor.com

# 2. Actualizar código
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs
git pull origin main

# 3. Instalar nuevas dependencias (si hay)
npm install --production

# 4. Compilar
npm run build

# 5. Reiniciar en Plesk
# Dominio → Node.js → Seleccionar app → Restart

# 6. Verificar
curl https://docs.matias-api.com/api/health
```

---

## 🔐 Seguridad Plesk

### SSL/TLS
```
✅ Certificado: Let's Encrypt (auto-renew)
✅ HTTPS obligatorio
✅ Redirigir HTTP → HTTPS
```

### Headers
```
✅ X-Frame-Options: SAMEORIGIN
✅ X-Content-Type-Options: nosniff
✅ X-XSS-Protection: 1; mode=block
```

### Backups
```
En Plesk:
Suscripción → Backup → Habilitar backup automático diario
```

---

## 📞 Soporte Rápido

**Panel Plesk:**
- Botón "Ayuda" → Centro de Soporte Plesk

**Nuestro equipo:**
- Email: support@matias-api.com
- Docs: https://github.com/lopezsoft/APIUBL2.1-DOCS

---

**Versión:** 1.4.0  
**Última actualización:** Octubre 17, 2025  
**Status:** ✅ Listo para Plesk
