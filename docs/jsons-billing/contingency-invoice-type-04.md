---
sidebar_position: 23
---

# Factura de Contingencia Tipo 04 (Manual)

Factura electrónica emitida como respaldo de un documento generado manualmente o mediante proceso manual. Similar a la tipo 03, pero sin la obligatoriedad de `additional_document_reference`.

## Información General

- **Tipo de Documento:** 04
- **Descripción:** Factura de Contingencia (Manual)
- **Campo Requerido:** `additional_document_reference` ⚠️ **OPCIONAL para este tipo** (Obligatorio SOLO para tipo 03)
- **Normativa:** Resolución No. 000165 (01/NOV/2023) - DIAN - Página 389
- **Casos de Uso:**
  - Facturación manual de documentos no sistematizados
  - Respaldo de facturas generadas mediante procesos alternativos
  - Documentos creados manualmente que requieren respaldo electrónico

## Estructura JSON

```json
{
    "resolution_number": "18764100103754",
    "prefix": "LCON",
    "notes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "document_number": "3",
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
    "type_document_id": 10,
    "payments": [{
        "payment_method_id": 1,
        "means_payment_id": 10,
        "value_paid": "224.00"
    }],
    "order_reference": {
        "reference_number": "4541212",
        "reference_date": "2025-06-01"
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

### `type_document_id: 10`
Identificador para factura de contingencia tipo 04 (Manual).

### `document_signature` ⚠️ IMPORTANTE
Para facturas manuales, es especialmente importante incluir las firmas de autorización:

```json
{
    "cashier": "Nombre del cajero(a)",
    "cashier_title": "Firma Cajero(a)",
    "seller": "Nombre del vendedor(a)",
    "seller_title": "Firma del vendedor(a)"
}
```

### `order_reference`
Referencia a documento generador (orden de compra, solicitud, etc.).

### `additional_document_reference` (Opcional)
A diferencia de tipo 03, este campo es **opcional** para tipo 04. Si se incluye, debe seguir la misma estructura.

## Validaciones DIAN

- ✅ `type_document_id` debe ser **10**
- ✅ `document_signature` es recomendado
- ✅ Debe informarse claramente el origen manual del documento
- ✅ `order_reference` ayuda a trazabilidad

## Diferencias con Tipo 03

| Aspecto | Tipo 03 | Tipo 04 |
|--------|--------|--------|
| Descripción | Talonario/Papel | Manual |
| `additional_document_reference` | Obligatorio | Opcional |
| `document_signature` | Recomendado | Muy Recomendado |
| Caso de Uso | Papel/Talonario previo | Procesos manuales |
| `type_document_id` | 9 | 10 |

## Casos de Rechazo

| Condición | Error |
|-----------|-------|
| `type_document_id` incorrecto | Rechazo: Tipo de documento inválido |
| Falta información crítica | Rechazo: Campo obligatorio |
| Datos inconsistentes | Rechazo: Validación de datos |

## Casos de Uso

### Caso 1: Facturación Manual en Punto de Venta
Documentos generados manualmente en punto de venta que requieren regularización electrónica.

### Caso 2: Proceso Alterno
Facturas creadas mediante proceso alterno o excepcional que requieren respaldo electrónico.

### Caso 3: Documentos Sin Sistematizar
Documentos históricos que no fueron sistematizados y requieren respaldo electrónico.

## Campos Recomendados

- `notes`: Explicar contexto manual/excepcional
- `order_reference`: Vincular a documento generador
- `document_signature`: Firmas de autorización
- `report_header`: Información de sucursal/ubicación

## Campos Opcionales

- `graphic_representation`: Representación gráfica
- `send_email`: Envío automático por correo
- `additional_document_reference`: Referencia a documento generador

## Referencias

- Resolución DIAN No. 000165 (01/NOV/2023)
- Anexo Técnico de Facturación Electrónica v2.1
- Catálogos DIAN (type_document_id, identity_document_id, etc.)

## Trazabilidad y Auditoría

Para facturas tipo 04, se recomienda:
1. Mantener registro de autorización (firmas)
2. Documentar razón de generación manual
3. Incluir referencias cruzadas con documentos generadores
4. Guardar evidencia de excepcionalidad del proceso
