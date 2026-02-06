---
slug: version-3-0-0-autogestion-webhooks-membresias
title: Versión 3.0.0 - Autogestión, Webhooks y Membresías
authors: [lewis]
tags: [release, v3.0.0, webhooks, tokens, memberships, breaking-changes]
date: 2026-02-06
---

# 🚀 API UBL 2.1 v3.0.0 - Autogestión Total y Notificaciones en Tiempo Real

Nos complace anunciar el lanzamiento de la **versión 3.0.0** de nuestra API de Facturación Electrónica, que representa un cambio significativo en cómo los desarrolladores interactúan con nuestro servicio.

Esta versión introduce tres pilares fundamentales:
- **🔑 Personal Access Tokens (PAT)** - Autogestión completa de credenciales
- **🔔 Webhooks** - Notificaciones en tiempo real
- **📊 Sistema de Membresías** - Límites transparentes y escalabilidad

<!--truncate-->

## 🎯 Resumen Ejecutivo

### ¿Por qué v3.0.0?

Hasta la versión 2.x, los desarrolladores debían:
- ❌ Contactar soporte técnico para obtener tokens
- ❌ Esperar aprobaciones manuales
- ❌ Hacer polling constante para verificar estados
- ❌ No tener visibilidad clara de sus límites de consumo

Con v3.0.0, todo cambia:
- ✅ **Autogestión total** - Crea y revoca tus propios tokens
- ✅ **Tiempo real** - Recibe notificaciones automáticas de eventos
- ✅ **Transparencia** - Conoce tus límites y consumo en todo momento
- ✅ **Escalabilidad** - Sistema de membresías adaptado a tu negocio

---

## 🔑 Personal Access Tokens (PAT)

### ¿Qué son los PAT?

Los **Personal Access Tokens** son credenciales de autenticación que **tú mismo puedes crear, renovar y revocar** sin necesidad de contactar a soporte técnico.

### Características Principales

#### ⏱️ **Expiración Configurable**
Establece el tiempo de vida del token entre **1 y 90 días**. Recomendamos:
- **30 días** para desarrollo/pruebas
- **90 días** para producción (balance seguridad/conveniencia)

#### 🔐 **Múltiples Tokens por Cuenta**
Crea diferentes tokens para:
- Distintos entornos (desarrollo, staging, producción)
- Diferentes aplicaciones
- Equipos específicos
- Propósitos de auditoría

#### 🗑️ **Revocación Instantánea**
Si un token se ve comprometido:
- Revocación inmediata de un token específico
- Revocación masiva de todos los tokens
- El token deja de funcionar en &lt;200ms

### Migración desde OAuth2

Los tokens OAuth2 tradicionales **aún funcionan**, pero recomendamos migrar a PAT por:

| OAuth2 Tradicional | Personal Access Tokens |
|-------------------|------------------------|
| Requiere contactar soporte | Autogestión completa |
| 90 días de validez fija | Configura expiración (1-90 días) |
| Difícil revocación selectiva | Revocación instantánea y selectiva |
| 1 token por cuenta | Múltiples tokens con propósitos diferentes |

### Ejemplo de Uso

```javascript
// 1. Crear un nuevo token
const response = await fetch('https://api.matias-api.com/v3/auth/tokens', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${currentToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Production Server Token',
    expires_in_days: 60,
    scopes: ['invoices:create', 'invoices:read']
  })
});

const { token, expires_at } = await response.json();

// 2. Usar el nuevo token
const invoice = await fetch('https://api.matias-api.com/v3/invoices', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...})
});

// 3. Revocar el token si es necesario
await fetch(`https://api.matias-api.com/v3/auth/tokens/${tokenId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${currentToken}`
  }
});
```

📖 **[Ver documentación completa de Personal Access Tokens](/docs/endpoints#personal-access-tokens)**

---

## 🔔 Sistema de Webhooks

### ¿Qué son los Webhooks?

Los **Webhooks** permiten que tu aplicación **reciba notificaciones automáticas en tiempo real** cuando ocurren eventos importantes, eliminando la necesidad de hacer polling constante a la API.

### Ventajas sobre Polling

| Polling (v2.x) | Webhooks (v3.0.0) |
|----------------|-------------------|
| Consultas cada 30-60 segundos | Notificación instantánea (&lt;1s) |
| Alto consumo de recursos | Eficiente y bajo consumo |
| Posible pérdida de eventos | Garantía de entrega (reintentos) |
| Latencia 30-60 segundos | Latencia &lt;1 segundo |

### Eventos Disponibles (26 tipos)

#### 📄 Facturación
- `invoice.created` - Factura creada
- `invoice.accepted` - DIAN aceptó la factura
- `invoice.rejected` - DIAN rechazó la factura
- `invoice.validated` - Validación DIAN completada
- `invoice.email_sent` - Email enviado al cliente

#### 💳 Notas Crédito/Débito
- `credit_note.created`, `credit_note.accepted`, `credit_note.rejected`
- `debit_note.created`, `debit_note.accepted`, `debit_note.rejected`

#### 🧾 Documentos Soporte
- `support_document.created`
- `support_document.accepted`
- `support_document.rejected`

#### 💰 Páginas de Pago (Wompi)
- `payment_page.created` - Página de pago generada
- `payment_page.paid` - Cliente completó el pago
- `payment_page.expired` - Página de pago expiró
- `payment_page.cancelled` - Pago cancelado

#### 📊 Membresías
- `membership.activated` - Membresía activada
- `membership.upgraded` - Plan mejorado
- `membership.downgraded` - Plan reducido
- `membership.suspended` - Cuenta suspendida
- `membership.limit_reached` - Límite alcanzado (80%)
- `membership.limit_exceeded` - Límite excedido (100%)

#### 🔑 Tokens de Acceso
- `token.created` - Nuevo token PAT creado
- `token.revoked` - Token revocado
- `token.expired` - Token expiró

#### 🔔 Webhooks
- `webhook.created` - Nuevo webhook registrado
- `webhook.test_sent` - Webhook de prueba enviado

### Seguridad: Verificación de Firma HMAC

Cada notificación webhook incluye una **firma HMAC-SHA256** en el header `X-Signature` que debes verificar:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const computedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

// En tu endpoint de webhook
app.post('/webhooks/matias', (req, res) => {
  const signature = req.headers['x-signature'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(403).json({ error: 'Firma inválida' });
  }
  
  // Procesar el evento
  const { event, data } = req.body;
  console.log(`Evento recibido: ${event}`, data);
  
  res.status(200).json({ received: true });
});
```

### Sistema de Reintentos

Si tu servidor no responde `200 OK`, el sistema reintenta automáticamente:

| Intento | Espera | Tiempo Total |
|---------|--------|--------------|
| 1 | Inmediato | 0s |
| 2 | 1 minuto | 1m |
| 3 | 5 minutos | 6m |
| 4 | 15 minutos | 21m |
| 5 | 1 hora | ~1h 21m |

Después de 5 intentos fallidos, el webhook se marca como fallido y debes verificar manualmente.

### Ejemplo de Payload

```json
{
  "event": "invoice.accepted",
  "timestamp": "2026-02-06T14:30:00Z",
  "data": {
    "invoice_id": "INV-2026-00123",
    "prefix": "FACT",
    "number": 123,
    "amount": 1500000,
    "customer": {
      "name": "Empresa XYZ S.A.S.",
      "nit": "900123456-1"
    },
    "dian": {
      "cufe": "abc123...",
      "status": "ACEPTADA",
      "validated_at": "2026-02-06T14:29:45Z"
    }
  }
}
```

📖 **[Ver documentación completa de Webhooks](/docs/endpoints#webhooks)**

---

## 📊 Sistema de Membresías y Límites

### ¿Por qué Límites?

Para garantizar un servicio sostenible, escalable y de calidad para todos los usuarios, implementamos límites transparentes basados en planes de membresía.

### Límites por Recurso

Cada plan incluye límites mensuales para:

#### 📄 **Documentos Electrónicos**
- Facturas de venta
- Notas crédito/débito
- Documentos soporte
- Documentos equivalentes POS

#### 💾 **Almacenamiento XML**
- Espacio para archivos XML
- Archivos adjuntos (attachments)
- Custodia de documentos

#### 📧 **Envíos de Email**
- Notificaciones a clientes
- Envío de facturas por correo
- Alertas automáticas

#### 🔗 **Webhooks**
- Número de webhooks activos
- Eventos por mes

### Manejo de Límites Excedidos

#### ⚠️ Alertas Preventivas (80%)

Cuando alcanzas el **80% de tu límite**, recibes:
- ✉️ Email de advertencia
- 🔔 Notificación webhook (`membership.limit_reached`)
- 📊 Dashboard actualizado

#### 🛑 Límite Alcanzado (100%)

Cuando excedes el límite:

**Respuesta HTTP:**
```json
HTTP/1.1 402 Payment Required
{
  "error": "Límite de documentos alcanzado",
  "code": "DOCUMENT_LIMIT_REACHED",
  "current_usage": 1000,
  "limit": 1000,
  "reset_date": "2026-03-01T00:00:00Z",
  "upgrade_url": "https://app.matias-api.com/memberships/upgrade"
}
```

**Acciones Posibles:**
1. **Esperar el reset mensual** (día 1 de cada mes)
2. **Mejorar tu plan de membresía** (upgrade)
3. **Contactar ventas** para plan personalizado

### Consultar Consumo Actual

```javascript
const response = await fetch('https://api.matias-api.com/v3/memberships/consumption', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const consumption = await response.json();
console.log(consumption);
```

**Respuesta:**
```json
{
  "membership": {
    "plan": "Professional",
    "status": "active"
  },
  "billing_period": {
    "start": "2026-02-01T00:00:00Z",
    "end": "2026-02-28T23:59:59Z",
    "reset_in_days": 22
  },
  "limits": {
    "documents": {
      "limit": 1000,
      "used": 723,
      "remaining": 277,
      "percentage": 72.3
    },
    "storage_mb": {
      "limit": 5000,
      "used": 3200,
      "remaining": 1800,
      "percentage": 64.0
    },
    "emails": {
      "limit": 2000,
      "used": 1580,
      "remaining": 420,
      "percentage": 79.0
    },
    "webhooks": {
      "limit": 10,
      "used": 4,
      "remaining": 6,
      "percentage": 40.0
    }
  }
}
```

📖 **[Ver documentación de Membresías y Consumo](/docs/endpoints#memberships-consumption)**

---

## 🔄 Migración desde v2.x

### ¿Es Obligatorio Migrar?

**No inmediatamente.** La v2.x seguirá funcionando, pero recomendamos migrar para aprovechar las nuevas funcionalidades.

### Plan de Migración Sugerido

#### **Fase 1: Estudio (Semana 1-2)**
- ✅ Lee la documentación de v3.0.0
- ✅ Identifica qué endpoints usas actualmente
- ✅ Revisa los límites de tu plan actual

#### **Fase 2: Pruebas (Semana 3-4)**
- ✅ Crea un Personal Access Token de prueba
- ✅ Configura webhooks en entorno de desarrollo
- ✅ Prueba los nuevos endpoints

#### **Fase 3: Implementación (Semana 5-6)**
- ✅ Implementa verificación de firmas HMAC
- ✅ Reemplaza polling por webhooks
- ✅ Agrega manejo de errores 402 (límites)

#### **Fase 4: Producción (Semana 7-8)**
- ✅ Despliega en producción
- ✅ Monitorea consumo y límites
- ✅ Ajusta plan de membresía si es necesario

### Cambios que Rompen Compatibilidad

:::warning Breaking Changes
Los siguientes cambios pueden requerir actualizar tu código:
:::

#### 1️⃣ **Nuevos Códigos HTTP**

```javascript
// NUEVO en v3.0.0
if (response.status === 402) {
  // Límite de membresía alcanzado
  const data = await response.json();
  console.error(`Límite alcanzado: ${data.error}`);
  console.log(`Reset: ${data.reset_date}`);
}

if (response.status === 403) {
  // Token revocado o expirado
  console.error('Token inválido, solicita uno nuevo');
}
```

#### 2️⃣ **Headers Adicionales**

```javascript
// RECOMENDADO en v3.0.0
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'X-API-Version': '3.0.0', // Nuevo: Especifica versión
  'X-Client-ID': 'my-app-v1.2' // Nuevo: Identifica tu app
};
```

#### 3️⃣ **Estructura de Errores Mejorada**

```javascript
// v2.x
{
  "error": "Invalid token"
}

// v3.0.0
{
  "error": "Token inválido o expirado",
  "code": "TOKEN_EXPIRED",
  "details": {
    "token_id": "tok_abc123",
    "expired_at": "2026-01-15T10:00:00Z"
  },
  "suggestion": "Crea un nuevo token en /v3/auth/tokens"
}
```

---

## 📈 Nuevos Endpoints v3.0.0

### Personal Access Tokens
- `GET /v3/auth/tokens` - Listar todos los tokens
- `POST /v3/auth/tokens` - Crear nuevo token
- `DELETE /v3/auth/tokens/{id}` - Revocar token específico
- `POST /v3/auth/tokens/revoke-all` - Revocar todos los tokens

### Webhooks
- `GET /v3/webhooks` - Listar webhooks
- `POST /v3/webhooks` - Crear webhook
- `PUT /v3/webhooks/{id}` - Actualizar webhook
- `DELETE /v3/webhooks/{id}` - Eliminar webhook
- `POST /v3/webhooks/{id}/test` - Enviar evento de prueba
- `GET /v3/webhooks/events` - Listar tipos de eventos

### Membresías
- `GET /v3/memberships/current` - Obtener plan actual
- `GET /v3/memberships/consumption` - Consultar consumo

📖 **[Ver referencia completa de endpoints](/docs/endpoints)**

---

## 🎓 Recursos de Aprendizaje

### Documentación
- 📖 [Guía de Personal Access Tokens](/docs/endpoints#personal-access-tokens)
- 📖 [Guía de Webhooks](/docs/endpoints#webhooks)
- 📖 [Guía de Membresías](/docs/endpoints#memberships-consumption)

### Ejemplos de Código
- 💻 [Colección Postman v3.0.0](https://documenter.getpostman.com/view/8699065/2s9YyvBLby)
- 💻 [Repositorio de Ejemplos GitHub](https://github.com/matias-api/examples)

### Soporte
- 💬 [Discord Community](https://discord.gg/matias-api)
- 📧 [Soporte Técnico](mailto:soporte@matias-api.com)
- 📞 Teléfono: +57 (601) 234-5678

---

## 🚀 Comienza Hoy

1. **Inicia sesión** en tu cuenta: https://app.matias-api.com
2. **Crea tu primer PAT** en la sección "Tokens de Acceso"
3. **Configura webhooks** para recibir notificaciones
4. **Consulta tu consumo** y ajusta tu plan si es necesario

---

## 🙏 Agradecimientos

Gracias a todos nuestros usuarios beta que ayudaron a probar y mejorar v3.0.0. Sus comentarios fueron invaluables para crear un producto mejor.

¿Preguntas? ¿Sugerencias? Contáctanos en soporte@matias-api.com

---

**Equipo de Desarrollo API Matias**  
*Facturación Electrónica para Colombia*

---

*Versión 3.0 | Febrero 2026*
