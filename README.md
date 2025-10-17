# MATIAS API - GPT-4o Mini Chatbot Documentation

Este proyecto es una **plataforma de documentación integrada con un asistente de IA especializado en APIUBL2.1 y facturación electrónica colombiana**.

## 🚀 Inicio Rápido

Para ejecutar el sistema completo, necesitas **2 terminales**:

### Terminal 1 - Frontend (Docusaurus)
```bash
npm start
```
Se abre en: http://localhost:3000

### Terminal 2 - Backend (OpenAI API)
```bash
npm run ai-server:dev
```
Se ejecuta en: http://localhost:3001

---

## 📚 Documentación

**Toda la documentación está organizada en:** [`/DOCUMENTACION`](./DOCUMENTACION/)

### Comienza Aquí 👇

1. **[README_RAPIDO.md](./DOCUMENTACION/README_RAPIDO.md)** - 2 minutos
   - Lo más importante: cómo ejecutar TODO en 2 minutos

2. **[GUIA_INICIO_RAPIDO.md](./DOCUMENTACION/GUIA_INICIO_RAPIDO.md)** - 10 minutos
   - Guía completa paso-a-paso

3. **[DOCUMENTACION/README.md](./DOCUMENTACION/README.md)** - Índice Completo
   - Todas las guías organizadas por tema

---

## ⚙️ Requisitos

- **Node.js:** 18.0+
- **npm:** 9.0+
- **API Key OpenAI:** https://platform.openai.com/api-keys

---

## 🔧 Configuración

1. Crea archivo `.env.local` en la raíz:
```
OPENAI_API_KEY=sk-proj-tu-clave-aqui
NODE_ENV=development
PORT=3001
```

2. Reemplaza `sk-proj-tu-clave-aqui` con tu **API Key real**

---

## 📦 Scripts Disponibles

```bash
# FRONTEND
npm start                 # Desarrollo (puerto 3000)
npm run build            # Build producción
npm run serve            # Sirve build

# BACKEND
npm run ai-server:dev    # Desarrollo (puerto 3001)
npm run ai-server:prod   # Producción
npm run ai-server:build  # Compila TypeScript

# OTROS
npm run typecheck        # Verifica tipos
npm run clear           # Limpia caché
```

---

## ✅ Verificación

```bash
# Health check del backend
curl http://localhost:3001/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "service": "OpenAI GPT-4o Mini",
  "environment": { "model": "gpt-4o-mini" }
}
```

---

## 📖 Documentación Disponible

| Archivo | Duración | Descripción |
|---------|----------|-------------|
| [README_RAPIDO.md](./DOCUMENTACION/README_RAPIDO.md) | 2 min | **COMIENZA AQUÍ** |
| [GUIA_INICIO_RAPIDO.md](./DOCUMENTACION/GUIA_INICIO_RAPIDO.md) | 10 min | Guía completa |
| [SERVIDOR_CONFIGURACION.md](./DOCUMENTACION/SERVIDOR_CONFIGURACION.md) | 15 min | Config avanzada |
| [SYSTEM_PROMPT_EXPLICADO.md](./DOCUMENTACION/SYSTEM_PROMPT_EXPLICADO.md) | 20 min | Cómo funciona la IA |
| [GPT4O_MINI_MIGRATION.md](./DOCUMENTACION/GPT4O_MINI_MIGRATION.md) | 15 min | Análisis del modelo |
| [TESTING_GPT4O_MINI.md](./DOCUMENTACION/TESTING_GPT4O_MINI.md) | 30 min | Tests completos |

**👉 Ver todas en:** [DOCUMENTACION/README.md](./DOCUMENTACION/README.md)

---

## 🎯 Estructura del Proyecto

```
APIUBL2.1-DOCS/
├── DOCUMENTACION/          ← 📚 Toda la documentación aquí
│   ├── README.md           ← Índice maestro
│   ├── README_RAPIDO.md    ← COMIENZA AQUÍ
│   ├── GUIA_INICIO_RAPIDO.md
│   ├── SERVIDOR_CONFIGURACION.md
│   ├── SYSTEM_PROMPT_EXPLICADO.md
│   └── ... (18 más)
│
├── src/                    ← Frontend (Docusaurus + React)
│   ├── components/
│   │   └── Interactive/    ← Componentes del chat AI
│   ├── css/
│   └── pages/
│
├── api/                    ← Backend (Express + OpenAI)
│   └── bedrock/
│
├── docs/                   ← Contenido de documentación
├── blog/                   ← Blog
│
├── server.ts               ← Backend principal (TypeScript)
├── server.js               ← Backend compilado (JavaScript)
├── package.json
├── docusaurus.config.ts
└── tsconfig.json
```

---

## 🌐 Endpoints Disponibles

### Health Check
```bash
GET http://localhost:3001/health
```

### Chat
```bash
POST http://localhost:3001/api/openai/chat

Body:
{
  "message": "¿Cómo valido un NIT?",
  "conversationHistory": [
    { "role": "user", "content": "Hola" },
    { "role": "assistant", "content": "Hola! ¿Cómo estás?" }
  ]
}
```

---

## 🎨 Tecnologías

- **Frontend:** Docusaurus 3.8.1, React 19, TypeScript
- **Backend:** Express.js, Node.js, OpenAI SDK v4
- **Modelo:** GPT-4o Mini (128K tokens)
- **Build:** TypeScript → JavaScript (es2020)
- **Estilos:** CSS Modules con tema azul personalizado

---

## 🐛 Problemas Comunes

| Problema | Solución |
|----------|----------|
| `OPENAI_API_KEY no existe` | Crear `.env.local` con tu API key |
| Puerto 3000/3001 en uso | Cambiar PORT en `.env.local` |
| Chat no responde | Verificar health check: `curl http://localhost:3001/health` |
| Estilos no cargan | Hacer hard refresh: `Ctrl+F5` |

---

## 📊 Estado del Proyecto

- ✅ Backend operacional (GPT-4o Mini)
- ✅ Frontend operacional (Docusaurus + React)
- ✅ Chat integrado y funcional
- ✅ Documentación completa (20 archivos)
- ✅ Listo para producción

---

## 📝 Licencia

Todos los derechos reservados © 2025 LOPEZSOFT SAS

---

## 📞 Soporte

Para más información, lee la documentación en [`/DOCUMENTACION`](./DOCUMENTACION/) o consulta [DOCUMENTACION/README.md](./DOCUMENTACION/README.md)

**👉 [Comienza aquí: README_RAPIDO.md](./DOCUMENTACION/README_RAPIDO.md)**

