---
sidebar_position: 3
sidebar_label: Facturación y POS
---

# 📄 Facturación y Documentos Equivalentes (POS)

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## 1. Emisión de Facturas (Invoices)

### Enviar Factura - 🟘 POST
```http
POST {{url}}/invoice
Authorization: Bearer {token}
Content-Type: application/json
```

**Tipos soportados principales:**
- Factura nacional (01)
- Factura de exportación (02)
- Factura contingencia (03, 04)

**Ejemplos de Casos Soportados (Según Colección Postman):**
*   Factura Básica, Decimales, Ajustes.
*   Factura Sector Salud, Mandatos, Compra y Venta de Divisas.
*   Factura con Propina, Obsequio (Regalos), Descuentos, Retenciones y Cargos.
*   Facturas en Moneda Extranjera (Euro, USD) y Exportación.
*   Factura con Impuestos (Licores AD VALOREM / ICL, ICUI, Bolsas, Varios impuestos).

**Body:** JSON con estructura completa. Ver [Campos de Documentos](/docs/billing-fields) para todos los detalles técnicos.

**Respuesta Exitosa:**
Retorna el `document_key` (CUFE/CUDE), estado de validación DIAN y el XML procesado.

---

## 2. Notas de Crédito y Débito

### Enviar Nota Crédito - 🟘 POST
```http
POST {{url}}/notes/credit
Authorization: Bearer {token}
Content-Type: application/json
```
**Casos:** Devoluciones, Descuentos globales, Correcciones hacia abajo.
**Campo Clave:** `type_document_id: 5`

### Enviar Nota Débito - 🟘 POST
```http
POST {{url}}/notes/debit
Authorization: Bearer {token}
Content-Type: application/json
```
**Casos:** Intereses, Cargos adicionales, Correcciones hacia arriba.
**Campo Clave:** `type_document_id: 4`

---

## 3. Documentos Equivalentes (POS y Otros)

### POS Electrónico (Documento 20) - 🟘 POST
```http
POST {{url}}/invoice
Authorization: Bearer {token}
Content-Type: application/json
```
**Casos:**
*   POS con cliente (consumidor final u otros).
*   POS sin envío de email.
**Campo Clave:** `type_document_id: 20` (P.O.S)

### Notas para POS - 🟘 POST
```http
POST {{url}}/notes/credit
POST {{url}}/notes/debit
```
Notas de crédito o débito asociadas a un documento P.O.S.

### Boleta de Ingreso a Cine - 🟘 POST
```http
POST {{url}}/invoice
```
Documento equivalente para ingreso a cine (Documento 25).

### 60 SPD (Servicios Públicos Domiciliarios) - 🟘 POST
```http
POST {{url}}/invoice
```
Factura o documento equivalente por servicios públicos domiciliarios.
