---
sidebar_position: 9
sidebar_label: 📊 Membresías
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📊 Gestión de Membresías y Consumo {#membresias}

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

Esta sección abarca la gestión de cuotas de emisión, límites de plan y analíticas de consumo en tiempo real, diseñado para casas de software, ERPs y plataformas SaaS integradoras.

---

## 📈 Membresías y Consumo {#memberships-consumption}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/memberships/summary</b> — Resumen de Membresía</summary>

```http
GET {{url}}/memberships/summary
Authorization: Bearer {token}
```

Obtiene el resumen de la membresía: tipo de plan, límites, consumo, validez y cuotas asignadas a los clientes (con paginación).

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": {
      "plan": "Enterprise",
      "total_documents": 10000,
      "used_documents": 3254,
      "remaining_documents": 6746,
      "renewal_date": "2027-01-01",
      "is_active": true
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Plan sin cuota (HTTP 402)</summary>

```json
{
  "message": "Su plan de membresía no tiene documentos disponibles.",
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/memberships/analytics/consumption</b> — Consumo Actual</summary>

```http
GET {{url}}/memberships/analytics/consumption
Authorization: Bearer {token}
```

Consulta el nivel de consumo, los porcentajes de utilización, límites diarios/mensuales y las fechas de corte o renovación.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": {
      "daily_used": 45,
      "daily_limit": 500,
      "monthly_used": 3254,
      "monthly_limit": 10000,
      "usage_percentage": 32.5,
      "cut_date": "2026-08-31"
    }
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/memberships/quotas</b> — Asignar Cuotas a Clientes</summary>

```http
POST {{url}}/memberships/quotas
Authorization: Bearer {token}
Content-Type: application/json
```

Permite a una casa de software establecer sub-cuotas de emisión de documentos para una empresa cliente.

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `client_company_id` | `integer` | ✅ Sí | ID de la empresa cliente. |
| `assigned_documents` | `integer` | ✅ Sí | Cantidad de documentos asignados. |
| `start_date` | `string` | No | Fecha inicio de vigencia (`YYYY-MM-DD`). |
| `end_date` | `string` | No | Fecha fin de vigencia (`YYYY-MM-DD`). |

```json
{
  "client_company_id": 45,
  "assigned_documents": 500,
  "start_date": "2026-01-01",
  "end_date": "2026-12-31"
}
```

</details>

---

## 📊 Analíticas Avanzadas {#analiticas}

:::tip Caché de estadísticas
Las analíticas avanzadas se calculan con caché para mejor rendimiento. Usa `POST /memberships/analytics/clear-cache` para invalidar el caché y forzar datos en tiempo real.
:::

| Endpoint | Método | Descripción |
|---|---|---|
| `/memberships/analytics/overview` | <span className="badge badge--info">GET</span> | Resumen ejecutivo de uso y estado global de la cuenta. |
| `/memberships/analytics/conversions` | <span className="badge badge--info">GET</span> | Métricas de conversión y tasa de éxito de emisión. |
| `/memberships/analytics/notifications` | <span className="badge badge--info">GET</span> | Notificaciones proactivas de consumos altos o próximos al límite. |
| `/memberships/analytics/abuse-patterns` | <span className="badge badge--info">GET</span> | Detección de anomalías o patrones inusuales de tráfico. |
| `/memberships/analytics/revenue-projection` | <span className="badge badge--info">GET</span> | Proyección estimada de costos y consumo. |
| `/memberships/analytics/dashboard` | <span className="badge badge--info">GET</span> | Datos estructurados listos para renderizar en tableros de control. |
| `/memberships/analytics/clear-cache` | <span className="badge badge--success">POST</span> | Invalida la caché temporal de estadísticas de la cuenta. |
