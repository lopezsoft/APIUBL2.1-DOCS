import React, { useState, useRef, useEffect } from 'react';
import styles from './AIAssistant.module.css';
import { API_ENDPOINTS } from '@site/src/config/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    source: string;
    relevance: number;
    title: string;
  }>;
}

interface ChatOptions {
  useRAG: boolean;
  topK: number;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '� **Asistente Técnico IA - APIUBL2.1**\n\n¡Hola! Soy tu asistente especializado en facturación electrónica colombiana, respaldado por **documentación oficial DIAN** y búsqueda inteligente (RAG).\n\n**¿En qué puedo ayudarte?**\n• 📄 Estructura de facturas electrónicas\n• ✅ Validación de NITs y documentos\n• 🧮 Cálculo de totales e impuestos\n• 📋 Ejemplos JSON de transacciones\n• 🚨 Resolución de errores comunes\n• 📖 Referencias del marco regulatorio DIAN\n• 💼 Integración del API',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ChatOptions>({
    useRAG: true,
    topK: 3
  });
  const [showOptions, setShowOptions] = useState(false);
  const [showSourcesFor, setShowSourcesFor] = useState<string | null>(null);
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
      // Llamar a API con opciones RAG
      const response = await fetch(API_ENDPOINTS.BEDROCK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          options: {
            useRAG: options.useRAG,
            topK: options.topK
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Agregar respuesta del asistente con fuentes
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sources: data.sources || undefined
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
        content: '� Chat limpiado. ¿En qué más puedo ayudarte?',
        timestamp: new Date()
      }
    ]);
  };

  const exportChat = () => {
    const chatContent = messages
      .map(m => `[${m.timestamp.toLocaleTimeString()}] ${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(chatContent));
    element.setAttribute('download', `chat-apiubl-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copySources = (message: Message) => {
    if (!message.sources) return;
    const sourcesText = message.sources
      .map(s => `📚 ${s.title}\nFuente: ${s.source}\nRelevancia: ${(s.relevance * 100).toFixed(0)}%`)
      .join('\n\n');
    navigator.clipboard.writeText(sourcesText);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2>🤖 Asistente Técnico AI</h2>
            <p>Soporte inteligente con RAG (Búsqueda en docs DIAN)</p>
          </div>
          
          <div className={styles.optionsPanel}>
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className={styles.optionsToggle}
              title="Opciones RAG"
            >
              ⚙️
            </button>
            
            {showOptions && (
              <div className={styles.optionsDropdown}>
                <div className={styles.optionGroup}>
                  <label>
                    <input 
                      type="checkbox"
                      checked={options.useRAG}
                      onChange={(e) => setOptions({...options, useRAG: e.target.checked})}
                    />
                    Usar RAG (Búsqueda de documentación)
                  </label>
                </div>

                <div className={styles.optionGroup}>
                  <label>Documentos: {options.topK}</label>
                  <input 
                    type="range"
                    min="1"
                    max="5"
                    value={options.topK}
                    onChange={(e) => setOptions({...options, topK: parseInt(e.target.value)})}
                    className={styles.slider}
                  />
                </div>
              </div>
            )}
          </div>
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
                <div className={styles.textWrapper}>
                  <div className={styles.text}>{message.content}</div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className={styles.sources}>
                      <button
                        onClick={() => setShowSourcesFor(showSourcesFor === message.id ? null : message.id)}
                        className={styles.sourcesToggle}
                      >
                        📚 Fuentes ({message.sources.length}) {showSourcesFor === message.id ? '▼' : '▶'}
                      </button>
                      
                      {showSourcesFor === message.id && (
                        <div className={styles.sourcesList}>
                          {message.sources.map((source, idx) => (
                            <div key={idx} className={styles.sourceItem}>
                              <strong>{source.title}</strong>
                              <p><small>{source.source}</small></p>
                              <span className={styles.relevance}>Relevancia: {(source.relevance * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                          <button
                            onClick={() => copySources(message)}
                            className={styles.copySourcesBtn}
                          >
                            📋 Copiar fuentes
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
              <button onClick={() => setError(null)} className={styles.closeError}>✕</button>
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
              onClick={exportChat}
              disabled={messages.length <= 1}
              className={styles.buttonExport}
              title="Descargar historial del chat"
            >
              💾
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
          <p>💡 <strong>RAG Habilitado:</strong> Las respuestas se basan en búsqueda automática de documentación oficial DIAN y guías técnicas del API.</p>
          {options.useRAG && (
            <p>🔍 <strong>Buscando en:</strong> {options.topK} documento(s) más relevante(s) por pregunta</p>
          )}
        </div>
      </div>
    </div>
  );
}
