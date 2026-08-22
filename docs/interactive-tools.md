---
sidebar_position: 6
description: "Herramientas interactivas para validar y calcular valores de facturas"
sidebar_label: 🧮 Herramientas
---

# 🧮 Herramientas Interactivas {#herramientas-interactivas}

Utiliza estas utilidades interactivas integradas en el navegador para calcular y validar datos fiscales antes de enviarlos a la API.

import NITValidator from '@site/src/components/Interactive/NITValidator';
import JSONValidator from '@site/src/components/Interactive/JSONValidator';
import TotalCalculator from '@site/src/components/Interactive/TotalCalculator';

---

## 🔍 Validador de NIT {#validador-nit}

Valida el dígito verificador de un NIT colombiano usando el algoritmo oficial módulo 11 de la DIAN.

<NITValidator />

---

## ✅ Validador de Factura JSON {#validador-factura-json}

Valida la estructura básica de una factura JSON y verifica cálculos importantes de impuestos y totales.

<JSONValidator />

---

## 🧮 Calculadora de Totales {#calculadora-totales}

Calcula automáticamente los totales de tu factura con descuentos, cargos e impuestos.

<TotalCalculator />

---

## 📝 Guía de Uso {#guia-de-uso}

1. **Para NITs**: Usa el [Validador de NIT](#validador-nit) para obtener el dígito de verificación correcto.
2. **Para facturas completas**: Pasa tu payload por el [Validador de Factura JSON](#validador-factura-json) antes de invocar `POST /invoice`.
3. **Para sumatorias complejas**: Usa la [Calculadora de Totales](#calculadora-totales) para cuadrar bases imponibles y totales a pagar.

:::tip Paridad de Algoritmos
Estas herramientas ejecutan exactamente las mismas reglas de validación que el motor de MATIAS API en el backend.
:::
