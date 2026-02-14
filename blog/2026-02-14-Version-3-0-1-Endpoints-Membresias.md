---
slug: version-3-0-1-endpoints-membresias
title: Versión 3.0.1 - Nuevos Endpoints de Membresías
authors: [lewis]
tags: [release, v3.0.1, memberships, quotas, documentation]
date: 2026-02-14
---

# 📊 API UBL 2.1 v3.0.1 - Gestión Avanzada de Membresías

Nos complace anunciar la **versión 3.0.1** de nuestra API de Facturación Electrónica, que expande las capacidades del sistema de membresías introducido en v3.0.0.

Esta actualización incluye:

- **📦 Asignación de Cuotas** - Distribuye documentos a tus clientes (casas de software)
- **📈 Resumen de Membresía** - Consulta completa de límites, consumo y cuotas asignadas
- **📖 Documentación Mejorada** - Ejemplos cURL y esquemas de respuesta detallados

<!--truncate-->

## 🎯 ¿Qué hay de nuevo?

### 📦 Asignación de Cuotas a Clientes

Las **casas de software** ahora pueden asignar cuotas de documentos a sus clientes de forma programática, permitiendo una gestión más flexible de los recursos.

**Endpoint:** `POST /ubl2.1/memberships/quotas`

**Casos de uso:**

- Distribuir documentos de tu plan entre múltiples clientes
- Establecer límites personalizados por cliente
- Configurar períodos de vigencia específicos
- Gestionar renovaciones automáticas

**Ejemplo de solicitud:**

```bash
curl --location 'https://api.matias-api.com/api/ubl2.1/memberships/quotas' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {token}' \
--data '{
    "client_company_id": "155",
    "assigned_documents": "100",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31"
}'
```

**Respuesta:**

```json
{
  "message": "Cuota asignada correctamente.",
  "quota": {
    "id": 3,
    "uuid": "25d8b421-8687-4600-bd14-db00a867460b",
    "subscription_id": 1,
    "client_company_id": 155,
    "assigned_documents": 100,
    "consumed_documents": 0,
    "start_date": "2026-01-01T05:00:00.000000Z",
    "end_date": "2026-12-31T05:00:00.000000Z",
    "created_at": "2025-08-19T02:47:17.000000Z",
    "updated_at": "2026-02-14T15:47:59.000000Z"
  },
  "success": true
}
```

---

### 📈 Resumen Completo de Membresía

Nuevo endpoint que proporciona una **vista unificada** de tu membresía, incluyendo:

- Tipo de cuenta y plan contratado
- Límites totales y consumo actual
- Cuotas asignadas a clientes con paginación
- Información detallada de cada cliente

**Endpoint:** `GET /ubl2.1/memberships/summary`

**Ejemplo de solicitud:**

```bash
curl --location 'https://api.matias-api.com/api/ubl2.1/memberships/summary' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {token}'
```

**Respuesta:**

```json
{
  "data": {
    "type": "developer",
    "plan_name": "PLAN EMPRENDEDOR",
    "is_unlimited": 0,
    "valid_until": "2027-01-30",
    "limit": 3000,
    "consumed": 1533,
    "assigned_quotas": {
      "current_page": 1,
      "data": [
        {
          "id": 3,
          "uuid": "25d8b421-8687-4600-bd14-db00a867460b",
          "subscription_id": 1,
          "client_company_id": 155,
          "assigned_documents": 100,
          "consumed_documents": 0,
          "start_date": "2026-01-01T05:00:00.000000Z",
          "end_date": "2026-12-31T05:00:00.000000Z",
          "client": {
            "id": 155,
            "company_name": "SALAS MACHADO CARLOS ALBERTO",
            "full_path_image": ""
          }
        }
      ],
      "per_page": 15,
      "total": 1
    }
  }
}
```

---

## 💡 Beneficios para Casas de Software

### Gestión Centralizada

- **Un solo plan**, múltiples clientes
- Asignación flexible de recursos
- Control granular de límites

### Transparencia Total

- Visibilidad completa del consumo
- Seguimiento por cliente
- Alertas proactivas de límites

### Automatización

- Integración vía API
- Renovaciones programadas
- Gestión self-service

---

## 📖 Documentación Actualizada

Hemos mejorado significativamente la documentación de endpoints:

✅ **Ejemplos cURL completos** - Listos para copiar y pegar  
✅ **Tablas de parámetros** - Tipos, requerimientos y descripciones  
✅ **Esquemas de respuesta** - Estructuras JSON detalladas  
✅ **Descripciones de campos** - Explicación de cada propiedad

📖 **[Ver documentación completa de Membresías](/docs/endpoints#membresías-y-consumo)**

---

## 🔄 Compatibilidad

Esta es una **actualización menor (patch)** que:

✅ **No rompe compatibilidad** con v3.0.0  
✅ **Agrega funcionalidad** sin cambios disruptivos  
✅ **Mantiene todos los endpoints** existentes

No se requiere ninguna acción para usuarios actuales. Los nuevos endpoints están disponibles inmediatamente.

---

## 🚀 Próximos Pasos

### Para Casas de Software

1. **Revisa la documentación** de los nuevos endpoints
2. **Planifica la distribución** de cuotas entre tus clientes
3. **Implementa la integración** usando los ejemplos cURL
4. **Monitorea el consumo** con el endpoint de resumen

### Para Todos los Usuarios

- Consulta tu resumen de membresía para conocer tu consumo actual
- Verifica las cuotas asignadas si eres cliente de una casa de software
- Actualiza tus dashboards con los nuevos datos disponibles

---

## 📚 Recursos

- 📖 [Documentación de Endpoints](/docs/endpoints)
- 📖 [Guía de Membresías](/docs/endpoints#membresías-y-consumo)
- 💻 [Colección Postman](https://documenter.getpostman.com/view/8699065/2s9YyvBLby)
- 💬 [Soporte Técnico](mailto:soporte@matias-api.com)

---

## 🙏 Feedback

¿Tienes sugerencias para mejorar el sistema de membresías? ¿Necesitas funcionalidades adicionales? Contáctanos en soporte@matias-api.com

---

**Equipo de Desarrollo API Matias**  
_Facturación Electrónica para Colombia_

---

_Versión 3.0.1 | Febrero 2026_
