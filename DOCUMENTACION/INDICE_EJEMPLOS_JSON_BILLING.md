# 📋 Índice Completo de Ejemplos JSON - docs/jsons-billing

## 📂 Archivos Presentes

### Facturas Estándar
1. ✅ **invoice.md** (106 líneas)
   - Factura básica
   
2. ✅ **credit-invoice.md** (103 líneas)
   - Factura a crédito

3. ✅ **invoice-final-consumer.md** (92 líneas)
   - Factura consumidor final

### Facturas con Impuestos y Cargos
4. ✅ **invoice-with-taxes.md** (91 líneas)
   - Factura con varios impuestos

5. ✅ **invoice-with-charges.md** (134 líneas)
   - Factura con cargos

6. ✅ **invoice-with-discount.md** (69 líneas)
   - Factura con descuento

7. ✅ **invoice-with-taxes-charges-discounts.md** (129 líneas)
   - Factura con cargos + IVA - descuentos

8. ✅ **invoice-with-box-tax.md** (212 líneas)
   - Factura con impuesto tipo caja

### Facturas con Propinas
9. ✅ **invoice-with-tip.md** (160 líneas)
   - Factura con propina

10. ✅ **invoice-with-tip-tax.md** (187 líneas)
    - Factura con propina con IVA

### Facturas con Datos Extra
11. ✅ **invoice-extra-data.md** (127 líneas)
    - Factura con datos extra

12. ✅ **invoice-with-retentions-example.md** (119 líneas)
    - Factura con retenciones

### Facturas Especializadas
13. ✅ **AIU-invoice.md** (96 líneas)
    - Factura AIU

14. ✅ **invoice-tariff.md** (62 líneas)
    - Factura con arancel

### Facturas con Regalos
15. ✅ **invoice-with-gift.md** (75 líneas)
    - Factura con regalo

16. ✅ **invoice-with-gift-tax.md** (63 líneas)
    - Factura con regalo y IVA

### Facturas en Moneda Extranjera
17. ✅ **USD-invoice.md** (62 líneas)
    - Factura en dólares

18. ✅ **USD-invoice-exportation.md** (62 líneas)
    - Factura de exportación en dólares

19. ✅ **EURO-invoice.md** (160 líneas)
    - Factura en euros

### Compra y Venta de Divisas
20. ✅ **currency-sale.md** (76 líneas)
    - Factura venta de divisas

21. ✅ **currency-purchase.md** (76 líneas)
    - Factura compra de divisas

### Notas de Ajuste
22. ✅ **credit-note.md** (109 líneas)
    - Nota crédito

23. ✅ **credit-note-without-reference-to-invoice.md** (106 líneas)
    - Nota crédito sin referencia a factura

24. ✅ **debit-note.md** (86 líneas)
    - Nota débito

### Contingencias
25. ✅ **contingency-invoice-type-03.md** (215 líneas)
    - Factura tipo contingencia 03

26. ✅ **contingency-invoice-type-04.md** (220 líneas)
    - Factura tipo contingencia 04

---

## 📊 Resumen

| Categoría | Cantidad | Archivos |
|-----------|----------|----------|
| Facturas Estándar | 3 | invoice, credit-invoice, invoice-final-consumer |
| Con Impuestos/Cargos | 5 | invoice-with-taxes, invoice-with-charges, invoice-with-discount, invoice-with-taxes-charges-discounts, invoice-with-box-tax |
| Con Propinas | 2 | invoice-with-tip, invoice-with-tip-tax |
| Datos Extra | 2 | invoice-extra-data, invoice-with-retentions-example |
| Especializadas | 2 | AIU-invoice, invoice-tariff |
| Con Regalos | 2 | invoice-with-gift, invoice-with-gift-tax |
| Moneda Extranjera | 3 | USD-invoice, USD-invoice-exportation, EURO-invoice |
| Divisas | 2 | currency-sale, currency-purchase |
| Notas de Ajuste | 3 | credit-note, credit-note-without-reference-to-invoice, debit-note |
| Contingencias | 2 | contingency-invoice-type-03, contingency-invoice-type-04 |
| **TOTAL** | **26** | |

---

## ✅ Verificación de Completitud

### Archivos Verificados (Muestra)

**invoice.md** ✅
- Tiene JSON completo
- Incluye: resolution_number, prefix, document_number, customer, lines, tax_totals
- Líneas: 107 (header + JSON completo)

**credit-note.md** ✅
- Tiene JSON completo
- Incluye: discrepancy_response, billing_reference, customer, lines
- Líneas: 110 (header + JSON completo)

**contingency-invoice-type-04.md** ✅
- Archivo más grande (220 líneas)
- JSON completo con datos de contingencia

---

## 🔍 Posibles Puntos de Verificación

**¿Qué podría estar "omitido"?**

1. **Campos opcionales en líneas** - Algunos ejemplos podrían no mostrar todos los campos opcionales
2. **Campos de auditoría** - timestamp, created_by, etc.
3. **Notas específicas DIAN** - Regulaciones o requisitos especiales
4. **Ejemplos de error** - Cómo se vería un JSON con errores

---

## 📝 Próximos Pasos

Por favor confirma:

1. ¿Cuál específicamente es el archivo que tiene ejemplos omitidos?
2. ¿Qué campos o datos específicos falta?
3. ¿Tienes una referencia o backup con los datos completos?

Podré entonces:
- Completar el JSON faltante
- Agregar campos opcionales
- Mejorar la documentación
- Agregar ejemplos adicionales

---

*Generado para verificar completitud de ejemplos*
