---
sidebar_position: 17
sidebar_label: 💰 Monedas
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 💰 Gestión de Monedas

> ✅ **Autenticación REQUERIDA**  
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

Permite administrar el catálogo y las tasas de cambio de monedas extranjeras (ej. USD, EUR) respecto a la moneda funcional nacional (**COP** - Peso Colombiano) para emitir documentos electrónicos multi-moneda.

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes configurar las tasas de cambio de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `{{url}}/currency?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** Las tasas de cambio se configurarán en la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

---

## Listar Monedas Disponibles del Sistema

### Listar Monedas Disponibles del Sistema - 🔵 GET
```http
GET {{url}}/currency/all
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Obtiene el catálogo completo de monedas soportadas por el sistema.

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
    "data": [
     {
          "id": 164,
          "CurrencyISO": "VEF",
          "Language": "ES",
          "CurrencyName": "Bolivar Fuerte",
          "Money": "Bolívar",
          "Symbol": "B",
          "Format": "es-CO",
          "image": "venezuela.png",
          "active": 1
      },
      {
          "id": 165,
          "CurrencyISO": "BOB",
          "Language": "ES",
          "CurrencyName": "Boliviano",
          "Money": "Boliviano",
          "Symbol": "B",
          "Format": "es-CO",
          "image": "bolivia.png",
          "active": 1
      }
    ]
  }
}
```

---

## Listar Monedas Configuradas en la Empresa

### Listar Monedas de la Empresa - 🔵 GET
```http
GET {{url}}/currency?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Obtiene la lista de monedas y tasas de cambio actualmente asignadas a la empresa.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
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
            "Language": "ES",
            "CurrencyName": "Peso Colombiano",
            "Money": "Peso",
            "Symbol": "$",
            "Format": "es-CO",
            "image": "colombia.png",
            "active": 1
          }
      }
    ]
  }
}
```

---

## Agregar Moneda a la Empresa

### Agregar Moneda a la Empresa - 🟘 POST
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

// 1. Datos de la moneda
const records = {
  currency_id: 45,             // ID del catálogo de monedas (GET /currency/all)
  exchange_rate_value: 4200.50,// Tasa de cambio respecto al COP
  national_currency: 0,        // 1: Moneda funcional local, 0: Moneda extranjera
  plural_name: "DÓLARES",
  singular_name: "DÓLAR",
  denomination: "USD"
};

// 2. Enviar petición POST serializando records
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
<TabItem value="php" label="PHP (Guzzle / cURL)">

```php
<?php
$records = [
    'currency_id'         => 45,
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
    "currency_id": 45,
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
    currency_id = 45,
    exchange_rate_value = 4200.50,
    national_currency = 0,
    plural_name = "DÓLARES",
    singular_name = "DÓLAR",
    denomination = "USD"
};

var payload = new { records = JsonSerializer.Serialize(records) };

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

var response = await client.PostAsJsonAsync($"{url}/currency", payload);
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
// Pre-request Script en Postman
const records = {
    currency_id: 45,
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

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body JSON resultante:**
```json
{
  "records": "{\"currency_id\":45,\"exchange_rate_value\":4200.50,\"national_currency\":0,\"plural_name\":\"DÓLARES\",\"singular_name\":\"DÓLAR\",\"denomination\":\"USD\"}"
}
```

| Propiedad en `records` | Tipo | Requerido | Descripción |
|---|---|---|---|
| `currency_id` | integer | ✅ Sí | ID de la moneda del catálogo (`GET /currency/all`). |
| `exchange_rate_value` | number | ✅ Sí | Tasa de cambio respecto al peso colombiano. |
| `national_currency` | integer | ✅ Sí | `1` si es la moneda funcional local, `0` si es moneda extranjera. |
| `plural_name` | string | ✅ Sí | Nombre en plural (ej. `PESOS`, `DÓLARES`). |
| `singular_name` | string | ✅ Sí | Nombre en singular (ej. `PESO`, `DÓLAR`). |
| `denomination` | string | ✅ Sí | Código ISO de la moneda (ej. `COP`, `USD`, `EUR`). |

**Respuesta Exitosa (HTTP 201):**
```json
{
  "success": true,
  "message": "Moneda registrada exitosamente"
}
```

---

## Actualizar Tasa de Moneda

### Actualizar Tasa de Moneda - 🟠 PUT
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

**Body (JSON):** Igual al POST de registro (`records` serializado con `exchange_rate_value` actualizado).

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Tasa de cambio actualizada exitosamente"
}
```

---

## Eliminar Moneda de la Empresa

### Eliminar Moneda - 🔴 DELETE
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

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Moneda eliminada exitosamente"
}
```
