---
sidebar_position: 4
---

# Campos de todos los documentos electrónicos.

En esta sección se describen los campos que se deben de considerar para la generación de la factura electrónica,
nota de crédito y nota de débito, documento soporte y documento equivalente, con sus respectivas notas de ajuste.

## 📑 Tabla de Contenidos

- [Ejemplo Completo de Factura](#ejemplo-completo)
- [Descripción de los campos](#descripción-de-los-campos)
- [Referencia Rápida de Tipos de Documento](#referencia-rápida-de-tipos-de-documento)
- [Compatibilidad de Campos por Tipo](#compatibilidad-de-campos-por-tipo)
- [Uso de los campos](#uso-de-los-campos)
- [Additional Document Reference](#additional_document_reference-referencia-a-documento-adicional)
- [Ejemplo Mínimo Requerido](#ejemplo-mínimo-requerido)

---

```json
{
  "resolution_number": "18760000001",
  "prefix": "FEV",
  "date": "2021-09-12",
  "expiration_date": "2021-09-12",
  "time": "2021-09-12 22:46:53",
  "notes": "Nota del documento",
  "document_number": 990000001,
  "operation_type_id": 1,
  "type_document_id": 7,
  "graphic_representation": 1,
  "send_email": 1,
  "currency_id": 272,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "141100.00",
      "payment_due_date": "2024-02-22"
    }
  ],
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
  "payment_exchange_rate": {
    "exchange_rate": "3950.00",
    "rate_date": "2022-06-28",
    "base_rate": "3950.00",
    "currency_id": 188
  },
  "point_of_sale": {
    "cashier_name": "LEWIS LOPEZ",
    "terminal_number": "CJ001aB",
    "cashier_type": "Caja de apoyo",
    "sales_code": "POS01",
    "address": "Gilbarco Encore 4 L1 Mangue ra 17 AC",
    "sub_total": "2000.10"
  },
  "software_manufacturer": {
    "owner_name": "LEWIS LOPEZ GOMEZ",
    "company_name": "LOPEZSOFT SAS",
    "software_name": "SOFTWARE POS MATIAS APP"
  },
  "document_signature": {
    "cashier": "Nombre del cajero(a)",
    "seller": "Nombre del vendedor(a)"
  },
  "order_reference": {
    "reference_number": "4545478787",
    "reference_date": "2021-05-19"
  },
  "health": {
    "operation_type": "SS-CUFE",
    "invoice_period": {
      "start_date": "9999-12-31",
      "start_time": "23:59:59",
      "end_date": "9999-12-31",
      "end_time": "23:59:59"
    },
    "download_attachments": {
      "url": "www.ips-1.com.co",
      "arguments": [
        {
          "name": "excelFile",
          "value": "a1b2c3.xlsx"
        },
        {
          "name": "txtFile",
          "value": "a1b2c3.txt"
        }
      ]
    },
    "document_delivery": {
      "ws": "https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl",
      "arguments": [
        {
          "name": "Método-1",
          "value": "ClienteEntregaAcuseDeReciboDeFEV-VP"
        },
        {
          "name": "Método-2",
          "value": "ClienteEntregaConstanciaDeMercanciaEntregada"
        }
      ]
    },
    "user_collections": [
      {
        "information": [
          {
            "name": "CODIGO_PRESTADOR",
            "value": "codigo_prestador_de_servicios"
          },
          {
            "name": "TIPO_DOCUMENTO_IDENTIFICACION",
            "value": "Cédula de ciudadanía",
            "schemeName": "salud_identificacion.gc",
            "schemeID": "CC"
          },
          {
            "name": "NUMERO_DOCUMENTO_IDENTIFICACION",
            "value": "1234567891"
          },
          {
            "name": "PRIMER_APELLIDO",
            "value": "Primer_Apellido_del_usuario"
          },
          {
            "name": "SEGUNDO_APELLIDO",
            "value": "Segundo_Apellido_del_usuario"
          },
          {
            "name": "PRIMER_NOMBRE",
            "value": "Primer_Nombre_del_usuario"
          },
          {
            "name": "SEGUNDO_NOMBRE",
            "value": "Segundo_Nombre_del_usuario"
          },
          {
            "name": "TIPO_USUARIO",
            "value": "Contributivo cotizante",
            "schemeName": "salud_tipo_usuario.gc",
            "schemeID": "01"
          },
          {
            "name": "MODALIDAD_CONTRATACION",
            "value": "Grupos Relacionados por Diagnóstico",
            "schemeName": "salud_modalidad_pago.gc",
            "schemeID": "02"
          },
          {
            "name": "OBERTURA_PLAN_BENEFICIOS",
            "value": "Cobertura Póliza SOAT",
            "schemeName": "salud_cobertura.gc",
            "schemeID": "04"
          },
          {
            "name": "NUMERO_AUTORIZACION",
            "value": "A1234;604567;AX-2345"
          },
          {
            "name": "NUMERO_MIPRES",
            "value": "1 A1234;604567;AX-234534566"
          },
          {
            "name": "NUMERO_ENTREGA_MIPRES",
            "value": "2 A1234;604567;AX-234534566"
          },
          {
            "name": "NUMERO_CONTRATO",
            "value": "XPTO3"
          },
          {
            "name": "NUMERO_POLIZA",
            "value": "NUMERO de POLIZA"
          },
          {
            "name": "COPAGO",
            "value": "1000000"
          },
          {
            "name": "CUOTA_MODERADORA",
            "value": "2000000"
          },
          {
            "name": "CUOTA_RECUPERACION",
            "value": "3000000"
          },
          {
            "name": "PAGOS_COMPARTIDOS",
            "value": "4000000"
          }
        ]
      }
    ]
  },
  "customer": {
    "country_id": "45",
    "city_id": "836",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "NOMBRE DEL CLIENTE",
    "dni": "1234564",
    "mobile": "1234156465",
    "email": "correo@corre.com",
    "address": "dirección",
    "postal_code": "000000",
    "points": 0
  },
  "discrepancy_response": {
    "reference_id": "EPOS2",
    "response_id": "9"
  },
  "billing_reference": {
    "number": "EPOS2",
    "date": "2023-12-22",
    "uuid": "b1b5d93a2918407a2ef0048ed3092e5d96c94f73db178779463f202f8c52dd53ef5b9888d804d4b609521b1d031aea39"
  },
  "allowance_charges": [
    {
      "amount": "10000",
      "base_amount": "725000",
      "charge_indicator": true,
      "allowance_charge_reason": "Motivo del cargo a la factura"
    },
    {
      "amount": "10000",
      "base_amount": "725000",
      "charge_indicator": false,
      "discount_id": 8,
      "allowance_charge_reason": "Motivo del descuento a la factura"
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "131600.00",
    "tax_exclusive_amount": "50000",
    "tax_inclusive_amount": "141100.00",
    "total_charges": 0,
    "total_allowance": 0,
    "payable_amount": "141100.00"
  },
  "prepaid_payments": {
    "id": "SFR3123856",
    "paid_amount": "10.00",
    "received_date": "2018-09-29",
    "paid_date": "2018-09-29",
    "instruction_id": "Prepago recibido"
  },
  "lines": [
    {
      "invoiced_quantity": "3",
      "quantity_units_id": "1093",
      "line_extension_amount": "81600",
      "free_of_charge_indicator": false,
      "description": "Hunters Mini Tumaco 82%",
      "note": "Información adicional del producto, es opcional cuando no es AUI",
      "code": "HMT82",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "27200",
      "base_quantity": "3",
      "extra_data": [
        {
          "title": "LOTE",
          "value": "45413",
          "align": "left"
        },
        {
          "title": "FECHA DE EXPIRACIÓN",
          "value": "02/02/2026",
          "align": "center"
        }
      ],
      "invoice_period": {
        "start_date": "2022-08-30",
        "description_code": 1
      },
      "allowance_charges": [
        {
          "amount": "10000",
          "base_amount": "725000",
          "charge_indicator": true,
          "allowance_charge_reason": "Motivo del cargo a la linea"
        },
        {
          "amount": "10000",
          "base_amount": "725000",
          "charge_indicator": false,
          "discount_id": 8,
          "allowance_charge_reason": "Motivo del descuento a la linea"
        }
      ]
    },
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "50000",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES",
      "code": "HMT83",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "59500",
      "base_quantity": "1",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 9500,
          "taxable_amount": 50000,
          "percent": 19
        }
      ]
    }
  ],
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 9500,
      "taxable_amount": 50000,
      "percent": 19
    }
  ]
}
```

## Referencia Rápida de Tipos de Documento

| Código | Tipo | Descripción | Normativa | Notas |
|--------|------|-------------|-----------|-------|
| 1 | Factura de Venta | Documento estándar de venta | Res. 165 | Uso general |
| 2 | Factura de Exportación | Factura para operaciones con exterior | Res. 165 | Regulación especial |
| 3 | Factura de Contingencia Tipo 03 | Emitida cuando falla conexión DIAN | Res. 165 | ⚠️ Requiere `additional_document_reference` |
| 4 | Factura de Contingencia Tipo 04 | Protocolo alternativo especial | Res. 165 | Opcional `additional_document_reference` |
| 7 | Documento Soporte | Para servicios y operaciones especiales | Res. 165 | Uso específico |
| 9 | Documento Equivalente POS | Factura de Punto de Venta | Res. 165 | Requiere datos POS |
| 91 | Nota Crédito | Devolución o descuento | Res. 165 | Genera CUDE |
| 92 | Nota Débito | Ajuste por aumento | Res. 165 | Genera CUDE |

---

## Compatibilidad de Campos por Tipo

| Campo | Factura (1,2) | Contingencia (3,4) | Documento Soporte (7) | POS (9) | Nota Crédito (91) | Nota Débito (92) |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| `resolution_number` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `prefix` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `date` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| `document_number` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `operation_type_id` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `type_document_id` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `payments` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `customer` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `legal_monetary_totals` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `lines` | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| `additional_document_reference` | 🟢 | 🔴 | 🟢 | 🟢 | 🟢 | 🟢 |
| `point_of_sale` | 🟢 | 🟢 | 🟢 | 🔴 | 🟢 | 🟢 |
| `billing_reference` | 🟢 | 🟢 | 🟢 | 🟢 | 🔴 | 🔴 |
| `order_reference` | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |

**Leyenda:**
- 🔴 **Obligatorio**
- 🟢 **Opcional**
- 🟡 **Condicional**

---

## Descripción de los campos

A continuación se describen los campos que se deben de considerar para la generación de la factura electrónica.

```
{
	"resolution_number": str,  # Número de resolución del documento
  "prefix": str,  # Prefijo del documento
	"date": str,  # Fecha de emisión del documento
	"expiration_date": str,  # Fecha de expiración del documento
	"time": str,  # Hora de emisión del documento
	"notes": str,  # Notas adicionales del documento
	"document_number": int,  # Número del documento
	"operation_type_id": int,  # ID del tipo de operación
	"type_document_id": int,  # ID del tipo de documento
	"graphic_representation": int,  # Indicador de representación gráfica
	"send_email": int,  # Indicador de envío de email
	"currency_id": int,  # ID de la moneda utilizada
	"payments": [  # Lista de pagos
	  {
		"payment_method_id": int,  # ID del método de pago
		"means_payment_id": int,  # ID del medio de pago
		"value_paid": str,  # Valor pagado
		"payment_due_date": str,  # Fecha de vencimiento del pago
	  }
	],
	"payment_exchange_rate": {  # Tasa de cambio para el pago
	  "exchange_rate": str,  # Valor de la tasa de cambio
	  "rate_date": str,  # Fecha de la tasa de cambio
      "base_rate": str,  # Tasa base
      "currency_id": int,  # ID de la moneda
	},
	"point_of_sale": {  # Información del punto de venta
	  "cashier_name": str,  # Nombre del cajero
	  "terminal_number": str,  # Número de terminal
	  "cashier_type": str,  # Tipo de cajero
	  "sales_code": str,  # Código de ventas
	  "address": str,  # Dirección
	  "sub_total": str,  # Subtotal
	},
	"software_manufacturer": {  # Información del fabricante del software
	  "owner_name": str,  # Nombre del propietario
	  "company_name": str,  # Nombre de la compañía
	  "software_name": str,  # Nombre del software
	},
	"order_reference": {  # Referencia de la orden
	  "reference_number": str,  # Número de referencia
	  "reference_date": str,  # Fecha de referencia
	},
  "health": {  # Información del sector salud
      "operation_type": str,  # Tipo de operación
      "invoice_period": {  # Periodo de facturación
        "start_date": str,  # Fecha de inicio
        "start_time": str,  # Hora de inicio
        "end_date": str,  # Fecha de fin
        "end_time": str,  # Hora de fin
      },
      "download_attachments": {  # Descargar archivos adjuntos
        "url": str,  # URL
        "arguments": [  # Argumentos
          {
            "name": str,  # Nombre
            "value": str,  # Valor
          }
        ]
      },
      "document_delivery": {  # Entrega de documentos
        "ws": str,  # URL del servicio web
        "arguments": [  # Argumentos
          {
            "name": str,  # Nombre
            "value": str,  # Valor
          }
        ]
      },
      "user_collections": [  # Colecciones de usuario
        {
          "information": [  # Información
            {
              "name": str,  # Nombre
              "value": str,  # Valor
              "schemeName": str,  # Nombre del esquema
              "schemeID": str,  # ID del esquema
            }
          ]
        }
      ]
    },
	"customer": {  # Información del cliente
	  "country_id": str,  # ID del país
	  "city_id": str,  # ID de la ciudad
	  "identity_document_id": str,  # ID del documento de identidad
	  "type_organization_id": int,  # ID del tipo de organización
	  "tax_regime_id": int,  # ID del régimen tributario
	  "tax_level_id": int,  # ID del nivel tributario
	  "company_name": str,  # Nombre de la compañía
	  "dni": str,  # DNI del cliente
	  "mobile": str,  # Móvil del cliente
	  "email": str,  # Email del cliente
	  "address": str,  # Dirección del cliente
	  "postal_code": str,  # Código postal del cliente,
	  "points": int,  # Puntos del cliente
	},
	"discrepancy_response": {  # Respuesta a discrepancias
	  "reference_id": str,  # ID de referencia
	  "response_id": str,  # ID de respuesta
	},
	"billing_reference": {  # Referencia de facturación
	  "number": str,  # Número
	  "date": str,  # Fecha
	  "uuid": str,  # UUID
	},
	"allowance_charges": [  # Cargos y descuentos
	  {
		"amount": str,  # Monto
		"base_amount": str,  # Monto base
		"charge_indicator": bool,  # Indicador de cargo
		"allowance_charge_reason": str,  # Motivo del cargo o descuento
		"discount_id": int,  # ID del descuento (opcional)
	  }
	],
	"legal_monetary_totals": {  # Totales monetarios legales
	  "line_extension_amount": str,  # Monto de extensión de línea
	  "tax_exclusive_amount": str,  # Monto exclusivo de impuestos
	  "tax_inclusive_amount": str,  # Monto incluyente de impuestos
	  "total_charges": int,  # Total de cargos
	  "total_allowance": int,  # Total de descuentos
	  "payable_amount": str,  # Monto pagable
	},
    "prepaid_payments": {  # Anticipos
      "id": str,  # ID
      "paid_amount": str,  # Monto pagado
      "received_date": str,  # Fecha de recibido
      "paid_date": str,  # Fecha de pago
      "instruction_id": str,  # ID de instrucción
    },
	"lines": [  # Líneas de detalle
	  {
		"invoiced_quantity": str,  # Cantidad facturada
		"quantity_units_id": str,  # ID de unidad de medida
		"line_extension_amount": str,  # Monto de extensión de línea
		"free_of_charge_indicator": bool,  # Indicador de gratuidad
		"description": str,  # Descripción
		"note": str,  # Nota
		"code": str,  # Código
		"type_item_identifications_id": str,  # ID de tipo de identificación del ítem
		"reference_price_id": str,  # ID de precio de referencia
		"price_amount": str,  # Monto del precio
		"base_quantity": str,  # Cantidad base
    "invoice_period": {  # Periodo de facturación de la línea del documento soporte
      "start_date": str,  # Fecha de inicio
      "description_code": int,  # Código de descripción
    },
		"allowance_charges": [  # Cargos y descuentos en la línea
		  {
			"amount": str,  # Monto
			"base_amount": str,  # Monto base
			"charge_indicator": bool,  # Indicador de cargo
			"allowance_charge_reason": str,  # Motivo del cargo o descuento
			"discount_id": int,  # ID del descuento (opcional)
		  }
		],
		"tax_totals": [  # Totales de impuestos
		  {
			"tax_id": str,  # ID del impuesto
			"tax_amount": int,  # Monto del impuesto
			"taxable_amount": int,  # Monto imponible
			"percent": int,  # Porcentaje
		  }
		],
	  }
	],
	"tax_totals": [  # Totales de impuestos
	  {
		"tax_id": str,  # ID del impuesto
		"tax_amount": int,  # Monto del impuesto
		"taxable_amount": int,  # Monto imponible
		"percent": int,  # Porcentaje
	  }
	]
  }
```

## Uso de los campos

A continuación se describe el uso de los campos de la factura electrónica, nota de crédito y nota de débito,
documento soporte y documento equivalente, con sus respectivas notas de ajuste.

### `resolution_number` 🔴

Número de resolución del documento, este valor debe ser el mismo que se configura en el portal web. *Este campo es obligatorio* para todos los documentos.

### `prefix` 🟡

Prefijo de la resolución del documento. *Este campo es obligatorio* cuando se tiene más de una resolución y debe ser un string.

### `date` 🟢

Fecha de emisión del documento. *Este campo es opcional* y en caso de enviarlo debe ser un string en formato **`YYYY-MM-DD`**. Si no envía este campo, la API tomará la fecha actual.

### `expiration_date` 🟢

Fecha de vencimiento del documento equivalente electrónico debe estar asociada con las fechas negociadas o acordadas según los registros de los campos **cac:PaymentTerms/cbc:PaymentDueDate**.

### `time` 🟢

Hora de emisión del documento. *Este campo es opcional* y en caso de enviarlo y debe ser un string en formato **`H:i:s`**. Si no envía este campo, la API tomará la hora actual

### `notes` 🟢

Si desea enviar información adicional sobre el documento, puede enviar este campo, el cual es opcional para algunos documentos y debe ser un string.

### `document_number` 🔴

Número consecutivo del documento, sin prefijos. *Este campo es obligatorio* para todos los documentos y debe ser un entero encerrado entre `""` sin prefijos.

### `operation_type_id` 🔴

Se refiere al tipo de operación que afecta al documento, en la mayoría de los documentos es 1 (Estándar). *Este campo es obligatorio* para todos los documentos y debe ser un entero.

- #### Ejemplo

  ```json
    "operation_type_id": 1
  ```

### `type_document_id` 🔴

Se refiere al tipo de documento que se está enviando a la DIAN. *Este campo es obligatorio* para todos los documentos y debe ser un entero.

**Valores permitidos:**
- `1` - Factura de Venta
- `2` - Factura de Exportación
- `3` - Factura de Contingencia Tipo 03 (requiere [`additional_document_reference`](#additional_document_reference-referencia-a-documento-adicional))
- `4` - Factura de Contingencia Tipo 04
- `7` - Documento Soporte
- `9` - Documento Equivalente POS (requiere [`point_of_sale`](#point_of_sale))
- `91` - Nota Crédito
- `92` - Nota Débito

**Consultar también:** [Referencia Rápida de Tipos de Documento](#referencia-rápida-de-tipos-de-documento) | [Glosario: Contingencia](/docs/glossary#contingencia)

### `graphic_representation` 🟢

Indicador de representación gráfica. *Este campo es opcional*, se debe enviar cuando se espera que la API genere el PDF de la representación gráfica.

- #### Ejemplo

  ```json
    "graphic_representation": 1
  ```

### `send_email` 🟢

Indicador de envío de email. *Este campo es opcional*, se debe enviar cuando se espera que la API envíe el email al cliente del documento.

- #### Ejemplo

```json
"send_email": 1
```

### `currency_id` 🟢

Hace referencia a la moneda del documento. Este campo es opcional, solo se debe enviar cuando es una moneda extranjera y debe ser un entero.

**Valores comunes:**
- `170` - Peso Colombiano (COP) - Predeterminado
- `188` - Dólar Estadounidense (USD)
- `978` - Euro (EUR)

### `payments` 🔴

Lista de pagos. *Este campo es obligatorio* para todos los documentos y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "141100.00",
      "payment_due_date": "2024-02-22"
    }
  ]
```
- ### Detalle de los campos
  - #### `payment_method_id`
    Método de pago, **`1`** cuado es de contado y **`2`** cuando es a crédito. *Este campo es obligatorio* para todos los documentos y debe ser un entero.
  - #### `means_payment_id`
    Medio de pago. Este campo es utiliza para indicar un medio de pago y es obligatorio para todos los documentos y debe ser un entero.
    Puede consultar los diferentes medios de pago en el **ENDPOINT** `{{url}}/payment-means`.
  - #### `value_paid`
    Valor pagado. *Este campo es obligatorio* para todos los documentos y debe ser un número flotante con máximo dos decimales, encerrado entre `""`.
  - #### `payment_due_date`
    Fecha de vencimiento del pago. Este campo es usado para indicar la fecha de vencimiento de un pago a **crédito**.
    **Es obligatorio solo para las ventas a crédito** y debe ser un string en formato `YYYY-MM-DD`.

### `report_header`: **NEW**
Este objeto es una parte fundamental del cuerpo de la solicitud (request body). 
Contiene toda la información necesaria para que la API pueda renderizar dinámicamente el encabezado y/o 
pie de página del documento utilizando una plantilla de diseño predefinida.

#### Descripción General
La lógica se basa en un sistema de plantillas. Se proporciona 
el identificador de una plantilla **(``uuid``)** y un conjunto de variables **(``vars``)**. 
La API utilizará estos datos para buscar la plantilla correspondiente y reemplazar los
"marcadores de posición" (placeholders) en ella con los valores proporcionados.
#### Estructura de Campos - Tabla de Parámetros
| Campo | Tipo             | Requerido | Descripción                                                                                                                                              |
|-------|------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| uuid  | String           | Sí        | El Identificador Único Universal de la plantilla de diseño a utilizar. Este ``uuid`` debe corresponder a una plantilla previamente creada en el sistema. |
| vars  | Array de Objetos | Sí        | Una lista que contiene todas las variables y sus valores para reemplazar los marcadores de posición en la plantilla.                                     |
#### Estructura de los objetos dentro del array ``vars``
Cada objeto dentro del array vars debe tener la siguiente estructura de clave-valor:
| Campo | Tipo   | Requerido | Descripción                                                                                                                                                                                                        |
|-------|--------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name  | String | Sí        | El nombre del marcador de posición definido en la plantilla. Importante: Debe enviarse sin las llaves {}. Por ejemplo, si en la plantilla el marcador es ``{sucursal}``, el valor de name debe ser ``"sucursal"``. |
| value | String | Sí        | El valor de texto o HTML con el que se reemplazará el marcador correspondiente. La API insertará este valor tal cual en la plantilla                                                                               |
#### Ejemplo Completo del Objeto
A continuación se muestra un ejemplo válido del objeto ``report_header`` que se debe incluir en el cuerpo de la solicitud a la API.
```json
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
}
```
### `due_diligence`: **NEW**
- Información para control cambiario
- **Control Cambiario - Debida Diligencia**. Los tipos de operación que se encuentran permitidos son los que se encuentran en la columna “Código” que están dentro de
la tabla 18.3 Control Cambiario - Debida Diligencia, ubicada en la Caja de Herramientas en la siguiente ruta
“Caja_de_herramientas_Factura_Electronica_Validacion_Previa.zip\Anexo Tecnico\Tablas Referenciadas”, en formato Excel “.xlsx”
- #### Ejemplo

```json
"due_diligence": {
  "code": "01"
}
```
- #### Tabla debida diligencia - Control cambiario
| Código | Descripción |
|--------|-------------|
| 01     | Debida Diligencia del Cliente – DDC General |
| 02     | Debida Diligencia del Cliente – DDC Reforzada |
| 03     | Debida diligencia intensificada por razón de la cuantía de las operaciones – DDC intensificada. |
| 04     | Debida Diligencia del Cliente – DDC simplificada |


### `document_signature`: **NEW**
Información de la firma del documento. *Este campo es opcional* y debe ser un objeto.
- #### Ejemplo

```json
"document_signature": {
    "cashier": "Nombre del cajero(a)",
    "seller": "Nombre del vendedor(a)"
  }
```
- #### Detalle de los campos
  - #### `cashier`
    Nombre del cajero(a). *Este campo es opcional* y debe ser un string.
  - #### `seller`
    Nombre del vendedor(a). *Este campo es opcional* y debe ser un string.

### `payment_exchange_rate` 🟡

Tasa de cambio para el pago. *Este campo es obligatorio* solo para los documentos en moneda extranjera y debe ser un objeto.

- #### Ejemplo

```json
"payment_exchange_rate": {
    "exchange_rate": "3950.00",
    "rate_date": "2022-06-28",
    "base_rate" : "3950.00",
    "currency_id": 188
  }
```
- #### Detalle de los campos
  - #### `exchange_rate`
    Valor de la tasa de cambio. *Este campo es obligatorio* solo para los documentos en moneda extranjera y debe ser un string.
  - #### `rate_date`
    Fecha de la tasa de cambio. *Este campo es obligatorio* solo para los documentos en moneda extranjera y debe ser un string.
  - #### `base_rate`
    Tasa base. *Este campo es obligatorio* solo para los documentos en moneda extranjera y debe ser un string.
    Base monetaria de la divisa COP que se deberá convertir a moneda extranjera, ejemplo: si es USD el valor a informar es el valor equivalente de un dólar en pesos.

### `point_of_sale` 🟡

Información del punto de venta. *Este campo es obligatorio* solo para los documentos de tipo **P.O.S ELECTRÓNICO** (`type_document_id = 9`) y debe ser un objeto.

- #### Ejemplo

```json
"point_of_sale": {
    "cashier_name": "LEWIS LOPEZ",
    "terminal_number": "CJ001aB",
    "cashier_type": "Caja de apoyo",
    "sales_code": "POS01",
    "address": "Gilbarco Encore 4 L1 Mangue ra 17 AC",
    "sub_total": "2000.10"
  }
```
- #### Detalle de los campos
  - #### `cashier_name`
    Nombre del cajero. *Este campo es obligatorio* solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `terminal_number`
    Número de términal del punto de venta. *Este campo es obligatorio* solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `cashier_type`
    Tipo de caja del punto de venta, ejemplo(`GENÉRICA`). *Este campo es obligatorio* solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `sales_code`
    Código de la venta, puede ser ID de la venta ejemplo(`45212`). *Este campo es obligatorio* solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `address`
    Dirección del punto de venta. *Este campo es obligatorio* solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `sub_total`
    Subtotal de la venta, total venta sin IVA. *Este campo es obligatorio* solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.

### `software_manufacturer` 🟡

Información del fabricante del software. *Este campo es obligatorio* solo para los documentos equivalentes P.O.S (`type_document_id = 9`) y debe ser un objeto.

- #### Ejemplo

```json
{
  "owner_name": "LEWIS LOPEZ GOMEZ",
  "company_name": "LOPEZSOFT SAS",
  "software_name": "SOFTWARE POS MATIAS APP"
}
```
- #### Detalle de los campos
  - #### `owner_name`
    Nombre del propietario. *Este campo es obligatorio* solo para los documentos equivalentes P.O.S y debe ser un string.
  - #### `company_name`
    Nombre de la compañía. *Este campo es obligatorio* solo para los documentos equivalentes P.O.S y debe ser un string.
  - #### `software_name`
    Nombre del software. *Este campo es obligatorio* solo para los documentos equivalentes P.O.S y debe ser un string.

### `order_reference` 🟢

Referencia de la orden de compra. *Este campo es opcional* y debe ser usado de acuerdo al giro del documento. Debe ser un objeto.

**Diferencia con `additional_document_reference`:**
- Use `order_reference` para **UNA SOLA** orden de compra
- Use [`additional_document_reference`](#additional_document_reference-referencia-a-documento-adicional) para **MÚLTIPLES** documentos de referencia

- #### Ejemplo

```json
"order_reference": {
    "reference_number": "4545478787",
    "reference_date": "2021-05-19"
  }
```
- #### Detalle de los campos
  - #### `reference_number`
    Número de referencia. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
  - #### `reference_date`
    Fecha de referencia. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.

### `health` 🟢

Información del sector salud. *Este campo es opcional* y debe ser usado de acuerdo al giro del documento. Debe ser un objeto.

- #### `operation_type`
  Tipo de operación. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- #### `invoice_period`
  Periodo de facturación. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un objeto.
  - - ##### `start_date`
      Fecha de inicio. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `start_time`
      Hora de inicio. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `end_date`
      Fecha de fin. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `end_time`
      Hora de fin. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- #### `download_attachments`
  Descargar archivos adjuntos. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un objeto.
  - - ##### `url`
      URL. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `arguments`
      Argumentos. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un arreglo de objetos.
- - ###### `name`
    Nombre. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `value`
    Valor. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- #### `document_delivery`
  Entrega de documentos. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un objeto.
  - - ##### `ws`
      URL del servicio web. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `arguments`
      Argumentos. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un arreglo de objetos.
- - ###### `name`
    Nombre. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `value`
    Valor. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- #### `user_collections`
  Colecciones de usuario. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un arreglo de objetos.
  - - ##### `information`
      Información. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un arreglo de objetos.
- - ###### `name`
    Nombre. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `value`
    Valor. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `schemeName`
    Nombre del esquema. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `schemeID`
    ID del esquema. *Este campo es opcional* debe ser usado de acuerdo al giro del documento y debe ser un string.

### `customer` 🔴

#### Factura Electrónica

Información del cliente. *Este campo es obligatorio* para todos los documentos relacionados con la factura electrónica y documento soporte, y sus respectivas notas
y debe ser un objeto.
- Debido a que el cliente puede ser una persona natural o jurídica, se deben enviar los siguientes campos:
  - #### `country_id`: Valor por defecto `45`, Colombia(CO)
    País del cliente. *Este campo es opcional*.
    Puede consultar los diferentes países en el **ENDPOINT** `{{url}}/countries`.
  - #### `city_id`
    Ciudad del cliente. *Este campo es opcional*.
    Puede consultar las diferentes ciudades en el **ENDPOINT** `{{url}}/cities`.
  - #### `identity_document_id`: Valor por defecto `3`, NIT(31)
    Documento de identidad del cliente. *Este campo es opcional*.
    Puede consultar los diferentes documentos de identidad en el **ENDPOINT** `{{url}}/identity-documents`.
  - #### `type_organization_id`: Valor por defecto `2`, Persona Natural(2) 
    Tipo de organización del cliente, 1 (Persona Jurídica), 2 (Persona natural). *Este campo es opcional*.
  - #### `tax_regime_id`: Valor por defecto `2`, No responsable de IVA(49)
    **Régimen fiscal** del cliente. *Este campo es opcional*, si no se envía por defecto toma el código(`49`) de No responsable de IVA.
    Puede consultar los diferentes regímenes tributarios en el **ENDPOINT** `{{url}}/accounting-regime`.
  - #### `tax_level_id`: Valor por defecto `5`, No aplica – Otros(R-99-PN)
    **Responsabilidad tributaria** del cliente. *Este campo es opcional*, si no se envía por defecto toma el código(`R-99-PN`) de No aplica – Otros.
    Puede consultar los diferentes niveles tributarios en el **ENDPOINT** `{{url}}/fiscal-regime`.
  - #### `company_name`: Obligatorio para todos los documentos
    Nombre de la empresa/persona natual. *Este campo es obligatorio* para todos los documentos y debe ser un string.
  - #### `dni`: Obligatorio para todos los documentos
    Número del documento de identidad del cliente sin dígito de verificación. *Este campo es obligatorio* para todos los documentos y debe ser un string.
  - #### `mobile`: valor por defecto `""`
    Móvil del cliente. *Este campo es opcional*, si no se envía por defecto toma el valor de `""`.
  - #### `email`
    Email del cliente, a donde se enviará el documento electrónico. *Este campo es obligatorio* para todos los documentos que deben ser enviados al cliente y debe ser un string.
  - #### `address`: valor por defecto `""`
    Dirección del cliente. Este documento es opcional, si no se envía por defecto toma el valor de `""`.
  - #### `postal_code`: valor por defecto `"000000"`
    Código postal del cliente. *Este campo es opcional*, si no se envía por defecto toma el valor de `"000000"`.
  - #### ``city_name:`` **NEW**
    Nombre de la ciudad del cliente o proveedor extranjero. *Este campo es opcional*, solo se debe usar cuando el documento soporte
  es para no residente o cuando un cliente es extranjero.

### customer -> Documento P.O.S Electrónico.

Información del cliente. *Este campo es obligatorio* solo para los documentos equivalentes P.O.S y debe ser un objeto.
- #### Descripción de los campos
  - #### `company_name`: Obligatorio para todos los documentos
    Nombre de la empresa/persona natual. *Este campo es obligatorio* y debe ser un string.
  - #### `dni`: Obligatorio para todos los documentos
    Número del documento de identidad del cliente sin dígito de verificación. *Este campo es obligatorio* y debe ser un string.
  - #### ``email``
    Email del cliente, a donde se enviará el documento electrónico. *Este campo es opcional* y debe ser un string.
  - #### `points`
    Puntos del cliente. *Este campo es opcional*, si no se envía por defecto toma el valor de `0`.

### `discrepancy_response` 🟢

Respuesta a discrepancias. *Este campo es obligatorio* solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un objeto.

- #### Ejemplo

```json
"discrepancy_response": {
    "reference_id": "EPOS2",
    "response_id": "9"
  }
```
- #### Detalle de los campos
  - #### `reference_id`
    Número del documento al que se le hace la nota, con el prefijo, **ejemplo(FE4578)**. *Este campo es obligatorio* solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `response_id`
    Hace referencia al tipo de corrección aplicado a la nota. *Este campo es obligatorio* solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
    Puede consultar los diferentes tipos de corrección en el **ENDPOINT** `{{url}}/correction-notes`.

### `billing_reference` 🟡

**Uso:**
- 🔴 **Obligatorio** para Notas Crédito/Débito (referencia a factura original)
- 🟢 **Opcional** para otros documentos

Referencia de facturación. *Este campo es obligatorio* solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un objeto.

- #### Ejemplo

```json
"billing_reference": {
    "number": "EPOS2",
    "date": "2023-12-22",
    "uuid": "b1b5d93a2918407a2ef0048ed3092e5d96c94f73db178779463f202f8c52dd53ef5b9888d804d4b609521b1d031aea39",
    "scheme_name": "CUDE-SHA384"
  }
```
- ### Detalle de los campos
  - #### `number`
    Número del documento de referencia, con el prefijo, **ejemplo(FE4578)**. *Este campo es obligatorio* solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `date`
    Fecha del documento de referencia. *Este campo es obligatorio* solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `uuid`
    UUID del documento de referencia(`CUFE/CUDE`). *Este campo es obligatorio* solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `scheme_name`
    Nombre del esquema. *Este campo es obligatorio* solo para las notas de crédito, débito del **POS ELECTRÓNICO** y para las notas de ajuste del **DOCUMENTO SOPORTE**. Debe ser un string.

### `allowance_charges` 🟢

Descuentos o cargos **a nivel de factura**, es decir descuentos o cargos que no afectan las bases gravables. Los descuentos o cargos que afectan bases gravables se informan a nivel de ítem.
Este campo es opcional, se debe informar cuando hay un cargo o descuento a nivel global de la factura y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"allowance_charges": [
    {
        "amount": "10000",
        "base_amount": "725000",
        "charge_indicator": true,
        "allowance_charge_reason": "Motivo del cargo a la factura"
    },
    {
        "amount": "10000",
        "base_amount": "725000",
        "charge_indicator": false,
        "discount_id": 2,
        "allowance_charge_reason": "Motivo del descuento a la factura"
    }
  ]
```
- #### Detalle de los campos
  - #### `amount`
    Valor total del cargo o descuento. Valor numérico del Cargo o el Descuento. Si es descuento, no puede ser superior al valor base. *Este campo es obligatorio* y debe ser un string.
  - #### `base_amount`
    Valor Base para calcular el descuento o el cargo. *Este campo es obligatorio* y debe ser un string.
  - #### `charge_indicator`
    Indica que el elemento es un Cargo y no un descuento. Cargo es true, es un Débito aumenta el valor de la factura y se debe reportar en el `LegalMonetary`.
    Descuento es `false`, un Crédito descuenta el valor de la factura antes de tributos y debe reportarse en el LegalMonetary
    El elemento solamente puede identificar una de la información.
    Rechazo: Si este elemento contiene una información diferente de `true` o `false`.
  - #### `allowance_charge_reason`
    Texto libre para informar de la razón del descuento. Obligatorio si hay un recargo o descuento, entonces este elemento debe ser informado y debe ser un string.
  - #### `discount_id`
    Código para categorizar el descuento. Solo para descuentos a nivel de factura.
    Obligatorio de informar si es descuento a nivel de factura y debe ser un entero.
    Puede consultar los diferentes tipos de descuentos en el **ENDPOINT** `{{url}}/discount-codes`.

### `legal_monetary_totals` 🔴

Totales del documento. *Este campo es obligatorio* para todos los documentos donde se usa y debe ser un objeto.

- #### Ejemplo

```json
"legal_monetary_totals": {
    "line_extension_amount": "50000",
    "tax_exclusive_amount": "50000",
    "tax_inclusive_amount": "59500",
    "total_charges": 0,
    "total_allowance": 0,
    "payable_amount": "59500"
  }
```
- #### Detalle de los campos
  - #### `line_extension_amount`
    Total de las líneas antes de iva **(Total Valor Bruto antes de tributos)**.
    El Valor Bruto antes de tributos tiene que ser la suma de los valores de las líneas de la factura que contienen el valor comercial.
    *Este campo es obligatorio* y debe ser un string con valor flotante de máximo dos decimales.
  - #### `tax_exclusive_amount`
    Base gravable de las líneas que tienen impuesto, si no tiene impuesto se deja en **`0`**.
    Total Valor Base Imponible: base imponible para el cálculo de los tributos.
    El Valor Base Imponible tiene que ser la suma de los valores de las bases imponibles de todas líneas de detalle.
    *Este campo es obligatorio* y debe ser un string con valor flotante de máximo dos decimales.
  - #### `tax_inclusive_amount`
    Total de líneas + Impuestos. Total de Valor Bruto más tributos.
    El Valor Bruto más tributos tiene que ser igual a Valor Bruto de la factura que contienen el valor comercial, más la suma
    de los tributos de todas las líneas de detalle. *Este campo es obligatorio* y debe ser un string con valor flotante de máximo dos decimales.
  - #### `total_charges`
    Total de cargos. El Valor del Cargo Total, es igual a la suma de todos los cargos globales aplicados al total de la factura.
    *Este campo es opcional* y debe ser un string con valor flotante de máximo dos decimales. Si no se envía por defecto toma el valor de **`0`**.
  - #### `total_allowance`
    Total de descuentos. El Valor del Descuento Total es igual a la suma de todos los descuentos globales aplicados al total de la factura.
    *Este campo es opcional* y debe ser un string con valor flotante de máximo dos decimales. Si no se envía por defecto toma el valor de **`0`**.
  - #### `payable_amount`
    Monto total del documento. Valor total de ítems **(incluyendo cargos y descuentos a nivel de ítems) +valor tributos + valor cargos globales – valor descuentos globales**.
    *Este campo es obligatorio* y debe ser un string con valor flotante de máximo dos decimales.

### `lines` 🔴

Líneas del detalle de cada item del documento. *Este campo es obligatorio* para todos los documentos donde se usa y debe ser un arreglo de objetos.

- #### `invoiced_quantity`
  Cantidad del producto o servicio. *Este campo es obligatorio* y debe ser un string.
- #### `quantity_units_id`
  Hace referencia a la unidad de medida, se recomienda dejar el valor `1093`. *Este campo es obligatorio* y debe ser un string.
  Puede consultar las diferentes unidades de medida en el **ENDPOINT** `{{url}}/quantity-units`.
- #### `line_extension_amount`
  Valor total de la línea sin impuesto.
  El Valor Total de la línea es igual al producto de: *Cantidad x Precio Unidad menos Descuentos más Recargos* **(C X PU - D + R)**,
  que apliquen para la línea.
  *Este campo es obligatorio* y debe ser un string con valor flotante de máximo dos decimales ("`0.00`").
- #### `free_of_charge_indicator`: Valor por defecto `false`
  Indicador de gratuidad: Para indicar que es un producto gratis o muestra se debe enviar el valor ``true``. *Este campo es obligatorio* y debe ser un booleano.
- #### `description`
  Descripción del artículo o servicio a que se refiere esta línea de la factura. *Este campo es obligatorio* y debe ser un string.
- #### `note`
  Nota adicional del detalle de la línea. Obligatorio de informar para el caso de facturas por contratos de `servicio tipo AIU`. Para el ítem Administración.
  En este caso la cbc:Note debe empezar por el texto: `“Contrato de servicios AIU por concepto de:”`
  El contribuyente debe incluir el objeto del contrato facturado. *Este campo es opcional* y debe ser un string.
- #### `code`
  Código interno del artículo o servicio de la línea. *Este campo es obligatorio* y debe ser un string.
- #### `type_item_identifications_id`: Valor por defecto `4`
  Estandar de identificación del ítem, se recomienda que siempre sea `4`. *Este campo es obligatorio* y debe ser un string.
  Puede consultar los diferentes tipos de identificación de ítem en el **ENDPOINT** `{{url}}/type-item-identifications`.
- #### `reference_price_id`: Valor por defecto `1`
  Precio de referencia. *Este campo es obligatorio* y debe ser un string.
  Puede consultar los diferentes precios de referencia en el **ENDPOINT** `{{url}}/reference-price`.
- #### `price_amount`
  Valor del artículo o servicio. *Este campo es obligatorio* y debe ser un string con valor flotante de máximo dos decimales ("`0.00`").
- #### `base_quantity`
  La cantidad real sobre la cual el precio aplica, se recomienda ser igual a `invoiced_quantity`. *Este campo es obligatorio* y debe ser un string.

### `linea->extra_data`: **NEW**
 - Grupo de campos para información adicional de la línea. *Este campo es opcional* y debe ser un arreglo de objetos.
 - Este campo es utilizado para enviar información adicional que no se encuentra en los campos estándar de la línea.
 - Esta información adicional se mostrará en la representación gráfica del documento y no se enviará a la DIAN.

- #### Ejemplo

```json
"extra_data": [
  {
    "title": "LOTE",
    "value": "45413",
    "align": "left"
  },
  {
    "title": "FECHA DE EXPIRACIÓN",
    "value": "02/02/2026",
    "align": "center"
  }
]
```

- #### Detalle de los campos
  **NOTA**: Es importante que el campo `title` sea igual en cada línea donde se envía el mismo valor para la columna en la representación gráfica.
  - #### `title`
    Título del campo adicional. *Este campo es obligatorio* y debe ser un string.
  - #### `value`
    Valor del campo adicional. *Este campo es obligatorio* y debe ser un string.
  - #### `align`: default `left`
    Alineación del campo adicional. *Este campo es obligatorio* y debe ser un string.
    - `left`: Alineación a la izquierda.
    - `center`: Alineación al centro.
    - `right`: Alineación a la derecha.

### `lines->invoice_period`

Periodo de facturación de la línea del documento soporte. *Este campo es obligatorio* solo para los documentos soporte y debe ser un objeto.

- #### Ejemplo

```json
"invoice_period": {
    "start_date": "2022-06-28",
    "description_code": 1
  }
```
- #### Descripción de los campos
  - #### `start_date`
    Fecha de inicio. *Este campo es obligatorio* solo para los documentos soporte y debe ser un string.
  - #### `description_code`
    Código de descripción. *Este campo es obligatorio* solo para los documentos soporte y debe ser un entero.

### `lines->allowance_charges`

Grupo de campos para información relacionada con un cargo o un descuento en la línea.
Este grupo se debe informar a nivel de ítem, si y solamente si el cargo o descuento afecta la base gravable del ítem.
Si un cargo individual, general a la factura genera IVA, debe reportarse como ítem. Para el caso de los descuentos a nivel de ítem no es necesario codificarlos.
Este campo es opcional y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"allowance_charges": [
    {
        "amount": "10000",
        "base_amount": "725000",
        "charge_indicator": true,
        "allowance_charge_reason": "Motivo del cargo a la linea"
    },
    {
        "amount": "10000",
        "base_amount": "725000",
        "charge_indicator": false,
        "discount_id": 1,
        "allowance_charge_reason": "Motivo del descuento a la linea"
    }
]
```
- #### Detalle de los campos
  - #### `amount`
    Valor total del cargo o descuento. *Este campo es obligatorio* y debe ser un número flotante con máximo dos decimales encerrado entre `""`.
  - #### `base_amount`
    Valor Base para calcular el descuento el cargo. *Este campo es obligatorio* y debe ser un número flotante con máximo dos decimales encerrado entre `""`.
  - #### `charge_indicator`
    Indica que el elemento es un Cargo y no un descuento.
    Cargo es `true`, es un Débito aumenta el valor de la item.
    Descuento es `false`, un Crédito descuenta el valor del ítem
    El elemento solamente puede identificar una de las informaciones.
    *Este campo es obligatorio* cuando el cargo no es un descuento y debe ser un booleano.
  - #### `allowance_charge_reason`
    Texto libre para informar de la razón del descuento. *Este campo es obligatorio* y debe ser un string.

### `lines->tax_totals`

Grupo de campos para información relacionada con todos los impuestos de la línea. *Este campo es obligatorio* solo cuanto la línea tiene impuestos y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"tax_totals": [
    {
        "tax_id": "01",
        "tax_amount": "10000",
        "taxable_amount": "725000",
        "percent": 5
    }
]
```
- #### Detalle de los campos
  - #### `tax_id`
    ID del impuesto. *Este campo es obligatorio* y debe ser un string.
  - #### `tax_amount`
    Monto o valor total del impuesto. *Este campo es obligatorio* y debe ser un número flotante con máximo dos decimales.
  - #### `taxable_amount`
    Base gravable del impuesto. *Este campo es obligatorio* y debe ser un número flotante con máximo dos decimales
  - #### `percent`
    Porcentaje. *Este campo es obligatorio* y debe ser un entero.

### `tax_totals` 🔴

Arreglo que contiene la suma de todos los impuestos del documento, agrupados por tipo de impuesto. *Este campo es obligatorio* solo cuando el documento tiene impuestos.

La estructura del objeto dentro de este arreglo varía si el impuesto es porcentual (como IVA) o de valor fijo por unidad (como INC Bolsas, INCarbono, INCombustibles).

- #### Ejemplo (Impuesto Porcentual - ej: IVA)

```json
"tax_totals": [
    {
        "tax_id": "1", // ID para IVA
        "tax_amount": 1900.00,
        "taxable_amount": 10000.00,
        "percent": 19
    }
]
```
- #### Ejemplo (Impuesto de Valor Fijo - ej: INC Bolsas 2025)

```json
"tax_totals": [
    {
      "tax_id": "22", // ID para INC Bolsas (según mapeo adjunto)
      "tax_amount": 70.00, // Valor total del impuesto para este item/total
      "taxable_amount": 0.00, // Opcional o cero para impuestos fijos
      // Campos específicos para impuestos fijos por unidad:
      "quantity_units_id": "886", // Código que representa la unidad base (ej: Unidad/NIU para bolsas)
      "per_unit_amount": 70.00,   // Tarifa fija por unidad base ($70 por bolsa para 2025)
      "base_unit_measure": 1      // Cantidad base para la tarifa (generalmente 1)
    }
]
```
- #### Detalle de los campos
  - #### `tax_id`
    - ID del impuesto. *Este campo es obligatorio* y debe ser un string. 
    - Este campo agrupa todos los impuestos que tengan el mismo ID.
  - #### `tax_amount`
    - Monto o valor total del impuesto. *Este campo es obligatorio* y debe ser un número flotante con máximo dos decimales.
    - Este campo agrupa la suma del monto o valor total de todos los impuestos que tengan el mismo ID.
  - #### `taxable_amount`
    - Base gravable del impuesto. *Este campo es obligatorio* y debe ser un número flotante con máximo dos decimales.
    - Para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**), este campo puede ser opcional, tener un valor de 0, 
    - ya que el impuesto (tax_amount) no se calcula como un porcentaje de este valor.
  - #### `percent`
    - Porcentaje del impuesto. Este campo es obligatorio y aplica únicamente para impuestos porcentuales (ej: IVA - Código 1).
    - Para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**), este campo debe omitirse o ser ``0``. 
    - Debe ser un número entero o flotante si se incluye.

  - ### ``quantity_units_id``
    - Código de la unidad de medida base sobre la cual se aplica la tarifa fija del tributo. Este campo es obligatorio y
    - aplica únicamente para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**).
    - Debe ser un string que corresponda a un código de unidad válido según los catálogos de la DIAN 
    - (ej. "886" podría mapear a 'NIU' - Unidad para INC Bolsas; otros códigos mapearán a 'GLL' - Galón para INCombustibles, 'KGM' para INCarbono en carbón, etc.)
    - Identifica la unidad referida en ``per_unit_amount``.
  
  - ### ``per_unit_amount``
    - Tarifa o valor monetario fijo del tributo por cada unidad de medida base. Este campo es obligatorio y 
    - aplica únicamente para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**).
    - Debe ser un número flotante con máximo dos decimales, representando el monto fijo establecido por la normativa 
    - vigente (ej: 70.00 para INC Bolsas 2025, o la tarifa por galón/kg/m³ para INCarbono/INCombustibles).
  
  - ### ``base_unit_measure``
    - Cantidad de unidades base a la que se aplica la tarifa per_unit_amount. Este campo es obligatorio y 
    - aplica únicamente para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**).
    - Generalmente su valor es 1 (numérico), indicando que la tarifa en per_unit_amount es 
por una unidad de la medida especificada en quantity_units_id.

## `additional_document_reference` (Referencia a Documento Adicional) {#additional_document_reference-referencia-a-documento-adicional}

Grupo de campos para información que describen documentos referenciados por esta factura. **Obligatorio SOLO para facturas tipo 03** ([Contingencia](/docs/glossary#contingencia)). Para otros tipos de documento, este grupo no se valida.

Estos documentos representan acciones comerciales y mercantiles que amparan o soportan transacciones relacionadas con este documento electrónico.

**Referencia rápida:**
- Ver [Glosario: Contingencia](/docs/glossary#contingencia)
- Ver [Glosario: CUFE](/docs/glossary#cufe)
- Ver [Glosario: CUDE](/docs/glossary#cude)

**Ubicación en XPath:** `/Invoice/cac:AdditionalDocumentReference`

**Normativa:** Resolución No. 000165 (01/NOV/2023) - DIAN - Página 389

**Obligatoriedad:** 
- ✅ **Obligatorio** si `InvoiceTypeCode = "03"` (Factura de Contingencia)
- ❌ No aplica para otros tipos de documentos

**Tipo de Estructura:** Array (puede contener múltiples referencias)

### Estructura

```json
{
  "additional_document_reference": [
    {
      "number": "LZT2119",
      "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
      "scheme_name": "CUFE-SHA384",
      "date": "2025-08-18",
      "code": "01"
    }
  ]
}
```

### Notas Importantes sobre Documentos Referenciados

- ⚠️ Los **documentos electrónicos XML adoptados por la DIAN NO deben incluirse** en este fragmento, ya que estos documentos no contienen las identificaciones estándar como CUFE o CUDE.

- 📌 Si se trata de una **orden de entrega**, debe utilizarse el grupo de elemento `OrderReference`.

- 🔄 Si se desea **informar más de una orden de entrega**, debe disponerse del grupo `AdditionalDocumentReference`.

- 🏢 Este campo es **opcional para referenciar temas comerciales** a voluntad del facturador electrónico. Los códigos (`code`) son asignados por el facturador.

### Campos Obligatorios

- #### `number` (FAI02)
  - **Etiqueta XML:** `cbc:ID`
  - **Requerido:** Sí (cuando AdditionalDocumentReference existe)
  - **Tipo:** String
  - **Descripción:** Prefijo y Número del documento referenciado.
  - **Ejemplo:** "LZT2119"
  - **Validación DIAN:** ID de Documento de referencia no relacionado
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:ID`

- #### `uuid` (FAI03) ⚠️ CRÍTICO
  - **Etiqueta XML:** `cbc:ID/UUID`
  - **Requerido:** Sí (cuando AdditionalDocumentReference existe)
  - **Tipo:** String
  - **Longitud máxima:** 96 caracteres
  - **Descripción:** CUFE o CUDE del documento referenciado.
  - **Ejemplo:** "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567"
  - **Validación DIAN:** "No fue informado el CUFE o CUDE del documento referenciado"
  - **Rechazo:** Si no se informa CUFE o CUDE
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:ID/UUID`

- #### `scheme_name` (FAI04)
  - **Etiqueta XML:** `@schemeName` (atributo)
  - **Requerido:** No (pero recomendado)
  - **Tipo:** String
  - **Descripción:** Identificador del esquema de identificación del UUID.
  - **Valores válidos:**
    - `CUFE-SHA384` - Código Único de Factura Electrónica con algoritmo SHA384
    - `CUDE-SHA384` - Código Único de Documento Equivalente con algoritmo SHA384
    - Otros algoritmos permitidos por DIAN
  - **Ejemplo:** "CUFE-SHA384"
  - **Validación DIAN:** "No fue utilizado o informado uno de los algoritmos permitidos para el cálculo del CUFE o CUDE"
  - **Rechazo:** Si se utiliza algoritmo no permitido
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:UUID/@schemeName`

### Campos Opcionales

- #### `date` (FAI05)
  - **Etiqueta XML:** `cbc:IssueDate`
  - **Requerido:** No
  - **Tipo:** String (Formato: YYYY-MM-DD)
  - **Descripción:** Fecha de emisión del documento referenciado.
  - **Ejemplo:** "2025-08-18"
  - **Validación DIAN:** "No se informó la fecha de emisión del documento referenciado"
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:IssueDate`

- #### `code` (FAI06)
  - **Etiqueta XML:** `cbc:DocumentTypeCode`
  - **Requerido:** No
  - **Tipo:** String
  - **Descripción:** Identificador del tipo de documento de referencia. Este es un código asignado por el facturador electrónico para clasificar el tipo de documento comercial o mercantil que ampara la transacción. La codificación es asignada libremente por el facturador (no está estandarizada por DIAN).
  - **Ejemplo:** "01"
  - **Asignación:** Propia de cada empresa
  - **Validación DIAN:** "No está informado el tipo de documento referenciado"
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode`

### Reglas de Validación DIAN

| ID | Elemento | Tipo | Descripción | Regla | Mensaje de Rechazo | XPath |
|-----|----------|------|-------------|-------|-------------------|-------|
| FAI01 | AdditionalDocumentReference | **R** | Valida que exista grupo de referencia para factura tipo 03 | Solo obligatorio si `InvoiceTypeCode = "03"` | "El grupo AdditionalDocumentReference no está informado para factura tipo 03" | `/Invoice/cac:AdditionalDocumentReference` |
| FAI02 | ID | **R** | Prefijo y Número del documento referenciado | Requerido cuando existe AdditionalDocumentReference | "ID de Documento de referencia no relacionado" | `/Invoice/cac:AdditionalDocumentReference/cbc:ID` |
| FAI03 | UUID | **R** | CUFE o CUDE del documento referenciado | Requerido cuando existe AdditionalDocumentReference | "No fue informado el CUFE o CUDE del documento referenciado" | `/Invoice/cac:AdditionalDocumentReference/cbc:ID/UUID` |
| FAI04 | @schemeName | **N** | Identificador del esquema de identificación | Debe ser algoritmo permitido | "No fue utilizado o informado uno de los algoritmos permitidos para el cálculo del CUFE o CUDE" | `/Invoice/cac:AdditionalDocumentReference/cbc:UUID/@schemeName` |
| FAI05 | IssueDate | **N** | Fecha de emisión del documento referenciado | Opcional | "No se informó la fecha de emisión del documento referenciado" | `/Invoice/cac:AdditionalDocumentReference/cbc:IssueDate` |
| FAI06 | DocumentTypeCode | **N** | Identificador del tipo de documento de referencia | Opcional (asignado por facturador) | "No está informado el tipo de documento referenciado" | `/Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode` |

**Leyenda de Tipo:**
- **R** = Rechazo (campo obligatorio cuando grupo existe)
- **N** = Notificación (campo opcional, genera advertencia si falta)

### Notas Importantes

- ✅ `additional_document_reference` es **OBLIGATORIO solo para InvoiceTypeCode = "03"** (Factura de Contingencia)
- ✅ Para otros tipos de documentos, este grupo **NO se valida**
- ✅ Si `type_document_id = 9` (tipo 03), el grupo es obligatorio
- ✅ `number` (ID) y `uuid` son críticos - DIAN rechaza si faltan
- ✅ `scheme_name` debe ser un algoritmo válido (típicamente CUFE-SHA384)
- ✅ `date` e `code` son opcionales pero recomendados para trazabilidad
- ✅ Es un **ARRAY**: puede contener múltiples referencias a documentos diferentes
- ✅ Los códigos (`code`) son de asignación libre del facturador (no están estandarizados por DIAN)
- ❌ Los documentos XML adoptados por DIAN NO deben incluirse aquí

### ⚠️ Nota sobre API MATIAS (Comportamiento Automático)

**Para facturas tipo 03 (Contingencia):**

Si el cliente **no proporciona `additional_document_reference`** en la solicitud, el **API de MATIAS agregará automáticamente** los datos por defecto del **documento procesado** (la factura que se está generando):

```json
{
  "additional_document_reference": [
    {
      "number": "[PREFIX]-[DOCUMENT_NUMBER]",
      "uuid": "[CUFE_DEL_DOCUMENTO_GENERADO]",
      "scheme_name": "CUFE-SHA384",
      "date": "[FECHA_DE_EMISION_DEL_DOCUMENTO]",
      "code": "01"
    }
  ]
}
```

**Ejemplo automático del API:**

Si genera factura tipo 03 con:
- Prefijo: `LCON`
- Número: `2`
- Fecha: `2025-08-18`
- CUFE: `0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567`

El API agregará automáticamente:
```json
{
  "additional_document_reference": [
    {
      "number": "LCON2",
      "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
      "scheme_name": "CUFE-SHA384",
      "date": "2025-08-18",
      "code": "01"
    }
  ]
}
```

**Opciones de cliente:**

| Opción | Comportamiento |
|--------|----------------|
| No envía `additional_document_reference` | API agrega valores por defecto del documento |
| Envía `additional_document_reference` vacío `[]` | API agrega valores por defecto del documento |
| Envía `additional_document_reference` con datos | API utiliza los datos proporcionados |
| Envía múltiples referencias en el array | API procesa todas las referencias |

**Casos de uso:**

- ✅ **Contingencia simple:** No enviar `additional_document_reference`, el API lo genera automáticamente
- ✅ **Contingencia con referencia a otro documento:** Proporcionar explícitamente el `additional_document_reference`
- ✅ **Múltiples referencias:** Enviar array con varias referencias comerciales/de soporte

### Ejemplo 1: Una Referencia - JSON

```json
{
  "additional_document_reference": [
    {
      "number": "LZT2119",
      "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
      "scheme_name": "CUFE-SHA384",
      "date": "2025-08-18",
      "code": "01"
    }
  ]
}
```

### Ejemplo 2: Múltiples Referencias - JSON

```json
{
  "additional_document_reference": [
    {
      "number": "LZT2119",
      "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
      "scheme_name": "CUFE-SHA384",
      "date": "2025-08-18",
      "code": "01"
    },
    {
      "number": "LZT2120",
      "uuid": "1cd52b158f51ecdb92bc1defcec90g7s52c68bb932db03ca79g16b69adcdbe59f05g67402f2eg115a76g688845d5f568",
      "scheme_name": "CUFE-SHA384",
      "date": "2025-08-19",
      "code": "02"
    }
  ]
}
```

### Ejemplo Correcto - XML (Una Referencia)

```xml
<AdditionalDocumentReference>
  <cbc:ID>LZT2119</cbc:ID>
  <cbc:IssueDate>2025-08-18</cbc:IssueDate>
  <cbc:DocumentTypeCode>01</cbc:DocumentTypeCode>
  <cbc:UUID schemeName="CUFE-SHA384">0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567</cbc:UUID>
</AdditionalDocumentReference>
```

### Ejemplo Correcto - XML (Múltiples Referencias)

```xml
<AdditionalDocumentReference>
  <cbc:ID>LZT2119</cbc:ID>
  <cbc:IssueDate>2025-08-18</cbc:IssueDate>
  <cbc:DocumentTypeCode>01</cbc:DocumentTypeCode>
  <cbc:UUID schemeName="CUFE-SHA384">0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567</cbc:UUID>
</AdditionalDocumentReference>
<AdditionalDocumentReference>
  <cbc:ID>LZT2120</cbc:ID>
  <cbc:IssueDate>2025-08-19</cbc:IssueDate>
  <cbc:DocumentTypeCode>02</cbc:DocumentTypeCode>
  <cbc:UUID schemeName="CUFE-SHA384">1cd52b158f51ecdb92bc1defcec90g7s52c68bb932db03ca79g16b69adcdbe59f05g67402f2eg115a76g688845d5f568</cbc:UUID>
</AdditionalDocumentReference>
```

### Casos de Uso

#### Caso 1: Factura de Contingencia Tipo 03
Una factura de talonario que referencia un documento original.

#### Caso 2: Múltiples Órdenes de Entrega
Si se desea informar más de una orden de entrega, se usa este grupo (en lugar de solo `OrderReference`).

#### Caso 3: Documentos Comerciales de Soporte
Facturas que amparan transacciones con múltiples documentos de soporte (ej: recibos, órdenes, etc.).

### Referencias DIAN

- **Resolución:** No. 000165 (01/NOV/2023)
- **Página:** 389 de 753
- **Dirección de Gestión de Impuestos**
- **Documento:** Anexo Técnico de Facturación Electrónica v2.1

### Campos Obligatorios

- #### `number` (FAI02)
  - **Etiqueta XML:** `cbc:ID`
  - **Requerido:** Sí (cuando AdditionalDocumentReference existe)
  - **Tipo:** String
  - **Descripción:** Prefijo y Número del documento referenciado.
  - **Ejemplo:** "LZT2119"
  - **Validación DIAN:** ID de Documento de referencia no relacionado
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:ID`

- #### `uuid` (FAI03) ⚠️ CRÍTICO
  - **Etiqueta XML:** `cbc:ID/UUID`
  - **Requerido:** Sí (cuando AdditionalDocumentReference existe)
  - **Tipo:** String
  - **Longitud máxima:** 96 caracteres
  - **Descripción:** CUFE o CUDE del documento referenciado.
  - **Ejemplo:** "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567"
  - **Validación DIAN:** "No fue informado el CUFE o CUDE del documento referenciado"
  - **Rechazo:** Si no se informa CUFE o CUDE
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:ID/UUID`

- #### `scheme_name` (FAI04)
  - **Etiqueta XML:** `@schemeName` (atributo)
  - **Requerido:** No (pero recomendado)
  - **Tipo:** String
  - **Descripción:** Identificador del esquema de identificación del UUID.
  - **Valores válidos:**
    - `CUFE-SHA384` - Código Único de Factura Electrónica con algoritmo SHA384
    - `CUDE-SHA384` - Código Único de Documento Equivalente con algoritmo SHA384
    - Otros algoritmos permitidos por DIAN
  - **Ejemplo:** "CUFE-SHA384"
  - **Validación DIAN:** "No fue utilizado o informado uno de los algoritmos permitidos para el cálculo del CUFE o CUDE"
  - **Rechazo:** Si se utiliza algoritmo no permitido
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:UUID/@schemeName`

### Campos Opcionales

- #### `date` (FAI05)
  - **Etiqueta XML:** `cbc:IssueDate`
  - **Requerido:** No
  - **Tipo:** String (Formato: YYYY-MM-DD)
  - **Descripción:** Fecha de emisión del documento referenciado.
  - **Ejemplo:** "2025-08-18"
  - **Validación DIAN:** "No se informó la fecha de emisión del documento referenciado"
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:IssueDate`

- #### `code` (FAI06)
  - **Etiqueta XML:** `cbc:DocumentTypeCode`
  - **Requerido:** No
  - **Tipo:** String
  - **Descripción:** Identificador del tipo de documento de referencia (codificación propia de la empresa).
  - **Ejemplo:** "01"
  - **Validación DIAN:** "No está informado el tipo de documento referenciado"
  - **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode`

### Reglas de Validación DIAN

| ID | Elemento | Tipo | Descripción | Regla | Mensaje de Rechazo | XPath |
|-----|----------|------|-------------|-------|-------------------|-------|
| FAI01 | AdditionalDocumentReference | **R** | Valida que exista grupo de referencia para factura tipo 03 | Solo obligatorio si `InvoiceTypeCode = "03"` | "El grupo AdditionalDocumentReference no está informado para factura tipo 03" | `/Invoice/cac:AdditionalDocumentReference` |
| FAI02 | ID | **R** | Prefijo y Número del documento referenciado | Requerido cuando existe AdditionalDocumentReference | "ID de Documento de referencia no relacionado" | `/Invoice/cac:AdditionalDocumentReference/cbc:ID` |
| FAI03 | UUID | **R** | CUFE o CUDE del documento referenciado | Requerido cuando existe AdditionalDocumentReference | "No fue informado el CUFE o CUDE del documento referenciado" | `/Invoice/cac:AdditionalDocumentReference/cbc:ID/UUID` |
| FAI04 | @schemeName | **N** | Identificador del esquema de identificación | Debe ser algoritmo permitido | "No fue utilizado o informado uno de los algoritmos permitidos para el cálculo del CUFE o CUDE" | `/Invoice/cac:AdditionalDocumentReference/cbc:UUID/@schemeName` |
| FAI05 | IssueDate | **N** | Fecha de emisión del documento referenciado | Opcional | "No se informó la fecha de emisión del documento referenciado" | `/Invoice/cac:AdditionalDocumentReference/cbc:IssueDate` |
| FAI06 | DocumentTypeCode | **N** | Identificador del tipo de documento de referencia | Opcional | "No está informado el tipo de documento referenciado" | `/Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode` |

**Leyenda de Tipo:**
- **R** = Rechazo (campo obligatorio cuando grupo existe)
- **N** = Notificación (campo opcional, genera advertencia si falta)

### Notas Importantes

- ✅ `additional_document_reference` es **OBLIGATORIO solo para InvoiceTypeCode = "03"** (Factura de Contingencia)
- ✅ Para otros tipos de documentos, este grupo **NO se valida**
- ✅ Si `type_document_id = 9` (tipo 03), el grupo es obligatorio
- ✅ `number` (ID) y `uuid` son críticos - DIAN rechaza si faltan
- ✅ `scheme_name` debe ser un algoritmo válido (típicamente CUFE-SHA384)
- ✅ `date` e `code` son opcionales pero recomendados para trazabilidad

### Ejemplos de Rechazo

**❌ Rechazo 1: Falta AdditionalDocumentReference para tipo 03**
```
InvoiceTypeCode = "03"
AdditionalDocumentReference = NO INFORMADO
→ RECHAZO: El grupo AdditionalDocumentReference no está informado para factura tipo 03
```

**❌ Rechazo 2: Falta UUID (CUFE)**
```
AdditionalDocumentReference informado
UUID = NO INFORMADO
→ RECHAZO: No fue informado el CUFE o CUDE del documento referenciado
```

**❌ Rechazo 3: Esquema inválido**
```
@schemeName = "HASH-MD5" (no permitido)
→ RECHAZO: No fue utilizado o informado uno de los algoritmos permitidos
```

### Ejemplo Correcto - JSON

```json
{
  "additional_document_reference": [
    {
      "number": "LZT2119",
      "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
      "scheme_name": "CUFE-SHA384",
      "date": "2025-08-18",
      "code": "01"
    }
  ]
}
```

### Ejemplo Correcto - XML

```xml
<AdditionalDocumentReference>
  <cbc:ID>LZT2119</cbc:ID>
  <cbc:IssueDate>2025-08-18</cbc:IssueDate>
  <cbc:DocumentTypeCode>01</cbc:DocumentTypeCode>
  <cbc:UUID schemeName="CUFE-SHA384">0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567</cbc:UUID>
</AdditionalDocumentReference>
```

### Referencias DIAN

- **Resolución:** No. 000165 (01/NOV/2023)
- **Página:** 389 de 753
- **Dirección de Gestión de Impuestos**
- **Documento:** Anexo Técnico de Facturación Electrónica v2.1

---

## Ejemplo Mínimo Requerido {#ejemplo-mínimo-requerido}

Este es un ejemplo con **SOLO los campos obligatorios** para generar una factura simple (tipo 1):

```json
{
  "resolution_number": "18760000001",
  "prefix": "FEV",
  "document_number": 990000001,
  "operation_type_id": 1,
  "type_document_id": 1,
  "customer": {
    "country_id": "45",
    "city_id": "836",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "NOMBRE DEL CLIENTE",
    "dni": "1234564",
    "email": "correo@cliente.com"
  },
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "141100.00"
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "131600.00",
    "tax_exclusive_amount": "131600.00",
    "tax_inclusive_amount": "141100.00",
    "payable_amount": "141100.00"
  },
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "131600.00",
      "description": "Producto ejemplo",
      "price_amount": "131600.00"
    }
  ],
  "tax_totals": [
    {
      "tax_id": "01",
      "tax_amount": 9500,
      "taxable_amount": 131600,
      "percent": 19
    }
  ]
}
```

**Notas importantes sobre este ejemplo:**
- ✅ Todos los campos 🔴 **Obligatorios** están presentes
- ✅ Campos 🟢 **Opcionales** se omitieron para simplicidad
- ✅ Puede extenderse con campos adicionales según necesidad
- ✅ Para contingencia (tipo 03), debe agregar [`additional_document_reference`](#additional_document_reference-referencia-a-documento-adicional)
- ✅ Para POS (tipo 9), debe agregar [`point_of_sale`](#point_of_sale)
```