---
sidebar_position: 4
sidebar_label: Documento Soporte
---

# 📦 Documento Soporte

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

Los documentos soporte son utilizados para certificar las adquisiciones efectuadas a sujetos **no obligados a expedir factura de venta** o documento equivalente.

## Enviar Documento Soporte - 🟘 POST
```http
POST {{url}}/ds/document
Authorization: Bearer {token}
Content-Type: application/json
```
**Variantes disponibles:**
- Documento Soporte Residente.
- Documento Soporte No Residente.
- Casos especiales: IVA + RTE IVA, con decimales.

## Enviar Nota de Ajuste (Documento Soporte) - 🟘 POST
```http
POST {{url}}/ds/adjustment-note
Authorization: Bearer {token}
Content-Type: application/json
```
**Variantes disponibles:**
- Nota de ajuste a Documento Soporte Residente y No Residente.
- Nota de ajuste con IVA + RTE IVA.

**Uso:** Para ajustar valores de un documento soporte previamente emitido (notas crédito/débito en el entorno de documento soporte).
