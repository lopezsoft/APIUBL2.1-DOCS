---
id: doc-cancel-eventos-radian-2026-08-25
title: Endpoint de Cancelación de Eventos RADIAN en PENDING
sidebar_position: 100
---

# 🚫 Endpoint de Cancelación de Eventos RADIAN en Estado PENDING

**Fecha y hora de creación:** 25 de Agosto de 2026, 21:14:00 -05:00  
**Ruta del endpoint:** `POST /api/ubl2.1/events/{id}/cancel`  
**Módulo:** ⚡ Eventos RADIAN  

---

## 1. Contexto y Causa Raíz

En el flujo asíncrono de eventos RADIAN, cuando un usuario registra un evento (como el Acuse de Recibo `030`, Reclamo `031`, Recibo de Bien `032` o Aceptación `033`), el evento se almacena inicialmente con estado `PENDING` en la tabla `event_masters`.

Posteriormente, el job programado en segundo plano **`ProcessEventsMasterJob`** (que se ejecuta automáticamente cada minuto vía cron) toma los eventos pendientes, construye el XML correspondiente y los transmite formalmente al servicio web SOAP de la DIAN.

**Problema identificado:** No existía ningún mecanismo operativo ni endpoint en la API que permitiera al usuario cancelar un evento registrado por error durante la ventana de tiempo previa a la ejecución del job de fondo.

---

## 2. Solución Arquitectónica

Se implementó el endpoint **`POST /events/{id}/cancel`** con las siguientes características técnicas:

### 2.1 Control de Concurrencia y Bloqueo Pesimista
Para evitar condiciones de carrera (*race condition*) entre la solicitud HTTP del cliente y el job `ProcessEventsMasterJob` ejecutándose concurrentemente en el worker de colas, la consulta del registro utiliza **`lockForUpdate()`** a nivel de base de datos dentro de una transacción.

### 2.2 Máquina de Estados y Reglas de Transición
* **Transición permitida:** Únicamente `PENDING` → `CANCELLED`.
* **Transiciones rechazadas:** Si el evento ya se encuentra en `PROCESSING` (siendo firmado o transmitido), `ACCEPTED` (autorizado por la DIAN) o `REJECTED` (rechazado por validación previa), la petición es rechazada de forma determinista con código **HTTP 400 Bad Request**.

---

## 3. Especificación del Endpoint

### Petición HTTP

```http
POST {{url}}/events/{id}/cancel?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

### Parámetros

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|:---------:|-------------|
| `id` | Path | `integer` | ✅ Sí | ID numérico del registro del evento en la tabla `event_masters` (**no** el CUFE/trackId). |
| `client_uuid` | Query | `string` | No | UUID del cliente cuando se opera bajo el modelo multi-tenant de Casa de Software. |

---

## 4. Matriz de Códigos de Respuesta HTTP

### 4.1 Cancelación Exitosa (HTTP 200 OK)
El evento se encontraba en `PENDING` y su estado se actualizó a `CANCELLED`:
```json
{
  "message": "Evento cancelado exitosamente.",
  "success": true
}
```

### 4.2 Evento No Cancelable (HTTP 400 Bad Request)
El evento ya fue tomado por el cron o ya finalizó su ciclo:
```json
{
  "message": "El evento no se puede cancelar porque ya se encuentra en procesamiento o fue transmitido a la DIAN.",
  "success": false
}
```

### 4.3 Recurso No Encontrado (HTTP 404 Not Found)
El ID no existe o no pertenece a la empresa autenticada / `client_uuid`:
```json
{
  "message": "Evento no encontrado o no pertenece a la empresa autenticada.",
  "success": false
}
```
