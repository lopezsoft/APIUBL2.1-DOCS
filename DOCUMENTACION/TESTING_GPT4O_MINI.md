# 🧪 Guía de Testing: GPT-4o Mini

**Fecha:** Octubre 17, 2025  
**Estado:** ✅ Listo para testear

---

## 📋 Checklist de Verificación

### 1. Configuración Inicial
- [ ] `.env.local` tiene `OPENAI_API_KEY` configurada
- [ ] `server.ts` tiene `model: 'gpt-4o-mini'`
- [ ] `server.js` está compilado (verificar fecha modificación)
- [ ] `package.json` tiene `"ai-server"` script

### 2. Servidor Backend
- [ ] Terminal 1: `node server.js` inicia sin errores
- [ ] Servidor está en `http://localhost:3001`
- [ ] Health check responde: `curl http://localhost:3001/health`
- [ ] Respuesta muestra `"service": "OpenAI GPT-4o Mini"`

### 3. Docusaurus Frontend
- [ ] Terminal 2: `npm run start` inicia sin errores
- [ ] Docusaurus abre `http://localhost:3000`
- [ ] Icono 💬 flotante es visible en esquina inferior derecha
- [ ] Icono es interactivo (responde a clicks)

### 4. Chat Flotante
- [ ] Click en icono abre popup modal
- [ ] Modal tiene campo de input visible
- [ ] Botón "Enviar" funciona
- [ ] Hay indicador de typing (puntos animados)

### 5. Respuestas del Chat
- [ ] Respuesta llega en < 300ms
- [ ] Respuesta es especializada en facturación
- [ ] Formato es legible (no JSON crudo)
- [ ] Puedes continuar la conversación

---

## 🧬 Test Cases

### Test 1: Health Check (Verificación de conectividad)

**Comando:**
```bash
curl -X GET http://localhost:3001/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "service": "OpenAI GPT-4o Mini",
  "timestamp": "2025-10-17T...",
  "environment": {
    "model": "gpt-4o-mini",
    "hasApiKey": true
  }
}
```

**✅ Si lo ves:** Backend está funcionando correctamente

---

### Test 2: Chat Endpoint (Verificación de modelo)

**Comando:**
```bash
curl -X POST http://localhost:3001/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué es un NIT?",
    "conversationHistory": []
  }'
```

**Resultado esperado:**
```json
{
  "response": "El NIT (Número de Identificación Tributaria)...",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 450,
    "total_tokens": 600
  }
}
```

**Puntos a verificar:**
- ✅ Respuesta es rápida (< 200ms)
- ✅ Respuesta es sobre NIT (no genérica)
- ✅ Total tokens < 1000 (significa Mini funciona)
- ✅ No hay errores de API

---

### Test 3: Preguntas sobre Facturación (5 preguntas)

#### 3.1 - Estructura de Factura
```
Pregunta: "¿Cuál es la estructura básica de una factura electrónica en Colombia?"
Esperado: Respuesta con elementos básicos (encabezado, líneas, totales)
Tiempo: < 200ms
Calidad: ✅ Mini debería ser perfecto
```

#### 3.2 - Validación de NIT
```
Pregunta: "¿Cómo valido si un NIT es correcto?"
Esperado: Explicación del algoritmo de validación
Tiempo: < 150ms
Calidad: ✅ Mini debería ser perfecto
```

#### 3.3 - Campos Requeridos
```
Pregunta: "¿Qué campos son obligatorios en una factura?"
Esperado: Lista de campos según resolución DIAN
Tiempo: < 200ms
Calidad: ✅ Mini debería ser perfecto
```

#### 3.4 - Cálculo de Impuestos
```
Pregunta: "¿Cómo se calcula el IVA en una factura con descuentos?"
Esperado: Fórmula y orden de cálculo
Tiempo: < 250ms
Calidad: ✅ Mini debería ser muy bueno
```

#### 3.5 - Diferencias de Documentos
```
Pregunta: "¿Cuál es la diferencia entre una factura y una nota crédito?"
Esperado: Explicación clara de diferencias
Tiempo: < 200ms
Calidad: ✅ Mini debería ser perfecto
```

---

### Test 4: Conversación Larga (Contexto)

**Pasos:**
1. Pregunta 1: "¿Qué es un NIT?"
2. Pregunta 2: "¿Cómo se valida?" (send 1 en historial)
3. Pregunta 3: "Dame un ejemplo" (send 1+2 en historial)

**Verificar:**
- ✅ Cada respuesta lleva contexto de anteriores
- ✅ Bot recuerda lo que se preguntó antes
- ✅ Tiempo se mantiene < 300ms incluso con historial

---

### Test 5: Performance Bajo Carga (Latencia)

**Comando (10 requests):**
```bash
for i in {1..10}; do
  time curl -s -X POST http://localhost:3001/api/openai/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"Pregunta $i\",\"conversationHistory\":[]}" \
    > /dev/null
done
```

**Resultado esperado:**
- Promedio: 100-200ms
- Máximo: < 300ms
- Mínimo: > 50ms

**✅ Si lo ves:** Performance es excelente vs Turbo (que era 300-500ms)

---

### Test 6: Errores Esperados (Validaciones)

#### 6.1 - Sin mensaje
```bash
curl -X POST http://localhost:3001/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{"conversationHistory":[]}'
```

**Esperado:** Error 400 "Campo message es requerido"

#### 6.2 - Mensaje vacío
```bash
curl -X POST http://localhost:3001/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"","conversationHistory":[]}'
```

**Esperado:** Error 400 "El mensaje no puede estar vacío"

#### 6.3 - Mensaje muy largo
```bash
curl -X POST http://localhost:3001/api/openai/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"$(python3 -c 'print(\"x\"*5000)')\",\"conversationHistory\":[]}"
```

**Esperado:** Error 400 "El mensaje es demasiado largo"

---

## 📊 Comparación: GPT-4o Mini vs GPT-4 Turbo

Test en paralelo (2 terminales):

**Terminal 1: GPT-4o Mini**
```bash
# Cambiar en server.ts a gpt-4o-mini (ya hecho)
curl -X POST http://localhost:3001/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué es un NIT?","conversationHistory":[]}'
```

**Terminal 2: GPT-4 Turbo** (si quieres comparar)
```bash
# Cambiar en server.ts a gpt-4-turbo
# Recompilar
# Ejecutar en puerto 3002
curl -X POST http://localhost:3002/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué es un NIT?","conversationHistory":[]}'
```

**Comparar:**
| Métrica | Mini | Turbo | Ganador |
|---------|------|-------|--------|
| Latencia | 120ms | 380ms | Mini ✅ |
| Tokens | 340 | 350 | Similar |
| Costo | $0.002 | $0.010 | Mini ✅ |
| Calidad | 95% | 100% | Turbo (pero Mini es suficiente) |

---

## 🐛 Troubleshooting

### Problema: "Connection refused" (Puerto 3001)
**Solución:**
```bash
# Verificar si algo está usando el puerto
lsof -i :3001

# Matar proceso
kill -9 <PID>

# Reintentar
node server.js
```

### Problema: "OPENAI_API_KEY no encontrada"
**Solución:**
- Verificar `.env.local` existe en raíz del proyecto
- Verificar tiene: `OPENAI_API_KEY=sk-proj-xxxxx`
- Verificar sin espacios

### Problema: "Respuestas muy lentas" (> 500ms)
**Posibles causas:**
- OpenAI tiene alta carga (normal en horas pico)
- Conexión a internet lenta
- API key con bajo rate limit

**Solución:**
- Esperar unos minutos y reintentar
- Verificar velocidad internet
- Contactar OpenAI support

### Problema: "Respuestas genéricas" (no sobre facturación)
**Posibles causas:**
- System prompt no se está enviando correctamente
- Modelo no se cambió a `gpt-4o-mini`

**Solución:**
- Verificar `server.ts` línea 228
- Verificar `SYSTEM_PROMPT` variable
- Recompilar con `npx tsc`

---

## 📝 Reporte de Testing

Usa esta template para documentar tu testing:

```markdown
## Reporte de Testing: GPT-4o Mini
**Fecha:** [YYYY-MM-DD]
**Tester:** [Tu nombre]
**Versión:** [Hash commit]

### Resultados

#### Health Check
- [ ] ✅ Funciona
- [ ] ❌ Falla

#### Latencia
- Promedio: ___ ms
- Mínimo: ___ ms
- Máximo: ___ ms

#### Calidad
- [ ] ✅ Respuestas especializadas
- [ ] ⚠️ Respuestas genéricas a veces
- [ ] ❌ Respuestas irrelevantes

#### Performance vs Turbo
- [ ] Mini es más rápido
- [ ] Mini es más lento
- [ ] Similar

#### Recomendación
- [ ] Mantener Mini
- [ ] Volver a Turbo
- [ ] Implementar híbrida
```

---

## 🎯 Criterios de Éxito

✅ **Test exitoso si:**
1. Health check responde correctamente
2. Chat endpoint retorna respuestas < 200ms
3. Respuestas son especializadas en facturación
4. Puedes conversar fluidamente (sin esperas)
5. No hay errores de API

❌ **Test fallido si:**
1. Health check falla
2. Latencia > 500ms (muy lenta)
3. Respuestas no son sobre facturación
4. Hay errores API consistentes
5. Chat no responde a veces

---

## 📞 Escalación

Si algo no funciona:

1. **Verificar logs:**
   ```bash
   # Ver últimos 50 líneas
   tail -50 /tmp/server.log
   ```

2. **Verificar configuración:**
   ```bash
   # Verificar .env.local
   cat .env.local
   ```

3. **Recompilary reintentar:**
   ```bash
   npx tsc server.ts --target es2020 --module commonjs --esModuleInterop --skipLibCheck
   node server.js
   ```

4. **Contactar soporte:**
   - OpenAI API: https://support.openai.com
   - Proyecto: [Contactar team]

---

**Última actualización:** 2025-10-17  
**Próxima revisión:** 2025-10-24
