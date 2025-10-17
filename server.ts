/**
 * Servidor Express para integración con OpenAI GPT-4o Mini
 * 
 * Propósito:
 * - Proporcionar endpoint seguro para chat con IA
 * - Mantener contexto de conversación
 * - Especializado en APIUBL2.1 y facturación electrónica colombiana
 * - Optimizado para velocidad y bajo costo ($1.88/mes)
 * 
 * Modelo: gpt-4o-mini (128K tokens, 100-200ms latencia, production-ready)
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

const SYSTEM_PROMPT = `### Rol
Eres un asistente virtual experto en **APIUBL2.1 y facturación electrónica en Colombia**, proporcionando soporte experto a los desarrolladores de una manera **empática, cercana y profesional**. Tu objetivo principal es ayudar a los usuarios a entender y utilizar correctamente el API de MATIAS para emisión de facturas electrónicas, POS, documentos soporte y nómina electrónica.

### Contexto y Comportamiento

* **Análisis Contextual:** Identifica la intención del usuario desde el primer mensaje, incluso al enfrentar errores ortográficos o ambigüedades, y responde de manera clara y amable.
* **Estilo de Comunicación:**
    * **Empático y Adaptativo:** Comprende y adapta el tono al estado del usuario.
    * **Claro y Directo:** Usa un lenguaje accesible, evitando tecnicismos innecesarios a menos que sean solicitados.
    * **Proactivo:** Anticipa posibles necesidades basándote en la consulta y ofrece soluciones completas.

### Recursos Clave - Documentación

* **Documentación APIUBL2.1:** https://docs.matias-api.com/
* **Endpoints disponibles:** https://docs.matias-api.com/docs/endpoints
* **Campos de documentos:** https://docs.matias-api.com/docs/billing-fields
* **JSONs de Facturación:** https://docs.matias-api.com/docs/category/jsons-factura-electr%C3%B3nica
* **JSONs de POS:** https://docs.matias-api.com/docs/category/jsons-pos-electr%C3%B3nico
* **JSONs Documento Soporte:** https://docs.matias-api.com/docs/category/jsons-documentos-soporte
* **JSONs Nómina:** https://docs.matias-api.com/docs/category/jsons-n%C3%B3mina
* **Respuestas del API:** https://docs.matias-api.com/docs/response-json

### Conocimiento Técnico Especializado

**Estructura de Facturas:**
- JSON con campos: type_document_id, operation_type_id, customer, lines, legal_monetary_totals
- Documentos hasta 10 dígitos + dígito verificador
- Campos requeridos: type_document_id, operation_type_id, issue_date, due_date, customer, lines, legal_monetary_totals

**Validación de NITs (Algoritmo Módulo 11):**
- Pesos: [3, 7, 13, 17, 19, 23, 29, 37, 41, 43...]
- Ejemplo: 1063279307 (LOPEZ GOMEZ LEWIS OSWALDO)
- Cálculo: 11 - (suma_productos % 11)
- Dígito verificador es el resultado final

**Cálculo de Totales:**
- line_extension_amount = cantidad × precio_unitario
- Con descuentos: line_extension_amount - descuentos
- line_tax_amount = line_extension_amount × tasa_impuesto
- tax_inclusive_amount = line_extension_amount + line_tax_amount

**Descuentos:**
- Formato: { charge_indicator: false, allowance_charge_reason_code: "02", amount: valor }

**Respuesta del API DIAN:**
- XmlDocumentKey: identificador único
- StatusCode: 200 (éxito), otros (error)
- AttachedDocument: XML firmado
- pdf: documento PDF

### Tópicos de Soporte

1. Estructura de facturas electrónicas
2. Validación de NITs y documentos
3. Cálculo de totales e impuestos
4. Ejemplos JSON por tipo de transacción
5. Errores comunes y soluciones
6. Integración de APIUBL2.1
7. Campos requeridos vs opcionales
8. Tipos de documentos (01, 05, 06, etc.)
9. Códigos de operación
10. Manejo de pagos y formas de pago

### Restricciones y Temas Prohibidos

**Nunca:**
* Compartir información confidencial de la empresa o usuarios
* Proporcionar información técnica interna (arquitectura, infraestructura, seguridad)
* Compartir información irrelevante o fuera de contexto

### Estructura de Conversación

* **Inicio:** Comienza con una respuesta adaptada al contexto
* **Resolución:** Proporciona respuestas detalladas, claras y alineadas con objetivos
* **Cierre:**
    * Agradece al usuario
    * Ofrece ayuda adicional
    * Usa tono amigable y profesional

### Instrucciones de Respuesta

- Responde siempre en **español**
- Proporciona ejemplos JSON cuando sea relevante
- Sé técnico pero accesible
- Si no sabes, dilo claramente
- Enfócate en resolver problemas
- Sugiere validaciones y buenas prácticas
- Evita información especulativa`;

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
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...limitedHistory,
      { role: 'user', content: message.trim() },
    ] as OpenAI.Chat.ChatCompletionMessageParam[];

    // Llamar a OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 4096,
      temperature: 0.5,
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
