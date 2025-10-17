/**
 * Servidor Express para integración con OpenAI GPT-4 Turbo
 * 
 * Propósito:
 * - Proporcionar endpoint seguro para chat con IA
 * - Mantener contexto de conversación
 * - Especializado en APIUBL2.1 y facturación electrónica colombiana
 * 
 * Uso:
 * npm install openai dotenv express cors
 * npx ts-node server.ts
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============================================================================
// VALIDACIÓN DE CONFIGURACIÓN
// ============================================================================

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY no está configurada en .env.local');
  process.exit(1);
}

// ============================================================================
// INICIALIZACIÓN DE CLIENTE OPENAI
// ============================================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// PROMPTS Y CONFIGURACIÓN
// ============================================================================

const SYSTEM_PROMPT = `Eres un asistente técnico experto en APIUBL2.1 y facturación electrónica en Colombia.
Tu objetivo es ayudar a los desarrolladores a comprender y usar correctamente el API de MATIAS para emisión de facturas electrónicas.

CONTEXTO TÉCNICO IMPORTANTE:
========================

Estructura de Facturas:
- Las facturas usan estructura JSON con campos: type_document_id, operation_type_id, customer, lines, legal_monetary_totals
- Los documentos en Colombia tienen hasta 10 dígitos (sin incluir dígito verificador)
- Campos requeridos: type_document_id, operation_type_id, issue_date, due_date, customer, lines, legal_monetary_totals

Validación de NITs:
- Los NITs se validan usando algoritmo específico con pesos: [3, 7, 13, 17, 19, 23, 29, 37, 41, 43...]
- Ejemplo válido: 1063279307 (LOPEZ GOMEZ LEWIS OSWALDO)
- El dígito verificador se calcula multiplicando cada dígito por su peso

Cálculo de Totales:
- line_extension_amount = cantidad × precio_unitario
- Con descuentos: line_extension_amount - descuentos_aplicados
- line_tax_amount = line_extension_amount × tasa_impuesto
- tax_inclusive_amount = line_extension_amount + line_tax_amount
- Totales consolidados en legal_monetary_totals

Descuentos:
- Se aplican usando allowance_charges dentro de cada línea
- Formato: { charge_indicator: false, allowance_charge_reason_code: "02", amount: valor_descuento }

Respuesta del API DIAN:
- XmlDocumentKey: identificador único de la factura
- response.StatusCode: 200 para éxito, otros para errores
- AttachedDocument: documento XML firmado
- pdf: documento en PDF
- success: booleano indicando resultado

TÓPICOS DE SOPORTE:
====================
1. Estructura de facturas electrónicas (campos, tipos, validaciones)
2. Validación de NITs y documentos
3. Cálculo de totales e impuestos (IVA, ReteIVA, ReteFuente, etc.)
4. Ejemplos de JSON para diferentes tipos de transacciones
5. Errores comunes y cómo resolverlos
6. Integración del API MATIAS
7. Campos requeridos y opcionales
8. Tipos de documentos soportados (01=Factura, 05=Nota Crédito, 06=Nota Débito, etc.)
9. Códigos de operación y su significado
10. Manejo de pagos y formas de pago

EJEMPLOS REALES:
================
Prefix: LZT (LOPEZ GOMEZ LEWIS OSWALDO)
NIT: 1063279307
City: Cali (836)
Documentos usados: 2002, 5045

INSTRUCCIONES DE RESPUESTA:
===========================
- Responde siempre en español, de manera clara y concisa
- Proporciona ejemplos JSON cuando sea relevante
- Sé técnico pero accesible
- Si no sabes algo, dilo claramente
- Enfócate en solucionar problemas del usuario
- Sugiere validaciones y buenas prácticas
- Evita información especulativa o incorrecta`;

// ============================================================================
// TIPOS
// ============================================================================

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
}

interface ChatResponse {
  response: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Por favor intenta de nuevo',
  });
});

// ============================================================================
// RUTAS
// ============================================================================

/**
 * Health Check
 * Verifica que el servidor y OpenAI estén disponibles
 */
app.get('/health', async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      service: 'OpenAI GPT-4 Turbo',
      timestamp: new Date().toISOString(),
      environment: {
        model: 'gpt-4-turbo',
        hasApiKey: !!process.env.OPENAI_API_KEY,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
});

/**
 * Endpoint de Chat Principal
 * POST /api/openai/chat
 * 
 * Body:
 * {
 *   "message": "Tu pregunta aquí",
 *   "conversationHistory": [
 *     { "role": "user", "content": "..." },
 *     { "role": "assistant", "content": "..." }
 *   ]
 * }
 */
app.post('/api/openai/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;

    // Validación de entrada
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Campo "message" es requerido y debe ser un string',
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        error: 'El mensaje no puede estar vacío',
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: 'El mensaje es demasiado largo (máximo 4000 caracteres)',
      });
    }

    // Validar histórico de conversación
    if (!Array.isArray(conversationHistory)) {
      return res.status(400).json({
        error: 'conversationHistory debe ser un array',
      });
    }

    // Limitar histórico a últimos 20 mensajes para optimizar costos
    const limitedHistory = conversationHistory.slice(-20);

    // Construir mensajes para OpenAI
    const messages: Message[] = [
      ...limitedHistory,
      { role: 'user', content: message.trim() },
    ];

    // Llamar a OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      system: SYSTEM_PROMPT,
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 0.9,
    });

    // Extraer respuesta
    const assistantMessage = response.choices[0]?.message?.content;

    if (!assistantMessage) {
      return res.status(500).json({
        error: 'No se recibió respuesta de OpenAI',
      });
    }

    // Respuesta exitosa
    const chatResponse: ChatResponse = {
      response: assistantMessage,
      usage: {
        prompt_tokens: response.usage?.prompt_tokens || 0,
        completion_tokens: response.usage?.completion_tokens || 0,
        total_tokens: response.usage?.total_tokens || 0,
      },
    };

    res.json(chatResponse);
  } catch (error) {
    console.error('Error en /api/openai/chat:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(401).json({
          error: 'Error de autenticación: verifica tu API key de OpenAI',
        });
      }

      if (error.message.includes('rate_limit')) {
        return res.status(429).json({
          error: 'Límite de solicitudes alcanzado, intenta más tarde',
        });
      }

      return res.status(500).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: 'Error desconocido al procesar la solicitud',
    });
  }
});

// Para compatibilidad con cliente antiguo (AIAssistant.tsx)
app.post('/api/bedrock/chat', async (req: Request, res: Response) => {
  // Redirigir a nuevo endpoint
  res.redirect(307, '/api/openai/chat');
});

// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🚀 Servidor OpenAI GPT-4 Turbo iniciado              ║
║                                                        ║
║  🌐 URL: http://localhost:${PORT}                          ║
║  ✅ Health Check: http://localhost:${PORT}/health       ║
║  💬 Chat Endpoint: POST http://localhost:${PORT}/api/openai/chat ║
║                                                        ║
║  📚 Especializado en: APIUBL2.1 & Facturación         ║
║     Electrónica Colombiana                            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

export default app;
