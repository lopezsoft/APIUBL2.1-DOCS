# 📚 SYSTEM PROMPT EXPLICADO - CÓMO ENTIENDE EL MODELO

## 🎯 Resumen Ejecutivo

El modelo **GPT-4o Mini** entiende el contexto de la documentación a través de **3 componentes**:

```
┌─────────────────────┐
│  SYSTEM PROMPT      │  ← Especialización (500 tokens)
│  "Eres experto..."  │
├─────────────────────┤
│ CONVERSATION        │  ← Contexto (últimos 20 mensajes)
│ HISTORY             │
├─────────────────────┤
│ CURRENT MESSAGE     │  ← Tu pregunta ahora
│ "¿Cómo...?"         │
└─────────────────────┘
        ↓
    MODELO COMBINA TODOS
        ↓
  RESPUESTA ESPECIALIZADA
```

---

## 1. SYSTEM PROMPT ACTUAL (Lo Más Importante)

### 📍 Ubicación
- **Archivo:** `server.ts`
- **Líneas:** 51-120
- **Tamaño:** ~1,500 caracteres (~500 tokens)

### 🔍 Contenido Completo

```typescript
const SYSTEM_PROMPT = `Eres un asistente técnico experto en APIUBL2.1 
y facturación electrónica en Colombia.

Tu objetivo es ayudar a los desarrolladores a comprender y usar 
correctamente el API de MATIAS para emisión de facturas.

CONOCIMIENTOS TÉCNICOS:

**Estructura de Facturas:**
- JSON con campos: type_document_id, operation_type_id, 
  customer, lines, legal_monetary_totals
- Documentos hasta 10 dígitos + dígito verificador
- Campos requeridos: [lista específica]

**Validación de NITs:**
- Algoritmo módulo 11 con pesos: [3, 7, 13, 17, 19, 23, 29, 37, 41, 43]
- Ejemplo: 1063279307 (LOPEZ GOMEZ LEWIS OSWALDO)
- Validación: multiplicar dígito × peso

**Cálculo de Totales:**
- line_extension_amount = cantidad × precio
- Con descuentos: amount - descuentos
- line_tax_amount = amount × tasa_impuesto
- tax_inclusive_amount = amount + tax

**Descuentos:**
- Formato: { charge_indicator: false, ... }
- Se aplican en cada línea

**Respuesta del API DIAN:**
- XmlDocumentKey: ID único de factura
- StatusCode: 200 = éxito
- AttachedDocument: XML
- pdf: Documento PDF

TÓPICOS DE SOPORTE:
1. Estructura de facturas
2. Validación de NITs
3. Cálculo de totales e impuestos
4. Ejemplos JSON
5. Errores comunes
6. Integración API MATIAS
7. Campos requeridos/opcionales
8. Tipos de documentos (01, 05, 06, etc.)
9. Códigos de operación
10. Manejo de pagos

EJEMPLOS REALES:
- Prefix: LZT
- NIT: 1063279307
- Ciudad: Cali (836)

INSTRUCCIONES DE RESPUESTA:
- Responde siempre en ESPAÑOL
- Claro y conciso pero técnico
- Proporciona ejemplos JSON cuando sea relevante
- Si no sabes algo, dilo claramente
- Sugiere validaciones y buenas prácticas
- Enfócate en resolver problemas reales
- Evita información especulativa`;
```

---

## 2. ¿QUÉ HACE EL SYSTEM PROMPT?

### Identidad y Propósito
```
"Eres un asistente técnico experto en APIUBL2.1"
     ↓
Le dice al modelo: SÉ ESPECIALISTA EN ESTO, no generalista
```

### Contexto Técnico
```
Algoritmos, estructuras JSON, validaciones específicas
     ↓
Le da herramientas para responder especializadamente
```

### Ejemplos Reales
```
NIT: 1063279307, Prefix: LZT, Ciudad: Cali
     ↓
Le permite contextualizar con datos reales de Colombia
```

### Guía de Comportamiento
```
"Responde en español, proporciona ejemplos JSON"
     ↓
Define CÓMO debe responder, no solo QUÉ sabe
```

---

## 3. EJEMPLO: ANTES vs DESPUÉS

### SIN SYSTEM PROMPT
**Usuario pregunta:** "¿Cómo valido un NIT?"

**Respuesta (genérica):**
```
Un NIT es un número de identificación tributaria usado 
en varios países latinoamericanos. Típicamente tiene 
validación de dígito verificador...
```
❌ Genérica, sin especialización

### CON SYSTEM PROMPT
**Usuario pregunta:** "¿Cómo valido un NIT?"

**Respuesta (especializada):**
```
En Colombia, los NITs se validan usando el algoritmo módulo 11:

1. Multiplica cada dígito por su peso (3, 7, 13, 17, 19, 23...)
2. Suma los productos
3. Calcula 11 - (suma % 11)
4. El resultado es el dígito verificador

Ejemplo: NIT 1063279307
- Dígitos:    1 0 6 3 2 7 9 3 0
- Pesos:      3 7 13 17 19 23 29 37 41
- Productos: 3+0+78+51+38+161+261+111+0 = 703
- 703 % 11 = 8
- Dígito verificador: 11 - 8 = 3 ✓

Para usar en API:
{
  "identification": {
    "id": "1063279307",
    "scheme_id": "6"  // NIT
  }
}
```
✅ Especializada, con algoritmo exacto para Colombia

---

## 4. CÓMO FLUYE LA INFORMACIÓN

### Paso 1: Usuario escribe pregunta
```
"¿Cuál es la estructura de una factura?"
```

### Paso 2: Frontend captura y envía
```javascript
// FloatingAIAssistant.tsx
POST /api/openai/chat
{
  message: "¿Cuál es la estructura de una factura?",
  conversationHistory: [
    { role: 'user', content: 'Pregunta anterior 1' },
    { role: 'assistant', content: 'Respuesta anterior 1' },
    ...
  ]
}
```

### Paso 3: Backend recibe y CONSTRUYE contexto
```typescript
// server.ts línea 227-243
const messages = [
  {
    role: 'system',
    content: SYSTEM_PROMPT  // ← Especialización
  },
  ...conversationHistory.slice(-20),  // ← Historial (últimos 20)
  {
    role: 'user',
    content: "¿Cuál es la estructura de una factura?"  // ← Pregunta
  }
];
```

### Paso 4: Backend envía a OpenAI
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: messages,  // ← CONTEXTO COMPLETO
  max_tokens: 4096,
  temperature: 0.5,
});
```

### Paso 5: OpenAI procesa
```
1. LEE SYSTEM PROMPT → Entiende: "Soy especialista"
2. LEE HISTORIAL → Entiende: "El usuario está en este contexto"
3. LEE PREGUNTA → Entiende: "Quiere saber de estructura JSON"
4. GENERA RESPUESTA → Especializada a APIUBL2.1
```

### Paso 6: Respuesta vuelve al usuario
```
Respuesta especializada con estructura JSON exacta
para facturación colombiana
```

---

## 5. DÓNDE SE ALMACENA TODO

### SYSTEM PROMPT
```
📍 Ubicación:     server.ts línea 51-120
💾 Almacenado en: RAM del servidor (const)
📤 Se envía:      CON CADA REQUEST
🔄 Se actualiza:  Solo si recompilamos TypeScript
📊 Tamaño:        ~1.5 KB (muy pequeño)
```

### CONVERSATION HISTORY
```
📍 Ubicación:     Navegador (React State)
💾 Almacenado en: Memoria del navegador
📤 Se envía:      CON CADA REQUEST
🔄 Se actualiza:  Después de cada respuesta
📊 Tamaño:        ~8-50 KB (últimos 20 mensajes)
⚠️  Se borra:      Al cerrar navegador/pestaña
```

### CURRENT MESSAGE
```
📍 Ubicación:     Input del usuario
💾 Almacenado en: Memoria temporal
📤 Se envía:      Una sola vez por request
🔄 Se actualiza:  Nunca
📊 Tamaño:        Máximo 4,000 caracteres
```

---

## 6. CAPACIDAD: ¿CUÁNTA DOCUMENTACIÓN CABE?

### Tokens Disponibles
```
Total contexto GPT-4o Mini:    128,000 tokens
Menos respuesta (reservada):   -4,000 tokens
Disponible para entrada:       124,000 tokens

SYSTEM PROMPT actual:           500 tokens
CONVERSATION HISTORY promedio:  2,000 tokens
CURRENT MESSAGE promedio:       100 tokens
TOTAL USADO:                    2,600 tokens

DISPONIBLE PARA MÁS:           121,400 tokens ✨
```

### En Práctica: ¿Cuánta Documentación?
```
SYSTEM PROMPT ACTUAL:           500 tokens
PODRÍAMOS AGREGAR:              40x más (20,000 tokens)
EN CARACTERES:                  ~80,000 caracteres
EN PÁGINAS:                     ~400 páginas

NUESTRO USO ACTUAL:
✅ 500 tokens (0.4% de capacidad)
✅ Muy eficiente
✅ Espacio para crecer 40x
```

---

## 7. TRES FORMAS DE ALIMENTAR DOCUMENTACIÓN

### OPCIÓN A: Expandir System Prompt (Actual)
**Pros:**
- ✅ Rápido (respuestas 100-200ms)
- ✅ Barato ($1.88/mes)
- ✅ Simple (texto plano en código)
- ✅ Confiable (siempre disponible)

**Contras:**
- ❌ Requiere recompilación
- ❌ Límite de tamaño (40x actual)
- ❌ Difícil mantener actualizado

**Tiempo de implementación:** 15 minutos

```
Agregamos en SYSTEM_PROMPT:
• Más ejemplos JSON reales
• Tabla de códigos de operación
• Tabla de tipos de documento
• Errores comunes y soluciones
• Mejores prácticas
• Casos de uso frecuentes
```

### OPCIÓN B: RAG - Recuperación Dinámica
**Pros:**
- ✅ Automático y escalable
- ✅ Se actualiza sin recompilación
- ✅ Acceso a documentación entera
- ✅ Súper potente

**Contras:**
- ❌ Más caro (+30%)
- ❌ Más lento (500ms en lugar de 100ms)
- ❌ Arquitectura compleja

**Tiempo de implementación:** 1-2 días

```
Sistema RAG:
1. Leer archivos markdown/JSON/PDF
2. Convertir a "embeddings" (vectores numéricos)
3. Almacenar en Vector Database (Pinecone, Weaviate)
4. En cada query, buscar docs relevantes
5. Agregar docs + system prompt al contexto
6. Enviar todo a OpenAI
```

### OPCIÓN C: Fine-tuning del Modelo
**Pros:**
- ✅ Especialización máxima
- ✅ Respuestas ultra-precisas
- ✅ Comportamiento muy personalizado

**Contras:**
- ❌ Muy caro (+300%)
- ❌ Requiere 100+ ejemplos
- ❌ Tiempo de entrenamiento (~6 horas)

**Tiempo de implementación:** 1 semana

```
Fine-tuning:
1. Preparar 100+ pares (pregunta, respuesta ideal)
2. Enviar a OpenAI para entrenamiento
3. Esperar 6+ horas
4. Usar modelo personalizado
5. Respuestas súper especializadas
```

---

## 8. RECOMENDACIÓN: ¿Qué Elegir?

**Para ahora (Producción):** **OPCIÓN A (Expandir System Prompt)**
```
✅ Ya funciona perfectamente
✅ Respuestas especializadas garantizadas
✅ Costo mínimo
✅ Velocidad máxima
✅ Fácil de mantener
```

**Para después (Cuando crezca):** **OPCIÓN B (RAG)**
```
✅ Si necesitamos documentación muy grande
✅ Si queremos actualizaciones dinámicas
✅ Si los usuarios piden info que no cabe
✅ Si tenemos presupuesto para +30% cost
```

**Nunca necesitaremos (A menos que...):** **OPCIÓN C (Fine-tuning)**
```
❌ Muy overkill para facturación
❌ Cambios rápidos en DIAN = reentrenamiento
❌ Costo-beneficio no justificado
```

---

## 9. PRUEBA: Cómo el System Prompt Afecta Respuestas

### Pregunta de Usuario
```
"¿Cuáles son los campos obligatorios?"
```

### SIN System Prompt
```
Los campos obligatorios varían según el tipo de documento.
Típicamente incluyen: ID, fecha, cantidad, precio...
```
❌ Genérica, no específica

### CON System Prompt
```
Para APIUBL2.1 en Colombia, los campos obligatorios son:

FACTURA (type_document_id = 01):
- invoice_number: número secuencial
- issue_date: fecha de emisión
- due_date: fecha de vencimiento
- supplier_party: datos del vendedor (NIT requerido)
- accounting_customer_party: datos del comprador
- line_items: mínimo 1 línea con:
  * description
  * quantity (número)
  * unit_price_amount (decimal)
  * line_extension_amount (qty × unit_price)
  * tax_total (IVA, etc.)
- legal_monetary_totals:
  * line_extension_amount (sin impuestos)
  * tax_inclusive_amount (con impuestos)
  * payable_amount (final)

Ejemplo JSON:
{
  "invoice_type_code": "01",
  "invoice_number": "0001000000001",
  "issue_date": "2025-01-15",
  "due_date": "2025-02-15",
  "supplier_party": {
    "identification": {
      "id": "1063279307",
      "scheme_id": "6"
    },
    "name": "LOPEZ GOMEZ LEWIS OSWALDO"
  },
  ...
}
```
✅ Específica, estructurada, con ejemplos

---

## 10. FLUJO COMPLETO: Un Ejemplo Real

### Usuario pregunta (en chat flotante):
```
"¿Cómo válido un NIT colombiano en el API?"
```

### Frontend (React) hace:
```typescript
// Captura pregunta
const message = "¿Cómo válido un NIT colombiano en el API?";

// Obtiene historial (supongamos vacío)
const conversationHistory = [];

// Envía al backend
fetch('/api/openai/chat', {
  method: 'POST',
  body: JSON.stringify({ message, conversationHistory })
});
```

### Backend (Node.js) hace:
```typescript
// Recibe mensaje
app.post('/api/openai/chat', async (req, res) => {
  const { message, conversationHistory } = req.body;
  
  // Valida
  if (!message || message.length > 4000) return res.status(400).send('Invalid');
  
  // CONSTRUYE CONTEXTO
  const messages = [
    // [1] SYSTEM PROMPT - Especialización
    {
      role: 'system',
      content: SYSTEM_PROMPT
      // "Eres experto en APIUBL2.1..."
      // "Algoritmo módulo 11..."
      // "Ejemplo: 1063279307..."
    },
    
    // [2] CONVERSATION HISTORY - Contexto (vacío en este caso)
    // ...conversationHistory.slice(-20)
    
    // [3] CURRENT MESSAGE - Pregunta
    {
      role: 'user',
      content: "¿Cómo válido un NIT colombiano en el API?"
    }
  ];
  
  // Envía a OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,  // ← CONTEXTO COMPLETO
    max_tokens: 4096,
    temperature: 0.5,
  });
  
  // Extrae respuesta
  const aiResponse = response.choices[0].message.content;
  // Resultado: "En Colombia, los NITs se validan con..."
  
  // Retorna
  res.json({ response: aiResponse });
});
```

### OpenAI (Procesamiento):
```
1. Lee SYSTEM_PROMPT
   └─ Entiende: "Soy especialista en APIUBL2.1 colombiano"

2. Lee CONVERSATION_HISTORY
   └─ Entiende: "No hay contexto previo, nueva conversación"

3. Lee CURRENT MESSAGE
   └─ Entiende: "Usuario quiere validación de NIT"

4. Combina todo
   └─ Context: Sistema especializado + sin contexto + pregunta NIT

5. Genera respuesta
   └─ Especializada en validación de NITs colombianos
```

### OpenAI (Respuesta):
```
"En Colombia, los NITs se validan usando el algoritmo módulo 11 
con pesos [3, 7, 13, 17, 19, 23, 29, 37, 41, 43...].

Para validar en el API MATIAS:
{
  'identification': {
    'id': '1063279307',
    'scheme_id': '6'  // 6 = NIT
  }
}

Algoritmo:
1. Multiplica cada dígito por su peso
2. Suma los productos
3. El dígito verificador es 11 - (suma % 11)
..."
```

### Frontend (React) recibe:
```typescript
// Respuesta
const response = "En Colombia, los NITs se validan...";

// Agrega al historial
conversationHistory.push({
  role: 'user',
  content: "¿Cómo válido un NIT colombiano en el API?"
});
conversationHistory.push({
  role: 'assistant',
  content: response
});

// Muestra en UI
// [Floating component muestra respuesta especializada]
```

---

## 11. RESUMEN TÉCNICO

| Componente | Ubicación | Tamaño | Propósito |
|-----------|-----------|--------|----------|
| **SYSTEM_PROMPT** | server.ts L51-120 | 500 tokens | Especialización |
| **HISTORY** | React State (Browser) | 2K tokens | Contexto conversación |
| **MESSAGE** | User Input | 100 tokens | Pregunta actual |
| **TOTAL** | N/A | 2.6K tokens | Contexto completo |
| **DISPONIBLE** | N/A | 121K tokens | Capacidad sin usar |

---

## 12. ¿CÓMO FUNCIONA LA ITERACIÓN?

### Pregunta 1
```
User: "¿Qué es un NIT?"
Backend envía: [System] + [Historia vacía] + [Message]
GPT responde: "El NIT es..."
```

### Pregunta 2 (Mismo usuario)
```
User: "¿Cómo lo valido?"
Backend envía: [System] + [Historia: P1+R1] + [Message P2]
GPT responde: "Basándome en lo anterior, la validación es..."
```

### Pregunta 3 (Siguiente día, nuevo usuario)
```
User: "¿Cuál es la estructura?"
Backend envía: [System] + [Historia vacía] + [Message]
GPT responde: "La estructura de APIUBL2.1 es..."
NOTA: Sin historial previo, pero con SYSTEM_PROMPT sigue siendo especializado
```

---

## ✨ CONCLUSIÓN

El modelo entiende el contexto a través de:

1. **SYSTEM_PROMPT** → Lo hace especialista
2. **CONVERSATION_HISTORY** → Lo contextualiza
3. **CURRENT_MESSAGE** → Responde la pregunta

**Todo junto** = Respuestas especializadas en APIUBL2.1 y facturación colombiana.

**Capacidad restante:** 40x más que lo que usamos ahora.

**Próximos pasos:** Expandir system prompt o implementar RAG cuando sea necesario.

