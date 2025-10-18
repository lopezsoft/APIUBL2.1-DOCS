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

// Función para detectar si un texto es JSON válido
function isValidJSON(str: string): boolean {
  try {
    const trimmed = str.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false;
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

// Función para detectar si un texto es XML válido
function isValidXML(str: string): boolean {
  const trimmed = str.trim();
  return trimmed.startsWith('<') && trimmed.includes('>') && trimmed.split('\n').length > 1;
}

// Función para formatear contenido del mensaje con syntax highlighting mejorado
function formatMessageContent(content: string): React.ReactElement {
  const parts: React.ReactElement[] = [];
  let key = 0;

  // Primero intentar detectar bloques JSON/XML sin delimitadores
  const lines = content.split('\n');
  let currentBlock: string[] = [];
  let inJsonBlock = false;
  let inXmlBlock = false;
  let braceCount = 0;

  const flushTextBlock = (text: string) => {
    if (!text.trim()) return;
    
    // Procesar formato inline en texto normal
    const processedParts: React.ReactElement[] = [];
    let remaining = text;
    let localKey = 0;

    // Negrita **texto**
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const inlineCodeRegex = /`([^`]+)`/g;

    let lastIndex = 0;
    let match;

    // Buscar negritas
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        processedParts.push(<span key={`${key}-${localKey++}`}>{text.slice(lastIndex, match.index)}</span>);
      }
      processedParts.push(
        <strong key={`${key}-${localKey++}`} className={styles.bold}>
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    // Reset para código inline
    boldRegex.lastIndex = 0;
    lastIndex = 0;
    const tempText = text;
    
    while ((match = inlineCodeRegex.exec(tempText)) !== null) {
      processedParts.push(
        <code key={`${key}-${localKey++}`} className={styles.inlineCode}>
          {match[1]}
        </code>
      );
    }

    if (processedParts.length === 0) {
      parts.push(<div key={key++}>{text}</div>);
    } else {
      // Mezclar texto y elementos formateados
      const finalText = text
        .replace(/\*\*([^*]+)\*\*/g, '')
        .replace(/`([^`]+)`/g, '');
      
      if (finalText.trim()) {
        parts.push(<div key={key++}>{processedParts.length > 0 ? processedParts : text}</div>);
      }
    }
  };

  const flushCodeBlock = (code: string[], lang: string) => {
    const codeText = code.join('\n').trim();
    if (!codeText) return;

    parts.push(
      <pre key={key++} className={styles.codeBlock}>
        <div className={styles.codeHeader}>
          <span className={styles.codeLang}>{lang.toUpperCase()}</span>
          <button 
            className={styles.copyCode}
            onClick={() => navigator.clipboard.writeText(codeText)}
          >
            📋 Copiar
          </button>
        </div>
        <code className={`${styles.code} language-${lang}`}>
          {lang === 'json' ? JSON.stringify(JSON.parse(codeText), null, 2) : codeText}
        </code>
      </pre>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detectar inicio de bloque con delimitadores ```
    if (trimmed.startsWith('```')) {
      if (currentBlock.length > 0) {
        flushTextBlock(currentBlock.join('\n'));
        currentBlock = [];
      }
      
      const lang = trimmed.slice(3) || 'text';
      const codeLines: string[] = [];
      i++;
      
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      
      flushCodeBlock(codeLines, lang);
      continue;
    }

    // Detectar inicio de JSON { o [
    if (!inJsonBlock && !inXmlBlock && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
      // Flush texto anterior
      if (currentBlock.length > 0) {
        flushTextBlock(currentBlock.join('\n'));
        currentBlock = [];
      }
      
      inJsonBlock = true;
      braceCount = (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
      braceCount += (trimmed.match(/\[/g) || []).length - (trimmed.match(/\]/g) || []).length;
      currentBlock.push(line);
      
      if (braceCount === 0) {
        // JSON en una sola línea
        if (isValidJSON(line)) {
          flushCodeBlock(currentBlock, 'json');
          currentBlock = [];
          inJsonBlock = false;
        }
      }
      continue;
    }

    // Continuar bloque JSON
    if (inJsonBlock) {
      currentBlock.push(line);
      braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      braceCount += (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;
      
      if (braceCount === 0) {
        const jsonText = currentBlock.join('\n');
        if (isValidJSON(jsonText)) {
          flushCodeBlock(currentBlock, 'json');
        } else {
          flushTextBlock(jsonText);
        }
        currentBlock = [];
        inJsonBlock = false;
      }
      continue;
    }

    // Detectar inicio de XML
    if (!inJsonBlock && !inXmlBlock && trimmed.startsWith('<') && !trimmed.includes('</')) {
      if (currentBlock.length > 0) {
        flushTextBlock(currentBlock.join('\n'));
        currentBlock = [];
      }
      
      inXmlBlock = true;
      currentBlock.push(line);
      continue;
    }

    // Continuar o finalizar bloque XML
    if (inXmlBlock) {
      currentBlock.push(line);
      
      if (trimmed.includes('</')) {
        const xmlText = currentBlock.join('\n');
        if (isValidXML(xmlText)) {
          flushCodeBlock(currentBlock, 'xml');
        } else {
          flushTextBlock(xmlText);
        }
        currentBlock = [];
        inXmlBlock = false;
      }
      continue;
    }

    // Texto normal
    currentBlock.push(line);
  }

  // Flush resto
  if (currentBlock.length > 0) {
    if (inJsonBlock && isValidJSON(currentBlock.join('\n'))) {
      flushCodeBlock(currentBlock, 'json');
    } else if (inXmlBlock && isValidXML(currentBlock.join('\n'))) {
      flushCodeBlock(currentBlock, 'xml');
    } else {
      flushTextBlock(currentBlock.join('\n'));
    }
  }

  return <>{parts}</>;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🎉 **¡Bienvenido al Chat Completo!**\n\nEste popup ahora tiene una versión completa con muchas más funcionalidades:\n\n✨ **Nuevas características:**\n• 💾 **Historial completo** - Guarda todas tus conversaciones\n• 🔍 **Búsqueda** - Encuentra conversaciones anteriores\n• 💡 **23 preguntas sugeridas** - En 5 categorías temáticas\n• � **Exportar chats** - Descarga tus conversaciones en .txt\n• ⚙️ **Configuración avanzada** - RAG con hasta 10 documentos\n• 📱 **Responsive** - Funciona en móvil, tablet y desktop\n\n🚀 **Para usar el chat completo, haz click en el botón "Abrir Chat Completo" arriba.**\n\nO puedes usar este popup para consultas rápidas.',
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
            <p>Popup rápido - Para más funciones usa el Chat Completo</p>
          </div>
          
          <div className={styles.optionsPanel}>
            <a 
              href="/chat"
              className={styles.fullChatBtn}
              title="Abrir chat completo con historial, búsqueda y 23 preguntas sugeridas"
              target="_blank"
              rel="noopener noreferrer"
            >
              🚀 Abrir Chat Completo
            </a>
            
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
                  <div className={styles.text}>
                    {formatMessageContent(message.content)}
                  </div>
                  
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
          <p>
            💡 <strong>Popup Rápido:</strong> Para historial completo, búsqueda y 23 preguntas sugeridas → 
            <a href="/chat" target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
              🚀 Abrir Chat Completo
            </a>
          </p>
          {options.useRAG && (
            <p>🔍 <strong>RAG Activo:</strong> Buscando en {options.topK} documento(s) DIAN más relevante(s)</p>
          )}
        </div>
      </div>
    </div>
  );
}
