# 🔒 Checklist de Seguridad - Producción (docs.matias-api.com)

**Fecha:** Octubre 17, 2025  
**Versión:** 1.4.0  
**Dominio:** docs.matias-api.com

---

## ✅ Pre-Deployment Checklist

### 🔐 Configuración de Secrets

- [ ] **JWT_SECRET**
  - [ ] Generado con valor aleatorio seguro (32 caracteres)
  - [ ] NO contiene valores predeterminados
  - [ ] Comando: `openssl rand -hex 32`
  - [ ] Guardado en lugar seguro (sin Git)

- [ ] **OPENAI_API_KEY**
  - [ ] Clave real de producción (NO de desarrollo)
  - [ ] Verificada que tenga permisos correctos
  - [ ] NO expuesta en logs
  - [ ] Rotación programada cada 90 días

- [ ] **Database Password (DB_PASSWORD)**
  - [ ] Generada con valor aleatorio (32+ caracteres)
  - [ ] Comando: `openssl rand -base64 32`
  - [ ] Almacenada de forma segura
  - [ ] Usuario de BD con permisos limitados

- [ ] **Otros Secrets**
  - [ ] AWS_ACCESS_KEY_ID (si aplica)
  - [ ] AWS_SECRET_ACCESS_KEY (si aplica)
  - [ ] SENTRY_DSN (si aplica)
  - [ ] Ninguno en Git

### 🌐 Dominio y DNS

- [ ] **DNS Configurado**
  - [ ] docs.matias-api.com → Servidor IP
  - [ ] Verificar: `nslookup docs.matias-api.com`
  - [ ] TTL apropiado (recomendado 3600)
  - [ ] MX records si aplica

- [ ] **Certificado SSL/TLS**
  - [ ] Certificado válido instalado
  - [ ] Ruta: `/etc/ssl/certs/docs.matias-api.com.crt`
  - [ ] Clave privada: `/etc/ssl/private/docs.matias-api.com.key`
  - [ ] Verificar: `openssl x509 -in /etc/ssl/certs/docs.matias-api.com.crt -noout -text`
  - [ ] Renovación automática configurada (Let's Encrypt)
  - [ ] Expira después de: ___/___/______ (anotar fecha)

- [ ] **HTTPS Redirigido**
  - [ ] HTTP (80) → HTTPS (443)
  - [ ] Verificar: `curl -I http://docs.matias-api.com`
  - [ ] Debe redirigir a https://

- [ ] **HSTS Headers**
  - [ ] Header Strict-Transport-Security presente
  - [ ] `max-age` mínimo 31536000 (1 año)
  - [ ] Verificar: `curl -I https://docs.matias-api.com | grep HSTS`

### 🛡️ Seguridad de Aplicación

- [ ] **Variables de Ambiente**
  - [ ] `.env.production` cargado correctamente
  - [ ] Permiso: `chmod 600 .env.production`
  - [ ] NO incluido en Git (verificar .gitignore)
  - [ ] NODE_ENV=production configurado

- [ ] **Helmet (Security Headers)**
  - [ ] SECURITY_HELMET_ENABLED=true
  - [ ] Headers: X-Frame-Options, X-Content-Type-Options, etc.
  - [ ] Verificar: `curl -I https://docs.matias-api.com | grep -i x-`

- [ ] **CORS Configurado**
  - [ ] CORS_ORIGIN=https://docs.matias-api.com
  - [ ] CORS_CREDENTIALS=true
  - [ ] Permitir solo dominio específico (NO *)

- [ ] **Rate Limiting**
  - [ ] SECURITY_RATE_LIMIT_ENABLED=true
  - [ ] Ventana: 15 minutos
  - [ ] Máximo: 100 requests/IP
  - [ ] Verificar contra abuso (revisar logs)

- [ ] **Autenticación JWT**
  - [ ] JWT_SECRET cambiado
  - [ ] JWT_EXPIRY=24h configurado
  - [ ] Tokens validados en cada request
  - [ ] Refresh tokens implementados

### 📊 Logging y Monitoreo

- [ ] **Logging Configurado**
  - [ ] LOG_LEVEL=info (no debug)
  - [ ] LOG_FORMAT=json
  - [ ] LOG_OUTPUT_FILE=/var/log/matias-api/app.log
  - [ ] Rotación de logs configurada (10 archivos máx)
  - [ ] Permisos correctos: `ls -la /var/log/matias-api/`

- [ ] **Monitoreo Activo**
  - [ ] PM2 monitoreando proceso
  - [ ] Health check: `curl https://docs.matias-api.com/api/health`
  - [ ] Response esperado: `{"status":"ok"}`
  - [ ] Alertas configuradas (si aplica)

- [ ] **Error Tracking (Sentry)**
  - [ ] ENABLE_ERROR_TRACKING=true
  - [ ] SENTRY_DSN configurado
  - [ ] Errores enviados a Sentry
  - [ ] Dashboard monitoreado regularmente

- [ ] **Performance Monitoring**
  - [ ] ENABLE_PERFORMANCE_MONITORING=true
  - [ ] Métricas recopiladas
  - [ ] Tiempo de respuesta normal (<1s)
  - [ ] CPU/Memoria dentro de límites

### 🗄️ Base de Datos (si aplica)

- [ ] **Conexión Segura**
  - [ ] DB_SSL=true
  - [ ] Certificado SSL en servidor BD
  - [ ] Conexión verificada: `psql -h db.matias-api.com -U docs_user`

- [ ] **Credenciales**
  - [ ] Usuario BD con permisos limitados
  - [ ] Contraseña segura (NO default)
  - [ ] NO credentials en Git

- [ ] **Backups**
  - [ ] Backup automático diario
  - [ ] Ubicación: `/home/backups/`
  - [ ] Verificar restauración: `pg_restore --list backup.sql`
  - [ ] Retención: 30 días mínimo

- [ ] **Seguridad BD**
  - [ ] Firewall: Solo IP del servidor app
  - [ ] Puerto: 5432 (no expuesto públicamente)
  - [ ] Actualizaciones de seguridad instaladas

### 📦 Dependencias

- [ ] **npm Dependencies**
  - [ ] `npm audit` sin vulnerabilidades críticas
  - [ ] Todas las dependencias actualizadas
  - [ ] package-lock.json bajo control de versión
  - [ ] `npm ci` usado en deployments (NO npm install)

- [ ] **Node.js Versión**
  - [ ] Versión recomendada: v20.19.0 o superior
  - [ ] Verificar: `node --version`
  - [ ] Maintenance updates instalados

### 🔄 CI/CD Pipeline

- [ ] **GitHub Actions (si aplica)**
  - [ ] Secrets configurados en GitHub
  - [ ] NO hardcoded credentials
  - [ ] Pipeline ejecuta tests
  - [ ] Deployment automático verificado

- [ ] **Git Repository**
  - [ ] `.env*` en `.gitignore`
  - [ ] `.gitignore` committeado
  - [ ] Secrets nunca en historial
  - [ ] Branch protection: main requiere PR review

### 📱 API Endpoints

- [ ] **Health Check**
  - [ ] `curl https://docs.matias-api.com/api/health`
  - [ ] Respuesta: `{"status":"ok"}`
  - [ ] HTTP 200

- [ ] **Search API**
  - [ ] `curl https://docs.matias-api.com/api/ai/search?q=factura`
  - [ ] Retorna resultados
  - [ ] HTTP 200

- [ ] **Chat API**
  - [ ] `curl -X POST https://docs.matias-api.com/api/ai/chat`
  - [ ] Acepta JSON
  - [ ] HTTP 200 o error apropiado

- [ ] **Docs API**
  - [ ] `curl https://docs.matias-api.com/api/ai/docs/factura-electronica`
  - [ ] Retorna documento
  - [ ] HTTP 200

- [ ] **Rate Limit Header**
  - [ ] Response incluye header `X-RateLimit-Remaining`
  - [ ] Se rechaza después de límite
  - [ ] HTTP 429 cuando se excede

### 🚀 Performance

- [ ] **Tiempo de Respuesta**
  - [ ] Home page: <1s
  - [ ] API endpoints: <500ms
  - [ ] Chat: <3s (con IA)
  - [ ] Benchmark: `ab -n 100 -c 10 https://docs.matias-api.com/`

- [ ] **Caché Configurado**
  - [ ] CACHE_ENABLED=true
  - [ ] Redis instalado y funcionando
  - [ ] TTL=3600 (1 hora)
  - [ ] Verificar: `redis-cli ping` → PONG

- [ ] **CDN (si aplica)**
  - [ ] CloudFlare o similar configurado
  - [ ] Assets en caché
  - [ ] Tiempo de respuesta mejorado

### 🌍 Disponibilidad Global

- [ ] **Uptime Monitoring**
  - [ ] Servicio de monitoreo configurado
  - [ ] Alertas si sigue bajando
  - [ ] SLA target: 99.5%+

- [ ] **Failover (si aplica)**
  - [ ] Backup server configurado
  - [ ] Automatic failover probado
  - [ ] DNS failover funcionando

- [ ] **Load Balancing (si aplica)**
  - [ ] Múltiples instancias ejecutando
  - [ ] Load balancer distribuyendo tráfico
  - [ ] Session affinity configurada

### 🔍 Cumplimiento y Auditoría

- [ ] **Auditoría**
  - [ ] Acceso a .env.production registrado
  - [ ] Cambios de secretos documentados
  - [ ] Quién tiene acceso: _______________
  - [ ] Última auditoría: ___/___/_______

- [ ] **Documentación**
  - [ ] Runbook de deployment disponible
  - [ ] Runbook de rollback disponible
  - [ ] Contactos de emergencia documentados
  - [ ] Procedimiento escalada claro

- [ ] **Cumplimiento Regulatorio**
  - [ ] GDPR compliance (si aplica)
  - [ ] Privacidad de datos verificada
  - [ ] Terms of Service actualizados
  - [ ] Privacy Policy actualizada

---

## 🚨 Checklist de Emergencia

En caso de incidente:

- [ ] **Rollback Preparado**
  - [ ] Versión anterior compilada y disponible
  - [ ] Comando de rollback documentado
  - [ ] Time to rollback: <5 minutos

- [ ] **Contactos de Emergencia**
  - [ ] Admin: _______________
  - [ ] DevOps: _______________
  - [ ] CEO: _______________
  - [ ] Soporte: _______________

- [ ] **Recovery Plan**
  - [ ] Backup probado en últimas 24h
  - [ ] Proceso de restauración documentado
  - [ ] RTO: < 1 hora
  - [ ] RPO: < 1 hora

---

## 📋 Post-Deployment Checklist

**Después de publicar en producción:**

- [ ] Tests de humo pasados (manual)
- [ ] Monitoreo alerta configurada
- [ ] Logs verificados (sin errores)
- [ ] Performance dentro de límites
- [ ] Health check OK
- [ ] Users pueden acceder
- [ ] APIs responden correctamente
- [ ] Documentación actualizada
- [ ] Changelog publicado
- [ ] Comunicación a stakeholders

---

## 🔄 Checklist Regular (Semanal/Mensual)

**Semanal:**
- [ ] Revisar logs de errores
- [ ] Verificar uptime
- [ ] Check rate limiting abuse
- [ ] Backup verificado

**Mensual:**
- [ ] Revisión de seguridad
- [ ] Actualización de dependencias
- [ ] Certificado SSL (expires?)
- [ ] Auditoría de accesos

**Trimestral:**
- [ ] Penetration testing
- [ ] Disaster recovery drill
- [ ] Rotación de secretos
- [ ] Update security policies

---

## 📞 Soporte y Escalación

**Contactos:**
- DevOps: ops@matias-api.com
- Security: security@matias-api.com
- Support: support@matias-api.com

**Enlaces Útiles:**
- Dashboard: https://status.matias-api.com
- Logs: /var/log/matias-api/app.log
- Metrics: https://monitoring.matias-api.com

---

**✅ Checklist completado por:** ___________________  
**Fecha:** ___/___/_______  
**Aprobado por:** ___________________

---

*Última actualización: Octubre 17, 2025*
