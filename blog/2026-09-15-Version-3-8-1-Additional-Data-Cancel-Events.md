---
slug: version-3-8-1-additional-data-cancel-events
title: Version 3.8.1 - Campo additional_data, Cancelacion de Eventos y Actualizacion de Plantillas
authors: [lewis]
tags: [release, v3-8-1, additional-data, eventos, radian, plantillas, pdf]
---

Publicamos la version **3.8.1** de MATIAS API con tres mejoras: el nuevo campo `additional_data`, la cancelacion de eventos RADIAN encolados y la documentacion de plantillas de empresa.

<!--truncate-->

### 1. Campo `additional_data` - Datos extra en el PDF

Bloques de informacion estructurada que aparecen **unicamente en el PDF** y **no se envian a la DIAN**.

| Ambito | Clave JSON | Uso tipico |
|---|---|---|
| Documento | `additional_data` | Centro de costo, orden de servicio, afiliado |
| Cliente | `customer.extra_data` | Socio, categoria, fecha vinculacion |
| Linea de detalle | `lines[].extra_data` | Lote, serial, fecha vencimiento |

```json
{
  "additional_data": {
    "sections": [{
      "section": "Centro de Costo", "order": 1,
      "fields": [
        { "title": "Area", "value": "Ventas Norte", "type": "TEXT", "align": "LEFT", "order": 1 },
        { "title": "Presupuesto", "value": "5000000", "type": "CURRENCY", "align": "RIGHT", "order": 2 }
      ]
    }]
  }
}
```

**Tipos:** `TEXT`, `NUMBER`, `DATE`, `CURRENCY`. **Limites:** 10 secciones, 20 campos/seccion.

:::tip Plantilla Preprinted
- Seccion cuyo titulo contiene `centro de costo` se pinta en el recuadro superior izquierdo.
- Seccion con titulo `del usuario` o `afiliado` se pinta en el bloque de informacion del usuario.
:::

[Referencia completa en billing-fields](/docs/billing-fields#additional_data-)

---

### 2. Cancelacion de Eventos RADIAN Encolados

Nuevo endpoint `POST /api/ubl2.1/events/{id}/cancel` para cancelar eventos en estado `PENDING` antes de su transmision automatica.

- Solo transicion `PENDING` a `CANCELLED`.
- Devuelve `400` si ya esta en `PROCESSING`, `ACCEPTED` o `REJECTED`.
- Devuelve `404` si no existe o no pertenece a la empresa autenticada.
- Usa `lockForUpdate()` para evitar condicion de carrera con el cron.

[Ver endpoint de cancelacion](/docs/endpoints/events-radian#cancelar-evento)

---

### 3. Datos Adicionales en Plantillas de Empresa

La pagina [Plantillas de Empresa](/docs/endpoints/company-templates) cuenta ahora con la seccion **Datos Adicionales en el PDF** que documenta los tres bloques, el comportamiento de la plantilla Preprinted y los limites de validacion.

[Ver seccion company-templates](/docs/endpoints/company-templates#datos-adicionales-pdf)