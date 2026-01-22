/**
 * Root Component para Docusaurus
 *
 * Componente raíz que envuelve toda la aplicación.
 */

import React from 'react';

/**
 * Root Component
 *
 * Este es el componente raíz que Docusaurus renderiza.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
