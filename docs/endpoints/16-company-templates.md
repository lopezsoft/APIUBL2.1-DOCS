---
sidebar_position: 16
sidebar_label: 🎨 Plantillas de Empresa
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🎨 Plantillas de Empresa (Company Templates) {#company-templates}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes personalizar plantillas gráficas para tus empresas cliente agregando `?client_uuid={{client_uuid}}`.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

---

## 📋 Catálogo y Asignación {#catalogo-asignacion}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/templates</b> — Listar Templates Asignados</summary>

```http
GET {{url}}/company/templates?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista las plantillas gráficas asignadas y activas para la empresa emisora.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 6,
        "name": "Template Moderno",
        "template_uuid": "30f00f0a-0e92-4dfa-897f-6b6ce9fbfb98",
        "is_default": true
      }
    ]
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/templates/available</b> — Listar Templates Disponibles</summary>

```http
GET {{url}}/company/templates/available?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista el catálogo general de templates del sistema disponibles para ser asignados.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "template_uuid": "30f00f0a-0e92-4dfa-897f-6b6ce9fbfb98",
        "name": "Factura Estándar 3 Columnas",
        "preview_url": "https://api.ejemplo.com/previews/standard.png"
      }
    ]
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/company/templates/assign</b> — Asignar Template a la Empresa</summary>

```http
POST {{url}}/company/templates/assign?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):**
```json
{
  "template_uuid": "30f00f0a-0e92-4dfa-897f-6b6ce9fbfb98"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `template_uuid` | string | ✅ Sí | UUID único del template a asignar obtenido de `GET /company/templates/available`. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

```json
{
  "success": true,
  "message": "Template asignado exitosamente a la empresa"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/templates/&#123;id&#125;</b> — Actualizar Asignación</summary>

```http
PUT {{url}}/company/templates/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID de la asignación del template. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):**
```json
{
  "is_default": true,
  "custom_config": {},
  "is_active": true
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Configuración de plantilla actualizada"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/company/templates/&#123;id&#125;</b> — Desasignar Template</summary>

```http
DELETE {{url}}/company/templates/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID de la asignación a remover. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Template desasignado correctamente"
}
```

</details>

</details>

---

## 🎨 Personalización y Edición {#personalizacion-edicion}

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/templates/&#123;id&#125;/preview</b> — Vista Previa del Template</summary>

```http
GET {{url}}/company/templates/{id}/preview?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID de la plantilla asignada. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": {
      "html": "<html>...</html>",
      "css_path": "css/templates/standard.css",
      "template_name": "Factura Estándar",
      "is_custom": true
    }
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/company/templates/&#123;id&#125;/clone-for-edit</b> — Clonar Template para Edición</summary>

```http
POST {{url}}/company/templates/{id}/clone-for-edit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Clona el template base en el almacenamiento de la empresa para habilitar modificaciones de diseño.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "blade_content": "<div>...</div>",
  "css_content": ".invoice { color: #333; }",
  "template_name": "Factura Estándar (Copia)"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/company/templates/&#123;id&#125;/customize</b> — Guardar Personalización</summary>

```http
POST {{url}}/company/templates/{id}/customize?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "blade_content": "<div>...</div>",
  "css_content": ".invoice { color: #0066cc; }"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Personalización de plantilla guardada exitosamente"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/company/templates/&#123;id&#125;/custom</b> — Eliminar Personalización</summary>

```http
DELETE {{url}}/company/templates/{id}/custom?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Elimina el diseño personalizado de la empresa y restaura la versión base del template.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Personalización eliminada. Se restauró el template base."
}
```

</details>

</details>

---

## 📄 Datos Adicionales en el PDF {#datos-adicionales-pdf}

Las plantillas gráficas pueden imprimir información complementaria que **no viaja a la DIAN**: centro de costo, datos del afiliado, orden de servicio, lotes, seriales y cualquier dato que tu operación necesite ver en el documento impreso.

Para ello, el JSON del documento admite tres bloques independientes:

| Ámbito | Clave en el JSON | Propósito típico |
|---|---|---|
| Documento | [`additional_data`](/docs/billing-fields#additional_data-) | Centro de costo, orden de servicio, información del afiliado |
| Cliente | [`customer.extra_data`](/docs/billing-fields#customer-) | Nº de socio, categoría, fecha de vinculación |
| Línea de detalle | [`lines[].extra_data`](/docs/billing-fields#linea-extra-data) | Lote, fecha de vencimiento, serial del producto |

Ninguno de estos campos es transmitido a la DIAN. Su único efecto es sobre la **representación gráfica** (PDF) generada por la plantilla asignada a la empresa.

<details>
<summary>📐 Plantilla <strong>Preprinted</strong> — Secciones con posición fija</summary>

La plantilla **Preprinted** interpreta el título de cada sección dentro de `additional_data` y la ubica en una posición predeterminada del formato:

| Título de la sección (insensible a mayúsculas) | Dónde se pinta |
|---|---|
| Contiene `"centro de costo"` | Recuadro superior izquierdo del documento |
| Contiene `"del usuario"` o `"afiliado"` | Bloque de información del usuario / afiliado |

Cualquier otra sección se pinta en orden correlativo debajo del detalle de líneas.

</details>

<details>
<summary>🗂️ Estructura de <code>additional_data</code></summary>

```json
{
  "additional_data": {
    "sections": [
      {
        "section": "Centro de Costo",
        "order": 1,
        "fields": [
          { "title": "Área",          "value": "Ventas Norte",   "type": "TEXT",   "align": "LEFT",  "order": 1 },
          { "title": "Orden",         "value": "OC-2024-001",    "type": "TEXT",   "align": "LEFT",  "order": 2 },
          { "title": "Presupuesto",   "value": "5000000",        "type": "CURRENCY","align": "RIGHT", "order": 3 }
        ]
      }
    ]
  }
}
```

**Límites de validación:**
- Máximo **10 secciones** por documento.
- Máximo **20 campos** por sección.
- `section` (título): máximo 120 caracteres.
- `title` del campo: máximo 60 caracteres.
- `value` del campo: máximo 500 caracteres.

**Tipos de campo permitidos:** `TEXT`, `NUMBER`, `DATE`, `CURRENCY`.

:::tip
Para campos tipo `CURRENCY`, envía el valor numérico en crudo (sin puntos ni comas de miles). La plantilla se encarga del formateo.
:::

Para la referencia completa con ejemplos → [**Datos adicionales del documento**](/docs/billing-fields#additional_data-)

</details>
