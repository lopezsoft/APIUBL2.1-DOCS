---
slug: version-3-9-2-consorciados-notas-nomina
title: "Version 3.9.2 - Consorciados (shareholders), cbc:Note en notas y ajustes de nómina"
authors: [lewis]
tags: [release, v3-9-2, facturacion, consorciados, notas, nomina]
---

La versión **3.9.2** incorpora el arreglo `shareholders` para reportar los partícipes de un Consorcio o Unión Temporal en el bloque del emisor, añade soporte de `cbc:Note` de encabezado y de línea en las notas crédito y débito (incluidas las de POS) y unifica el comportamiento de la nómina electrónica.

<!--truncate-->

### 1. Consorciados (`shareholders`)

Cuando quien factura opera bajo un **Consorcio o Unión Temporal**, ahora puedes enviar el arreglo `shareholders` en la raíz del JSON del documento. Esto genera el grupo `cac:ShareholderParty` dentro del nodo del **emisor** (`AccountingSupplierParty / Party`), sin tocar los datos del adquiriente (`customer`), y se conserva automáticamente al reenviar el documento con `POST /documents/{uuid}/resend`.

```json
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
]
```

| Campo | Tipo | Requerido | Descripción |
|---|:---:|:---:|---|
| `dni` | string | **Sí** | NIT del consorciado sin dígito de verificación (sin duplicados en el arreglo). |
| `dv` | string / int | Opcional | Dígito de verificación (módulo 11 DIAN). Si se envía, se valida contra `dni`; si se omite, se calcula automáticamente. |
| `company_name` | string | **Sí** | Razón social o nombre completo del consorciado. |
| `tax_level_id` | int | **Sí** | Responsabilidad fiscal (`1`: `O-13`, `2`: `O-15`, `3`: `O-23`, `4`: `O-47`, `5`: `R-99-PN`). |
| `tax_regime_id` | int | **Sí** | Régimen tributario (`1`: Responsable de IVA `48`, `2`: No responsable de IVA `49`). |
| `participation_percent` | number | **Sí** | Porcentaje de participación del consorciado. |

:::warning Validaciones (HTTP 422)
- **Dígito de verificación (`dv`):** debe corresponder al cálculo módulo 11 de la DIAN para el `dni`.
- **Sin NITs repetidos:** no pueden enviarse dos consorciados con el mismo `dni` en `shareholders`.
- **Suma de porcentajes = 100:** la suma de `participation_percent` de todos los partícipes debe ser exactamente `100`.
:::

[Ver referencia de `shareholders`](/docs/billing-fields/#shareholders) · [Ver ejemplo completo de Factura Consorciados](/docs/jsons-billing/shareholders-invoice/)

---

### 2. Notas (`cbc:Note` de encabezado y de línea)

Las notas crédito y débito —incluidas las de **POS electrónico** (`type_document_id: 5, 4, 94, 93`)— ahora incluyen en el XML tanto la nota de encabezado (`notes` en la raíz) como las notas de cada ítem (`lines[].notes` dentro de `CreditNoteLine` / `DebitNoteLine`). Además se unificó en la documentación el nombre del campo de línea en `notes`.

[Nota Crédito](/docs/jsons-billing/credit-note/) · [Nota Débito](/docs/jsons-billing/debit-note/) · [Nota Crédito POS](/docs/jsons-pos/pos-credit-note/) · [Nota Débito POS](/docs/jsons-pos/pos-debit-note/)

---

### 3. Nómina electrónica y `time_worked`

- **Eliminación de nómina en habilitación (`POST /ep/payroll/delete`):** se retiró el atajo de habilitación para que la respuesta en ambiente de pruebas tenga **exactamente la misma estructura que en producción** (`uuid`, `message`, `send_to_queue`, `XmlDocumentKey`, `response`, `XmlBase64Bytes`, `AttachedDocument`, `qr`, `pdf`, `warnings`, `success`), igual que en `POST /ep/payroll`.
- **`period.time_worked`:** valida mínimo `1` (`min:1`) **sin tope superior** para reflejar el tiempo total laborado del trabajador en la empresa (en días).
- **Documentación de reemplazo de nómina:** se corrigió la descripción de la nota de reemplazo (`replacing_predecessor`) y el nombre del campo `deductions_total`.

[Ver Nómina Electrónica](/docs/endpoints/payroll/) · [Campos de Nómina](/docs/payroll/payroll-fields/) · [Nómina de Reemplazo](/docs/payroll/payroll-replace/)
