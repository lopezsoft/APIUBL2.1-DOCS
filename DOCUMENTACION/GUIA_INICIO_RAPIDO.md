# 🚀 Guía Completa: Cómo Ejecutar el Sistema (Frontend + Backend)

## 📋 Resumen Rápido

Este proyecto contiene 2 servidores que deben ejecutarse **simultáneamente**:

| Servidor | Puerto | Comando | Uso |
|----------|--------|---------|-----|
| **Frontend** (Docusaurus) | 3000 | `npm start` | Documentación + UI del chat |
| **Backend** (OpenAI) | 3001 | `npm run ai-server:dev` | API de chat GPT-4o Mini |

---

## ✅ Requisitos Previos

1. **Node.js 18.0+**
   ```bash
   node --version  # Debe mostrar v18.0.0 o superior
   ```

2. **npm 9.0+**
   ```bash
   npm --version
   ```

3. **API Key de OpenAI**
   - Obtener en: https://platform.openai.com/api-keys
   - Crear archivo `.env.local` (ver sección de configuración)

4. **Dos terminales abiertas**
   - Terminal 1: Para el frontend
   - Terminal 2: Para el backend

---

## 🔧 Paso 1: Configurar el Archivo `.env.local`

En la **raíz del proyecto** (`d:\wamp64\www\APIUBL2.1-DOCS`), crea un archivo llamado `.env.local`:

```bash
# .env.local
OPENAI_API_KEY=sk-proj-tu-clave-secreta-aqui
NODE_ENV=development
PORT=3001
```

**Pasos:**
1. Abre un editor de texto (VS Code, Notepad++, etc.)
2. Copia el contenido anterior
3. Reemplaza `sk-proj-tu-clave-secreta-aqui` con tu API key real
4. Guarda como `.env.local` en la raíz del proyecto
5. **No compartir este archivo** - ya está en `.gitignore`

Verifica que existe:
```bash
ls .env.local  # Linux/Mac
type .env.local  # Windows
```

---

## 🎯 Paso 2: Ejecutar los Servidores

### Opción A: Dos Terminales (Recomendado)

#### Terminal 1 - Frontend (Docusaurus)

```bash
cd d:\wamp64\www\APIUBL2.1-DOCS
npm start
```

**Salida esperada:**
```
  ℹ 「wds」: Project is running at http://localhost:3000/
  ℹ 「wds」: webpack output is served from /
  ✔ Compiled successfully!
```

**Se abre automáticamente en:** http://localhost:3000

#### Terminal 2 - Backend (OpenAI)

```bash
cd d:\wamp64\www\APIUBL2.1-DOCS
npm run ai-server:dev
```

**Salida esperada:**
```
╔════════════════════════════════════════════════════════╗
║  🚀 Servidor OpenAI GPT-4o Mini iniciado              ║
║  🌐 URL: http://localhost:3001                        ║
║  ✅ Health Check: http://localhost:3001/health        ║
║  💬 Chat Endpoint: POST http://localhost:3001/...     ║
╚════════════════════════════════════════════════════════╝
```

**Ambos corren simultáneamente.** Usa `Ctrl+C` en cualquier terminal para detener ese servidor.

---

### Opción B: Una Sola Terminal (Secuencial)

Si prefieres una sola terminal, inicia los servidores en segundo plano:

#### Windows (PowerShell)

```powershell
# Terminal 1 - Backend en background
Start-Process npm -ArgumentList "run ai-server:dev"

# Espera 3 segundos
Start-Sleep -Seconds 3

# Terminal 2 - Frontend
npm start
```

#### Linux/Mac (Bash)

```bash
# Backend en background
npm run ai-server:dev &

# Frontend en primer plano
npm start
```

Para detener todo:
```bash
pkill -f "node\|docusaurus"
```

---

## 🧪 Paso 3: Verificar que Funciona

### Test 1: Verificar Health Check (Backend)

En una **nueva terminal**:

```bash
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "service": "OpenAI GPT-4o Mini",
  "timestamp": "2025-01-15T10:30:45.123Z",
  "environment": {
    "model": "gpt-4o-mini",
    "hasApiKey": true
  }
}
```

### Test 2: Abrir Frontend en Navegador

- **URL:** http://localhost:3000
- **Deberías ver:** Documentación de MATIAS API con botón de chat azul flotante

### Test 3: Probar el Chat

1. Haz clic en el botón azul flotante (esquina inferior derecha)
2. Se abre un popup de chat
3. Escribe: "¿Cómo valido un NIT?"
4. Presiona Enter
5. El asistente debe responder en 2-3 segundos

**Si esto funciona:** ¡Todo está configurado correctamente! ✅

---

## 🛠️ Comandos npm Disponibles

```bash
# FRONTEND
npm start                  # Inicia Docusaurus en puerto 3000 (desarrollo)
npm run build             # Compila la documentación para producción
npm run serve             # Sirve la versión compilada (prod)

# BACKEND
npm run ai-server:dev     # Inicia server en puerto 3001 (desarrollo con logs)
npm run ai-server:prod    # Inicia server en producción (sin logs)
npm run ai-server:build   # Compila TypeScript a JavaScript

# OTROS
npm run typecheck         # Verifica tipos de TypeScript
npm run clear             # Limpia caché de Docusaurus
```

---

## 📊 Cambios Recientes (Estilos)

El popup del chat ahora usa los **colores del template azul**:

- **Color primario:** `#3c6ab2` (Azul del template)
- **Color oscuro:** `#2556a3` (Variante más oscura)
- **Aplicado a:**
  - Botón flotante
  - Header del popup
  - Mensajes del usuario
  - Animaciones de tipeo
  - Botones de envío

---

## 🔒 Variables de Entorno

### Variables Disponibles en `.env.local`

| Variable | Requerida | Valor Ejemplo | Descripción |
|----------|-----------|---------------|----|
| `OPENAI_API_KEY` | ✅ Sí | `sk-proj-xxx` | API key de OpenAI |
| `NODE_ENV` | No | `development` | Ambiente: development/production |
| `PORT` | No | `3001` | Puerto del servidor backend |

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY no está configurada"

**Causa:** El archivo `.env.local` no existe o la clave no está configurada.

**Solución:**
1. Verifica que existe: `type .env.local` (Windows) o `cat .env.local` (Linux/Mac)
2. Asegúrate de que tiene: `OPENAI_API_KEY=sk-proj-xxxx`
3. Reinicia el servidor backend: `Ctrl+C` y `npm run ai-server:dev`

---

### Error: "Puerto 3000 o 3001 ya está en uso"

**Causa:** Otro proceso está usando ese puerto.

**Solución Windows:**
```bash
# Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número que apareció)
taskkill /PID <PID> /F
```

**Solución Linux/Mac:**
```bash
# Ver y matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# Cambiar puerto en .env.local
# Cambia: PORT=3002
```

---

### Chat no responde / Timeout

**Causas posibles:**
1. Backend no está ejecutándose
2. API key es inválida
3. Límite de rate limiting alcanzado

**Solución:**
1. Verifica que backend está corriendo: `curl http://localhost:3001/health`
2. Comprueba API key en platform.openai.com
3. Espera 60 segundos si alcanzaste el rate limit

---

### Estilos no se actualizan

**Causa:** Caché del navegador.

**Solución:**
```bash
# En el navegador
Ctrl+Shift+Delete  # Abre limpieza de caché
# O: Ctrl+F5 (Hard refresh)

# Desde terminal
npm run clear      # Limpia caché de Docusaurus
npm start          # Reinicia
```

---

## 📈 Para Producción

### Compilar para Producción

```bash
# Compilar documentación
npm run build

# Compilar backend
npm run ai-server:build
```

Esto genera:
- `build/` - Documentación estática
- `server.js` - Backend compilado

### Ejecutar en Producción

**Terminal 1 - Backend:**
```bash
NODE_ENV=production node server.js
```

**Terminal 2 - Frontend:**
```bash
npm run serve
```

O usar un gestor de procesos como **PM2**:

```bash
npm install -g pm2

# Iniciar ambos servidores
pm2 start "npm run ai-server:prod" --name "backend"
pm2 start "npm run serve" --name "frontend"

# Ver logs
pm2 logs

# Detener
pm2 stop all
```

---

## 📞 Soporte

Si tienes problemas:

1. **Verifica los logs:**
   - Backend: Mira la salida en Terminal 2
   - Frontend: Abre DevTools (`F12` → Console)

2. **Health check:**
   ```bash
   curl -v http://localhost:3001/health
   ```

3. **Prueba el endpoint de chat:**
   ```bash
   curl -X POST http://localhost:3001/api/openai/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Hola"}'
   ```

4. **Verifica que tengas Node 18+:**
   ```bash
   node --version
   ```

---

## ✨ Próximos Pasos

Una vez que todo está funcionando:

1. ✅ Lee la documentación en http://localhost:3000
2. ✅ Prueba el chat con diferentes preguntas
3. ✅ Integra el backend en tu aplicación
4. ✅ Despliega a producción

¡Listo! 🎉
