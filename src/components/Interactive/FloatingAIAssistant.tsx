/**
 * FloatingAIAssistant
 *
 * Componente de botón flotante que redirige al chat completo.
 * Se muestra como un icono flotante en la esquina inferior derecha,
 * que al hacer clic abre la página /chat en una nueva pestaña.
 *
 * Características:
 * - SOLID: Responsabilidad única (redirección al chat)
 * - UX/UI: Flotante no invasivo, animaciones suaves
 * - Accesibilidad: ARIA labels descriptivos
 * - Performance: Memoization
 */

import React, { memo } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import styles from './FloatingAIAssistant.module.css';

interface FloatingAIAssistantProps {
  /**
   * Tamaño del icono flotante
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Posición del icono
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /**
   * Callback cuando se abre/cierra el chat
   */
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Icono flotante principal
 * - Redirige directamente al chat completo en /chat
 * - Abre en nueva pestaña para no interrumpir la navegación
 */
const FloatingButton = memo(
  ({
    size,
  }: {
    size: string;
  }) => (
    <a
      href="/chat"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.floatingButton} ${styles[size]}`}
      aria-label="Abrir chat completo con historial y preguntas sugeridas"
      title="🚀 Chat Completo - Historial, búsqueda y 23 preguntas sugeridas"
    >
      <span className={styles.icon} aria-hidden="true">
        <FiMessageCircle size={24} />
      </span>
      <span className={styles.badge} aria-label="Chat completo disponible">
        <MdAutoAwesome size={16} />
      </span>
    </a>
  ),
);

FloatingButton.displayName = 'FloatingButton';

/**
 * Componente principal: FloatingAIAssistant
 *
 * Ahora simplemente muestra un botón flotante que redirige a /chat
 *
 * Uso:
 * ```tsx
 * <FloatingAIAssistant
 *   size="medium"
 *   position="bottom-right"
 * />
 * ```
 */
const FloatingAIAssistant = memo(
  ({
    size = 'medium',
    position = 'bottom-right',
  }: FloatingAIAssistantProps) => {
    return (
      <div className={`${styles.container} ${styles[position]}`}>
        <FloatingButton size={size} />
      </div>
    );
  },
);

FloatingAIAssistant.displayName = 'FloatingAIAssistant';

export default FloatingAIAssistant;
