# 🎨 Arquitectura Visual - OpenAI GPT-4 Turbo Implementation

## 📐 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                     DOCUSAURUS SITE                             │
│                   (http://localhost:3000)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Renderiza
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Root.tsx                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Health Check del servidor OpenAI                      │   │
│  │ • Renderiza {children} (documentación)                  │   │
│  │ • Inyecta FloatingAIAssistant globalmente               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Inyecta globalmente
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           FloatingAIAssistant.tsx                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ FloatingButton (Icono 💬 + Badge ✨)                  │    │
│  │ • Gradiente purple-to-pink                             │    │
│  │ • Animación pulsante                                   │    │
│  │ • Hover effect (scale 1.1)                             │    │
│  │ • 3 tamaños: small, medium (def), large                │    │
│  └────────────────────────────────────────────────────────┘    │
│                      ▲                                           │
│                      │ Click                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ChatPopup (Modal)                                      │    │
│  │ • Backdrop semi-transparent                            │    │
│  │ • Animación slideUp (0.3s)                             │    │
│  │ • 4 posiciones: bottom-right, bottom-left, etc         │    │
│  └────────────────────────────────────────────────────────┘    │
│                      │                                          │
│                      │ Renderiza                                │
│                      ▼                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ AIChat.tsx (Componente de Chat)                        │    │
│  │ • Hook: useChatLogic()                                 │    │
│  │ • Componentes memorizados (React.memo)                 │    │
│  │ • Auto-scroll al nuevo mensaje                         │    │
│  │ • Typing animation                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         │                                         │
    POST /api/openai/chat              GET /health
         │                                         │
         ▼                                         ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  server.ts (Backend)         │    │  server.ts (Health Check)    │
│                              │    │                              │
│  ┌────────────────────────┐  │    │  ┌────────────────────────┐  │
│  │ 1. Validar entrada     │  │    │  │ Status: ok             │  │
│  │ 2. Limitar histórico   │  │    │  │ Service: OpenAI        │  │
│  │    (últimos 20 msgs)   │  │    │  │ Model: gpt-4-turbo     │  │
│  │ 3. Llamar OpenAI SDK   │  │    │  │ hasApiKey: true        │  │
│  │ 4. Retornar respuesta  │  │    │  └────────────────────────┘  │
│  │ 5. Manejar errores     │  │    │                              │
│  └────────────────────────┘  │    │                              │
│                              │    │                              │
│  OpenAI SDK:                 │    │                              │
│  • model: gpt-4-turbo        │    │                              │
│  • max_tokens: 2048          │    │                              │
│  • temperature: 0.7          │    │                              │
│  • top_p: 0.9                │    │                              │
│  • system: SYSTEM_PROMPT     │    │                              │
│    (especializado APIUBL)    │    │                              │
│                              │    │                              │
└──────────────────────────────┘    └──────────────────────────────┘
         │
         │ (API call)
         ▼
┌──────────────────────────────────────────┐
│        OpenAI API (Cloud)                │
│  https://api.openai.com/v1/...          │
│                                          │
│  • GPT-4 Turbo Model                    │
│  • 128K token context window             │
│  • Latencia: 300-500ms                   │
│  • Respuestas especializadas en APIs     │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🔄 Flujo de Mensajes

```
Usuario escribe mensaje
        │
        ▼
┌──────────────────────────┐
│ AIChat.tsx               │
│ • Valida entrada         │
│ • Agrega a histórico     │
│ • Muestra texto del user │
│ • Inicia loading state   │
└──────────────────────────┘
        │
        │ POST /api/openai/chat
        │ Body: {
        │   message: "...",
        │   conversationHistory: [...]
        │ }
        ▼
┌──────────────────────────┐
│ server.ts                │
│ • Valida tipos           │
│ • Limpia histórico       │
│ • Llamada a OpenAI SDK   │
└──────────────────────────┘
        │
        │ openai.chat.completions.create()
        ▼
┌──────────────────────────────────┐
│ OpenAI API                       │
│ • Procesa con GPT-4 Turbo        │
│ • System prompt + user message   │
│ • Genera respuesta               │
│ • Retorna en JSON                │
└──────────────────────────────────┘
        │
        │ Response: {
        │   response: "Tu respuesta...",
        │   usage: {...}
        │ }
        ▼
┌──────────────────────────────────┐
│ server.ts                        │
│ • Extrae respuesta               │
│ • Envía al cliente               │
└──────────────────────────────────┘
        │
        │ JSON Response
        ▼
┌──────────────────────────────────┐
│ AIChat.tsx (useChatLogic)        │
│ • Recibe respuesta               │
│ • Agrega a histórico             │
│ • Muestra texto asistente        │
│ • Auto-scroll                    │
│ • Error handling si falla        │
└──────────────────────────────────┘
        │
        ▼
Usuario ve respuesta en popup
```

---

## 🎯 Estructura de Estado (React)

```
FloatingAIAssistant
├─ State: isOpen (boolean)
│  ├─ true → Mostrar popup
│  └─ false → Ocultar popup
│
├─ Props:
│  ├─ size: 'small' | 'medium' | 'large'
│  ├─ position: 'bottom-right' | ...
│  └─ onToggle: (isOpen: boolean) => void
│
└─ Renders:
   ├─ FloatingButton
   │  └─ onClick → setIsOpen(!isOpen)
   │
   └─ ChatPopup (open={isOpen})
      └─ AIChat
         ├─ State (useChatLogic):
         │  ├─ messages: Message[]
         │  ├─ input: string
         │  ├─ loading: boolean
         │  └─ error: string | null
         │
         ├─ Derives:
         │  └─ limitedHistory = messages.slice(-20)
         │
         └─ Callbacks:
            ├─ sendMessage()
            │  └─ POST /api/openai/chat
            │
            ├─ clearChat()
            │  └─ Reset to initial message
            │
            └─ handleKeyPress()
               └─ Enter → sendMessage()
```

---

## 🎨 Estilos CSS (Cascada)

```
FloatingAIAssistant.module.css
│
├─ .container
│  ├─ position: fixed
│  ├─ z-index: 1000
│  └─ bottom-right / bottom-left / top-right / top-left
│
├─ .floatingButton
│  ├─ width: 60px, height: 60px
│  ├─ background: linear-gradient(135deg, #667eea, #764ba2)
│  ├─ border-radius: 50%
│  └─ transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
│
├─ .floatingButton:hover
│  ├─ transform: scale(1.1)
│  └─ box-shadow: 0 8px 20px rgba(...)
│
├─ .badge
│  ├─ position: absolute (top: -8px, right: -8px)
│  ├─ animation: pulse 2s infinite
│  └─ background: linear-gradient(135deg, #f093fb, #f5576c)
│
├─ .chatPopup
│  ├─ position: fixed
│  ├─ width: 420px (desktop)
│  ├─ max-height: 600px
│  ├─ border-radius: 12px
│  ├─ box-shadow: 0 10px 40px rgba(0, 0, 0, 0.16)
│  ├─ opacity: 0 (closed)
│  └─ opacity: 1 (open) + transform
│
├─ .header
│  ├─ background: linear-gradient(135deg, #667eea, #764ba2)
│  ├─ color: white
│  ├─ padding: 16px
│  └─ border-bottom: 1px solid rgba(255, 255, 255, 0.1)
│
├─ .content
│  ├─ flex: 1
│  ├─ display: flex
│  └─ overflow: hidden
│
├─ @media (max-width: 768px)
│  ├─ width: calc(100vw - 32px)
│  └─ max-height: calc(100vh - 120px)
│
├─ @media (prefers-color-scheme: dark)
│  ├─ background: #1e1e1e
│  ├─ text: #e0e0e0
│  └─ borders: #3a3a3a
│
└─ @media (prefers-reduced-motion: reduce)
   ├─ animation: none
   └─ transition: none


AIChat.module.css
│
├─ .container
│  ├─ display: flex
│  ├─ flex-direction: column
│  └─ height: 100%
│
├─ .messagesContainer
│  ├─ flex: 1
│  ├─ overflow-y: auto
│  ├─ padding: 12px
│  └─ scrollbar-width: thin
│
├─ .message
│  ├─ display: flex
│  ├─ animation: slideIn 0.3s ease-in-out
│  └─ @apply user → align-items: flex-end
│     @apply assistant → align-items: flex-start
│
├─ .messageContent
│  ├─ display: flex
│  ├─ gap: 8px
│  ├─ max-width: 90%
│  └─ @apply user → flex-direction: row-reverse
│
├─ .text
│  ├─ padding: 8px 12px
│  ├─ border-radius: 12px
│  ├─ @apply user → background: gradient, color: white
│  └─ @apply assistant → background: #e8e8f0, color: #333
│
├─ .typing
│  ├─ display: flex
│  ├─ gap: 4px
│  └─ @apply span
│     ├─ width: 6px, height: 6px
│     ├─ background: #999
│     ├─ border-radius: 50%
│     └─ animation: typing 1.4s infinite
│
├─ .inputArea
│  ├─ display: flex
│  ├─ gap: 8px
│  ├─ padding: 12px
│  ├─ border-top: 1px solid #f0f0f0
│  └─ background: #fafafa
│
├─ .input
│  ├─ flex: 1
│  ├─ padding: 8px 12px
│  ├─ border: 1px solid #e0e0e0
│  ├─ border-radius: 8px
│  ├─ @focus → border-color: #667eea
│  └─ @focus → box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1)
│
└─ .sendButton
   ├─ background: linear-gradient(135deg, #667eea, #764ba2)
   ├─ color: white
   ├─ min-width: 44px
   ├─ border-radius: 8px
   └─ @hover → transform: translateY(-2px)
```

---

## 🔐 Flujo de Autenticación

```
1. Inicialización
   ├─ Cargar .env.local
   ├─ Leer OPENAI_API_KEY
   ├─ Crear instancia OpenAI SDK
   │  └─ new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
   └─ ✓ Cliente listo

2. Request
   ├─ Usuario envía mensaje
   ├─ Frontend valida
   ├─ POST /api/openai/chat
   └─ Backend recibe

3. Validación
   ├─ ¿Existe mensaje?
   ├─ ¿Es string?
   ├─ ¿No está vacío?
   ├─ ¿Máximo 4000 caracteres?
   ├─ ¿Histórico es array?
   └─ ✓ Válido, continuar

4. API Call
   ├─ openai.chat.completions.create({
   │  ├─ model: 'gpt-4-turbo',
   │  ├─ messages: [...],
   │  ├─ system: SYSTEM_PROMPT,
   │  ├─ max_tokens: 2048,
   │  ├─ temperature: 0.7
   │  └─ ... (auth manejado automáticamente)
   └─ ✓ Auth verificada por SDK

5. Response
   ├─ OpenAI retorna respuesta
   ├─ Extraer: response.choices[0].message.content
   ├─ Extraer: response.usage (tokens)
   └─ ✓ Respuesta válida

6. Retorno
   ├─ JSON.stringify({ response, usage })
   ├─ res.json()
   └─ ✓ Cliente recibe
```

---

## 📊 Tabla Comparativa de Componentes

| Componente | Responsabilidad | Props | State | Hooks |
|-----------|-----------------|-------|-------|-------|
| **FloatingAIAssistant** | Flotante + Modal | size, position, onToggle | isOpen | useState, useCallback |
| **FloatingButton** | Icono clickeable | isOpen, onClick, size | - | - (memo) |
| **Backdrop** | Overlay cerrador | onClick | - | - (memo) |
| **ChatPopup** | Modal container | isOpen, onClose | - | - (memo) |
| **AIChat** | Lógica de chat | endpoint, maxHistorySize, onError | (via hook) | useChatLogic, useRef, useCallback |
| **useChatLogic** | Lógica de estado | endpoint, maxHistorySize, onError | messages, input, loading, error | useState, useCallback |
| **MessageBubble** | Render mensaje | message | - | - (memo) |
| **TypingIndicator** | Loading animation | - | - | - (memo) |
| **MessageInput** | Input + button | value, onChange, onSend, onKeyPress, disabled | - | - (memo) |

---

## 🎯 Performance Optimizations

```
1. Component Memoization
   ├─ FloatingButton → React.memo()
   ├─ Backdrop → React.memo()
   ├─ ChatPopup → React.memo()
   ├─ MessageBubble → React.memo()
   ├─ TypingIndicator → React.memo()
   └─ MessageInput → React.memo()

2. Callback Optimization
   ├─ handleToggle → useCallback()
   ├─ handleClose → useCallback()
   ├─ sendMessage → useCallback()
   └─ clearChat → useCallback()

3. Backend Optimization
   ├─ Histórico limitado a 20 mensajes
   ├─ Max tokens: 2048
   ├─ Cache-friendly endpoints
   └─ Health check ligero

4. CSS Optimization
   ├─ CSS Modules (no conflictos)
   ├─ Hardware acceleration (transform)
   ├─ Lazy evaluation (media queries)
   └─ Minificación automática (Docusaurus)
```

---

## 🔗 Mapeo de URLs

```
Frontend
├─ http://localhost:3000/
│  └─ Docusaurus (Renderiza Root.tsx)
│
└─ http://localhost:3000/docs/...
   └─ Cualquier página de documentación

Backend
├─ http://localhost:3001/health
│  └─ GET → Health check JSON
│
├─ http://localhost:3001/api/openai/chat
│  └─ POST → Chat endpoint
│
└─ http://localhost:3001/api/bedrock/chat (DEPRECATED)
   └─ POST → Redirige a /api/openai/chat
```

---

## ✨ Animaciones CSS

```
@keyframes pulse
├─ 0%, 100%: scale(1)
└─ 50%: scale(1.15)

@keyframes slideIn
├─ from: opacity 0, translateY(8px)
└─ to: opacity 1, translateY(0)

@keyframes fadeIn
├─ from: opacity 0
└─ to: opacity 1

@keyframes typing
├─ 0%, 60%, 100%: opacity 0.3, translateY(0)
└─ 30%: opacity 1, translateY(-6px)
```

---

## 📚 Referencias de Documentación

```
Carpeta:
├─ OPENAI_RESUMEN.md
│  └─ Resumen ejecutivo (este archivo)
│
├─ OPENAI_IMPLEMENTATION.md
│  └─ Guía completa de implementación (400+ líneas)
│
├─ CHECKLIST_OPENAI.md
│  └─ Checklist paso-a-paso (400+ líneas)
│
└─ ARQUITECTURA_VISUAL.md
   └─ Diagramas y flujos (este archivo)
```

---

**Fin de la documentación visual** ✅
