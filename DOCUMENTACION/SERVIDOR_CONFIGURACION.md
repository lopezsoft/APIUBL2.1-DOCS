# Configuración del Servidor OpenAI GPT-4o Mini

## 📋 Requisitos Previos

- **Node.js**: v18.0 o superior
- **npm**: v9.0 o superior
- **API Key OpenAI**: Generada desde [platform.openai.com](https://platform.openai.com)

Verifica tu versión:
```bash
node --version
npm --version
```

---

## 🚀 Configuración del Entorno

### 1. Crear archivo `.env.local`

En la raíz del proyecto, crea el archivo `.env.local`:

```bash
# .env.local
OPENAI_API_KEY=sk-proj-tu-api-key-aqui
NODE_ENV=development
PORT=3001
```

**Variables disponibles:**
- `OPENAI_API_KEY`: Tu API key de OpenAI (REQUERIDA)
- `NODE_ENV`: `development` o `production`
- `PORT`: Puerto del servidor (default: 3001)

### 2. No compartir `.env.local`

Asegúrate de que `.env.local` está en `.gitignore`:

```bash
# .gitignore
.env.local
.env
node_modules/
dist/
build/
```

---

## 💻 Desarrollo Local

### Opción 1: Ejecutar TypeScript directamente (Recomendado)

```bash
npm run ai-server:dev
```

**Ventajas:**
- Hot reload automático
- Logs detallados
- Mejor para debugging
- Recarga instantánea al guardar cambios

**Salida esperada:**
```
╔════════════════════════════════════════════════════════╗
║  🚀 Servidor OpenAI GPT-4o Mini iniciado              ║
║  🌐 URL: http://localhost:3001                        ║
║  ✅ Health Check: http://localhost:3001/health        ║
║  💬 Chat Endpoint: POST http://localhost:3001/...     ║
╚════════════════════════════════════════════════════════╝
```

### Opción 2: Ejecutar con ts-node

```bash
npm run ai-server
```

O simplemente:

```bash
ts-node server.ts
```

### Verificar que funciona

En otra terminal:

```bash
# Health check
curl http://localhost:3001/health

# Respuesta esperada:
# {
#   "status": "ok",
#   "service": "OpenAI GPT-4o Mini",
#   "timestamp": "2025-01-15T10:30:45.123Z",
#   "environment": {
#     "model": "gpt-4o-mini",
#     "hasApiKey": true
#   }
# }
```

---

## 📦 Producción

### 1. Compilar TypeScript a JavaScript

```bash
npm run ai-server:build
```

Esto genera `server.js` optimizado para producción.

### 2. Ejecutar en Producción

```bash
npm run ai-server:prod
```

O directamente:

```bash
NODE_ENV=production node server.js
```

**Diferencias con desarrollo:**
- Sin logs verbosos
- Mejor manejo de errores
- Optimizado para velocidad
- Menor consumo de recursos

---

## 🎯 Ambos Servidores Simultáneamente

Si necesitas que corra el frontend Docusaurus Y el servidor OpenAI:

### Terminal 1 - Frontend (Docusaurus)

```bash
npm start
# Se abre en http://localhost:3000
```

### Terminal 2 - Backend (OpenAI)

```bash
npm run ai-server:dev
# Corre en http://localhost:3001
```

El frontend Docusaurus se conectará automáticamente al backend en `http://localhost:3001/api/openai/chat`.

---

## 🔧 Endpoints Disponibles

### Health Check
```bash
GET http://localhost:3001/health

Respuesta:
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

### Chat Principal
```bash
POST http://localhost:3001/api/openai/chat

Body:
{
  "message": "¿Cómo valido un NIT?",
  "conversationHistory": [
    { "role": "user", "content": "Hola" },
    { "role": "assistant", "content": "Hola! ¿En qué puedo ayudarte?" }
  ]
}

Respuesta:
{
  "response": "Para validar un NIT en Colombia usamos el algoritmo módulo 11...",
  "usage": {
    "prompt_tokens": 1250,
    "completion_tokens": 450,
    "total_tokens": 1700
  }
}
```

### Compatibilidad (Legacy)
```bash
POST http://localhost:3001/api/bedrock/chat
# Se redirige a /api/openai/chat (Legacy support)
```

---

## 📊 Variables de Configuración

### En Producción

Para deployments en servidor:

```bash
# Railway, Heroku, Vercel, etc.
export NODE_ENV=production
export PORT=8080
export OPENAI_API_KEY=sk-proj-xxxxx
node server.js
```

### Docker (Opcional)

Si quieres containerizar el servidor:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js .

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server.js"]
```

Construir y ejecutar:
```bash
docker build -t matias-ai-server .
docker run -e OPENAI_API_KEY=sk-proj-xxxxx -p 3001:3001 matias-ai-server
```

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY no está configurada"

**Solución:**
1. Verifica que existe `.env.local` en la raíz
2. Asegúrate de que tiene tu API key correcta
3. Reinicia el servidor: `Ctrl+C` y vuelve a ejecutar

```bash
# Verificar que la variable existe
echo $OPENAI_API_KEY  # En Linux/Mac
echo %OPENAI_API_KEY%  # En Windows
```

### Puerto 3001 ya está en uso

**Solución:**
```bash
# Cambiar puerto en .env.local
PORT=3002

# O matar proceso en puerto 3001
lsof -ti:3001 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :3001    # Windows (busca PID y usa: taskkill /PID xxx /F)
```

### Errores de CORS

Si el frontend no se conecta:

1. Verifica que ambos servidores están corriendo
2. Comprueba que el frontend usa `http://localhost:3001` (no `localhost:3000`)
3. El servidor tiene CORS habilitado para `*` (todos los orígenes)

```bash
# Probar CORS con curl
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     http://localhost:3001/health
```

### Rate limit de OpenAI

Si ves errores de "rate_limit":
- Espera 60 segundos
- Reduce la velocidad de requests
- Verifica tu plan en platform.openai.com

---

## 📈 Monitoreo en Producción

### Health Check periódico

```bash
# Cada 30 segundos
watch -n 30 'curl -s http://localhost:3001/health | jq .'
```

### Logs en archivo

Modificar `server.ts`:
```typescript
import fs from 'fs';

const logStream = fs.createWriteStream('server.log', { flags: 'a' });

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  logStream.write(`[${timestamp}] ${req.method} ${req.path}\n`);
  next();
});
```

### Métricas de uso

El endpoint `/api/openai/chat` retorna:
```json
{
  "response": "...",
  "usage": {
    "prompt_tokens": 1250,
    "completion_tokens": 450,
    "total_tokens": 1700
  }
}
```

Usa esto para calcular costos:
- **gpt-4o-mini**: $0.15 por 1M tokens input, $0.60 por 1M tokens output
- Costo promedio: ~$0.002 por interacción

---

## ✅ Checklist Pre-Producción

- [ ] Archivo `.env.local` configurado con API key correcta
- [ ] `.env.local` está en `.gitignore`
- [ ] `npm run ai-server:build` ejecutado sin errores
- [ ] Health check responde correctamente
- [ ] Chat endpoint funciona con `curl` o Postman
- [ ] Frontend Docusaurus se conecta correctamente
- [ ] Logs están siendo registrados
- [ ] Puerto 3001 no entra en conflicto
- [ ] OPENAI_API_KEY tiene permisos suficientes
- [ ] Rate limits configurados en OpenAI dashboard

---

## 📚 Referencias Adicionales

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [GPT-4o Mini Models](https://platform.openai.com/docs/models/gpt-4o-mini)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)
