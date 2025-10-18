# 🤖 Guía de Integración del Agente de IA con Matias Docs

## 🎯 Objetivo

Conectar tu agente de IA (ChatGPT, Claude, LLaMA, etc.) con la documentación de Matias API para que pueda:
- Buscar información en la documentación
- Acceder a especificaciones técnicas
- Proporcionar respuestas contextualizadas basadas en DIAN
- Resolver consultas normativas

---

## 📋 Tabla de Contenidos

1. [Arquitectura de Integración](#arquitectura-de-integración)
2. [APIs Disponibles](#apis-disponibles)
3. [Ejemplos de Integración](#ejemplos-de-integración)
4. [Testing](#testing)
5. [Optimizaciones](#optimizaciones)

---

## 🏗️ Arquitectura de Integración

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENTE DE IA                              │
│              (ChatGPT, Claude, LLaMA, etc)                   │
└────────────────┬────────────────────────────────────────────┘
                 │ Pregunta sobre Matias Docs
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              AI ORCHESTRATOR / PLUGIN                        │
│         (Transformar pregunta en búsqueda)                   │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP Request: POST /api/ai/search
                 ↓
┌─────────────────────────────────────────────────────────────┐
│          MATIAS API DOCUMENTATION SERVER                     │
│            (https://docs.matias-api.com)                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Endpoints:                                       │  │
│  │  • POST /api/ai/search - Buscar documentación       │  │
│  │  • GET /api/ai/docs/{path} - Obtener documento      │  │
│  │  • GET /api/health - Verificar estado               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Documentación (11,539 líneas):                      │  │
│  │  • Factura Electrónica v1.9                         │  │
│  │  • Nómina Electrónica v3.0                          │  │
│  │  • RADIAN v2.0                                      │  │
│  │  • Documento Soporte v1.1                           │  │
│  │  • Tablas de Referencia DIAN                        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────┘
                 │ JSON Response con resultados
                 ↓
┌─────────────────────────────────────────────────────────────┐
│          AGENTE DE IA (procesando respuesta)                 │
│                                                              │
│  • Recibe contexto de documentación                         │
│  • Lo agrega al prompt del LLM                              │
│  • Genera respuesta fundamentada en DIAN                    │
│  • Proporciona al usuario                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 APIs Disponibles

### 1. Búsqueda de Documentación

**Endpoint:** `POST /api/ai/search`

**Request:**
```json
{
  "query": "factura electrónica campos"
}
```

**Response:**
```json
{
  "success": true,
  "query": "factura electrónica campos",
  "results": [
    {
      "file": "regulatory-framework/factura-electronica/technical-annex",
      "matches": 5,
      "preview": "Los campos principales de una factura electrónica incluyen... Estructura de datos para facturación"
    },
    {
      "file": "regulatory-framework/factura-electronica/tablas-equivalencias",
      "matches": 3,
      "preview": "Tabla de equivalencias para tipos de documentos... Códigos de identificación"
    }
  ],
  "count": 2
}
```

**Parámetros:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| query | string | ✅ | Término de búsqueda |

**Códigos de Status:**
- `200`: Búsqueda exitosa
- `400`: Query parameter faltante
- `500`: Error interno

---

### 2. Obtener Documento Completo

**Endpoint:** `GET /api/ai/docs/{docPath}`

**Request:**
```
GET /api/ai/docs/regulatory-framework/factura-electronica/intro
```

**Response:**
```json
{
  "success": true,
  "path": "regulatory-framework/factura-electronica/intro",
  "content": "# Factura Electrónica v1.9\n\n## Visión General\n\nLa Factura Electrónica (FE) es un documento digital...",
  "size": 8234
}
```

**Rutas Disponibles:**
```
- regulatory-framework/factura-electronica/intro
- regulatory-framework/factura-electronica/technical-annex
- regulatory-framework/factura-electronica/tablas-equivalencias
- regulatory-framework/factura-electronica/faq
- regulatory-framework/factura-electronica/casos-especiales
- regulatory-framework/nomina-electronica/intro
- regulatory-framework/nomina-electronica/campos
- regulatory-framework/nomina-electronica/ejemplos
- regulatory-framework/nomina-electronica/novedades
- regulatory-framework/nomina-electronica/calculos
- regulatory-framework/radian/intro
- regulatory-framework/radian/flujos
- regulatory-framework/radian/matriz
- regulatory-framework/radian/casos-uso
- regulatory-framework/documento-soporte/intro
- regulatory-framework/documento-soporte/ejemplos
- regulatory-framework/documento-soporte/validaciones
- regulatory-framework/tablas-referencia
- regulatory-framework/descargas-pdf
```

---

### 3. Verificar Estado

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "version": "1.4.0",
  "uptime": 3600,
  "timestamp": "2025-10-17T15:30:00.000Z"
}
```

---

## 💻 Ejemplos de Integración

### Ejemplo 1: Python + OpenAI

```python
import openai
import requests
from typing import List

class MatiasDocs:
    def __init__(self, docs_url: str = "https://docs.matias-api.com"):
        self.docs_url = docs_url
        openai.api_key = "tu-api-key"
    
    def search_docs(self, query: str) -> List[str]:
        """Buscar documentación relevante"""
        response = requests.post(
            f"{self.docs_url}/api/ai/search",
            json={"query": query},
            timeout=10
        )
        
        if response.status_code == 200:
            results = response.json()["results"]
            return [r["preview"] for r in results[:3]]
        return []
    
    def ask_about_matias(self, question: str) -> str:
        """Hacer pregunta con contexto de documentación"""
        # Buscar contexto
        context_docs = self.search_docs(question)
        
        context = "\n\n".join(context_docs) if context_docs else ""
        
        messages = [
            {
                "role": "system",
                "content": f"""Eres un asistente experto en Matias API Documentation.
Responde preguntas sobre facturación electrónica, nómina, RADIAN y documentos soporte en Colombia.

Contexto de documentación:
{context}

Basa tus respuestas en la documentación proporcionada. Si la información no está disponible, 
indícalo claramente."""
            },
            {
                "role": "user",
                "content": question
            }
        ]
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content

# Uso
docs = MatiasDocs()

# Ejemplo 1: Pregunta simple
respuesta = docs.ask_about_matias("¿Cuáles son los campos obligatorios en una factura electrónica?")
print(respuesta)

# Ejemplo 2: Pregunta específica
respuesta = docs.ask_about_matias("¿Cómo se calcula el IVA en nómina electrónica?")
print(respuesta)

# Ejemplo 3: Pregunta normativa
respuesta = docs.ask_about_matias("¿Cuál es la Resolución DIAN para RADIAN?")
print(respuesta)
```

---

### Ejemplo 2: TypeScript + OpenAI

```typescript
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

interface SearchResult {
  file: string;
  matches: number;
  preview: string;
}

class MatiasDocsAI {
  private docsUrl: string;
  private openai: OpenAIApi;

  constructor(apiKey: string, docsUrl = 'https://docs.matias-api.com') {
    this.docsUrl = docsUrl;
    
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
  }

  /**
   * Buscar en documentación
   */
  async searchDocs(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.post(
        `${this.docsUrl}/api/ai/search`,
        { query }
      );
      return response.data.results || [];
    } catch (error) {
      console.error('Error buscando docs:', error);
      return [];
    }
  }

  /**
   * Preguntar sobre Matias con contexto
   */
  async askWithContext(question: string): Promise<string> {
    // Obtener contexto
    const results = await this.searchDocs(question);
    const context = results
      .map(r => r.preview)
      .join('\n\n');

    // Crear prompt con contexto
    const systemPrompt = `Eres un asistente experto en documentación de Matias API.
Especializado en regulaciones DIAN colombianas (factura electrónica, nómina, RADIAN, etc).

Documentación disponible:
${context}

Responde basándote en la documentación proporcionada.`;

    // Llamar a OpenAI
    const response = await this.openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.data.choices[0].message?.content || '';
  }

  /**
   * Obtener documento completo para análisis profundo
   */
  async getFullDocument(docPath: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.docsUrl}/api/ai/docs/${docPath}`
      );
      return response.data.content;
    } catch (error) {
      console.error('Error obteniendo documento:', error);
      return '';
    }
  }
}

// Uso
const ai = new MatiasDocsAI('tu-openai-key');

(async () => {
  const respuesta = await ai.askWithContext(
    '¿Cuáles son los requisitos para emitir facturas electrónicas?'
  );
  console.log(respuesta);
})();
```

---

### Ejemplo 3: JavaScript/Node.js + Anthropic Claude

```javascript
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

class MatiasAIAgent {
  constructor(apiKey) {
    this.client = new Anthropic({ apiKey });
    this.docsUrl = 'https://docs.matias-api.com';
  }

  async searchDocs(query) {
    try {
      const response = await axios.post(
        `${this.docsUrl}/api/ai/search`,
        { query }
      );
      return response.data.results || [];
    } catch (error) {
      console.error('Error en búsqueda:', error.message);
      return [];
    }
  }

  async ask(question) {
    // Buscar contexto
    const results = await this.searchDocs(question);
    const context = results
      .map(r => `Documento: ${r.file}\nContenido: ${r.preview}`)
      .join('\n\n');

    // Usar Claude
    const message = await this.client.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      system: `Eres un experto en documentación de Matias API.
Conoces regulaciones DIAN para documentos electrónicos en Colombia.

Contexto de documentación disponible:
${context}`,
      messages: [
        {
          role: 'user',
          content: question
        }
      ]
    });

    return message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
  }
}

// Uso
const agent = new MatiasAIAgent('tu-anthropic-key');

(async () => {
  const answer = await agent.ask(
    '¿Cuáles son las novedades en la nómina electrónica v3.0?'
  );
  console.log(answer);
})();
```

---

### Ejemplo 4: Langchain + Multiple LLMs

```python
from langchain.llms import OpenAI, Anthropic
from langchain.chains import RetrievalQA
from langchain.document_loaders import WebBaseLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.prompts import PromptTemplate
import requests
import json

class MatiasDocsPipeline:
    def __init__(self, llm_provider='openai'):
        self.docs_url = "https://docs.matias-api.com"
        
        if llm_provider == 'openai':
            self.llm = OpenAI(model_name='gpt-4')
        elif llm_provider == 'anthropic':
            self.llm = Anthropic(model='claude-3-opus-20240229')
        
        self.embeddings = OpenAIEmbeddings()
    
    def fetch_documentation(self, query):
        """Obtener documentación relevante"""
        response = requests.post(
            f"{self.docs_url}/api/ai/search",
            json={"query": query},
            timeout=10
        )
        
        if response.status_code == 200:
            results = response.json()["results"]
            docs_content = []
            
            for result in results[:3]:
                doc_response = requests.get(
                    f"{self.docs_url}/api/ai/docs/{result['file']}"
                )
                if doc_response.status_code == 200:
                    docs_content.append(doc_response.json()["content"])
            
            return docs_content
        
        return []
    
    def ask(self, question):
        """Hacer pregunta con contexto"""
        # Obtener documentación
        docs = self.fetch_documentation(question)
        
        # Crear prompt personalizado
        prompt_template = """Usando la siguiente documentación de Matias API sobre regulaciones DIAN:

{context}

Responde la siguiente pregunta de forma precisa y basada en la documentación:

Pregunta: {question}

Respuesta:"""
        
        prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=prompt_template
        )
        
        # Ejecutar
        from langchain.chains import LLMChain
        chain = LLMChain(llm=self.llm, prompt=prompt)
        
        context = "\n\n".join(docs[:2])  # Limitar a 2 documentos
        
        return chain.run(context=context, question=question)

# Uso
pipeline = MatiasDocsPipeline(llm_provider='openai')

respuesta = pipeline.ask(
    "¿Cuáles son los pasos para implementar RADIAN?"
)
print(respuesta)
```

---

## 🧪 Testing

### Test Manual de API

```bash
# 1. Verificar salud
curl https://docs.matias-api.com/api/health

# 2. Buscar documentación
curl -X POST https://docs.matias-api.com/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "factura electrónica"
  }'

# 3. Obtener documento
curl https://docs.matias-api.com/api/ai/docs/regulatory-framework/factura-electronica/intro

# 4. Test de rendimiento
time curl -X POST https://docs.matias-api.com/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

### Test Unitario (Python)

```python
import unittest
import requests

class TestMatiasDocs(unittest.TestCase):
    def setUp(self):
        self.base_url = "https://docs.matias-api.com"
    
    def test_health(self):
        """Verificar que el servidor está activo"""
        response = requests.get(f"{self.base_url}/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertIn('status', response.json())
    
    def test_search(self):
        """Probar búsqueda"""
        response = requests.post(
            f"{self.base_url}/api/ai/search",
            json={"query": "factura"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.json())
    
    def test_get_document(self):
        """Probar obtener documento"""
        response = requests.get(
            f"{self.base_url}/api/ai/docs/regulatory-framework/factura-electronica/intro"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('content', response.json())

if __name__ == '__main__':
    unittest.main()
```

---

## ⚡ Optimizaciones

### 1. Caching de Documentos

```python
from functools import lru_cache
import requests

class CachedMatiasDocs:
    @lru_cache(maxsize=100)
    def get_document(self, doc_path: str) -> str:
        """Obtener documento con caché"""
        response = requests.get(
            f"https://docs.matias-api.com/api/ai/docs/{doc_path}"
        )
        return response.json()["content"]
```

### 2. Búsqueda Inteligente

```python
from fuzzywuzzy import fuzz

class SmartSearch:
    def find_best_match(self, query: str, results: list) -> list:
        """Ordenar resultados por relevancia"""
        scored = [
            (r, fuzz.ratio(query.lower(), r['preview'].lower()))
            for r in results
        ]
        return sorted(scored, key=lambda x: x[1], reverse=True)
```

### 3. Limitar Respuestas

```python
# Usar primeros 2-3 documentos para evitar token overflow
results = search_results[:3]
context = "\n\n".join([r["preview"] for r in results])
```

### 4. Error Handling

```python
def safe_search(query: str, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            response = requests.post(
                f"{docs_url}/api/ai/search",
                json={"query": query},
                timeout=10
            )
            response.raise_for_status()
            return response.json()["results"]
        except requests.RequestException as e:
            if attempt == max_retries - 1:
                return []
            time.sleep(2 ** attempt)  # Exponential backoff
```

---

## 📊 Monitoreo

### Métricas a Monitorear

1. **Latencia de búsqueda:** < 500ms
2. **Tasa de éxito:** > 99%
3. **Documentos indexados:** 25+
4. **Tamaño caché:** < 100MB

### Alertas Recomendadas

- Búsqueda toma > 1s
- Más de 5 errores en 1 minuto
- Servidor retorna 5xx
- Certificado SSL próximo a expirar

---

## 🎯 Casos de Uso Comunes

### Caso 1: Asesor Normativo
```
Usuario: "¿Qué cambió en la nómina electrónica v3.0?"
→ AI busca "novedades nómina electrónica"
→ Retorna cambios específicos de v3.0
```

### Caso 2: Soporte Técnico
```
Usuario: "¿Cuál es el código de error 400?"
→ AI busca documentación de errores
→ Proporciona solución según contexto
```

### Caso 3: Implementación
```
Usuario: "Necesito integrar RADIAN"
→ AI obtiene documento de casos-uso RADIAN
→ Guía paso a paso de implementación
```

---

**Versión:** 1.4.0  
**Última actualización:** Octubre 17, 2025  
**Status:** ✅ Listo para Producción
