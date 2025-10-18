---
sidebar_position: 2
description: "Flujos de respuesta RADIAN - Aceptación, rechazo y endoso detallados"
---

# Flujos de Respuesta RADIAN

## 📋 Tipos de Respuestas

RADIAN Define 4 tipos de respuestas principales que puede dar un recibidor:

| Código | Nombre | Efecto | Plazo |
|--------|--------|--------|-------|
| **ACE** | Aceptación | Documento entra en circulación | Antes de 30 días |
| **ACP** | Aceptación Condicional | Ambas partes acuerdan términos | Antes de 30 días |
| **RCH** | Rechazo | Vendedor debe corregir/reemitir | Antes de 30 días |
| **Tácita** | Sin respuesta | Aceptación automática | Después de 30 días |

---

## ✅ FLUJO 1: ACEPTACIÓN (ACE)

### Escenario: Documento Correcto

```
PASO 1: Emisor crea y firma
   └─ Factura: $1,000,000 (500 unidades)
   └─ Firma con certificado válido
   └─ Envía a DIAN

PASO 2: DIAN valida y radica
   └─ Estructura XML correcta ✅
   └─ Firma digital válida ✅
   └─ Radicado: FPP862141001202510001
   └─ Notificación al recibidor

PASO 3: Recibidor obtiene documento
   └─ Email: "Nueva factura para revisar"
   └─ Portal: Descarga XML + PDF
   └─ Revisa detalles

PASO 4: Validación por recibidor
   ✅ NIT vendedor correcto
   ✅ Datos de compra correctos
   ✅ Cantidad coincide con remisión
   ✅ Precio es el pactado
   ✅ Sin observaciones

PASO 5: Recibidor envía ACE
   └─ Accede a portal DIAN
   └─ Busca: FPP862141001202510001
   └─ Selecciona: "ACEPTAR"
   └─ Envía ACE a DIAN
   └─ Radicado ACE generado

PASO 6: Confirmación a vendedor
   └─ Email: "Documento aceptado"
   └─ Radicado ACE disponible
   └─ Documento en circulación

PASO 7: Efecto contable
   └─ Vendedor: Registra ingreso
   └─ Recibidor: Registra gasto/pasivo
   └─ Ambos: Datos para auditoría
```

### JSON de Respuesta ACE

```json
{
  "documento_radian": {
    "radicado_original": "FPP862141001202510001",
    "tipo_respuesta": "ACE",
    "fecha_respuesta": "2025-10-17T14:32:15Z",
    "recibidor": {
      "nit": "987654321-0",
      "nombre": "Empresa Compradora S.A."
    },
    "emisor": {
      "nit": "123456789-1",
      "nombre": "Vendedor Express S.A.S."
    },
    "documento_original": {
      "radicado": "FPP862141001202510001",
      "fecha": "2025-10-15",
      "tipo": "FACTURA",
      "monto": 1000000
    },
    "accion": {
      "descripcion": "ACEPTACION",
      "estado": "CONFIRMADA",
      "efecto": "DOCUMENTO EN CIRCULACION"
    },
    "observaciones": null,
    "validez": "VIGENTE"
  }
}
```

---

## ⚠️ FLUJO 2: ACEPTACIÓN CONDICIONAL (ACP)

### Escenario: Parcialmente Correcto

```
PASO 1: Recibidor valida
   ✅ NIT vendedor: Correcto
   ✅ Producto: Correcto
   ⚠️ Cantidad: Menor a lo facturado
   ⚠️ Se facturó 500 unidades
   ⚠️ Se recibieron solo 480

PASO 2: Opciones del recibidor
   Opción A: Rechazar completo (RCH)
   Opción B: Aceptar pero con condiciones (ACP) ◄── Selecciona
   Opción C: Aceptar total (ACE)

PASO 3: Recibidor especifica condiciones
   Condición 1: "Falta por recibir: 20 unidades"
   Condición 2: "Facturación debe ajustarse o NC"
   Condición 3: "Plazo se extiende 15 días adicionales"

PASO 4: Envía ACP con detalles
   └─ Portal DIAN
   └─ Selecciona: "ACEPTAR CON CONDICIONES"
   └─ Detalla cada condición
   └─ Firma y envía

PASO 5: Vendedor recibe ACP
   └─ Email: "Documento con condiciones"
   └─ Debe validar si acepta condiciones
   └─ Si no acepta: Envía RCH él mismo

PASO 6: Posibles resolutivos
   Escenario 1: Vendedor está de acuerdo
   └─ Envía Nota Crédito por diferencia
   └─ Fecha nueva se registra
   └─ ACP se transforma en ACE

   Escenario 2: Vendedor en desacuerdo
   └─ Puede enviar RCH él mismo
   └─ Solicita verificación de remisión
   └─ Negocia con recibidor

PASO 7: Resolución final
   └─ ACE: Si ambas partes acuerdan
   └─ RCH: Si hay desacuerdo
   └─ Documento se normaliza
```

### JSON de Respuesta ACP

```json
{
  "documento_radian": {
    "radicado_original": "FPP862141001202510002",
    "tipo_respuesta": "ACP",
    "fecha_respuesta": "2025-10-16T10:15:00Z",
    "recibidor": {
      "nit": "987654321-0",
      "nombre": "Empresa Compradora S.A."
    },
    "condiciones": [
      {
        "numero": 1,
        "descripcion": "Cantidad Incompleta",
        "detalle": "Facturado: 500, Recibido: 480, Diferencia: 20",
        "accion_requerida": "Nota crédito por diferencia o envío complementario"
      },
      {
        "numero": 2,
        "descripcion": "Plazo extendido",
        "plazo_original": "2025-11-15",
        "plazo_modificado": "2025-11-30",
        "razon": "Plazo adicional por espera de cantidad faltante"
      },
      {
        "numero": 3,
        "descripcion": "Validación de calidad",
        "especificacion": "Producto debe cumplir especificaciones ISO 9001",
        "formato": "Certificado de conformidad requerido"
      }
    ],
    "estado": "PENDIENTE_DE_RESOLUCION",
    "impacto": "Documento NO entra en circulación hasta resolución"
  }
}
```

---

## ❌ FLUJO 3: RECHAZO (RCH)

### Escenario: Documento Inaceptable

```
PASO 1: Recibidor valida
   ✅ NIT vendedor: Correcto
   ✅ Datos básicos: Correctos
   ❌ Cantidad: 100 unidades (se facturaron 500)
   ❌ Precio: Error de 50% más alto
   ❌ Cliente: Datos incorrectos

PASO 2: Recibidor cuenta problemáticas
   Problema 1: Cantidad NO coincide
   Problema 2: Precio superior a orden de compra
   Problema 3: Nombre de cliente incorrecto
   → 3 problemas graves = RECHAZO

PASO 3: Recibidor envía RCH
   └─ Portal DIAN
   └─ Selecciona: "RECHAZAR"
   └─ Especifica motivo principal
   └─ Detalla problemas encontrados
   └─ Propone solución

PASO 4: Motivos de rechazo disponibles
   - CANTIDAD_INCORRECTA
   - PRECIO_INCORRECTO
   - DATOS_CLIENTE_INCORRECTOS
   - PRODUCTO_NO_RECIBIDO
   - FACTURA_DUPLICADA
   - FECHA_INCORRECTA
   - OTRO (especificar)

PASO 5: Vendedor notificado de rechazo
   └─ Email: "Documento rechazado"
   └─ Detalles de cada problema
   └─ Solicitado: Ajuste o reemisión
   └─ Plazo: Resolver antes de N días

PASO 6: Acciones del vendedor
   Opción A: Emitir Nota Crédito
   └─ Por diferencia de precio o cantidad
   └─ Genera nueva factura correcta
   └─ Recibidor valida nuevamente

   Opción B: Reemitir factura completa
   └─ FE rechazada queda anulada
   └─ Nueva FE con datos correctos
   └─ Recibidor obtiene nueva solicitud

   Opción C: Contactar a recibidor
   └─ Si cree que rechazo es error
   └─ Negociación entre partes
   └─ Puede generar ACE luego

PASO 7: Resolución
   └─ NC + Nueva FE enviadas
   └─ RCH sigue vigente para FE original
   └─ FE original no entra en circulación
   └─ FE corregida entra en RADIAN nuevamente
```

### JSON de Respuesta RCH

```json
{
  "documento_radian": {
    "radicado_original": "FPP862141001202510003",
    "tipo_respuesta": "RCH",
    "fecha_respuesta": "2025-10-16T09:30:00Z",
    "recibidor": {
      "nit": "987654321-0",
      "nombre": "Empresa Compradora S.A."
    },
    "motivo_principal": "CANTIDAD_INCORRECTA",
    "motivos_adicionales": [
      {
        "tipo": "CANTIDAD_INCORRECTA",
        "linea": 1,
        "cantidad_facturada": 500,
        "cantidad_solicitada": 100,
        "diferencia": 400,
        "severidad": "CRITICA"
      },
      {
        "tipo": "PRECIO_INCORRECTO",
        "linea": 1,
        "precio_facturado": 2000,
        "precio_pactado": 1000,
        "diferencia_porcentaje": 100,
        "severidad": "CRITICA"
      }
    ],
    "observaciones": "Factura no coincide con orden de compra OC-2025-001. Se solicita reemisión completa.",
    "sugerencia_resolutivo": "Emitir Nota Crédito total y nueva FE con datos correctos",
    "estado": "RECHAZADO",
    "impacto": "Documento NO entra en circulación. Vendedor debe corregir."
  }
}
```

---

## ⏰ FLUJO 4: ACEPTACIÓN TÁCITA (Sin Respuesta)

### Escenario: Vencimiento de Plazo

```
DÍA 0: Documento radicado
   └─ DIAN radica FE
   └─ Recibidor notificado
   └─ Plazo disponible: 30 días

DÍAS 1-29: Esperando respuesta
   └─ Recibidor puede responder
   └─ Vendedor en espera
   └─ Documento en estado: PENDIENTE

DÍA 30: Vencimiento de plazo
   └─ Sin respuesta del recibidor
   └─ DIAN aplica aceptación automática
   └─ Estado cambia: ACEPTADO TACITAMENTE
   └─ Documento entra en circulación

PASO 1: Antes del plazo
   ├─ Recibidor recibe notificación
   ├─ Tiene 30 días para responder
   ├─ Puede hacer: ACE, ACP, RCH, o nada

PASO 2: Opciones disponibles
   ✅ Responder (ACE/ACP/RCH)
   ❌ NO responder
   ⏰ La no respuesta = Aceptación automática

PASO 3: Impacto de la aceptación tácita
   └─ Documento entra en circulación
   └─ Vendedor puede cobrar
   └─ Recibidor está obligado
   └─ No hay "arrepentimiento" posterior

PASO 4: Validez legal
   └─ Aceptación tácita = Aceptación plena
   └─ Recibidor no puede rechazar después
   └─ Si hay problemas, solo ACP funciona
   └─ (aunque tardía)

PASO 5: Recomendaciones
   ⚠️ NO es recomendable dejar vencer plazo
   ⚠️ Si hay problema: Enviar RCH/ACP
   ⚠️ Silencio = Consentimiento legal
```

### Timeline Visual

```
FE Radicada       Plazo Vence          Aceptación Tácita
     ↓                  ↓                        ↓
Oct 1         +30 días         Nov 1          Nov 1
├─────────────────────────────────────────────────────►
│                                    │
├─ Recibidor puede responder        │
│  (ACE/ACP/RCH)                    │
│                                    │
└─ Si no responde antes: ACEPTACIÓN TÁCITA automática
```

---

## 🔄 FLUJO 5: ENDOSO (Transferencia de Derechos)

### Escenario: Factor Financiero

```
SUJETOS:
- Vendedor (V): Emitió factura
- Comprador (C): Recibidor y deudor
- Factor (F): Tercero que compra deuda

PASO 1: FE Emitida y Aceptada
   V ──FE──► C
   └─ FE-100: $1,000,000
   └─ Aceptada (ACE)

PASO 2: Comprador necesita liquidez
   C necesita $900,000 en efectivo
   C no puede esperar 30 días para pagar
   C acude a Factor F

PASO 3: Acuerdo entre C y F
   C cede derechos por $900,000
   F pagará a C: $900,000
   C autoriza a F como acreedor
   Comisión F: $100,000 (10%)

PASO 4: C genera Endoso en RADIAN
   └─ Referencia a FE-100
   └─ Monto: $900,000 (de $1,000,000)
   └─ Beneficiario: Factor F (NIT)
   └─ Tipo: Cesión total de derechos
   └─ Firma por C (certificado)

PASO 5: C envía Endoso a DIAN
   └─ DIAN valida estructura
   └─ Verifica autorización
   └─ Genera radicado: END-FPP-860001...
   └─ Notificación a C y F

PASO 6: C notifica a Vendedor V
   └─ Información: "Factor cobra a partir de ahora"
   └─ Adjunta: Endoso registrado
   └─ Solicita: Aceptación (si requerida)

PASO 7: F recibe notificación de DIAN
   └─ Email con detalles del endoso
   └─ Acceso a documento original
   └─ Autorización para cobrar al deudor

PASO 8: C paga a Factor F
   └─ C trasfiere $900,000 a Factor
   └─ Factor recibe y procesa
   └─ Factor paga a Vendedor V: $900,000
   └─ Saldo: $100,000 aún debe C a V

PASO 9: Cierre y trazabilidad
   └─ FE-100: ACE (Aceptada)
   └─ END-FPP-860001: Endoso registrado
   └─ Movimiento bancario: Evidenciado
   └─ RADIAN: Historial completo
```

### JSON de Endoso

```json
{
  "documento_radian": {
    "tipo": "ENDOSO",
    "fecha_generacion": "2025-10-17T11:00:00Z",
    "cedente": {
      "nit": "987654321-0",
      "nombre": "Empresa Compradora S.A.",
      "rol": "ORIGINAL_RECIBIDOR"
    },
    "cesionario": {
      "nit": "555666777-8",
      "nombre": "Factor Financiero S.A.",
      "rol": "NUEVO_ACREEDOR"
    },
    "documento_referenciado": {
      "radicado": "FPP862141001202510100",
      "tipo": "FACTURA",
      "fecha": "2025-10-15",
      "monto_total": 1000000
    },
    "cesion": {
      "monto_cedido": 900000,
      "monto_no_cedido": 100000,
      "porcentaje": 90,
      "tipo_cesion": "TOTAL_DERECHOS",
      "con_reclamacion": false
    },
    "autorizacion": {
      "firmado_por": "Cedente (Comprador)",
      "certificado_valido": true,
      "timestamp": "2025-10-17T11:00:15Z"
    },
    "radicado_endoso": "END-FPP-862141001202510100",
    "estado": "CONFIRMADO"
  }
}
```

---

## 📊 Tabla Comparativa de Flujos

| Flujo | Código | Tiempo | Acción | Documento |
|-------|--------|--------|--------|-----------|
| Aceptación | ACE | Inmediato | Circula | En uso |
| Condicional | ACP | Inmediato | Negocia | Pausado |
| Rechazo | RCH | Inmediato | Corregir | Rechazado |
| Tácita | Auto | 30 días | Circula auto | En uso |
| Endoso | END | Cuando sea | Transfiere | Modificado |

---

## ✅ Validaciones en Flujos

```
FLUJO ACE: ¿Qué validar?
├─ Datos del recibidor correctos
├─ Cantidad/precio coinciden
├─ Producto recibido conforme
└─ Sin discrepancias

FLUJO ACP: ¿Cuándo usar?
├─ Hay pequeñas discrepancias
├─ Necesita tiempo para resolver
├─ NO es rechazo completo
└─ Ambas partes pueden negociar

FLUJO RCH: ¿Motivos válidos?
├─ Error grave en documento
├─ Producto NO recibido
├─ Factura duplicada
├─ Datos del cliente incorrectos
└─ Precio muy diferente de pactado

FLUJO ENDOSO: ¿Requisitos?
├─ FE ya aceptada (ACE)
├─ Autorización explícita del cedente
├─ Tercero verificado en DIAN
├─ Monto especificado
└─ Firma digital válida
```

---

**Última actualización:** Octubre 2025  
**Versión:** 2.0 (Resolución 000198/2024)
