---
sidebar_position: 2
sidebar_label: 🟢 Tablas y Catálogos
---

# 🟢 Endpoints Públicos, Tablas DIAN y Funciones Auxiliares

<div style={{backgroundColor: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745', margin: '1.5rem 0'}}>
  <strong>❌ Autenticación NO requerida</strong><br/>
  Estos endpoints obtienen información de consulta (tablas paramétricas DIAN, catálogos del sistema y funciones auxiliares de cálculo) sin necesidad de token de acceso ni parámetro <code>client_uuid</code>.
</div>

### Estructura de Respuesta Estándar de Catálogos

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

---

## Tablas Referenciadas DIAN (GET)

**¿Cuándo usar?** Para obtener códigos válidos antes de construir y enviar un documento electrónico.

### Documentos Electrónicos

| Endpoint | Uso | Respuesta |
|----------|-----|-----------|
| `/destination-environment` | Ambiente de Destino | Producción, Pruebas |
| `/document-type` | Tipos de Documentos | 01=Factura, 02=Exportación, etc. |
| `/payment-methods` | Métodos de Pago | Formas de pago válidas |
| `/payment-means` | Medios de Pago | Efectivo, Tarjeta, etc. |
| `/identity-documents` | Identidades | CC, NIT, Pasaporte, etc. |
| `/organization-type` | Tipo de Organización | 1=Persona Jurídica, 2=Persona Natural |
| `/fiscal-regime` | Régimen Fiscal | Responsabilidades fiscales |
| `/accounting-regime` | Régimen Contable | Códigos contables |
| `/delivery-conditions` | INCOTERMS | Términos de entrega |
| `/correction-notes` | Motivos de corrección | Notas crédito/débito |
| `/discount-codes` | Códigos de descuento | Tipos de descuento |
| `/operation-type` | Tipo de operación | Nacional, Exportación |
| `/taxes` | Tributos e impuestos | IVA, ICA, INC, etc. |
| `/quantity-units` | Unidades de cantidad | Kg, Lt, Pz, etc. |
| `/type-item-identifications` | Identificación de Ítem | Estándar de adopción del contribuyente |
| `/reference-price` | Unidad de referencia | Precios referenciales |
| `/cities` | Ciudades | Parámetro opcional: `code` |
| `/departments` | Departamentos | Departamentos de Colombia |
| `/countries` | Países | Países |
| `/currencies` | Monedas | Monedas |

### Sector Salud (GET)

| Endpoint | Uso |
|----------|-----|
| `/health/user-type` | Tipo de usuario (Sector Salud) |
| `/health/contracting` | Modalidad de contratación (Sector Salud) |
| `/health/coverage` | Cobertura o plan de beneficios (Sector Salud) |

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

## 🛠️ Funciones Auxiliares Públicas

Utilidades de cálculo y conversión que no requieren autenticación ni configuración de cliente.

### Convertir Números a Letras - 🟢 GET

```http
GET {{url}}/numbers-to-letters?number={number}&money={money}&money2={money2}
```

```http
GET {{url}}/numbersToLetters/{numero}
```

**Descripción:** Convierte una cifra numérica a su representación textual en letras (útil para la leyenda monetaria de representaciones gráficas de facturas).

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `number` / `numero` | query / path | ✅ Sí | Número o importe a convertir en letras (ej. `58547125` o `1250000.50`). |
| `money` | query | No | Denominación en singular de la moneda principal (ej. `PESO`, `DÓLAR`). |
| `money2` | query | No | Denominación de la fracción/centavos (ej. `CENTAVO`, `CENTAVOS`). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "letters": "CINCUENTA Y OCHO MILLONES QUINIENTOS CUARENTA Y SIETE MIL CIENTO VEINTICINCO PESOS M/CTE",
  "success": true
}
```

---

### Calcular Dígito de Verificación (DV) - 🟢 GET

```http
GET {{url}}/digit-verification?Number={Number}
```

```http
GET {{url}}/dv/{nit}
```

**Descripción:** Calcula el dígito de verificación oficial según el algoritmo módulo 11 de la DIAN a partir del NIT / número de identificación tributaria.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `Number` / `nit` | query / path | ✅ Sí | Número de identificación sin dígito de verificación ni guiones (ej. `900123456`). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "digit": 7,
  "nit": "900123456-7"
}
```
