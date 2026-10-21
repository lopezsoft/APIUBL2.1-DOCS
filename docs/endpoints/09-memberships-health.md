---
sidebar_position: 9
sidebar_label: 📊 Membresías
description: "Membresías y consumo: resumen del plan, recargas, cuotas para empresas cliente de Casas de Software y estadísticas de almacenamiento y correos."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📊 Gestión de Membresías y Consumo {#membresias}

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

Esta sección abarca la consulta del plan y del consumo, las recargas de documentos, la gestión de cuotas de emisión para clientes y el uso de almacenamiento y correos del plan. Está pensada para casas de software, ERPs y plataformas SaaS integradoras.

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes consultar el resumen, las recargas y las estadísticas de una sub-cuenta propia y activa agregando `?client_uuid={{client_uuid}}`. El UUID se obtiene del listado de clientes:

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```

Los endpoints de **cuotas** (`POST /memberships/quotas` y `DELETE /memberships/quotas/{clientCompanyId}`) son la excepción: **no** se envía `client_uuid`, porque quien actúa es siempre la Casa de Software.
:::

---

## 📈 Membresías y Consumo {#memberships-consumption}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/memberships/summary</b> — Resumen de Membresía</summary>

```http
GET {{url}}/memberships/summary?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Obtiene el resumen de la membresía: tipo de cuenta, plan, límite de documentos, consumo, vigencia y, para la cuenta principal, las cuotas asignadas a los clientes (paginadas).

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID de una sub-cuenta propia y activa (Casa de Software). Debe ser el UUID, no el ID numérico. |
| `search` | query | No | Filtra las cuotas asignadas por razón social del cliente (coincidencia parcial). |
| `page` | query | No | Página del listado de cuotas asignadas (15 por página). |

**Campos de `data`:**

| Campo | Tipo | Descripción |
|---|---|---|
| `type` | `string` | `developer` (cuenta principal o independiente), `client_quota` (sub-cuenta con cuota asignada) o `client_shared` (sub-cuenta que consume de la bolsa de la Casa de Software). |
| `plan_name` | `string` | Nombre del plan. En `client_quota` es `Cuota de {razón social de la Casa de Software}`; en `client_shared`, `Plan {plan} (Compartido)`. |
| `is_unlimited` | `boolean` | `true` si el plan no tiene límite de documentos. |
| `valid_until` | `string` | Fecha de vencimiento (`YYYY-MM-DD`). En `developer` es la fecha más lejana entre las suscripciones vigentes. |
| `limit` | `integer` | Límite de documentos. En `developer` suma todas las suscripciones vigentes (incluida una renovación en cola); en `client_quota` es la cuota asignada; en `client_shared`, la bolsa de la Casa de Software. |
| `consumed` | `integer` | Documentos consumidos. En `client_shared` es el consumo total de la Casa de Software. Ver [qué consume del plan](#que-consume-del-plan). |
| `assigned_quotas` | `object` | Solo en `developer`. Listado paginado de las cuotas asignadas a clientes. |
| `daily_limit` | `object` | Solo en `developer` con plan **FREE**: `limit`, `consumed`, `remaining` y `next_reset` (inicio del día siguiente, ISO 8601). |

:::note Formato de la respuesta
Esta respuesta va envuelta en `data`, **sin** `dataRecords` y **sin** `success`.
:::

<a id="que-consume-del-plan"></a>

:::info 🆕 Qué consume del plan
Un documento consume del plan **una sola vez**: cuando la DIAN lo valida en la emisión (`response.IsValid: "true"`). Un evento RADIAN consume cuando la DIAN lo acepta.

**No** consumen:

- Los documentos rechazados o pendientes.
- El documento que la API devuelve como ya autorizado, con `ALREADY_AUTHORIZED_RECOVERED` en `warnings` (tras la [regla 90](./03-invoices-pos.md#regla-90) o en el [reintento de un número ya transmitido](./03-invoices-pos.md#reintento-transmitido)), porque ya estaba emitido.
- El documento que queda validado más tarde, al consultar su estado (`POST /status/document/{trackId}`) o en la revalidación automática.

Por eso `consumed` puede ser menor que el número de documentos que reporta [`GET /documents/consume`](./06-queries-status.md#busqueda-listado): en sus agrupaciones `p_type` `1` a `4` ese reporte cuenta documentos validados por la DIAN, no consumo cobrado, así que incluye los recuperados y los validados tarde, que no se cobran. Ver [Documento recuperado: sin cobro de consumo](./03-invoices-pos.md#recuperado-sin-consumo).
:::

<details>
<summary>✅ Respuesta Exitosa — Cuenta principal (HTTP 200)</summary>

```json
{
  "data": {
    "type": "developer",
    "plan_name": "PLAN CASA DE SOFTWARE",
    "is_unlimited": false,
    "valid_until": "2027-10-13",
    "limit": 10000,
    "consumed": 3254,
    "assigned_quotas": {
      "current_page": 1,
      "data": [
        {
          "id": 58,
          "uuid": "9b2f6d0e-3c1a-4f7e-8a51-2d6c0b9e4f13",
          "subscription_id": 311,
          "client_company_id": 1262,
          "assigned_documents": 500,
          "consumed_documents": 120,
          "start_date": "2026-10-14T05:00:00.000000Z",
          "end_date": "2027-10-13T05:00:00.000000Z",
          "created_at": "2026-10-14T20:15:03.000000Z",
          "updated_at": "2026-10-14T20:15:03.000000Z",
          "client": {
            "id": 1262,
            "company_name": "Cliente Ejemplo S.A.S"
          }
        }
      ],
      "first_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/memberships/summary?page=1",
      "from": 1,
      "last_page": 1,
      "last_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/memberships/summary?page=1",
      "links": [],
      "next_page_url": null,
      "path": "https://sandbox-api.matias-api.com/api/ubl2.1/memberships/summary",
      "per_page": 15,
      "prev_page_url": null,
      "to": 1,
      "total": 1
    }
  }
}
```

</details>

<details>
<summary>✅ Respuesta Exitosa — Plan FREE (HTTP 200)</summary>

```json
{
  "data": {
    "type": "developer",
    "plan_name": "FREE",
    "is_unlimited": false,
    "valid_until": "2027-10-13",
    "limit": 100,
    "consumed": 42,
    "assigned_quotas": {
      "current_page": 1,
      "data": [],
      "per_page": 15,
      "total": 0
    },
    "daily_limit": {
      "limit": 10,
      "consumed": 3,
      "remaining": 7,
      "next_reset": "2026-10-22T00:00:00-05:00"
    }
  }
}
```

</details>

<details>
<summary>✅ Respuesta Exitosa — Sub-cuenta con cuota (HTTP 200)</summary>

```json
{
  "data": {
    "type": "client_quota",
    "plan_name": "Cuota de CASA DE SOFTWARE EJEMPLO S.A.S",
    "is_unlimited": false,
    "valid_until": "2027-10-13",
    "limit": 500,
    "consumed": 120
  }
}
```

</details>

<details>
<summary>✅ Respuesta Exitosa — Sub-cuenta sin cuota (HTTP 200)</summary>

```json
{
  "data": {
    "type": "client_shared",
    "plan_name": "Plan PLAN CASA DE SOFTWARE (Compartido)",
    "is_unlimited": false,
    "valid_until": "2027-10-13",
    "limit": 10000,
    "consumed": 3254
  }
}
```

</details>

<details>
<summary>❌ Sin membresía activa (HTTP 404)</summary>

En una sub-cuenta, también aplica si la Casa de Software no tiene membresía activa.

```json
{
  "message": "No se encontró una membresía activa o legada para esta cuenta.",
  "data": null,
  "success": false
}
```

</details>

<details>
<summary>❌ client_uuid no autorizado (HTTP 403)</summary>

La empresa del `client_uuid` no es una sub-cuenta activa de quien llama.

```json
{
  "success": false,
  "message": "Acceso no autorizado. Acceso denegado: No tiene permisos para operar sobre esta empresa o la relación no está activa."
}
```

Si en lugar del UUID se envía el ID numérico de la empresa, la respuesta es `500` con el mensaje `Error interno del servidor. Debe enviar el UUID del cliente, no el ID.`.

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/memberships/recharges</b> — Mis Recargas</summary>

:::info 🆕 Nuevo
Desglose de la suscripción activa entre los documentos del plan y los documentos recargados, con su vencimiento.
:::

```http
GET {{url}}/memberships/recharges?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Muestra cuántos documentos del límite vienen del plan y cuántos de recargas, cuántos recargados quedan sin usar, cuándo vencen y el historial de recargas. Es de solo lectura y no incluye datos del pago (ni precio, ni monto, ni referencia).

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID de una sub-cuenta propia y activa. Se consulta la suscripción activa **propia** de esa empresa. |

**Campos de la respuesta:**

| Campo | Tipo | Descripción |
|---|---|---|
| `plan_documents` | `integer` | Tamaño del plan según el catálogo. Si el catálogo no lo define, es igual a `base_documents`. |
| `base_documents` | `integer` | Documentos del límite que no vienen de recargas del ciclo vigente. `base_documents` + `recharged_documents` = `total_documents`. |
| `recharged_documents` | `integer` | Documentos recargados en el ciclo vigente. |
| `total_documents` | `integer` | Límite de documentos de la suscripción activa. |
| `unused_recharged_documents` | `integer` | Recargados sin usar. Se consumen primero los documentos del plan, así que es el menor entre `recharged_documents` y lo que queda por consumir. |
| `end_date` | `string` | Vencimiento de la suscripción y de sus recargas (`YYYY-MM-DD`). |
| `remaining_days` | `integer` | Días calendario hasta el vencimiento; el día en curso cuenta. |
| `expiry_warning` | `boolean` | `true` solo si quedan menos de 30 días **y** hay documentos recargados sin usar. |
| `expiry_message` | `string` \| `null` | Texto del aviso cuando `expiry_warning` es `true`; `null` en otro caso. |
| `transferred_count` | `integer` | Cantidad de recargas `TRANSFERRED` incluidas en `recharges`. |
| `recharges` | `array` | Historial de recargas (ver abajo). |

**Elementos de `recharges`:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `integer` | Identificador de la recarga. |
| `date` | `string` | Fecha y hora de la recarga (`YYYY-MM-DD HH:mm:ss`). |
| `documents` | `integer` | Documentos recargados. En una `TRANSFERRED` es la cantidad que se recargó originalmente, no la que se trasladó: los documentos ya usados no pasan al plan nuevo. |
| `status` | `string` | `ACTIVE`: del ciclo vigente, suma al límite y vence con la suscripción. `TRANSFERRED`: de un plan anterior de la misma empresa; sus documentos sin usar pasaron al plan actual en un cambio de plan. |
| `transferred_at` | `string` \| `null` | Solo `TRANSFERRED`: fecha del traslado (`YYYY-MM-DD`). |
| `from_plan_name` | `string` \| `null` | Solo `TRANSFERRED`: nombre del plan de origen. |

:::tip Cómo leer las recargas
- Las recargas no tienen vencimiento propio: vencen con la suscripción (`end_date`).
- El orden es: primero las `ACTIVE` y después las `TRANSFERRED` (últimos 12 meses, máximo 50); en cada grupo, la más reciente primero.
- Las `TRANSFERRED` no suman en `recharged_documents` ni en `unused_recharged_documents`: sus documentos sin usar ya están dentro de `base_documents`.
- Para saber cuánto se recargó en el ciclo vigente, usa `recharged_documents` o suma solo los elementos `ACTIVE`. No sumes todos los `recharges[].documents`.
- Sin recargas, `recharges` llega vacío y los totales de recarga en `0`.
:::

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "plan_documents": 8000,
  "base_documents": 8200,
  "recharged_documents": 300,
  "total_documents": 8500,
  "unused_recharged_documents": 300,
  "end_date": "2026-10-29",
  "remaining_days": 9,
  "expiry_warning": true,
  "expiry_message": "Tu plan vence en 9 días (2026-10-29). Los documentos recargados que no uses antes de esa fecha se pierden.",
  "transferred_count": 1,
  "recharges": [
    {
      "id": 12,
      "date": "2026-10-17 09:42:10",
      "documents": 300,
      "status": "ACTIVE",
      "transferred_at": null,
      "from_plan_name": null
    },
    {
      "id": 7,
      "date": "2025-06-03 15:10:44",
      "documents": 500,
      "status": "TRANSFERRED",
      "transferred_at": "2025-10-29",
      "from_plan_name": "PLAN BÁSICO"
    }
  ],
  "success": true
}
```

En el ejemplo, de los 500 documentos de la recarga `TRANSFERRED` quedaron 200 sin usar al cambiar de plan. Esos 200 pasaron al plan actual y están dentro de `base_documents` (8000 del plan + 200). La recarga sigue mostrando `documents: 500`.

</details>

<details>
<summary>❌ Sin suscripción activa (HTTP 404)</summary>

```json
{
  "success": false,
  "message": "No tienes una suscripción activa"
}
```

</details>

<details>
<summary>❌ Otros errores</summary>

| HTTP | Causa |
|---|---|
| `401` | Petición sin autenticar. |
| `403` | Usuario sin empresa, empresa inactiva o `client_uuid` de una empresa que no es sub-cuenta activa de quien llama. |
| `404` | `Empresa no encontrada.` |

</details>

</details>

### 🆕 Guía rápida: cuotas para clientes {#guia-cuotas}

Usa siempre el token de la Casa de Software.

1. **Resuelve el ID del cliente:** `GET /company/customers?uuid={client_uuid}` y toma `dataRecords.data[0].id`, que también está en `dataRecords.data[0].company.customer_id`. No uses `company.id`: es el ID de la relación, no el del cliente (ver [Gestión de Clientes](./11-company.md#clientes-casa-software)).
2. **Verifica la disponibilidad (opcional):** `GET /memberships/summary`, **sin** `client_uuid`.
3. **Asigna la cuota:** `POST /memberships/quotas`, **sin** `client_uuid` y con el body en `snake_case`.
4. **Para ajustarla**, vuelve a llamar al `POST` con el nuevo total: reemplaza la cuota anterior, no se suma.
5. **Para liberarla**, `DELETE /memberships/quotas/{clientCompanyId}`, con el mismo `client_company_id` usado al asignar.

:::tip Guarda el ID del cliente
El `id` numérico de la empresa cliente es su identificador permanente. Guárdalo junto al `uuid` en tu sistema y no tendrás que consultar `/company/customers` antes de cada asignación.
:::

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/memberships/quotas</b> — Asignar o Actualizar Cuota de un Cliente</summary>

```http
POST {{url}}/memberships/quotas
Authorization: Bearer {token}
Content-Type: application/json
```

Permite a una Casa de Software reservar una parte de la bolsa de documentos de su plan para una empresa cliente. Un cliente con cuota consume de su cuota; un cliente sin cuota consume de la bolsa compartida de la Casa de Software.

:::danger No envíes `client_uuid`
Usa el token de la **Casa de Software** y no agregues `client_uuid`: el cliente se identifica solo con `client_company_id`. Con el `client_uuid` de una sub-cuenta propia, la sub-cuenta pasa a ser quien actúa y la API rechaza la petición (por lo general con `422`); con un `client_uuid` ajeno, `403`.
:::

**Parámetros del Body** (JSON plano, en `snake_case`):

:::note Nombres de campos
Los campos van en **snake_case**. Nombres en otro formato (`clientCompanyId`, `startDate`, `endDate`, `folios`) no se reconocen: se ignoran y la API responde `422` por los campos requeridos que faltan.
:::

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `client_company_id` | `integer` | ✅ Sí | `id` de la empresa cliente: el `id` de primer nivel de cada cliente en `GET /company/customers` (no el `id` del objeto `company` anidado). |
| `assigned_documents` | `integer` | ✅ Sí | Documentos a reservar. Mínimo `0`. |
| `start_date` | `string` | ✅ Sí | Inicio de vigencia de la cuota (`YYYY-MM-DD`). |
| `end_date` | `string` | ✅ Sí | Fin de vigencia (`YYYY-MM-DD`). Debe ser igual o posterior a `start_date`. |

```json
{
  "client_company_id": 1262,
  "assigned_documents": 500,
  "start_date": "2026-10-14",
  "end_date": "2027-10-13"
}
```

**Reglas de negocio:**

- Es un **upsert**: si el cliente ya tiene cuota en la suscripción activa, la cuota se **reemplaza** con los nuevos valores; no se suma a la anterior.
- La Casa de Software debe tener una suscripción activa que no sea el plan FREE, y la empresa cliente debe estar asociada a la Casa de Software.
- En planes con bolsa finita, `assigned_documents` no puede superar lo disponible: el menor entre (bolsa − asignado a otros clientes con fechas que se solapan) y (bolsa − consumido).
- En planes ilimitados no se valida la bolsa: la cuota es opcional y funciona como límite de control para ese cliente.

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

```json
{
  "message": "Cuota asignada correctamente.",
  "quota": {
    "id": 58,
    "uuid": "9b2f6d0e-3c1a-4f7e-8a51-2d6c0b9e4f13",
    "subscription_id": 311,
    "client_company_id": 1262,
    "assigned_documents": 500,
    "start_date": "2026-10-14T05:00:00.000000Z",
    "end_date": "2027-10-13T05:00:00.000000Z",
    "created_at": "2026-10-14T20:15:03.000000Z",
    "updated_at": "2026-10-14T20:15:03.000000Z"
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Documentos insuficientes (HTTP 409)</summary>

```json
{
  "message": "No tiene suficientes documentos disponibles para asignar. Disponibles: 2800, Solicitados: 3000",
  "available_documents": 2800,
  "requested_documents": 3000,
  "total_documents": 10000,
  "consumed_documents": 7200,
  "already_assigned": 0,
  "success": false
}
```

La validación final de disponibilidad, que descuenta lo asignado a otros clientes, puede responder también con este formato:

```json
{
  "success": false,
  "message": "No tienes suficientes documentos disponibles para asignar. Disponibles: 2800 (Bolsa: 10000, Asignados: 2500, Consumidos: 7200)"
}
```

</details>

<details>
<summary>❌ Error de validación (HTTP 422)</summary>

```json
{
  "message": "La fecha de finalización es obligatoria.",
  "errors": {
    "end_date": ["La fecha de finalización es obligatoria."]
  }
}
```

Con el body en `camelCase` (por ejemplo `clientCompanyId`, `startDate`, `endDate`) faltan los cuatro campos y `errors` los lista todos. El `message` es el primer error seguido del total restante, que la API devuelve en inglés:

```json
{
  "message": "El ID de la compañía cliente es obligatorio. (and 3 more errors)",
  "errors": {
    "client_company_id": ["El ID de la compañía cliente es obligatorio."],
    "assigned_documents": ["El número de documentos asignados es obligatorio."],
    "start_date": ["La fecha de inicio es obligatoria."],
    "end_date": ["La fecha de finalización es obligatoria."]
  }
}
```

</details>

<details>
<summary>❌ Otros errores</summary>

| HTTP | Mensaje | Causa |
|---|---|---|
| `400` | `Solo los usuarios DESARROLLADORES pueden asignar cuotas a clientes.` | El token no pertenece a una Casa de Software. |
| `402` | `El plan FREE no permite asignar cuotas a clientes. Actualice su plan para acceder a esta funcionalidad.` | La Casa de Software tiene plan FREE. |
| `402` | `El desarrollador no tiene una suscripción activa.` | No hay suscripción vigente. |
| `403` | `Acceso no autorizado. ...` | Se envió un `client_uuid` de una empresa sin relación activa. |
| `422` | `Esta compañía no es un cliente válido para el desarrollador.` | La empresa existe pero no es cliente de la Casa de Software, o se envió `client_uuid`. |
| `422` | `El ID de la compañía cliente es obligatorio.` / `La compañía cliente no existe.` | Falta `client_company_id`, el body no está en `snake_case` (por ejemplo `clientCompanyId`) o el ID no corresponde a ninguna empresa (puede pasar al enviar el `id` del objeto `company` anidado). |
| `422` | `La fecha de inicio es obligatoria.` / `La fecha de finalización debe ser igual o posterior a la fecha de inicio.` | Fechas ausentes o fuera de orden. |

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/memberships/quotas/&#123;clientCompanyId&#125;</b> — Eliminar Cuota de un Cliente</summary>

```http
DELETE {{url}}/memberships/quotas/{clientCompanyId}
Authorization: Bearer {token}
```

Elimina la cuota del cliente. Desde ese momento el cliente vuelve a consumir de la bolsa compartida de la Casa de Software, o de forma ilimitada si el plan es ilimitado. Usa el token de la Casa de Software y **no** envíes `client_uuid`.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `clientCompanyId` | path | ✅ Sí | `id` de la empresa cliente (el mismo `client_company_id` usado al asignar). |

| `consumption_mode` | Significado |
|---|---|
| `shared_pool` | El cliente consume de la bolsa compartida. |
| `unlimited` | El plan de la Casa de Software es ilimitado. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Cuota eliminada correctamente. El cliente ahora consume de la bolsa general.",
  "data": {
    "client_company_id": 1262,
    "consumption_mode": "shared_pool"
  },
  "success": true
}
```

Es **idempotente**: si el cliente no tenía cuota, la respuesta también es `200`, con el mensaje `El cliente no tenía cuota asignada. Ya consume de la bolsa general.` y el mismo `data`.

</details>

<details>
<summary>❌ Errores</summary>

| HTTP | Mensaje | Causa |
|---|---|---|
| `402` | `No tienes permisos para eliminar cuotas de clientes.` | El token no pertenece a una cuenta con permiso para gestionar cuotas. |
| `402` | `El desarrollador no tiene una suscripción activa.` | No hay suscripción vigente. |
| `403` | `Acceso no autorizado. ...` | Se envió un `client_uuid` de una empresa sin relación activa. |
| `404` | `La compañía cliente no existe.` | El `clientCompanyId` no corresponde a ninguna empresa. |
| `422` | `Esta compañía no es un cliente válido para el desarrollador.` | La empresa no es cliente de la Casa de Software, o se envió `client_uuid`. |

</details>

</details>

---

## 💾 Almacenamiento y Correos del Plan {#server-stats}

Consulta el uso de almacenamiento, de adjuntos y de correos frente a los límites del plan. Aceptan `client_uuid` para consultar una sub-cuenta propia; una sub-cuenta se mide contra el plan de su Casa de Software, pero solo cuenta su propio uso. En `storage` y `emails`, una Casa de Software (cuenta principal) ve el uso sumado de su cuenta y de sus sub-cuentas; `attachments` cuenta solo los adjuntos de la empresa consultada.

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/memberships/server-stats</b> — Estadísticas Completas</summary>

```http
GET {{url}}/memberships/server-stats?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve en una sola llamada los objetos `storage`, `attachments` y `emails`.

**Objeto `storage`:**

| Campo | Tipo | Descripción |
|---|---|---|
| `used_gb` | `number` | Almacenamiento usado (GB). |
| `limit_gb` | `number` | Límite del plan (GB). `0` significa sin límite. |
| `usage_percent` | `number` | Porcentaje de uso. |
| `files_count` | `integer` | Cantidad de archivos. |
| `plan_name` | `string` | Nombre del plan. |
| `is_unlimited` | `boolean` | `true` si el plan no limita el almacenamiento. |
| `status` | `string` | `unlimited`, `normal`, `warning` (desde 70 %), `critical` (desde 90 %) o `exceeded` (desde 100 %). Sin suscripción: `no_subscription`. |

**Objeto `attachments`** (adjuntos de los documentos):

| Campo | Tipo | Descripción |
|---|---|---|
| `used_gb` | `number` | Espacio usado por adjuntos (GB). |
| `used_bytes` | `integer` | Espacio usado por adjuntos (bytes). |
| `files_count` | `integer` | Cantidad de adjuntos. |
| `limit_gb` | `number` \| `null` | Límite de adjuntos (GB). `null` en el plan de Arrendamiento, donde los adjuntos comparten la cuota de `storage`. |
| `usage_percent` | `number` | Porcentaje de uso. |
| `is_shared` | `boolean` | `true` si los adjuntos comparten cuota con `storage`. |
| `plan_name` | `string` | Nombre del plan (`SIN SUSCRIPCIÓN` si no hay). |
| `status` | `string` | `shared_with_custody`, `unlimited`, `normal`, `warning`, `critical`, `exceeded` o `no_subscription`. |

**Objeto `emails`** (correos del periodo de la suscripción activa):

| Campo | Tipo | Descripción |
|---|---|---|
| `used` | `integer` | Correos enviados en el periodo. |
| `limit` | `integer` | Correos incluidos en el plan. `0` significa sin límite. |
| `remaining` | `integer` | Correos restantes. `-1` significa ilimitado. |
| `usage_percent` | `number` | Porcentaje de uso. |
| `plan_name` | `string` | Nombre del plan. |
| `status` | `string` | `unlimited`, `normal`, `critical` (desde 90 %) o `exceeded` (desde 100 %). Sin suscripción: `no_subscription`. |

Si un objeto no se puede calcular, llega como `{"error": "mensaje"}` sin afectar a los demás.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Estadísticas completas obtenidas con éxito",
  "data": {
    "storage": {
      "used_gb": 3.42,
      "limit_gb": 50,
      "usage_percent": 6.84,
      "files_count": 18250,
      "plan_name": "PLAN CASA DE SOFTWARE",
      "is_unlimited": false,
      "status": "normal"
    },
    "attachments": {
      "used_gb": 0.2154,
      "used_bytes": 231289856,
      "files_count": 412,
      "limit_gb": 50,
      "usage_percent": 0.43,
      "is_shared": false,
      "plan_name": "PLAN CASA DE SOFTWARE",
      "status": "normal"
    },
    "emails": {
      "used": 8420,
      "limit": 20000,
      "remaining": 11580,
      "usage_percent": 42.1,
      "plan_name": "PLAN CASA DE SOFTWARE",
      "status": "normal"
    }
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/memberships/server-stats/storage</b> — Almacenamiento</summary>

```http
GET {{url}}/memberships/server-stats/storage?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve los campos del objeto `storage` en el primer nivel de `data`, más el objeto `attachments`.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Estadísticas de almacenamiento obtenidas con éxito",
  "data": {
    "used_gb": 3.42,
    "limit_gb": 50,
    "usage_percent": 6.84,
    "files_count": 18250,
    "plan_name": "PLAN CASA DE SOFTWARE",
    "is_unlimited": false,
    "status": "normal",
    "attachments": {
      "used_gb": 0.2154,
      "used_bytes": 231289856,
      "files_count": 412,
      "limit_gb": 50,
      "usage_percent": 0.43,
      "is_shared": false,
      "plan_name": "PLAN CASA DE SOFTWARE",
      "status": "normal"
    }
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/memberships/server-stats/emails</b> — Correos</summary>

```http
GET {{url}}/memberships/server-stats/emails?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve los campos del objeto `emails` en `data`.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Estadísticas de emails obtenidas con éxito",
  "data": {
    "used": 8420,
    "limit": 20000,
    "remaining": 11580,
    "usage_percent": 42.1,
    "plan_name": "PLAN CASA DE SOFTWARE",
    "status": "normal"
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/memberships/server-stats/emails/resend-count/&#123;documentId&#125;</b> — Reenvíos de un Documento</summary>

```http
GET {{url}}/memberships/server-stats/emails/resend-count/{documentId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Indica cuántas veces se ha enviado por correo un documento y cuántos reenvíos le quedan según el plan.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `documentId` | path | ✅ Sí | ID del documento. |
| `client_uuid` | query | No | UUID de una sub-cuenta propia y activa. |

| Campo | Tipo | Descripción |
|---|---|---|
| `current_count` | `integer` | Envíos registrados del documento. |
| `max_allowed` | `integer` | Reenvíos permitidos por el plan. `0` significa ilimitado. |
| `remaining` | `integer` | Reenvíos restantes. `-1` significa ilimitado. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Estadísticas de reenvío obtenidas con éxito",
  "data": {
    "current_count": 2,
    "max_allowed": 5,
    "remaining": 3
  },
  "success": true
}
```

</details>

</details>
