---
sidebar_position: 2
sidebar_label: 🟢 Tablas y Catálogos
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🟢 Endpoints Públicos, Tablas DIAN y Funciones Auxiliares {#tablas-catalogos}

:::tip Sin autenticación — Acceso libre
Estos endpoints obtienen tablas paramétricas DIAN, catálogos del sistema y funciones auxiliares de cálculo. **No requieren token** ni parámetro `client_uuid`.
:::

### Respuesta Estándar de Catálogos {#respuesta-estandar}

Todas las respuestas de consulta de catálogos siguen este patrón:

```json
{
  "dataRecords": {
    "data": [
      { "id": 1, "code": "01", "name": "Factura de Venta" }
    ]
  },
  "success": true
}
```

---

## 📋 Tablas Referenciadas DIAN {#tablas-dian}

**¿Cuándo usar?** Para obtener códigos válidos antes de construir y enviar un documento electrónico.

<details open>
<summary>📄 Documentos Electrónicos</summary>

| Endpoint | Uso | Ejemplo de Respuesta |
|----------|-----|---------------------|
| `GET /destination-environment` | Ambiente de Destino | Producción, Pruebas |
| `GET /document-type` | Tipos de Documentos | `01`=Factura, `02`=Exportación, etc. |
| `GET /payment-methods` | Métodos de Pago | Formas de pago válidas |
| `GET /payment-means` | Medios de Pago | Efectivo, Tarjeta, etc. |
| `GET /identity-documents` | Identidades | CC, NIT, Pasaporte, etc. |
| `GET /organization-type` | Tipo de Organización | `1`=Persona Jurídica, `2`=Natural |
| `GET /fiscal-regime` | Régimen Fiscal | Responsabilidades fiscales |
| `GET /accounting-regime` | Régimen Contable | Códigos contables |
| `GET /delivery-conditions` | INCOTERMS | Términos de entrega |
| `GET /correction-notes` | Motivos de corrección | Notas crédito/débito |
| `GET /discount-codes` | Códigos de descuento | Tipos de descuento |
| `GET /operation-type` | Tipo de operación | Nacional, Exportación |
| `GET /taxes` | Tributos e impuestos | IVA, ICA, INC, etc. |
| `GET /quantity-units` | Unidades de cantidad | Kg, Lt, Pz, etc. |
| `GET /type-item-identifications` | Identificación de Ítem | Estándar del contribuyente |
| `GET /reference-price` | Unidad de referencia | Precios referenciales |
| `GET /cities` | Ciudades | Parámetro opcional: `?code=` |
| `GET /departments` | Departamentos | Departamentos de Colombia |
| `GET /countries` | Países | Países |
| `GET /currencies` | Monedas | Monedas |

</details>

<details>
<summary>🏥 Sector Salud</summary>

| Endpoint | Uso |
|----------|-----|
| `GET /health/user-type` | Tipo de usuario |
| `GET /health/contracting` | Modalidad de contratación |
| `GET /health/coverage` | Cobertura o plan de beneficios |

</details>

<details>
<summary>💼 Nómina Electrónica</summary>

| Endpoint | Uso |
|----------|-----|
| `GET /ep/adjustment-note-type` | Tipo de ajuste a la nota de ajuste |
| `GET /ep/contract-type` | Tipo de contrato |
| `GET /ep/disability-type` | Tipo de discapacidad |
| `GET /ep/extra-hours` | Horas extras |
| `GET /ep/payroll-period` | Periodicidad de la nómina |
| `GET /ep/worker-type` | Tipo de trabajo |
| `GET /ep/worker-subtype` | Subtipo de trabajo |

</details>

---

## 🛠️ Funciones Auxiliares Públicas {#funciones-auxiliares}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/numbers-to-letters</b> — Convertir Números a Letras</summary>

```http
GET {{url}}/numbers-to-letters?number={number}&money={money}&money2={money2}
GET {{url}}/numbersToLetters/{numero}
```

**Descripción:** Convierte una cifra numérica a su representación textual en letras (útil para la leyenda monetaria en representaciones gráficas de facturas).

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `number` / `numero` | query / path | ✅ Sí | Número o importe a convertir (ej. `58547125`). |
| `money` | query | No | Denominación en singular (ej. `PESO`, `DÓLAR`). |
| `money2` | query | No | Denominación de fracción (ej. `CENTAVO`). |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl "{{url}}/numbers-to-letters?number=58547125&money=PESO&money2=CENTAVO"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/numbers-to-letters`, {
  params: { number: 58547125, money: 'PESO', money2: 'CENTAVO' }
});
const text = response.data.letters;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/numbers-to-letters", [
    'query' => ['number' => 58547125, 'money' => 'PESO', 'money2' => 'CENTAVO'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "letters": "CINCUENTA Y OCHO MILLONES QUINIENTOS CUARENTA Y SIETE MIL CIENTO VEINTICINCO PESOS M/CTE",
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/digit-verification</b> — Calcular Dígito de Verificación (DV)</summary>

```http
GET {{url}}/digit-verification?Number={Number}
GET {{url}}/dv/{nit}
```

**Descripción:** Calcula el dígito de verificación oficial según el algoritmo módulo 11 de la DIAN.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `Number` / `nit` | query / path | ✅ Sí | NIT sin dígito de verificación ni guiones (ej. `900123456`). |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl "{{url}}/digit-verification?Number=900123456"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/digit-verification`, {
  params: { Number: '900123456' }
});
const dv = response.data.digit; // 7
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/digit-verification", [
    'query' => ['Number' => '900123456'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "digit": 7,
  "nit": "900123456-7"
}
```

</details>

</details>
