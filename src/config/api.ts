/**
 * Configuración del API (Frontend)
 * 
 * Lee la configuración de window.__MATIAS_CONFIG__ que es inyectada
 * por /static/config.js ANTES de que se cargue el bundle de React
 * 
 * Esto evita usar process.env que no existe en el navegador
 */

// Tipos para la configuración
declare global {
  interface Window {
    __MATIAS_CONFIG__?: {
      BACKEND_URL: string;
      isDevelopment: boolean;
      environment: 'development' | 'production';
      API_ENDPOINTS: {
        CHAT: string;
        HEALTH: string;
        BEDROCK: string;
      };
    };
    __BACKEND_URL__?: string;
  }
}

// Obtener la configuración inyectada (o usar defaults)
const getConfig = () => {
  if (typeof window !== 'undefined' && window.__MATIAS_CONFIG__) {
    return window.__MATIAS_CONFIG__;
  }
  
  // Default fallback (solo si config.js no se ha cargado)
  const isDev = typeof window !== 'undefined' && 
                (window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1');
  
  return {
    BACKEND_URL: isDev ? 'http://localhost:3001' : 'https://api-docs.matias-api.com',
    isDevelopment: isDev,
    environment: isDev ? 'development' : 'production',
    API_ENDPOINTS: {
      CHAT: (isDev ? 'http://localhost:3001' : 'https://api-docs.matias-api.com') + '/api/openai/chat',
      HEALTH: (isDev ? 'http://localhost:3001' : 'https://api-docs.matias-api.com') + '/health',
      BEDROCK: (isDev ? 'http://localhost:3001' : 'https://api-docs.matias-api.com') + '/api/bedrock/chat',
    }
  };
};

const config = getConfig();

// Exportar configuración
export const BACKEND_URL = config.BACKEND_URL;
export const isDevelopment = config.isDevelopment;
export const environment = config.environment;

// Endpoints
export const API_ENDPOINTS = {
  /**
   * Endpoint para chat con IA
   * POST /api/openai/chat
   * Body: { message: string, conversationHistory: Message[] }
   * Response: { response: string, usage: { prompt_tokens, completion_tokens, total_tokens } }
   */
  CHAT: config.API_ENDPOINTS.CHAT,

  /**
   * Endpoint para verificar estado del servidor
   * GET /health
   * Response: { status: string, service: string, model: string }
   */
  HEALTH: config.API_ENDPOINTS.HEALTH,

  /**
   * Endpoint legacy (compatibilidad)
   * POST /api/bedrock/chat (se redirige a /api/openai/chat)
   */
  BEDROCK: config.API_ENDPOINTS.BEDROCK,
};

// Configuración de request
export const API_CONFIG = {
  /** Timeout para requests (ms) */
  TIMEOUT: 30000,

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

// Logging en desarrollo
if (isDevelopment && typeof window !== 'undefined') {
  console.log('🔧 API Configuration:');
  console.log('  Ambiente:', environment);
  console.log('  Backend URL:', BACKEND_URL);
  console.log('  Chat Endpoint:', API_ENDPOINTS.CHAT);
  console.log('  Health Endpoint:', API_ENDPOINTS.HEALTH);
}

export default API_ENDPOINTS;
