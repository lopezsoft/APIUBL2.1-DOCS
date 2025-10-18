# 🛠️ Guía Práctica: Cómo Implementar Mejoras a response-json.md

## Roadmap de Implementación

```
SEMANA 1:
├─ Lunes: Críticas fase 1 (TOC + Reorganizar 12.4)
├─ Martes: Críticas fase 2 (Detalle 4xx + StatusCode 98)
├─ Miércoles: Críticas fase 3 (Ejemplos JSON + FAQ)
└─ Jueves-Viernes: Revisión + importantes

SEMANA 2:
├─ Lunes-Martes: Diagrama + Mejores prácticas
├─ Miércoles-Jueves: Pulido y ortografía
└─ Viernes: QA final y deploy
```

---

## Mejora #1: Agregar Tabla de Contenidos (1 hora)

### ANTES:
```markdown
# Respuestas de la API.

La API de facturación emite respuestas...

## Estructura de la respuesta...
```

### DESPUÉS:
```markdown
# Respuestas de la API

La API de facturación emite respuestas en formato JSON...

## Tabla de Contenidos

- [Quick Reference](#quick-reference) - Resumen de códigos
- [Respuestas Exitosas](#respuestas-exitosas) - HTTP 200, 201
- [Documentos Duplicados](#duplicados) - StatusCode 02
- [Errores del Cliente](#errores-cliente) - HTTP 4xx
- [Errores del Servidor](#errores-servidor) - HTTP 5xx
- [Manejo de Timeouts](#timeouts) - Estrategia contingencias
- [Códigos DIAN](#codigos-dian) - StatusCodes 00-98
- [FAQ](#faq) - Preguntas frecuentes
- [Mejores Prácticas](#mejores-practicas) - Tips de integración

---

## Quick Reference

[Ver Tabla 1 abajo]

---

## Respuestas Exitosas
```

### Tabla 1: Quick Reference
```markdown
| Código | Tipo | Descripción | Acción |
|--------|------|-------------|--------|
| 200 | ✓ Éxito | Documento procesado | Descargar archivos |
| 201 | ✓ Éxito | Creado en segundo plano | Esperar notificación |
| 400 | ✗ Error | JSON malformado | Validar JSON |
| 401 | ✗ Error | Sin autenticación | Verificar credenciales |
| 402 | ✗ Error | Suscripción vencida | Pagar renovación |
| 403 | ✗ Error | Sin permisos | Contactar soporte |
| 404 | ✗ Error | Recurso no existe | Verificar ID |
| 422 | ✗ Error | Validación fallida | Leer ErrorMessage |
| 500 | ✗ Error | Servidor DIAN falla | Esperar 5 min, reintentar |
| 503 | ✗ Error | Servidor no disponible | Revisar estado DIAN |
| 504 | ⏳ Timeout | Respuesta tardía | Ver sección timeouts |
| 507 | ✗ Error | Almacenamiento agotado | Contactar soporte |
| 508 | ✗ Error | Bucle detectado | Revisar estructura |
```

---

## Mejora #2: Reorganizar Sección 12.4 Contingencias (2 horas)

### ANTES (18 líneas de párrafo):
```markdown
Eventualmente en el uso de los servicios del sistema de factura 
electrónica con validación previa se pueden presentar algunas demoras 
en los tiempos respuesta debido a situaciones normales informáticas.
Se define por demora cuando la respuesta ante una solicitud a uno de 
los servicios del sistema de factura electrónica con validación previa 
toma más de 1 minuto...
- 1. A manera informativa notificar...
- 2. Si durante la transmisión...
- 3. Una vez a sucedido...
[... + dirección de DIAN mezclada]
```

### DESPUÉS (Claro y estructurado):
```markdown
## Manejo de Timeouts

### ¿Qué es una demora?

Una demora ocurre cuando la respuesta de DIAN tarda **más de 1 minuto**. 
Durante esto, los servicios permanecen activos pero retrasados.

### Estrategia de Reintentos

Cuando recibas error **HTTP 504 (Gateway Timeout)**:

| Intento | Acción | Espera después |
|---------|--------|-----------------|
| 1 | Transmite documento | - |
| 2 | Reintenta | 2 minutos |
| 3 | Reintenta | 2 minutos |
| 4 | Reintenta | 2 minutos |
| 5 | Reintenta | 2 minutos |
| 6+ | Declara Contingencia Tipo 04 | - |

### Contingencia Tipo 04 (Cuando 5 reintentos fallan)

Sigue estos 4 pasos:

**Paso 1: Modifica el documento**
- Cambia `InvoiceTypeCode` de `"01"` a `"04"`
- Mantén prefijo, número y todos los datos
- NO cambies ningún otro campo

**Paso 2: Firma nuevamente**
- Firma con certificado digital

**Paso 3: Adjunta evidencia**
- Incluye XML original en `AttachedDocument`
- Archivo de log con 5 intentos y horarios

**Paso 4: Entrega al cliente**
- Número de factura: FV-XXX-000001
- Documento con InvoiceTypeCode "04"
- Log de intentos con timestamps

### Documentos SIN Contingencia

Estos NO tienen esquema tipo 04:
- CreditNote (Nota Crédito)
- DebitNote (Nota Débito)
- ApplicationResponse (Eventos)
- Otros documentos

### Monitoreo Post-Contingencia

Verifica conexión DIAN cada **30 minutos** después para reintentarla.

---

**Referencia:** Resolución DIAN 000165 (01/NOV/2023)
```

---

## Mejora #3: Detalle Completo de Errores 4xx (3 horas)

### Estructura para cada error 4xx:

```markdown
### 400 - Bad Request

**Descripción:** La solicitud JSON es inválida o incompleta.

**Causas Comunes:**
- JSON malformado (falta comas, comillas, llaves)
- Campos requeridos faltantes
- Tipo de dato incorrecto

**Cómo Resolver:**
1. Valida JSON en https://jsonlint.com
2. Verifica que incluyas todos los campos requeridos
3. Compara estructura con ejemplo exitoso
4. Lee el `ErrorMessage` en la respuesta

**Ejemplo de Error:**
```json
{
    "success": false,
    "message": "Bad Request",
    "errors": {
        "document": "Object is required",
        "invoice.number": "String expected"
    }
}
```

**Próximos Pasos:**
- ✓ Fijar JSON
- ✓ Reintentar
- ✓ Si persiste, contacta soporte con error exacto

---

### 401 - Unauthorized

**Descripción:** Credenciales inválidas o token expirado.

**Causas Comunes:**
- API key incorrecta
- Token JWT expirado
- Credenciales revocadas

**Cómo Resolver:**
1. Verifica API key en tu dashboard
2. Regenera token si es necesario
3. Asegúrate que estés en ambiente correcto (dev/prod)

**Ejemplo de Error:**
```json
{
    "success": false,
    "message": "Unauthorized",
    "error": "Invalid API key"
}
```

---

### 402 - Payment Required

**Descripción:** Suscripción vencida o sin saldo.

**Causas Comunes:**
- Suscripción expirada
- Crédito agotado
- Facturación rechazada

**Cómo Resolver:**
1. Ve a tu dashboard: https://app.ejemplo.com
2. Verifica estado de suscripción
3. Realiza pago si es necesario
4. La reactivación es inmediata

---

### 403 - Forbidden

**Descripción:** Tu cuenta no tiene permiso para este recurso.

**Causas Comunes:**
- Rol insuficiente
- Recurso fuera de tu plan
- Cuenta limitada por soporte

**Cómo Resolver:**
1. Verifica tu plan actual
2. Contáctanos si necesitas upgrade
3. Soporte puede habilitar acceso especial

---

### 404 - Not Found

**Descripción:** El documento o recurso no existe.

**Causas Comunes:**
- ID incorrecto
- Documento ya eliminado
- Ambiente incorrecto (dev vs prod)

**Cómo Resolver:**
1. Verifica que el ID sea correcto
2. Consulta el documento en dashboard
3. Si fue eliminado, no se puede recuperar

---

### 422 - Unprocessable Entity

**Descripción:** Validaciones DIAN rechazaron el documento.

**Causas Comunes:**
- RUT cliente no registrado en DIAN
- Dominio no aplica para cliente
- Fecha inválida (anterior/futura)
- Descuentos excedan límites

**Cómo Resolver:**
1. LEE el `ErrorMessage` en respuesta (es específico)
2. Verifica datos del cliente (RUT, nombre, dirección)
3. Compara con documento exitoso
4. Consulta matriz de validaciones DIAN

**Ejemplo:**
```json
{
    "success": false,
    "message": "Validación fallida",
    "validation_errors": [
        "RUT cliente: formato inválido",
        "Dirección: ciudad no registrada"
    ]
}
```

---

## Mejora #4: StatusCode 98 Nueva Sección (1.5 horas)

```markdown
## StatusCode 98: Documento En Proceso

### ¿Qué significa?

StatusCode 98 significa que DIAN está validando tu documento en su servidor.

### Cuándo aparece?

Entre 5 segundos y 10 minutos después de enviar, dependiendo de:
- Complejidad del documento
- Carga actual de DIAN
- Validaciones requeridas

### Estructura de Respuesta

```json
{
    "success": true,
    "message": "Documento en proceso",
    "response": {
        "StatusCode": "98",
        "StatusDescription": "En Proceso",
        "XmlDocumentKey": "abc123def456..."
    }
}
```

### ¿Qué debo hacer?

**GUARDAR:** El `XmlDocumentKey` (lo necesitarás)

**IMPLEMENTAR POLLING:**
```javascript
// Pseudocódigo
const xmlKey = response.XmlDocumentKey;
let attempts = 0;
const maxAttempts = 60; // 30 minutos

while (attempts < maxAttempts) {
    await delay(30000); // Espera 30 segundos
    
    const status = await getDocumentStatus(xmlKey);
    
    if (status.StatusCode !== "98") {
        // Cambió de estado, procesa resultado
        handleFinalStatus(status);
        break;
    }
    
    attempts++;
}
```

### Posibles Resultados Finales

```
98 (En Proceso)
├─ 00: Documento válido ✓
├─ 01: Aceptado ✓
├─ 02: Duplicado (ya existe)
├─ 03: Rechazado (revisar ErrorMessage)
└─ 04: Contingencia autorizada
```

### ¿Cuándo parar de esperar?

- Máximo 30 minutos de polling
- Intervalo: 30-60 segundos
- Si sigue en 98 después de 30 min: aplica Contingencia Tipo 04

---

## Mejora #5: FAQ Section (1 hora)

```markdown
## FAQ - Preguntas Frecuentes

### P: ¿Qué diferencia hay entre StatusCode HTTP y StatusCode DIAN?

**R:** Son dos sistemas diferentes:

- **StatusCode HTTP:** 200, 400, 500 (nivel de API)
  - 200 = Tu solicitud fue entregada a DIAN
  - 400 = Tu JSON es inválido
  - 500 = Problema en servidor DIAN

- **StatusCode DIAN:** 00, 01, 02, 03, 04, 98 (nivel de negocio)
  - 00 = Documento válido
  - 02 = Documento duplicado
  - 98 = Documento en validación

### P: Mi JSON es correcto pero falla con HTTP 400

**R:** Posibles causas:
1. Carácter especial sin escapar (por ejemplo, ñ, ")
2. Campo requerido vacío ("" vs null vs omitido)
3. Tipo de dato incorrecto (string vs number)
4. Estructura anidada incorrecta

**Solución:**
- Valida JSON en jsonlint.com
- Compara tu estructura con el ejemplo exitoso línea por línea
- Verifica que TODOS los campos requeridos estén presentes

### P: StatusCode 02 significa que falló?

**R:** NO. StatusCode 02 significa "Documento Duplicado":
- DIAN ya tiene un documento con este número
- Puede ser:
  - Verdadero duplicado (error de tu parte) → rechaza
  - Reintentar anterior (network error) → reutiliza resultado
  - Documento legítimo diferente → revisa prefijo/número

**Acción:** Verificar manualmente antes de rechazar.

### P: ¿Cuántos reintentos debo hacer?

**R:** Según DIAN Resolución 165/2023:
- Máximo 5 reintentos (para timeouts 504)
- Espacio: 2 minutos entre cada reintento
- Total: hasta 10 minutos de intentos
- Pasado eso: Contingencia Tipo 04

### P: ¿Cómo implemento Contingencia Tipo 04?

**R:** Seguir 4 pasos (ver sección "Contingencia Tipo 04" arriba):
1. Cambiar InvoiceTypeCode "01" → "04"
2. Firmar nuevamente
3. Adjuntar XML original
4. Entregar con evidencia de intentos

**Validación:** Mantener registro 5 años según DIAN.

### P: ¿Qué es XmlDocumentKey y para qué sirve?

**R:** Es el CUFE/CUDE del documento (identificador único DIAN):
- Se devuelve en cada respuesta
- Úsalo para consultar estado después
- Necesario para troubleshooting
- Guarda en tu base de datos

### P: ¿Puedo usar WebHooks en lugar de polling?

**R:** Depende de tu implementación:
- **Polling:** Para casos simples (revisión cada 30-60 seg)
- **WebHooks:** Para casos complejos (alta concurrencia)

Contacta soporte para configurar WebHooks en tu cuenta.

---

## Mejora #6: Diagrama ASCII Flujo (1.5 horas)

```markdown
## Diagrama de Flujo Completo

```
PROCESO DE INTEGRACIÓN CON API DIAN

┌─────────────────────┐
│  Crear Documento    │
│  (JSON + Firma)     │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Enviar a API       │
│  POST /documento    │
└──────────┬──────────┘
           │
           v
      ¿Respuesta < 60s?
       /          \
    SÍ             NO
    │              │
    v              v
┌─────────────────┐ ┌──────────────────────┐
│ HTTP 200/201    │ │ HTTP 504             │
│ + StatusCode    │ │ (Timeout)            │
└────────┬────────┘ └──────────┬───────────┘
         │                     │
         v                     v
    ¿StatusCode?        ┌────────────────┐
   /  |  |  |  \        │ Reintento 1-5  │
  /   |  |  |   \       │ (2 min entre)  │
 /    |  |  |    \      └────────┬───────┘
00   01  02  03  04             │
│    │   │   │   │              v
│    │   │   │   │         ¿Logró?
│    │   │   │   │         /      \
│    │   │   │   │       SÍ        NO
v    v   v   v   v        │        │
✓    ✓   ~   ✗   ✓        │        v
OK   OK  DUP RECHZ CONTINGENCY   │
                         │        ├─→ Contingencia
                         │        │   Tipo 04
                         └────────┴──→ Resultado
                                   (00, 01, 02,
                                    03, 04, 98)
                                    │
                                    v
                            ┌──────────────┐
                            │ Fin Proceso  │
                            │ Guardar      │
                            │ Notificar    │
                            └──────────────┘
```

---

## Mejora #7: Mejores Prácticas (1 hora)

```markdown
## Mejores Prácticas de Integración

### Gestión de Timeouts

Configura estos valores:
```javascript
const config = {
    connection_timeout: 10_000,      // 10 segundos
    read_timeout: 30_000,             // 30 segundos
    total_timeout: 60_000,            // 60 segundos máximo
    retry_delay: 120_000,             // 2 minutos entre reintentos
    max_retries: 5
};
```

### Logging Recomendado

```javascript
logger.info('Enviando documento', {
    invoice_number: 'FV-2025-000001',
    timestamp: new Date(),
    size_bytes: jsonString.length
});

logger.info('Respuesta recibida', {
    http_code: 200,
    dian_code: '00',
    cufe: xmlDocumentKey,
    time_ms: duration
});

logger.error('Timeout en intento 3', {
    attempt: 3,
    waited_ms: 60000,
    action_next: 'retry'
});
```

### Monitoreo de Métricas

Alerta si:
- % timeouts (504) > 5%
- % rechazos DIAN (03) > 2%
- % duplicados (02) > 1%
- Tiempo promedio respuesta > 20s
- Contingencias (04) > 0.1%

---

## Timeline Completo

### Día 1 (Lunes)
- ✓ 9:00 - Mejora #1: TOC (1h)
- ✓ 10:00 - Mejora #2: Reorganizar 12.4 (2h)
- ✓ 12:30 - Pausa
- ✓ 13:30 - Revisión y QA (30 min)
- ✓ 14:00 - Commit

### Día 2 (Martes)
- ✓ 9:00 - Mejora #3: Detalle 4xx (3h)
- ✓ 12:00 - Pausa
- ✓ 13:00 - Mejora #4: StatusCode 98 (1.5h)
- ✓ 14:30 - Commit

### Día 3 (Miércoles)
- ✓ 9:00 - Mejora #5: FAQ (1h)
- ✓ 10:00 - Mejora #6: Diagrama (1.5h)
- ✓ 11:30 - Mejora #7: Best Practices (1h)
- ✓ 12:30 - Pausa
- ✓ 13:30 - QA final (1h)
- ✓ 14:30 - Commit

### Día 4-5 (Jueves-Viernes)
- ✓ Revisión total
- ✓ Correcciones finales
- ✓ Deploy a rama
- ✓ Review y merge

**Total:** 12-14 horas repartidas en 3-5 días

---

## Checklist de Implementación

### Fase 1: Estructura Base
- [ ] Agregar TOC al inicio
- [ ] Agregar Quick Reference table
- [ ] Reorganizar encabezados (eliminar vacíos)
- [ ] Agregar separadores `---`

### Fase 2: Contenido Detalle
- [ ] Reescribir sección 12.4
- [ ] Agregar 400-404, 422 con detalle completo
- [ ] Agregar StatusCode 98 sección
- [ ] Agregar ejemplos JSON para cada error 4xx

### Fase 3: Contenido Adicional
- [ ] Agregar FAQ
- [ ] Agregar diagrama ASCII
- [ ] Agregar mejores prácticas
- [ ] Agregar tabla StatusCodes DIAN

### Fase 4: Pulido
- [ ] Fijar ortografía
- [ ] Revisar indentación JSON
- [ ] Revisar consistencia en formatos
- [ ] Agregar links internos

### Fase 5: Validación
- [ ] Verificar compilación MDX
- [ ] Revisar links internos
- [ ] Test de navegación TOC
- [ ] Review por equipo

---

**Estimado:** 8-14 horas
**Impacto:** Puntuación 4.5/10 → 8.5/10
**Prioridad:** 🔴 ALTA
