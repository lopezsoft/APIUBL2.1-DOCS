---
sidebar_position: 3
description: "Tablas de equivalencias y catálogos de códigos para Factura Electrónica"
---

# Tablas de Equivalencias

Esta sección contiene todas las tablas de catálogos y equivalencias necesarias para la correcta emisión de facturas electrónicas según la DIAN.

## 📊 Catálogos Disponibles

### 1. Tipos de Documento

Los tipos de documento identifican qué tipo de factura se está emitiendo:

| ID | Tipo | Código | Descripción | Obligatorio |
|----|------|--------|-------------|-------------|
| 1 | **Factura Electrónica** | 01 | Comprobante de venta estándar | Sí |
| 2 | **Nota Crédito** | 02 | Ajuste por devolución o descuento | Sí |
| 3 | **Nota Débito** | 03 | Ajuste por incremento de valor | Sí |
| 4 | **Factura Cambio de Régimen** | 04 | Para cambios de régimen tributario | Sí |
| 5 | **Factura Importación** | 05 | Importaciones de mercancía | Sí |
| 91 | **POS** | 91 | Punto de Venta Electrónico | Sí |

:::tip
Para la mayoría de casos, usarás tipo **01** (Factura Electrónica).
:::

---

### 2. Tipos de Documento de Identidad

Utilizados para identificar al cliente:

| ID | Tipo | Código | Descripción | Validación |
|----|------|--------|-------------|-----------|
| 1 | **Cédula Ciudadanía** | CC | Documento colombiano | Formato: 1.000.000-X |
| 2 | **Cédula Extranjería** | CE | Extranjero residente | Formato: 1.000.000 |
| 3 | **NIT** | NIT | Número tributario | Formato: 900.000.000-X |
| 4 | **Tarjeta Identidad** | TI | Menores colombianos | Formato: 000.000-X |
| 5 | **Pasaporte** | PP | Documento internacional | Formato: 2 letras + números |
| 10 | **NURE** | NURE | Registro económico exterior | Formato específico |

:::warning
La DIAN rechazará documentos con validaciones incorrectas. Verifica el formato específico.
:::

---

### 3. Tipos de Operación

Define qué tipo de operación comercial se está realizando:

| ID | Código | Descripción | Aplicación |
|----|--------|-------------|-----------|
| 1 | **01** | Venta | Venta a cliente regular |
| 10 | **10** | Adquisición de bienes | Compra de inventario |
| 9 | **09** | Adquisición de servicios | Compra de servicios |
| 15 | **15** | Venta sin IVA | Exportaciones o excluidas |
| 11 | **11** | Devoluciones | Devolución de compra |

---

### 4. Métodos de Pago

Define cómo se pagará la factura:

| ID | Nombre | Descripción | Términos |
|----|--------|-------------|---------|
| 1 | **Contado** | Pago inmediato | Sin plazo |
| 2 | **Crédito** | Pago aplazado | Con plazo definido |
| 3 | **Contado-Crédito** | Combinado | Parcialidades |

---

### 5. Formas de Pago

Especifica el medio mediante el cual se realiza el pago:

| ID | Nombre | Descripción | Comprobante |
|----|--------|-------------|-----------|
| 1 | **Efectivo** | Dinero en físico | Recibo |
| 2 | **Cheque** | Cheque bancario | Número cheque |
| 3 | **Tarjeta Débito** | Débito directo | Cuotas |
| 4 | **Tarjeta Crédito** | Línea de crédito | Recibo |
| 5 | **Transferencia** | Transferencia electrónica | Comprobante transferencia |
| 6 | **Otro** | Otros métodos | Especificar |
| 7 | **Compensación** | Trueque/Intercambio | Documento soporte |
| 10 | **Billetera Digital** | Aplicación móvil | ID transacción |

---

### 6. Medios de Pago

Especifica el medio concreto de pago:

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | Efectivo | Dinero en efectivo |
| 2 | Cheque de Terceros | Cheque no emitido por el comprador |
| 3 | Cheque Propio | Cheque del comprador |
| 4 | Tarjeta de Crédito | Tarjeta de crédito |
| 5 | Tarjeta de Débito | Tarjeta de débito |
| 6 | Transferencia Bancaria | Traslado electrónico |
| 10 | Cuenta Corriente | Cuenta corriente bancaria |
| 31 | Billetera Digital | Moneda digital |

:::info
Para facturación electrónica estándar, usa: **Efectivo (1), Transferencia (6), Tarjeta Crédito (4)**
:::

---

### 7. Monedas

Define la moneda en que se emite la factura:

| ID | Código ISO | Nombre | País/Región | Cambio |
|----|-----------|--------|-----------|--------|
| 272 | **COP** | Peso Colombiano | Colombia | 1.00 |
| 484 | **USD** | Dólar Estadounidense | Estados Unidos | Variable |
| 978 | **EUR** | Euro | Unión Europea | Variable |
| 124 | **CAD** | Dólar Canadiense | Canadá | Variable |
| 36 | **AUD** | Dólar Australiano | Australia | Variable |

:::note
COP es la moneda por defecto. Si usas otra, incluye obligatoriamente la TRM (Tasa Representativa del Mercado).
:::

---

### 8. Impuestos

Los tipos de impuestos aplicables en Colombia:

| ID | Código DIAN | Nombre | Porcentajes | Aplicación |
|----|-----------|--------|-----------|-----------|
| 1 | **01** | IVA | 19%, 5%, 0% | Mayoría de bienes y servicios |
| 2 | **03** | Impuesto Consumo | Varios | Bebidas, cigarrillos, vehículos |
| 3 | **04** | Impuesto Timbre | Excepcional | Documentos específicos |
| 4 | **08** | Bolsas Plásticas | 8% | Solo bolsas plásticas |
| 5 | **07** | Bebidas Azucaradas | 8% | Bebidas con azúcar |

### Tasas de IVA Principales

| Porcentaje | Aplicación | Ejemplos |
|-----------|-----------|---------|
| **19%** | Estándar | Mayoría de productos |
| **5%** | Reducida | Alimentos básicos, medicinas |
| **0%** | Exento/Excluido | Exportaciones, servicios financieros |

:::warning
No uses otros porcentajes sin autorización explícita de la DIAN. Verifica si tu ítem califica para tasa reducida.
:::

---

### 9. Unidades de Cantidad

Define la unidad de medida del artículo:

| Código | Unidad | Descripción | Símbolo |
|--------|--------|-------------|--------|
| **1093** | Unidad | Cantidad entera | U |
| **2266** | Kilo | Peso en kilogramos | kg |
| **2239** | Gramo | Peso en gramos | g |
| **2138** | Mililitro | Volumen en mililitros | ml |
| **2243** | Litro | Volumen en litros | L |
| **3864** | Metro | Longitud en metros | m |
| **3861** | Centímetro | Longitud en centímetros | cm |
| **3852** | Metro Cuadrado | Área | m² |
| **3870** | Metro Cúbico | Volumen | m³ |
| **4353** | Hora | Tiempo | h |
| **4354** | Minuto | Tiempo | min |

:::tip
**1093 (Unidad)** es la más común para productos regulares.
:::

---

### 10. Tipos de Identificación de Items

Define cómo se identifica cada artículo/servicio:

| ID | Tipo | Descripción | Formato | Ejemplo |
|----|------|-------------|--------|---------|
| 1 | **SKU Interno** | Código propio de la empresa | Alfanumérico | ABX-123 |
| 2 | **EAN/UPC** | Código de barras estándar | 13 ó 12 dígitos | 5901234123457 |
| 3 | **ISBN** | Código de libros | 13 dígitos | 978-0134685991 |
| 4 | **GTIN** | Código comercial global | 14 dígitos | Específico |
| 5 | **Otra** | Otro tipo de código | Variable | Especificar |

---

### 11. Regímenes Tributarios (Emisor)

Define el régimen fiscal del que emite la factura:

| ID | Régimen | Descripción | Obligaciones |
|----|---------|-----------|-------------|
| 1 | **Régimen Común** | Empresas grandes | Reportes mensuales complejos |
| 2 | **Régimen Simplificado** | PYMES | Reportes simplificados |
| 3 | **Régimen Especial** | Sectores específicos | Reglas especiales |

---

### 12. Regímenes Fiscales (Cliente)

Define la categoría fiscal del cliente:

| ID | Régimen | Descripción |
|----|---------|-----------|
| 1 | Responsable del IVA | Debe reportar IVA |
| 2 | No Responsable del IVA | Excluido del IVA |
| 3 | Régimen Simplificado | PYME simplificada |
| 8 | Extranjero | Sujeto no residente |

---

### 13. Tipos de Organizaciones

Define el tipo de organización del cliente:

| ID | Tipo | Descripción |
|----|------|-------------|
| 1 | **Empresa** | Sociedad comercial |
| 2 | **Persona Natural** | Individuo |
| 3 | **Organización** | Entidad sin ánimo de lucro |
| 4 | **Extranjero** | Entidad internacional |

---

### 14. Razones de Descuento

Código DIAN que justifica un descuento:

| Código | Razón | Descripción |
|--------|-------|-------------|
| **01** | Descuento Comercial | Rebaja por volumen |
| **02** | Rebaja | Reducción de precio |
| **03** | Bonificación | Producto regalo |
| **04** | Promoción | Oferta especial |
| **05** | Devolución Parcial | Devolución parcial de mercancía |

---

### 15. Correcciones (Notas Crédito)

Define el tipo de ajuste en una Nota Crédito:

| Código | Tipo | Descripción | Impacto |
|--------|------|-------------|--------|
| **01** | Devolución Total | Cliente devuelve todo | Reembolso total |
| **02** | Devolución Parcial | Cliente devuelve parte | Reembolso parcial |
| **03** | Descuento Total | Descuento posterior a factura | Rebaja |
| **04** | Descuento Parcial | Descuento parcial | Rebaja parcial |
| **05** | Ajuste de Precio | Corrección de valor | Reajuste |

---

### 16. Países

Códigos ISO 3166 para países:

| Código | País | Continente |
|--------|------|-----------|
| **45** | Colombia | América del Sur |
| **484** | México | América del Norte |
| **32** | Argentina | América del Sur |
| **72** | Canadá | América del Norte |
| **604** | Perú | América del Sur |
| **591** | Ecuador | América del Sur |
| **598** | Uruguay | América del Sur |
| **56** | Chile | América del Sur |

:::info
**Colombia = 45** es el más común en facturas locales.
:::

---

### 17. Ciudades Principales (Colombia)

Códigos DANE de principales ciudades:

| Código DANE | Ciudad | Departamento |
|------------|--------|-------------|
| **05001000** | Medellín | Antioquia |
| **08001000** | Barranquilla | Atlántico |
| **11001000** | Bogotá D.C. | Cundinamarca |
| **76001000** | Cali | Valle del Cauca |
| **68001000** | Santa Marta | Magdalena |
| **05088000** | Envigado | Antioquia |

:::note
La DIAN mantiene el listado completo. Verifica el código DANE correcto de tu municipio.
:::

---

### 18. Condiciones de Entrega

Define cómo se entregará la mercancía:

| Código | Incoterm | Descripción |
|--------|---------|-------------|
| **01** | **Ex Works** | En las instalaciones del vendedor |
| **02** | **FCA** | Punto convenido |
| **03** | **FAS** | Puerto de embarque |
| **04** | **FOB** | Franco a bordo |
| **05** | **CFR** | Costo y flete |
| **06** | **CIF** | Costo, seguro y flete |
| **07** | **DAF** | Frontera acordada |
| **08** | **DDP** | Entregado en destino |

---

## 📥 Descargar Tablas

Todos los catálogos completos están disponibles en formato JSON:

```bash
# Descargar desde docs-json/
document-type.json
operation-type.json
payment-methods.json
currencies.json
taxes.json
countries.json
cities.json
identity-documents.json
quantity-units.json
```

---

## 🔍 Cómo Usar Estas Tablas

### En tu Factura JSON

```json
{
  "type_document_id": 1,                    // Tipo: Factura Electrónica
  "customer": {
    "identity_document_id": 3,              // Tipo ID: NIT
    "country_id": 45                        // País: Colombia
  },
  "lines": [
    {
      "quantity_units_id": 1093,            // Unidad: Unidad
      "tax_id": 1,                          // Impuesto: IVA
      "percent": 19                         // Porcentaje: 19%
    }
  ],
  "payment_method_id": 1,                   // Forma: Contado
  "means_payment_id": 6                     // Medio: Transferencia
}
```

---

## ⚠️ Validaciones Importantes

✅ **Todos los IDs deben ser válidos**: Si usas un ID inexistente, la factura será rechazada
✅ **Coherencia**: Si el país es 45 (Colombia), la ciudad debe ser un código DANE colombiano
✅ **Actualización**: DIAN actualiza periódicamente estos catálogos
✅ **Formato**: Respeta exactamente el formato de cada código

---

## 📚 Referencias

- **DIAN**: www.dian.gov.co
- **ISO 3166**: Códigos de país
- **DANE**: Códigos de ciudad
- **Resolución 000165/2024**: Regulación oficial

---

**Última actualización**: Octubre 2025  
**Vigencia**: Actual  
**Próxima revisión**: Cuando DIAN actualice catálogos
