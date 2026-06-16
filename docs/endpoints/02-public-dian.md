---
sidebar_position: 2
sidebar_label: Tablas y Catálogos
---

# 🟢 Endpoints Públicos y Tablas DIAN

<div style={{backgroundColor: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745', margin: '1.5rem 0'}}>
  <strong>❌ Autenticación NO requerida</strong><br/>
  Estos endpoints obtienen información de consulta (tablas DIAN, configuraciones, etc.) sin necesidad de token de acceso.
</div>

### Estructura de Respuesta Estándar

Todas las respuestas de consulta de catálogos siguen este patrón:

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "code": "01",
        "name": "Factura de Venta"
      }
    ]
  },
  "success": true
}
```

## Tablas Referenciadas DIAN (GET)

**¿Cuándo usar?** Para obtener códigos válidos antes de enviar un documento.

### Documentos Electrónicos

| Endpoint | Uso | Respuesta |
|----------|-----|-----------|
| `/destination-environment` | Ambiente de Destino | Producción, Pruebas |
| `/document-type` | Tipos de Documentos | 01=Factura, 02=Exportación, etc. |
| `/payment-methods` | Métodos de Pago | Formas de pago válidas |
| `/payment-means` | Medios de Pago | Efectivo, Tarjeta, etc. |
| `/identity-documents` | Identidades | CC, NIT, Pasaporte, etc. |
| `/fiscal-regime` | Régimen Fiscal | Responsabilidades fiscales |
| `/accounting-regime` | Régimen Contable | Códigos contables |
| `/delivery-conditions` | INCOTERMS | - |
| `/correction-notes` | Motivos de corrección | - |
| `/discount-codes` | Códigos de descuento | - |
| `/operation-type` | Tipo de operación | Nacional, Exportación |
| `/taxes` | Tributos e impuestos | - |
| `/quantity-units` | Unidades de cantidad | Kg, Lt, Pz, etc. |
| `/reference-price` | Unidad de referencia | - |
| `/cities` | Ciudades | - |
| `/departments` | Departamentos | - |
| `/countries` | Países | - |
| `/currencies` | Monedas | - |

### Nómina Electrónica (GET)

| Endpoint | Uso |
|----------|-----|
| `/ep/adjustment-note-type` | Tipo de ajuste a la nota de ajuste |
| `/ep/contract-type` | Tipo de contrato |
| `/ep/disability-type` | Tipo de discapacidad |
| `/ep/extra-hours` | Horas extras |
| `/ep/payroll-period` | Periodicidad de la nómina |
| `/ep/worker-type` | Tipo de trabajo |
| `/ep/worker-subtype` | Subtipo de trabajo |

---

## 🛠️ Otras Consultas y Utilidades Públicas

### Dígito de Verificación (DV) - 🟢 GET
```http
GET {{url}}/dv/{nit}
```
Obtiene el dígito de verificación para un número de identificación (NIT/RUT).


### Números a Letras - 🟢 GET
```http
GET {{url}}/numbersToLetters/{numero}
```
Útil para convertir valores monetarios numéricos a su representación en letras requerida en algunas representaciones gráficas.
