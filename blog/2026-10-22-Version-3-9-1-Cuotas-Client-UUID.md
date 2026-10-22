---
slug: version-3-9-1-cuotas-client-uuid
title: Version 3.9.1 - Cuotas de clientes con client_uuid
authors: [lewis]
tags: [release, v3-9-1, membresias, cuotas, casas-de-software]
---

Las Casas de Software ahora identifican al cliente de una cuota con su `client_uuid`, igual que en el resto de la API.

<!--truncate-->

### Qué cambia

| Antes | Ahora |
|---|---|
| `POST /memberships/quotas` con `client_company_id` (id numérico) | `POST /memberships/quotas` con `client_uuid` (body o query) |
| `DELETE /memberships/quotas/{clientCompanyId}` | `DELETE /memberships/quotas/{client_uuid}` |
| Enviar `client_uuid` hacía actuar al cliente y la petición fallaba | La Casa de Software es siempre la empresa del token |
| Cliente ajeno: `422` | Cliente ajeno o inexistente: `404 El cliente no existe.` |
| Solo Desarrollador podía asignar | Administrador y Desarrollador pueden asignar y eliminar |

```json
{
  "client_uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
  "assigned_documents": 500,
  "start_date": "2026-10-14",
  "end_date": "2027-10-13"
}
```

La respuesta incluye `client_uuid`, además de `client_company_id`.

:::caution Obsoleto
`client_company_id` en el `POST` y el `id` numérico en la ruta del `DELETE` siguen funcionando por ahora, con la misma validación de pertenencia, pero se retirarán. Migra a `client_uuid`.
:::

[Ver la guía de cuotas](/docs/endpoints/memberships-health/#guia-cuotas)
