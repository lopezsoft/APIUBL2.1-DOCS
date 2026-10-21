---
sidebar_position: 17
sidebar_label: 💰 Monedas
description: "Monedas y tasas de cambio de la empresa para documentos en moneda extranjera."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 💰 Gestión de Monedas {#gestion-monedas}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

Permite administrar el catálogo y las tasas de cambio de monedas extranjeras (ej. USD, EUR) respecto a la moneda funcional nacional (**COP** - Peso Colombiano) para emitir documentos electrónicos multi-moneda.

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes configurar las tasas de cambio de tus empresas cliente agregando `?client_uuid={{client_uuid}}`.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

---

## 📋 Catálogo y Monedas de la Empresa {#catalogo-empresa}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/currency/all</b> — Catálogo General de Monedas</summary>

```http
GET {{url}}/currency/all
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Obtiene el catálogo completo de monedas soportadas por el sistema.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 164,
        "CurrencyISO": "USD",
        "Language": "EN",
        "CurrencyName": "Dólar Estadounidense",
        "Money": "Dólar",
        "Symbol": "$",
        "Format": "en-US",
        "image": "usa.png",
        "active": 1
      },
      {
        "id": 272,
        "CurrencyISO": "COP",
        "Language": "ES",
        "CurrencyName": "Peso Colombiano",
        "Money": "Peso",
        "Symbol": "$",
        "Format": "es-CO",
        "image": "colombia.png",
        "active": 1
      }
    ]
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/currency</b> — Monedas Configuradas en la Empresa</summary>

```http
GET {{url}}/currency?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Obtiene, paginada (15 por página), la lista de monedas y tasas de cambio asignadas a la empresa emisora. Cada registro incluye en `currency` los datos de la moneda del catálogo.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uid` | query | No | Filtra por el `id` de una moneda configurada en la empresa. |
| `page` | query | No | Número de página (default: `1`). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 7,
        "currency_id": 272,
        "company_id": 1,
        "exchange_rate_value": "0.00",
        "national_currency": 1,
        "plural_name": "PESOS",
        "singular_name": "PESO",
        "denomination": "COP",
        "currency": {
          "id": 272,
          "CurrencyISO": "COP",
          "CurrencyName": "Peso Colombiano",
          "Symbol": "$"
        }
      },
      {
        "id": 8,
        "currency_id": 164,
        "company_id": 1,
        "exchange_rate_value": "4200.50",
        "national_currency": 0,
        "plural_name": "DÓLARES",
        "singular_name": "DÓLAR",
        "denomination": "USD",
        "currency": {
          "id": 164,
          "CurrencyISO": "USD",
          "CurrencyName": "Dólar Estadounidense",
          "Symbol": "$"
        }
      }
    ],
    "per_page": 15,
    "total": 2
  },
  "success": true
}
```

El objeto `currency` está recortado: trae los mismos campos que `GET /currency/all`. El paginador incluye además los campos estándar (`from`, `to`, `last_page`, `links`, etc.).

</details>

</details>

---

## ⚙️ Configuración de Tasas de Cambio {#configuracion-tasas}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/currency</b> — Agregar Moneda a la Empresa</summary>

```http
POST {{url}}/currency?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Registra una nueva divisa con su tasa de cambio para la empresa emisora.

:::info 💡 Guía para Desarrolladores — Configuración de Monedas
Los datos de la divisa se serializan en la propiedad `records` del JSON (`Content-Type: application/json`).
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import axios from 'axios';

const records = {
  currency_id: 164,           // ID del catálogo (GET /currency/all)
  exchange_rate_value: 4200.50,// Tasa de cambio respecto al COP
  national_currency: 0,        // 1: Moneda funcional local, 0: Moneda extranjera
  plural_name: "DÓLARES",
  singular_name: "DÓLAR",
  denomination: "USD"
};

const response = await axios.post(`${url}/currency`, {
  records: JSON.stringify(records)
}, {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
```

</TabItem>
<TabItem value="php" label="PHP (cURL)">

```php
<?php
$records = [
    'currency_id'         => 164,
    'exchange_rate_value' => 4200.50,
    'national_currency'   => 0,
    'plural_name'         => 'DÓLARES',
    'singular_name'       => 'DÓLAR',
    'denomination'        => 'USD',
];

$payload = json_encode(['records' => json_encode($records)]);

$ch = curl_init("{$url}/currency");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json'
    ],
]);

$response = curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import json
import requests

records = {
    "currency_id": 164,
    "exchange_rate_value": 4200.50,
    "national_currency": 0,
    "plural_name": "DÓLARES",
    "singular_name": "DÓLAR",
    "denomination": "USD"
}

response = requests.post(
    f"{url}/currency",
    json={"records": json.dumps(records)},
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
)
```

</TabItem>
<TabItem value="csharp" label="C# / .NET">

```csharp
using System.Text.Json;
using System.Net.Http.Headers;

var records = new {
    currency_id = 164,
    exchange_rate_value = 4200.50,
    national_currency = 0,
    plural_name = "DÓLARES",
    singular_name = "DÓLAR",
    denomination = "USD"
};

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
var response = await client.PostAsJsonAsync($"{url}/currency", new {
    records = JsonSerializer.Serialize(records)
});
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
const records = {
    currency_id: 164,
    exchange_rate_value: 4200.50,
    national_currency: 0,
    plural_name: "DÓLARES",
    singular_name: "DÓLAR",
    denomination: "USD"
};

const payload = { records: JSON.stringify(records) };
pm.request.body.mode = 'raw';
pm.request.body.raw = JSON.stringify(payload);
pm.request.headers.add({key: 'Content-Type', value: 'application/json'});
```

</TabItem>
</Tabs>

**Propiedades de `records`:**
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `currency_id` | integer | ✅ Sí | ID de la moneda del catálogo (`GET /currency/all`). |
| `exchange_rate_value` | number | No | Tasa de cambio respecto al peso colombiano (default: `0`). |
| `national_currency` | integer | No | `1` si es la moneda funcional local, `0` si es extranjera (default: `0`). |
| `plural_name` | string | No | Nombre en plural (ej. `DÓLARES`). |
| `singular_name` | string | No | Nombre en singular (ej. `DÓLAR`). |
| `denomination` | string | No | Código ISO de la moneda (ej. `USD`, `EUR`). |

El body debe incluir `records` como **string JSON**. Esto aplica a `POST`, `PUT` y `DELETE` de `/currency`.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Registro creado correctamente.",
  "record": {
    "id": 8,
    "currency_id": 164,
    "company_id": 1,
    "exchange_rate_value": "4200.50",
    "national_currency": 0,
    "plural_name": "DÓLARES",
    "singular_name": "DÓLAR",
    "denomination": "USD"
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Moneda duplicada (HTTP 400)</summary>

La moneda ya está configurada para la empresa:

```json
{
  "success": false,
  "message": "La moneda ya existe para la empresa"
}
```

</details>

<details>
<summary>❌ Sin `records` o JSON inválido (HTTP 422)</summary>

```json
{
  "message": "El campo records es requerido",
  "errors": {
    "records": ["El campo records es requerido"]
  }
}
```

Si `records` no es un JSON válido, el mensaje es `El campo records debe ser un JSON válido`.

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/currency/&#123;id&#125;</b> — Actualizar Tasa de Moneda</summary>

```http
PUT {{url}}/currency/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID de la moneda configurada en la empresa. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):** `records` como string JSON, con las mismas propiedades que en `POST`. `currency_id` es obligatorio; `exchange_rate_value` y `national_currency` toman `0` si los omites, y los nombres quedan vacíos. Envía siempre la configuración completa de la moneda.

```json
{
  "records": "{\"currency_id\":164,\"exchange_rate_value\":4350.25,\"national_currency\":0,\"plural_name\":\"DÓLARES\",\"singular_name\":\"DÓLAR\",\"denomination\":\"USD\"}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/currency/&#123;id&#125;</b> — Eliminar Moneda</summary>

```http
DELETE {{url}}/currency/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID de la moneda configurada a eliminar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):** `records` es obligatorio también en el borrado. Cada campo que envíes dentro de `records` se añade como condición: solo se elimina la fila que coincida con el `id` **y** con esos valores. Para borrar solo por `id`, envía un objeto vacío.

```json
{
  "records": "{}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

Devuelve las filas eliminadas (un arreglo vacío si ninguna coincidió):

```json
{
  "records": [
    {
      "id": 8,
      "currency_id": 164,
      "company_id": 1,
      "exchange_rate_value": "4200.50",
      "national_currency": 0,
      "plural_name": "DÓLARES",
      "singular_name": "DÓLAR",
      "denomination": "USD"
    }
  ],
  "success": true
}
```

</details>

</details>

---

## 💱 Tasa de Cambio {#tasa-cambio}

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/currency/change</b> — Cotizar entre dos Monedas</summary>

```http
GET {{url}}/currency/change?source=USD&target=COP&quantity=100
Authorization: Bearer {token}
```

**Descripción:** Consulta la cotización entre dos monedas con un proveedor externo de tasas de cambio.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `source` | query | ✅ Sí | Código ISO de la moneda de origen (ej. `USD`). |
| `target` | query | ✅ Sí | Código ISO de la moneda de destino (ej. `COP`). |
| `quantity` | query | ✅ Sí | Cantidad a convertir. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "value": 4200.5,
  "amount": 420050,
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/currency/change/local</b> — Convertir a la Moneda Nacional</summary>

```http
GET {{url}}/currency/change/local?source=USD&quantity=100
Authorization: Bearer {token}
```

**Descripción:** Convierte una cantidad desde la moneda `source` hacia la moneda marcada como nacional (`national_currency: 1`). Requiere tener configurada la moneda nacional.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `source` | query | ✅ Sí | Código ISO de la moneda de origen (ej. `USD`). |
| `quantity` | query | No | Cantidad a convertir (default: `1`). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "records": [
    { "value": 4200.5, "amount": 420050 }
  ],
  "success": true
}
```

</details>

<details>
<summary>❌ Moneda nacional no configurada (HTTP 404)</summary>

```json
{
  "success": false,
  "message": "Debe crear la moneda nacional."
}
```

Si la moneda nacional configurada no existe en el catálogo, el mensaje es `No existe la moneda.`

</details>

</details>

:::note Sandbox
En sandbox, ambos endpoints de tasa de cambio devuelven un factor fijo de `1.0`: `value` y `amount` valen `1.0 × quantity`.
:::
