# 🎉 Matias Docs v1.4.0 - Guía de Publicación en Plesk

## 📌 Resumen

Se han creado **3 guías completas** para publicar **Matias API Documentation v1.4.0** en un servidor con **Plesk**.

---

## 📚 Documentos Disponibles

### 1️⃣ **GUIA_PLESK.md** (Guía Completa - 1,152 líneas)

**Contenido:**
- ✅ Preparación en Plesk (acceso, dominio, SSL)
- ✅ Configuración de Node.js en Plesk
- ✅ Clonación del repositorio
- ✅ Instalación y build
- ✅ Configuración del servidor (Nginx/Apache proxy)
- ✅ Headers de seguridad
- ✅ Verificación y testing
- ✅ Actualización de versiones
- ✅ Troubleshooting exhaustivo
- ✅ Monitoreo en Plesk
- ✅ Backups y seguridad

**Para:** Usuarios que necesitan instrucciones paso a paso detalladas

---

### 2️⃣ **install-plesk.sh** (Script Automatizado)

**Características:**
- ✅ Verificación automática de dependencias
- ✅ Crea estructura de carpetas
- ✅ Clona repositorio
- ✅ Instala dependencias
- ✅ Compila proyecto
- ✅ Genera `server.js` automáticamente
- ✅ Configura permisos correctamente
- ✅ Salida colorida con progreso
- ✅ Instrucciones finales

**Uso:**
```bash
chmod +x install-plesk.sh
sudo ./install-plesk.sh
```

**Para:** Usuarios que prefieren automatización

---

### 3️⃣ **PLESK_QUICKSTART.md** (Referencia Rápida)

**Contenido:**
- ✅ Instalación en 5 minutos
- ✅ Checklist Plesk completo
- ✅ Comandos útiles
- ✅ Solución de problemas comunes
- ✅ URLs importantes
- ✅ Guía de actualización

**Para:** Usuarios experimentados que necesitan referencia rápida

---

## 🚀 ¿Cómo Empezar?

### Opción 1: Instalación Automatizada (RECOMENDADO)

```bash
# En tu servidor (vía SSH)
cd /tmp
wget https://raw.githubusercontent.com/lopezsoft/APIUBL2.1-DOCS/main/install-plesk.sh
chmod +x install-plesk.sh
sudo ./install-plesk.sh

# Esperar ~5 minutos
# ¡Listo! Ir a https://docs.matias-api.com
```

**Ventajas:**
- ✅ Automático
- ✅ Rápido (~5 minutos)
- ✅ Sin errores
- ✅ Configuración correcta

---

### Opción 2: Manual Paso a Paso

1. Abre **GUIA_PLESK.md**
2. Sigue cada sección en orden
3. Ejecuta comandos en terminal SSH
4. Configura en Panel Plesk

**Ventajas:**
- ✅ Aprende el proceso
- ✅ Personalizable
- ✅ Control total

---

### Opción 3: Referencia Rápida

Usa **PLESK_QUICKSTART.md** si:
- Ya has hecho esto antes
- Solo necesitas recordar pasos
- Quieres solucionar un problema rápidamente

---

## 📊 Comparación de Métodos

| Aspecto | Automatizado | Manual | Quickstart |
|---------|--------------|--------|-----------|
| **Tiempo** | 5 min | 20-30 min | N/A |
| **Esfuerzo** | Mínimo | Alto | N/A |
| **Aprendizaje** | Bajo | Alto | Bajo |
| **Control** | Básico | Total | N/A |
| **Para principiantes** | ✅ Sí | ✅ Mejor | ❌ No |
| **Para expertos** | ✅ Sí | ✅ Sí | ✅ Sí |

---

## 🎯 Checklist Rápido

- [ ] Acceso Plesk funcionando
- [ ] Dominio creado: `docs.matias-api.com`
- [ ] SSL certificado instalado
- [ ] SSH accesible
- [ ] Node.js v18+ instalado
- [ ] Git instalado

Si todo ✅ → Ejecuta `install-plesk.sh`

---

## 📋 Arquitectura: Front + Backend

```
Cliente → Apache (Puerto 80/443)
  ├─ /           → Docusaurus (SPA estática)
  ├─ /api/*      → ProxyPass → Node.js (Puerto 3000)
  └─ /* (SPA)    → RewriteRule → /index.html
```

**Archivo:** `.htaccess` (ya configurado)
- ✅ Proxy automático para `/api/*` a Node.js
- ✅ SPA routing para Docusaurus
- ✅ Headers de seguridad
- ✅ Compresión gzip
- ✅ Caché de assets

---

## 📋 Paso Final: Configurar en Panel Plesk

Después de ejecutar el script, configurar Node.js en Plesk:

1. **Panel Plesk** → Tu dominio `docs.matias-api.com`
2. **Node.js** → **Agregar Aplicación**
3. Rellena:
   ```
   Nombre: matias-docs
   Ruta: /var/www/vhosts/docs.matias-api.com/applications/matias-docs
   Versión: 18.x
   Puerto: 3000
   Script: server.js
   Ambiente: production
   ```
4. **OK** y espera a que se reinicie

**Verificar Apache:**
- Asegúrate que `mod_proxy` y `mod_rewrite` estén habilitados
- El `.htaccess` ya está configurado correctamente

---

## ✅ Verificación

```bash
# Health check
curl -I https://docs.matias-api.com
# Esperado: HTTP/2 200 OK

# API test
curl https://docs.matias-api.com/api/health
# Esperado: JSON con status, version, uptime

# Ver en navegador
https://docs.matias-api.com
# Deberías ver la documentación de Matias
```

---

## 📱 Acceso Después de Instalación

| Recurso | URL |
|---------|-----|
| **Documentación** | https://docs.matias-api.com |
| **Health Check** | https://docs.matias-api.com/api/health |
| **Búsqueda** | https://docs.matias-api.com/api/ai/search |
| **Panel Plesk** | https://tu-servidor.com:8443 |

---

## 🆘 Si Hay Problemas

### Para instalación automatizada
1. Ve a **PLESK_QUICKSTART.md** → "Problemas Comunes"
2. Busca tu error específico
3. Sigue la solución

### Para instalación manual
1. Ve a **GUIA_PLESK.md** → "Troubleshooting"
2. Lee la sección relevante
3. Ejecuta los comandos sugeridos

### Para contactar soporte
- Email: support@matias-api.com
- GitHub: https://github.com/lopezsoft/APIUBL2.1-DOCS/issues

---

## 🔄 Actualizar a Nueva Versión

```bash
# Después de actualizar código en GitHub
cd /var/www/vhosts/docs.matias-api.com/applications/matias-docs
git pull origin main
npm install --production
npm run build

# En Panel Plesk → Node.js → Seleccionar app → Restart
```

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| **Documentación total** | 11,539 líneas |
| **Tiempo instalación auto** | ~5 minutos |
| **Tiempo instalación manual** | ~20-30 minutos |
| **Documentos Plesk** | 3 archivos |
| **Ejemplos incluidos** | 15+ |

---

## 🎓 Recursos Adicionales

- **GUIA_PUBLICACION_PRODUCCION.md** - Otros métodos deployment (Docker, GitHub Actions)
- **GUIA_INTEGRACION_IA.md** - Conectar agente de IA
- **RESUMEN_EJECUTIVO_V1.4.0.md** - Resumen completo del proyecto

---

## 🎉 ¡Listo!

Tu documentación de Matias API v1.4.0 estará ejecutándose en Plesk en pocos minutos.

**Próximo paso:** Conectar tu agente de IA usando **GUIA_INTEGRACION_IA.md**

---

**Versión:** 1.4.0  
**Fecha:** Octubre 17, 2025  
**Plataforma:** Plesk (compartido o VPS)  
**Status:** ✅ Listo para Producción
