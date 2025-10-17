/**
 * Servidor Express para integración con Amazon Bedrock
 * 
 * Uso:
 * npm install express cors dotenv @aws-sdk/client-bedrock-runtime
 * npx ts-node server.ts
 * 
 * O compilado:
 * npx tsc server.ts
 * node server.js
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Verificar que las credenciales estén disponibles
if (!process.env.AWS_REGION || !process.env.AWS_BEDROCK_DEFAULT_MODEL) {
  console.error('❌ Error: Falta configurar AWS_REGION o AWS_BEDROCK_DEFAULT_MODEL en .env.local');
  process.exit(1);
}

// Importar dinámicamente el cliente de Bedrock (solo si está disponible)
let bedrockClient: any = null;
let BedrockRuntimeClient: any = null;
let InvokeModelCommand: any = null;

async function initBedrock() {
  try {
    const bedrock = await import('@aws-sdk/client-bedrock-runtime');
    BedrockRuntimeClient = bedrock.BedrockRuntimeClient;
    InvokeModelCommand = bedrock.InvokeModelCommand;
    
    bedrockClient = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-west-2',
    });
    
    console.log('✅ Cliente Bedrock inicializado correctamente');
  } catch (error) {
    console.error('⚠️ Advertencia: No se pudo cargar AWS SDK:', error);
    console.log('Instala con: npm install @aws-sdk/client-bedrock-runtime');
  }
}

const SYSTEM_PROMPT = `Eres un asistente técnico experto en APIUBL2.1 y facturación electrónica en Colombia. 
Tu objetivo es ayudar a los desarrolladores a comprender y usar correctamente el API de MATIAS para emisión de facturas electrónicas.

Contexto técnico importante:
- Las facturas usan estructura JSON con campos como: type_document_id, operation_type_id, customer, lines, legal_monetary_totals
- Los documentos en Colombia tienen hasta 10 dígitos (sin incluir dígito verificador)
- Los descuentos se aplican usando allowance_charges dentro de cada línea
- Los totales deben calcularse como: line_extension_amount (cantidad × precio - descuentos) + impuestos
- Los NITs se validan usando un algoritmo específico con pesos: [3, 7, 13, 17, 19, 23, 29, 37, 41, 43...]

Tópicos que puedes ayudar:
1. Estructura de facturas electrónicas
2. Validación de NITs y documentos
3. Cálculo de totales e impuestos (IVA, ReteIVA, etc.)
4. Ejemplos de JSON para diferentes tipos de transacciones
5. Errores comunes y cómo resolverlos
6. Integración del API MATIAS
7. Campos requeridos y opcionales
8. Tipos de documentos soportados

Responde siempre en español, de manera clara y concisa.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
}

// Ruta para health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    bedrock: bedrockClient ? 'connected' : 'not_initialized',
    timestamp: new Date().toISOString(),
  });
});

// Ruta principal de chat
app.post('/api/bedrock/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    if (!bedrockClient) {
      return res.status(503).json({
        error: 'Bedrock service not available. Install @aws-sdk/client-bedrock-runtime',
      });
    }

    // Limitar el historial
    const limitedHistory = conversationHistory.slice(-10);

    // Preparar mensajes
    const messages: Message[] = [
      ...limitedHistory,
      { role: 'user', content: message },
    ];

    // Llamar a Bedrock
    const command = new InvokeModelCommand({
      modelId: process.env.AWS_BEDROCK_DEFAULT_MODEL,
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-06-01',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      }),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const assistantMessage = responseBody.content[0]?.text || '';

    return res.json({
      response: assistantMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

// Inicializar y arrancar servidor
async function start() {
  await initBedrock();
  
  app.listen(PORT, () => {
    console.log(`
🚀 Bedrock Chat Server iniciado en puerto ${PORT}
📍 Health check: http://localhost:${PORT}/health
💬 Chat API: POST http://localhost:${PORT}/api/bedrock/chat

Esperando conexiones...
    `);
  });
}

start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export default app;
