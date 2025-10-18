---
sidebar_position: 28
---

# Factura Mandatos

Factura que incluye información de mandatarios en los ítems. Los mandatos aplican cuando se venden productos o servicios en nombre de terceros.

## JSON de Ejemplo

```json
{
    "resolution_number": "18764074347312",
    "prefix": "LZT",
    "notes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "document_number": "2123",
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
    "operation_type_id": 3,
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
            "mandate": {
                "dni": "2222222222",
                "dv": "2",
                "code": "1"
            },
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
            "mandate": {
                "dni": "2222222222",
                "dv": "2",
                "code": "0"
            },
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

- **Mandatos**: Los mandatos se informan a nivel de ítem en el campo `mandate`
- **Obligatorio**: Este campo es obligatorio solo para facturas de mandato
- **Códigos de Mandato**: 
  - `0`: B/S ingreso propio
  - `1`: B/S Ingresos Recibidos para Terceros
- **Información del Mandatario**: Incluye `dni`, `dv` (dígito de verificación) y `code` (tipo de ingreso)

Para más detalles, consulte la sección [Campos de todos los documentos electrónicos](/docs/billing-fields#lines-mandate) en la documentación.
