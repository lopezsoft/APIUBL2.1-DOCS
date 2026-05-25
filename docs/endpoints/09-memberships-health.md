---
sidebar_position: 9
sidebar_label: Analíticas y Salud
---

# 📊 Analíticas de Membresías y Sector Salud

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

Esta sección abarca dos grandes submódulos: la gestión analítica y cuotas de membresías (especial para SaaS o ERPs integradores), y las consultas especializadas del sector salud.

---

## Membresías y Consumo

Permite a los integradores consultar los límites de plan, consumo diario/mensual y métricas avanzadas.

### Resumen de Membresía - 🟢 GET
```http
GET {{url}}/memberships/summary
```
Obtiene el resumen de la membresía: tipo de plan, límites, consumo, validez y cuotas asignadas a los clientes (con paginación).

### Consumo Actual - 🟢 GET
```http
GET {{url}}/memberships/analytics/consumption
```
Consulta el nivel de consumo, los porcentajes de utilización, límites diarios/mensuales y las fechas de corte o renovación.

### Asignar Cuotas a Clientes - 🔵 POST
```http
POST {{url}}/memberships/quotas
```
Permite a una casa de software establecer sub-cuotas de emisión de documentos para una empresa cliente.
**Cuerpo:** `client_company_id`, `assigned_documents`, `start_date`, `end_date`.

### Otras Analíticas (Endpoints) - 🟢 GET
- `/memberships/analytics/overview` (Resumen analítico)
- `/memberships/analytics/conversions` (Métricas de conversión y uso de API)
- `/memberships/analytics/notifications` (Notificaciones proactivas de consumos altos o próximos al límite)
- `/memberships/analytics/abuse-patterns` (Detección de patrones anómalos o de abuso de consumo)
- `/memberships/analytics/revenue-projection` (Proyección de facturación)
- `/memberships/analytics/dashboard` (Datos preparados para visualización en panel de control)
- `/memberships/analytics/clear-cache` (POST) Limpia la caché estadística temporal del usuario.

---

## 🏥 Sector Salud

Permite consultar los catálogos y tablas paramétricas específicas para la facturación electrónica del sector salud.

### Tipo de Usuario en Salud - 🟢 GET
```http
GET {{url}}/health/user-type
```
Consulta los tipos de usuario admitidos (Ej. Contributivo, Subsidiado, Vinculado, Particular, etc.).

### Modalidades de Contratación y Pago - 🟢 GET
```http
GET {{url}}/health/contracting
```
Catálogo de modalidades de pago en salud (Ej. Pago por evento, Capitación, PGP, etc.).

### Cobertura o Plan de Beneficios - 🟢 GET
```http
GET {{url}}/health/coverage
```
Catálogo de planes de beneficios (Ej. PBS subsidiado, Plan complementario, Póliza de salud, etc.).
