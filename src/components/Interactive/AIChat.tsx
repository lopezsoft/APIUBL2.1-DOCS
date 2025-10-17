/**
 * AIChat Component
 *
 * Componente de chat con IA especializado en APIUBL2.1.
 * Gestiona:
 * - Envío y recepción de mensajes
 * - Histórico de conversación
 * - Estados de carga y error
 * - Scroll automático
 *
 * Arquitectura SOLID:
 * - Single Responsibility: Solo gestiona el chat
 * - Dependency Injection: Props para configurar endpoints
 * - Separation of Concerns: Separado de UI flotante
 */

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { FiSend, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import styles from './AIChat.module.css';
import { API_ENDPOINTS } from '../../config/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIBackendMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIBackendResponse {
  response: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AIChatProps {
  /**
   * Endpoint del backend para chat
   * @default '/api/openai/chat'
   */
  endpoint?: string;

  /**
   * Número máximo de mensajes a mantener en histórico
   * @default 20
   */
  maxHistorySize?: number;

  /**
   * Callback cuando hay un error
   */
  onError?: (error: string) => void;
}

/**
 * Hook personalizado para gestionar la lógica de chat
 */
function useChatLogic(endpoint: string, maxHistorySize: number, onError?: (error: string) => void) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hola, soy tu asistente técnico especializado en APIUBL2.1 y facturación electrónica en Colombia.

¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre:

• 📋 Estructura de facturas electrónicas
• ✅ Validación de NITs y documentos
• 💰 Cálculo de totales e impuestos
• 📊 Ejemplos de JSON reales
• ⚠️ Errores comunes y soluciones
• 🔗 Integración del API MATIAS
• 🎯 Campos requeridos y opcionales
• 🏷️ Tipos de documentos (Facturas, Notas, etc.)`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: AIBackendResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  }, [input, messages, endpoint, onError]);

  const clearChat = useCallback(() => {
    setMessages([messages[0]]); // Mantener el mensaje inicial
    setError(null);
  }, [messages]);

  return { messages, input, setInput, loading, error, setError, sendMessage, clearChat };
}

/**
 * Componente de mensaje individual
 */
const MessageBubble = memo(
  ({ message }: { message: Message }) => (
    <div
      className={`${styles.message} ${styles[message.role]}`}
      role="article"
      aria-label={`Mensaje de ${message.role === 'user' ? 'usuario' : 'asistente'}`}
    >
      <div className={styles.messageContent}>
        <span className={styles.icon} aria-hidden="true">
          {message.role === 'assistant' ? '🤖' : '👤'}
        </span>
        <div className={styles.text}>{message.content}</div>
      </div>
      <time className={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
    </div>
  ),
);

MessageBubble.displayName = 'MessageBubble';

/**
 * Indicador de carga (typing animation)
 */
const TypingIndicator = memo(() => (
  <div className={styles.message} aria-label="Asistente está escribiendo" role="status">
    <div className={styles.messageContent}>
      <span className={styles.icon} aria-hidden="true">
        🤖
      </span>
      <div className={styles.typing}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = 'TypingIndicator';

/**
 * Área de entrada de texto
 */
const MessageInput = memo(
  React.forwardRef<HTMLTextAreaElement, {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    disabled: boolean;
  }>(
    ({
      value,
      onChange,
      onSend,
      onKeyPress,
      disabled,
    }, ref) => (
      <div className={styles.inputArea}>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Escribe tu pregunta aquí..."
          disabled={disabled}
          className={styles.input}
          rows={2}
          maxLength={4000}
          aria-label="Campo de entrada para preguntas"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className={styles.sendButton}
          aria-label="Enviar mensaje"
          title="Presiona Enter para enviar"
          type="button"
        >
          {disabled ? <span>⏳</span> : <FiSend size={18} />}
        </button>
      </div>
    ),
  ),
);

MessageInput.displayName = 'MessageInput';

/**
 * AIChat Component - Componente principal
 *
 * Uso:
 * ```tsx
 * <AIChat
 *   endpoint="/api/openai/chat"
 *   maxHistorySize={20}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
const AIChat = memo(
  ({
    endpoint = API_ENDPOINTS.CHAT,
    maxHistorySize = 20,
    onError,
  }: AIChatProps) => {
    const { messages, input, setInput, loading, error, setError, sendMessage, clearChat } =
      useChatLogic(endpoint, maxHistorySize, onError);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto scroll cuando hay nuevos mensajes
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus en el input después de enviar y cuando termina de cargar
    useEffect(() => {
      if (!loading && inputRef.current) {
        inputRef.current.focus();
      }
    }, [loading]);

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      },
      [sendMessage],
    );

    return (
      <div className={styles.container} role="region" aria-label="Chat con asistente IA">
        {/* Header con acciones */}
        <div className={styles.actionBar}>
          {error && (
            <button
              onClick={() => setError(null)}
              className={styles.closeError}
              aria-label="Cerrar error"
              type="button"
              title="Descartar error"
            >
              <FiAlertCircle size={16} />
            </button>
          )}
          <button
            onClick={clearChat}
            className={styles.actionButton}
            disabled={messages.length <= 1}
            title="Limpiar conversación"
            type="button"
            aria-label="Limpiar conversación"
          >
            <FiRefreshCw size={16} />
          </button>
        </div>

        {/* Zona de error */}
        {error && (
          <div className={styles.errorBanner} role="alert" aria-live="polite">
            <span className={styles.errorIcon}><FiAlertCircle size={16} /></span>
            <div className={styles.errorText}>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Zona de mensajes */}
        <div className={styles.messagesContainer} role="log" aria-live="polite" aria-atomic="false">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {loading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Área de entrada */}
        <MessageInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onSend={sendMessage}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
    );
  },
);

AIChat.displayName = 'AIChat';

export default AIChat;
