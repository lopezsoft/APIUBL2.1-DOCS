---
sidebar_position: 7
description: "Herramientas interactivas para validar y calcular valores de facturas"
---

# Herramientas Interactivas

## Calculadoras y Validadores

Esta sección contiene herramientas interactivas para ayudarte a trabajar con facturación electrónica.

import NITValidator from '@site/src/components/Interactive/NITValidator';
import JSONValidator from '@site/src/components/Interactive/JSONValidator';
import TotalCalculator from '@site/src/components/Interactive/TotalCalculator';

---

## 🔍 Validador de NIT

Valida el dígito verificador de un NIT colombiano usando el algoritmo oficial de la DIAN.

<NITValidator />

---

## ✅ Validador de Factura JSON

Valida la estructura básica de una factura JSON y verifica cálculos importantes.

<JSONValidator />

---

## 🧮 Calculadora de Totales

Calcula automáticamente los totales de tu factura con descuentos e impuestos.

<TotalCalculator />

---

## 📝 Próximos Pasos

Cuando necesites validar tus datos:

1. **Para NITs**: Usa el validador de NIT para calcular el dígito verificador
2. **Para facturas completas**: Usa el validador JSON antes de enviar a la API
3. **Para cálculos**: Usa la calculadora de totales para verificar sumas e impuestos

:::tip
Todas estas herramientas usan los mismos algoritmos que la API de MATIAS, así que si pasan aquí, probablemente pasen en el servidor también.
:::
