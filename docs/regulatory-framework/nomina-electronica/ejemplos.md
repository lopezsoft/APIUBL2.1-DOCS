---
sidebar_position: 2
description: "Ejemplos prácticos de Nómina Electrónica con estructuras reales"
---

# Ejemplos de Nómina Electrónica

## 📝 Caso 1: Nómina Ordinaria - Empleado a Término Indefinido

### Escenario
- **Empleado:** Juan García López (CC 1234567890)
- **Empresa:** Tech Solutions S.A.S. (NIT 123456789-1)
- **Período:** 1-31 de octubre de 2025
- **Contrato:** Indefinido, cargo analista
- **Salario:** $2,400,000
- **Situación:** Período normal sin novedades

### Estructura JSON

```json
{
  "documento_nomina": {
    "identificacion": {
      "numero_secuencia": "1001",
      "periodo_nómina": {
        "fecha_inicio": "2025-10-01",
        "fecha_fin": "2025-10-31",
        "dias_trabajados": 22,
        "dias_ausencia": 8,
        "dias_permitidos": 0,
        "tipo_periodo": "MENSUAL"
      },
      "tipo_nomina": "ORDINARIA",
      "estado": "ACTIVO"
    },
    
    "empleador": {
      "tipo_doc": "NIT",
      "numero_doc": "123456789-1",
      "razon_social": "Tech Solutions S.A.S.",
      "ciudad": "BOGOTA",
      "pais": "57"
    },
    
    "empleado": {
      "tipo_doc": "CC",
      "numero_doc": "1234567890",
      "nombre_completo": "Juan García López",
      "ciudad": "BOGOTA",
      "tipo_trabajador": "200"
    },
    
    "conceptos": {
      "devengos": {
        "salario_ordinario": {
          "cantidad": 22,
          "valor_unitario": 109090.91,
          "valor_total": 2400000
        },
        "horas_extra_diurna": {
          "cantidad": 0,
          "valor_unitario": 0,
          "valor_total": 0
        },
        "auxilios": {
          "cesantia_valor": 106348
        },
        "total_devengos": 2506348
      },
      
      "deducciones": {
        "aporte_salud": {
          "base_cotizacion": 2400000,
          "porcentaje": 4,
          "valor": 96000
        },
        "aporte_pension": {
          "base_cotizacion": 2400000,
          "porcentaje": 4,
          "valor": 96000
        },
        "aporte_arl": {
          "base_cotizacion": 2400000,
          "clase_riesgo": "III",
          "tarifa": 2.436,
          "valor": 58464
        },
        "retencion_fuente": {
          "base": 2400000,
          "porcentaje": 2.26,
          "valor": 54240
        },
        "descuentos_voluntarios": {
          "libranza_banco": 50000
        },
        "total_deducciones": 354704
      },
      
      "neto_pago": {
        "total_devengos": 2506348,
        "total_deducciones": 354704,
        "neto": 2151644
      }
    },
    
    "forma_pago": {
      "metodo": "TRANSFERENCIA_BANCARIA",
      "cuenta_numero": "123456789-01",
      "banco": "BANCO_COLOMBIA",
      "tipo_cuenta": "CUENTA_CORRIENTE"
    }
  }
}
```

### Análisis del Ejemplo

```
PERIODO DE PAGO
═════════════════════════════════════════
Fecha inicio:           01-Oct-2025
Fecha fin:              31-Oct-2025
Días trabajados:        22 (mon-vie, sin festivos)
Días ausencia:          8 (fines de semana)
Días permitidos:        0

CÁLCULO DE SALARIO DIARIO
═════════════════════════════════════════
Salario mensual:        $2,400,000
Días laborales mes:     22
Valor día:              $2,400,000 ÷ 22 = $109,090.91

DEVENGOS
═════════════════════════════════════════
Salario ordinario       22 × $109,090.91 = $2,400,000
Cesantía (8.33%)        $2,400,000 × 8.33% = $200,000
  (Se pagan como auxilio)
Auxilio cesantía        $106,348 ✓

Total devengos          $2,506,348

DEDUCCIONES
═════════════════════════════════════════
Aporte salud (4%)       $2,400,000 × 4% = $96,000
Aporte pensión (4%)     $2,400,000 × 4% = $96,000
Aporte ARL              $2,400,000 × 2.436% = $58,464
Retención RFT (2.26%)   $2,400,000 × 2.26% = $54,240
Libranza banco          $50,000

Total deducciones       $354,704

NETO A PAGAR
═════════════════════════════════════════
Total devengos          $2,506,348
- Total deducciones     ($354,704)
─────────────────────────────────────────
NETO A PAGAR            $2,151,644
═════════════════════════════════════════
```

---

## 📝 Caso 2: Nómina con Horas Extra y Comisión

### Escenario
- **Empleado:** María Rodríguez Silva (CC 9876543210)
- **Empresa:** Ventas Plus S.A.S.
- **Período:** 1-31 de octubre de 2025
- **Contrato:** Fijo 2 años, vendedora
- **Salario Base:** $1,800,000
- **Horas Extra:** 10 horas diurnas
- **Comisión:** Ventas por $5,000,000 al 3%

### Estructura JSON

```json
{
  "documento_nomina": {
    "empleado": {
      "tipo_doc": "CC",
      "numero_doc": "9876543210",
      "nombre_completo": "María Rodríguez Silva"
    },
    
    "conceptos": {
      "devengos": {
        "salario_ordinario": {
          "cantidad": 22,
          "valor_unitario": 81818.18,
          "valor_total": 1800000
        },
        
        "horas_extra_diurna": {
          "cantidad": 10,
          "valor_hora_ordinaria": 81818.18,
          "porcentaje_recargo": 25,
          "valor_hora_extra": 102272.73,
          "valor_total": 1022727.30
        },
        
        "comisiones": {
          "base_comision": 5000000,
          "porcentaje": 3,
          "valor": 150000
        },
        
        "primas": {
          "prima_servicios": 300000
        },
        
        "otros_devengos": {
          "bonificacion_desempeño": 200000
        },
        
        "total_devengos": 3472727.30
      },
      
      "deducciones": {
        "aporte_salud": {
          "base": 1800000,              // Solo sobre salario ordinario
          "porcentaje": 4,
          "valor": 72000
        },
        "aporte_pension": {
          "base": 1800000,
          "porcentaje": 4,
          "valor": 72000
        },
        "aporte_arl": {
          "base": 1800000,
          "clase_riesgo": "II",
          "tarifa": 1.044,
          "valor": 18792
        },
        "retencion_fuente": {
          "base": 3472727.30,           // Sobre total
          "porcentaje": 2.26,
          "valor": 78482.76
        },
        "descuentos": {
          "descuento_disciplinario": 50000
        },
        "total_deducciones": 291274.76
      },
      
      "neto_pago": 3181452.54
    }
  }
}
```

### Detalles de Cálculo

```
HORAS EXTRA DIURNAS (06:00-22:00)
═════════════════════════════════════════
Hora ordinaria:         $81,818.18
Recargo:                25% = $20,454.55
Valor hora extra:       $102,272.73
Cantidad:               10 horas
Total:                  10 × $102,272.73 = $1,022,727.30

COMISIÓN
═════════════════════════════════════════
Ventas realizadas:      $5,000,000
Porcentaje comisión:    3%
Comisión ganada:        $5,000,000 × 3% = $150,000

APORTES SEGURIDAD SOCIAL
═════════════════════════════════════════
Base para aportes:      $1,800,000 (solo salario ordinario)
  NO se incluyen: horas extra, comisión, primas, bonificaciones
Aporte salud (4%):      $72,000
Aporte pensión (4%):    $72,000
Aporte ARL (1.044%):    $18,792
Total aportes:          $162,792

RETENCIÓN EN LA FUENTE (RFT)
═════════════════════════════════════════
Se aplica sobre:        Total devengos = $3,472,727.30
Porcentaje:             2.26%
RFT:                    $78,482.76

NETO FINAL
═════════════════════════════════════════
Total devengos          $3,472,727.30
Total deducciones       ($291,274.76)
Neto a pagar            $3,181,452.54
═════════════════════════════════════════
```

---

## 📝 Caso 3: Nómina con Incapacidad Médica

### Escenario
- **Empleado:** Carlos Martínez Pérez (CC 5555555555)
- **Empresa:** Industria Textil S.A.
- **Período:** 1-31 de octubre de 2025
- **Contrato:** Indefinido, obrero
- **Salario:** $2,000,000
- **Novedad:** Incapacidad por enfermedad 5-10 octubre (6 días)

### Estructura JSON

```json
{
  "documento_nomina": {
    "empleado": {
      "tipo_doc": "CC",
      "numero_doc": "5555555555",
      "nombre_completo": "Carlos Martínez Pérez"
    },
    
    "novedades": [
      {
        "tipo_novedad": "INCAPACIDAD",
        "razon": "ENFERMEDAD_GENERAL",
        "fecha_inicio": "2025-10-05",
        "fecha_fin": "2025-10-10",
        "dias_incapacidad": 6,
        "dias_pagados": 6,
        "porcentaje_pago": 100,
        "documento_soporte": "CERT-IPS-00123",
        "ips_emisora": "SANITAS"
      }
    ],
    
    "conceptos": {
      "devengos": {
        "salario_ordinario_trabajado": {
          "dias": 16,                    // 22 - 6 por incapacidad
          "valor_unitario": 90909.09,
          "valor_total": 1454545.44
        },
        
        "salario_incapacidad": {
          "dias": 6,
          "valor_unitario": 90909.09,
          "valor_total": 545454.56
        },
        
        "subsidio_incapacidad": {
          "dias": 6,
          "valor_unitario": 90909.09,
          "valor_total": 545454.56,
          "pagador": "EPS",
          "nota": "Subsidio por incapacidad, pago directo EPS"
        },
        
        "total_devengos": 2000000
      },
      
      "deducciones": {
        "aporte_salud": {
          "base": 2000000,
          "porcentaje": 4,
          "valor": 80000
        },
        "aporte_pension": {
          "base": 2000000,
          "porcentaje": 4,
          "valor": 80000
        },
        "aporte_arl": {
          "base": 2000000,
          "clase_riesgo": "III",
          "tarifa": 2.436,
          "valor": 48720
        },
        "retencion_fuente": {
          "base": 2000000,
          "porcentaje": 2.26,
          "valor": 45200
        },
        "total_deducciones": 253920
      },
      
      "neto_pago": 1746080
    }
  }
}
```

### Análisis Especial

```
TRATAMIENTO DE LA INCAPACIDAD
═════════════════════════════════════════
Días del período:       31
Días trabajados:        16 (incluye sábados/domingos)
Días incapacidad:       6 (05-10 octubre)
Días sin laborar:       9 (otros)

PAGO POR INCAPACIDAD
═════════════════════════════════════════
Los 6 días de incapacidad se pagan:
  - 100% del salario ordinario
  - Responsabilidad: EPS (primeros 2 años)
  - Si > 2 años: Empleador

Subsidio incapacidad:   $545,454.56
  (Pago directo de EPS, NO descuenta aportes)

APORTES SOBRE INCAPACIDAD
═════════════════════════════════════════
✅ SÍ se aporta a: Salud, Pensión, ARL
   Durante incapacidad sigue acumulándose

NETO FINAL
═════════════════════════════════════════
Total devengos          $2,000,000
Total deducciones       ($253,920)
Neto a pagar            $1,746,080
═════════════════════════════════════════
```

---

## 📝 Caso 4: Nómina de Ajuste (Corrección)

### Escenario
- **Empleado:** Laura González Moreno (CC 3333333333)
- **Empresa:** Tech Solutions S.A.S.
- **Nómina Original:** Ordinaria septiembre 2025 (Seq. 900)
- **Razón del Ajuste:** Olvidó registrar 8 horas extra
- **Período:** Ajuste para septiembre

### Estructura JSON

```json
{
  "documento_nomina": {
    "identificacion": {
      "numero_secuencia": "1234",
      "tipo_nomina": "AJUSTE",
      "radicado_nómina_original": "FPP862141001202509900",
      "fecha_original": "2025-09-30",
      "periodo_ajustado": {
        "fecha_inicio": "2025-09-01",
        "fecha_fin": "2025-09-30"
      }
    },
    
    "referencia_documento_anterior": {
      "numero_secuencia": "900",
      "radicado": "FPP862141001202509900",
      "fecha_emision": "2025-09-30",
      "motivo_ajuste": "OMISION_HORAS_EXTRA"
    },
    
    "empleado": {
      "tipo_doc": "CC",
      "numero_doc": "3333333333",
      "nombre_completo": "Laura González Moreno"
    },
    
    "conceptos": {
      "devengos_adicionales": {
        "horas_extra_diurna": {
          "cantidad": 8,
          "valor_hora_ordinaria": 72727.27,
          "porcentaje_recargo": 25,
          "valor_hora_extra": 90909.09,
          "valor_total": 727272.72
        },
        "total_ajuste": 727272.72
      },
      
      "deducciones_ajuste": {
        "aporte_salud_ajuste": {
          "base": 727272.72,
          "porcentaje": 4,
          "valor": 29090.91
        },
        "aporte_pension_ajuste": {
          "base": 727272.72,
          "porcentaje": 4,
          "valor": 29090.91
        },
        "retencion_fuente_ajuste": {
          "base": 727272.72,
          "porcentaje": 2.26,
          "valor": 16436.12
        },
        "total_deducciones_ajuste": 74617.94
      },
      
      "neto_ajuste_pago": 652654.78
    }
  }
}
```

---

## 📝 Caso 5: Nómina de Retiro (Fin de Contrato)

### Escenario
- **Empleado:** Roberto López Díaz (CC 7777777777)
- **Empresa:** Manufacturing Ltd.
- **Período:** 1-15 de octubre de 2025 (retiro a mitad de mes)
- **Contrato:** Indefinido, 8 años
- **Causal:** Renuncia voluntaria
- **Salario:** $2,500,000

### Estructura JSON

```json
{
  "documento_nomina": {
    "identificacion": {
      "numero_secuencia": "2001",
      "tipo_nomina": "ORDINARIA",
      "periodo_nómina": {
        "fecha_inicio": "2025-10-01",
        "fecha_fin": "2025-10-15",
        "es_periodo_completo": false,
        "es_periodo_final": true
      }
    },
    
    "empleado": {
      "tipo_doc": "CC",
      "numero_doc": "7777777777",
      "nombre_completo": "Roberto López Díaz"
    },
    
    "novedades": [
      {
        "tipo_novedad": "RETIRO",
        "causal": "RENUNCIA_VOLUNTARIA",
        "fecha_retiro": "2025-10-15",
        "fecha_ultima_pago": "2025-10-15",
        "dias_trabajados_periodo": 11
      }
    ],
    
    "conceptos": {
      "devengos": {
        "salario_trabajado": {
          "dias": 11,
          "valor_diario": 113636.36,
          "valor_total": 1250000
        },
        
        "cesantia_acumulada": {
          "anos_servicio": 8,
          "base_anual": 2500000,
          "porcentaje": 8.33,
          "total_acumulada": 1666666.67
        },
        
        "prima_servicios": {
          "anos_servicio": 8,
          "meses_trabajados_ano": 0.5,
          "base": 2500000,
          "valor_prima": 208333.33
        },
        
        "vacaciones_no_disfrutadas": {
          "dias": 8,
          "valor_diario": 113636.36,
          "valor_total": 909090.92
        },
        
        "total_devengos": 4034090.92
      },
      
      "deducciones": {
        "aporte_salud": {
          "base": 1250000,
          "porcentaje": 4,
          "valor": 50000
        },
        "aporte_pension": {
          "base": 1250000,
          "porcentaje": 4,
          "valor": 50000
        },
        "aporte_arl": {
          "base": 1250000,
          "clase_riesgo": "III",
          "tarifa": 2.436,
          "valor": 30450
        },
        "retencion_fuente": {
          "base": 4034090.92,
          "porcentaje": 2.26,
          "valor": 91169.65
        },
        "total_deducciones": 221619.65
      },
      
      "neto_pago": 3812471.27
    }
  }
}
```

### Liquidación de Prestaciones

```
LIQUIDACIÓN FINAL POR RETIRO
═════════════════════════════════════════

Salario trabajado (11 días)  $1,250,000
Cesantía acumulada (8 años)  $1,666,667
Prima servicios              $208,333
Vacaciones no disfrutadas    $909,091
─────────────────────────────────────────
Total a pagar                $4,034,091

Menos deducciones:
Aporte salud (4%)            ($50,000)
Aporte pensión (4%)          ($50,000)
Aporte ARL                   ($30,450)
Retención RFT                ($91,170)
─────────────────────────────────────────
NETO A PAGAR                 $3,812,471
═════════════════════════════════════════

NOTAS IMPORTANTES:
• La cesantía se paga totalmente al retiro
• Las vacaciones se liquidan íntegramente
• Prima se calcula prorratada
• Se aporta normalmente sobre salario ordinario
```

---

## 📊 Tabla Comparativa de Casos

| Aspecto | Caso 1 | Caso 2 | Caso 3 | Caso 4 | Caso 5 |
|--------|--------|--------|--------|--------|--------|
| **Tipo** | Ordinaria | Ordinaria | Ordinaria | Ajuste | Final |
| **Novedad** | Ninguna | Horas+Comisión | Incapacidad | Corrección | Retiro |
| **Total Devengos** | $2,506,348 | $3,472,727 | $2,000,000 | $727,273 (ajuste) | $4,034,091 |
| **Total Deducciones** | $354,704 | $291,275 | $253,920 | $74,618 | $221,620 |
| **Neto** | $2,151,644 | $3,181,453 | $1,746,080 | $652,655 | $3,812,471 |

---

## 🔗 Recursos Relacionados

- 📖 [Introducción a Nómina Electrónica](/docs/regulatory-framework/nomina-electronica/intro)
- 🔧 [Especificación de Campos](/docs/regulatory-framework/nomina-electronica/campos)
- 📝 [Tipos de Novedades](/docs/regulatory-framework/nomina-electronica/novedades)
- 💻 [Fórmulas de Cálculo](/docs/regulatory-framework/nomina-electronica/calculos)

---

**Última actualización:** Octubre 2025  
**Versión:** 3.0 (Resolución 0000040/2024)
