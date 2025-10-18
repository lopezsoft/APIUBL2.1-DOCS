import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import styles from './chat.module.css';
import { API_ENDPOINTS } from '@site/src/config/api';

// ============================================================================
// INTERFACES
// ============================================================================

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

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface ChatOptions {
  useRAG: boolean;
  topK: number;
  minRelevance: number;
}

interface SuggestedQuestion {
  question: string;
  category: string;
}

// ============================================================================
// PREGUNTAS SUGERIDAS POR CATEGORÍA
// ============================================================================

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  "📄 Facturación Electrónica": [
    "¿Cómo generar una factura electrónica de venta?",
    "¿Qué campos son obligatorios en una factura?",
    "Dame un ejemplo de JSON para una factura",
    "¿Cómo funcionan las notas crédito y débito?",
    "¿Cuál es la estructura del CUFE?"
  ],
  "⚖️ Marco Regulatorio DIAN": [
    "¿Cuáles son las validaciones del Anexo Técnico?",
    "¿Qué dice la Resolución 000165 de 2024?",
    "Requisitos para habilitación en producción",
    "¿Qué es el CUFE y cómo se calcula?",
    "Diferencias entre ambientes habilitación y producción"
  ],
  "🔌 API Endpoints": [
    "¿Cómo consultar el estado de un documento?",
    "¿Cuáles son los endpoints disponibles?",
    "¿Cómo autenticarse en la API?",
    "¿Cómo generar una factura POS?",
    "¿Cómo enviar un documento soporte?"
  ],
  "💼 Nómina Electrónica": [
    "¿Cómo generar una nómina electrónica?",
    "¿Qué campos requiere una nómina?",
    "Dame un ejemplo de JSON para nómina",
    "¿Cuál es la diferencia entre nómina individual y ajuste?"
  ],
  "🏷️ Documento Soporte": [
    "¿Qué es un documento soporte?",
    "¿Cuándo debo usar documento soporte?",
    "Dame un ejemplo de documento soporte",
    "Diferencias entre factura y documento soporte"
  ]
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

// Función para formatear contenido (importada desde AIAssistant)
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

function isValidXML(str: string): boolean {
  const trimmed = str.trim();
  return trimmed.startsWith('<') && trimmed.includes('>') && trimmed.split('\n').length > 1;
}

function formatMessageContent(content: string): React.ReactElement {
  const parts: React.ReactElement[] = [];
  let key = 0;

  const lines = content.split('\n');
  let currentBlock: string[] = [];
  let inJsonBlock = false;
  let inXmlBlock = false;
  let braceCount = 0;

  const flushTextBlock = (text: string) => {
    if (!text.trim()) return;
    
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    
    let processed = text;
    const elements: React.ReactElement[] = [];
    let lastIdx = 0;

    processed.replace(boldRegex, (match, p1, offset) => {
      if (offset > lastIdx) {
        elements.push(<span key={key++}>{processed.slice(lastIdx, offset)}</span>);
      }
      elements.push(<strong key={key++} className={styles.bold}>{p1}</strong>);
      lastIdx = offset + match.length;
      return match;
    });

    processed.replace(inlineCodeRegex, (match, p1, offset) => {
      elements.push(<code key={key++} className={styles.inlineCode}>{p1}</code>);
      return match;
    });

    if (elements.length > 0) {
      parts.push(<div key={key++}>{elements}</div>);
    } else {
      parts.push(<div key={key++}>{text}</div>);
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

    if (!inJsonBlock && !inXmlBlock && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
      if (currentBlock.length > 0) {
        flushTextBlock(currentBlock.join('\n'));
        currentBlock = [];
      }
      
      inJsonBlock = true;
      braceCount = (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
      braceCount += (trimmed.match(/\[/g) || []).length - (trimmed.match(/\]/g) || []).length;
      currentBlock.push(line);
      
      if (braceCount === 0 && isValidJSON(line)) {
        flushCodeBlock(currentBlock, 'json');
        currentBlock = [];
        inJsonBlock = false;
      }
      continue;
    }

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

    if (!inJsonBlock && !inXmlBlock && trimmed.startsWith('<') && !trimmed.includes('</')) {
      if (currentBlock.length > 0) {
        flushTextBlock(currentBlock.join('\n'));
        currentBlock = [];
      }
      
      inXmlBlock = true;
      currentBlock.push(line);
      continue;
    }

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

    currentBlock.push(line);
  }

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

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ChatPage(): React.ReactElement {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<ChatOptions>({
    useRAG: true,
    topK: 3,
    minRelevance: 0
  });
  const [showSourcesFor, setShowSourcesFor] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Cargar conversaciones del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chat-conversations');
    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        messages: c.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      })));
    }
  }, []);

  // Guardar conversaciones en localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chat-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cargar conversación actual
  useEffect(() => {
    if (currentConversationId) {
      const conv = conversations.find(c => c.id === currentConversationId);
      if (conv) {
        setMessages(conv.messages);
      }
    }
  }, [currentConversationId, conversations]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };
    setConversations([newConv, ...conversations]);
    setCurrentConversationId(newConv.id);
    setMessages([]);
    setError(null);
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINTS.CHAT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          options: options.useRAG ? {
            useRAG: true,
            topK: options.topK
          } : undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sources: data.sources
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      // Actualizar conversación
      if (currentConversationId) {
        setConversations(prev => prev.map(c => 
          c.id === currentConversationId
            ? {
                ...c,
                messages: updatedMessages,
                updatedAt: new Date(),
                title: c.messages.length === 0 ? messageText.slice(0, 50) : c.title
              }
            : c
        ));
      } else {
        // Crear nueva conversación automáticamente
        const newConv: Conversation = {
          id: Date.now().toString(),
          title: messageText.slice(0, 50),
          messages: updatedMessages,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: []
        };
        setConversations([newConv, ...conversations]);
        setCurrentConversationId(newConv.id);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  };

  const exportConversation = (conv: Conversation) => {
    const content = conv.messages
      .map(m => `[${m.timestamp.toLocaleString()}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join('\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${conv.title.slice(0, 30)}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout
      title="Chat Asistente IA"
      description="Asistente de IA para documentación API UBL 2.1"
    >
      <div className={styles.container}>
        {/* SIDEBAR IZQUIERDO: HISTORIAL */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3>💬 Conversaciones</h3>
            <button onClick={createNewConversation} className={styles.newChatBtn}>
              ➕ Nueva
            </button>
          </div>

          <div className={styles.searchBox}>
            <input
              type="search"
              placeholder="🔍 Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.conversationList}>
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`${styles.conversationItem} ${currentConversationId === conv.id ? styles.active : ''}`}
                onClick={() => setCurrentConversationId(conv.id)}
              >
                <div className={styles.convTitle}>{conv.title}</div>
                <div className={styles.convMeta}>
                  {conv.messages.length} mensajes · {conv.updatedAt.toLocaleDateString()}
                </div>
                <div className={styles.convActions}>
                  <button onClick={(e) => { e.stopPropagation(); exportConversation(conv); }}>💾</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* PANEL CENTRAL: CHAT */}
        <main className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={styles.toggleSidebar}>
              ☰
            </button>
            <h2>🤖 Asistente IA - API UBL 2.1</h2>
            <div className={styles.ragStatus}>
              {options.useRAG ? '📚 RAG Activo' : '💭 Sin RAG'}
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div className={styles.welcome}>
                <h3>👋 ¡Bienvenido!</h3>
                <p>Pregúntame sobre facturación electrónica, DIAN, API endpoints, nómina y más.</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`${styles.message} ${styles[message.role]}`}>
                <div className={styles.messageContent}>
                  {message.role === 'assistant' && <span className={styles.icon}>🤖</span>}
                  {message.role === 'user' && <span className={styles.icon}>👤</span>}
                  <div className={styles.textWrapper}>
                    <div className={styles.text}>
                      {formatMessageContent(message.content)}
                    </div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className={styles.sources}>
                        <button onClick={() => setShowSourcesFor(showSourcesFor === message.id ? null : message.id)}>
                          📚 Fuentes ({message.sources.length}) {showSourcesFor === message.id ? '▼' : '▶'}
                        </button>
                        {showSourcesFor === message.id && (
                          <div className={styles.sourcesList}>
                            {message.sources.map((source, idx) => (
                              <div key={idx} className={styles.sourceItem}>
                                <strong>{source.title}</strong>
                                <p>{source.source}</p>
                                <span>Relevancia: {(source.relevance * 100).toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.timestamp}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}

            {loading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <span className={styles.icon}>🤖</span>
                  <div className={styles.loading}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                ❌ {error}
                <button onClick={() => setError(null)}>✕</button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Escribe tu pregunta... (Enter para enviar, Shift+Enter para nueva línea)"
              rows={3}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              {loading ? '⏳' : '📤'} Enviar
            </button>
          </div>
        </main>

        {/* SIDEBAR DERECHO: PREGUNTAS + CONFIG */}
        <aside className={styles.rightSidebar}>
          <div className={styles.section}>
            <h3>💡 Preguntas Sugeridas</h3>
            {Object.entries(SUGGESTED_QUESTIONS).map(([category, questions]) => (
              <div key={category} className={styles.questionCategory}>
                <h4>{category}</h4>
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    className={styles.suggestedQuestion}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <h3>⚙️ Configuración RAG</h3>
            <label className={styles.configLabel}>
              <input
                type="checkbox"
                checked={options.useRAG}
                onChange={(e) => setOptions({...options, useRAG: e.target.checked})}
              />
              Usar RAG (Documentación DIAN)
            </label>

            {options.useRAG && (
              <>
                <label className={styles.configLabel}>
                  Top K Documentos: {options.topK}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={options.topK}
                  onChange={(e) => setOptions({...options, topK: parseInt(e.target.value)})}
                  className={styles.slider}
                />
              </>
            )}
          </div>
        </aside>
      </div>
    </Layout>
  );
}
