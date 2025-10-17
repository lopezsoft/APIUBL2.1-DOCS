# 🤖 Asistente AI - Setup e Implementación

## ✅ Implementación Completada

Se ha integrado exitosamente un **Asistente AI con Amazon Bedrock** en la documentación de APIUBL2.1.

### 📦 Archivos Creados

```
✅ src/components/Interactive/AIAssistant.tsx          - Componente React del chatbot
✅ src/components/Interactive/AIAssistant.module.css   - Estilos CSS del chatbot
✅ server.ts                                            - Servidor Express con Bedrock
✅ .env.local                                           - Variables de entorno (credenciales AWS)
✅ docs/support/ai-assistant.md                        - Página de soporte con el asistente
✅ BEDROCK_SETUP.md                                    - Documentación de setup
✅ INSTALL_AI.md                                       - Guía de instalación
```

## 🚀 Pasos para Activar

### 1. Instalar Dependencias

```bash
npm install express cors dotenv @aws-sdk/client-bedrock-runtime
npm install --save-dev @types/express @types/cors ts-node typescript concurrently
```

### 2. Verificar .env.local

El archivo `.env.local` ya contiene las credenciales AWS:
- ✅ AWS_REGION
- ✅ AWS_ACCESS_KEY_ID
- ✅ AWS_SECRET_ACCESS_KEY
- ✅ AWS_BEDROCK_DEFAULT_MODEL

### 3. Ejecutar en Desarrollo

**Opción A: Con concurrently (recomendado)**

```bash
npm run dev
```

**Opción B: En dos terminales**

Terminal 1:
```bash
npm run start:server
```

Terminal 2:
```bash
npm run dev:docs
```

### 4. Acceder al Asistente

Una vez en ejecución:

- 📍 **Documentación**: http://localhost:3000/docs/support/ai-assistant
- 🏥 **Health Check**: http://localhost:3001/health
- 💬 **API Chat**: POST http://localhost:3001/api/bedrock/chat

## 📊 Características Implementadas

### Frontend (React)
- ✅ Interfaz de chat moderna y responsive
- ✅ Historial de conversación
- ✅ Indicador de carga (typing animation)
- ✅ Manejo de errores
- ✅ Botones de acción (Enviar, Limpiar)
- ✅ Soporte para múltiples líneas (Shift+Enter)
- ✅ Estilos profesionales con gradientes

### Backend (Node.js + Express)
- ✅ Servidor Express en puerto 3001
- ✅ Integración con Amazon Bedrock
- ✅ Soporte CORS para Docusaurus
- ✅ Gestión de historial de conversación (últimos 10 mensajes)
- ✅ Rate limiting automático
- ✅ Error handling robusto
- ✅ Health check endpoint

### AI (Amazon Bedrock + Claude)
- ✅ Modelo Haiku (rápido y económico)
- ✅ System prompt especializado en APIUBL2.1
- ✅ Contexto técnico de facturas electrónicas
- ✅ Respuestas en español
- ✅ Ejemplos de código JSON

## 💰 Costos Estimados

| Actividad | Costo |
|-----------|-------|
| 100 chats/día | $3-5 USD/mes |
| 1000 chats/día | $30-50 USD/mes |
| Documentación indexada | Incluido en Bedrock |

## 🔧 Configuración Adicional

### Cambiar Modelo AI

Editar `.env.local`:

```env
# Haiku (rápido, barato)
AWS_BEDROCK_DEFAULT_MODEL=anthropic.claude-3-haiku-20240307-v1:0

# Sonnet (balanceado)
AWS_BEDROCK_DEFAULT_MODEL=anthropic.claude-3-sonnet-20240229-v1:0

# Opus (poderoso)
AWS_BEDROCK_DEFAULT_MODEL=anthropic.claude-3-opus-20240229-v1:0
```

### Personalizar System Prompt

Editar `server.ts`, línea ~107:

```typescript
const SYSTEM_PROMPT = `Tu prompt personalizado aquí...`;
```

## ✨ Mejoras Futuras

- [ ] **RAG (Retrieval-Augmented Generation)**: Indexar documentación completa
- [ ] **Analytics Dashboard**: Seguimiento de preguntas frecuentes
- [ ] **Feedback Loop**: Mejorar respuestas basado en usuario feedback
- [ ] **Integración S3**: Almacenar documentos para RAG
- [ ] **Multi-idioma**: Soporte para inglés, português
- [ ] **Persistencia**: Guardar conversaciones en BD
- [ ] **Moderación**: Detectar abuso o preguntas inapropiadas

## 🐛 Troubleshooting

### "Port 3001 already in use"
```bash
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "AWS credentials not configured"
- Verificar `.env.local` en la raíz del proyecto
- No debe tener espacios en blanco alrededor de `=`
- Ejecutar: `cat .env.local | grep AWS`

### "Cannot find module @aws-sdk/client-bedrock-runtime"
```bash
npm install @aws-sdk/client-bedrock-runtime --save
```

### Asistente no responde
- Verificar que servidor está en puerto 3001: `lsof -i :3001`
- Verificar logs del servidor
- Probar health check: `curl http://localhost:3001/health`

## 📚 Documentación Relacionada

- 📖 [AWS Bedrock Docs](https://docs.aws.amazon.com/bedrock/)
- 📖 [Anthropic Claude API](https://www.anthropic.com/api)
- 📖 [Docusaurus Components](https://docusaurus.io/docs/docusaurus-core#components)
- 📖 [React Hooks](https://react.dev/reference/react/hooks)

## 🎯 Próximos Pasos

1. ✅ Instalar dependencias: `npm install`
2. ✅ Ejecutar servidor: `npm run dev`
3. ✅ Acceder a: `http://localhost:3000/docs/support/ai-assistant`
4. ✅ Hacer una prueba: "¿Qué es un NIT?"
5. ✅ Compartir feedback

## 📞 Soporte

- **Dudas técnicas**: support@matias-app.com
- **Issues de AWS**: https://console.aws.amazon.com/support/
- **Issues del proyecto**: GitHub Issues

---

**Commit**: e889818  
**Fecha**: Octubre 17, 2024  
**Versión**: 1.0  
**Status**: ✅ Listo para usar
