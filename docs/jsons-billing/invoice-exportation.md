---
sidebar_position: 19
sidebar_label: Factura Exportación (USD)
description: "Ejemplo de JSON avanzado para una factura de exportación en USD con Incoterms, remisiones, datos de entrega y transportadora."
---

# ✈️ Factura de Exportación (USD)

Una **Factura de Exportación Avanzada** incluye información logística de alto valor requerida habitualmente en el comercio internacional. 

Este ejemplo ilustra cómo emitir una factura de exportación en dólares (USD) reportando **Términos de Entrega (Incoterms)**, información detallada del **Transportador y Entrega**, y referencias a **Remisiones y Órdenes de Pedido**, además de metadatos del artículo en las líneas (como lote y fecha de expiración).

---

## 💡 Reglas Técnicas y Logísticas

:::tip ⚠️ Características Avanzadas del Payload
* **Incoterms (`delivery_terms`):** Términos comerciales internacionales (ej. *Portes Pagados*, *FOB*, *CIF*). Permite definir responsabilidades de costo y riesgo.
* **Datos de Entrega (`deliveries`):** Obligatorio en operaciones logísticas complejas. Registra la fecha de despacho, dirección en el extranjero, datos del transportista y su contacto.
* **Trazabilidad (`document_references`):** Permite vincular remisiones de salida (`despatch`), recepciones (`receipt`) y la orden de compra (`order_reference`).
* **Metadatos de Línea (`extra_data`):** Permite imprimir información específica de control sanitario o de inventario en el PDF (como número de **Lote** y **Fecha de Expiración**).
* **Tasa de Cambio:** Se reporta la conversión a pesos colombianos (COP). *Nota: Se ha removido el campo obsoleto `base_rate` quedando únicamente la TRM en `exchange_rate`.*
:::

---

## 📋 Diccionario de Módulos Logísticos

| Módulo JSON | Propósito Técnico | Elementos Clave |
|-------------|-------------------|-----------------|
| **`delivery_terms`** | Define los términos de entrega (Incoterms). | `terms` (glosa), `delivery_id` (código oficial). |
| **`deliveries`** | Contenedor físico del despacho y transporte. | `date`, `address`, `country_id` (lugar de entrega). |
| ↳ `delivery_party` | Datos fiscales de la empresa transportadora. | `company_name`, `dni`, `address`, `city_id`. |
| ↳ `delivery_contact` | Persona de contacto del transporte para notificaciones.| `email`, `mobile`, `contact_name`. |
| **`despatch_document_references`** | Vincula documentos de despacho previo (Remisión). | `number` (folio remisión), `date` (fecha). |
| **`receipt_document_references`** | Vincula actas o documentos de recibo de mercancía. | `number`, `date`. |
| **`order_reference`** | Asocia la orden de pedido / orden de compra internacional. | `reference_number`, `reference_date`. |
| **`extra_data`** *(en línea)* | Datos de impresión dinámica en la línea del documento. | `title` (ej. LOTE), `value`, `align` (alineación PDF). |

---

## 📦 Estructura del JSON (Payload Completo)

A continuación, se detalla el JSON avanzado estructurado para el envío a la API de Matias:

<details open>
<summary>📦 Ver JSON de Exportación Avanzada (USD)</summary>

```json title="invoice_usd_exportation_advanced.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "5947",
  "operation_type_id": 1,
  "type_document_id": 8,
  "currency_id": 272,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 42,
      "value_paid": "4243.80"
    }
  ],
  "payment_exchange_rate": {
    "exchange_rate": "4243.80",
    "rate_date": "2025-05-05",
    "currency_id": 188
  },
  "delivery_terms": {
    "terms": "Portes Pagados",
    "delivery_id": 1
  },
  "despatch_document_references": [
    {
      "number": "8124167214 DA",
      "date": "2026-05-21"
    }
  ],
  "receipt_document_references": [
    {
      "number": "12314129 GR",
      "date": "2026-05-21"
    }
  ],
  "order_reference": {
    "reference_number": "4541212",
    "reference_date": "2025-06-01"
  },
  "deliveries": [
    {
      "date": "2026-05-21",
      "time": "14:00:00",
      "address": "NORTE DE VIRGINIA H10",
      "country_id": "239",
      "delivery_party": {
        "identity_document_id": "10",
        "type_organization_id": 1,
        "tax_regime_id": 2,
        "tax_level_id": "5",
        "company_name": "Nombre de la empresa transportadora",
        "address": "cra prueba",
        "dni": "1019016005",
        "country_id": "45",
        "city_id": "149",
        "postal_code": "110121",
        "merchant_registration": "12454"
      },
      "delivery_contact": {
        "email": "empresatransport@gmail.com",
        "mobile": "3164444444",
        "contact_name": "Nombre del contacto",
        "note": "Nota adicional de contacto"
      }
    }
  ],
  "lines": [
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "UNI",
      "line_extension_amount": "4243.80",
      "free_of_charge_indicator": false,
      "description": "HONORARIOS REPRESENTACION LEGAL ECUADOR",
      "code": "999-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "4243.80",
      "base_quantity": 1.00,
      "brand_name": "Nombre de la marca",
      "model_name": "Modelo del articulo",
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
    }
  ],
  "customer": {
    "country_id": "239",
    "identity_document_id": "10",
    "type_organization_id": 1,
    "company_name": "AMAZON",
    "dni": "444444055",
    "address": "NORTE DE VIRGINIA H10",
    "city_name": "VIRGINIA",
    "postal_code": "110121"
  },
  "legal_monetary_totals": {
    "line_extension_amount": "4243.80",
    "tax_exclusive_amount": "0",
    "tax_inclusive_amount": "4243.80",
    "payable_amount": 4243.80
  }
}
```
</details>

---

## 📊 Reglas de Validación DIAN
- [ ] **Tipo de Factura:** El campo `type_document_id` debe ser `8`.
- [ ] **TRM Reportada:** El campo `exchange_rate` dentro de `payment_exchange_rate` debe contener la tasa oficial. *(Nota: Recuerde no enviar `base_rate` ya que está en desuso)*.
- [ ] **Incoterms Oficiales:** El código `delivery_id` en `delivery_terms` debe corresponder a la tabla paramétrica oficial DIAN.
- [ ] **Líneas Libres de IVA:** Al ser una exportación, la línea no debe contener nodos de impuestos ni totales de IVA.
