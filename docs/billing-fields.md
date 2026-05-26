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

Número de resolución de facturación asignado por la DIAN. Debe coincidir exactamente con el valor configurado en el portal web del proveedor tecnológico. _Este campo es obligatorio_ para todos los documentos y debe ser un string.

### `prefix` 🟡

Prefijo asociado a la resolución de facturación. Identifica la serie o rango del documento (ej. `"FEV"`, `"NC"`, `"DS"`). _Este campo es condicional_: obligatorio cuando la resolución tiene prefijo configurado. Debe ser un string.

### `date` 🟢

Fecha de emisión del documento. _Este campo es opcional_. Si no se envía, la API asigna la **fecha actual del servidor**. Debe ser un string en formato **`YYYY-MM-DD`** (ej. `"2025-05-25"`).

### `expiration_date` 🟢

Fecha de vencimiento del documento. _Este campo es opcional_ y debe ser un string en formato **`YYYY-MM-DD`**. Se utiliza principalmente en documentos equivalentes electrónicos y debe corresponder con las fechas negociadas o acordadas de pago.

### `time` 🟢

Hora de emisión del documento. _Este campo es opcional_. Si no se envía, la API asigna la **hora actual del servidor**. Debe ser un string en formato **`HH:mm:ss`** (ej. `"14:30:00"`).

### `notes` 🟢

Notas u observaciones adicionales del documento. Se imprime en la representación gráfica (PDF). _Este campo es opcional_ y debe ser un string. Acepta texto libre de cualquier longitud.

### `document_number` 🔴

Número consecutivo del documento **sin prefijo**. _Este campo es obligatorio_ para todos los documentos. Debe ser un string numérico (ej. `"990000001"`). Este número debe estar dentro del rango autorizado por la resolución DIAN vigente.

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
| **3** | 11 | Mandatos | Operaciones de mandato ([ver `lines->mandate`](#lines-mandate)) |
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

Indicador para solicitar que la API genere el **PDF de representación gráfica** del documento. _Este campo es opcional_. Enviar `1` para generar el PDF, `0` o no enviar si no se requiere. Debe ser un entero.

- #### Ejemplo

  ```json
    "graphic_representation": 1
  ```

### `send_email` 🟢

Indicador para solicitar que la API **envíe automáticamente por email** el documento al cliente (al correo definido en `customer.email`). _Este campo es opcional_. Enviar `1` para enviar, `0` o no enviar si no se requiere. Debe ser un entero.

- #### Ejemplo

```json
"send_email": 1
```

### `currency_id` 🟢

ID de la moneda del documento (`cbc:DocumentCurrencyCode`). _Este campo es opcional_: si no se envía, la API asume **Peso Colombiano (COP)** (`id: 272`). Solo se debe enviar cuando el documento está en moneda extranjera. Debe ser un entero.

:::warning Importante
La moneda debe estar **habilitada en su cuenta** del proveedor tecnológico. Si envía un `currency_id` de una moneda no configurada en su cuenta, el API rechazará el documento. Consulte las monedas disponibles en el **ENDPOINT** `{{url}}/currencies`.
:::

<details open>
<summary>💱 <strong>Monedas activas</strong></summary>

| `id` | ISO | Moneda | Símbolo |
|:----:|:---:|--------|:-------:|
| **272** | COP | Peso Colombiano _(predeterminado)_ | $ |
| **188** | USD | Dólar Americano | $ |
| **213** | EUR | Euro | € |
| **277** | MXN | Peso Mexicano | $ |
| **270** | ARS | Peso Argentino | $ |
| **271** | CLP | Peso Chileno | $ |
| **194** | CAD | Dólar Canadiense | $ |
| **266** | PEN | Nuevo Sol (Perú) | S |
| **278** | UYU | Peso Uruguayo | $ |
| **274** | DOP | Peso Dominicano | R |
| **273** | CUP | Peso Cubano | $ |
| **225** | PYG | Guaraní (Paraguay) | ₲ |
| **165** | BOB | Boliviano (Bolivia) | B |
| **164** | VEF | Bolívar Fuerte (Venezuela) | B |
| **168** | CRC | Colón Costarricense | ₡ |
| **169** | SVC | Colón Salvadoreño | ₡ |
| **195** | GYD | Dólar de Guyana | G |

</details>

- #### Ejemplo

```json
"currency_id": 188
```


### `send_to_queue` 🟢

:::caution NO IMPLEMENTADO
Este campo **aún no está disponible** en la versión actual de la API. Se documenta como referencia para futuras versiones. No lo envíe en el request body, será ignorado.
:::

Indicador para enviar el documento a una cola de procesamiento asíncrono. Cuando esté disponible, al enviar `1` la API encolará el documento y retornará un UUID para consultar el estado posteriormente. Será útil en envíos masivos.

### `rounding` 🟢

Valor de redondeo aplicado al total del documento (`cbc:PayableRoundingAmount`). _Este campo es opcional_ y debe ser un string con valor flotante. Se utiliza principalmente en **Nómina Electrónica** para ajustar centavos o decimales en el total pagable.

:::info Uso principal
Este campo aplica para documentos de **Nómina Electrónica** (`type_document_id: 13, 14`). En facturación electrónica estándar generalmente no se requiere.
:::

### `attachments`: **NEW**

Archivos adjuntos opcionales cargados y vinculados al documento (máximo 4 archivos, almacenados de forma segura en Amazon S3). _Este campo es opcional (nullable)_ y debe ser un arreglo de objetos con los siguientes campos:

- #### Ejemplo

```json
"attachments": [
  {
    "filename": "Soporte.pdf",
    "content": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago...",
    "content_type": "application/pdf"
  }
]
```

- #### Detalle de los campos de cada archivo adjunto:

  - #### `filename`
    Nombre del archivo adjunto con su extensión. **Obligatorio si se envía el arreglo `attachments`**.
    * **Tipo:** `string`
    * **Longitud Máxima:** 255 caracteres
    * **Regla de Validación:** `required_with:attachments|string|max:255`

  - #### `content`
    Contenido del archivo codificado en base64. **Obligatorio si se envía el arreglo `attachments`**.
    * **Tipo:** `string` (Base64)
    * **Regla de Validación:** `required_with:attachments|string`

  - #### `content_type`
    Tipo de contenido MIME del archivo (ej. `application/pdf`, `image/png`). _Este campo es opcional (nullable)_.
    * **Tipo:** `string`
    * **Longitud Máxima:** 100 caracteres
    * **Regla de Validación:** `nullable|string|max:100`

### `invoice_period` 🟢

Periodo de facturación del documento a nivel general (`cac:InvoicePeriod`). Diferente al `invoice_period` dentro de `lines`. _Este campo es opcional_ y debe ser un objeto.

:::tip ¿Cuándo se usa?
- **Documento Soporte** (`type_document_id: 11`): para indicar el periodo de prestación del servicio.
- **Sector Salud**: periodo de facturación del servicio médico.
- **Notas Crédito/Débito sin referencia a factura** (`operation_type_id: 15, 16`): obligatorio para indicar el periodo que cubre la nota.
:::

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

### `deliveries`: **NEW**

Grupo de información de la entrega de bienes o prestación de servicios (`cac:Delivery`). _Este campo es opcional_ y debe ser un arreglo de objetos. Permite informar la dirección, fecha, transportador y contacto de la entrega física de mercancías.

<details>
<summary>📦 <strong>Ejemplo JSON completo</strong></summary>

```json
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
  ]
```

</details>

<details open>
<summary>📍 <strong>Campos del delivery</strong> — Lugar y fecha de entrega</summary>

| Campo | Tipo | Requerido | XPath UBL | Descripción |
|-------|:----:|:---------:|-----------|-------------|
| `date` | string | Opcional | `cbc:ActualDeliveryDate` | Fecha real o estimada de entrega. Formato `YYYY-MM-DD` |
| `time` | string | Opcional | `cbc:ActualDeliveryTime` | Hora real o estimada de entrega. Formato `HH:mm:ss` |
| `address` | string | **Sí** | `cac:DeliveryAddress` | Dirección del lugar de entrega |
| `country_id` | string | Opcional | `cac:Country` | ID del país de entrega. Por defecto `"45"` (Colombia). **Endpoint:** `{{url}}/countries` |
| `city_id` | string | ⚠️ Condicional | `cac:DeliveryAddress` | Ciudad/municipio de entrega. **Obligatorio si `country_id = "45"` (Colombia)**. **Endpoint:** `{{url}}/cities` |
| `postal_code` | string | ⚠️ Condicional | `cac:DeliveryAddress` | Código postal de entrega. **Obligatorio si `country_id = "45"` (Colombia)** |

:::warning Entregas en Colombia
Cuando el país de entrega es **Colombia** (`country_id: "45"`), los campos `city_id` y `postal_code` son **obligatorios**. La DIAN rechazará el documento si no se informan.
:::

</details>

<details>
<summary>🏢 <strong>delivery_party</strong> — Transportador o parte que entrega</summary>

Información fiscal y de identificación del transportador (`cac:DeliveryParty`). _Opcional_.

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `identity_document_id` | string | **Sí** | Tipo de documento de identidad. **Endpoint:** `{{url}}/identity-documents` |
| `type_organization_id` | int | **Sí** | `1` = Persona Jurídica, `2` = Persona Natural |
| `company_name` | string | **Sí** | Razón social o nombre completo del transportador |
| `dni` | string | **Sí** | Número de identificación sin dígito de verificación |
| `tax_regime_id` | int | Opcional | Régimen fiscal. Por defecto `2` (No responsable de IVA). **Endpoint:** `{{url}}/accounting-regime` |
| `tax_level_id` | string | Opcional | Responsabilidad tributaria. Por defecto `"5"` (No aplica). **Endpoint:** `{{url}}/fiscal-regime` |
| `address` | string | Opcional | Dirección fiscal del transportador |
| `country_id` | string | Opcional | País del transportador. Por defecto `"45"` (Colombia) |
| `city_id` | string | ⚠️ Condicional | Ciudad/municipio. **Obligatorio si `country_id = "45"`**. **Endpoint:** `{{url}}/cities` |
| `postal_code` | string | ⚠️ Condicional | Código postal. **Obligatorio si `country_id = "45"`**. Por defecto `"000000"` |
| `merchant_registration` | string | Opcional | Matrícula mercantil (`cbc:CorporateRegistrationScheme`) |

</details>

<details>
<summary>👤 <strong>delivery_contact</strong> — Contacto de la entrega</summary>

Persona responsable de recibir o coordinar la entrega (`cac:Contact`). _Opcional_.

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `contact_name` | string | Opcional | Nombre de la persona de contacto |
| `email` | string | Opcional | Correo electrónico de contacto |
| `mobile` | string | Opcional | Teléfono o celular de contacto |
| `note` | string | Opcional | Nota adicional sobre la entrega |

</details>

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

:::caution NO IMPLEMENTADO
Este campo **aún no está disponible** en la versión actual de la API. Se documenta como referencia para futuras versiones. No lo envíe en el request body, será ignorado.
:::

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

Información de los pagos del documento. Define el método (contado/crédito), medio de pago y valor. Permite múltiples pagos. _Este campo es obligatorio_ para todos los documentos y debe ser un arreglo de objetos.

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
    Método de pago: **`1`** = Contado, **`2`** = Crédito. _Este campo es obligatorio_ y debe ser un entero.
  - #### `means_payment_id`
    Medio de pago (ej. `10` = Efectivo, `42` = Consignación bancaria, `47` = Transferencia). _Este campo es obligatorio_ y debe ser un entero.
    Puede consultar todos los medios de pago disponibles en el **ENDPOINT** `{{url}}/payment-means`.
  - #### `value_paid`
    Valor pagado. _Este campo es obligatorio_ para todos los documentos y debe ser un número flotante con máximo dos decimales, encerrado entre `""`.
  - #### `payment_due_date`
    Fecha de vencimiento del pago. Este campo es usado para indicar la fecha de vencimiento de un pago a **crédito**.
    **Es obligatorio solo para las ventas a crédito** y debe ser un string en formato `YYYY-MM-DD`.
  - #### `duration_measure`
    Duración de la medida del pago en días. _Este campo es opcional_ y se utiliza para indicar la duración del periodo de pago a crédito. Debe ser un string.

### `report_header`: **NEW**

Plantilla para personalizar el encabezado y pie de página de la representación gráfica (PDF). La API renderiza dinámicamente los valores proporcionados sobre una plantilla prediseñada. _Este campo es opcional_ y debe ser un objeto.

:::info ¿Cómo funciona?
Se proporciona el `uuid` de una plantilla previamente creada en el sistema y un arreglo de `vars` con los valores a inyectar. La API busca la plantilla y reemplaza los marcadores de posición (placeholders) con los valores proporcionados.
:::

<details open>
<summary>🧩 <strong>Estructura del objeto</strong></summary>

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `uuid` | string | **Sí** | UUID de la plantilla de diseño previamente creada en el sistema |
| `vars` | array | **Sí** | Lista de variables para reemplazar los placeholders de la plantilla |

**Cada objeto dentro de `vars`:**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `name` | string | **Sí** | Nombre del placeholder **sin llaves `{}`**. Ej: si el marcador es `{sucursal}`, enviar `"sucursal"` |
| `value` | string | **Sí** | Valor de texto o HTML que reemplazará el marcador. Se inserta tal cual en la plantilla |

</details>

<details>
<summary>📦 <strong>Ejemplo JSON</strong></summary>

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

</details>

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

Tasa de cambio aplicada al documento. _Este campo es obligatorio_ cuando `currency_id` indica una moneda extranjera (diferente a COP). Define la equivalencia entre la moneda extranjera y el Peso Colombiano. Debe ser un objeto.

- #### Ejemplo

```json
"payment_exchange_rate": {
    "exchange_rate": "3950.00",
    "rate_date": "2022-06-28",
    "currency_id": 188
  }
```

- #### Detalle de los campos
  - #### `exchange_rate`
    Valor equivalente de **1 unidad de la moneda extranjera en Pesos Colombianos (COP)**. Por ejemplo, si el documento es en USD y 1 USD = 3950 COP, el valor debe ser `"3950.00"`. _Este campo es obligatorio_ y debe ser un string con valor flotante.
  - #### `rate_date`
    Fecha de la tasa de cambio utilizada. _Este campo es obligatorio_ y debe ser un string en formato `YYYY-MM-DD`.
  - #### `currency_id`
    ID de la moneda extranjera del documento. _Este campo es obligatorio_ y debe ser un entero. Consulte los valores en [`currency_id`](#currency_id-).

### `point_of_sale` 🟡

Información del punto de venta físico donde se realizó la transacción. _Este campo es obligatorio_ para documentos de tipo **P.O.S Electrónico** (`type_document_id = 20`) y debe ser un objeto.

<details>
<summary>📦 <strong>Ejemplo JSON</strong></summary>

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

</details>

<details open>
<summary>🏪 <strong>Campos del punto de venta</strong></summary>

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `cashier_name` | string | Nombre del cajero que realiza la venta |
| `terminal_number` | string | Número de terminal del punto de venta (ej. `"CJ001aB"`) |
| `cashier_type` | string | Tipo de caja (ej. `"GENÉRICA"`, `"Caja de apoyo"`) |
| `sales_code` | string | Código o ID de la venta (ej. `"POS01"`, `"45212"`) |
| `address` | string | Dirección física del punto de venta |
| `sub_total` | string | Subtotal de la venta (total sin IVA). Formato `"0.00"` |

:::info Todos los campos son **obligatorios** para `type_document_id = 20`.
:::

</details>

### `software_manufacturer` 🟡

Información del fabricante del software POS que generó el documento. _Este campo es obligatorio_ para documentos equivalentes P.O.S (`type_document_id = 20`) y debe ser un objeto.

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

Información específica para documentos del **sector salud** (Resolución 866 de 2021). _Este campo es opcional_ y aplica exclusivamente cuando el emisor pertenece al sector salud. Debe ser un objeto.

<details open>
<summary>🏥 <strong>Campos principales</strong></summary>

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `operation_type` | string | Tipo de operación del sector salud |

</details>

<details>
<summary>📅 <strong>invoice_period</strong> — Periodo de facturación</summary>

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `start_date` | string | Fecha de inicio. Formato `YYYY-MM-DD` |
| `start_time` | string | Hora de inicio. Formato `HH:mm:ss` |
| `end_date` | string | Fecha de fin. Formato `YYYY-MM-DD` |
| `end_time` | string | Hora de fin. Formato `HH:mm:ss` |

</details>

<details>
<summary>📎 <strong>download_attachments</strong> — Descarga de adjuntos</summary>

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `url` | string | URL del servicio de descarga |
| `arguments` | array | Arreglo de objetos `{name, value}` con parámetros |

</details>

<details>
<summary>📤 <strong>document_delivery</strong> — Entrega de documentos</summary>

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `ws` | string | URL del servicio web |
| `arguments` | array | Arreglo de objetos `{name, value}` con parámetros |

</details>

<details>
<summary>👥 <strong>user_collections</strong> — Colecciones de usuario</summary>

Arreglo de objetos con un campo `information` que contiene:

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `name` | string | Nombre del dato |
| `value` | string | Valor del dato |
| `schemeName` | string | Nombre del esquema |
| `schemeID` | string | ID del esquema |

</details>

### `customer` 🔴

Información del cliente o proveedor. _Este campo es obligatorio_ para todos los documentos y debe ser un objeto.

<details open>
<summary>📄 <strong>Factura Electrónica y Documento Soporte</strong></summary>

| Campo | Tipo | Requerido | Default | Descripción |
|-------|:----:|:---------:|:-------:|-------------|
| `company_name` | string | **Sí** | — | Razón social o nombre de persona natural |
| `dni` | string | **Sí** | — | Número de identificación **sin dígito de verificación** |
| `email` | string | **Sí** | — | Correo para envío del documento electrónico |
| `identity_document_id` | int | Opcional | `3` (NIT) | Tipo de documento de identidad. **Endpoint:** `{{url}}/identity-documents` |
| `type_organization_id` | int | Opcional | `2` | `1` = Persona Jurídica, `2` = Persona Natural |
| `tax_regime_id` | int | Opcional | `2` | Régimen fiscal (código `49` = No responsable IVA). **Endpoint:** `{{url}}/accounting-regime` |
| `tax_level_id` | int | Opcional | `5` | Responsabilidad tributaria (`R-99-PN` = No aplica). **Endpoint:** `{{url}}/fiscal-regime` |
| `country_id` | int | Opcional | `45` | País del cliente (Colombia). **Endpoint:** `{{url}}/countries` |
| `city_id` | int | Opcional | — | Ciudad del cliente. **Endpoint:** `{{url}}/cities` |
| `address` | string | Opcional | `""` | Dirección del cliente |
| `postal_code` | string | Opcional | `"000000"` | Código postal del cliente |
| `mobile` | string | Opcional | `""` | Teléfono o celular del cliente |
| `city_name` | string | Opcional | — | **NEW** — Nombre de la ciudad. Solo para clientes/proveedores extranjeros |
| `extra_data` | array | Opcional | — | **NEW** — Información adicional para la representación gráfica (no se envía a DIAN) |

</details>

<details>
<summary>🏷️ <strong>extra_data</strong> — Campos adicionales del cliente</summary>

Arreglo de objetos `{title, value}` que se muestran en el PDF pero **no se envían a la DIAN**.

```json
"extra_data": [
  { "title": "No. Socio", "value": "78-54121-454" },
  { "title": "FECHA DE VINCULACIÓN", "value": "02/02/2026" }
]
```

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `title` | string | **Sí** | Etiqueta del campo adicional |
| `value` | string | **Sí** | Valor del campo adicional |

</details>

<details>
<summary>🏪 <strong>Documento P.O.S Electrónico</strong> — Campos del cliente POS</summary>

| Campo | Tipo | Requerido | Default | Descripción |
|-------|:----:|:---------:|:-------:|-------------|
| `company_name` | string | **Sí** | — | Nombre de la empresa o persona natural |
| `dni` | string | **Sí** | — | Número de identificación sin dígito de verificación |
| `email` | string | Opcional | — | Correo para envío del documento |
| `points` | int | Opcional | `0` | Puntos acumulados del cliente |

</details>

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

- 🔴 **Obligatorio** para Notas Crédito/Débito (referencia a factura original)
- 🟢 **Opcional** para otros documentos

Referencia al documento original sobre el cual se emite la nota. _Debe ser un objeto_.

<details>
<summary>📦 <strong>Ejemplo JSON</strong></summary>

```json
"billing_reference": {
    "number": "EPOS2",
    "date": "2023-12-22",
    "uuid": "b1b5d93a2918...031aea39",
    "scheme_name": "CUDE-SHA384"
  }
```

</details>

<details open>
<summary>🧾 <strong>Campos de la referencia</strong></summary>

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `number` | string | **Sí** | Número del documento referenciado **con prefijo** (ej. `"FE4578"`) |
| `date` | string | **Sí** | Fecha del documento referenciado. Formato `YYYY-MM-DD` |
| `uuid` | string | **Sí** | CUFE o CUDE del documento referenciado |
| `scheme_name` | string | ⚠️ Condicional | **Obligatorio** para notas POS Electrónico y notas de ajuste Doc. Soporte. Valores: `CUFE-SHA384`, `CUDE-SHA384`, `CUDS-SHA384` |

</details>

### `allowance_charges` 🟢

Descuentos o cargos **a nivel de factura** que no afectan las bases gravables. Los que afectan bases gravables se informan a nivel de ítem. _Este campo es opcional_ y debe ser un arreglo de objetos.

<details>
<summary>📦 <strong>Ejemplo JSON</strong></summary>

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

</details>

<details open>
<summary>🧾 <strong>Campos del cargo/descuento</strong></summary>

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `charge_indicator` | boolean | **Sí** | `true` = Cargo (aumenta el total), `false` = Descuento (reduce el total) |
| `amount` | string | **Sí** | Valor del cargo o descuento. Si es descuento, no puede superar `base_amount` |
| `base_amount` | string | **Sí** | Valor base sobre el cual se calcula el cargo o descuento |
| `allowance_charge_reason` | string | **Sí** | Razón o motivo del cargo/descuento |
| `discount_id` | int | ⚠️ Condicional | **Obligatorio si es descuento** (`charge_indicator: false`). **Endpoint:** `{{url}}/discount-codes` |
| `multiplier_factor_numeric` | string | Opcional | Porcentaje como decimal (ej. `"10.00"` = 10%) |

</details>

### `legal_monetary_totals` 🔴

Totales monetarios del documento. Agrupa los valores brutos, impuestos, cargos, descuentos y el total a pagar. La DIAN valida que estos valores sean **matemáticamente consistentes** con las líneas y los impuestos. _Este campo es obligatorio_ y debe ser un objeto.

<details>
<summary>📦 <strong>Ejemplo JSON</strong></summary>

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

</details>

<details open>
<summary>🔴 <strong>Campos obligatorios</strong></summary>

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `line_extension_amount` | string | Suma de las líneas antes de impuestos **(Valor Bruto)** |
| `tax_exclusive_amount` | string | Base imponible total. Si no hay impuestos = `"0"` |
| `tax_inclusive_amount` | string | Valor Bruto + tributos de todas las líneas |
| `payable_amount` | string | **Total a pagar:** ítems + tributos + cargos globales − descuentos globales |

</details>

<details>
<summary>🟢 <strong>Campos opcionales</strong></summary>

| Campo | Tipo | Default | Descripción |
|-------|:----:|:-------:|-------------|
| `total_charges` | string | `0` | Suma de todos los cargos globales |
| `total_allowance` | string | `0` | Suma de todos los descuentos globales |
| `allowance_total_amount` | string | — | Alternativa detallada a `total_allowance` |
| `charge_total_amount` | string | — | Alternativa detallada a `total_charges` |
| `pre_paid_amount` | string | — | Anticipos o prepagos que se descuentan del total |

</details>

### `lines` 🔴

Líneas de detalle del documento. Cada elemento del arreglo representa un ítem (producto o servicio) con su cantidad, precio, impuestos y descripción. Mínimo **1 línea** por documento. _Este campo es obligatorio_ y debe ser un arreglo de objetos.

<details open>
<summary>📋 <strong>Campos obligatorios del ítem</strong></summary>

| Campo | Tipo | Default | Descripción |
|-------|:----:|:-------:|-------------|
| `invoiced_quantity` | string | — | Cantidad del producto o servicio |
| `line_extension_amount` | string | — | Valor total de la línea sin impuesto: **C × PU - D + R**. Formato `"0.00"` |
| `description` | string | — | Descripción del artículo o servicio |
| `code` | string | — | Código interno del artículo o servicio |
| `price_amount` | string | — | Valor unitario del artículo o servicio. Formato `"0.00"` |
| `base_quantity` | string | — | Cantidad sobre la que aplica el precio. Se recomienda igual a `invoiced_quantity` |
| `quantity_units_id` | string | `1093` | Unidad de medida. **Endpoint:** `{{url}}/quantity-units` |
| `type_item_identifications_id` | string | `4` | Estándar de identificación del ítem. **Endpoint:** `{{url}}/type-item-identifications` |
| `reference_price_id` | string | `1` | Precio de referencia. **Endpoint:** `{{url}}/reference-price` |
| `free_of_charge_indicator` | boolean | `false` | `true` = producto gratis o muestra |

</details>

<details>
<summary>📝 <strong>Campos opcionales del ítem</strong></summary>

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `note` | string | Nota adicional. **Obligatorio para AIU**, debe iniciar con: `"Contrato de servicios AIU por concepto de:"` |
| `brand_name` | string | Marca del producto. Se muestra en la representación gráfica |
| `model_name` | string | Modelo del producto |
| `sellers_item_identification` | string | Código interno alterno del vendedor |
| `pack_size_numeric` | string | Unidades por paquete o empaque |
| `notes` | string / array | Notas adicionales a nivel de línea |
| `um` / `mu` / `unit_measure_code` | string | Unidad de medida alternativa para la representación gráfica |

</details>

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

- #### Detalle de los campos

**NOTA**: Es importante que el campo `title` sea igual en cada línea donde se envía el mismo valor para la columna en la representación gráfica.

| Campo | Tipo | Requerido | Descripción |
|------------|---------|-----------|-------------|
| `title` | string | ✅ Sí | Título/nombre del campo adicional. Se convierte en cabecera de columna en la representación gráfica. |
| `value` | string | ✅ Sí | Valor del campo adicional. Se muestra en la celda correspondiente. |
| `align` | string | ❌ No | Alineación del texto en la columna. Valores: `left`, `center`, `right`. Default: `left`. |
| `position` | integer | ❌ No | **🆕 NEW** — Posición de la columna en el PDF. Controla dónde se ubica el campo respecto a las columnas base. Default: después de recargos, antes de impuestos. Ver tabla de posiciones. |

#### Tabla de posiciones (`position`)
El valor de `position` indica **después de qué columna base** se inserta la columna `extra_data` en la representación gráfica (PDF):

| `position` | Columna insertada después de... | Ejemplo visual |
|:----------:|--------------------------------|----------------|
| `1` | **CÓDIGO** | `CÓDIGO | 👉 MI_CAMPO | DETALLE | CANT | ...` |
| `2` | **DETALLE** | `CÓDIGO | DETALLE | 👉 MI_CAMPO | CANT | ...` |
| `3` | **CANT** | `... | CANT | 👉 MI_CAMPO | U.M | ...` |
| `4` | **U.M** | `... | U.M | 👉 MI_CAMPO | PRECIO | ...` |
| `5` | **PRECIO** | `... | PRECIO | 👉 MI_CAMPO | DESCUENTO | ...` |
| `6` | **DESCUENTO** (si aplica) | `... | DESCUENTO | 👉 MI_CAMPO | RECARGO | ...` |
| `7` | **RECARGO** (si aplica) | `... | RECARGO | 👉 MI_CAMPO | IVA | ...` |
| _sin valor_ | _(comportamiento legacy)_ | `... | RECARGO | 👉 MI_CAMPO | IVA | ...` |

:::info Comportamiento por defecto
Si **no se envía** `position`, la columna extra se ubica en la posición legacy: después de los recargos y antes de los impuestos. Esto garantiza **compatibilidad total** con implementaciones existentes.
:::

:::warning Reglas importantes
- **Rango válido:** 1-7. Valores mayores a 7 se ignoran silenciosamente y se aplica el comportamiento legacy.
- **Resolución de conflictos:** Si múltiples líneas definen el mismo `title` con diferente `position`, la **primera línea** que define el título determina la posición para toda la tabla.
- `position` es **por columna** (por `title`), no por línea individual. Todas las líneas del documento comparten el mismo layout de tabla.
:::

- #### Ejemplo

```json
"extra_data": [
  {
    "title": "CODIGO_BARRAS",
    "value": "7703672001889",
    "align": "center",
    "position": 1
  },
  {
    "title": "LOTE",
    "value": "L-2025-001",
    "align": "left",
    "position": 2
  },
  {
    "title": "FECHA_VENCIMIENTO",
    "value": "2026-10-28",
    "align": "center"
  }
]
```

:::tip Resultado visual del ejemplo
```
CÓDIGO | CODIGO BARRAS | DETALLE | LOTE | CANT | U.M | PRECIO | FECHA VENCIMIENTO | IVA | Vr. IVA | TOTAL
         (position=1)              (position=2)                    (sin position → legacy)
```
:::

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

### `additional_document_reference` 🟡 {#additional_document_reference-referencia-a-documento-adicional}

Arreglo de objetos utilizado para referenciar documentos adicionales. **Es OBLIGATORIO** para Facturas de Contingencia (Tipo 03) para relacionar el documento físico entregado. Para otros documentos, es **opcional** y sirve para referenciar documentos comerciales (múltiples órdenes, contratos, etc).

<details open>
<summary>🧾 <strong>Campos de la referencia</strong></summary>

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `number` | string | **Sí** | Prefijo y Número del documento referenciado (ej. `"PAPEL-001"`) |
| `date` | string | ⚠️ Condicional | Fecha de emisión del documento. **Obligatorio para Tipo 03**. Formato `YYYY-MM-DD` |
| `uuid` | string | ⚠️ Condicional | CUFE/CUDE del documento referenciado. **Obligatorio para referencias electrónicas**. _(No aplica para papel)_ |
| `code` | string | Opcional | Código interno de la empresa (ej. `"TALONARIO"`, `"OC"`) |
| `scheme_name` | string | Opcional | Algoritmo del UUID (ej. `"CUFE-SHA384"`) |

</details>

<details>
<summary>🚨 <strong>Uso en Factura de Contingencia (Tipo 03)</strong></summary>

Cuando expide una factura física por contingencia, luego debe transmitirla con `type_document_id = 9`. En este caso, informe los datos del papel y **no envíe CUFE**.

```json
"additional_document_reference": [
  {
    "number": "TALONARIO-123",
    "date": "2025-02-10",
    "code": "TALONARIO"
  }
]
```
</details>

<details>
<summary>🏢 <strong>Uso para Referencias Comerciales</strong></summary>

Sirve para referenciar múltiples órdenes de compra, contratos u otros documentos electrónicos.

```json
"additional_document_reference": [
  {
    "number": "OC-2025-001",
    "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
    "scheme_name": "CUFE-SHA384",
    "date": "2025-01-15",
    "code": "OC"
  }
]
```
</details>


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
