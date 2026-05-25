---
sidebar_position: 3
sidebar_label: Respuestas API
---

# 📬 Respuestas de la API

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <strong>📖 Guía Completa de Respuestas JSON</strong><br/>
  Todas las respuestas que emite la API están estructuradas en formato JSON estandarizado, proporcionando información detallada sobre el estado de la solicitud, documentos generados y las validaciones emitidas por la DIAN.
</div>

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>✅</div>
    <strong>HTTP 200/201</strong><br/>
    <small>Procesamiento exitoso</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>⏳</div>
    <strong>StatusCode 98</strong><br/>
    <small>En proceso / Reintente</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #dc3545', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>❌</div>
    <strong>HTTP 4xx/5xx</strong><br/>
    <small>Errores y Rechazos</small>
  </div>

  <div style={{padding: '1rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '1px solid #17a2b8', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔄</div>
    <strong>Contingencia</strong><br/>
    <small>Manejo de Timeouts</small>
  </div>
</div>

---

## 🚀 Quick Reference

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #6c757d', margin: '1.5rem 0'}}>
  <strong>⚡ Referencia Rápida de Códigos HTTP</strong><br/>
  Consulte rápidamente todos los códigos de estado HTTP y las acciones de integración recomendadas.
</div>

| Código | Tipo | Descripción | Acción Recomendada |
|--------|------|-------------|--------------------|
| **200** | ✅ Éxito | Documento procesado y validado correctamente por la DIAN | Descargar y almacenar archivos generados |
| **201** | ✅ Éxito | Documento encolado para procesamiento | Esperar procesamiento asíncrono |
| **400** | ❌ Error | Petición incorrecta o JSON malformado | Validar sintaxis y estructura del JSON |
| **401** | ❌ Error | Sin autorización (Falta token o expirado) | Renovar token de acceso en cabecera |
| **402** | ❌ Error | Pago requerido / Plan excedido | Renovar suscripción o ampliar plan |
| **403** | ❌ Error | Acción prohibida (Permisos insuficientes) | Contactar soporte para verificar perfil |
| **404** | ❌ Error | Recurso no encontrado | Verificar identificador y endpoint |
| **422** | ❌ Error | Validación DIAN fallida (Documento rechazado) | Analizar detalles en `response.ErrorMessage` |
| **500** | ❌ Error | Error interno en los servidores de la DIAN | Seguir protocolo de reintentos |
| **503** | ❌ Error | Servicio temporalmente fuera de servicio (DIAN) | Esperar a restablecimiento de servicios |
| **504** | ⏳ Timeout | Tiempo de espera de respuesta agotado | Aplicar protocolo de contingencia |
| **507** | ❌ Error | Almacenamiento temporal lleno | Contactar al equipo de soporte |
| **508** | ❌ Error | Bucle detectado en el procesamiento de datos | Validar referencias en estructura XML |

---

## 🎯 Guía Rápida de Interpretación

<div style={{backgroundColor: '#d1ecf1', padding: '1.5rem', borderRadius: '8px', border: '2px solid #17a2b8', margin: '1.5rem 0'}}>
  <strong>🚦 Cómo Interpretar una Respuesta en 3 Pasos</strong><br/>
  Siga este flujo sencillo para diagnosticar cualquier respuesta de la API de forma ágil y correcta.
</div>

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc'}}>
    <strong>📊 Paso 1: Código HTTP</strong><br/><br/>
    <code>HTTP 200/201</code> ➔ ✅ Éxito<br/>
    <code>HTTP 400-409</code> ➔ ⚠️ Error en Cliente<br/>
    <code>HTTP 500-508</code> ➔ ❌ Error en Servidor (DIAN)
  </div>

  <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745'}}>
    <strong>🔍 Paso 2: Propiedad success</strong><br/><br/>
    <code>success: true</code> ➔ ✅ OK<br/>
    <code>success: false</code> ➔ ❌ Fallo<br/>
    <small>Examine los campos de error para detalles técnicos.</small>
  </div>

  <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107'}}>
    <strong>🏷️ Paso 3: StatusCode DIAN</strong><br/><br/>
    <code>StatusCode: 00</code> ➔ ✅ Autorizado por DIAN<br/>
    <code>StatusCode: 98</code> ➔ ⏳ En Procesamiento<br/>
    <code>StatusCode: 02</code> ➔ 🔄 Documento Duplicado
  </div>
</div>

---

## ✅ Estructura de la Respuesta Exitosa

<div style={{backgroundColor: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745', margin: '1.5rem 0'}}>
  <strong>🎉 HTTP 200/201 - Documento Procesado Exitosamente</strong><br/>
  Cuando la DIAN acepta y autoriza legalmente el documento, la API responde con un objeto rico que incluye la clave única, el XML firmado, el PDF y el código QR de validación.
</div>

### 📋 Resumen de la Estructura Principal

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | `string` | Resumen inteligible del resultado del procesamiento. |
| `success` | `boolean` | `true` si la operación se completó exitosamente. |
| `XmlDocumentKey` | `string` | CUFE (Factura) / CUDE (Notas) / CUNE (Nómina) generado. |
| `response` | `object` | Objeto contenedor de la respuesta directa de la DIAN. |
| `AttachedDocument` | `object` | Enlaces y metadatos del XML firmado y el contenedor Zip. |
| `qr` | `object` | Rutas y base64 para la renderización del código QR de validación. |
| `pdf` | `object` | Enlaces de descarga y metadatos del archivo PDF generado. |

<details>
<summary>📦 Ver JSON Completo de Respuesta Exitosa</summary>

```json title="response.json"
{
    "message": "El documento ha sido procesado por la DIAN.",
    "send_to_queue": 0,
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "response": {
        "ErrorMessage": {
            "string": [
                "Regla: FAJ73, Notificación: Estructura código no valida",
                "Regla: RUT01, Notificación: La validación del estado del RUT próximamente estará disponible."
            ]
        },
        "IsValid": "true",
        "StatusCode": "00",
        "StatusDescription": "Procesado Correctamente.",
        "StatusMessage": "La Factura electrónica LZT2002, ha sido autorizada.",
        "XmlBase64Bytes": "",
        "XmlBytes": {
            "_attributes": {
                "nil": "true"
            }
        },
        "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
        "XmlFileName": "fv09010914030002500000095"
    },
    "XmlBase64Bytes": "",
    "AttachedDocument": {
        "pathZip": "1/ad/z09010914030002500000042.zip",
        "path": "1/ad/ad09010914030002500000041.xml",
        "url": "https://api-v2.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
        "data": ""
    },
    "qr": {
        "qrDian": "",
        "url": "",
        "path": "1/fv09010914030002500000095.png",
        "data": ""
    },
    "pdf": {
        "path": "1/fv09010914030002500000095.pdf",
        "url": "https://api-v2.matias-api.com/pdf/1/fv09010914030002500000095.pdf",
        "data": ""
    },
    "success": true
}
```
</details>

<details>
<summary>🔍 Ver Diccionario Detallado de Campos de la Respuesta</summary>

#### Campos de la Respuesta Raíz
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | `string` | Mensaje informativo general del resultado. |
| `send_to_queue` | `integer` | Indicador si el documento fue encolado asíncronamente (0: No, 1: Sí). |
| `XmlDocumentKey` | `string` | Identificador único fiscal generado (CUFE, CUDE, CUNE). |
| `success` | `boolean` | Confirma si la petición finalizó satisfactoriamente. |

#### Objeto response (Validación Directa DIAN)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ErrorMessage` | `object` | Contenedor de notificaciones de advertencia de la DIAN que no impiden la aprobación. |
| `IsValid` | `string` | Indica si el documento cumple los estándares oficiales (`"true"` o `"false"`). |
| `StatusCode` | `string` | Estado interno del portal de la DIAN (`"00"`: Autorizado). |
| `StatusDescription` | `string` | Glosa de estado oficial (ej. `"Procesado Correctamente."`). |
| `StatusMessage` | `string` | Detalle específico (ej. `"La Factura electrónica LZT2002, ha sido autorizada."`). |
| `XmlBase64Bytes` | `string` | ApplicationResponse oficial DIAN serializado en Base64. |
| `XmlBytes` | `object` | Bytes del XML DIAN (retorna `nil` si no aplica). |
| `XmlDocumentKey` | `string` | CUFE / CUDE del documento. |
| `XmlFileName` | `string` | Nombre bajo el cual el XML firmado se registra en la base de datos de la DIAN. |

#### Objeto AttachedDocument (Archivos XML)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `pathZip` | `string` | Ruta física de almacenamiento del archivo .ZIP en el servidor. |
| `path` | `string` | Ruta física de almacenamiento del XML firmado. |
| `url` | `string` | Enlace público para la descarga directa del XML firmado (formato AttachedDocument). |
| `data` | `string` | Contenido del XML codificado en Base64. |

#### Objeto qr (Código QR)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `qrDian` | `string` | Enlace directo del QR hacia el portal de validación oficial DIAN. |
| `url` | `string` | Enlace para descargar la imagen del QR generado. |
| `path` | `string` | Ruta física del recurso de imagen QR. |
| `data` | `string` | Representación de imagen QR codificada en Base64. |

#### Objeto pdf (Representación Gráfica)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `path` | `string` | Ruta física de almacenamiento de la representación gráfica. |
| `url` | `string` | Enlace público de descarga del documento en formato PDF. |
| `data` | `string` | PDF codificado en Base64. |

</details>

---

## 🔄 Respuesta - Documento Duplicado

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>⚠️ StatusCode 02 - Documento Ya Procesado (Duplicado)</strong><br/>
  Si intenta retransmitir o generar un documento usando un prefijo y número consecutivo que ya fue validado y registrado ante la DIAN, la API rechazará la solicitud para proteger la integridad y evitar multas fiscales.
</div>

<details>
<summary>📦 Ver JSON de Respuesta por Documento Duplicado</summary>

```json title="response.json"
{
    "success": false,
    "message": "El documento (Factura electrónica) con numero LZT224, ya se encuentra validado"
}
```
</details>

### 📝 Análisis de Campos
* **`success`:** `false` (Indica que la factura no fue regenerada).
* **`message`:** Mensaje explicativo con el número e identificación del documento preexistente.
* **Código de respuesta HTTP:** `400 Bad Request`.

---

## 📊 Códigos de Estado HTTP Completos

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #6c757d', margin: '1.5rem 0'}}>
  <strong>📋 Catálogo Técnico Completo de Respuestas HTTP</strong><br/>
  Consulte detalladamente las causas más probables de cada código y las sugerencias operacionales.
</div>

| Código HTTP | Estado | Causa Probable | Sugerencia Operacional |
|:---:|:---:|---|---|
| **200** | ✓ OK | Transacción procesada correctamente por la DIAN. | Almacenar PDFs/XMLs y enviar al adquiriente. |
| **201** | ✓ Created | Transacción encolada en procesamiento en segundo plano. | Consultar estado mediante webhook o pooling posterior. |
| **400** | ✗ Bad Request | Sintaxis JSON incorrecta, campos no coincidentes o duplicación. | Verificar validez del JSON con herramientas de linting. |
| **401** | ✗ Unauthorized | API Key / Token ausente o incorrectamente enviado en la cabecera. | Verificar que el Header contiene `Authorization: Bearer {token}`. |
| **402** | ✗ Payment Required | Saldo insuficiente de folios o cuenta de membresía inactiva. | Ampliar paquete o realizar pago de suscripción. |
| **403** | ✗ Forbidden | Intento de realizar operaciones sin privilegios o fuera de entorno. | Validar roles de usuario en el portal de Matias. |
| **404** | ✗ Not Found | Endpoint inexistente o identificador de documento no registrado. | Validar la URL base y el consecutivo de consulta. |
| **422** | ✗ Unprocessable Entity | Fallo de regla en las validaciones lógicas y estructurales de la DIAN. | Revisar y corregir los campos fallidos en `ErrorMessage`. |
| **500** | ✗ Server Error | Caída de servicios internos o error de persistencia de la DIAN. | Aplicar protocolo de reintentos escalonados. |
| **503** | ✗ Service Unavailable | Los servidores de la DIAN no responden por saturación o mantenimiento. | Esperar y retransmitir en bloques de tiempo prudenciales. |
| **504** | ⏳ Timeout | El portal DIAN no retornó respuesta en menos de 60 segundos. | Seguir el protocolo de contingencia 12.4. |
| **507** | ✗ Storage Error | El servidor ha excedido su capacidad física de guardado de XML. | Levantar ticket de soporte técnico de forma prioritaria. |
| **508** | ✗ Loop Detected | Referencia circular encontrada en estructura o totalizadores. | Verificar el balance y cálculo matemático de las líneas. |

<details>
<summary>📦 Ver JSON Genérico de Error (HTTP 4xx / 5xx)</summary>

```json title="response.json"
{
    "success": false,
    "message": "Mensaje detallado descriptivo del error o la excepción encontrada."
}
```
</details>

---

## ⚠️ Errores Generados por la DIAN y Servidores

<div style={{backgroundColor: '#f8d7da', padding: '1.5rem', borderRadius: '8px', border: '2px solid #dc3545', margin: '1.5rem 0'}}>
  <strong>🚨 Errores Críticos del Servidor y Plataforma DIAN</strong><br/>
  Listado de fallos devueltos directamente por los Web Services de validación previa de la DIAN.
</div>

### 💡 Protocolo de Reintentos Recomendado

:::tip Recomendación de Transmisión
Ante errores HTTP 500, 503 o 504 originados por indisponibilidad de la DIAN, aplique este protocolo de backoff exponencial para evitar bloqueos por rate limits:
1. **Primer Reintento:** Inmediato (dentro de los primeros 10 segundos).
2. **Segundo Reintento:** Esperar 5 minutos.
3. **Tercer Reintento:** Esperar 15 minutos.
4. **Si persiste tras 3 intentos:** Consultar canales de soporte de la DIAN o validar si se ha decretado estado de contingencia oficial.
:::

---

### 🚨 Catálogo de Respuestas de Error 5xx

Para facilitar el diagnóstico rápido, se agrupan las respuestas típicas arrojadas por la infraestructura en momentos de inestabilidad:

<details>
<summary>❌ HTTP 500 — Internal Server Error (Error en Servidor DIAN)</summary>

* **Causa:** El Web Service de la DIAN experimentó un error inesperado al parsear el XML de la factura.
* **Acción:** Retransmitir el documento transcurridos unos minutos.

```json title="response.json"
{
    "success": false,
    "message": "Error 500: Internal Server Error"
}
```
</details>

<details>
<summary>❌ HTTP 503 — Service Unavailable (Servidor DIAN Inaccesible)</summary>

* **Causa:** Mantenimiento programado de la base de datos DIAN o congestión severa de fin de mes.
* **Acción:** Retransmitir en horarios de menor concurrencia o esperar el aviso de restablecimiento.

```json
{
    "success": false,
    "message": "Error 503: Service Unavailable"
}
```
</details>

<details>
<summary>❌ HTTP 504 — Gateway Timeout (Retraso en el Retorno del CUFE)</summary>

* **Causa:** El documento fue enviado a la DIAN, pero la firma y respuesta tomó más de 60 segundos.
* **Acción:** No retransmitir inmediatamente con un nuevo número. Debe consultar primero si el documento ya fue procesado con el mismo número, o seguir el protocolo de contingencia 12.4.

```json
{
    "success": false,
    "message": "Error 504: Gateway Timeout"
}
```
</details>

<details>
<summary>❌ HTTP 507 — Insufficient Storage (Problemas de Almacenamiento)</summary>

* **Causa:** Capacidad física límite alcanzada en los sistemas de logs y almacenamiento.
* **Acción:** Abrir un ticket de soporte indicando el incidente.

```json
{
    "success": false,
    "message": "Error 507: Insufficient Storage"
}
```
</details>

<details>
<summary>❌ HTTP 508 — Loop Detected (Error en la Construcción Estructural)</summary>

* **Causa:** Se detectó una referencia circular en las dependencias lógicas del JSON de la factura.
* **Acción:** Auditar el orden de cálculo matemático en impuestos por línea.

```json
{
    "success": false,
    "message": "Error 508: Loop Detected"
}
```
</details>

---

### ⏳ 12.4 Demoras en Tiempos de Respuesta (Timeouts) {#124-demoras-en-los-tiempos-de-respuesta-en-los-servicios-de-facturacion-electronica-de-la-dian}

<div style={{backgroundColor: '#d1ecf1', padding: '1.5rem', borderRadius: '8px', border: '2px solid #17a2b8', margin: '1.5rem 0'}}>
  <strong>⏱️ Protocolo de Contingencia por Timeout (Resolución 000165 DIAN)</strong><br/>
  Se declara retraso oficial cuando la respuesta del servicio DIAN excede el límite de <strong>60 segundos</strong>. La API maneja la contingencia de la siguiente manera.
</div>

#### 📋 Procedimiento de Transmisión ante Contingencia:

| Paso | Acción Requerida | Límite Temporal / Observación |
|:---:|---|---|
| **1** | Validar estado del documento en la API | Consultar con `prefix` y `document_number` antes de retransmitir. |
| **2** | Declarar Timeout temporal | Si la API retorna HTTP 504 persistente. |
| **3** | Intentar retransmisiones escalonadas | Intervalo de 2 minutos, máximo 5 intentos. |
| **4** | Declarar Contingencia DIAN (Tipo 04) | Si la caída del portal DIAN es prolongada e informada. |
| **5** | Emitir Factura de Contingencia | Cambiar parámetro `InvoiceTypeCode = "04"` en el JSON. |
| **6** | Transmisión posterior | Sincronizar documentos emitidos en contingencia máximo 48 horas después de superada la caída. |

:::warning Excepciones
Tenga en cuenta que las Notas Crédito, Notas Débito y las notificaciones de ApplicationResponse **no disponen** de mecanismos o tipos de contingencia bajo la legislación colombiana.
:::

---

## 🔄 Secciones Especiales

### ⏳ StatusCode 98 - En Procesamiento {#statuscode-98-en-procesamiento}

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>⏳ Documento Aceptado pero Pendiente de Validación</strong><br/>
  StatusCode 98 indica que la API recibió correctamente el documento y la DIAN lo tiene encolado, pero la respuesta final (Aprobado/Rechazado) sigue pendiente. <strong>No es un error</strong>, es un estado transitorio de alta demanda del regulador.
</div>

#### Ficha del Estado de Procesamiento
* **Código:** `98`
* **Definición:** Solicitud en Procesamiento
* **Significado:** El documento se encuentra en la cola de validación DIAN.
* **Tiempo Promedio de Resolución:** 1 a 10 minutos.

:::important Protocolo de Acción para StatusCode 98
1. **No retransmita** el documento inmediatamente para evitar colisiones.
2. **Espere un lapso de 3 a 5 minutos**.
3. **Consulte el estado** de procesamiento utilizando el endpoint de consulta correspondiente.
4. **Repita el ciclo** hasta un máximo de 5 veces. Si el estado persiste por más de 30 minutos, póngase en contacto con soporte técnico.
:::

<details>
<summary>📦 Ver Ejemplo JSON de Respuesta - StatusCode 98</summary>

```json title="response.json"
{
  "message": "Solicitud procesada por la DIAN.",
  "response": {
    "IsValid": "false",
    "StatusCode": "98",
    "StatusDescription": "En Proceso",
    "XmlDocumentKey": null
  }
}
```
</details>

---

## 🔀 Diagrama de Flujo de Interpretación

Siga de forma ordenada este flujo lógico para procesar la respuesta de la API en su aplicación o backend:

```
┌──────────────────────────────────────────────┐
│        Recibir Respuesta JSON de la API      │
└──────────────────────┬───────────────────────┘
                       │
             ┌─────────▼─────────┐
             │ ¿Es HTTP 200/201? │
             └─┬───────────────┬─┘
            SÍ │               │ NO
               │               └──────────────────────────┐
        ┌──────▼──────┐                           ┌───────▼────────┐
        │success=true?│                           │ ¿HTTP 4xx-5xx? │
        └─┬─────────┬─┘                           └─┬────────────┬─┘
       SÍ │         │ NO                         SÍ │            │ NO
          │         └──────────────┐                │            │
          │                        │                │     ┌──────▼──────────┐
   ┌──────▼──────────┐   ┌─────────▼────────┐       │     │ Otro Estado     │
   │ ¿StatusCode=00? │   │ Leer errores en  │       │     │ Contactar       │
   └─┬─────────────┬─┘   │ response.        │       │     │ Soporte Técnico │
  SÍ │             │ NO  │ ErrorMessage     │       │     └─────────────────┘
     │             │     └──────────────────┘       │
     │     ┌───────▼────────┐               ┌───────▼───────────┐
     │     │ ¿StatusCode=98 │               │ Excepción Cliente │
     │     │  (En Proceso)? │               │ o Caída DIAN      │
     │     └─┬────────────┬─┘               │ Leer JSON error   │
     │    SÍ │            │ NO              └───────────────────┘
     │       │            │
     │       │    ┌───────▼─────────┐
     │       │    │ StatusCode = 02 │
     │       │    │   (Duplicado)   │
     │       │    └─────────────────┘
     │       │
     │       │  ┌────────────────────────┐
     │       └──│ Esperar 3-5 minutos y  │
     │          │ consultar de nuevo.    │
     │          └────────────────────────┘
     │
┌────▼────────────────────────────────────────┐
│  ✓ PROCESAMIENTO EXITOSO                    │
│  • Almacenar el XmlDocumentKey (CUFE)       │
│  • Descargar los recursos adjuntos (PDF/XML)│
│  • Despachar e-mail al adquiriente          │
└─────────────────────────────────────────────┘
```

---

## ❓ Preguntas Frecuentes (FAQ)

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>💡 Resolución de Dudas de Integración</strong><br/>
  Respuestas directas a las preguntas frecuentes que recibimos en los canales de asistencia técnica.
</div>

**¿Qué diferencia hay entre `success` y `response.IsValid`?**  
`success` es un indicador a nivel de API del transporte y validez de la petición JSON. `response.IsValid` es la decisión final de aprobación de la DIAN sobre la validez fiscal del documento electrónico.

**Recibí un error 504 Gateway Timeout, ¿el documento se emitió?**  
Es probable que sí. Cuando ocurre un Timeout, el XML pudo llegar a la DIAN y procesarse, pero la respuesta de retorno se perdió. **Nunca intente retransmitir** con el mismo número sin antes consultar el estado de dicho consecutivo para evitar el error `StatusCode 02 (Duplicado)`.

**¿Qué significa `nil="true"` en algunos nodos XML de respuesta?**  
Es un estándar de serialización SOAP/XML integrado en la respuesta JSON. Indica de forma explícita que la variable o nodo no contiene información (es equivalente a un valor `null` en JavaScript).

**¿Cómo automatizar la recuperación de documentos ante StatusCode 98?**  
Debe programar una rutina (Job) en su sistema que se dispare asíncronamente cada 5 minutos, consultando el endpoint de consulta del documento hasta que el portal responda con éxito o rechazo definitivo.

---

## 🎯 Próximos Pasos

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
  <a href="/docs/endpoints" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔌</div>
      <strong>Endpoints de la API</strong><br/>
      <small>Explore las 50+ rutas disponibles.</small>
    </div>
  </a>

  <a href="/docs/use-cases/simple-invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📄</div>
      <strong>Factura Simple</strong><br/>
      <small>Vea un ejemplo práctico paso a paso.</small>
    </div>
  </a>

  <a href="/docs/use-cases/common-errors" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚠️</div>
      <strong>Errores Comunes</strong><br/>
      <small>Guía rápida de resolución de problemas.</small>
    </div>
  </a>

  <a href="/docs/billing-fields" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '2px solid #17a2b8', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📋</div>
      <strong>Campos de Documentos</strong><br/>
      <small>Diccionario de campos del JSON.</small>
    </div>
  </a>
</div>

---

<div style={{backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Última actualización:</strong> Febrero 2026 (v3.0.0) • 
    📨 <strong>Respuestas Documentadas:</strong> 13 escenarios estándar • 
    🎯 <strong>Nivel:</strong> ⭐⭐⭐ Referencia Técnica de Integración
  </small>
</div>