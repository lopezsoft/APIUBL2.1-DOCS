/**
 * Configuración de Frontend - Inyectada ANTES del bundle
 * 
 * Este archivo se ejecuta ANTES que cualquier código React/Docusaurus
 * y proporciona las variables globales que necesita api.ts
 * 
 * En desarrollo: http://localhost:3001
 * En producción: https://api-docs.matias-api.com (detectado por hostname)
 */

(function() {
  // Detectar si estamos en desarrollo o producción
  const hostname = window.location.hostname;
  const isDevelopment = hostname === 'localhost' || 
                        hostname === '127.0.0.1' ||
                        hostname.includes('local');

  // URLs del backend
  const BACKEND_URL = isDevelopment 
    ? 'http://localhost:3001'
    : 'https://api-docs.matias-api.com';

  // Inyectar configuración global
  window.__MATIAS_CONFIG__ = {
    BACKEND_URL: BACKEND_URL,
    isDevelopment: isDevelopment,
    environment: isDevelopment ? 'development' : 'production',
    API_ENDPOINTS: {
      CHAT: BACKEND_URL + '/api/openai/chat',
      HEALTH: BACKEND_URL + '/health',
      BEDROCK: BACKEND_URL + '/api/bedrock/chat',
    }
  };

  // Backward compatibility
  window.__BACKEND_URL__ = BACKEND_URL;

  if (isDevelopment) {
    console.log('🔧 Configuración Matias API iniciada');
    console.log('  Ambiente:', window.__MATIAS_CONFIG__.environment);
    console.log('  Backend URL:', window.__MATIAS_CONFIG__.BACKEND_URL);
  }
})();
