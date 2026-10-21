---
sidebar_position: 21
sidebar_label: 💌 Marca Blanca de Correos
description: "Marca blanca de los correos que el API envía en nombre de tus empresas: logo, colores, textos y vista previa por tipo de correo."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 💌 Marca Blanca de Correos {#email-branding}

:::info 🆕 Nuevo · ✅ Autenticación requerida
Personaliza el logo, los colores y los textos de los correos que el API envía a los clientes finales en nombre de tus empresas. Disponible en todos los planes.
:::

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

**¿Quién configura la marca?**

- La **Casa de Software** (o la **cuenta directa**) configura la marca **con su propio token y sin `client_uuid`**. Todas sus sub-cuentas la heredan: configuras una vez y aplica a todos tus clientes.
- Una **sub-cuenta** no puede definir su propia marca. Si la empresa resuelta (por el token o por `?client_uuid=`) es una sub-cuenta, `PUT`, `POST …/logo`, `DELETE …/logo` y `POST …/preview` responden HTTP 403:

```json
{
  "success": false,
  "message": "La personalización de correos la define la casa de software a la que pertenece esta cuenta."
}
```

- Con `?client_uuid={{client_uuid}}` de una sub-cuenta solo puedes **consultar** (`GET`) la marca que esa sub-cuenta hereda.

**Tipos de correo `{type}`** (en mayúsculas exactas):

| Tipo | Correos a los que aplica |
|---|---|
| `INVOICE` | Correo de los documentos electrónicos (facturas, notas, documentos soporte…): el que sale con la emisión y el de envío o reenvío con [`POST /documents/sendmail/{trackId}`](./06-queries-status.md#correos-adquirentes). |
| `EVENT` | Correos de eventos RADIAN. |
| `CUSTOM` | Correo libre de [`POST /documents/sendmail/to`](./06-queries-status.md#correos-adquirentes). |

Cualquier otro valor responde HTTP 422 con `Tipo de correo inválido. Debe ser uno de: INVOICE, EVENT, CUSTOM.`

:::caution 🆕 El tipo `CUSTOM` toma asunto, título y mensaje de la petición de envío
En el correo de `POST /documents/sendmail/to`, el asunto es el campo `subject` de esa petición (por defecto `Titulo del correo`), el título es `title` y el cuerpo es `message`. De la marca `CUSTOM` solo se aplican al envío:

- el logo;
- `primary_color`, que solo cambia el color del título;
- `footer_text`, que sustituye al pie de la plataforma;
- `secondary_color`, que es el color de ese pie.

`subject_template`, `greeting_text` y `body_text` de `CUSTOM` se guardan y se ven en la vista previa, pero **no se aplican al envío**.
:::

:::note Diseño de la plataforma por defecto
Si un tipo de correo no tiene marca configurada, o la tiene con `is_active: false`, el correo sale con el diseño y el logo de la plataforma.

🆕 Si la marca no se puede consultar al enviar, o su logo ya no está disponible, el correo se envía igual: con el diseño de la plataforma o, si el problema es el logo, con el logo de la plataforma. Un fallo al resolver la marca no bloquea el envío de la factura o del evento.
:::

---

## 📋 Consultar la Configuración {#consultar}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/settings/email-branding</b> — Configuración de los Tres Tipos de Correo</summary>

```http
GET {{url}}/settings/email-branding?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve un elemento por tipo de correo con la configuración que **realmente se aplica** al enviar. Para una sub-cuenta, es la de su Casa de Software.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID de la empresa a consultar (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "email_type": "INVOICE",
        "configured": true,
        "inherited": false,
        "editable": true,
        "is_active": true,
        "logo_asset_id": 31,
        "logo_url": "https://.../logo-marca.png",
        "properties": {
          "primary_color": "#0B5FFF",
          "secondary_color": "#F2F6FF",
          "border_color": "#D0D7E2"
        },
        "primary_color": "#0B5FFF",
        "secondary_color": "#F2F6FF",
        "border_color": "#D0D7E2",
        "greeting_text": "<p>Hola {{recipient_name}},</p>",
        "body_text": "<p>Adjuntamos su {{document_type}} número <b>{{document_number}}</b> por {{document_total}}.</p>",
        "footer_text": "<p>{{issuer_trade_name}} · {{issuer_phone}} · {{issuer_website}}</p>",
        "subject_template": null,
        "allowed_variables": ["recipient_name", "recipient_tax_id", "recipient_email", "issuer_name", "document_number"],
        "variables": [
          {
            "name": "recipient_name",
            "description": "Nombre del cliente que recibe el documento",
            "group": "Datos de quien recibe",
            "example": "CLIENTE DE EJEMPLO S.A.S."
          }
        ],
        "subject_editable": false,
        "applied_on_send": true
      },
      {
        "email_type": "EVENT",
        "configured": false,
        "inherited": false,
        "editable": true,
        "is_active": false,
        "logo_asset_id": null,
        "logo_url": "https://.../logo-plataforma.png",
        "properties": null,
        "primary_color": null,
        "secondary_color": null,
        "border_color": null,
        "greeting_text": null,
        "body_text": null,
        "footer_text": null,
        "subject_template": null,
        "allowed_variables": ["recipient_name", "event_name", "document_number"],
        "variables": [
          {
            "name": "event_name",
            "description": "Nombre del evento RADIAN (Acuse de recibo, Aceptación...)",
            "group": "Datos del evento",
            "example": "ACUSE DE RECIBO"
          }
        ],
        "subject_editable": false,
        "applied_on_send": false
      }
    ],
    "inherited_by": true
  },
  "success": true
}
```

El ejemplo está recortado: `data` trae siempre los tres tipos, y `allowed_variables` y `variables`, la lista completa del tipo.

| Campo | Descripción |
|---|---|
| `configured` | `true` si el tipo tiene una configuración guardada. |
| `inherited` | `true` si la configuración es la de la Casa de Software (la empresa consultada es una sub-cuenta). |
| `editable` | `true` si la empresa consultada puede modificarla (es lo contrario de `inherited`). |
| `is_active` / `applied_on_send` | Si la marca se aplica al enviar. |
| `logo_url` | Logo que se usa hoy. Siempre es una URL utilizable: si no hay marca activa o logo propio, es el de la plataforma. |
| `properties` | Colores agrupados (`primary_color`, `secondary_color`, `border_color`), o `null`. Los mismos colores se repiten en la raíz por compatibilidad. |
| `allowed_variables` | Nombres de las variables que admite el tipo. |
| `variables` | Las mismas variables con descripción, grupo y un ejemplo. |
| `subject_editable` | `true` solo en `CUSTOM`, el único tipo en el que se puede guardar `subject_template`. Ese asunto guardado no se aplica al envío (ver la [advertencia sobre `CUSTOM`](#email-branding)). |
| `inherited_by` | `true` si la empresa consultada tiene sub-cuentas (Casa de Software), que heredan su marca. |

</details>

</details>

---

## ✏️ Guardar la Personalización {#guardar}

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/settings/email-branding/&#123;type&#125;</b> — Guardar Colores y Textos</summary>

```http
PUT {{url}}/settings/email-branding/{type}
Authorization: Bearer {token}
Content-Type: application/json
```

:::warning Reemplazo completo
Cada `PUT` **reemplaza** la configuración del tipo; no es un merge. Un texto o un color que no envíes se guarda vacío, e `is_active` vuelve a `true` si no lo envías. Envía siempre la configuración completa. El logo no se toca: se gestiona con sus propios endpoints.
:::

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type` | path | ✅ Sí | `INVOICE`, `EVENT` o `CUSTOM`. |

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `properties` | object | No | Colores, con lista cerrada de claves: `primary_color`, `secondary_color`, `border_color`. Cada uno en formato `#RRGGBB` o `null`. |
| `greeting_text` | string (HTML) | No | Saludo. Máximo 2000 caracteres. |
| `body_text` | string (HTML) | No | Cuerpo del mensaje. Máximo 10000 caracteres. |
| `footer_text` | string (HTML) | No | Pie del correo. Máximo 4000 caracteres. Si tiene contenido, **reemplaza por completo** el pie de la plataforma (ver «Qué desaparece al personalizar el pie», más abajo). |
| `subject_template` | string | No | Máximo 255 caracteres. **Solo se admite en `CUSTOM`**: en facturas y eventos el asunto lo define el formato exigido por la DIAN. Se guarda como texto plano de una sola línea y se ve en la vista previa, pero **no se aplica al envío**: el asunto del correo `CUSTOM` es el `subject` de `POST /documents/sendmail/to`. |
| `is_active` | boolean | No | Si la marca se aplica al enviar (default: `true`). |

Los colores también se aceptan en la raíz del body (`primary_color`, …) por compatibilidad. Si vienen en ambos sitios, prevalece `properties`.

Los máximos se cuentan sobre el texto que envías. Son holgados porque el saneado añade atributos a cada enlace (unos 51 caracteres por enlace).

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "{{url}}/settings/email-branding/INVOICE" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "primary_color": "#0B5FFF",
      "secondary_color": "#F2F6FF",
      "border_color": "#D0D7E2"
    },
    "greeting_text": "<p>Hola {{recipient_name}},</p>",
    "body_text": "<p>Adjuntamos su {{document_type}} número <b>{{document_number}}</b> por {{document_total}}.</p><p><a href=\"{{document_dian_url}}\">Consultar en la DIAN</a></p>",
    "footer_text": "<p>{{issuer_trade_name}} · {{issuer_phone}} · {{issuer_website}}</p>",
    "is_active": true
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.put(`${url}/settings/email-branding/INVOICE`, {
  properties: {
    primary_color: '#0B5FFF',
    secondary_color: '#F2F6FF',
    border_color: '#D0D7E2'
  },
  greeting_text: '<p>Hola {{recipient_name}},</p>',
  body_text: '<p>Adjuntamos su {{document_type}} número <b>{{document_number}}</b> por {{document_total}}.</p>',
  footer_text: '<p>{{issuer_trade_name}} · {{issuer_phone}} · {{issuer_website}}</p>',
  is_active: true
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->put("{$url}/settings/email-branding/INVOICE", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'properties'    => [
            'primary_color'   => '#0B5FFF',
            'secondary_color' => '#F2F6FF',
            'border_color'    => '#D0D7E2',
        ],
        'greeting_text' => '<p>Hola {{recipient_name}},</p>',
        'body_text'     => '<p>Adjuntamos su {{document_type}} número <b>{{document_number}}</b> por {{document_total}}.</p>',
        'footer_text'   => '<p>{{issuer_trade_name}} · {{issuer_phone}} · {{issuer_website}}</p>',
        'is_active'     => true,
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Personalización guardada.",
  "dataRecord": {
    "id": 12,
    "company_id": 120,
    "email_type": "INVOICE",
    "logo_asset_id": 31,
    "properties": {
      "primary_color": "#0B5FFF",
      "secondary_color": "#F2F6FF",
      "border_color": "#D0D7E2"
    },
    "greeting_text": "<p>Hola {{recipient_name}},</p>",
    "body_text": "<p>Adjuntamos su {{document_type}} número <b>{{document_number}}</b> por {{document_total}}.</p>",
    "footer_text": "<p>{{issuer_trade_name}} · {{issuer_phone}} · {{issuer_website}}</p>",
    "subject_template": null,
    "is_active": true,
    "created_at": "2026-10-21T13:00:00.000000Z",
    "updated_at": "2026-10-21T13:00:00.000000Z"
  },
  "success": true
}
```

Los textos se devuelven **ya saneados**, tal como saldrán en el correo.

</details>

<details>
<summary>❌ Errores de validación (HTTP 422)</summary>

Formato estándar de validación (`message` y `errors` por campo):

```json
{
  "message": "El color principal debe tener el formato #RRGGBB.",
  "errors": {
    "properties.primary_color": ["El color principal debe tener el formato #RRGGBB."]
  }
}
```

| Campo | Mensaje |
|---|---|
| `properties` | `Ajustes no reconocidos: <claves>. Los admitidos son: primary_color, secondary_color, border_color.` |
| `properties.primary_color` | `El color principal debe tener el formato #RRGGBB.` |
| `properties.secondary_color` | `El color secundario debe tener el formato #RRGGBB.` |
| `properties.border_color` | `El color del borde debe tener el formato #RRGGBB.` |
| `subject_template` | `El asunto solo puede personalizarse en los correos de tipo CUSTOM. En facturas y eventos lo define el formato exigido por la DIAN.` |
| Cualquier texto | `Estas variables no existen para un correo de tipo <TIPO>: <variables>. Puedes usar: <lista de variables con su descripción>` |

</details>

</details>

<details>
<summary>🎨 🆕 Dónde se aplica cada ajuste por tipo</summary>

No todos los ajustes tienen efecto en los tres tipos de correo:

| Ajuste | `INVOICE` | `EVENT` | `CUSTOM` |
|---|---|---|---|
| Logo | ✅ | ✅ | ✅ |
| `primary_color` | Título del documento, borde inferior del encabezado, fondo del recuadro del logo, saludo (`greeting_text`) y botón «Descargar documento del portal DIAN». | Solo el título (nombre del evento). | Solo el título. |
| `border_color` | Borde del contenedor del correo. Si no se define, se mantiene el del diseño de la plataforma. | No se aplica. | No se aplica. |
| `secondary_color` | Color del pie personalizado. | Color del pie personalizado. | Color del pie personalizado. |
| `greeting_text` / `body_text` | Reemplazan **todo** el bloque por defecto (saludo, texto, «Documento Nº» y «Total»). | Reemplazan **por separado** el saludo y la frase por defecto. «Documento Nº» y «Total» se imprimen siempre. | No se aplican: el cuerpo es el `message` del envío. |
| `footer_text` | ✅ Sustituye al pie de la plataforma. | ✅ Sustituye al pie de la plataforma. | ✅ Sustituye al pie de la plataforma. |
| `subject_template` | No se admite. | No se admite. | Se guarda, pero no se aplica al envío. |

- En `INVOICE`, si usas `greeting_text` o `body_text`, el correo deja de mostrar el número y el total por defecto. Inclúyelos tú con `{{document_number}}` y `{{document_total}}`.
- En los tres tipos, `secondary_color` solo tiene efecto si hay `footer_text`.

</details>

<details>
<summary>🧾 🆕 Qué desaparece al personalizar el pie</summary>

Cuando `footer_text` tiene contenido, el pie de la plataforma desaparece entero en `INVOICE`, `EVENT` y `CUSTOM`. Son tres partes:

1. El aviso para notificar acuse de recibo, aceptación o rechazo, con la dirección de correo de la empresa emisora.
2. «Estimado cliente, este correo es generado automáticamente, por favor no responda a este mensaje».
3. «Correo generado por: razón social», con enlace al sitio web de la empresa.

Te recomendamos un pie equivalente con variables:

```html
<p>Para notificar acuse de recibo, aceptación o rechazo, escriba a {{issuer_email}}</p>
<p>Este correo es automático, por favor no responda a este mensaje.</p>
<p>Enviado por {{issuer_name}}</p>
```

El recuadro final con los datos de la empresa emisora (razón social y NIT, dirección, correo, teléfonos y su logo) no forma parte del pie: se mantiene siempre.

</details>

<details>
<summary>🧹 HTML admitido en los textos</summary>

Los textos llegan de un editor enriquecido y se **sanean antes de guardar**:

- **Etiquetas que se conservan:** `p`, `br`, `b`, `strong`, `i`, `em`, `u`, `s`, `blockquote`, `h3`, `h4`, `ul`, `ol`, `li`, `a` (con `href`, `title` y `target`) y `span` (con `style`).
- **Estilos en línea admitidos en `span`:** `color`, `font-weight`, `font-style`, `text-decoration` y `text-align`.
- Todo lo demás (imágenes, tablas, scripts, iframes, otros estilos) se elimina.
- 🆕 **Enlaces:** en `href` solo se admiten los esquemas `http`, `https` y `mailto`. Un `href` con `javascript:` o `data:` se elimina, igual que los atributos de evento (`onerror`, `onclick`…). Cada enlace sale con `target="_blank"` y `rel="nofollow noreferrer noopener"`.
- 🆕 Las variables funcionan también dentro de `href`, por ejemplo `<a href="{{document_dian_url}}">`. Dentro de `href`, escríbelas sin espacios entre las llaves.
- 🆕 El marcado mal cerrado se repara en lugar de rechazarse: `<p>Hola<b>negrita` se guarda como `<p>Hola<b>negrita</b></p>`.
- 🆕 Un texto que queda sin contenido visible tras sanear (por ejemplo, solo `<script>…</script>`) se guarda como cadena vacía.
- Los saltos de línea se conservan: los de un textarea se convierten en `<br />`.
- `subject_template` se guarda siempre como texto plano de una sola línea.

</details>

<details>
<summary>🔤 Variables disponibles por tipo</summary>

Escribe las variables con doble llave, por ejemplo `{{recipient_name}}`. Al enviar, se reemplazan por los datos reales del documento. Usar una variable que no pertenece al tipo produce un error 422 al guardar.

| Variable | Significado | `INVOICE` | `EVENT` | `CUSTOM` |
|---|---|:-:|:-:|:-:|
| `recipient_name` | Nombre del cliente que recibe el documento | ✅ | ✅ | ✅ |
| `recipient_tax_id` | NIT o documento de identidad del cliente | ✅ | | |
| `recipient_email` | Correo del cliente al que se envía | ✅ | | |
| `issuer_name` | Razón social de la empresa que emite | ✅ | ✅ | ✅ |
| `issuer_trade_name` | Nombre comercial del emisor (o la razón social si no tiene) | ✅ | ✅ | ✅ |
| `issuer_tax_id` | NIT de la empresa que emite | ✅ | ✅ | ✅ |
| `issuer_tax_id_dv` | Dígito de verificación del NIT del emisor | ✅ | ✅ | |
| `issuer_address` | Dirección de la empresa que emite | ✅ | ✅ | ✅ |
| `issuer_phone` | Teléfono fijo de la empresa que emite | ✅ | ✅ | ✅ |
| `issuer_mobile` | Celular de la empresa que emite | ✅ | ✅ | ✅ |
| `issuer_email` | Correo de contacto de la empresa que emite | ✅ | ✅ | ✅ |
| `issuer_website` | Sitio web de la empresa que emite | ✅ | ✅ | ✅ |
| `document_type` | Tipo de documento (Factura electrónica de venta, Nota crédito…) | ✅ | | |
| `document_number` | Número del documento | ✅ | ✅ | |
| `document_total` | Valor total, ya formateado con símbolo y separadores | ✅ | ✅ | |
| `document_dian_url` | Enlace para consultar el documento en el portal de la DIAN | ✅ | | |
| `event_name` | Nombre del evento RADIAN (Acuse de recibo, Aceptación…) | | ✅ | |
| `email_title` | Título indicado al enviar el correo personalizado | | | ✅ |

`GET /settings/email-branding` devuelve esta misma lista por tipo, con un ejemplo de cada valor en `variables[].example`. El campo `group` toma los valores `Datos de quien recibe`, `Datos de quien emite`, `Datos del documento`, `Datos del evento` y `Datos del correo`.

🆕 **Detalles de las variables:**

- En el texto se admiten espacios dentro de las llaves: `{{ recipient_name }}` equivale a `{{recipient_name}}`. Dentro de `href`, no.
- `document_total` llega ya formateado con el símbolo de la moneda, coma de miles y punto decimal (por ejemplo, `$ 1,290,000.00`). No hay que reformatearlo. El valor de ejemplo de la vista previa y de `variables[].example` (`$ 1.290.000,00`) es solo ilustrativo.
- `document_dian_url` puede quedar vacía cuando el documento no tiene URL de consulta en la DIAN.

</details>

---

## 🖼️ Logo de la Marca {#logo}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/settings/email-branding/&#123;type&#125;/logo</b> — Subir Logo</summary>

```http
POST {{url}}/settings/email-branding/{type}/logo
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

Sube el logo que se muestra en los correos del tipo indicado.

:::warning 🆕 Un solo logo de correo por empresa
Cada empresa tiene **un solo logo de correo vigente**. Al subir un logo para un tipo se borra el logo anterior de la empresa, sea cual sea el tipo al que pertenecía. Los demás tipos que tenían logo propio quedan con `logo_asset_id: null` y vuelven al logo de la plataforma.

Subir el mismo logo tres veces no sirve para usarlo en `INVOICE`, `EVENT` y `CUSTOM`: solo conserva su logo el último tipo al que se subió.
:::

Si el tipo aún no tiene configuración guardada, la API la crea activa. El `GET` muestra entonces `configured: true`, `is_active: true` y `applied_on_send: true`, sin colores ni textos, y el correo sale con el logo propio y el resto del diseño de la plataforma. Un `PUT` posterior reemplaza colores y textos y conserva el logo.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type` | path | ✅ Sí | `INVOICE`, `EVENT` o `CUSTOM`. |
| `logo` | form-data (archivo) | ✅ Sí | Imagen PNG, JPEG o GIF de hasta **512 KB**. El formato se comprueba por el contenido real del archivo, no por su extensión. |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/settings/email-branding/INVOICE/logo" \
  -H "Authorization: Bearer {token}" \
  -F "logo=@logo.png"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const form = new FormData();
form.append('logo', fileInput.files[0]); // PNG, JPG o GIF, máx. 512 KB

const response = await axios.post(`${url}/settings/email-branding/INVOICE/logo`, form, {
  headers: { Authorization: `Bearer ${token}` }
});
const logoUrl = response.data.dataRecord.logo_url;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/settings/email-branding/INVOICE/logo", [
    'headers'   => ['Authorization' => "Bearer {$token}"],
    'multipart' => [
        ['name' => 'logo', 'contents' => fopen('logo.png', 'r'), 'filename' => 'logo.png'],
    ],
]);
$logoUrl = json_decode($response->getBody())->dataRecord->logo_url;
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Logo actualizado.",
  "dataRecord": {
    "logo_asset_id": 31,
    "logo_url": "https://.../logo-marca.png",
    "email_type": "INVOICE"
  },
  "success": true
}
```

`logo_asset_id`, `logo_url` y `email_type` corresponden al tipo al que se subió el logo.

</details>

<details>
<summary>❌ Errores (HTTP 422)</summary>

```json
{
  "success": false,
  "message": "El logo supera el tamaño máximo de 512 KB."
}
```

| Mensaje | Causa |
|---|---|
| `No se recibió ningún archivo en el campo "logo".` | Falta el campo `logo`. |
| `El archivo del logo no se recibió correctamente.` | La carga del archivo falló. |
| `El logo supera el tamaño máximo de 512 KB.` | El archivo pesa más de 512 KB. |
| `Formato de logo no admitido (<tipo>). Use PNG, JPG o GIF.` | El contenido no es PNG, JPEG ni GIF. |
| `El archivo no es una imagen válida.` | El archivo está dañado o no es una imagen. |

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/settings/email-branding/&#123;type&#125;/logo</b> — Quitar Logo</summary>

```http
DELETE {{url}}/settings/email-branding/{type}/logo
Authorization: Bearer {token}
```

Quita el logo propio del tipo indicado. Desde ese momento, los correos usan el logo de la plataforma. Colores y textos no cambian.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type` | path | ✅ Sí | `INVOICE`, `EVENT` o `CUSTOM`. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Logo retirado; se usará el de la plataforma.",
  "logo_url": "https://.../logo-plataforma.png",
  "success": true
}
```

</details>

</details>

---

## 👁️ Vista Previa {#vista-previa}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/settings/email-branding/&#123;type&#125;/preview</b> — Previsualizar con Datos de Ejemplo</summary>

```http
POST {{url}}/settings/email-branding/{type}/preview
Authorization: Bearer {token}
Content-Type: application/json
```

Muestra cómo quedarían los textos con datos de ejemplo, **sin guardar nada**. Aplica el mismo saneado que al guardar, así que ves exactamente lo que se enviaría.

🆕 **La vista previa sanea, pero no valida:**

- No rechaza variables desconocidas: quedan literales en `rendered`. El error 422 de variables solo lo da el `PUT`.
- No comprueba longitudes ni colores.
- En tipos distintos de `CUSTOM`, `subject_template` se ignora y `rendered.subject_template` es `null`.
- Responde HTTP 403 si la empresa es una sub-cuenta y HTTP 422 si el tipo no es válido.
- En `CUSTOM`, recuerda que `greeting_text`, `body_text` y `subject_template` no se aplican al envío real (ver la [advertencia sobre `CUSTOM`](#email-branding)).

**Body (JSON, opcional):** `greeting_text`, `body_text`, `footer_text` y `subject_template` (este último solo en `CUSTOM`). Lo que no envíes se toma de la configuración activa guardada.

```json
{
  "body_text": "<p>Adjuntamos su {{document_type}} número <b>{{document_number}}</b>.</p>"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecord": {
    "email_type": "INVOICE",
    "sample_data": {
      "recipient_name": "CLIENTE DE EJEMPLO S.A.S.",
      "recipient_tax_id": "901234567",
      "recipient_email": "cliente@ejemplo.com",
      "document_number": "SETP990000001"
    },
    "rendered": {
      "greeting_text": "<p>Hola CLIENTE DE EJEMPLO S.A.S.,</p>",
      "body_text": "<p>Adjuntamos su FACTURA ELECTRÓNICA DE VENTA número <b>SETP990000001</b>.</p>",
      "footer_text": null,
      "subject_template": null
    },
    "branding": {
      "logo_url": "https://.../logo-marca.png",
      "primary_color": "#0B5FFF",
      "secondary_color": "#F2F6FF",
      "border_color": "#D0D7E2",
      "greeting_text": "<p>Hola {{recipient_name}},</p>",
      "body_text": null,
      "footer_text": null,
      "subject_template": null,
      "is_custom": true
    }
  },
  "success": true
}
```

| Campo | Descripción |
|---|---|
| `sample_data` | Valores de ejemplo de las variables del tipo (recortado en el ejemplo). |
| `rendered` | Textos con las variables reemplazadas por los valores de ejemplo. |
| `branding` | Marca activa guardada para el tipo (logo, colores y textos guardados, con las variables sin reemplazar). Si no hay marca activa, trae los valores de la plataforma con `is_custom: false`. |

</details>

</details>
