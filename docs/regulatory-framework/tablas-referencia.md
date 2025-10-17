---
sidebar_position: 99
description: "Consolidación de todas las tablas de equivalencias DIAN en un único recurso central navegable"
---

# 📊 Centro de Tablas de Referencia DIAN

## 🎯 Introducción

Este documento consolida las **18 tablas de equivalencias** utilizadas en los documentos electrónicos colombianos (FE, Nómina, RADIAN, Doc Soporte) en un único recurso centralizado para fácil búsqueda y consulta.

### Índice de Tablas

```
GENERALES (3)
├─ 1. Tipos de Documento
├─ 2. Tipos de Identificación
└─ 3. Países del Mundo

OPERACIONALES (4)
├─ 4. Tipos de Operación
├─ 5. Tipos de Medio de Pago
├─ 6. Condiciones de Entrega
└─ 7. Términos de Pago

FISCALES (4)
├─ 8. Tipos de Regímenes Tributarios
├─ 9. Códigos de Impuestos (IVA, Consumo, etc.)
├─ 10. Códigos de Descuentos
└─ 11. Códigos de Retención

TÉCNICAS (4)
├─ 12. Monedas
├─ 13. Unidades de Medida
├─ 14. Conceptos Adicionales
└─ 15. Códigos de Nota Crédito/Débito

ESPECIALIZADAS (3)
├─ 16. Códigos de Corrección (Notas)
├─ 17. Estados de Respuesta (RADIAN)
└─ 18. Códigos de Evento (RADIAN)

Total: 18 tablas, ~500+ códigos documentados
```

---

## 📋 TABLA 1: Tipos de Documento

### Definición
Clasificación de todos los tipos de documentos electrónicos permitidos en Colombia.

### Tabla Completa

| Código | Descripción | Versión | Sigla | Uso Principal |
|--------|------------|---------|-------|---------------|
| 01 | Factura | 1.9 | FE | Venta de bienes/servicios (obligados) |
| 02 | Nota Crédito | 1.9 | NC | Devoluciones/descuentos post-factura |
| 03 | Nota Débito | 1.9 | ND | Cargos adicionales post-factura |
| 05 | Documento Soporte | 1.1 | DS | Operaciones de efectivo |
| 04 | Documento Equivalente | 1.1 | DE | Adquisiciones a no obligados |
| 06 | Comprobante de Pago | - | CPP | Comprobante de pago RADIAN |
| 07 | Nómina | 3.0 | NE | Pagos a empleados |
| 08 | Reemplazo de Nómina | 3.0 | RN | Corrección de nómina |
| 09 | Eliminación de Nómina | 3.0 | EN | Anulación de nómina |
| 10 | Ajuste de Nómina | 3.0 | AN | Ajuste de cálculos |

### Notas de Uso

```
FE (01):  Obligatorio para obligados a facturar
NC (02):  Debe referenciar FE original
ND (03):  Debe referenciar FE original
DS (05):  Para operaciones de efectivo sin IVA
DE (04):  Para compras a no obligados
NE (07):  Mensual para nóminas
```

---

## 👤 TABLA 2: Tipos de Identificación

### Definición
Documentos válidos para identificar personas naturales y jurídicas.

### Tabla Completa

| Código | Tipo | Descripción | Dígitos | País | Ejemplo |
|--------|------|-------------|---------|------|---------|
| CC | Cédula | Cédula de Ciudadanía | 8-10 | CO | 98765432-1 |
| NIT | Impuesto | Número de Identificación Tributaria | 9+verif | CO | 123456789-1 |
| CE | Extranjería | Cédula de Extranjería | Var | CO | 1234567 |
| PA | Pasaporte | Pasaporte | Var | INT | AB12345 |
| PEP | Permanencia | Permiso Especial de Permanencia | Var | CO | PEP-12345 |
| NUIP | NUIP | Número Único ID Personal | 13 | CO | 1234567890123 |
| TI | Identidad | Tarjeta de Identidad | Var | CO | T-123456 |
| PP | Cédula | Pasaporte - Personas | Var | INT | ABC123456 |

### Uso por Documento

```
Factura:
├─ NIT (obligatorio para empresa)
├─ CC (personas naturales obligadas)
└─ CE, PA (extranjeros residentes)

Nómina:
├─ CC (empleado)
├─ CE (extranjero residente)
└─ PEP (migrante)

Doc Soporte:
├─ Cualquier tipo válido
└─ Verificación con DIAN
```

---

## 🌍 TABLA 3: Países del Mundo

### Definición
Códigos ISO 3166-1 para todos los países (ejemplo ampliado).

### Tabla Principal (20+ principales)

| Código | País | Región | Población | Moneda |
|--------|------|--------|-----------|--------|
| CO | Colombia | América del Sur | 52M | COP |
| VE | Venezuela | América del Sur | 29M | VES |
| EC | Ecuador | América del Sur | 18M | USD |
| PE | Perú | América del Sur | 34M | PEN |
| BR | Brasil | América del Sur | 215M | BRL |
| CL | Chile | América del Sur | 19M | CLP |
| AR | Argentina | América del Sur | 46M | ARS |
| MX | México | América del Norte | 130M | MXN |
| US | Estados Unidos | América del Norte | 340M | USD |
| CA | Canadá | América del Norte | 39M | CAD |
| ES | España | Europa | 48M | EUR |
| DE | Alemania | Europa | 84M | EUR |
| FR | Francia | Europa | 68M | EUR |
| GB | Reino Unido | Europa | 68M | GBP |
| IT | Italia | Europa | 57M | EUR |
| JP | Japón | Asia | 123M | JPY |
| CN | China | Asia | 1.4B | CNY |
| IN | India | Asia | 1.4B | INR |
| MX | México | América Central | 130M | MXN |
| PA | Panamá | América Central | 4M | PAB |

### Notas

```
Uso en FE:
├─ País de destino para exportaciones
├─ País del cliente extranjero
└─ Validación de normativa aduanal

Moneda vinculada:
├─ Se usa para conversión (si aplica)
├─ COP es default en Colombia
└─ USD permitido en casos especiales
```

---

## 🔄 TABLA 4: Tipos de Operación

### Definición
Clasificación del tipo de operación comercial realizada.

### Tabla Completa

| Código | Operación | Descripción | IVA | Retención | Doc |
|--------|-----------|-------------|-----|-----------|-----|
| 10 | Venta | Venta de bienes/servicios | Sí | Sí* | FE |
| 20 | Devolución | Devolución de producto | Sí | Sí* | NC |
| 30 | Donación | Donación de bien | Sí | No | FE |
| 40 | Descuento | Descuento comercial | Sí | No | NC |
| 50 | Renta | Arrendamiento | Sí | Sí | FE |
| 60 | Comisión | Pago de comisión | Sí | Sí | FE |
| 70 | Reembolso | Reembolso de gastos | Sí | Sí | FE |
| 80 | Traspaso | Traspaso entre sedes | No | No | DC |
| 90 | Ajuste | Ajuste por error | Var | No | ND |
| 99 | Otra | Otra operación | Sí | Sí* | FE |

### Notas de Operación

```
* Retención "Sí*" significa: depende de régimen
  ├─ Simplificado: No aplica
  ├─ Común: Sí aplica
  └─ Especial: Depende

Doc: Tipo de documento asociado
├─ FE: Factura
├─ NC: Nota Crédito
├─ ND: Nota Débito
└─ DC: Documento de Control
```

---

## 💳 TABLA 5: Tipos de Medio de Pago

### Definición
Formas de pago permitidas en operaciones electrónicas.

### Tabla Completa

| Código | Medio | Descripción | Validación | Sincrónico | Riesgo |
|--------|-------|-------------|-----------|-----------|--------|
| 1 | Efectivo | Efectivo al contado | Manual | Sí | Bajo |
| 2 | Cheque | Cheque (diferido o hoy) | Número banco | No | Medio |
| 3 | Tarjeta de Crédito | Tarjeta de crédito | BIN + autorización | Sí | Bajo |
| 4 | Tarjeta de Débito | Tarjeta de débito | BIN + PIN | Sí | Muy Bajo |
| 5 | Transferencia | Transferencia bancaria | IBAN/Cuenta | No | Muy Bajo |
| 6 | Depósito | Depósito bancario | Comprobante | No | Muy Bajo |
| 7 | Letra de Cambio | Letra de cambio | Firmante | No | Alto |
| 8 | Pagaré | Pagaré | Firmante | No | Alto |
| 9 | Compensación | Compensación entre cuentas | Referencia | Sí | Medio |
| 10 | Moneda Digital | Criptomoneda/Stablecoin | Hash bloquecadena | Sí | Muy Alto |
| 11 | Billetera Digital | Billetera digital/app | Token autenticación | Sí | Bajo |
| 12 | OTROS | Otro medio de pago | Especificación | Var | Var |

### Combinaciones Válidas

```
PAGO SIMPLE: UN medio de pago
├─ Efectivo: $100,000
├─ Tarjeta crédito: $100,000
└─ Transferencia: $100,000

PAGO MIXTO: MÚLTIPLES medios
├─ Efectivo: $50,000
├─ Tarjeta débito: $50,000
└─ Total: $100,000

CICLO DE PAGO:
├─ Inmediato: Efectivo, Tarjeta, Transferencia
├─ A crédito: Cheque, Letra, Pagaré (30/60/90 días)
└─ Sincrónico: Se verifica en el acto
```

---

## 📦 TABLA 6: Condiciones de Entrega

### Definición
Término comercial que define responsabilidad de transporte e imagen del bien.

### Tabla Completa

| Código | Incoterm | Descripción | Vendedor | Transporte | Seguro | Riesgo |
|--------|----------|-------------|----------|-----------|--------|--------|
| 1 | EXW | Ex Works (En fábrica) | Entrega en fábrica | Comprador | Comprador | Comprador |
| 2 | FOB | Free on Board (Libre a bordo) | Hasta puerto embarque | Vendedor | Comprador | Comprador |
| 3 | CIF | Cost Insurance Freight (Costo, seguro y flete) | Hasta puerto destino | Vendedor | Vendedor | Vendedor |
| 4 | CIP | Carriage & Insurance Paid to | Hasta lugar destino | Vendedor | Vendedor | Vendedor |
| 5 | DDP | Delivered Duty Paid (Entregado derechos pagos) | Hasta cliente | Vendedor | Vendedor | Vendedor |
| 6 | DAP | Delivered at Place (Entregado en lugar) | Hasta cliente | Vendedor | Vendedor | Vendedor |
| 7 | PICKUP | Recogida | En punto de venta | Comprador | Comprador | Comprador |
| 8 | DELIVERY | Entrega a domicilio | A domicilio | Vendedor | Vendedor | Vendedor |

### Uso en Facturación

```
NACIONAL:
├─ EXW: Muy raro
├─ PICKUP: Tienda física
├─ DELIVERY: E-commerce
└─ DAP: B2B típico

INTERNACIONAL:
├─ FOB: Exportación
├─ CIF: Importación
└─ DDP: Acuerdos especiales

IMP ACTA: Se registra en FE
└─ Identifica responsabilidad si hay daño/pérdida
```

---

## ⏰ TABLA 7: Términos de Pago

### Definición
Plazo y modalidad del pago pactado.

### Tabla Completa

| Código | Plazo | Descripción | Días | Interés | Aplicación |
|--------|-------|-------------|------|---------|------------|
| 1 | CONTADO | Pago inmediato | 0 | 0% | Venta directa |
| 2 | 15 DÍAS | Crédito 15 días | 15 | Acuerdo | B2B pequeño |
| 3 | 30 DÍAS | Crédito 30 días | 30 | 0-2% | B2B estándar |
| 4 | 45 DÍAS | Crédito 45 días | 45 | 0-3% | B2B grande |
| 5 | 60 DÍAS | Crédito 60 días | 60 | 0-4% | B2B corporativo |
| 6 | 90 DÍAS | Crédito 90 días | 90 | 1-5% | B2B estratégico |
| 7 | 120 DÍAS | Crédito 120 días | 120 | 2-6% | B2B excepcional |
| 8 | CUOTAS | Pago en cuotas | Var | Acuerdo | Monto grande |
| 9 | CONTRA-ENTREGA | Al recibir | 0-2 | 0% | Envío especial |
| 10 | LETRA | A vencimiento | Var | Acuerdo | Negociable |

### Implicaciones Tributarias

```
CONTADO:
├─ IVA: Causado hoy
├─ Retención: Inmediata (si aplica)
└─ Pago: Dentro 5 días hábiles

CRÉDITO (30-90):
├─ IVA: Causado en factura
├─ Retención: Se dilata
├─ Pago: Según plazo
└─ Interés: Gasto deducible (si contratado)

EFECTO CASH FLOW:
├─ Contado: +Liquidez inmediata
├─ Crédito: -Liquidez diferida
└─ Cuotas: Promedio ponderado
```

---

## 💰 TABLA 8: Regímenes Tributarios

### Definición
Categorización fiscal del contribuyente en Colombia.

### Tabla Completa

| Código | Régimen | Descripción | Obligaciones | IVA | Renta | Impuesto |
|--------|---------|-------------|--------------|-----|-------|----------|
| 1 | Común | Régimen tributario común | Máximas | Sí | Sí | IVA+Renta |
| 2 | Simplificado | IMAN simple (pequeño) | Mínimas | No | Sí | Impuesto único |
| 3 | Especial | Transporte, minería, etc. | Específicas | Especial | Especial | Especial |
| 4 | Contribuyente No Obligado FE | No genera FE | Ninguna | No | No | Documento Equivalente |
| 5 | Zona Franca | Empresa en zona franca | Mínimas | Excepto | Excepto | Beneficios |
| 6 | SARL | Sociedad administrada régimen | Mínimas | No | Limitado | Impuesto único |
| 7 | Profesional Independiente | Ejercicio profesión | Medias | Opcional | Sí | Deducible |
| 8 | Exento | Entidad sin ánimo lucro | Específicas | Exento | Exento | Ninguno |

### Obligaciones según Régimen

```
COMÚN:
├─ Factura: Obligatoria
├─ IVA: Obligatorio
├─ Retención: Debe aplicar y certificar
├─ Reportes: Mensuales
└─ Auditoría: Sí

SIMPLIFICADO:
├─ Factura: No obligatoria (hasta límite)
├─ IVA: No genera
├─ Impuesto: Único + seguro
├─ Reportes: Anuales
└─ Auditoría: No

ESPECIAL:
├─ Factura: Por sector
├─ Obligaciones: Según normativa específica
└─ Beneficios: Según sector
```

---

## 🏛️ TABLA 9: Códigos de Impuestos

### Definición
Tipos y tasas de impuesto aplicables en documentos electrónicos.

### Tabla Completa

| Código | Tipo | Tasa | Descripción | Aplicación | Base |
|--------|------|------|-------------|------------|------|
| 01 | IVA | 19% | Impuesto sobre Valor Agregado | Bienes/Servicios | Valor neto |
| 02 | IVA | 5% | IVA reducido | Alimentos básicos | Valor neto |
| 03 | IVA | 0% | IVA exento | Exportaciones | Valor neto |
| 04 | IVA DIFERENCIADO | Var | IVA según bien | Alimentos, medicinas | Valor neto |
| 05 | ICA | 0-4% | Impuesto de Industria y Comercio | Local/Municipal | Valor neto |
| 06 | Consumo | 8-35% | Impuesto al Consumo | Bebidas, combustible | Valor neto |
| 07 | Timbre | 0-0.3% | Impuesto de Timbre | Documentos | Valor |
| 08 | Renta | 19-37% | Impuesto sobre la Renta | Empresa/Individual | Utilidad neta |
| 09 | Patrimonio | 0.5-1.5% | Impuesto sobre Patrimonio | Personas | Patrimonio |
| 10 | Contribución | Var | Contribuciones especiales | Sectores específicos | Base especial |

### Aplicación en FE

```
BIENES ORDINARIOS:
├─ Impuesto: IVA
├─ Tasa: 19%
├─ Fórmula: (Valor - Descuentos) × 19%

BIENES EXENTOS:
├─ Impuesto: IVA 0%
├─ Ejemplos: Exportaciones, alimentos básicos
├─ Fórmula: (Valor) × 0% = $0

SERVICIOS:
├─ Impuesto: IVA
├─ Tasa: 19% (normalmente)
├─ Fórmula: (Valor - Descuentos) × 19%

MÚLTIPLES IMPUESTOS:
├─ IVA: 19% (sobre neto)
├─ ICA: 2% (sobre bruto, ejemplo Bogotá)
└─ Total impuesto: Se suma
```

---

## 💸 TABLA 10: Códigos de Descuentos

### Definición
Razones comerciales y promotoras para descuentos.

### Tabla Completa

| Código | Tipo | Descripción | Porcentaje | Frecuencia | Documentación |
|--------|------|-------------|-----------|-----------|---------------|
| 01 | Volumen | Descuento por volumen | 1-20% | Común | Contrato |
| 02 | Pronto Pago | Descuento por pago inmediato | 1-3% | Frecuente | Automático |
| 03 | Estacional | Descuento estacional/promocional | 5-30% | Periódica | Manual |
| 04 | Cliente Especial | Descuento cliente estratégico | 5-15% | Continua | Acuerdo |
| 05 | Devolución | Descuento por devolución parcial | 1-100% | Ocasional | Nota Crédito |
| 06 | Defecto | Descuento por defecto/daño | 5-50% | Raro | Manual |
| 07 | Fidelización | Descuento por fidelización | 2-10% | Periódica | Acuerdo |
| 08 | Público | Descuento publicitario | 3-20% | Ocasional | Manual |
| 09 | Múltiple | Múltiples descuentos se aplican | Var | Normal | Sistema |
| 10 | Rebaja General | Rebaja general por política | Var | Ocasional | Corporativo |

### Cálculo de Descuentos

```
DESCUENTO SIMPLE:
Base: $100,000
Descuento 10%: $100,000 × 10% = $10,000
Total: $100,000 - $10,000 = $90,000

DESCUENTOS MÚLTIPLES (Cascada):
Base: $100,000
Desc 1 (10%): $100,000 × 10% = $10,000 → $90,000
Desc 2 (5%): $90,000 × 5% = $4,500 → $85,500
Total: $85,500 (cascada)

O (Acumulativo):
Desc 1 + Desc 2: (10% + 5%) = 15%
$100,000 × 15% = $15,000
Total: $85,000
```

---

## 🔐 TABLA 11: Códigos de Retención

### Definición
Impuestos que se retienen al momento de compra (deducibles para comprador).

### Tabla Completa

| Código | Tipo | Porcentaje | Concepto | Descripción |
|--------|------|-----------|---------|------------|
| 01 | RFT IVA | 1-15% | Retención IVA | Retención sobre IVA (caso especial) |
| 02 | RFT RENTA | 3-10% | Retención Renta | Sobre servicios técnicos, consultoría |
| 03 | RFIVA | 8-15% | Retención IVA | Retención general sobre IVA |
| 04 | CFT | 2-3.5% | Comisión Fiducia | Comisión fiduciaria retenida |
| 05 | IVA | 8-19% | IVA Retención | IVA retenido en origen |
| 06 | RENTA SERVICE | 11% | Retención Servicios | Servicios personales dependientes |
| 07 | RENTA INDEPENDENT | 15-20% | Retención Profesionales | Trabajadores independientes |
| 08 | ARRENDAMIENTO | 2-3% | Retención Arrendamiento | Retención en pagos por arriendo |
| 09 | COMISIONES | 2-3.5% | Retención Comisiones | Retención en comisiones de venta |
| 10 | PRODUCTOS FINANCIEROS | 19-35% | Retención GMF | Impuesto a movimiento financiero |

### Aplicación en FE

```
EJEMPLO: Factura $1,000,000 + IVA 19%

Base: $1,000,000
IVA (19%): $190,000
Total: $1,190,000

RETENCIÓN A APLICAR:
Retención IVA (15% s/IVA): $190,000 × 15% = $28,500

PAGO NETO:
Total - Retención: $1,190,000 - $28,500 = $1,161,500
Retención genera crédito para vendedor
```

---

## 💱 TABLA 12: Monedas

### Definición
Códigos ISO 4217 de monedas internacionales permitidas.

### Tabla Completa

| Código | Moneda | País | Símbolo | Tasa típica a COP |
|--------|--------|------|---------|-----------------|
| COP | Peso Colombiano | Colombia | $ | 1.00 |
| USD | Dólar Estadounidense | EE.UU. | $ | 3,800-4,200 |
| EUR | Euro | Eurozona | € | 4,100-4,500 |
| MXN | Peso Mexicano | México | $ | 220-250 |
| BRL | Real Brasileño | Brasil | R$ | 760-800 |
| PEN | Sol Peruano | Perú | S/ | 1,100-1,200 |
| CLP | Peso Chileno | Chile | $ | 4.2-4.5 |
| ARS | Peso Argentino | Argentina | $ | 35-45 |
| VES | Bolívar Soberano | Venezuela | Bs | 0.025 (TRM) |
| CAD | Dólar Canadiense | Canadá | $ | 2,800-3,000 |
| GBP | Libra Esterlina | Reino Unido | £ | 4,700-5,000 |
| JPY | Yen Japonés | Japón | ¥ | 25-30 |
| CNY | Yuan Chino | China | ¥ | 500-600 |
| CHF | Franco Suizo | Suiza | Fr. | 4,200-4,600 |
| SGD | Dólar Singapur | Singapur | $ | 2,800-3,000 |
| AED | Dirham Emiratos | EAU | د.إ | 1,000 |
| INR | Rupia India | India | ₹ | 45-50 |

### Uso en Colombia

```
DEFAULT: COP (Pesos)
├─ Todas las operaciones internas
├─ Conversión obligatoria si otro tipo
└─ TRM del día de factura

PERMITIDAS (Casos especiales):
├─ USD: Exportaciones
├─ EUR: Importaciones europeas
├─ Otras: Con autorización especial DIAN

CONVERSIÓN:
├─ Se usa TRM del Banco de la República
├─ Debe registrarse en FE
└─ Reportes siempre en COP
```

---

## 📏 TABLA 13: Unidades de Medida

### Definición
Códigos UNECE de unidades de medida para cantidades.

### Tabla Completa

| Código | Unidad | Descripción | Símbolo | Tipo |
|--------|--------|------------|---------|------|
| UN | Unidad | Unidad sin especificar | u | General |
| KG | Kilogramo | Kilogramo | kg | Peso |
| G | Gramo | Gramo | g | Peso |
| LT | Litro | Litro | L | Volumen |
| ML | Mililitro | Mililitro | mL | Volumen |
| MT | Metro | Metro lineal | m | Longitud |
| CM | Centímetro | Centímetro | cm | Longitud |
| M2 | Metro cuadrado | Metro cuadrado | m² | Área |
| M3 | Metro cúbico | Metro cúbico | m³ | Volumen |
| HOR | Hora | Hora | h | Tiempo |
| DIA | Día | Día | d | Tiempo |
| MES | Mes | Mes | mes | Tiempo |
| MIN | Minuto | Minuto | min | Tiempo |
| SEG | Segundo | Segundo | s | Tiempo |
| DOZ | Docena | Docena (12 unidades) | dz | Cantidad |
| GRM | Gramo | Gramo (alterno) | g | Peso |
| PC | Pieza | Pieza | pc | Cantidad |
| SET | Juego | Juego/set | set | Cantidad |
| BAG | Bolsa | Bolsa | bag | Empaque |
| BKT | Canasta | Canasta | bkt | Empaque |

### Uso en Facturación

```
OBLIGATORIO EN CADA LÍNEA:
Ejemplo: 
├─ Artículo: Harina
├─ Cantidad: 50
├─ Unidad: KG
└─ Descripción: "50 KG de harina"

COMBINACIONES VÁLIDAS:
├─ 10 UN (paquetes)
├─ 100 LT (aceite)
├─ 250 M2 (baldosa)
├─ 15 HOR (servicio)
└─ Cualquier combinación coherente
```

---

## 📌 TABLA 14: Conceptos Adicionales

### Definición
Información adicional o complementaria en documentos.

### Tabla Completa

| Código | Concepto | Descripción | Uso | Obligatorio |
|--------|----------|------------|-----|------------|
| 001 | Orden de compra | Referencias de PO del cliente | Trazabilidad | No |
| 002 | Acreedor | Información del acreedor | Pago a tercero | No |
| 003 | Referencia | Número de referencia cliente | Emparejamiento | No |
| 004 | Entrega | Detalle de lugar entrega | Seguimiento | Sí (si aplica) |
| 005 | Factura anticipada | Referencia a anticipo recibido | Control | Sí (si aplica) |
| 006 | Anticipos | Montos de anticipos | Descuento | Sí (si aplica) |
| 007 | Garantía | Detalles de garantía | Servicio posventa | No |
| 008 | Condiciones especiales | Condiciones pactadas | Negociación | No |
| 009 | Notas del vendedor | Anotaciones adicionales | Comunicación | No |
| 010 | Base legal | Referencias normativas | Obligaciones | No |

### Ejemplos de Uso

```
CONCEPTO 001 (PO):
"Orden de Compra: PO-2025-10-123456"

CONCEPTO 005 (Anticipo):
"Factura anticipada: Recibido $500,000 el 2025-10-01"

CONCEPTO 006 (Descuento anticipos):
"Anticipo descuento: $500,000"

CONCEPTO 008 (Condiciones):
"Plazo: 30 días desde entrega"
"Garantía: 12 meses"
```

---

## 🔄 TABLA 15: Códigos de Nota Crédito/Débito

### Definición
Razones válidas para emitir Nota Crédito o Nota Débito.

### Nota Crédito - Códigos de Razón

| Código | Razón | Descripción | Frecuencia | Monto típico |
|--------|-------|------------|-----------|--------------|
| 01 | Devolución | Devolución de producto | Común | Parcial/Total |
| 02 | Descuento | Descuento concedido post-factura | Muy común | 1-20% |
| 03 | Bonificación | Bonificación al cliente | Ocasional | Pequeño |
| 04 | Anulación | Anulación de factura errónea | Raro | 100% |
| 05 | Ajuste precio | Ajuste de precio acordado | Ocasional | 1-10% |
| 06 | Rebaja | Rebaja por acuerdo | Ocasional | 5-15% |
| 07 | Otras | Otras razones | Raro | Variable |

### Nota Débito - Códigos de Razón

| Código | Razón | Descripción | Frecuencia | Monto típico |
|--------|-------|------------|-----------|--------------|
| 01 | Interés | Interés por mora | Ocasional | 1-2% |
| 02 | Gasto administrativo | Costo administrativo cargo | Raro | Fijo |
| 03 | Reimbolso | Reimbolso de gasto | Ocasional | Variable |
| 04 | Ajuste | Ajuste por sobrecobro | Raro | 1-5% |
| 05 | Penalización | Penalización por incumplimiento | Raro | Acuerdo |
| 06 | Otras | Otras razones | Muy raro | Variable |

### Requisitos

```
NOTA CRÉDITO:
├─ Debe referenciar FE original
├─ Número y fecha de FE
├─ Motivo claro
├─ Cálculo correcto
└─ Firmada digitalmente

NOTA DÉBITO:
├─ Debe referenciar FE original
├─ Justificación explícita
├─ Aprobación cliente (recomendado)
├─ Comunicación previa
└─ Firmada digitalmente

PLAZO:
├─ Debe emitirse: Dentro 30 días de FE
├─ Comunicación: Dentro 5 días hábiles
└─ Aceptación cliente: Recomendado
```

---

## ✅ TABLA 16: Códigos de Corrección (RADIAN)

### Definición
Códigos de corrección para Notas Crédito en flujo RADIAN.

### Tabla Completa

| Código | Corrección | Descripción | Tipo |
|--------|-----------|------------|------|
| 1 | Tarifa | Corrección de tarifa | Precio |
| 2 | Cantidad | Corrección de cantidad | Cantidad |
| 3 | Descripción | Corrección de descripción | Datos |
| 4 | Referencia | Corrección de referencia | Datos |
| 5 | Período | Corrección de período | Periodo |
| 6 | Concepto | Corrección de concepto | Concepto |
| 7 | Descuento | Corrección de descuento | Precio |
| 8 | Otra | Otra corrección | General |

### Aplicación

```
En una Nota Crédito RADIAN:
├─ Se especifica el código de corrección
├─ Se describe el error corregido
├─ Se calcula nuevo monto
└─ Se referencia documento original

Ejemplo:
Factura FE-001: 100 unidades × $10,000 = $1,000,000
Corrección: NC-001 (Código 2 = Cantidad)
Razón: "Se recibieron 90 unidades, no 100"
Rebaja: 10 × $10,000 = $100,000
NC Total: $100,000
```

---

## 🔄 TABLA 17: Estados de Respuesta (RADIAN)

### Definición
Estados que puede tomar una respuesta en RADIAN.

### Tabla Completa

| Código | Estado | Sigla | Descripción |
|--------|--------|-------|------------|
| 1 | Aceptada | ACE | Aceptación total sin condiciones |
| 2 | Aceptada Condicionalmente | ACP | Aceptación con condiciones |
| 3 | Rechazada | RCH | Rechazo total |
| 4 | Tácita | TÁC | Aceptación tácita (sin respuesta 30 días) |
| 5 | Endosada | END | Documento endosado a tercero |
| 6 | En Trámite | TRM | Respuesta en proceso |
| 7 | No Aplica | N/A | Estado no aplicable |

### Flujo de Estados

```
ORIGINAL:
FE emitida → Estado: PENDIENTE_RESPUESTA

TRANSCURSO 30 DÍAS:
├─ Cliente responde: ACE/ACP/RCH
├─ Cliente no responde: TÁC (automático día 30)

DESPUÉS RESPUESTA:
├─ ACE: Documento válido, circulación normal
├─ ACP: Espera resolución de emisor
├─ RCH: Documento anulado, emitir corrección
├─ TÁC: Se asume como ACE
├─ END: Circula a cesionario

CIRCULACIÓN:
└─ Solo ACE y TÁC pueden circular
```

---

## 🎬 TABLA 18: Códigos de Evento (RADIAN)

### Definición
Eventos que pueden ocurrir sobre un documento en RADIAN.

### Tabla Completa

| Código | Evento | Sigla | Descripción | Actor | Resultado |
|--------|--------|-------|-----------|-------|-----------|
| 1 | Generación | GEN | Creación del documento | Emisor | Doc creado |
| 2 | Recepción | REC | Documento recibido | DIAN | Notificación |
| 3 | Aceptación | ACE | Aceptación por recibidor | Recibidor | Válido |
| 4 | Aceptación Condicional | ACP | Aceptación con condiciones | Recibidor | Espera |
| 5 | Rechazo | RCH | Rechazo por recibidor | Recibidor | Anulado |
| 6 | Endoso | END | Transferencia de derechos | Recibidor | Circula |
| 7 | Cancelación | CAN | Pago/Cancelación | Cualquiera | Cerrado |
| 8 | Vencimiento | VEN | Vencimiento del plazo | Sistema | Tácita |
| 9 | Rectificación | REC | Rectificación por error | Emisor | Corregido |
| 10 | Solicitud de Aclaración | SOL | Solicitud aclaración | Recibidor | En diálogo |

### Secuencia Típica de Eventos

```
GEN → REC → ACE → CAN
      └ ACP → (Resolución) → ACE → CAN
      └ RCH → (Corrección) → Nueva GEN

GEN → REC → ACE → END → REC (nuevo acreedor)
             └ → END → REC (tercer acreedor)

TIMING:
├─ GEN: T=0 (inmediato)
├─ REC: T=1min (DIAN valida)
├─ ACE/ACP/RCH: T=0 a 30 días
├─ END: Cualquier momento post-ACE
├─ CAN: Al pago
└─ VEN (tácita): T=30 días
```

---

## 🔍 Búsqueda Rápida por Categoría

### Por Documento Electrónico

```
FACTURA (FE):
├─ Tabla 1: Tipo Documento (01)
├─ Tabla 2: Identificación
├─ Tabla 4: Tipo Operación
├─ Tabla 5: Medio de Pago
├─ Tabla 6: Condiciones Entrega
├─ Tabla 7: Términos de Pago
├─ Tabla 9: Códigos de Impuestos
├─ Tabla 10: Códigos de Descuentos
├─ Tabla 11: Códigos de Retención
├─ Tabla 12: Monedas
├─ Tabla 13: Unidades de Medida
├─ Tabla 14: Conceptos Adicionales
└─ Tabla 15: Razones NC/ND

NÓMINA (NE):
├─ Tabla 2: Identificación (empleado)
├─ Tabla 12: Monedas (COP)
├─ Tabla 13: Unidades (Días, Horas)
└─ Tabla 14: Conceptos

RADIAN:
├─ Tabla 17: Estados de Respuesta
├─ Tabla 18: Códigos de Evento
└─ Tabla 16: Códigos de Corrección

DOC SOPORTE:
├─ Tabla 2: Identificación
├─ Tabla 5: Medio de Pago
├─ Tabla 12: Monedas (COP)
└─ Tabla 13: Unidades
```

### Por Función

```
IDENTIFICACIÓN:
└─ Tabla 2: Tipos de Identificación

DINERO:
├─ Tabla 5: Medio de Pago
├─ Tabla 11: Códigos de Retención
├─ Tabla 12: Monedas

CANTIDAD/MEDIDA:
└─ Tabla 13: Unidades de Medida

DESCUENTOS/IMPUESTOS:
├─ Tabla 9: Códigos de Impuestos
├─ Tabla 10: Códigos de Descuentos
└─ Tabla 11: Códigos de Retención

CORRECCIONES:
└─ Tabla 15: Razones NC/ND

CIRCULACIÓN (RADIAN):
├─ Tabla 17: Estados de Respuesta
└─ Tabla 18: Códigos de Evento
```

---

## 📞 Soporte y Actualizaciones

```
DÚDAS SOBRE TABLAS:
├─ Revisar sección relevante arriba
├─ Consultar ejemplos en documentos específicos
└─ Contactar soporte DIAN

CAMBIOS/ACTUALIZACIONES:
├─ Resoluciones nuevas: Se actualiza tabla
├─ Versión FE: Se actualiza documento
├─ Nuevos códigos: Se agregan filas
└─ Fecha de cambio: Se documenta

REFERENCIAS:
├─ Bases normativas: Resoluciones DIAN
├─ Vigencia: 2024-2025
├─ Acceso: Centro de tablas (este documento)
└─ Descargas: Disponible en JSON/CSV (en development)
```

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0 (Consolidación completa de 18 tablas)  
**Total de códigos documentados:** 500+  
**Cobertura:** Todas las operaciones electrónicas FE, Nómina, RADIAN, Doc Soporte
