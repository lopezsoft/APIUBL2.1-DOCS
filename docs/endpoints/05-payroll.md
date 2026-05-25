---
sidebar_position: 5
sidebar_label: Nómina Electrónica
---

# 💼 Nómina Electrónica

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

El Documento Soporte de Pago de Nómina Electrónica es el soporte de los costos y deducciones en el impuesto sobre la renta derivado de los pagos relacionados con la nómina.

### Enviar Nómina - 🟘 POST
```http
POST {{url}}/ep/payroll
Authorization: Bearer {token}
Content-Type: application/json
```
Transmite el documento soporte de pago de nómina electrónica a la DIAN.

### Enviar Nota de Ajuste - Reemplazo - 🟘 POST
```http
POST {{url}}/ep/payroll/replace
Authorization: Bearer {token}
```
**Uso:** Corregir un documento de nómina previamente enviado. La DIAN asume este nuevo documento como el reemplazo legal (corrección de valores).

### Enviar Nota de Ajuste - Eliminación - 🟘 POST
```http
POST {{url}}/ep/payroll/delete
Authorization: Bearer {token}
```
**Uso:** Eliminar un documento de nómina de forma legal ante la DIAN si este fue generado por error y no se reemplazará por otro en el periodo actual.
