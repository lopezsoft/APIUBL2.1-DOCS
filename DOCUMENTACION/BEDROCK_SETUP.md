# Configuración del Asistente AI con Amazon Bedrock

## Requisitos Previos

1. **Cuenta AWS** con acceso a Amazon Bedrock
2. **Node.js 18+**
3. **Credenciales AWS** configuradas

## Instalación

### 1. Instalar dependencias de AWS SDK

```bash
npm install @aws-sdk/client-bedrock-runtime
npm install --save-dev @types/node
```

### 2. Crear servidor Express para Bedrock

```bash
npm install express cors dotenv
```

### 3. Configurar variables de entorno

Crear `.env.local` (reemplaza con tus credenciales AWS reales):

```env
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_BEDROCK_DEFAULT_MODEL=anthropic.claude-3-haiku-20240307-v1:0
```

⚠️ **IMPORTANTE:** Nunca commitees credenciales reales a git. Usa `.env.local` ignorado en `.gitignore`.

## Estructura del Proyecto

```
APIUBL2.1-DOCS/
├── src/components/Interactive/
│   ├── AIAssistant.tsx           # Componente React del chatbot
│   └── AIAssistant.module.css    # Estilos
├── server/
│   ├── bedrock.ts               # Cliente Bedrock
│   └── express-server.ts        # Servidor Express
├── .env.local                   # Variables de entorno
└── package.json
```

## Implementación en Pasos

### Paso 1: Crear servidor Bedrock

```typescript
// server/bedrock.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export async function chatWithBedrock(message: string, history: Array<{role: string, content: string}>) {
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
  
  const command = new InvokeModelCommand({
    modelId: process.env.AWS_BEDROCK_DEFAULT_MODEL,
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-06-01",
      max_tokens: 1024,
      system: "Eres un asistente experto en APIUBL2.1...",
      messages: [...history, { role: "user", content: message }],
    }),
  });

  const response = await client.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body));
  
  return body.content[0].text;
}
```

### Paso 2: Crear servidor Express

```typescript
// server/express-server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatWithBedrock } from './bedrock';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/bedrock/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const response = await chatWithBedrock(message, conversationHistory);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Bedrock API running on port ${PORT}`);
});
```

### Paso 3: Actualizar package.json

```json
{
  "scripts": {
    "dev": "concurrently \"npm run start:server\" \"npm run dev:docs\"",
    "start:server": "ts-node server/express-server.ts",
    "dev:docs": "docusaurus start"
  }
}
```

### Paso 4: Integrar en Docusaurus

En cualquier página `.md` o `.mdx`:

```mdx
import AIAssistant from '@site/src/components/Interactive/AIAssistant';

<AIAssistant />
```

## Usar el Componente

### En un documento MDX:

```mdx
---
title: Soporte Técnico
---

# Centro de Ayuda Técnica

¿Tienes preguntas sobre APIUBL2.1? Nuestro asistente AI está aquí para ayudarte.

<AIAssistant />
```

### En una página dedicada:

Crear `docs/support/ai-assistant.md`:

```markdown
---
sidebar_position: 1
title: Asistente AI
---

# 🤖 Asistente Técnico AI

Obtén respuestas instantáneas a tus preguntas técnicas sobre APIUBL2.1.

<AIAssistant />
```

## Configuración en AWS

### 1. Verificar acceso a Bedrock

```bash
aws bedrock list-foundation-models --region us-west-2
```

### 2. Crear un rol IAM (si no existe)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:GetFoundationModel"
      ],
      "Resource": "arn:aws:bedrock:*:*:foundation-model/*"
    }
  ]
}
```

### 3. Testear la conexión

```bash
npm install -g @aws-cli/v2
aws bedrock invoke-model \
  --model-id anthropic.claude-3-haiku-20240307-v1:0 \
  --region us-west-2 \
  --body '{"prompt":"Hello","max_tokens_to_sample":100}' \
  response.json
```

## Costos Estimados

- **Haiku (recomendado)**: ~$0.25 por 1M tokens de input, $1.25 por 1M tokens de output
- **Sonnet**: $3 por 1M tokens de input, $15 por 1M tokens de output
- **Opus**: $15 por 1M tokens de input, $75 por 1M tokens de output

Para un uso moderado (100 chats/día, ~500 tokens c/u):
- **~$3-5 USD mensuales** (usando Haiku)

## Troubleshooting

### Error: "Cannot find module '@aws-sdk/client-bedrock-runtime'"

```bash
npm install @aws-sdk/client-bedrock-runtime
```

### Error: "Access Denied" en Bedrock

- Verificar credenciales AWS en `.env.local`
- Verificar que el modelo está disponible en la región
- Verificar permisos IAM

### Error: "Model not found"

Usar modelo correcto:
- `anthropic.claude-3-haiku-20240307-v1:0` (Haiku - Rápido, barato)
- `anthropic.claude-3-sonnet-20240229-v1:0` (Sonnet - Balanceado)
- `anthropic.claude-3-opus-20240229-v1:0` (Opus - Poderoso)

## Próximas Mejoras

- [ ] Agregar RAG (Retrieval-Augmented Generation) con documentos
- [ ] Implementar feedback de usuario para mejora continua
- [ ] Agregar seguimiento de sesiones en base de datos
- [ ] Integrar con Amazon S3 para almacenar documentos
- [ ] Crear dashboard de analytics

## Soporte

Para problemas o preguntas:
- AWS Bedrock: https://docs.aws.amazon.com/bedrock/
- Amazon Claude: https://www.anthropic.com/
- Docusaurus: https://docusaurus.io/
