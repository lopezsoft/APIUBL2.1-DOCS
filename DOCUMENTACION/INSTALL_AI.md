# Instalación de Dependencias para Asistente AI

## Paso 1: Instalar dependencias npm

```bash
npm install express cors dotenv @aws-sdk/client-bedrock-runtime
npm install --save-dev @types/express @types/cors ts-node typescript
```

## Paso 2: Configurar variables de entorno

Crear o actualizar `.env.local`:

```env
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_BEDROCK_DEFAULT_MODEL=anthropic.claude-3-haiku-20240307-v1:0
```

## Paso 3: Actualizar package.json

Añadir estos scripts al section "scripts":

```json
{
  "scripts": {
    "dev": "npm run start:server & npm run dev:docs",
    "start:server": "ts-node server.ts",
    "dev:docs": "docusaurus start",
    "stop:server": "lsof -ti:3001 | xargs kill -9"
  }
}
```

O en Windows:

```json
{
  "scripts": {
    "dev": "start npm run start:server && npm run dev:docs",
    "start:server": "ts-node server.ts",
    "dev:docs": "docusaurus start"
  }
}
```

## Paso 4: Ejecutar

```bash
# Terminal 1: Iniciar el servidor Bedrock
npm run start:server

# Terminal 2: Iniciar Docusaurus
npm run dev:docs
```

O en una sola línea (con concurrently):

```bash
npm install --save-dev concurrently
```

Actualizar package.json:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run start:server\" \"npm run dev:docs\"",
    "start:server": "ts-node server.ts",
    "dev:docs": "docusaurus start"
  }
}
```

Luego:
```bash
npm run dev
```

## Verificar que funciona

Una vez en ejecución, probar:

```bash
curl http://localhost:3001/health
```

Debería devolver:
```json
{
  "status": "ok",
  "bedrock": "connected",
  "timestamp": "2024-10-17T..."
}
```

## Testear el chat

```bash
curl -X POST http://localhost:3001/api/bedrock/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuál es la estructura básica de una factura en APIUBL2.1?",
    "conversationHistory": []
  }'
```

## Solucionar Problemas

### Error: "Port 3001 already in use"
```bash
# Encontrar el proceso
lsof -i :3001

# Matarlo
kill -9 <PID>
```

### Error: "Cannot find module"
```bash
npm install
npm install @aws-sdk/client-bedrock-runtime --save
```

### Error: "AWS credentials not configured"
- Verificar `.env.local`
- Verificar que las claves no tengan espacios en blanco
- Ejecutar: `echo $AWS_ACCESS_KEY_ID` (debe mostrar la clave)

## Próximas Integraciones

1. ✅ Componente React AIAssistant.tsx
2. ✅ Servidor Express con Bedrock
3. ⏳ Agregar a documentación (próximo paso)
4. ⏳ RAG con embeddings
5. ⏳ Analytics y feedback
