---
sidebar_position: 26
---

# Nota Crédito para Factura de Contingencia Tipo 03

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>⚠️ IMPORTANTE: Proceso Especial para Notas de Facturas Tipo 03</strong><br/>
  Las notas crédito/débito <strong>NO tienen esquema de contingencia</strong>. Para generar una nota que afecte a una factura de contingencia Tipo 03, primero debe transmitir la factura Tipo 03 a la DIAN, obtener el CUFE asignado, y luego generar la nota electrónica estándar referenciando ese CUFE.
</div>

## Información General

- **Tipo de Documento:** 5 (Nota Crédito)
- **Factura Referenciada:** Tipo 03 (Contingencia)
- **Campo Crítico:** `billing_reference` con el **CUFE asignado por la DIAN** a la factura Tipo 03
- **Normativa:** Anexo Técnico de Factura Electrónica v1.9

## Proceso Correcto

1. **Transmitir Factura Tipo 03:** Primero debe transmitir la factura de papel (XML Tipo 03) a la DIAN
2. **Obtener CUFE:** La DIAN valida el documento y le asigna un CUFE
3. **Generar Nota Electrónica:** Solo entonces puede generar esta Nota Crédito electrónica estándar
4. **Referenciar CUFE:** Use el CUFE asignado en el nodo `billing_reference`

## Estructura JSON

```json title="credit-note-type-03.json"
{
  "resolution_number": "18763005880468",
  "prefix": "NC",
  "notes": "Documento anulado, ejemplo documento contingencia tipo 03",
  "document_number": "762",
  "operation_type_id": 12,
  "type_document_id": 5,
  "graphic_representation": 1,
  "send_email": 1,
  "document_signature": {
    "cashier": "Nombre del cajero(a)",
    "seller": "Nombre del vendedor(a)"
  },
  "discrepancy_response": {
    "reference_id": "LCON4",
    "response_id": "2"
  },
  "billing_reference": {
    "number": "LCON4",
    "date": "2026-02-14",
    "uuid": "0f7d72aba9fb69ad59f817d6ae0343452dff6477436129a739f4391610634c39927fbf42b0447e83fd971f84f2dab7da"
  },
  "order_reference": {
    "reference_number": "4541212",
    "reference_date": "2025-06-01"
  },
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "224.00"
    }
  ],
  "customer": {
    "identity_document_id": "3",
    "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
    "dni": "1063279307",
    "email": "lopezsoft.com@gmail.com"
  },
  "lines": [
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100.00",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES",
      "code": "HMT83",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50",
      "base_quantity": "2",
      "um": "M",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19,
          "taxable_amount": 100,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100.00",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES 2",
      "code": "HMT84",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50",
      "base_quantity": "2",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 5,
          "taxable_amount": 100,
          "percent": 5
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "200.00",
    "tax_inclusive_amount": "224.00",
    "payable_amount": 224.0
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19,
      "taxable_amount": 100,
      "percent": 19
    },
    {
      "tax_id": "1",
      "tax_amount": 5,
      "taxable_amount": 100,
      "percent": 5
    }
  ]
}
```

## Campos Destacados

### `type_document_id: 5`

Identificador para Nota Crédito electrónica estándar. **NO existe Nota Crédito tipo 03 (contingencia)**.

### `billing_reference` 🔴 OBLIGATORIO

<div style={{backgroundColor: '#d1ecf1', padding: '1rem', borderRadius: '8px', border: '1px solid #17a2b8', margin: '1rem 0'}}>
  <strong>💡 Punto Clave:</strong> Debe referenciar el CUFE que la DIAN asignó a la factura Tipo 03 transmitida.
</div>

Campo que referencia la factura de contingencia Tipo 03 ya transmitida y validada:

```json
{
  "number": "LCON4", // Prefijo y número de la factura Tipo 03
  "date": "2026-02-14", // Fecha de la factura Tipo 03
  "uuid": "0f7d72ab..." // CUFE asignado por DIAN a la factura Tipo 03
}
```

**Campos:**

- **`number`** 🔴 OBLIGATORIO: Prefijo y número de la factura Tipo 03
- **`date`** 🔴 OBLIGATORIO: Fecha de emisión de la factura Tipo 03
- **`uuid`** 🔴 OBLIGATORIO: CUFE que la DIAN asignó a la factura Tipo 03 (NO el número del papel)

### `discrepancy_response` 🔴 OBLIGATORIO

Respuesta a la discrepancia que motiva la nota:

```json
{
  "reference_id": "LCON4", // Número de la factura referenciada
  "response_id": "2" // Código del motivo de corrección
}
```

**Códigos comunes de `response_id`:**

- `1` - Devolución parcial de bienes
- `2` - Anulación de factura electrónica
- `3` - Rebaja total aplicada
- `4` - Descuento total aplicado
- `5` - Rescisión: nulidad por falta de requisitos

### `operation_type_id: 12`

Tipo de operación para notas crédito.

## Diferencias con Nota Crédito Normal

| Característica                | Nota Crédito Normal          | Nota Crédito para Tipo 03                |
| :---------------------------- | :--------------------------- | :--------------------------------------- |
| **Tipo de Nota**              | Electrónica Estándar (5)     | Electrónica Estándar (5)                 |
| **Prerrequisito**             | Factura validada             | Factura Tipo 03 transmitida y validada   |
| **UUID en billing_reference** | CUFE de factura normal       | CUFE asignado por DIAN a factura Tipo 03 |
| **Timing**                    | Inmediato después de factura | Después de transmitir y validar Tipo 03  |

## Validaciones DIAN

- ✅ `billing_reference` es **obligatorio**
- ✅ El `uuid` debe corresponder al CUFE asignado por DIAN a la factura Tipo 03
- ✅ El `number` debe coincidir con el número de la factura Tipo 03
- ✅ La `date` debe coincidir con la fecha de la factura Tipo 03
- ✅ `discrepancy_response` es **obligatorio**
- ❌ **NO se puede generar** antes de transmitir la factura Tipo 03

## Casos de Rechazo

| Condición                         | Error                                   |
| --------------------------------- | --------------------------------------- |
| Falta `billing_reference`         | Rechazo: Campo obligatorio para notas   |
| UUID no corresponde a CUFE válido | Rechazo: CUFE inválido o no encontrado  |
| Factura Tipo 03 no transmitida    | Rechazo: Factura referenciada no existe |
| Falta `discrepancy_response`      | Rechazo: Campo obligatorio              |
| Número no coincide con factura    | Rechazo: Referencia incorrecta          |

## Ejemplo de Flujo Completo

### Paso 1: Transmitir Factura Tipo 03

```json
{
  "type_document_id": 9,
  "prefix": "LCON",
  "document_number": "4",
  "additional_document_reference": [
    {
      "number": "PAPEL-004",
      "date": "2026-02-14",
      "code": "TALONARIO"
    }
  ]
  // ... otros campos
}
```

### Paso 2: DIAN Asigna CUFE

Respuesta de la DIAN:

```json
{
  "uuid": "0f7d72aba9fb69ad59f817d6ae0343452dff6477436129a739f4391610634c39927fbf42b0447e83fd971f84f2dab7da"
}
```

### Paso 3: Generar Nota Crédito

Usar el CUFE asignado en `billing_reference.uuid` (como se muestra en el ejemplo principal arriba).

## Referencias

- Anexo Técnico de Factura Electrónica v1.9
- Resolución DIAN No. 000165 (01/NOV/2023)
- [Factura de Contingencia Tipo 03](/docs/jsons-billing/contingency-invoice-type-03)
- [Campos de Facturación - billing_reference](/docs/billing-fields#billing_reference)
