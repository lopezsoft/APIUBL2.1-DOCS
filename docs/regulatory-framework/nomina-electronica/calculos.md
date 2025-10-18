---
sidebar_position: 5
description: "Fórmulas completas de cálculo para Nómina Electrónica v3.0"
---

# Fórmulas de Cálculo en Nómina

## 📐 Introducción

Esta sección proporciona las fórmulas exactas para calcular cada concepto en la Nómina Electrónica. Todos los cálculos deben realizarse con precisión de 2 decimales.

---

## 💰 CÁLCULOS DE DEVENGOS

### 1. Salario Ordinario Diario

```
Fórmula:
═════════════════════════════════════════
Salario Diario = Salario Mensual / Días Laborales del Mes

Ejemplo:
Salario mensual:        $2,400,000
Días laborales octubre: 22 (lun-vie, sin festivos)
Salario diario:         $2,400,000 ÷ 22 = $109,090.91

Validación: Precisión a 2 decimales
```

---

### 2. Salario por Días Trabajados

```
Fórmula:
═════════════════════════════════════════
Salario = (Salario Mensual / Días Laborales) × Días Trabajados

Ejemplo 1 - Período Completo:
Salario mensual:        $2,400,000
Días laborales:         22
Días trabajados:        22
Salario:                ($2,400,000 ÷ 22) × 22 = $2,400,000

Ejemplo 2 - Período Parcial (retiro):
Salario mensual:        $2,400,000
Días laborales:         22
Días trabajados:        11 (hasta 15 de octubre)
Salario:                ($2,400,000 ÷ 22) × 11 = $1,200,000
```

---

### 3. Horas Extra Diurna (06:00-22:00)

```
Fórmula:
═════════════════════════════════════════
Tarifa Hora Ordinaria = Salario Mensual / 240
Valor Hora Extra Diurna = Tarifa × 1.25
Total = Valor Hora Extra × Cantidad Horas

Ejemplo:
Salario mensual:        $2,400,000
Tarifa hora ordinaria:  $2,400,000 ÷ 240 = $10,000
Recargo:                25%
Tarifa hora extra:      $10,000 × 1.25 = $12,500
Horas trabajadas:       10 horas
Total horas extra:      $12,500 × 10 = $125,000

Divisor 240:
  = 24 horas × 22 días laborales ÷ 22 días
  = 240 horas estándar mes
```

:::tip
**Cálculo correcto del divisor:**
- En Colombia: Horas anuales = 1,920 (48h/semana × 40 semanas)
- Horas mensuales estándar = 1,920 ÷ 12 = 160
- Para 48h/semana: Divisor = 240 (160 × 48/32)
:::

---

### 4. Horas Extra Nocturna (22:00-06:00)

```
Fórmula:
═════════════════════════════════════════
Tarifa Hora Ordinaria = Salario Mensual / 240
Valor Hora Extra Nocturna = Tarifa × 1.35
Total = Valor Hora Extra × Cantidad Horas

Ejemplo:
Salario mensual:        $2,400,000
Tarifa hora ordinaria:  $10,000
Recargo:                35%
Tarifa hora nocturna:   $10,000 × 1.35 = $13,500
Horas trabajadas:       8 horas
Total horas nocturnas:  $13,500 × 8 = $108,000
```

---

### 5. Horas Dominical/Festivo

```
Fórmula:
═════════════════════════════════════════
Tarifa Hora Ordinaria = Salario Mensual / 240
Valor Hora Dominical = Tarifa × 1.75
Total = Valor Hora × Cantidad Horas

Ejemplo:
Salario mensual:        $2,400,000
Tarifa hora ordinaria:  $10,000
Recargo:                75%
Tarifa dominical:       $10,000 × 1.75 = $17,500
Horas trabajadas:       6 horas (domingo)
Total dominical:        $17,500 × 6 = $105,000

Nota: NO se acumulan porcentajes
Si trabaja NOCHE y DOMINGO: Usar el MAYOR (75%)
```

---

### 6. Comisión de Ventas

```
Fórmula:
═════════════════════════════════════════
Comisión = (Ventas Realizadas × Porcentaje) / 100

Ejemplo 1 - Porcentaje Simple:
Ventas del mes:         $5,000,000
Porcentaje comisión:    3%
Comisión:               $5,000,000 × 3% = $150,000

Ejemplo 2 - Comisión Escalonada:
Ventas:     $4,000,000
├─ 0 a 3M:   2% → $60,000
├─ 3M a 6M:  3% → $90,000
└─ > 6M:     4% → $40,000
Comisión total:         $190,000
```

---

### 7. Cesantía (8.33% Acumulación)

```
Fórmula:
═════════════════════════════════════════
Cesantía Acumulada = Salario Base × 8.33% × (Días / 365)
O
Cesantía Periódica = Salario Base × 8.33%

Ejemplo 1 - Acumulada:
Salario anual:          $2,400,000 × 12 = $28,800,000
Cesantía anual 8.33%:   $28,800,000 × 8.33% = $2,399,040
O: Salario mensual × 8.33% = $2,400,000 × 8.33% = $199,920

Ejemplo 2 - 10 Días de Períodto (enero):
Base:                   $2,400,000
Prorrata:               10/31 de mes
Cesantía:               $2,400,000 × 8.33% × (10/31) = $64,461
```

:::warning
**Cálculo DIAN:** Siempre 8.33%, nunca otro %
**Base:** Solo salario ordinario
**Periodicidad:** Se puede pagar:
- Periódicamente en nómina
- De una vez al retiro
- Fondo cesantía
:::

---

### 8. Prima de Servicios (Semestral)

```
Fórmula:
═════════════════════════════════════════
Prima = (Salario Base × 8.33% × 6 meses) / 12
O
Prima = Salario Base × 8.33%

Ejemplo - Prima Semestral (01 dic - 31 mayo):
Salario mensual:        $2,400,000
Períodos en semestre:   6
Prima:                  $2,400,000 × 8.33% = $199,920

Ejemplo - Prima Anual (01 dic - 30 nov):
Salario mensual:        $2,400,000
Períodos en año:        12
Prima:                  $2,400,000 × 8.33% = $199,920
```

---

### 9. Vacaciones (2.5 días por mes)

```
Fórmula:
═════════════════════════════════════════
Días Vacaciones = 2.5 × Meses Trabajados

Valor Vacaciones = (Salario Mensual / 30) × Días Disfrutados

Ejemplo 1 - Cálculo Acumulación:
Meses trabajados:       12
Días anuales:           2.5 × 12 = 30 días

Ejemplo 2 - Cálculo al Disfrutar:
Salario mensual:        $2,400,000
Valor día:              $2,400,000 ÷ 30 = $80,000
Días disfrutados:       15 (típicamente diciembre)
Valor total:            $80,000 × 15 = $1,200,000

Ejemplo 3 - Liquidación al Retiro (sin disfrutar):
Días pendientes:        5
Valor:                  $80,000 × 5 = $400,000
```

---

## 🏥 CÁLCULOS DE APORTES A SEGURIDAD SOCIAL

### 10. Aporte a Salud (4% Empleado)

```
Fórmula:
═════════════════════════════════════════
Base de Cotización = Salario Mensual (SOLO Salario Ordinario)
Aporte Salud = Base × 4% / 100
Total (Emp+Patr) = Base × 12.5%

Ejemplo:
Salario mensual:        $2,400,000
Base cotización:        $2,400,000
Aporte empleado (4%):   $2,400,000 × 0.04 = $96,000
Aporte empleador (8.5%): $2,400,000 × 0.085 = $204,000
Total:                  $300,000

Nota: NO incluir comisión, horas extra, bonificaciones
```

---

### 11. Aporte a Pensión (4% Empleado)

```
Fórmula:
═════════════════════════════════════════
Base de Cotización = Salario Mensual (SOLO Salario Ordinario)
Aporte Empleado = Base × 4%
Aporte Empleador = Base × 12%
Comisión AFP = (Base × 1.5%) * (si AFP cobra comisión)

Ejemplo:
Salario mensual:        $2,400,000
Base cotización:        $2,400,000

APORTES:
Empleado (4%):          $2,400,000 × 0.04 = $96,000
Empleador (12%):        $2,400,000 × 0.12 = $288,000
Subtotal:               $384,000

COMISIÓN AFP (1.5%):    $2,400,000 × 0.015 = $36,000

SEGURO INVALIDEZ (1.4%): $2,400,000 × 0.014 = $33,600

TOTAL PENSIÓN:          $453,600
```

:::warning
**Nota:** El empleado NO ve en nómina la comisión ni el seguro.
Se descuenta del aporte del empleado o del empleador según AFP.
:::

---

### 12. Aporte ARL (Riesgos Laborales)

```
Fórmula:
═════════════════════════════════════════
Base de Cotización = Salario Mensual
Aporte ARL = Base × Tarifa Según Clase Riesgo

Clases de Riesgo y Tarifas:
I    (Mínimo):      0.348%   → Oficinas, comercio
II   (Bajo):        1.044%   → Agricultura, manufactura ligera
III  (Medio):       2.436%   → Manufactura, construcción
IV   (Alto):        4.350%   → Minería, industria pesada
V    (Muy Alto):    6.960%   → Minería profunda

Ejemplo - Clase III:
Salario:                $2,400,000
Clase:                  III
Tarifa:                 2.436%
Aporte ARL:             $2,400,000 × 0.02436 = $58,464
```

---

### 13. Otros Aportes Obligatorios

```
SENA (Servicio Nacional de Aprendizaje)
═════════════════════════════════════════
Base:       Salario mensual
Porcentaje: 0.8%
Responsable: Empleador
Fórmula:    Salario × 0.8%
Ejemplo:    $2,400,000 × 0.008 = $19,200

ICBF (Instituto Colombiano de Bienestar Familiar)
═════════════════════════════════════════
Base:       Salario mensual
Porcentaje: 3%
Responsable: Empleador
Fórmula:    Salario × 3%
Ejemplo:    $2,400,000 × 0.03 = $72,000

CAJA COMPENSACIÓN (Familiar)
═════════════════════════════════════════
Base:       Salario mensual
Porcentaje: 4%
Responsable: Empleador
Fórmula:    Salario × 4%
Ejemplo:    $2,400,000 × 0.04 = $96,000
```

---

## 💸 CÁLCULOS DE DEDUCCIONES

### 14. Retención en la Fuente (RFT)

```
Fórmula:
═════════════════════════════════════════
Base = Total Devengos (salario + todos los complementos)
RFT = Se aplica tarifa DIAN según UVT

Tarifa 2025 (UVT = $46,000):
Base Gravable      | Tarifa | Menos | % Marginal
$0 - 95 UVT        | 0%     | -     | 0%
95-737 UVT         | 19%    | 18.12%| 5%
737-1,421 UVT      | 12%    | -     | 19%
1,421-2,577 UVT    | 17%    | -     | 25%
2,577-2,788 UVT    | 26%    | -     | 33%
> 2,788 UVT        | 33%    | -     | 37%

Ejemplo 1 - Base baja (no hay RFT):
Salario:            $2,400,000
UVT equivalente:    $2,400,000 ÷ $46,000 = 52.17 UVT
Base:               52.17 UVT < 95 UVT
RFT:                $0 (exento)

Ejemplo 2 - Base media:
Salario total:      $4,000,000
UVT:                $4,000,000 ÷ $46,000 = 86.96 UVT
Base:               86.96 UVT (< 95)
RFT:                $0

Ejemplo 3 - Base alta:
Salario total:      $6,000,000
UVT:                $6,000,000 ÷ $46,000 = 130.43 UVT
Base:               130.43 UVT (entre 95-737)
Cálculo:            ($6,000,000 × 19%) - (95 × $46,000 × 18.12%)
                    = $1,140,000 - $79,414
                    = $1,060,586

O con método simplificado (aproximado):
RFT ≈ 2.26% sobre base total = $6,000,000 × 2.26% = $135,600
```

:::warning
**Precisión:** Usar tablas DIAN exactas, no aproximaciones
**Actualización:** Tarifas cambian anualmente
**Consulta:** www.dian.gov.co para tablas vigentes
:::

---

### 15. Aporte Voluntario a Pensión

```
Fórmula:
═════════════════════════════════════════
Aporte Voluntario = Monto Fijo o Porcentaje Acordado

Ejemplo 1 - Monto Fijo:
Aporte voluntario:      $100,000 (acordado con empleado)
Se descuenta en nómina

Ejemplo 2 - Porcentaje Adicional:
Salario:                $2,400,000
Aporte obligatorio 4%:  $96,000
Aporte voluntario 2%:   $48,000
Total descontado:       $144,000
```

---

### 16. Descuentos por Préstamos/Libranza

```
Fórmula:
═════════════════════════════════════════
Descuento = Cuota del Período

Ejemplo - Crédito Hipotecario:
Capital crediticio:     $100,000,000
Plazo:                  180 meses
Tasa mensual:           0.75%

Cuota mensual:          $1,000,000
Descuento en nómina:    $1,000,000

Validación:
├─ Máximo permitido: 50% del salario
├─ Requiere autorización escrita
└─ Puede no exceder límite legal
```

---

## 📊 CÁLCULOS ESPECIALES

### 17. Nómina con Período Parcial

```
Fórmula:
═════════════════════════════════════════
Para cualquier concepto:
    Valor Prorrateado = Valor Mensual × (Días / Días del Mes)

Ejemplo - Ingreso a mitad de mes (16 octubre):
Salario mensual:        $2,400,000
Días del mes:           31
Días trabajados:        16
Salario a pagar:        $2,400,000 × (16/31) = $1,238,710

Devengos proporcionales:
Cesantía 8.33%:         $1,238,710 × 8.33% = $103,187
Prima:                  $1,238,710 × 8.33% = $103,187
Vacaciones:             ($1,238,710/30) × (16/22) = $295,822
```

---

### 18. Liquidación al Retiro (Caso Completo)

```
Fórmula General:
═════════════════════════════════════════
Salario Trabajado = (Salario Mensual / Días) × Días Trabajados
Cesantía Acumulada = Salario Anual × 8.33% × Años Servicio
Prima Pendiente = Salario Mensual × 8.33% × (6/12) o (12/12)
Vacaciones = Días Pendientes × (Salario / 30)
Indemnización = (si despido injustificado)
Licencia No Pagada = 0

Ejemplo - Empleado 8 años, renuncia en octubre:
Salario mensual:        $2,400,000

1. Salario trabajado (11 días de octubre):
   = ($2,400,000 ÷ 31) × 11 = $850,968

2. Cesantía acumulada (8 años):
   = ($2,400,000 × 12) × 8.33% × 8
   = $2,400,000 × 8.33% × 8
   = $1,599,360

3. Prima servicios acumulada (períodos no recibidos):
   = $2,400,000 × 8.33% × (11/12)
   = $200,787

4. Vacaciones pendientes (4 días):
   = 4 × ($2,400,000 ÷ 30)
   = $320,000

TOTAL DEVENGOS:         $2,771,115

Deducciones (sobre salario ordinario):
Aporte salud (4%):      ($850,968 × 4%) = ($34,039)
Aporte pensión (4%):    ($850,968 × 4%) = ($34,039)
Aporte ARL:             ($850,968 × 2.436%) = ($20,728)
RFT:                    = ($0, por montos)

TOTAL DEDUCCIONES:      ($88,806)

NETO A PAGAR:           $2,682,309
```

---

## ✅ Validaciones de Cálculo

```
Fórmula de Control:
═════════════════════════════════════════

Neto a Pagar = Total Devengos - Total Deducciones

Validaciones Obligatorias:
1. ✅ Neto >= 0 (nunca negativo)
2. ✅ Total Devengos > 0
3. ✅ Deducciones <= Total Devengos
4. ✅ Aportes <= Devengos para su cálculo
5. ✅ Precisión: Máximo 2 decimales
6. ✅ Suma: ∑ componentes = total

Ejemplo de Control:
Total Devengos:         $3,500,000.00
├─ Salario:             $2,400,000.00
├─ Horas extra:         $500,000.00
├─ Comisión:            $500,000.00
└─ Bonificación:        $100,000.00

Total Deducciones:      $478,900.00
├─ Aportes:             $300,000.00
├─ RFT:                 $125,000.00
└─ Otros:               $53,900.00

Control: $3,500,000 - $478,900 = $3,021,100 ✅
```

---

## 🔧 Herramientas y Precisión

### Recomendaciones de Cálculo

```
1. PRECISIÓN
   └─ Usar mínimo 2 decimales en todos los cálculos
   └─ Redondeo: Banker's rounding (al par si .5)

2. VALIDACIÓN
   └─ Sumar componentes por separado
   └─ Verificar contra fórmulas DIAN
   └─ Auditar resultados antes de enviar

3. TARIFAS
   └─ Actualizar UVT anualmente (Resolución DIAN)
   └─ Usar tablas oficiales de RFT
   └─ Verificar % según vigencia

4. DOCUMENTACIÓN
   └─ Guardar cálculos para auditoría
   └─ Evidenciar fórmulas usadas
   └─ Registrar excepciones
```

---

## 📞 Consultas de Tarifas

**UVT Vigente 2025:** $46,000  
**Consulta:** www.dian.gov.co/UVT

**Tarifas RFT 2025:**  
www.dian.gov.co/tarifas

**Tasas de Interés:**  
www.banrep.gov.co

---

**Última actualización:** Octubre 2025  
**Versión:** 3.0 (Resolución 0000040/2024)
