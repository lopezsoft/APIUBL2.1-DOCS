/**
 * Popup personalizado para @docusaurus/plugin-pwa.
 *
 * Cuando el service worker detecta una nueva versión del sitio ya
 * precacheada, se muestra este aviso y se recarga automáticamente
 * para que el usuario siempre vea el contenido más reciente sin
 * tener que limpiar la caché manualmente.
 */
import { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const AUTO_RELOAD_SECONDS = 5;

export default function PwaReloadPopup({
  onReload,
}: {
  onReload: () => void;
}): ReactNode {
  const [isVisible, setIsVisible] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_RELOAD_SECONDS);
  const [autoReloadActive, setAutoReloadActive] = useState(true);

  useEffect(() => {
    if (!autoReloadActive) {
      return;
    }
    if (secondsLeft <= 0) {
      onReload();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [autoReloadActive, secondsLeft, onReload]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={clsx('alert', 'alert--info', styles.popup)} role="alert">
      <p className={styles.message}>
        🚀 <strong>Nueva versión disponible.</strong>
        <br />
        {autoReloadActive
          ? `Actualizando automáticamente en ${secondsLeft}s para mostrarte los últimos cambios...`
          : 'Actualización pendiente. Aplica los cambios cuando quieras.'}
      </p>
      <div className={styles.buttonContainer}>
        <button
          className="button button--primary button--sm"
          type="button"
          onClick={() => {
            setIsVisible(false);
            onReload();
          }}
        >
          Actualizar ahora
        </button>
        {autoReloadActive && (
          <button
            className="button button--link button--sm"
            type="button"
            onClick={() => setAutoReloadActive(false)}
          >
            Posponer
          </button>
        )}
        <button
          aria-label="Cerrar"
          className="close"
          type="button"
          onClick={() => setIsVisible(false)}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}
