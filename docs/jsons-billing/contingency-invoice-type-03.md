---
sidebar_position: 22
---

# Factura de Contingencia Tipo 03 (Talonario o Papel)

Factura electrónica emitida como respaldo de un documento en papel o talonario previamente generado. Este tipo de factura **referencia obligatoriamente** un documento original mediante el campo `additional_document_reference`.

## Información General

- **Tipo de Documento:** 03
- **Descripción:** Factura de Contingencia (Talonario o Papel)
- **Campo Requerido:** `additional_document_reference` (obligatorio)
- **Normativa:** Resolución No. 000165 (01/NOV/2023) - DIAN
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
    "payments": [{
        "payment_method_id": 1,
        "means_payment_id": 10,
        "value_paid": "224.00"
    }],
    "order_reference": {
        "reference_number": "4541212",
        "reference_date": "2025-06-01"
    },
    "additional_document_reference": {
        "number": "LZT2119",
        "code": "01",
        "date": "2025-08-18",
        "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
        "scheme_name": "CUFE-SHA384"
    },
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
        "payable_amount": 224.00
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
Campo que referencia el documento original en papel o talonario:

```json
{
    "number": "LZT2119",           // Prefijo y número del doc original
    "code": "01",                   // Código del tipo de documento
    "date": "2025-08-18",           // Fecha de emisión
    "uuid": "0bd41b0...",           // CUFE o CUDE del doc original
    "scheme_name": "CUFE-SHA384"    // Esquema del identificador
}
```

### `order_reference`
Referencia opcional a documento adicional u orden de compra.

### `document_signature`
Firmas de autorización (cajero y vendedor) para documentos de contingencia.

## Validaciones DIAN

- ✅ `additional_document_reference` es **obligatorio**
- ✅ Debe informarse el `uuid` (CUFE o CUDE) del documento referenciado
- ✅ El `scheme_name` debe ser válido (CUFE-SHA384 o CUDE-SHA384)
- ✅ La `date` es obligatoria
- ✅ El `number` (prefijo) debe corresponder al documento original

## Casos de Rechazo

| Condición | Error |
|-----------|-------|
| Falta `additional_document_reference` | Rechazo: Campo obligatorio para tipo 03 |
| No se informa `uuid` | Rechazo: CUFE/CUDE no informado |
| `scheme_name` inválido | Rechazo: Esquema no válido |
| Falta `date` | Rechazo: Fecha no informada |
| UUID no corresponde a un CUFE válido | Rechazo: CUFE/CUDE inválido |

## Relación con Otros Documentos

- **Documento Original:** Factura emitida en papel o talonario
- **Documento Electrónico:** Esta factura tipo 03
- **Propósito:** Crear respaldo electrónico de documento en papel

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
