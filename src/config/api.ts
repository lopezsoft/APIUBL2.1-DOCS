/**
 * Configuración del API
 * 
 * Centraliza todas las URLs y endpoints del backend
 * Permite cambiar fácilmente entre desarrollo y producción
 */

// Detectar ambiente (desarrollo vs producción)
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// URLs del backend
const BACKEND_DEV = process.env.REACT_APP_API_BACKEND_DEV || 'http://localhost:3001';
const BACKEND_PROD = process.env.REACT_APP_API_BACKEND_PROD || 'https://api.matias-api.com';

// Seleccionar URL del backend según ambiente
export const BACKEND_URL = isProduction ? BACKEND_PROD : BACKEND_DEV;

// Endpoints
export const API_ENDPOINTS = {
  /**
   * Endpoint para chat con IA
   * POST /api/openai/chat
   * Body: { message: string, conversationHistory: Message[] }
   * Response: { response: string, usage: { prompt_tokens, completion_tokens, total_tokens } }
   */
  CHAT: `${BACKEND_URL}${process.env.REACT_APP_API_CHAT_ENDPOINT || '/api/openai/chat'}`,

  /**
   * Endpoint para verificar estado del servidor
   * GET /health
   * Response: { status: string, service: string, model: string }
   */
  HEALTH: `${BACKEND_URL}${process.env.REACT_APP_API_HEALTH_CHECK || '/health'}`,

  /**
   * Endpoint legacy (compatibilidad)
   * POST /api/bedrock/chat (se redirige a /api/openai/chat)
   */
  BEDROCK: `${BACKEND_URL}/api/bedrock/chat`,
};

// Configuración de request
export const API_CONFIG = {
  /** Timeout para requests (ms) */
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10),

  /** Headers por defecto */
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  /** Reintentos automáticos en error */
  MAX_RETRIES: 3,

  /** Delay entre reintentos (ms) */
  RETRY_DELAY: 1000,
};

// Logging
export const DEBUG_MODE = isDevelopment && process.env.REACT_APP_DEBUG !== 'false';

if (DEBUG_MODE) {
  console.log('🔧 API Configuration:');
  console.log('  Ambiente:', process.env.NODE_ENV);
  console.log('  Backend URL:', BACKEND_URL);
  console.log('  Chat Endpoint:', API_ENDPOINTS.CHAT);
  console.log('  Health Endpoint:', API_ENDPOINTS.HEALTH);
}

export default API_ENDPOINTS;
