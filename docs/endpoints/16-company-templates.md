---
sidebar_position: 16
sidebar_label: 🎨 Plantillas de Empresa
description: "Plantillas de la representación gráfica (PDF): asignación, personalización, vista previa y datos adicionales en el PDF."
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

:::caution Plan FREE
La edición de plantillas (`clone-for-edit`, `customize` y `DELETE …/custom`) no está disponible en el plan FREE. En ese plan, esos endpoints responden HTTP 403:

```json
{
  "success": false,
  "message": "Esta funcionalidad no está disponible en el plan FREE. Actualice su plan para acceder.",
  "feature": "custom_templates",
  "upgrade_url": "https://.../upgrade"
}
```

La vista previa (`GET …/preview`) y la asignación de plantillas sí están disponibles en todos los planes.
:::

:::note Identificador de la asignación
En los endpoints con `{id}`, el valor es el `id` de la **asignación** (devuelto por `GET /company/templates`), no el `uuid` de la plantilla. Una asignación inexistente o de otra empresa responde HTTP 404 con `{"success": false, "message": "Recurso no encontrado."}`.
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

**Descripción:** Lista, paginadas, las plantillas gráficas asignadas a la empresa emisora, con los datos de la plantilla del catálogo en `template`.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `page` | query | No | Número de página (default: `1`). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 6,
        "company_id": 120,
        "template_id": 2,
        "is_default": true,
        "custom_config": null,
        "is_active": true,
        "custom_template_path": null,
        "custom_css_path": null,
        "template": {
          "id": 2,
          "uuid": "30f00f0a-0e92-4dfa-897f-6b6ce9fbfb98",
          "name": "Template Moderno",
          "description": "Diseño moderno a una columna",
          "is_active": true
        }
      }
    ],
    "per_page": 15,
    "total": 1
  },
  "success": true
}
```

`custom_template_path` y `custom_css_path` tienen valor cuando la empresa guardó una personalización con `customize`. El paginador incluye además los campos estándar (`from`, `to`, `last_page`, `links`, etc.).

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/templates/available</b> — Listar Templates Disponibles</summary>

```http
GET {{url}}/company/templates/available?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista, paginadas, las plantillas del sistema activas que la empresa **aún no tiene asignadas**.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `page` | query | No | Número de página (default: `1`). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 3,
        "uuid": "4b7a1c2e-5d3f-4e8a-9b0c-1d2e3f4a5b6c",
        "name": "Factura Estándar 3 Columnas",
        "description": "Formato estándar con detalle en tres columnas",
        "is_active": true
      }
    ],
    "per_page": 15,
    "total": 1
  },
  "success": true
}
```

Usa el `uuid` de la plantilla como `template_uuid` en `POST /company/templates/assign`.

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
  "template_uuid": "4b7a1c2e-5d3f-4e8a-9b0c-1d2e3f4a5b6c",
  "is_default": true
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `template_uuid` | string | ✅ Sí | UUID de una plantilla existente, obtenido de `GET /company/templates/available`. |
| `is_default` | boolean | No | Si es `true`, la plantilla pasa a ser la predeterminada y las demás asignaciones dejan de serlo (default: `false`). |
| `custom_config` | object | No | Configuración propia de la asignación. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

```json
{
  "message": "Template asignado exitosamente",
  "dataRecords": {
    "data": {
      "id": 7,
      "company_id": 120,
      "template_id": 3,
      "is_default": true,
      "custom_config": null,
      "is_active": true,
      "custom_template_path": null,
      "custom_css_path": null,
      "template": {
        "id": 3,
        "uuid": "4b7a1c2e-5d3f-4e8a-9b0c-1d2e3f4a5b6c",
        "name": "Factura Estándar 3 Columnas",
        "description": "Formato estándar con detalle en tres columnas",
        "is_active": true
      }
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Template ya asignado (HTTP 400)</summary>

```json
{
  "success": false,
  "message": "Este template ya está asignado a la empresa"
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

**Body (JSON):** todos los campos son opcionales; solo cambia lo que envías.
```json
{
  "is_default": true,
  "custom_config": {},
  "is_active": true
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `is_default` | boolean | No | Marca la asignación como predeterminada. |
| `custom_config` | object | No | Configuración propia de la asignación. |
| `is_active` | boolean | No | Activa o desactiva la asignación. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Configuración actualizada exitosamente",
  "dataRecords": {
    "data": {
      "id": 7,
      "company_id": 120,
      "template_id": 3,
      "is_default": true,
      "custom_config": {},
      "is_active": true,
      "template": {
        "id": 3,
        "uuid": "4b7a1c2e-5d3f-4e8a-9b0c-1d2e3f4a5b6c",
        "name": "Factura Estándar 3 Columnas"
      }
    }
  },
  "success": true
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
  "message": "Template desasignado exitosamente",
  "success": true
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

**Descripción:** Renderiza la versión en uso de la plantilla (la personalización de la empresa si existe, o la plantilla base) con datos de ejemplo. La vista previa usa 22 líneas de detalle para que se vea el salto de página. Disponible en todos los planes.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID de la plantilla asignada. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

Los campos van en la raíz de la respuesta:

```json
{
  "html": "<html>...</html>",
  "css": ".invoice { color: #333; }",
  "css_path": "css/templates/standard.css",
  "template_name": "Factura Estándar",
  "is_custom": true,
  "success": true
}
```

| Campo | Descripción |
|---|---|
| `html` | HTML renderizado con datos de ejemplo. |
| `css` | Contenido del CSS de la plantilla, para inyectarlo en tu visor (puede ser `null`). |
| `css_path` | Ruta relativa del CSS en uso. |
| `is_custom` | `true` si se renderizó la personalización de la empresa. |

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/company/templates/&#123;id&#125;/clone-for-edit</b> — Abrir Template para Edición</summary>

```http
POST {{url}}/company/templates/{id}/clone-for-edit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Devuelve el contenido editable de la versión que la empresa tiene en uso: su personalización (Blade y CSS) si existe, o la plantilla base si no hay personalización. No crea copias ni guarda nada; para guardar los cambios usa `customize`. No disponible en plan FREE.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

Los campos van en la raíz de la respuesta:

```json
{
  "blade_content": "<div>...</div>",
  "css_content": ".invoice { color: #333; }",
  "template_name": "Factura Estándar",
  "is_custom": false,
  "sample_data": {},
  "success": true
}
```

| Campo | Descripción |
|---|---|
| `blade_content` | Contenido Blade de la plantilla en uso. |
| `css_content` | Contenido CSS en uso (puede ser `null`). |
| `template_name` | Nombre de la plantilla del catálogo. |
| `is_custom` | `true` si se abrió la personalización de la empresa; `false` si es la plantilla base. |
| `sample_data` | Datos de ejemplo con los que se renderiza la plantilla, útiles para el editor. |

</details>

<details>
<summary>❌ Template fuente no encontrado (HTTP 400)</summary>

```json
{
  "success": false,
  "message": "Template fuente no encontrado"
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

No disponible en plan FREE.

**Body (JSON):**
```json
{
  "blade_content": "<div>...</div>",
  "css_content": ".invoice { color: #0066cc; }"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `blade_content` | string | ✅ Sí | Contenido Blade completo de la plantilla. |
| `css_content` | string | No | CSS de la personalización. Si lo omites, se usa el CSS de la plantilla base. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Template personalizado guardado exitosamente",
  "dataRecords": {
    "data": {
      "id": 7,
      "company_id": 120,
      "template_id": 3,
      "is_default": true,
      "is_active": true,
      "template": {
        "id": 3,
        "uuid": "4b7a1c2e-5d3f-4e8a-9b0c-1d2e3f4a5b6c",
        "name": "Factura Estándar 3 Columnas"
      }
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Blade con errores (HTTP 400)</summary>

```json
{
  "success": false,
  "message": "El contenido Blade contiene errores de sintaxis: ..."
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

**Descripción:** Elimina el diseño personalizado de la empresa y restaura la versión base del template. No disponible en plan FREE.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Personalización eliminada exitosamente",
  "dataRecords": {
    "data": {
      "id": 7,
      "company_id": 120,
      "template_id": 3,
      "custom_template_path": null,
      "custom_css_path": null
    }
  },
  "success": true
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

:::caution Solo la plantilla Preprinted imprime additional_data
Las plantillas **Classic**, **Minimal** y **Modern** no leen el bloque `additional_data`. La API lo acepta y lo valida igual, pero con esas plantillas no aparece en el PDF. Ver [Cómo llega al PDF](../billing-fields.md#additional-data-pdf).
:::

<details>
<summary>📐 Plantilla <strong>Preprinted</strong> — Secciones con posición fija</summary>

La plantilla **Preprinted** reconoce dos secciones de `additional_data` por su título y las coloca en un sitio fijo del formato:

| El título de la sección contiene | Dónde se pinta | Etiquetas que se imprimen |
|---|---|---|
| `"centro de costo"` o `"centro costo"` | Recuadro **INFORMACIÓN DEL CENTRO DE COSTO**, arriba a la izquierda | El `title` de cada campo. Si envías menos de tres campos, los renglones que faltan se rotulan `Nombre del Centro de Costo`, `Dirección y Teléfono` y `Ciudad` |
| `"del usuario"` o `"afiliado"` | Bloque **INFORMACIÓN DEL USUARIO**, debajo de la información del cliente | Fijas: `Afiliado Dependiente/Particular`, `Identificación` y `Descripción`. El `title` que envíes no se imprime |

Reglas de estas dos secciones:

- La búsqueda del título no distingue mayúsculas, acentos ni espacios: `Centro de Costo`, `CENTRO DE COSTOS`, `Centro costo` e `Información del Afiliado` coinciden.
- Solo se usa la **primera** sección que coincide. Las demás secciones cuyo título también coincide no se imprimen en ninguna parte del PDF.
- Se imprimen solo los **3 primeros campos**, por posición: el primero va en el primer renglón, el segundo en el segundo y el tercero en el tercero. Del 4.º en adelante no se imprimen. Envía los campos en el orden en que deben salir.
- Las etiquetas del bloque del usuario son fijas; las del centro de costo salen del `title` de cada campo.
- El recuadro del centro de costo forma parte del formato y aparece siempre, vacío si no envías esa sección. El bloque del usuario solo aparece cuando el documento trae sus datos.

**El resto de secciones** se pinta dentro del cuerpo del documento, en el orden de las secciones: después de **INFORMACIÓN DEL CLIENTE (TERCERO)** y del bloque **INFORMACIÓN DEL USUARIO**, y **antes** de **DOCUMENTO DE REFERENCIA** (en las notas) y de **DETALLE DOCUMENTO**. Cada sección es una tabla con su título como franja (una sección sin título no lleva franja) y dos campos por renglón, con la forma `Etiqueta: valor`.

</details>

<details>
<summary>🗂️ Estructura de <code>additional_data</code></summary>

`additional_data` es **directamente un arreglo**. Admite dos formas:

**1. Arreglo de secciones** (cada una con su lista `fields`):

```json
{
  "additional_data": [
    {
      "section": "Centro de Costo",
      "order": 1,
      "fields": [
        { "title": "Área",          "value": "Ventas Norte",   "type": "TEXT",    "align": "LEFT",  "order": 1 },
        { "title": "Orden",         "value": "OC-2024-001",    "type": "TEXT",    "align": "LEFT",  "order": 2 },
        { "title": "Presupuesto",   "value": "5000000",        "type": "CURRENCY","align": "RIGHT", "order": 3 }
      ]
    }
  ]
}
```

**2. Lista plana de campos** (sin secciones):

```json
{
  "additional_data": [
    { "title": "Orden de servicio", "value": "OS-1001" },
    { "title": "Asesor",            "value": "Equipo Norte" }
  ]
}
```

:::warning No uses el envoltorio `sections`
La forma `"additional_data": { "sections": [ ... ] }` **no** es válida: la clave `sections` se interpreta como un campo suelto sin título y el documento se rechaza con HTTP 422 (`El campo sections requiere un título.`).
:::

**Límites de validación:**
- Máximo **10 elementos** en `additional_data`: 10 secciones o, en la lista plana, 10 campos.
- Máximo **20 campos** por sección.
- `section` (título): máximo 120 caracteres.
- `title` del campo: obligatorio, máximo 60 caracteres.
- `value` del campo: dato simple (no objeto ni arreglo), máximo 500 caracteres.

**Tipos de campo permitidos:** `TEXT`, `NUMBER`, `DATE`, `CURRENCY`.

:::tip
Para campos tipo `CURRENCY`, envía el valor numérico en crudo (sin puntos ni comas de miles). La plantilla se encarga del formateo.
:::

Para la referencia completa con ejemplos → [**Datos adicionales del documento**](/docs/billing-fields#additional_data-)

</details>
