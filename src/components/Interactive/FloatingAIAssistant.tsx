/**
 * FloatingAIAssistant
 *
 * Componente de asistente IA flotante con popup modal.
 * Se muestra como un icono flotante en la esquina inferior derecha,
 * que al hacer clic abre un popup con el chat.
 *
 * Características:
 * - SOLID: Responsabilidad única (mostrar/ocultar chat)
 * - UX/UI: Flotante no invasivo, animaciones suave
 * - Accesibilidad: Teclado, ARIA labels
 * - Performance: Lazy loading, memoization
 */

import React, { useState, useCallback, memo } from 'react';
import styles from './FloatingAIAssistant.module.css';
import AIChat from './AIChat';

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
 * - Muestra indicador visual del estado
 * - Animación de pulseo cuando hay nuevos mensajes
 */
const FloatingButton = memo(
  ({
    isOpen,
    onClick,
    size,
  }: {
    isOpen: boolean;
    onClick: () => void;
    size: string;
  }) => (
    <button
      className={`${styles.floatingButton} ${styles[size]}`}
      onClick={onClick}
      aria-label="Abrir asistente de IA"
      title="Asistente Técnico IA - Haz clic para abrir"
      type="button"
    >
      <span className={styles.icon} aria-hidden="true">
        💬
      </span>
      <span className={styles.badge} aria-label="Asistente disponible">
        ✨
      </span>
      {isOpen && <span className={styles.close} aria-hidden="true">✕</span>}
    </button>
  ),
);

FloatingButton.displayName = 'FloatingButton';

/**
 * Overlay de fondo para cerrar el popup
 */
const Backdrop = memo(({ onClick }: { onClick: () => void }) => (
  <div className={styles.backdrop} onClick={onClick} aria-hidden="true" />
));

Backdrop.displayName = 'Backdrop';

/**
 * Contenedor del popup con animaciones
 */
const ChatPopup = memo(
  ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => (
    <>
      {isOpen && <Backdrop onClick={onClose} />}
      <div
        className={`${styles.chatPopup} ${isOpen ? styles.open : styles.closed}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-popup-title"
      >
        <div className={styles.header}>
          <h2 id="chat-popup-title" className={styles.title}>
            🤖 Asistente Técnico
          </h2>
          <p className={styles.subtitle}>APIUBL2.1 - Facturación Electrónica</p>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar chat"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <AIChat />
        </div>
      </div>
    </>
  ),
);

ChatPopup.displayName = 'ChatPopup';

/**
 * Componente principal: FloatingAIAssistant
 *
 * Uso:
 * ```tsx
 * <FloatingAIAssistant
 *   size="medium"
 *   position="bottom-right"
 *   onToggle={(isOpen) => console.log('Chat:', isOpen)}
 * />
 * ```
 */
const FloatingAIAssistant = memo(
  ({
    size = 'medium',
    position = 'bottom-right',
    onToggle,
  }: FloatingAIAssistantProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(() => {
      setIsOpen((prev) => !prev);
      onToggle?.(!isOpen);
    }, [isOpen, onToggle]);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      onToggle?.(false);
    }, [onToggle]);

    return (
      <div className={`${styles.container} ${styles[position]}`}>
        <FloatingButton isOpen={isOpen} onClick={handleToggle} size={size} />
        <ChatPopup isOpen={isOpen} onClose={handleClose} />
      </div>
    );
  },
);

FloatingAIAssistant.displayName = 'FloatingAIAssistant';

export default FloatingAIAssistant;
