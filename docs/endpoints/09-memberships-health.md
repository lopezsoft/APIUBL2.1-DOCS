---
sidebar_position: 9
sidebar_label: 🏥 Membresías y Salud
---

# 📊 Gestión de Membresías y Consumo

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

Esta sección abarca la gestión de cuotas de emisión, límites de plan y analíticas de consumo en tiempo real, diseñado para casas de software, ERPs y plataformas SaaS integradoras.

---

## Membresías y Consumo {#memberships-consumption}

Permite a los integradores consultar los límites de plan, consumo diario/mensual y métricas avanzadas.

### Resumen de Membresía - 🟢 GET
```http
GET {{url}}/memberships/summary
Authorization: Bearer {token}
```
Obtiene el resumen de la membresía: tipo de plan, límites, consumo, validez y cuotas asignadas a los clientes (con paginación).

---

### Consumo Actual - 🟢 GET
```http
GET {{url}}/memberships/analytics/consumption
Authorization: Bearer {token}
```
Consulta el nivel de consumo, los porcentajes de utilización, límites diarios/mensuales y las fechas de corte o renovación.

---

### Asignar Cuotas a Clientes - 🔵 POST
```http
POST {{url}}/memberships/quotas
Authorization: Bearer {token}
Content-Type: application/json
```
Permite a una casa de software establecer sub-cuotas de emisión de documentos para una empresa cliente.

**Body (JSON):**
```json
{
  "client_company_id": 45,
  "assigned_documents": 500,
  "start_date": "2026-01-01",
  "end_date": "2026-12-31"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `client_company_id` | integer | ✅ Sí | ID de la empresa cliente a la que se le asigna la cuota. |
| `assigned_documents` | integer | ✅ Sí | Cantidad de documentos asignados. |
| `start_date` | string | No | Fecha inicio de vigencia (YYYY-MM-DD). |
| `end_date` | string | No | Fecha fin de vigencia (YYYY-MM-DD). |

---

### Analíticas Avanzadas de Membresía - 🟢 GET

Todos estos endpoints requieren `Authorization: Bearer {token}`:

| Endpoint | Método | Descripción |
|---|---|---|
| `{{url}}/memberships/analytics/overview` | `GET` | Resumen ejecutivo de uso y estado global de la cuenta. |
| `{{url}}/memberships/analytics/conversions` | `GET` | Métricas de conversión y tasa de éxito de emisión. |
| `{{url}}/memberships/analytics/notifications` | `GET` | Notificaciones proactivas de consumos altos o próximos al límite de la cuota. |
| `{{url}}/memberships/analytics/abuse-patterns` | `GET` | Detección de anomalías o patrones inusuales de tráfico. |
| `{{url}}/memberships/analytics/revenue-projection` | `GET` | Proyección estimada de costos y consumo. |
| `{{url}}/memberships/analytics/dashboard` | `GET` | Datos estructurados listos para renderizar en tableros de control. |
| `{{url}}/memberships/analytics/clear-cache` | `POST` | Invalida y limpia la memoria caché temporal de estadísticas de la cuenta. |

