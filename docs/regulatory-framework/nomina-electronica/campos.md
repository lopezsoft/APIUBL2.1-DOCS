---
sidebar_position: 3
description: "Especificación detallada de todos los campos en Nómina Electrónica"
---

# Campos de Nómina Electrónica

## 📋 Estructura General

```
Nómina Electrónica
├── Identificación del documento
├── Datos del empleador
├── Datos del empleado
├── Período de nómina
├── Novedades laborales
├── Conceptos de pago (devengos + deducciones)
├── Información de seguridad social
└── Firma digital
```

---

## 🆔 Sección 1: Identificación del Documento

### Campos Obligatorios

| Campo | Formato | Descripción | Ejemplo |
|-------|---------|-------------|---------|
| **Consecutivo** | Numérico (4-13) | Número secuencial único | `1001` |
| **Periodo Inicio** | YYYY-MM-DD | Primer día del período | `2025-10-01` |
| **Periodo Fin** | YYYY-MM-DD | Último día del período | `2025-10-31` |
| **Tipo Nómina** | Código | ORDINARIA, EXTRAORDINARIA, AJUSTE, REEMPLAZO, ELIMINACION | `ORDINARIA` |
| **Subtipo Nómina** | Código | POS, VACACIONES, BONO, etc. | `null` |
| **Nota** | Texto (0-250) | Observaciones sobre el documento | `"Período normal"` |

### Códigos de Tipo Nómina

```
01 = ORDINARIA          (Nómina regular)
02 = EXTRAORDINARIA     (Fuera de período)
03 = AJUSTE             (Corrección)
04 = REEMPLAZO          (Reemplaza otra)
05 = ELIMINACION        (Elimina otra)
```

---

## 🏢 Sección 2: Datos del Empleador

### Información Requerida

```json
{
  "tipo_documento": "NIT",
  "numero_documento": "123456789-1",
  "digito_verificacion": "1",
  "razon_social": "Tech Solutions S.A.S.",
  "nombre_comercial": "TechSol",
  "primer_nombre": "TECH",
  "primer_apellido": "SOLUTIONS",
  "address": {
    "linea1": "Calle 100 #45-50",
    "linea2": "Piso 5",
    "ciudad": "BOGOTA",
    "departamento": "CUNDINAMARCA",
    "pais_codigo": "57",
    "postal": "110210"
  },
  "contacto": {
    "telefono": "3102345678",
    "celular": "3201234567",
    "email": "nomina@empresa.com"
  }
}
```

### Validaciones

- ✅ NIT debe estar activo en DIAN
- ✅ Digit verificación debe coincidir con algoritmo
- ✅ Ciudad debe ser código DANE válido
- ✅ Email debe ser formato válido

---

## 👤 Sección 3: Datos del Empleado

### Información Básica

| Campo | Formato | Obligatorio | Descripción |
|-------|---------|-------------|-------------|
| **Tipo Documento** | Código | ✅ | CC, CE, PA, PE, XX, NIT |
| **Número Documento** | Alfanumérico | ✅ | Identificación única |
| **Nombre Completo** | Texto | ✅ | Nombre completo del empleado |
| **Primer Nombre** | Texto | ✅ | Primer nombre |
| **Segundo Nombre** | Texto | ❌ | Nombre adicional |
| **Primer Apellido** | Texto | ✅ | Primer apellido |
| **Segundo Apellido** | Texto | ❌ | Segundo apellido |

### Información de Contacto

```json
{
  "direccion": "Calle 50 #30-25 Apt 302",
  "ciudad": "BOGOTA",
  "pais": "57",
  "codigo_postal": "110210",
  "telefono": "3001234567",
  "email": "juan.garcia@email.com"
}
```

### Información Laboral

```json
{
  "tipo_trabajador": "200",        // 100=Prestador, 200=Obrero, etc.
  "subtipo_trabajador": "210",     // Clasificación detallada
  "alto_riesgo": false,             // ¿Trabaja en área de alto riesgo?
  "subcontratista": false,
  "tipo_documento_identificacion_beneficiario": "CC",
  "numero_documento_beneficiario": "0000000000"
}
```

---

## 📅 Sección 4: Período de Nómina

### Campos de Período

```json
{
  "fecha_inicio_pago": "2025-10-01",
  "fecha_fin_pago": "2025-10-31",
  "fecha_inicio_licencia": null,
  "fecha_fin_licencia": null,
  "tiempo_laboral_dias": 22,
  "tipo_nomina_periodo": "MENSUAL",
  "salario_integral": false,        // ¿Contrato con salario integral?
  "pagos_en_especie": 0             // Valor pagos no monetarios
}
```

### Validaciones Críticas

- ⚠️ Período no puede traslapar con otro del mismo empleado
- ⚠️ Fecha inicio menor o igual a fecha fin
- ⚠️ Días laborales debe ser realista (máx 31)
- ⚠️ No puede ser período futuro (respecto a fecha actual)

---

## 📝 Sección 5: Novedades (Cambios Laborales)

### Tipos de Novedades Disponibles

| Código | Descripción |
|--------|------------|
| INGRESO | Inicio de relación laboral |
| RETIRO | Fin de relación laboral |
| INCAPACIDAD | Ausencia por enfermedad |
| LICENCIA | Ausencia autorizada |
| PERMISO_SIN_REMUNERACION | Permiso no pagado |
| AUMENTO_SALARIO | Incremento salarial |
| DISMINUCION_SALARIO | Reducción de salario |
| SUSPENSION_TEMPORAL | Suspensión disciplinaria |
| CAMBIO_EMPRESA | Traslado de empresa |
| CAMBIO_DEPARTAMENTO | Cambio de ubicación |
| CAMBIO_PROFESION | Cambio de cargo |
| MATERNITY | Licencia maternidad |
| PATERNITY | Licencia paternidad |

### Estructura de Novedad

```json
{
  "tipo_novedad": "INCAPACIDAD",
  "fecha": "2025-10-05",
  "razon": "ENFERMEDAD_GENERAL",
  "descripcion": "Incapacidad médica certificada",
  "documento_soporte": "CERT-IPS-001234",
  "dias_novedad": 6,
  "porcentaje_pago": 100,           // 100%, 50%, 0%, etc.
  "fecha_resolucion": "2025-10-04",
  "numero_resolucion": "RES-2025-0001"
}
```

---

## 💰 Sección 6: Conceptos de Pago - DEVENGOS

### Devengos Básicos

| Concepto | Base | Cálculo | Ejemplo |
|----------|------|---------|---------|
| **Salario Ordinario** | Contrato | Salario / días laborales × días trabajados | $2,000,000 |
| **Horas Extra Diurna** | Tarifa | (Salario/240) × 1.25 × horas | $150,000 |
| **Horas Extra Nocturna** | Tarifa | (Salario/240) × 1.35 × horas | $162,000 |
| **Hora Dominical** | Tarifa | (Salario/240) × 1.75 × horas | $210,000 |
| **Comisión** | Variable | % sobre ventas | $200,000 |

### Devengos Sociales

```json
{
  "cesantia": {
    "porcentaje": 8.33,             // Siempre 8.33%
    "dias": 22,
    "base": 2400000,
    "valor": 200000,
    "periodica": false              // ¿Se paga periódicamente?
  },
  
  "prima_servicios": {
    "base": 2400000,
    "porcentaje": 8.33,
    "valor": 100000,
    "periodicidad": "SEMESTRAL"     // SEMESTRAL o ANUAL
  },
  
  "vacaciones": {
    "dias": 15,                     // Mínimo legal
    "base_diaria": 109090.91,
    "valor": 1636364
  }
}
```

### Otros Devengos

```json
{
  "bonificacion": {
    "concepto": "BONUS_DESEMPEÑO",
    "valor": 500000,
    "descripcion": "Bono octubre"
  },
  
  "auxilio": {
    "concepto": "AUXILIO_CESANTIA_PAGADO_PERIODICAMENTE",
    "valor": 200000
  },
  
  "viático": {
    "concepto": "VIÁTICO_NACIONAL",
    "valor": 150000
  },
  
  "otros_pagos": {
    "concepto": "AJUSTE_ADMINISTRATIVO",
    "valor": 50000
  }
}
```

---

## 💸 Sección 7: Conceptos de Pago - DEDUCCIONES

### Aportes Obligatorios

```json
{
  "aporte_salud": {
    "base_cotizacion": 2400000,
    "porcentaje": 4,
    "valor": 96000,
    "eps": "SURA",
    "obligatorio": true
  },
  
  "aporte_pension": {
    "base_cotizacion": 2400000,
    "porcentaje": 4,
    "valor": 96000,
    "comision": {
      "valor_comision": 36000,
      "comision_asegurador": 1.5,
      "comision_gestion": 1.4
    },
    "afp": "PROTECCCION",
    "obligatorio": true
  },
  
  "aporte_arl": {
    "base_cotizacion": 2400000,
    "clase_riesgo": "III",
    "tarifa": 2.436,
    "valor": 58464,
    "aseguradora": "POSITIVA",
    "obligatorio": true
  }
}
```

### Retención en la Fuente (RFT)

```json
{
  "retencion_fuente": {
    "base": 2400000,                // Sobre total devengado
    "porcentaje": 2.26,
    "valor": 54240,
    "uvt_ejercicio": 46000,
    "calculo": "Método tarifas DIAN",
    "obligatorio": true
  }
}
```

### Deducciones Voluntarias

```json
{
  "descuentos_voluntarios": [
    {
      "concepto": "LIBRANZA_BANCO",
      "acreedor": "BANCOLOMBIA",
      "valor": 150000,
      "descripcion": "Crédito hipotecario"
    },
    {
      "concepto": "APORTE_VOLUNTARIO_PENSION",
      "valor": 100000
    },
    {
      "concepto": "COOPERATIVA",
      "valor": 50000
    }
  ]
}
```

### Descuentos por Disciplina

```json
{
  "descuentos_disciplinarios": [
    {
      "concepto": "SANCION_DISCIPLINARIA",
      "razon": "IMPUNTUALIDAD_REITERADA",
      "valor": 100000,
      "autorizado_por": "RECURSOS_HUMANOS",
      "fecha_resolucion": "2025-09-25"
    }
  ]
}
```

---

## 🏥 Sección 8: Seguridad Social - Información Complementaria

### Datos de Afiliación

```json
{
  "salud": {
    "tipo_afiliacion": "CONTRIBUTIVO",
    "numero_afiliacion": "123456789001",
    "eps": "SURA",
    "fecha_afiliacion": "2020-05-15"
  },
  
  "pension": {
    "tipo_afiliacion": "CONTRIBUTIVO",
    "numero_afiliacion": "123456789002",
    "afp": "PROTECCCION",
    "tipo_regimen": "SOLIDARIO",
    "fecha_afiliacion": "2020-05-15"
  },
  
  "arl": {
    "numero_afiliacion": "123456789003",
    "aseguradora": "POSITIVA",
    "clase_riesgo": "III"
  },
  
  "otros": {
    "sena_afiliado": true,
    "icbf_afiliado": true,
    "caja_compensacion": "COMFENALCO"
  }
}
```

---

## 📋 Sección 9: Información Salarial

### Estructura de Salarios

```json
{
  "tipo_salario": "ORDINARIO",       // ORDINARIO, INTEGRAL, etc.
  "salario_base": 2400000,
  "salario_integral": null,          // Si aplica
  "salario_variable": 0,
  "salario_fijo": 2400000,
  "tiempo_completo": true,
  "horas_semana": 48,
  "dias_semana": 6
}
```

---

## 🔐 Sección 10: Firma Digital

### Datos de Firma

```json
{
  "firma": {
    "tipo_firma": "XADES",          // XMLDSIG, XADES, CMS
    "algoritmo": "SHA256",
    "certificado": {
      "emisor": "AUTORIDAD_CERTIFICADORA",
      "sujeto": "Tech Solutions S.A.S.",
      "serial": "12345678901234567890",
      "fecha_inicio_vigencia": "2024-01-15",
      "fecha_fin_vigencia": "2026-01-15"
    },
    "timestamp": "2025-10-17T14:32:15Z",
    "validez": true
  }
}
```

---

## ✅ Validaciones por Sección

### Identificación

- ✅ Consecutivo no puede ser duplicado para el mismo empleador/período
- ✅ Período no debe traslapar con otra nómina
- ✅ Tipo de nómina válido

### Empleador

- ✅ NIT activo en DIAN
- ✅ Dígito de verificación correcto
- ✅ Ciudad es código DANE válido

### Empleado

- ✅ Tipo documento válido
- ✅ Documento no nulo
- ✅ Nombre completo válido

### Período

- ✅ Fecha inicio menor o igual a fecha fin
- ✅ Máximo 31 días
- ✅ No futuro

### Conceptos

- ✅ Total devengos > 0
- ✅ Deducciones menor o igual a devengos
- ✅ Neto mayor o igual a 0
- ✅ Aportes correctamente calculados

---

## 🚫 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Período duplicado | Envío accidental de 2 nóminas | Verificar en base datos |
| Firma inválida | Certificado vencido | Renovar certificado |
| Aportes incorrectos | Error en cálculo | Verificar fórmulas |
| Documento inválido | Empleado no hallado | Verificar RIPS/PILA |
| Neto negativo | Deducciones > Devengos | Revisar descuentos |

---

**Última actualización:** Octubre 2025  
**Versión:** 3.0
