import React, { useState, useRef, useEffect } from 'react';
import styles from './AIAssistant.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hola, soy tu asistente técnico de APIUBL2.1. ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre:\n\n• Estructura de facturas electrónicas\n• Validación de NITs\n• Cálculo de totales e impuestos\n• Ejemplos de JSON\n• Errores comunes\n• Integración del API',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Llamar a Bedrock API
      const response = await fetch('/api/bedrock/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Agregar respuesta del asistente
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar con el asistente';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '👋 Hola, soy tu asistente técnico de APIUBL2.1. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>🤖 Asistente Técnico AI</h2>
          <p>Soporte técnico inteligente para APIUBL2.1</p>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${styles[message.role]}`}
            >
              <div className={styles.messageContent}>
                {message.role === 'assistant' && <span className={styles.icon}>🤖</span>}
                {message.role === 'user' && <span className={styles.icon}>👤</span>}
                <div className={styles.text}>{message.content}</div>
              </div>
              <div className={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.messageContent}>
                <span className={styles.icon}>🤖</span>
                <div className={styles.typing}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              ❌ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta técnica aquí... (Enter para enviar, Shift+Enter para nueva línea)"
            className={styles.input}
            disabled={loading}
            rows={3}
          />
          <div className={styles.buttons}>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={styles.buttonSend}
            >
              {loading ? '⏳ Procesando...' : '📤 Enviar'}
            </button>
            <button
              onClick={clearChat}
              disabled={loading}
              className={styles.buttonClear}
            >
              🗑️ Limpiar
            </button>
          </div>
        </div>

        <div className={styles.info}>
          <p>💡 <strong>Consejo:</strong> Puedo ayudarte con preguntas sobre estructura de facturas, validaciones, cálculos, ejemplos y errores comunes.</p>
        </div>
      </div>
    </div>
  );
}
