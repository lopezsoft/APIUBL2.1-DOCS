---
sidebar_position: 4
---

# 📋 Campos de todos los documentos electrónicos

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <strong>📖 Referencia Completa de Campos</strong><br/>
  En esta sección se describen <strong>todos los campos</strong> que se deben considerar para la generación de factura electrónica, nota de crédito y nota de débito, documento soporte y documento equivalente, con sus respectivas notas de ajuste.
</div>

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>📄</div>
    <strong>Factura Electrónica</strong><br/>
    <small>Tipos 7, 8, 9, 10</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>📝</div>
    <strong>Notas de Ajuste</strong><br/>
    <small>Crédito (5) / Débito (4)</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '1px solid #17a2b8', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🏪</div>
    <strong>POS Electrónico</strong><br/>
    <small>Tipo 20</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #dc3545', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>📑</div>
    <strong>Documento Soporte</strong><br/>
    <small>Tipo 11</small>
  </div>
</div>

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

## 🎯 Referencia Rápida de Tipos de Documento

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <h4 style={{marginTop: 0}}>⚠️ IMPORTANTE: IDs del API vs Códigos DIAN</h4>
  <p style={{marginBottom: 0}}>
    Los valores en la columna <strong>ID (API)</strong> son los que debes usar en <code>type_document_id</code>. El <strong>Code (DIAN)</strong> es solo para referencia con la normativa DIAN.<br/>
    <strong style={{color: '#856404'}}>🔑 REGLA DE ORO:</strong> En el API <strong>SIEMPRE</strong> usas el <code>ID de la DB</code>, <strong>NUNCA</strong> el code DIAN.
  </p>
</div>

| ID (API) | Code (DIAN) | Tipo                            | Descripción                             | Normativa | Notas                                                                 |
| -------- | ----------- | ------------------------------- | --------------------------------------- | --------- | --------------------------------------------------------------------- |
| **7**    | 01          | Factura de Venta                | Documento estándar de venta             | Res. 165  | `type_document_id: 7`                                                 |
| **8**    | 02          | Factura de Exportación          | Factura para operaciones con exterior   | Res. 165  | `type_document_id: 8`                                                 |
| **9**    | 03          | Factura de Contingencia Tipo 03 | Emitida cuando falla conexión DIAN      | Res. 165  | **`type_document_id: 9`** ⚠️ Requiere `additional_document_reference` |
| **10**   | 04          | Factura de Contingencia Tipo 04 | Protocolo alternativo especial          | Res. 165  | **`type_document_id: 10`** - Opcional `additional_document_reference` |
| **11**   | 05          | Documento Soporte               | Para servicios y operaciones especiales | Res. 165  | `type_document_id: 11`                                                |
| **20**   | 20          | Documento Equivalente POS       | Factura de Punto de Venta               | Res. 165  | **`type_document_id: 20`** ⚠️ Requiere `point_of_sale`                |
| **5**    | 91          | Nota Crédito                    | Devolución o descuento                  | Res. 165  | `type_document_id: 5` ⚠️ Genera CUDE                                  |
| **4**    | 92          | Nota Débito                     | Ajuste por aumento                      | Res. 165  | `type_document_id: 4` ⚠️ Genera CUDE                                  |

---

## ✅ Compatibilidad de Campos por Tipo

<div style={{backgroundColor: '#d4edda', padding: '1rem', borderRadius: '8px', border: '1px solid #28a745', marginBottom: '1rem'}}>
  <strong>📊 Matriz de Compatibilidad:</strong> Verifica qué campos son obligatorios (🔴), opcionales (🟢) o condicionales (🟡) según el tipo de documento.
</div>

| Campo                           | Factura (1,2) | Contingencia (3,4) | Documento Soporte (7) | POS (9) | Nota Crédito (91) | Nota Débito (92) |
| ------------------------------- | :-----------: | :----------------: | :-------------------: | :-----: | :---------------: | :--------------: |
| `resolution_number`             |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `prefix`                        |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `date`                          |      🟢       |         🟢         |          🟢           |   🟢    |        🟢         |        🟢        |
| `document_number`               |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `operation_type_id`             |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `type_document_id`              |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `payments`                      |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `customer`                      |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `legal_monetary_totals`         |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `lines`                         |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `additional_document_reference` |      🟢       |         🔴         |          🟢           |   🟢    |        🟢         |        🟢        |
| `point_of_sale`                 |      🟢       |         🟢         |          🟢           |   🔴    |        🟢         |        🟢        |
| `billing_reference`             |      🟢       |         🟢         |          🟢           |   🟢    |        🔴         |        🔴        |
| `order_reference`               |      🟢       |         🟢         |          🟢           |   🟢    |        🟢         |        🟢        |

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', margin: '1.5rem 0'}}>
  <div style={{padding: '0.75rem', backgroundColor: '#f8d7da', borderRadius: '6px', border: '1px solid #dc3545'}}>
    🔴 <strong>Obligatorio</strong>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '6px', border: '1px solid #28a745'}}>
    🟢 <strong>Opcional</strong>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '6px', border: '1px solid #ffc107'}}>
    🟡 <strong>Condicional</strong>
  </div>
</div>

---

## 📖 Descripción de los campos

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

## 🔧 Uso de los campos

<div style={{backgroundColor: '#e7f3ff', padding: '1rem', borderRadius: '8px', border: '1px solid #0066cc', marginBottom: '2rem'}}>
  <strong>💡 Guía de Uso:</strong> A continuación se describe el uso detallado de los campos de la factura electrónica, nota de crédito y nota de débito, documento soporte y documento equivalente, con sus respectivas notas de ajuste.
</div>

### `resolution_number` 🔴

Número de resolución del documento, este valor debe ser el mismo que se configura en el portal web. _Este campo es obligatorio_ para todos los documentos.

### `prefix` 🟡

Prefijo de la resolución del documento. _Este campo es obligatorio_ cuando se tiene más de una resolución y debe ser un string.

### `date` 🟢

Fecha de emisión del documento. _Este campo es opcional_ y en caso de enviarlo debe ser un string en formato **`YYYY-MM-DD`**. Si no envía este campo, la API tomará la fecha actual.

### `expiration_date` 🟢

Fecha de vencimiento del documento equivalente electrónico debe estar asociada con las fechas negociadas o acordadas según los registros de los campos **cac:PaymentTerms/cbc:PaymentDueDate**.

### `time` 🟢

Hora de emisión del documento. _Este campo es opcional_ y en caso de enviarlo y debe ser un string en formato **`H:i:s`**. Si no envía este campo, la API tomará la hora actual

### `notes` 🟢

Si desea enviar información adicional sobre el documento, puede enviar este campo, el cual es opcional para algunos documentos y debe ser un string.

### `document_number` 🔴

Número consecutivo del documento, sin prefijos. _Este campo es obligatorio_ para todos los documentos y debe ser un entero encerrado entre `""` sin prefijos.

### `operation_type_id` 🔴

Se refiere al tipo de operación que afecta al documento, en la mayoría de los documentos es 1 (Estándar). _Este campo es obligatorio_ para todos los documentos y debe ser un entero.

- #### Ejemplo

  ```json
    "operation_type_id": 1
  ```

### `type_document_id` 🔴

Se refiere al tipo de documento que se está enviando a la DIAN. _Este campo es obligatorio_ para todos los documentos y debe ser un **entero que corresponda al ID de la base de datos del API** (NO el code DIAN).

**Valores permitidos (ID de API):**

- `7` - Factura de Venta (code DIAN: 01)
- `8` - Factura de Exportación (code DIAN: 02)
- `9` - **Factura de Contingencia Tipo 03** (code DIAN: 03) - Requiere [`additional_document_reference`](#additional_document_reference-referencia-a-documento-adicional)
- `10` - **Factura de Contingencia Tipo 04** (code DIAN: 04)
- `11` - Documento Soporte (code DIAN: 05)
- `20` - **Documento Equivalente POS** (code DIAN: 20) - Requiere [`point_of_sale`](#point_of_sale)
- `5` - Nota Crédito (code DIAN: 91)
- `4` - Nota Débito (code DIAN: 92)

**⚠️ CRÍTICO:** En el API SIEMPRE usas el ID (números de la izquierda), NUNCA el code DIAN (números entre paréntesis).

**Consultar también:** [Referencia Rápida de Tipos de Documento](#referencia-rápida-de-tipos-de-documento) | [Glosario: Contingencia](/docs/glossary#contingencia)

### `graphic_representation` 🟢

Indicador de representación gráfica. _Este campo es opcional_, se debe enviar cuando se espera que la API genere el PDF de la representación gráfica.

- #### Ejemplo

  ```json
    "graphic_representation": 1
  ```

### `send_email` 🟢

Indicador de envío de email. _Este campo es opcional_, se debe enviar cuando se espera que la API envíe el email al cliente del documento.

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

Lista de pagos. _Este campo es obligatorio_ para todos los documentos y debe ser un arreglo de objetos.

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
    Método de pago, **`1`** cuado es de contado y **`2`** cuando es a crédito. _Este campo es obligatorio_ para todos los documentos y debe ser un entero.
  - #### `means_payment_id`
    Medio de pago. Este campo es utiliza para indicar un medio de pago y es obligatorio para todos los documentos y debe ser un entero.
    Puede consultar los diferentes medios de pago en el **ENDPOINT** `{{url}}/payment-means`.
  - #### `value_paid`
    Valor pagado. _Este campo es obligatorio_ para todos los documentos y debe ser un número flotante con máximo dos decimales, encerrado entre `""`.
  - #### `payment_due_date`
    Fecha de vencimiento del pago. Este campo es usado para indicar la fecha de vencimiento de un pago a **crédito**.
    **Es obligatorio solo para las ventas a crédito** y debe ser un string en formato `YYYY-MM-DD`.

### `report_header`: **NEW**

Este objeto es una parte fundamental del cuerpo de la solicitud (request body).
Contiene toda la información necesaria para que la API pueda renderizar dinámicamente el encabezado y/o
pie de página del documento utilizando una plantilla de diseño predefinida.

#### Descripción General

La lógica se basa en un sistema de plantillas. Se proporciona
el identificador de una plantilla **(`uuid`)** y un conjunto de variables **(`vars`)**.
La API utilizará estos datos para buscar la plantilla correspondiente y reemplazar los
"marcadores de posición" (placeholders) en ella con los valores proporcionados.

#### Estructura de Campos - Tabla de Parámetros

| Campo | Tipo             | Requerido | Descripción                                                                                                                                            |
| ----- | ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| uuid  | String           | Sí        | El Identificador Único Universal de la plantilla de diseño a utilizar. Este `uuid` debe corresponder a una plantilla previamente creada en el sistema. |
| vars  | Array de Objetos | Sí        | Una lista que contiene todas las variables y sus valores para reemplazar los marcadores de posición en la plantilla.                                   |

#### Estructura de los objetos dentro del array `vars`

Cada objeto dentro del array vars debe tener la siguiente estructura de clave-valor:
| Campo | Tipo | Requerido | Descripción |
|-------|--------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name | String | Sí | El nombre del marcador de posición definido en la plantilla. Importante: Debe enviarse sin las llaves {}. Por ejemplo, si en la plantilla el marcador es `{sucursal}`, el valor de name debe ser `"sucursal"`. |
| value | String | Sí | El valor de texto o HTML con el que se reemplazará el marcador correspondiente. La API insertará este valor tal cual en la plantilla |

#### Ejemplo Completo del Objeto

A continuación se muestra un ejemplo válido del objeto `report_header` que se debe incluir en el cuerpo de la solicitud a la API.

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
  | Código | Descripción                                                                                     |
  | ------ | ----------------------------------------------------------------------------------------------- |
  | 01     | Debida Diligencia del Cliente – DDC General                                                     |
  | 02     | Debida Diligencia del Cliente – DDC Reforzada                                                   |
  | 03     | Debida diligencia intensificada por razón de la cuantía de las operaciones – DDC intensificada. |
  | 04     | Debida Diligencia del Cliente – DDC simplificada                                                |

### `document_signature`: **NEW**

Información de la firma del documento. _Este campo es opcional_ y debe ser un objeto.

- #### Ejemplo

```json
"document_signature": {
    "cashier": "Nombre del cajero(a)",
    "seller": "Nombre del vendedor(a)"
  }
```

- #### Detalle de los campos
  - #### `cashier`
    Nombre del cajero(a). _Este campo es opcional_ y debe ser un string.
  - #### `seller`
    Nombre del vendedor(a). _Este campo es opcional_ y debe ser un string.

### `payment_exchange_rate` 🟡

Tasa de cambio para el pago. _Este campo es obligatorio_ solo para los documentos en moneda extranjera y debe ser un objeto.

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
    Valor de la tasa de cambio. _Este campo es obligatorio_ solo para los documentos en moneda extranjera y debe ser un string.
  - #### `rate_date`
    Fecha de la tasa de cambio. _Este campo es obligatorio_ solo para los documentos en moneda extranjera y debe ser un string.
  - #### `base_rate`
    Tasa base. _Este campo es obligatorio_ solo para los documentos en moneda extranjera y debe ser un string.
    Base monetaria de la divisa COP que se deberá convertir a moneda extranjera, ejemplo: si es USD el valor a informar es el valor equivalente de un dólar en pesos.

### `point_of_sale` 🟡

Información del punto de venta. _Este campo es obligatorio_ solo para los documentos de tipo **P.O.S ELECTRÓNICO** (`type_document_id = 9`) y debe ser un objeto.

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
    Nombre del cajero. _Este campo es obligatorio_ solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `terminal_number`
    Número de términal del punto de venta. _Este campo es obligatorio_ solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `cashier_type`
    Tipo de caja del punto de venta, ejemplo(`GENÉRICA`). _Este campo es obligatorio_ solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `sales_code`
    Código de la venta, puede ser ID de la venta ejemplo(`45212`). _Este campo es obligatorio_ solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `address`
    Dirección del punto de venta. _Este campo es obligatorio_ solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.
  - #### `sub_total`
    Subtotal de la venta, total venta sin IVA. _Este campo es obligatorio_ solo para los documentos de tipo **P.O.S ELECTRÓNICO** y debe ser un string.

### `software_manufacturer` 🟡

Información del fabricante del software. _Este campo es obligatorio_ solo para los documentos equivalentes P.O.S (`type_document_id = 9`) y debe ser un objeto.

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
    Nombre del propietario. _Este campo es obligatorio_ solo para los documentos equivalentes P.O.S y debe ser un string.
  - #### `company_name`
    Nombre de la compañía. _Este campo es obligatorio_ solo para los documentos equivalentes P.O.S y debe ser un string.
  - #### `software_name`
    Nombre del software. _Este campo es obligatorio_ solo para los documentos equivalentes P.O.S y debe ser un string.

### `order_reference` 🟢

Referencia de la orden de compra. _Este campo es opcional_ y debe ser usado de acuerdo al giro del documento. Debe ser un objeto.

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
    Número de referencia. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
  - #### `reference_date`
    Fecha de referencia. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.

### `health` 🟢

Información del sector salud. _Este campo es opcional_ y debe ser usado de acuerdo al giro del documento. Debe ser un objeto.

- #### `operation_type`
  Tipo de operación. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- #### `invoice_period`
  Periodo de facturación. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un objeto.
  - - ##### `start_date`
      Fecha de inicio. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `start_time`
      Hora de inicio. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `end_date`
      Fecha de fin. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `end_time`
      Hora de fin. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- #### `download_attachments`
  Descargar archivos adjuntos. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un objeto.
  - - ##### `url`
      URL. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `arguments`
      Argumentos. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un arreglo de objetos.
- - ###### `name`
    Nombre. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `value`
    Valor. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- #### `document_delivery`
  Entrega de documentos. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un objeto.
  - - ##### `ws`
      URL del servicio web. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
  - - ##### `arguments`
      Argumentos. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un arreglo de objetos.
- - ###### `name`
    Nombre. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `value`
    Valor. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- #### `user_collections`
  Colecciones de usuario. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un arreglo de objetos.
  - - ##### `information`
      Información. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un arreglo de objetos.
- - ###### `name`
    Nombre. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `value`
    Valor. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `schemeName`
    Nombre del esquema. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
- - ###### `schemeID`
    ID del esquema. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.

### `customer` 🔴

#### Factura Electrónica

Información del cliente. _Este campo es obligatorio_ para todos los documentos relacionados con la factura electrónica y documento soporte, y sus respectivas notas
y debe ser un objeto.

- Debido a que el cliente puede ser una persona natural o jurídica, se deben enviar los siguientes campos:
  - #### `country_id`: Valor por defecto `45`, Colombia(CO)
    País del cliente. _Este campo es opcional_.
    Puede consultar los diferentes países en el **ENDPOINT** `{{url}}/countries`.
  - #### `city_id`
    Ciudad del cliente. _Este campo es opcional_.
    Puede consultar las diferentes ciudades en el **ENDPOINT** `{{url}}/cities`.
  - #### `identity_document_id`: Valor por defecto `3`, NIT(31)
    Documento de identidad del cliente. _Este campo es opcional_.
    Puede consultar los diferentes documentos de identidad en el **ENDPOINT** `{{url}}/identity-documents`.
  - #### `type_organization_id`: Valor por defecto `2`, Persona Natural(2)
    Tipo de organización del cliente, 1 (Persona Jurídica), 2 (Persona natural). _Este campo es opcional_.
  - #### `tax_regime_id`: Valor por defecto `2`, No responsable de IVA(49)
    **Régimen fiscal** del cliente. _Este campo es opcional_, si no se envía por defecto toma el código(`49`) de No responsable de IVA.
    Puede consultar los diferentes regímenes tributarios en el **ENDPOINT** `{{url}}/accounting-regime`.
  - #### `tax_level_id`: Valor por defecto `5`, No aplica – Otros(R-99-PN)
    **Responsabilidad tributaria** del cliente. _Este campo es opcional_, si no se envía por defecto toma el código(`R-99-PN`) de No aplica – Otros.
    Puede consultar los diferentes niveles tributarios en el **ENDPOINT** `{{url}}/fiscal-regime`.
  - #### `company_name`: Obligatorio para todos los documentos
    Nombre de la empresa/persona natual. _Este campo es obligatorio_ para todos los documentos y debe ser un string.
  - #### `dni`: Obligatorio para todos los documentos
    Número del documento de identidad del cliente sin dígito de verificación. _Este campo es obligatorio_ para todos los documentos y debe ser un string.
  - #### `mobile`: valor por defecto `""`
    Móvil del cliente. _Este campo es opcional_, si no se envía por defecto toma el valor de `""`.
  - #### `email`
    Email del cliente, a donde se enviará el documento electrónico. _Este campo es obligatorio_ para todos los documentos que deben ser enviados al cliente y debe ser un string.
  - #### `address`: valor por defecto `""`
    Dirección del cliente. Este documento es opcional, si no se envía por defecto toma el valor de `""`.
  - #### `postal_code`: valor por defecto `"000000"`
    Código postal del cliente. _Este campo es opcional_, si no se envía por defecto toma el valor de `"000000"`.
  - #### `city_name:` **NEW**
    Nombre de la ciudad del cliente o proveedor extranjero. _Este campo es opcional_, solo se debe usar cuando el documento soporte
    es para no residente o cuando un cliente es extranjero.

### customer -> Documento P.O.S Electrónico.

Información del cliente. _Este campo es obligatorio_ solo para los documentos equivalentes P.O.S y debe ser un objeto.

- #### Descripción de los campos
  - #### `company_name`: Obligatorio para todos los documentos
    Nombre de la empresa/persona natual. _Este campo es obligatorio_ y debe ser un string.
  - #### `dni`: Obligatorio para todos los documentos
    Número del documento de identidad del cliente sin dígito de verificación. _Este campo es obligatorio_ y debe ser un string.
  - #### `email`
    Email del cliente, a donde se enviará el documento electrónico. _Este campo es opcional_ y debe ser un string.
  - #### `points`
    Puntos del cliente. _Este campo es opcional_, si no se envía por defecto toma el valor de `0`.

### `discrepancy_response` 🟢

Respuesta a discrepancias. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un objeto.

- #### Ejemplo

```json
"discrepancy_response": {
    "reference_id": "EPOS2",
    "response_id": "9"
  }
```

- #### Detalle de los campos
  - #### `reference_id`
    Número del documento al que se le hace la nota, con el prefijo, **ejemplo(FE4578)**. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `response_id`
    Hace referencia al tipo de corrección aplicado a la nota. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
    Puede consultar los diferentes tipos de corrección en el **ENDPOINT** `{{url}}/correction-notes`.

### `billing_reference` 🟡

**Uso:**

- 🔴 **Obligatorio** para Notas Crédito/Débito (referencia a factura original)
- 🟢 **Opcional** para otros documentos

Referencia de facturación. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un objeto.

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
    Número del documento de referencia, con el prefijo, **ejemplo(FE4578)**. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `date`
    Fecha del documento de referencia. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `uuid`
    UUID del documento de referencia(`CUFE/CUDE`). _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `scheme_name`
    Nombre del esquema. _Este campo es obligatorio_ solo para las notas de crédito, débito del **POS ELECTRÓNICO** y para las notas de ajuste del **DOCUMENTO SOPORTE**. Debe ser un string.

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
    Valor total del cargo o descuento. Valor numérico del Cargo o el Descuento. Si es descuento, no puede ser superior al valor base. _Este campo es obligatorio_ y debe ser un string.
  - #### `base_amount`
    Valor Base para calcular el descuento o el cargo. _Este campo es obligatorio_ y debe ser un string.
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

Totales del documento. _Este campo es obligatorio_ para todos los documentos donde se usa y debe ser un objeto.

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
    _Este campo es obligatorio_ y debe ser un string con valor flotante de máximo dos decimales.
  - #### `tax_exclusive_amount`
    Base gravable de las líneas que tienen impuesto, si no tiene impuesto se deja en **`0`**.
    Total Valor Base Imponible: base imponible para el cálculo de los tributos.
    El Valor Base Imponible tiene que ser la suma de los valores de las bases imponibles de todas líneas de detalle.
    _Este campo es obligatorio_ y debe ser un string con valor flotante de máximo dos decimales.
  - #### `tax_inclusive_amount`
    Total de líneas + Impuestos. Total de Valor Bruto más tributos.
    El Valor Bruto más tributos tiene que ser igual a Valor Bruto de la factura que contienen el valor comercial, más la suma
    de los tributos de todas las líneas de detalle. _Este campo es obligatorio_ y debe ser un string con valor flotante de máximo dos decimales.
  - #### `total_charges`
    Total de cargos. El Valor del Cargo Total, es igual a la suma de todos los cargos globales aplicados al total de la factura.
    _Este campo es opcional_ y debe ser un string con valor flotante de máximo dos decimales. Si no se envía por defecto toma el valor de **`0`**.
  - #### `total_allowance`
    Total de descuentos. El Valor del Descuento Total es igual a la suma de todos los descuentos globales aplicados al total de la factura.
    _Este campo es opcional_ y debe ser un string con valor flotante de máximo dos decimales. Si no se envía por defecto toma el valor de **`0`**.
  - #### `payable_amount`
    Monto total del documento. Valor total de ítems **(incluyendo cargos y descuentos a nivel de ítems) +valor tributos + valor cargos globales – valor descuentos globales**.
    _Este campo es obligatorio_ y debe ser un string con valor flotante de máximo dos decimales.

### `lines` 🔴

Líneas del detalle de cada item del documento. _Este campo es obligatorio_ para todos los documentos donde se usa y debe ser un arreglo de objetos.

- #### `invoiced_quantity`
  Cantidad del producto o servicio. _Este campo es obligatorio_ y debe ser un string.
- #### `quantity_units_id`
  Hace referencia a la unidad de medida, se recomienda dejar el valor `1093`. _Este campo es obligatorio_ y debe ser un string.
  Puede consultar las diferentes unidades de medida en el **ENDPOINT** `{{url}}/quantity-units`.
- #### `line_extension_amount`
  Valor total de la línea sin impuesto.
  El Valor Total de la línea es igual al producto de: _Cantidad x Precio Unidad menos Descuentos más Recargos_ **(C X PU - D + R)**,
  que apliquen para la línea.
  _Este campo es obligatorio_ y debe ser un string con valor flotante de máximo dos decimales ("`0.00`").
- #### `free_of_charge_indicator`: Valor por defecto `false`
  Indicador de gratuidad: Para indicar que es un producto gratis o muestra se debe enviar el valor `true`. _Este campo es obligatorio_ y debe ser un booleano.
- #### `description`
  Descripción del artículo o servicio a que se refiere esta línea de la factura. _Este campo es obligatorio_ y debe ser un string.
- #### `note`
  Nota adicional del detalle de la línea. Obligatorio de informar para el caso de facturas por contratos de `servicio tipo AIU`. Para el ítem Administración.
  En este caso la cbc:Note debe empezar por el texto: `“Contrato de servicios AIU por concepto de:”`
  El contribuyente debe incluir el objeto del contrato facturado. _Este campo es opcional_ y debe ser un string.
- #### `code`
  Código interno del artículo o servicio de la línea. _Este campo es obligatorio_ y debe ser un string.
- #### `type_item_identifications_id`: Valor por defecto `4`
  Estandar de identificación del ítem, se recomienda que siempre sea `4`. _Este campo es obligatorio_ y debe ser un string.
  Puede consultar los diferentes tipos de identificación de ítem en el **ENDPOINT** `{{url}}/type-item-identifications`.
- #### `reference_price_id`: Valor por defecto `1`
  Precio de referencia. _Este campo es obligatorio_ y debe ser un string.
  Puede consultar los diferentes precios de referencia en el **ENDPOINT** `{{url}}/reference-price`.
- #### `price_amount`
  Valor del artículo o servicio. _Este campo es obligatorio_ y debe ser un string con valor flotante de máximo dos decimales ("`0.00`").
- #### `base_quantity`
  La cantidad real sobre la cual el precio aplica, se recomienda ser igual a `invoiced_quantity`. _Este campo es obligatorio_ y debe ser un string.

### `lines->mandate`

Grupo de información que describe el mandatario de la operación de venta. _Este campo es obligatorio solo para facturas de mandato_ y debe ser un objeto.

Este campo se informa a nivel de ítem y aplica solo para mandatos. Un mandante por ítem.

- #### Ejemplo

```json
"mandate": {
  "dni": "2222222222",
  "dv": "2",
  "code": "0"
}
```

- #### Detalle de los campos
  - #### `dni`
    Número de identificación del mandatario. _Este campo es obligatorio_ y debe ser un string.
  - #### `dv`
    Dígito de verificación del mandatario. _Este campo es obligatorio_ y debe ser un string.
  - #### `code`

    Código que indica el tipo de ingreso del mandatario. _Este campo es obligatorio_ y debe ser un string.

    | Código | Significado                          |
    | ------ | ------------------------------------ |
    | 0      | B/S ingreso propio                   |
    | 1      | B/S Ingresos Recibidos para Terceros |

### `linea->extra_data`: **NEW**

- Grupo de campos para información adicional de la línea. _Este campo es opcional_ y debe ser un arreglo de objetos.
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
    Título del campo adicional. _Este campo es obligatorio_ y debe ser un string.
  - #### `value`
    Valor del campo adicional. _Este campo es obligatorio_ y debe ser un string.
  - #### `align`: default `left`
    Alineación del campo adicional. _Este campo es obligatorio_ y debe ser un string.
    - `left`: Alineación a la izquierda.
    - `center`: Alineación al centro.
    - `right`: Alineación a la derecha.

### `lines->invoice_period`

Periodo de facturación de la línea del documento soporte. _Este campo es obligatorio_ solo para los documentos soporte y debe ser un objeto.

- #### Ejemplo

```json
"invoice_period": {
    "start_date": "2022-06-28",
    "description_code": 1
  }
```

- #### Descripción de los campos
  - #### `start_date`
    Fecha de inicio. _Este campo es obligatorio_ solo para los documentos soporte y debe ser un string.
  - #### `description_code`
    Código de descripción. _Este campo es obligatorio_ solo para los documentos soporte y debe ser un entero.

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
    Valor total del cargo o descuento. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales encerrado entre `""`.
  - #### `base_amount`
    Valor Base para calcular el descuento el cargo. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales encerrado entre `""`.
  - #### `charge_indicator`
    Indica que el elemento es un Cargo y no un descuento.
    Cargo es `true`, es un Débito aumenta el valor de la item.
    Descuento es `false`, un Crédito descuenta el valor del ítem
    El elemento solamente puede identificar una de las informaciones.
    _Este campo es obligatorio_ cuando el cargo no es un descuento y debe ser un booleano.
  - #### `allowance_charge_reason`
    Texto libre para informar de la razón del descuento. _Este campo es obligatorio_ y debe ser un string.

### `lines->tax_totals`

Grupo de campos para información relacionada con todos los impuestos de la línea. _Este campo es obligatorio_ solo cuanto la línea tiene impuestos y debe ser un arreglo de objetos.

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
    ID del impuesto. _Este campo es obligatorio_ y debe ser un string.
  - #### `tax_amount`
    Monto o valor total del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
  - #### `taxable_amount`
    Base gravable del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales
  - #### `percent`
    Porcentaje. _Este campo es obligatorio_ y debe ser un entero.

### `tax_totals` 🔴

Arreglo que contiene la suma de todos los impuestos del documento, agrupados por tipo de impuesto. _Este campo es obligatorio_ solo cuando el documento tiene impuestos.

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
    - ID del impuesto. _Este campo es obligatorio_ y debe ser un string.
    - Este campo agrupa todos los impuestos que tengan el mismo ID.
  - #### `tax_amount`
    - Monto o valor total del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
    - Este campo agrupa la suma del monto o valor total de todos los impuestos que tengan el mismo ID.
  - #### `taxable_amount`
    - Base gravable del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
    - Para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**), este campo puede ser opcional, tener un valor de 0,
    - ya que el impuesto (tax_amount) no se calcula como un porcentaje de este valor.
  - #### `percent`
    - Porcentaje del impuesto. Este campo es obligatorio y aplica únicamente para impuestos porcentuales (ej: IVA - Código 1).
    - Para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**), este campo debe omitirse o ser `0`.
    - Debe ser un número entero o flotante si se incluye.

  - ### `quantity_units_id`
    - Código de la unidad de medida base sobre la cual se aplica la tarifa fija del tributo. Este campo es obligatorio y
    - aplica únicamente para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**).
    - Debe ser un string que corresponda a un código de unidad válido según los catálogos de la DIAN
    - (ej. "886" podría mapear a 'NIU' - Unidad para INC Bolsas; otros códigos mapearán a 'GLL' - Galón para INCombustibles, 'KGM' para INCarbono en carbón, etc.)
    - Identifica la unidad referida en `per_unit_amount`.

  - ### `per_unit_amount`
    - Tarifa o valor monetario fijo del tributo por cada unidad de medida base. Este campo es obligatorio y
    - aplica únicamente para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**).
    - Debe ser un número flotante con máximo dos decimales, representando el monto fijo establecido por la normativa
    - vigente (ej: 70.00 para INC Bolsas 2025, o la tarifa por galón/kg/m³ para INCarbono/INCombustibles).

  - ### `base_unit_measure`
        - Cantidad de unidades base a la que se aplica la tarifa per_unit_amount. Este campo es obligatorio y
        - aplica únicamente para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24**).
        - Generalmente su valor es 1 (numérico), indicando que la tarifa en per_unit_amount es
    por una unidad de la medida especificada en quantity_units_id.

## `additional_document_reference` (Referencia a Documento Adicional) {#additional_document_reference-referencia-a-documento-adicional}

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>⚠️ IMPORTANTE: Contingencia Tipo 03 - Transmisión de Factura de Papel</strong><br/>
  Este nodo es <strong>OBLIGATORIO</strong> para facturas tipo 03 (Contingencia del Facturador). Cuando tuvo un inconveniente tecnológico y expidió una factura física (talonario/papel), ahora debe transmitir esa información digitalmente a la DIAN. Este nodo le indica al sistema que <strong>NO es una factura nueva</strong>, sino el reporte digital de una que ya existe físicamente.
</div>

**Ubicación en XPath:** `/Invoice/cac:AdditionalDocumentReference`

**Normativa:** Anexo Técnico de Factura Electrónica v1.9 - Resolución No. 000165 (01/NOV/2023) - DIAN

### ¿Por qué se requiere este nodo para Tipo 03?

Cuando usted marca una factura como **Tipo 03** (Contingencia por facturador), este nodo se vuelve **obligatorio** según la regla **FAI01**:

> **Rechazo:** Si `/Invoice/cbc:InvoiceTypeCode = "03"` (Contingencia) y el grupo `/Invoice/cac:AdditionalDocumentReference` no es informado.

**El propósito es relacionar el XML que está transmitiendo ahora con el papel que entregó previamente al cliente.**

### ¿Qué información debe colocar en este nodo?

<div style={{backgroundColor: '#f8d7da', padding: '1.5rem', borderRadius: '8px', border: '2px solid #dc3545', margin: '1.5rem 0'}}>
  <strong>🚨 CRÍTICO: NO use CUFE en este nodo para Tipo 03</strong><br/>
  En este grupo <strong>NO debe colocar un CUFE</strong> (porque el papel no lo tiene), sino los <strong>datos de la factura de papel</strong> que tiene en la mano.
</div>

Los campos obligatorios son:

#### 1. `number` (cbc:ID) - Número del Papel 🔴 OBLIGATORIO

- **Descripción:** Prefijo y Número de la factura de talonario o papel que le entregó al cliente.
- **Ejemplo:** `"PAPEL-001"`, `"TALONARIO-123"`
- **Regla FAI02:** Es obligatorio informar el ID del documento referenciado.
- **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:ID`

#### 2. `date` (cbc:IssueDate) - Fecha del Papel 🔴 OBLIGATORIO

- **Descripción:** Fecha en la que **generó y entregó** la factura de papel al cliente (NO la fecha de hoy en que está transmitiendo el XML).
- **Formato:** `YYYY-MM-DD`
- **Ejemplo:** `"2025-02-10"`
- **Regla FAI05:** Es obligatorio para facturas tipo 03. La fecha debe corresponder a la fecha de generación de la factura de talonario o papel.
- **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:IssueDate`

#### 3. `code` (cbc:DocumentTypeCode) - Código Interno 🟢 OPCIONAL

- **Descripción:** Código interno o propio de la empresa que identifica que es una referencia a un documento físico.
- **Observación:** Corresponde a una codificación propia de la empresa (NO estandarizada por DIAN).
- **Ejemplos sugeridos:** `"TALONARIO"`, `"PAPEL"`, `"FC"` (Factura Contingencia), `"01"`
- **XPath:** `/Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode`

<div style={{backgroundColor: '#d1ecf1', padding: '1rem', borderRadius: '8px', border: '1px solid #17a2b8', margin: '1rem 0'}}>
  <strong>💡 Recomendación:</strong> Utilice un código alfanumérico que tenga sentido para su control interno. El objetivo es meramente informativo para clasificar internamente qué tipo de documento físico está referenciando el XML.
</div>

### Proceso Correcto de Transmisión - Tipo 03

1. **Expedir factura física:** Cuando tuvo el inconveniente tecnológico, expidió una factura física (talonario o papel) y la entregó al cliente.

2. **Superar el inconveniente:** Una vez restablecido el servicio tecnológico.

3. **Transmitir el XML:** Dentro de las **48 horas siguientes** a la superación del inconveniente, debe transmitir el XML con:
   - `type_document_id = 9` (Tipo 03 en API)
   - `InvoiceTypeCode = "03"` (en el XML)
   - Nodo `AdditionalDocumentReference` con los datos del papel:
     - `number`: Prefijo y número del papel
     - `date`: Fecha del papel
     - `code`: Código interno (ej: "TALONARIO")

4. **Firmar y enviar:** Firme digitalmente el XML y envíelo a la DIAN.

### Ejemplo Completo JSON para Tipo 03

A continuación se muestra un ejemplo completo de una factura de contingencia Tipo 03 con todos los campos obligatorios y opcionales comunes:

```json
{
  "resolution_number": "18764100103754",
  "prefix": "LCON",
  "notes": "Factura de contingencia generada durante inconveniente tecnológico",
  "document_number": "5",
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

**Puntos clave del ejemplo:**

- ✅ `type_document_id: 9` - Factura de Contingencia Tipo 03
- ✅ `additional_document_reference` - **OBLIGATORIO** con datos de la factura de papel:
  - `number`: "LZT2119" - Número de la factura de papel
  - `date`: "2025-08-18" - Fecha en que se generó el papel
  - `code`: "TALONARIO" - Código interno de la empresa
- ✅ **NO incluye `uuid`** - Correcto, el papel no tiene CUFE
- ✅ Todos los campos obligatorios presentes
- ✅ Debe transmitirse dentro de las **48 horas** siguientes a la superación del inconveniente

### Estructura XML Generada

```xml
<Invoice>
  <cbc:InvoiceTypeCode>03</cbc:InvoiceTypeCode>
  <!-- ... otros campos ... -->
  <cac:AdditionalDocumentReference>
    <cbc:ID>PAPEL-001</cbc:ID>
    <cbc:IssueDate>2025-02-10</cbc:IssueDate>
    <cbc:DocumentTypeCode>TALONARIO</cbc:DocumentTypeCode>
  </cac:AdditionalDocumentReference>
</Invoice>
```

### Notas Crédito y Débito para Facturas Tipo 03

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1.5rem 0'}}>
  <strong>⚠️ IMPORTANTE: NO existe "Contingencia" para Notas Crédito/Débito</strong><br/>
  Las notas crédito y débito <strong>NO tienen esquema de contingencia (Tipo 03)</strong>. No puede expedir una nota crédito en papel/talonario y luego transmitirla como "Tipo 03".
</div>

**Proceso correcto:**

1. **Transmitir la factura Tipo 03:** Primero debe transmitir la factura de papel (XML Tipo 03) a la DIAN.

2. **Obtener validación:** La DIAN valida este documento y le asigna un **CUFE**.

3. **Generar Nota Electrónica:** Solo entonces puede generar la Nota Crédito/Débito electrónica estándar, referenciando ese CUFE recién generado.

**Referencia en la Nota:**

Aunque la nota crédito se genera electrónicamente (igual que si fuera para una factura 01), al llenarla debe referenciar la factura de contingencia ya transmitida usando el nodo `billing_reference`:

```json
{
  "type_document_id": 5,
  "billing_reference": {
    "number": "LCON2",
    "date": "2025-02-10",
    "uuid": "[CUFE_ASIGNADO_POR_DIAN_A_LA_FACTURA_TIPO_03]"
  }
}
```

### Comparación: Factura Tipo 01 vs Tipo 03

| Característica                           | Factura Electrónica (Tipo 01)                                | Factura de Contingencia (Tipo 03)                                                            |
| :--------------------------------------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Generación de Nota**                   | Se puede hacer inmediatamente después de validar la factura. | Se debe esperar a superar la contingencia, transmitir la factura 03 y obtener su validación. |
| **Tipo de Nota**                         | Electrónica Estándar.                                        | Electrónica Estándar (No existe Nota tipo 03).                                               |
| **Soporte Legal**                        | El XML validado.                                             | El papel físico hasta que se transmita; luego el XML.                                        |
| **Nodo `additional_document_reference`** | Opcional (para referencias comerciales).                     | **Obligatorio** (datos de la factura de papel).                                              |

### Otros Usos de `additional_document_reference`

Para **otros tipos de documentos** (NO Tipo 03), este grupo es **opcional** y se usa para:

- 📌 Referenciar **órdenes de entrega** (si son múltiples; para una sola usar `order_reference`)
- 🏢 Referenciar **documentos comerciales** a voluntad del facturador electrónico
- 📄 Referenciar **documentos de soporte** (ej: recibos, órdenes, contratos)

**Estructura para referencias comerciales:**

```json
{
  "additional_document_reference": [
    {
      "number": "OC-2025-001",
      "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
      "scheme_name": "CUFE-SHA384",
      "date": "2025-01-15",
      "code": "OC"
    }
  ]
}
```

### Reglas de Validación DIAN

| ID    | Elemento                    | Tipo  | Descripción                                                | Regla                                               | Mensaje de Rechazo                                                            | XPath                                                           |
| ----- | --------------------------- | ----- | ---------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| FAI01 | AdditionalDocumentReference | **R** | Valida que exista grupo de referencia para factura tipo 03 | Solo obligatorio si `InvoiceTypeCode = "03"`        | "El grupo AdditionalDocumentReference no está informado para factura tipo 03" | `/Invoice/cac:AdditionalDocumentReference`                      |
| FAI02 | ID                          | **R** | Prefijo y Número del documento referenciado                | Requerido cuando existe AdditionalDocumentReference | "ID de Documento de referencia no relacionado"                                | `/Invoice/cac:AdditionalDocumentReference/cbc:ID`               |
| FAI05 | IssueDate                   | **R** | Fecha de emisión del documento referenciado                | **Obligatorio para Tipo 03**                        | "No se informó la fecha de emisión del documento referenciado"                | `/Invoice/cac:AdditionalDocumentReference/cbc:IssueDate`        |
| FAI06 | DocumentTypeCode            | **N** | Identificador del tipo de documento de referencia          | Opcional (asignado por facturador)                  | "No está informado el tipo de documento referenciado"                         | `/Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode` |

**Leyenda de Tipo:**

- **R** = Rechazo (campo obligatorio)
- **N** = Notificación (campo opcional, genera advertencia si falta)

### Resumen Ejecutivo

<div style={{backgroundColor: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745', margin: '1.5rem 0'}}>
  <strong>✅ Para Facturas Tipo 03 (Contingencia):</strong>
  <ul>
    <li>El nodo <code>additional_document_reference</code> es <strong>OBLIGATORIO</strong></li>
    <li>Debe contener los datos de la <strong>factura de papel</strong> (número, fecha)</li>
    <li><strong>NO</strong> debe contener CUFE (el papel no lo tiene)</li>
    <li>El <code>code</code> es de asignación libre (ej: "TALONARIO", "PAPEL", "01")</li>
    <li>Debe transmitirse dentro de las <strong>48 horas</strong> siguientes a la superación del inconveniente</li>
  </ul>
</div>

<div style={{backgroundColor: '#d1ecf1', padding: '1.5rem', borderRadius: '8px', border: '2px solid #17a2b8', margin: '1.5rem 0'}}>
  <strong>✅ Para Notas Crédito/Débito de Facturas Tipo 03:</strong>
  <ul>
    <li><strong>NO existe</strong> Nota tipo 03 (contingencia)</li>
    <li>Primero debe transmitir la factura Tipo 03 y obtener su CUFE</li>
    <li>Luego generar la Nota electrónica estándar referenciando ese CUFE en <code>billing_reference</code></li>
  </ul>
</div>

### Referencias DIAN

- **Anexo Técnico:** Factura Electrónica de Venta v1.9
- **Resolución:** No. 000165 (01/NOV/2023)
- **Manuales:** Contingencia de la DIAN
- **Dirección de Gestión de Impuestos**

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

| ID    | Elemento                    | Tipo  | Descripción                                                | Regla                                               | Mensaje de Rechazo                                                                              | XPath                                                           |
| ----- | --------------------------- | ----- | ---------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| FAI01 | AdditionalDocumentReference | **R** | Valida que exista grupo de referencia para factura tipo 03 | Solo obligatorio si `InvoiceTypeCode = "03"`        | "El grupo AdditionalDocumentReference no está informado para factura tipo 03"                   | `/Invoice/cac:AdditionalDocumentReference`                      |
| FAI02 | ID                          | **R** | Prefijo y Número del documento referenciado                | Requerido cuando existe AdditionalDocumentReference | "ID de Documento de referencia no relacionado"                                                  | `/Invoice/cac:AdditionalDocumentReference/cbc:ID`               |
| FAI03 | UUID                        | **R** | CUFE o CUDE del documento referenciado                     | Requerido cuando existe AdditionalDocumentReference | "No fue informado el CUFE o CUDE del documento referenciado"                                    | `/Invoice/cac:AdditionalDocumentReference/cbc:ID/UUID`          |
| FAI04 | @schemeName                 | **N** | Identificador del esquema de identificación                | Debe ser algoritmo permitido                        | "No fue utilizado o informado uno de los algoritmos permitidos para el cálculo del CUFE o CUDE" | `/Invoice/cac:AdditionalDocumentReference/cbc:UUID/@schemeName` |
| FAI05 | IssueDate                   | **N** | Fecha de emisión del documento referenciado                | Opcional                                            | "No se informó la fecha de emisión del documento referenciado"                                  | `/Invoice/cac:AdditionalDocumentReference/cbc:IssueDate`        |
| FAI06 | DocumentTypeCode            | **N** | Identificador del tipo de documento de referencia          | Opcional                                            | "No está informado el tipo de documento referenciado"                                           | `/Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode` |

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

**📊 Notas importantes sobre este ejemplo:**

<div style={{display: 'grid', gap: '0.75rem', margin: '1rem 0'}}>
  <div style={{padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '6px', border: '1px solid #28a745'}}>
    ✅ Todos los campos 🔴 <strong>Obligatorios</strong> están presentes
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #0066cc'}}>
    ✅ Campos 🟢 <strong>Opcionales</strong> se omitieron para simplicidad
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '6px', border: '1px solid #ffc107'}}>
    ✅ Puede extenderse con campos adicionales según necesidad
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#f8d7da', borderRadius: '6px', border: '1px solid #dc3545'}}>
    ⚠️ Para contingencia (tipo 03), debe agregar <a href="#additional_document_reference-referencia-a-documento-adicional"><code>additional_document_reference</code></a>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#f8d7da', borderRadius: '6px', border: '1px solid #dc3545'}}>
    ⚠️ Para POS (tipo 9), debe agregar <a href="#point_of_sale"><code>point_of_sale</code></a>
  </div>
</div>

---

## 🎯 Próximos Pasos

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
  <a href="/docs/use-cases/simple-invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📄</div>
      <strong>Factura Simple</strong><br/>
      <small>Ejemplo práctico paso a paso</small>
    </div>
  </a>
  <a href="/docs/use-cases/export-scenarios" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🌎</div>
      <strong>Exportaciones</strong><br/>
      <small>Facturas internacionales</small>
    </div>
  </a>
  <a href="/docs/endpoints" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔌</div>
      <strong>Endpoints API</strong><br/>
      <small>Referencia completa de endpoints</small>
    </div>
  </a>
  <a href="/docs/use-cases/common-errors" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#f8d7da', borderRadius: '8px', border: '2px solid #dc3545', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚠️</div>
      <strong>Errores Comunes</strong><br/>
      <small>Troubleshooting</small>
    </div>
  </a>
</div>

---

<div style={{backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Última actualización:</strong> Febrero 2026 • 
    📖 <strong>Tipo:</strong> Referencia Técnica Completa • 
    🎯 <strong>Nivel:</strong> ⭐⭐⭐ Avanzado
  </small>
</div>
```
