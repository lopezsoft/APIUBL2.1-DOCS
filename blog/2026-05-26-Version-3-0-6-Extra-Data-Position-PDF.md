---
slug: version-3-0-6-extra-data-position-pdf
title: "Versión 3.0.6 - Posicionamiento de Columnas Adicionales (extra_data) en el PDF"
authors: [lewis]
tags: [release, v3-0-6, extra_data, pdf-layout, customization]
date: 2026-05-26
---

# 📊 API UBL 2.1 v3.0.6 - Control Total sobre Columnas Adicionales en el PDF

Publicamos la **versión 3.0.6** de la documentación de la API de Facturación Electrónica. Esta entrega introduce soporte documentado para el nuevo parámetro **`position`** dentro del arreglo de **`extra_data`** de las líneas de ítem (`linea->extra_data`). Ahora podrás posicionar de forma dinámica tus columnas personalizadas (como código de barras, lote, fecha de vencimiento, etc.) exactamente donde lo necesites en la representación gráfica del PDF.

<!--truncate-->

---

## 🌟 Qué hay de nuevo en la v3.0.6

El parámetro `extra_data` permite inyectar información clave a nivel de ítem que se renderiza exclusivamente en la representación gráfica (PDF), evitando la sobrecarga de datos innecesarios a la DIAN.

A partir de la versión **3.0.6**, se añade soporte para el parámetro **`position`**, el cual controla después de qué columna base se debe insertar la columna adicional:

### 1. Tabla de Posiciones Soportadas

| `position` | Columna insertada después de... | Ejemplo visual |
|:----------:|--------------------------------|----------------|
| `1` | **CÓDIGO** | `CÓDIGO | 👉 MI_CAMPO | DETALLE | CANT | ...` |
| `2` | **DETALLE** | `CÓDIGO | DETALLE | 👉 MI_CAMPO | CANT | ...` |
| `3` | **CANT** | `... | CANT | 👉 MI_CAMPO | U.M | ...` |
| `4` | **U.M** | `... | U.M | 👉 MI_CAMPO | PRECIO | ...` |
| `5` | **PRECIO** | `... | PRECIO | 👉 MI_CAMPO | DESCUENTO | ...` |
| `6` | **DESCUENTO** (si aplica) | `... | DESCUENTO | 👉 MI_CAMPO | RECARGO | ...` |
| `7` | **RECARGO** (si aplica) | `... | RECARGO | 👉 MI_CAMPO | IVA | ...` |
| _sin valor_ | _(comportamiento legacy)_ | `... | RECARGO | 👉 MI_CAMPO | IVA | ...` |

---

## 🔒 Reglas de Negocio y Compatibilidad

*   **Compatibilidad Legacy:** Si no se especifica `position`, la columna adicional se ubicará de forma automática después de los recargos y antes de los impuestos (comportamiento clásico), garantizando **cero impacto** en integraciones ya existentes.
*   **Conflictos de Layout:** Como todas las líneas de la factura comparten la misma estructura y cabecera de tabla, si diferentes líneas definen el mismo título (`title`) con diferente posición (`position`), se respetará la definición de la **primera línea** del documento.
*   **Rango Válido:** El rango permitido es del 1 al 7. Cualquier valor fuera de este rango se ignorará y aplicará la posición legacy por defecto.

---

## 📝 Ejemplo JSON de Integración

A continuación se muestra un ejemplo de cómo estructurar múltiples campos personalizados con posiciones asignadas:

```json
"extra_data": [
  {
    "title": "CODIGO_BARRAS",
    "value": "7703672001889",
    "align": "center",
    "position": 1
  },
  {
    "title": "LOTE",
    "value": "L-2025-001",
    "align": "left",
    "position": 2
  },
  {
    "title": "FECHA_VENCIMIENTO",
    "value": "2026-10-28",
    "align": "center"
  }
]
```

### 👁️ Resultado Visual Esperado en PDF:

```text
CÓDIGO | CODIGO BARRAS | DETALLE | LOTE | CANT | U.M | PRECIO | FECHA VENCIMIENTO | IVA | Vr. IVA | TOTAL
         (position=1)              (position=2)                    (sin position → legacy)
```

---

## 📈 Resumen de Cambios del Release

*   **`package.json`**: Bump a la versión estable `"3.0.6"`.
*   **`docusaurus.config.ts`**: Actualizado copyright a `"v3.0.6"`.
*   **`docs/intro.md`**: Actualizado pie de página a versión `"v3.0.6"`.
*   **`docs/billing-fields.md`**: Agregada la fila `position`, tabla de mapeo de columnas y advertencias del layout.
