---
sidebar_position: 25
---

# Factura de Contingencia Tipo 03 (Talonario o Papel)

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>⚠️ IMPORTANTE: Transmisión de Factura de Papel</strong><br/>
  Factura electrónica emitida como <strong>transmisión digital</strong> de una factura física (talonario/papel) previamente entregada al cliente durante un inconveniente tecnológico. Este tipo de factura <strong>NO es una factura nueva</strong>, sino el reporte digital de una que ya existe físicamente.
</div>

**El nodo `additional_document_reference` es OBLIGATORIO y debe contener los datos de la factura de papel (número, fecha, código interno), NO un CUFE (porque el papel no lo tiene).**

## Información General

- **Tipo de Documento:** 03
- **Descripción:** Factura de Contingencia (Talonario o Papel)
- **Campo Requerido:** `additional_document_reference` ⚠️ **OBLIGATORIO PARA ESTE TIPO**
- **Normativa:** Resolución No. 000165 (01/NOV/2023) - DIAN - Página 389
- **Casos de Uso:**
  - Facturación de contingencia por fallo del sistema
  - Regularización de facturas emitidas en papel previamente
  - Documentos de talonario que requieren respaldo electrónico

## Estructura JSON

```json
{
  "resolution_number": "18764100103754",
  "prefix": "LCON",
  "notes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "document_number": "2",
  "report_header": {
    "uuid": "101413670038274164",
    "vars": [
      {
        "name": "sucursal",
        "value": "Bodega Principal Cali"
      },
      {
        "name": "direccion",
        "value": "Zona Franca Palmaseca Bodega 5"
      },
      {
        "name": "celular",
        "value": "315 112 4411"
      }
    ]
  },
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 9,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "224.00"
    }
  ],
  "order_reference": {
    "reference_number": "4541212",
    "reference_date": "2025-06-01"
  },
  "additional_document_reference": [
    {
      "number": "LZT2119",
      "code": "TALONARIO",
      "date": "2025-08-18"
    }
  ],
  "document_signature": {
    "cashier": "Nombre del cajero(a)",
    "cashier_title": "Firma Cajero(a)",
    "seller": "Nombre del vendedor(a)",
    "seller_title": "Firma del vendedor(a)"
  },
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

### `type_document_id: 9`

Identificador para factura de contingencia tipo 03 (Talonario o Papel).

### `additional_document_reference` ⚠️ OBLIGATORIO

<div style={{backgroundColor: '#f8d7da', padding: '1rem', borderRadius: '8px', border: '2px solid #dc3545', margin: '1rem 0'}}>
  <strong>🚨 CRÍTICO: NO use CUFE en este nodo</strong><br/>
  En este grupo <strong>NO debe colocar un CUFE</strong> (porque el papel no lo tiene), sino los <strong>datos de la factura de papel</strong> que tiene en la mano.
</div>

Campo que contiene los datos de la factura física (talonario/papel) previamente entregada al cliente:

```json
{
  "number": "LZT2119", // Prefijo y número de la factura de papel
  "code": "TALONARIO", // Código interno de la empresa (NO estandarizado DIAN)
  "date": "2025-08-18" // Fecha en que se generó y entregó el papel
}
```

**Campos:**

- **`number`** 🔴 OBLIGATORIO: Prefijo y número de la factura de papel que entregó al cliente
- **`date`** 🔴 OBLIGATORIO: Fecha en que generó y entregó la factura de papel (NO la fecha de transmisión)
- **`code`** 🟢 OPCIONAL: Código interno de la empresa. Ejemplos: "TALONARIO", "PAPEL", "FC", "01"

### `order_reference`

Referencia opcional a documento adicional u orden de compra.

### `document_signature`

Firmas de autorización (cajero y vendedor) para documentos de contingencia.

## Validaciones DIAN

- ✅ `additional_document_reference` es **obligatorio** para Tipo 03
- ✅ El `number` debe corresponder al número de la factura de papel
- ✅ La `date` es **obligatoria** y debe ser la fecha del papel (regla FAI05)
- ✅ El `code` es opcional (codificación propia de la empresa)
- ❌ **NO se debe incluir `uuid`** (el papel no tiene CUFE)
- ❌ **NO se debe incluir `scheme_name`** (no aplica para papel)

## Casos de Rechazo

| Condición                               | Error                                         |
| --------------------------------------- | --------------------------------------------- |
| Falta `additional_document_reference`   | Rechazo FAI01: Campo obligatorio para tipo 03 |
| Falta `number`                          | Rechazo FAI02: ID de documento no informado   |
| Falta `date`                            | Rechazo FAI05: Fecha no informada             |
| Se incluye `uuid` para factura de papel | Error: El papel no tiene CUFE                 |

## Proceso Correcto de Transmisión

1. **Expedir factura física:** Durante el inconveniente tecnológico, se expide una factura física (talonario o papel) y se entrega al cliente.

2. **Superar el inconveniente:** Una vez restablecido el servicio tecnológico.

3. **Transmitir el XML:** Dentro de las **48 horas siguientes** a la superación del inconveniente, debe transmitir el XML con:
   - `type_document_id = 9` (Tipo 03 en API)
   - Nodo `additional_document_reference` con los datos del papel (número, fecha, código)

4. **Firmar y enviar:** Firme digitalmente el XML y envíelo a la DIAN.

## Notas Crédito/Débito para Facturas Tipo 03

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1rem 0'}}>
  <strong>⚠️ IMPORTANTE: NO existe "Contingencia" para Notas</strong><br/>
  Las notas crédito y débito <strong>NO tienen esquema de contingencia (Tipo 03)</strong>.
</div>

**Proceso correcto:**

1. Transmitir la factura Tipo 03 a la DIAN
2. Obtener el CUFE asignado por la DIAN
3. Generar la Nota electrónica estándar referenciando ese CUFE en `billing_reference`

## Relación con Otros Documentos

- **Documento Original:** Factura emitida en papel o talonario durante inconveniente tecnológico
- **Documento Electrónico:** Esta factura tipo 03 (transmisión digital del papel)
- **Propósito:** Reportar digitalmente a la DIAN una venta que ya ocurrió mediante papel
- **Soporte Legal:** El papel físico hasta que se transmita; luego el XML validado

## Ejemplos de Uso

### Caso 1: Contingencia por Sistema Caído

Factura emitida en papel durante fallo del sistema. Se ingresa posteriormente como tipo 03 para regularización.

### Caso 2: Talonario Anterior

Factura de talonario emitida previo a la implementación de facturación electrónica. Se crea tipo 03 referenciando el documento original.

### Caso 3: Migración de Sistema Antiguo

Documentos legados en papel que requieren respaldo electrónico mediante factura tipo 03.

## Campos Opcionales

- `notes`: Notas generales del documento
- `order_reference`: Referencia a orden de compra
- `graphic_representation`: Representación gráfica
- `send_email`: Envío automático por correo

## Referencias

- Resolución DIAN No. 000165 (01/NOV/2023)
- Anexo Técnico de Facturación Electrónica v2.1
- Catálogos DIAN (type_document_id, identity_document_id, etc.)
