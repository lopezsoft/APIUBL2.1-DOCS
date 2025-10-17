---
sidebar_position: 4
description: "Preguntas frecuentes sobre Factura Electrónica con respuestas prácticas"
---

# Preguntas Frecuentes (FAQ)

## ❓ Preguntas Generales

### ¿Qué es la Factura Electrónica (FE)?

La Factura Electrónica es un documento digital que acredita una transacción comercial. Es emitida por el vendedor y tiene validez legal ante cualquier autoridad en Colombia.

**Características:**
- ✅ Formato XML (UBL 2.1)
- ✅ Firma digital obligatoria
- ✅ Validez legal reconocida por DIAN
- ✅ Trazabilidad completa

---

### ¿Quién está obligado a emitir FE?

**Obligados:**
- Responsables del régimen común
- Responsables del régimen simplificado que opten por FE
- Prestadores de servicios (telecomunicaciones, energía, etc.)
- Empresas específicamente designadas por resolución DIAN

**Excepciones:**
- Microempresas (en ciertos casos)
- Algunos sectores especiales
- Consulta con DIAN tu caso específico

---

### ¿Cuál es la ventaja de FE sobre facturación en papel?

| Aspecto | Papel | Electrónica |
|--------|-------|-----------|
| Tiempo | Manual, lento | Automático, inmediato |
| Errores | Más comunes | Validadas automáticamente |
| Almacenamiento | Físico, riesgo | Digital, seguro |
| Auditoría | Difícil | Completa y trazable |
| Costo | Mayor (impresión) | Menor |

---

### ¿Puedo emitir FE sin certificado digital?

**NO**. El certificado digital es **obligatorio** para firmar la factura.

**Requisitos del certificado:**
- Emitido por AC (Autoridad Certificadora) autorizada por DIAN
- Vigencia mínima de 1 año
- Incluye datos del responsable

---

## ❓ Preguntas Técnicas

### ¿Cuál es el rango de facturación que puedo usar?

El rango es **autorizado por DIAN** según tu:
- Resolución de facturación
- Prefijo asignado
- Período de validez

**Ejemplo:**
- Resolución: 18760000001
- Prefijo: FEV
- Rango: 1-9,999,999
- Válida hasta: 31/12/2026

:::warning
No puedes facturar fuera de este rango. Si lo necesitas, solicita ampliación a DIAN.
:::

---

### ¿Qué pasa si emito una factura fuera del rango?

La factura será **rechazada** por la DIAN con error de validación.

**Soluciones:**
1. Solicitar ampliación del rango
2. Conseguir otra resolución
3. Usar un proveedor tecnológico que tenga rango disponible

---

### ¿Puedo modificar una factura después de emitirla?

**NO**. Está **prohibido**.

**Opciones si hay error:**
1. Emitir **Nota Crédito** (devuelve dinero)
2. Emitir **Nota Débito** (cobra adicional)
3. Emitir nueva factura correcta

---

### ¿Qué es la TRM (Tasa Representativa del Mercado)?

Es el **tipo de cambio oficial** entre COP y moneda extranjera, publicado diariamente por Banco de la República.

**Cuándo usarla:**
- Cuando facturas en USD, EUR, etc.
- Obligatorio en factura para conversión a COP

**Dónde obtenerla:**
- www.banrep.gov.co (oficial)
- SIIF Público (historiales)

---

### ¿Puedo usar varias monedas en una factura?

**NO**. Cada factura debe estar en **una sola moneda**.

**Opciones:**
1. Emitir factura en COP (convertir todo)
2. Emitir factura en USD (incluir TRM)
3. Factura separada por moneda

---

## ❓ Preguntas sobre Impuestos

### ¿Cuál es la tarifa de IVA correcta?

**Colombia aplica:**

| Tasa | Aplicación | Ejemplo |
|------|-----------|---------|
| **19%** | Estándar | Mayoría de bienes |
| **5%** | Reducida | Alimentos básicos |
| **0%** | Exenta/Excluida | Medicinas, exportaciones |

:::warning
**No inventes otros porcentajes**. DIAN rechazará la factura.

Si tu producto tiene tasa especial, verifica el ANDI o consulta con asesor.
:::

---

### ¿Cómo calculo el IVA correctamente?

**Fórmula:**
```
IVA = Subtotal × Porcentaje IVA / 100

Ejemplo:
Artículo: $100,000
IVA 19%: $100,000 × 19 / 100 = $19,000
Total:   $119,000
```

**En factura:**
```json
{
  "line_extension_amount": 100000,
  "tax_id": 1,
  "percent": 19,
  "taxable_amount": 100000,
  "tax_amount": 19000
}
```

---

### ¿Qué es Retefuente y cuándo aplica?

**Retefuente** es una retención en la fuente sobre la renta. Aplica cuando:
- El cliente es una empresa grande
- Es una compra de servicios específicos
- Por ley se debe retener un %

**Porcentajes comunes:**
- 2% Servicios
- 3.5% Honorarios
- 4% Instalación

:::note
La **Retefuente se descuenta** del total que debe pagar el cliente.
:::

---

### ¿Puedo aplicar descuentos sin justificación?

**Legalmente**, sí. Pero **documentalo** siempre:
- Razón del descuento
- Porcentaje o monto
- Aprobación si es requerida

**Tipos de descuentos:**
- Comercial: Volumen, cliente frecuente
- Promocional: Oferta especial
- Por devolución: Parcialmente

---

## ❓ Preguntas sobre Clientes

### ¿Puedo facturar a consumidor final?

**Sí**, pero debes tener identificación válida:

**Documentos válidos:**
- Cédula de Ciudadanía (CC)
- Pasaporte
- Cédula de Extranjería (CE)
- Tarjeta de Identidad (TI)

:::warning
No pueden dejar campo vacío. Si no se identifica, documentalo como "Cliente sin identificar".
:::

---

### ¿Qué datos mínimos necesito del cliente?

**Obligatorios:**
- Tipo de documento
- Número de documento
- Nombre/Razón social
- Dirección
- Ciudad

**Opcionales pero recomendados:**
- Teléfono
- Email
- NIT (si es empresa)

---

### ¿Puedo facturar a cliente extranjero?

**Sí**, con consideraciones especiales:

**Checklist:**
- ✅ Usar código de país (ISO 3166)
- ✅ Moneda: COP o moneda del cliente
- ✅ Documento válido del extranjero
- ✅ Ciudad: Especificar origen

**Impuestos:**
- Exportaciones de bienes: IVA 0%
- Servicios al exterior: Según contrato

---

## ❓ Preguntas sobre Validación

### ¿Por qué me rechaza la factura con error de consecutividad?

**Causa**: Emitiste una factura con número que ya existe.

**Soluciones:**
1. Verifica el último número facturado
2. Continúa con el siguiente número secuencial
3. No repitas números

**Ejemplo correcto:**
- Última: FEV-9995
- Siguiente: FEV-9996
- Siguiente: FEV-9997

---

### ¿Cómo valido que mis cálculos sean correctos?

**Checklist de validación:**

```
✅ Línea 1: 100 × $50 = $5,000
✅ Línea 2: 200 × $25 = $5,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal = $10,000

Descuentos = -$1,000
Base = $9,000

IVA 19% = $1,710
Total = $10,710
```

---

### ¿Qué hacer si hay error después de emitir?

**Procedimiento:**

1. **Identifica el error**
   - ¿Es de cálculo?
   - ¿Es de datos del cliente?
   - ¿Es de artículos?

2. **Emite ajuste**
   - Nota Crédito: Si es sobre-facturación
   - Nota Débito: Si es subfacturación

3. **Documenta**
   - Motivo del ajuste
   - Referencia a factura original
   - Aprobación de cliente si aplica

---

## ❓ Preguntas sobre Pagos

### ¿Puedo especificar plazo de pago?

**Sí**. Campos disponibles:

```json
{
  "payment_method_id": 2,           // Crédito
  "payment_due_date": "2025-11-17", // Vence en 30 días
  "payment_terms": "Net 30"         // Especificación
}
```

---

### ¿Qué diferencia hay entre Contado y Crédito?

| Aspecto | Contado | Crédito |
|--------|---------|---------|
| Pago | Inmediato | Aplazado |
| Plazo | Sin plazo | Con fecha vencimiento |
| Interés | No | Puede incluirse |
| Factura | Cierra de inmediato | Queda abierta |

---

### ¿Cómo diferencio cheque propio de cheque de terceros?

**Cheque Propio (ID 3):**
- Emitido por el cliente/comprador
- Genera confianza

**Cheque de Terceros (ID 2):**
- Emitido por otra persona/empresa
- Mayor riesgo de no pago

---

## ❓ Preguntas sobre Casos Especiales

### ¿Cómo facturo si hay devolución parcial?

**Opción 1: Nota Crédito Parcial**
```
Factura original: $1,000,000
Devolución: $200,000
Nota Crédito: -$200,000
Neto pagadero: $800,000
```

**Opción 2: Nueva factura**
- Cancelar factura original
- Emitir nueva factura correcta

:::tip
La Nota Crédito es la opción recomendada (mantiene trazabilidad).
:::

---

### ¿Cómo facturo exportaciones?

**Características:**
- IVA: 0%
- Cliente: Extranjero
- Documentación: Aduanal requerida
- Moneda: Generalmente USD

**Checklist:**
- ✅ País del cliente: Extranjero
- ✅ Ciudad: Origen de embarque
- ✅ Documentación aduanal
- ✅ TRM si es en COP

---

### ¿Puedo facturas servicios?

**Sí**, con consideraciones:

**Campos especiales:**
- Descripción: Debe ser clara del servicio
- Cantidad: Horas, días, unidades
- Precio: Tarifa del servicio

**Impuestos:**
- Usualmente IVA 19%
- Algunos servicios: Tarifa reducida

---

## ❓ Preguntas sobre Persistencia

### ¿Por cuánto tiempo debo guardar las facturas?

**Normativa DIAN:**
- **Mínimo: 5 años**
- Se cuenta desde emisión
- Debe incluir: XML, PDF, datos

---

### ¿Dónde debo almacenar las facturas?

**Opciones:**
- 📁 Servidor propio (con respaldo)
- ☁️ Nube (Dropbox, Google Drive)
- 💾 Sistemas especializados
- 📄 Copia en papel (respaldo)

:::warning
**Obligatorio**: Guardar tanto XML como PDF.
El PDF es para visualización, el XML es para trazabilidad.
:::

---

### ¿Qué pasa si pierdo un archivo?

**Consecuencias:**
- ❌ No puedes probar la transacción
- ❌ Riesgo ante auditoría DIAN
- ❌ Posible multa

**Prevención:**
- Respalda automáticamente
- Usa múltiples medios
- Verifica integridad regularmente

---

## ❓ Soporte y Ayuda

### ¿Dónde puedo verificar si mi NIT está activo?

**DIAN - RUT Público:**
- www.dian.gov.co
- Sección: Consultar RUT
- Ingresa: NIT

---

### ¿A quién contacto si tengo problemas?

**Opciones:**
1. **DIAN oficial**: www.dian.gov.co
2. **Agencia Virtual**: Consultas y trámites
3. **Teléfono DIAN**: +57 1 315 0000
4. **Email de soporte**

---

### ¿Hay multas por facturas incorrectas?

**Sí**, la DIAN aplica multas por:

| Error | Multa |
|-------|-------|
| No declarar factura | 0.5 - 2 UVT |
| Documento fuera de rango | 1 - 5 UVT |
| Firma inválida | 1 - 10 UVT |
| No reportar a tiempo | 2 - 20 UVT |

:::warning
**1 UVT 2025 ≈ $46,000 COP**

Cumple correctamente para evitar sanciones.
:::

---

## 📞 ¿No encontraste respuesta?

Si tu pregunta no está aquí:

1. ✅ Consulta el **[Anexo Técnico completo](/docs/regulatory-framework/factura-electronica/technical-annex)**
2. ✅ Ver **[Validaciones](/docs/regulatory-framework/factura-electronica/anexo-tecnico/validaciones)**
3. ✅ Ver **[Excepciones](/docs/regulatory-framework/factura-electronica/anexo-tecnico/excepciones)**
4. ✅ Contacta a **[DIAN oficial](https://www.dian.gov.co)**

---

**Última actualización**: Octubre 2025  
**Vigencia**: Actual  
**¿Sugerencias?**: Contacta al administrador
