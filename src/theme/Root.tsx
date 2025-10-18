/**
 * Root Component para Docusaurus
 *
 * Este componente envuelve toda la aplicación Docusaurus y añade el
 * FloatingAIAssistant globalmente. Se ejecuta una sola vez en la raíz
 * del árbol de React.
 *
 * Propósito:
 * - Inyectar el asistente IA flotante en TODA la documentación
 * - Mantener el estado del chat entre navegaciones
 * - Manejar la inicialización del servidor
 *
 * Uso automático por Docusaurus (swizzle):
 * - Colocar en: src/theme/Root.tsx
 */

import React, { useEffect, useState } from 'react';
import FloatingAIAssistant from '@site/src/components/Interactive/FloatingAIAssistant';

/**
 * Hook para verificar que el servidor OpenAI esté disponible
 */
function useServerHealth() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Obtener URL del backend desde config inyectada
        const config = (window as any).__MATIAS_CONFIG__;
        const backendUrl = config?.BACKEND_URL || 'https://api-docs.matias-api.com';
        const healthUrl = `${backendUrl}/health`;
        
        const response = await fetch(healthUrl, { method: 'GET' });
        setIsHealthy(response.ok);
      } catch (error) {
        console.warn('⚠️ Servidor de IA no disponible. El chat estará deshabilitado.');
        setIsHealthy(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Esperar 500ms para que el servidor esté listo
    const timer = setTimeout(checkHealth, 500);
    return () => clearTimeout(timer);
  }, []);

  return { isHealthy, isLoading };
}

/**
 * Root Component
 *
 * Este es el componente raíz que Docusaurus renderiza.
 * Envuelve toda la aplicación y añade el FloatingAIAssistant.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  const { isHealthy } = useServerHealth();

  return (
    <>
      {children}

      {/* FloatingAIAssistant - Visible en toda la documentación */}
      {isHealthy && (
        <FloatingAIAssistant
          size="medium"
          position="bottom-right"
          onToggle={(isOpen) => {
            // Aquí puedes añadir analytics o logging si lo deseas
            // console.log('Chat abierto:', isOpen);
          }}
        />
      )}
    </>
  );
}
