---
sidebar_position: 1
description: "Guía completa de RADIAN v2.0 - Red de Administración de Documentos"
---

# RADIAN v2.0 - Red de Administración de Documentos

## 📌 Visión General

**RADIAN** es un modelo tecnológico integral para el **intercambio electrónico seguro de documentos electrónicos**, donde el recibidor reconoce, procesa y da trámite a la transferencia de derechos y obligaciones derivadas de transacciones comerciales.

Es el mecanismo oficial de la DIAN para que los documentos electrónicos circulen entre terceros con validez legal y trazabilidad completa.

### Base Normativa

| Aspecto | Detalle |
|--------|---------|
| **Resolución DIAN** | Resolución 000198 de 2024 |
| **Versión Vigente** | 2.0 |
| **Estándar XML** | UBL 2.1 (Universal Business Language) |
| **Validación** | Schematron + Reglas de Negocio |
| **Vigencia** | Vigente desde octubre de 2024 |

---

## 🎯 Propósitos Principales

✅ **Circulación de Documentos:** Transmisión segura entre agentes  
✅ **Transferencia de Derechos:** Cesión de obligaciones comerciales  
✅ **Trazabilidad Total:** Auditoría completa de cada transacción  
✅ **Validez Legal:** Reconocimiento oficial por DIAN  
✅ **No Repudio:** Cada parte tiene evidencia de sus acciones  
✅ **Integración:** Conexión con sistemas de DIAN y terceros  

---

## 📊 ¿Cuándo se Usa RADIAN?

### Casos de Uso Principales

```
FACTURA ELECTRÓNICA (FE)
├─ Cambio de propiedad mediante cesión
├─ Transferencia de derechos por endoso
├─ Compra-venta con intermediarios
└─ Factoraje (cesión a factor financiero)

NOTA CRÉDITO / NOTA DÉBITO
├─ Devoluciones con cambio de titular
├─ Ajustes relacionados con FE transferida
└─ Cancelación parcial entre terceros

DOCUMENTO SOPORTE
├─ Adquisiciones a no obligados con circulación
└─ Cambio de responsabilidad de pago

NÓMINA ELECTRÓNICA
├─ Transferencia de cesantía (en ciertos casos)
└─ Asignaciones a terceros (pensiones, etc.)
```

---

## 🔄 Conceptos Fundamentales

### Sujetos en RADIAN

**Emisor (E):** 
- Crea y firma el documento electrónico
- Responsable de autenticidad e integridad
- Ejemplo: Vendedor que emite factura

**Recibidor (R):**
- Recibe el documento del emisor
- Valida y reconoce la transacción
- Puede dar respuesta de aceptación/rechazo
- Ejemplo: Comprador que recibe factura

**Tercero Interviniente (T):**
- Intermedia en la transferencia
- Puede ser factor, banco, etc.
- Requiere autorización del recibidor
- Ejemplo: Empresa de factoraje

---

### Eventos en RADIAN

```
GENERACIÓN
├─ Documento creado por emisor
├─ Firmado digitalmente
└─ Enviado a DIAN para validación

RECEPCIÓN
├─ Recibidor obtiene documento
├─ Valida estructura y firma
├─ Sistema confirma recepción

ACEPTACIÓN
├─ Recibidor acepta términos
├─ Reconoce obligaciones
└─ Información contable actualiza

RECHAZO
├─ Recibidor rechaza documento
├─ Especifica motivo del rechazo
└─ Afecta derechos del vendedor

ENDOSO (TRANSFERENCIA)
├─ Recibidor transfiere derechos a tercero
├─ Nuevo recibidor valida
└─ Cadena de custodia se mantiene

CANCELACIÓN / AJUSTE
├─ Acuerdos entre partes
├─ Generación de rectificativas
└─ Trazabilidad completa
```

---

## 👥 Matriz Sujeto-Evento-Rol

RADIAN funciona con una matriz que define quién puede hacer qué en cada evento.

### Matriz Simplificada

```
EVENTO         | EMISOR | RECIBIDOR | TERCERO | ACCIÓN
─────────────────────────────────────────────────────────
GENERACIÓN     | ✅     | -         | -       | Crear + Firmar
RECEPCIÓN      | -      | ✅        | -       | Recibir
ACEPTACIÓN     | -      | ✅        | -       | Reconocer
RECHAZO        | -      | ✅        | -       | Rechazar
ENDOSO         | -      | ✅        | ✅      | Transferir
APROBACIÓN_PG  | -      | ✅        | ✅      | Autorizar pago
RECLAMO        | -      | ✅        | ✅      | Impugnar
CANCELACIÓN    | ✅     | ✅        | -       | Resolver
```

:::tip
**Matriz DIAN Completa:** Disponible en docs-dian con 20+ eventos y múltiples escenarios.
:::

---

## 📝 Tipos de Documentos en RADIAN

### Documentos Susceptibles

**Factura Electrónica (80%+ de uso):**
- Transmisible entre partes
- Puede cederse o endosarse
- Soporta pagos por terceros

**Nota Crédito:**
- Referenciada a FE original
- Circula con documento base
- Afecta deuda pendiente

**Nota Débito:**
- Referenciada a FE original
- Aumenta obligación
- Se endosa junto con FE

**Documento Soporte:**
- Para adquisiciones a no obligados
- Con transferencia de responsabilidad
- Menor volumen de uso

---

## 🔐 Ciclo de Vida del Documento en RADIAN

### Fase 1: Creación y Validación

```
1. Emisor crea documento electrónico (FE, NC, etc.)
   └─ Estructura XML correcta
   └─ Datos completos y validados
   └─ Identificación única

2. Emisor firma con certificado digital
   └─ Firma XAdES o XMLDSig
   └─ Timestamp autoridad certificadora
   └─ Integridad garantizada

3. Emisor envía a DIAN
   └─ Conexión segura (SFTP/WebService)
   └─ Radicado asignado
   └─ Confirmación de recepción

4. DIAN valida
   ├─ Estructura XML contra XSD
   ├─ Firma digital válida
   ├─ Reglas de negocio Schematron
   └─ Estado: RADICADO (si todo OK)
```

---

### Fase 2: Entrega al Recibidor

```
1. DIAN prepara paquete para recibidor
   ├─ XML completo + firma
   ├─ PDF legible
   ├─ Comprobante DIAN
   └─ Instrucciones de RADIAN

2. Recibidor obtiene documento
   ├─ Correo electrónico
   ├─ Portal de consulta DIAN
   ├─ Sistema del contribuyente (integrado)
   └─ Debe hacer dentro de 30 días

3. Recibidor valida
   ├─ Estructura y firma correctas
   ├─ Datos de su empresa correctos
   ├─ Puede descargar/almacenar
   └─ Documentación digital lista
```

---

### Fase 3: Respuesta del Recibidor

```
OPCIÓN A: ACEPTACIÓN
├─ Recibidor valida todos los datos
├─ Acepta términos y obligaciones
├─ Envía ACE (Aceptación) a DIAN
└─ Documento entra en circulación

OPCIÓN B: ACEPTACIÓN CON CONDICIONES
├─ Acepta pero especifica ajustes
├─ Ejemplo: Descuento pendiente de aplicar
├─ Envía ACP (Aceptación Condicional)
└─ Ambas partes acuerdan

OPCIÓN C: RECHAZO
├─ Motivo del rechazo: "Datos incorrectos"
├─ Especifica qué campos están mal
├─ Envía RCH (Rechazo) a DIAN
└─ Emisor debe corregir/reemitir

OPCIÓN D: SIN RESPUESTA (Tácita)
├─ Plazo legal: 30 días
├─ Se considera aceptación tácita
├─ Efecto legal automático
└─ Documento circula normalmente
```

---

### Fase 4: Endoso (Transferencia de Derechos)

```
ESCENARIO: Comprador debe $1,000,000 al Vendedor
Pero Vendedor le debe a Factor Financiero $800,000

PROCESO:
1. Vendedor crea Factura $1,000,000
2. Comprador recibe y acepta ACE
3. Comprador transfiere derechos a Factor:
   ├─ Genera endoso (RADIAN)
   ├─ Especifica monto: $800,000
   ├─ Factor se convierte en acreedor
   └─ Comprador sigue siendo deudor

4. Factor envía a DIAN:
   ├─ Endoso como documento RADIAN
   ├─ Referencia a FE original
   ├─ Autorización del Comprador
   └─ Radicado generado

5. Comprador notificado:
   ├─ Email de endoso
   ├─ Debe aceptar/rechazar
   ├─ Factor ahora acreedor principal
   └─ Comprador acepta pagar a Factor

RESULTADO: Factor tiene derecho a cobro
          Cadena completa en DIAN
          Trazabilidad de transferencias
```

---

### Fase 5: Pago y Cierre

```
PAGO POR COMPRADOR AL FACTOR:
├─ Comprador paga al Factor
├─ Factor debe notificar (en ciertos casos)
├─ Documento se marca como pagado
└─ Archivo cierra en RADIAN

PAGO PARCIAL:
├─ Comprador paga $300,000 de $800,000
├─ Saldo pendiente: $500,000
├─ RADIAN mantiene registro de pago parcial
├─ Documento sigue circulando por saldo
└─ Múltiples endosos pueden ocurrir

RESOLUCIÓN:
├─ Cancelación total
├─ Notas crédito por cambios
├─ Documentos ajustados
└─ Cierre definitivo con evidencia
```

---

## 📋 Respuestas RADIAN - Tipos

### ACE (Aceptación - Acceptance)

```json
{
  "tipo_respuesta": "ACE",
  "descripcion": "Aceptación total del documento",
  "reconocimiento": {
    "datos_correctos": true,
    "obligaciones_aceptadas": true,
    "cantidad": 1000000,
    "términos": "Conformes"
  },
  "fecha_respuesta": "2025-10-17",
  "validez": "Documento entra en circulación"
}
```

---

### ACP (Aceptación Condicional - Conditional Acceptance)

```json
{
  "tipo_respuesta": "ACP",
  "descripcion": "Aceptación con condiciones o excepciones",
  "condiciones": [
    {
      "descripcion": "Descuento comercial 5% pendiente de aplicar",
      "monto": 50000,
      "fecha_aplicacion": "2025-10-31"
    },
    {
      "descripcion": "Plazo de pago: 45 días (en lugar de 30)",
      "nueva_fecha_vencimiento": "2025-11-30"
    }
  ],
  "fecha_respuesta": "2025-10-17",
  "validez": "Ambas partes deben estar de acuerdo"
}
```

---

### RCH (Rechazo - Rejection)

```json
{
  "tipo_respuesta": "RCH",
  "descripcion": "Rechazo del documento",
  "motivo": "CANTIDAD_INCORRECTA",
  "detalles": [
    {
      "linea": 1,
      "cantidad_facturada": 100,
      "cantidad_recibida": 95,
      "diferencia": 5
    }
  ],
  "observaciones": "La cantidad recibida fue menor a la facturada",
  "fecha_respuesta": "2025-10-17",
  "impacto": "Vendedor debe ajustar o reemitir"
}
```

---

### SIN RESPUESTA (Aceptación Tácita)

```json
{
  "tipo_respuesta": "TÁCITA",
  "descripcion": "Sin respuesta en 30 días = Aceptación automática",
  "plazo_legal": 30,
  "fecha_vencimiento": "2025-11-16",
  "efecto": "Documento entra en circulación automáticamente"
}
```

---

## 🔗 Casos de Uso en Detalle

### Caso 1: Factoraje (Cesión de Derechos)

```
ACTORES:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  VENDEDOR   │◄──►│  COMPRADOR  │    │   FACTOR    │
│  (Emisor)   │    │(Recibidor)  │◄──►│(Tercero)    │
└─────────────┘    └─────────────┘    └─────────────┘

FLUJO:
1. Vendedor emite FE $1,000,000 (FEV-001)
   └─ Comprador recibe y acepta (ACE)

2. Comprador con problemas de liquidez
   └─ Acude a Factor para adelanto

3. Comprador endosa FE a Factor
   ├─ Monto: $950,000 (Factor cobra 5% comisión)
   ├─ Autorización: Comprador firma
   └─ RADIAN: Endoso registrado

4. Factor notificado como nuevo acreedor
   ├─ Email: "Recibidor autoriza pago a Factor"
   ├─ Factor ahora cobra a Comprador
   └─ Vendedor sigue recibiendo de comprador

5. Pago realizado
   ├─ Comprador paga Factor: $950,000
   ├─ Factor paga Vendedor: $950,000
   ├─ Comprador debe restante: $50,000 (diferencia)
   └─ RADIAN cierra con evidencia
```

---

### Caso 2: Negociación entre Empresas (SIN TERCERO)

```
ACTORES:
┌─────────────┐         ┌─────────────┐
│  EMPRESA A  │  ────►  │  EMPRESA B  │
│  (Vendedor) │         │(Comprador)  │
└─────────────┘         └─────────────┘

ESCENARIO: B rechaza porque cantidad no coincide

1. A emite FE-100: 500 unidades @ $100 c/u = $50,000
2. B recibe: "Solo llegaron 450 unidades"
3. B envía RCH (Rechazo) a DIAN
   └─ Motivo: "Cantidad menor a facturada"
4. A recibe rechazo
   ├─ Debe investigar (Logística/DIAN)
   ├─ Emite Nota Débito o corrige
   ├─ Genera FE-101: Rectificada
   └─ B valida y acepta

TRAZABILIDAD EN RADIAN:
└─ FE-100: RCH (rechazada)
└─ FE-101: ACE (aceptada)
└─ Evidencia de problema y solución
```

---

## 📊 Validaciones Críticas en RADIAN

```
ANTES DE GENERACIÓN:
✅ NIT vendedor activo en DIAN
✅ NIT comprador válido
✅ Documentos referencian correctamente
✅ Firma digital disponible y vigente

DURANTE CIRCULACIÓN:
✅ Respuesta dentro de plazo legal (30 días)
✅ Motivos de rechazo están documentados
✅ Endosos autorizados explícitamente
✅ Cadena de responsabilidad clara

AL FINALIZAR:
✅ Documento está pagado o en disputa
✅ Todos los movimientos registrados
✅ Evidencia de cada transacción
✅ Archivo disponible para auditoría
```

---

## ⚠️ Restricciones y Limitaciones

```
NO PUEDE HACERSE EN RADIAN:
❌ Endosar documento rechazado (RCH)
❌ Transferir sin autorización explícita
❌ Modificar documento en circulación
❌ Borrar historia de transacciones
❌ Usar certificado vencido o revocado

CONFLICTOS POSIBLES:
⚠️ Rechazo luego de aceptación tácita
⚠️ Múltiples endosos del mismo monto
⚠️ Pago parcial con múltiples acreedores
⚠️ Plazo vencido sin respuesta
```

---

## 🔐 Seguridad y Firma Digital

### Certificado Requerido

```
Tipo:         X.509 v3
Emisor:       Autoridad Certificadora autorizada
Vigencia:     Mínimo 1 año
Uso:          Debe estar habilitado para RADIAN
Nivel:        A3 recomendado (con token)
Propiedad:    Del Emisor del documento
```

### Cadena de Custodia

```
Documento original:
  └─ Firmado por Emisor ───► Hash + Firma Emisor
     │
     ├─ Recibido por Recibidor
     │    └─ Respuesta (ACE/RCH) ───► Hash + Firma Recibidor
     │
     ├─ Posible Endoso a Tercero
     │    └─ Autorización ───► Hash + Firma Recibidor
     │
     └─ DIAN mantiene copia de CADA PASO
        └─ Trazabilidad completa + auditoría
```

---

## 📞 Integración Técnica

### Conexión a DIAN

```
OPCIÓN 1: Desarrollo Propio
├─ SFTP o WebService seguro
├─ Autenticación con certificado
├─ Envío de XML + respuestas
└─ Mayor inversión técnica

OPCIÓN 2: Proveedor Tecnológico
├─ Intermediario conectado a DIAN
├─ Portal web para subir/recibir
├─ Gestión de certificados
└─ Menor complejidad operativa
```

---

## 📚 Flujos de Respuesta Resumidos

| Respuesta | Acción | Tiempo | Efecto |
|-----------|--------|--------|--------|
| **ACE** | Aceptación total | Inmediato | Documento circula |
| **ACP** | Aceptación condicionada | Inmediato | Ambas partes acuerdan |
| **RCH** | Rechazo | Inmediato | Vendedor debe corregir |
| **Tácita** | Sin respuesta | 30 días | Aceptación automática |
| **ENDOSO** | Transferencia | Cuando sea | Nuevo acreedor designado |

---

## 🚀 Próximos Pasos

Para implementar RADIAN:

1. 📖 Consulta [Introducción Detallada](/docs/regulatory-framework/radian/intro)
2. 🔄 Entiende [Flujos de Respuesta](/docs/regulatory-framework/radian/flujos)
3. 💡 Revisa [Casos de Uso](/docs/regulatory-framework/radian/casos-uso)
4. 🔧 Implementa [Integración Técnica](/docs/regulatory-framework/radian/flujos)
5. 📋 Consulta [Matriz Sujeto-Evento-Rol](/docs/regulatory-framework/radian/matriz)

---

## 📞 Contacto y Recursos

**DIAN - Módulo RADIAN:**
- 🌐 www.dian.gov.co/RADIAN
- 📞 +57 (1) 315 0000
- 📧 radian@dian.gov.co

**Documentación Oficial:**
- 📄 Anexo Técnico RADIAN v2.0
- 📊 Matriz Sujeto-Evento-Rol
- 🔒 Especificaciones de Seguridad

---

**Última actualización:** Octubre 2025  
**Versión:** 2.0 (Resolución 000198/2024)  
**Estado:** Vigente
