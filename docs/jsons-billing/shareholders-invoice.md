---
sidebar_position: 33
---

# Factura Consorciados

Factura que incluye información de consorciados o partícipes (`shareholders`) cuando el emisor opera bajo la figura de **Consorcio o Unión Temporal**. Genera el grupo `cac:ShareholderParty` dentro del bloque del emisor sin modificar el adquiriente (`customer`), y se conserva automáticamente en los reenvíos (`POST /documents/{uuid}/resend`).

## JSON de Ejemplo

```json title="shareholders-invoice.json"
{
    "resolution_number": "18764112492320",
    "prefix": "LZT",
    "notes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "document_number": "6024",
    "report_header": {
        "uuid": "101413670038274164",
        "vars": [
            {
                "filename": "sucursal",
                "value": "Bodega Principal Cali"
            },
            {
                "filename": "direccion",
                "value": "Zona Franca Palmaseca Bodega 5"
            },
            {
                "filename": "celular",
                "value": "315 112 4411"
            }
        ]
    },
    "graphic_representation": 0,
    "send_email": 1,
    "operation_type_id": 1,
    "type_document_id": 7,
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
    "shareholders": [
        {
            "dni": "1063279307",
            "company_name": "LEWIS LOPEZ A S.A.S.",
            "tax_level_id": 5,
            "tax_regime_id": 2,
            "participation_percent": 60
        },
        {
            "dni": "900123456",
            "company_name": "INGENIERIA Y PROYECTOS S.A.S.",
            "tax_level_id": 5,
            "tax_regime_id": 1,
            "participation_percent": 40
        }
    ],
    "lines": [
        {
            "invoiced_quantity": "2",
            "quantity_units_id": "1093",
            "line_extension_amount": "101.00",
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
            "line_extension_amount": "101.00",
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

## Notas Importantes

- **Ubicación en el XML (`cac:ShareholderParty`)**: Se incluye en el bloque del emisor (`AccountingSupplierParty / Party`), sin tocar la información del adquiriente (`customer`).
- **Validaciones (`HTTP 422`)**:
  - **Dígito de verificación (`dv`)**: Si se incluye `dv`, debe ser válido para el `dni` según el cálculo módulo 11 de la DIAN.
  - **Sin NITs repetidos**: No se permiten dos consorciados con el mismo `dni` en el arreglo `shareholders`.
  - **Suma de porcentajes = 100**: La suma de `participation_percent` de todos los elementos del arreglo debe ser exactamente `100` (por ejemplo, `60` + `40` = `100`, o `100` si se informa un único consorciado).
- **Reenvíos**: La relación de consorciados se conserva cuando se reenvía el documento mediante `POST /documents/{uuid}/resend`.

Para más detalles, consulte la sección [Campos de todos los documentos electrónicos — `shareholders`](/docs/billing-fields#shareholders) en la documentación.
