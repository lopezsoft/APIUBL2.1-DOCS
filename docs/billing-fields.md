---
sidebar_position: 2
sidebar_label: Campos del Request
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

---

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

## 🔧 Referencia de Campos

:::info Guía de Uso
A continuación se describe el uso detallado de cada campo del request body. Los campos están agrupados por función para facilitar la navegación.
:::

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

Se refiere al tipo de operación que afecta al documento. _Este campo es obligatorio_ para todos los documentos y debe ser un entero que corresponda al **ID** de la tabla `operation_types` del API.

:::warning IMPORTANTE
En el API siempre se envía el **ID** (columna izquierda), **NUNCA** el code DIAN. El valor más común es `1` (Estándar).
:::

<details open>
<summary>📄 <strong>Factura Electrónica y Documento Soporte</strong></summary>

| ID (API) | Code DIAN | Tipo de Operación | Uso |
|:--------:|:---------:|-------------------|-----|
| **1** | 10 | Estándar | ✅ Valor por defecto para la mayoría de facturas |
| **2** | 09 | Servicios AIU | Administración, Imprevistos y Utilidad |
| **3** | 11 | Mandatos | Operaciones de mandato ([ver `lines->mandate`](#linesmandato)) |
| **4** | 12 | Transporte | Sector transporte |
| **5** | 14 | Notarios | Sector notarial |
| **6** | 15 | Compra Divisas | Operaciones de compra de divisas |
| **7** | 16 | Venta Divisas | Operaciones de venta de divisas |

</details>

<details>
<summary>📑 <strong>Documento Soporte (Residente / No Residente)</strong></summary>

| ID (API) | Code DIAN | Tipo de Operación | Uso |
|:--------:|:---------:|-------------------|-----|
| **9** | 10 | Residente | Proveedor residente en Colombia |
| **10** | 11 | No Residente | Proveedor no residente — Requiere [`payment_exchange_rate`](#payment_exchange_rate-) |

</details>

<details>
<summary>📝 <strong>Notas de Ajuste (Crédito / Débito)</strong></summary>

| ID (API) | Code DIAN | Tipo de Operación | Uso |
|:--------:|:---------:|-------------------|-----|
| **11** | 20 | Nota ajuste Doc. Equivalente POS | Ajuste al documento equivalente POS |
| **12** | 20 | Nota Crédito → Factura Electrónica | Referencia una factura electrónica existente |
| **13** | 24 | Nota Ajuste → FE Aceptada | Para facturas electrónicas de venta aceptadas |
| **14** | 30 | Nota Débito → Factura Electrónica | Referencia una factura electrónica existente |
| **15** | 22 | Nota Crédito sin referencia FE | Sin referencia a una factura electrónica |
| **16** | 32 | Nota Débito sin referencia FE | Sin referencia a una factura electrónica |

</details>

- #### Ejemplo

  ```json
    "operation_type_id": 1
  ```

### `type_document_id` 🔴

Se refiere al tipo de documento que se está enviando a la DIAN. _Este campo es obligatorio_ para todos los documentos y debe ser un **entero que corresponda al `id` de la tabla `accounting_documents` del API** (NO el `code` DIAN).

:::danger CRÍTICO
En el API **SIEMPRE** se usa el **`id`** de la base de datos (columna izquierda). **NUNCA** el `code` DIAN. Confundir estos valores es el error más común de integración.
:::

:::info Columnas de referencia
- **`id`** → Valor que se envía en `type_document_id`
- **`code`** → Código DIAN (solo referencia normativa)
- **`cufe_algorithm`** → Algoritmo de hash que genera la DIAN para el documento
- **`apply_notes`** → `1` si el documento acepta notas de crédito/débito
:::

<details open>
<summary>📄 <strong>Facturas Electrónicas</strong></summary>

| `id` | `code` | Documento | Algoritmo | Notas | Requisitos especiales |
|:----:|:------:|-----------|:---------:|:-----:|----------------------|
| **7** | 01 | Factura electrónica | CUFE-SHA384 | ✅ | — |
| **8** | 02 | Factura de Exportación | CUFE-SHA384 | ✅ | Requiere [`payment_exchange_rate`](#payment_exchange_rate-) |
| **9** | 03 | Factura por Contingencia Facturador | CUDE-SHA384 | ✅ | ⚠️ Requiere [`additional_document_reference`](#additional_document_reference-referencia-a-documento-adicional) |
| **10** | 04 | Factura por Contingencia DIAN | CUFE-SHA384 | ✅ | — |

</details>

<details open>
<summary>📑 <strong>Documento Soporte</strong></summary>

| `id` | `code` | Documento | Algoritmo | Notas | Requisitos especiales |
|:----:|:------:|-----------|:---------:|:-----:|----------------------|
| **11** | 05 | Documento de Soporte | CUDS-SHA384 | ✅ | Requiere `invoice_period` en cada línea |
| **15** | 95 | Nota de ajuste documento soporte | CUDS-SHA384 | ❌ | Requiere [`billing_reference`](#billing_reference-) |

</details>

<details open>
<summary>🏪 <strong>Documento Equivalente POS</strong></summary>

| `id` | `code` | Documento | Algoritmo | Notas | Requisitos especiales |
|:----:|:------:|-----------|:---------:|:-----:|----------------------|
| **20** | 20 | P.O.S Electrónico | CUDE-SHA384 | ✅ | ⚠️ Requiere [`point_of_sale`](#point_of_sale-) y [`software_manufacturer`](#software_manufacturer-) |
| **93** | 93 | Nota débito P.O.S Electrónico | CUDE-SHA384 | ❌ | Requiere [`billing_reference`](#billing_reference-) |
| **94** | 94 | Nota crédito P.O.S Electrónico | CUDE-SHA384 | ❌ | Requiere [`billing_reference`](#billing_reference-) con `scheme_name` |

</details>

<details>
<summary>📝 <strong>Notas Crédito y Débito</strong></summary>

| `id` | `code` | Documento | Algoritmo | Requisitos especiales |
|:----:|:------:|-----------|:---------:|----------------------|
| **5** | 91 | Nota crédito | CUDE-SHA384 | Requiere [`discrepancy_response`](#discrepancy_response-) y [`billing_reference`](#billing_reference-) |
| **4** | 92 | Nota débito | CUDE-SHA384 | Requiere [`discrepancy_response`](#discrepancy_response-) y [`billing_reference`](#billing_reference-) |

</details>

<details>
<summary>👷 <strong>Nómina Electrónica</strong></summary>

| `id` | `code` | Documento | Algoritmo | Notas |
|:----:|:------:|-----------|:---------:|:-----:|
| **13** | 102 | Documento Soporte Nómina Electrónica | CUNE-SHA384 | ✅ |
| **14** | 103 | Nota de Ajuste Nómina Electrónica | CUNE-SHA384 | ✅ |

</details>

<details>
<summary>🔔 <strong>Eventos y Otros</strong></summary>

| `id` | `code` | Documento | Algoritmo | Descripción |
|:----:|:------:|-----------|:---------:|-------------|
| **12** | 96 | Eventos (ApplicationResponse) | CUDE-SHA384 | Acuse de recibo, aceptación/rechazo |
| **99** | 999 | Attached Document | CUDS-SHA384 | Documento adjunto |

</details>

<details>
<summary>🎫 <strong>Otros Documentos Equivalentes</strong> <small>(próximamente)</small></summary>

| `id` | `code` | Documento | Estado |
|:----:|:------:|-----------|:------:|
| **25** | 25 | Boleta de ingreso a cine | 🔜 Inactivo |
| **27** | 27 | Boleta espectáculos públicos | 🔜 Inactivo |
| **30** | 30 | Juegos localizados y no localizados | 🔜 Inactivo |
| **35** | 35 | Tiquete transporte terrestre de pasajeros | 🔜 Inactivo |
| **40** | 40 | Cobro de peajes | 🔜 Inactivo |
| **45** | 45 | Extracto sociedades financieras y fondos | 🔜 Inactivo |
| **50** | 50 | Tiquete transporte aéreo de pasajeros | 🔜 Inactivo |
| **55** | 55 | Operación bolsa de valores y comodities | 🔜 Inactivo |
| **60** | 60 | Servicios públicos domiciliarios | 🔜 Inactivo |

</details>

- #### Ejemplo

  ```json
    "type_document_id": 7
  ```

**Consultar también:** [Referencia Rápida de Tipos de Documento](#-referencia-rápida-de-tipos-de-documento) | [Glosario: Contingencia](/docs/glossary#contingencia)

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

### `send_to_queue` 🟢

Indicador para enviar el documento a una cola de procesamiento asíncrono. _Este campo es opcional_ y debe ser un entero (`0` o `1`). Cuando es `1`, la API encola el documento y retorna un UUID para consultar el estado posteriormente. Útil en envíos masivos.

- #### Ejemplo

```json
"send_to_queue": 1
```

### `rounding` 🟢

Valor de redondeo aplicado al total del documento. _Este campo es opcional_ y debe ser un string con valor flotante. Se utiliza para ajustar centavos o decimales en el total pagable.

- #### Ejemplo

```json
"rounding": "0.50"
```

### `attachments` 🟢

Arreglo de archivos adjuntos para incluir en el documento (por ejemplo, informes, contratos o soportes adicionales). _Este campo es opcional_ y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"attachments": [
    {
      "content": "base64EncodedContent...",
      "mime": "application/pdf",
      "name": "Soporte.pdf"
    }
  ]
```

- #### Detalle de los campos
  - #### `content`
    Contenido del archivo codificado en base64. _Este campo es obligatorio_ y debe ser un string.
  - #### `mime`
    Tipo MIME del archivo (ej. `application/pdf`, `image/png`). _Este campo es obligatorio_ y debe ser un string.
  - #### `name`
    Nombre del archivo con extensión. _Este campo es obligatorio_ y debe ser un string.

### `invoice_period` 🟢

Periodo de facturación del documento a nivel general (diferente al `invoice_period` dentro de `lines`). _Este campo es opcional_ y debe ser un objeto. Se utiliza principalmente en el sector salud y en documentos soporte.

- #### Ejemplo

```json
"invoice_period": {
    "start_date": "2024-01-01",
    "start_time": "00:00:00",
    "end_date": "2024-01-31",
    "end_time": "23:59:59"
  }
```

- #### Detalle de los campos
  - #### `start_date`
    Fecha de inicio del periodo. Formato `YYYY-MM-DD`.
  - #### `start_time`
    Hora de inicio del periodo. Formato `HH:mm:ss`.
  - #### `end_date`
    Fecha de fin del periodo. Formato `YYYY-MM-DD`.
  - #### `end_time`
    Hora de fin del periodo. Formato `HH:mm:ss`.

### `deliveries` 🟢

Información de entregas o despachos asociados al documento. _Este campo es opcional_ y debe ser un arreglo de objetos. Utilizado para indicar la dirección, fecha y datos de contacto de la entrega de mercancías.

- #### Ejemplo

```json
"deliveries": [
    {
      "address": "Cra 45 #26-85",
      "country_id": "45",
      "date": "2024-03-01",
      "time": "10:00:00",
      "delivery_party": "Transportes XYZ",
      "delivery_contact": "Juan Pérez"
    }
  ]
```

- #### Detalle de los campos
  - #### `address`
    Dirección de entrega. _Este campo es obligatorio_ y debe ser un string.
  - #### `country_id`
    País de entrega. _Este campo es opcional_, por defecto `"45"` (Colombia).
  - #### `date`
    Fecha de entrega. Formato `YYYY-MM-DD`.
  - #### `time`
    Hora de entrega. Formato `HH:mm:ss`.
  - #### `delivery_party`
    Nombre de la empresa o persona responsable de la entrega. _Este campo es opcional_ y debe ser un string.
  - #### `delivery_contact`
    Nombre de contacto de la entrega. _Este campo es opcional_ y debe ser un string.

### `delivery_terms` 🟢

Términos de entrega o condiciones INCOTERM del documento. _Este campo es opcional_ y debe ser un objeto. Aplicable en facturas de exportación o cuando se negocian condiciones de entrega.

- #### Ejemplo

```json
"delivery_terms": {
    "delivery_id": "1",
    "terms": "FOB"
  }
```

- #### Detalle de los campos
  - #### `delivery_id`
    ID de la condición de entrega. Puede consultar las diferentes condiciones en el **ENDPOINT** `{{url}}/delivery-conditions`.
  - #### `terms`
    Texto descriptivo de los términos de entrega. _Este campo es opcional_ y debe ser un string.

### `despatch_document_references` 🟢

Referencias a documentos de despacho asociados al documento electrónico. _Este campo es opcional_ y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"despatch_document_references": [
    {
      "number": "DESP-001",
      "date": "2024-02-28"
    }
  ]
```

- #### Detalle de los campos
  - #### `number`
    Número del documento de despacho referenciado. _Obligatorio_ y debe ser un string.
  - #### `date`
    Fecha del documento de despacho. Formato `YYYY-MM-DD`.

### `receipt_document_references` 🟢

Referencias a documentos de recepción asociados al documento electrónico. _Este campo es opcional_ y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"receipt_document_references": [
    {
      "number": "REC-001",
      "date": "2024-03-01"
    }
  ]
```

- #### Detalle de los campos
  - #### `number`
    Número del documento de recepción referenciado. _Obligatorio_ y debe ser un string.
  - #### `date`
    Fecha del documento de recepción. Formato `YYYY-MM-DD`.

### `showroomInformation` 🟢

Información de la sala de ventas o punto de exhibición. _Este campo es opcional_ y debe ser un objeto. Utilizado cuando la venta se realiza en una ubicación diferente a la sede principal.

- #### Ejemplo

```json
"showroomInformation": {
    "showroom": "Sala de Ventas Norte",
    "showroomAddress": "Cra 15 #100-45 Local 201",
    "dataShow": "Información adicional de la sala"
  }
```

### `prepaid_payments` 🟢

Información de anticipos recibidos que se deben descontar del total a pagar del documento. _Este campo es opcional_ y debe ser un objeto.

- #### Ejemplo

```json
"prepaid_payments": {
    "id": "SFR3123856",
    "paid_amount": "10.00",
    "received_date": "2018-09-29",
    "paid_date": "2018-09-29",
    "instruction_id": "Prepago recibido"
  }
```

- #### Detalle de los campos
  - #### `id`
    Identificador del anticipo o prepago. _Este campo es obligatorio_ y debe ser un string.
  - #### `paid_amount`
    Monto del anticipo pagado. _Este campo es obligatorio_ y debe ser un string con valor flotante de máximo dos decimales.
  - #### `received_date`
    Fecha en que se recibió el anticipo. _Este campo es obligatorio_ y debe ser un string en formato `YYYY-MM-DD`.
  - #### `paid_date`
    Fecha en que se realizó el pago del anticipo. _Este campo es obligatorio_ y debe ser un string en formato `YYYY-MM-DD`.
  - #### `instruction_id`
    Descripción o instrucción del prepago. _Este campo es opcional_ y debe ser un string.

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
  - #### `duration_measure`
    Duración de la medida del pago en días. _Este campo es opcional_ y se utiliza para indicar la duración del periodo de pago a crédito. Debe ser un string.

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
  - #### `cashier_title`
    Título o etiqueta que se muestra debajo de la firma del cajero en la representación gráfica. _Este campo es opcional_ y debe ser un string.
  - #### `seller`
    Nombre del vendedor(a). _Este campo es opcional_ y debe ser un string.
  - #### `seller_title`
    Título o etiqueta que se muestra debajo de la firma del vendedor en la representación gráfica. _Este campo es opcional_ y debe ser un string.

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
  - #### `extra_data`: **NEW**
    Grupo de campos para información adicional del cliente. _Este campo es opcional_ y debe ser un arreglo de objetos.
    Esta información adicional se mostrará en la representación gráfica del documento y no se enviará a la DIAN.

    ```json
    "extra_data": [
      {
        "title": "No. Socio",
        "value": "78-54121-454"
      },
      {
        "title": "FECHA DE VINCULACIÓN",
        "value": "02/02/2026"
      }
    ]
    ```

    - #### `title`
      Título del campo adicional. _Este campo es obligatorio_ y debe ser un string.
    - #### `value`
      Valor del campo adicional. _Este campo es obligatorio_ y debe ser un string.

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
  - #### `multiplier_factor_numeric`
    Factor numérico multiplicador para el cálculo del descuento o cargo (porcentaje expresado como decimal, ej. `10.00` para un 10%). _Este campo es opcional_ y debe ser un string.

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
  - #### `allowance_total_amount`
    Valor total de los descuentos aplicados al documento. _Este campo es opcional_ y debe ser un string con valor flotante de máximo dos decimales. Alternativa detallada a `total_allowance`.
  - #### `charge_total_amount`
    Valor total de los cargos aplicados al documento. _Este campo es opcional_ y debe ser un string con valor flotante de máximo dos decimales. Alternativa detallada a `total_charges`.
  - #### `pre_paid_amount`
    Valor total de los anticipos o prepagos que se descuentan del total del documento. _Este campo es opcional_ y debe ser un string con valor flotante de máximo dos decimales.

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
- #### `brand_name`
  Nombre de la marca del producto. _Este campo es opcional_ y debe ser un string. Se mostrará en la representación gráfica del documento.
- #### `model_name`
  Nombre del modelo del producto. _Este campo es opcional_ y debe ser un string.
- #### `sellers_item_identification`
  Identificación del artículo por parte del vendedor (código interno alterno). _Este campo es opcional_ y debe ser un string.
- #### `pack_size_numeric`
  Número de unidades por paquete o empaque. _Este campo es opcional_ y debe ser un string.
- #### `notes`
  Notas adicionales a nivel de la línea del documento. _Este campo es opcional_ y puede ser un string o un arreglo de strings.
- #### `um` / `mu` / `unit_measure_code`
  Código o descripción textual de la unidad de medida del ítem. _Estos campos son opcionales_ y deben ser strings. Son alternativos a `quantity_units_id` para mostrar la unidad en la representación gráfica.

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

Grupo de campos para información relacionada con todos los impuestos de la línea. _Este campo es obligatorio_ solo cuando la línea tiene impuestos y debe ser un arreglo de objetos.

La estructura del objeto varía según el **tipo de tributo**: porcentual (ej. IVA) o **nominal/valor fijo por unidad** (ej. Código `18`, INC Bolsas - Código `22`, etc.).

- #### Ejemplo (Impuesto Porcentual — IVA, Código `01`)

```json
"tax_totals": [
    {
        "tax_id": "1",
        "tax_amount": 294.633000,
        "taxable_amount": 1550.700000,
        "percent": 19
    }
]
```

- #### Ejemplo (Impuesto Nominal — Código `32`)

:::warning Reglas DIAN para impuestos nominales
La DIAN valida **matemáticamente** que `tax_amount = per_unit_amount × base_unit_measure`. Los campos `percent` y `taxable_amount` **deben enviarse con valor `0`** para este tipo de tributo. La regla de validación es `FAX07` (línea) / `FAS07` (cabecera).
:::

```json
"tax_totals": [
    {
        "tax_id": "18",
        "tax_amount": 387.675000,
        "taxable_amount": 0,
        "percent": 0,
        "per_unit_amount": 387.675000,
        "base_unit_measure": 1,
        "quantity_units_id": 70
    }
]
```

> **Cálculo:** `387.675 × 1 = 387.675` (debe ser matemáticamente exacto). El valor de `quantity_units_id` debe corresponder al código numérico de la unidad de medida en el catálogo DIAN.

- #### Detalle de los campos
  - #### `tax_id`
    ID del impuesto. _Este campo es obligatorio_ y debe ser un string.
  - #### `tax_amount`
    Monto o valor total del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
    - Para impuestos porcentuales: resultado de `taxable_amount × percent / 100`.
    - Para impuestos nominales: resultado exacto de `per_unit_amount × base_unit_measure`.
  - #### `taxable_amount`
    Base gravable del impuesto. _Este campo es obligatorio_ y debe ser un número flotante.
    - Para impuestos porcentuales: valor sobre el que se aplica el porcentaje.
    - Para impuestos nominales: **debe enviarse como `0`**.
  - #### `percent`
    Porcentaje del impuesto. _Este campo es obligatorio_ y debe ser un número.
    - Para impuestos porcentuales: valor del porcentaje (ej. `19` para IVA del 19%).
    - Para impuestos nominales: **debe enviarse como `0`**.
  - #### `per_unit_amount`
    Valor monetario fijo del tributo por cada unidad de medida física. Obligatorio para impuestos nominales. Debe ser un número flotante con máximo dos decimales.
  - #### `base_unit_measure`
    Cantidad de unidades físicas sujetas al impuesto. Obligatorio para impuestos nominales. Debe ser un número flotante.
  - #### `quantity_units_id`
    Código numérico de la unidad de medida del catálogo DIAN para `base_unit_measure`. Obligatorio para impuestos nominales. Debe ser un número entero.

### `tax_totals` 🔴

Arreglo que contiene la suma de todos los impuestos del documento, agrupados por tipo de impuesto. _Este campo es obligatorio_ solo cuando el documento tiene impuestos.

La estructura del objeto dentro de este arreglo varía según el **tipo de tributo**: porcentual (ej. IVA) o **nominal/valor fijo por unidad** (ej. Código `18`, INC Bolsas - Código `22`, INCarbono, INCombustibles).

- #### Ejemplo completo (Porcentual + Nominal)

:::warning Reglas DIAN para impuestos nominales
La DIAN valida **matemáticamente** que `tax_amount = per_unit_amount × base_unit_measure`. Los campos `percent` y `taxable_amount` **deben enviarse con valor `0`** para impuestos nominales.

- Regla a nivel de línea: **`FAX07`** (Factura) / **`DEAX07`** (Doc. Equivalente).
- Regla a nivel global: **`FAS07`** (Factura) / **`DEAS07`** (Doc. Equivalente).
:::

```json
"tax_totals": [
    {
        "tax_id": "1",
        "tax_amount": 294.633000,
        "taxable_amount": 1550.700000,
        "percent": 19
    },
    {
        "tax_id": "18",
        "tax_amount": 387.675000,
        "per_unit_amount": 387.675000,
        "base_unit_measure": 1,
        "quantity_units_id": 70,
        "taxable_amount": 0,
        "percent": 0
    }
]
```

> **Cálculo entrada nominal:** `387.675 × 1 = 387.675`. La multiplicación debe ser matemáticamente exacta y consistente con la suma de los valores de línea para no detonar la regla de descuadre general.

- #### Detalle de los campos
  - #### `tax_id`
    - ID del impuesto. _Este campo es obligatorio_ y debe ser un string.
    - Este campo agrupa todos los impuestos que tengan el mismo ID.
  - #### `tax_amount`
    - Monto o valor total del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
    - Este campo agrupa la suma del monto o valor total de todos los impuestos que tengan el mismo ID.
    - Para impuestos nominales: resultado exacto de `per_unit_amount × base_unit_measure`.
  - #### `taxable_amount`
    - Base gravable del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
    - Para impuestos porcentuales: valor sobre el que se aplica el porcentaje.
    - Para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24, 18** y similares): **debe enviarse como `0`**.
  - #### `percent`
    - Porcentaje del impuesto. _Este campo es obligatorio_ y debe ser un número.
    - Para impuestos porcentuales (ej: IVA - Código `01`): valor del porcentaje (ej. `19`).
    - Para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24, 18** y similares): **debe enviarse como `0`**.

  - ### `quantity_units_id`
    - Código **numérico** de la unidad de medida base del catálogo DIAN sobre la cual se aplica la tarifa fija del tributo.
    - Obligatorio para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24, 18** y similares).
    - Debe ser un número entero (ej. `886` para NIU - Unidad en INC Bolsas; `821` para la unidad de medida en el código `18`).

  - ### `per_unit_amount`
    - Tarifa o valor monetario fijo del tributo por cada unidad de medida física. Obligatorio para impuestos nominales (**códigos 21, 22, 23, 24, 18** y similares).
    - Debe ser un número flotante con máximo dos decimales (ej. `39.16` para código `18`; `70.00` para INC Bolsas 2025).

  - ### `base_unit_measure`
    - Cantidad de unidades físicas sujetas al impuesto. Obligatorio para impuestos nominales (**códigos 21, 22, 23, 24, 18** y similares).
    - Para INC Bolsas su valor es generalmente `1`; para otros nominales corresponde al total de unidades físicas del ítem (ej. `9.90` para código `18`).
    - Debe ser un número flotante.

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

<details>
<summary>📋 Click para ver/ocultar el ejemplo completo de Factura de Contingencia Tipo 03</summary>

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

</details>

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
