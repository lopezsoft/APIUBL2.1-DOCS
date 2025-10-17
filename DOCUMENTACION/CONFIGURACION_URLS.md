# ⚙️ Configuración de URLs del Backend

## 📝 Overview

Las URLs del backend ahora se configuran mediante **variables de entorno** en `.env.local`, permitiendo diferentes URLs para desarrollo y producción.

---

## 🔧 Configuración

### 1. Archivo `.env.local.example`

Plantilla con todas las variables disponibles:

```env
# URL del servidor backend (desarrollo)
REACT_APP_API_BACKEND_DEV=http://localhost:3001

# URL del servidor backend (producción)
REACT_APP_API_BACKEND_PROD=https://api.matias-api.com

# URL del endpoint de chat
REACT_APP_API_CHAT_ENDPOINT=/api/openai/chat

# URL del health check
REACT_APP_API_HEALTH_CHECK=/health

# Ambiente: development, production, staging
REACT_APP_ENV=development

# Timeout para requests (ms)
REACT_APP_API_TIMEOUT=30000

# OpenAI API Key (solo para backend)
OPENAI_API_KEY=sk-proj-tu-clave-aqui

# Node Environment
NODE_ENV=development

# Puerto del backend
PORT=3001
```

### 2. Archivo `.env.local` (en tu máquina)

Copia `.env.local.example` a `.env.local` y personaliza:

```bash
# Copiar template
cp .env.local.example .env.local

# Editar con tu editor favorito
code .env.local
```

---

## 📚 Configuración Centralizada

### Archivo: `src/config/api.ts`

Centraliza toda la lógica de URLs:

```typescript
export const BACKEND_URL = isProduction ? BACKEND_PROD : BACKEND_DEV;

export const API_ENDPOINTS = {
  CHAT: `${BACKEND_URL}/api/openai/chat`,
  HEALTH: `${BACKEND_URL}/health`,
  BEDROCK: `${BACKEND_URL}/api/bedrock/chat`,
};

export const API_CONFIG = {
  TIMEOUT: 30000,
  HEADERS: { 'Content-Type': 'application/json' },
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

---

## 🎯 Uso en Componentes

### AIChat Component

```typescript
import { API_ENDPOINTS } from '../../config/api';

const AIChat = memo(
  ({
    endpoint = API_ENDPOINTS.CHAT,  // ← Usa configuración
    maxHistorySize = 20,
    onError,
  }: AIChatProps) => {
    // ...
  }
);
```

### Resultado

El componente ahora usa automáticamente la URL correcta según el ambiente:

| Ambiente | URL |
|----------|-----|
| **Desarrollo** | `http://localhost:3001/api/openai/chat` |
| **Producción** | `https://api.matias-api.com/api/openai/chat` |

---

## 🌐 Ambientes

### Desarrollo

```bash
NODE_ENV=development
REACT_APP_API_BACKEND_DEV=http://localhost:3001
```

### Producción

```bash
NODE_ENV=production
REACT_APP_API_BACKEND_PROD=https://api.matias-api.com
```

### Staging (Opcional)

```bash
NODE_ENV=staging
REACT_APP_API_BACKEND_STAGING=https://staging-api.matias-api.com
```

---

## 🔐 Variables Seguras

**⚠️ IMPORTANTE:**

- **`.env.local`** está en `.gitignore` (no se sube a Git)
- Nunca compartir `.env.local` con tu API key
- Solo exponer variables `REACT_APP_*` al frontend
- `OPENAI_API_KEY` debe estar en el backend (server.ts), no en el frontend

---

## ✅ Verificación

### 1. Health Check (Backend activo)

```bash
curl http://localhost:3001/health
```

Respuesta:
```json
{
  "status": "ok",
  "service": "OpenAI GPT-4o Mini",
  "environment": { "model": "gpt-4o-mini" }
}
```

### 2. Chat Endpoint (Backend activo)

```bash
curl -X POST http://localhost:3001/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Hola?",
    "conversationHistory": []
  }'
```

Respuesta:
```json
{
  "response": "Hola! ¿En qué puedo ayudarte?",
  "usage": { "prompt_tokens": 50, "completion_tokens": 10, "total_tokens": 60 }
}
```

### 3. Debug Mode (Desarrollo)

Con `NODE_ENV=development`, se ven los logs de configuración:

```
🔧 API Configuration:
  Ambiente: development
  Backend URL: http://localhost:3001
  Chat Endpoint: http://localhost:3001/api/openai/chat
  Health Endpoint: http://localhost:3001/health
```

---

## 🚀 Deploy en Producción

### 1. Configurar `.env.local` en Servidor

```env
NODE_ENV=production
REACT_APP_API_BACKEND_PROD=https://api.matias-api.com
OPENAI_API_KEY=sk-proj-xxxxx
PORT=3001
```

### 2. Build

```bash
npm run build
```

### 3. Ejecutar

```bash
npm run ai-server:prod
npm run serve
```

---

## 📊 Variables Disponibles

| Variable | Desarrollo | Producción | Descripción |
|----------|-----------|-----------|----------|
| `NODE_ENV` | development | production | Ambiente de ejecución |
| `REACT_APP_API_BACKEND_DEV` | `http://localhost:3001` | N/A | URL backend desarrollo |
| `REACT_APP_API_BACKEND_PROD` | N/A | `https://api...` | URL backend producción |
| `REACT_APP_API_CHAT_ENDPOINT` | `/api/openai/chat` | `/api/openai/chat` | Endpoint de chat |
| `REACT_APP_API_HEALTH_CHECK` | `/health` | `/health` | Endpoint health |
| `REACT_APP_API_TIMEOUT` | 30000 | 30000 | Timeout (ms) |
| `OPENAI_API_KEY` | (secret) | (secret) | API key OpenAI |
| `PORT` | 3001 | 3001 | Puerto backend |

---

## 🔄 Flujo de Configuración

```
┌─────────────────────────────────────────────┐
│ 1. .env.local (usuario local)               │
│    REACT_APP_API_BACKEND_DEV=localhost:3001 │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 2. src/config/api.ts (centralizado)         │
│    - Lee variables de entorno               │
│    - Detecta ambiente (dev/prod)            │
│    - Construye URLs finales                 │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 3. AIChat Component                         │
│    endpoint={API_ENDPOINTS.CHAT}            │
│    "http://localhost:3001/api/openai/chat"  │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 4. Fetch HTTP                               │
│    POST http://localhost:3001/api/openai... │
│    Respuesta: { response: "..." }           │
└─────────────────────────────────────────────┘
```

---

## 💡 Tips

### Cambiar URL rápidamente

Edita `.env.local`:
```env
# Para testing con backend remoto
REACT_APP_API_BACKEND_DEV=https://api-testing.example.com
```

### Agregar nuevo endpoint

En `src/config/api.ts`:
```typescript
export const API_ENDPOINTS = {
  CHAT: `${BACKEND_URL}/api/openai/chat`,
  HEALTH: `${BACKEND_URL}/health`,
  NEW_ENDPOINT: `${BACKEND_URL}/api/nuevo`, // ← Agregar aquí
};
```

### Debug de URLs

En desarrollo, mira la consola:
```
🔧 API Configuration:
  Backend URL: http://localhost:3001
  Chat Endpoint: http://localhost:3001/api/openai/chat
```

---

## ❓ FAQ

### ¿Por qué `.env.local.example` pero no `.env.local`?

- `.env.local` está en `.gitignore` (seguridad)
- `.env.local.example` es una plantilla compartida
- Cada developer crea su propio `.env.local` localmente

### ¿Cómo cambiar el backend en producción?

1. SSH al servidor
2. Editar `.env.local` en el servidor
3. Restart del backend: `npm run ai-server:prod`

### ¿Puedo tener múltiples ambientes?

Sí, crea archivos separados:
```
.env.local          ← Desarrollo
.env.local.staging  ← Staging
.env.local.prod     ← Producción
```

---

**¡Configuración lista! 🎉**

*Última actualización: Octubre 17, 2025*
