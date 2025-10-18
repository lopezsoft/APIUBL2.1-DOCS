---
sidebar_position: 4
description: "Catálogo completo de novedades laborales en Nómina Electrónica"
---

# Tipos de Novedades

## 📖 ¿Qué son las Novedades?

Las **novedades** son cambios en la situación laboral del empleado que afectan el cálculo de la nómina. Ejemplos: incapacidad, licencia, cambio de salario, retiro, etc.

**Obligatoriedad:** Deben registrarse en la nómina del período en que ocurren.

---

## 🏥 NOVEDADES DE SALUD Y AUSENCIA

### 1. INCAPACIDAD (Enfermedad)

```json
{
  "tipo_novedad": "INCAPACIDAD",
  "subtipo": "ENFERMEDAD_GENERAL",
  "fecha_inicio": "2025-10-05",
  "fecha_fin": "2025-10-10",
  "dias_incapacidad": 6,
  "porcentaje_pago": 100,
  "documento_soporte": "CERT-IPS-00123",
  "entidad_emisora": "SANITAS",
  "diagnostico": "E10.9 - Diabetes mellitus tipo 2",
  "requiere_reemplazo": false
}
```

**Características:**
- 📋 Requiere certificación médica
- 💰 Se paga 100% (primeros 2 años por EPS)
- 📊 Genera reporte a entidad de salud
- ⏱️ Máximo 90 días consecutivos sin revisión

**Subtypes:**
- ENFERMEDAD_GENERAL
- ACCIDENTE_TRABAJO
- ENFERMEDAD_PROFESIONAL
- MATERNIDAD_INCAPACIDAD

---

### 2. INCAPACIDAD POR MATERNIDAD

```json
{
  "tipo_novedad": "INCAPACIDAD",
  "subtipo": "MATERNIDAD",
  "fecha_inicio": "2025-12-15",
  "fecha_fin": "2026-03-15",
  "dias_incapacidad": 90,
  "porcentaje_pago": 100,
  "documento_soporte": "CERT-MATERNIDAD-00456",
  "entidad_emisora": "CAJA_COMPENSACION",
  "diagnostico": "Z39 - Puerperio fisiológico"
}
```

**Características:**
- 👶 Mínimo 18 semanas de licencia
- 💵 Pago 100% a cargo de Caja Compensación
- 🕐 Se inicia 4 semanas antes de fecha probable parto
- 🏥 Requiere documento médico

---

### 3. LICENCIA REMUNERADA

```json
{
  "tipo_novedad": "LICENCIA",
  "subtipo": "LICENCIA_REMUNERADA",
  "razon": "LICENCIA_PATERNIDAD",
  "fecha_inicio": "2025-10-20",
  "fecha_fin": "2025-10-24",
  "dias_licencia": 5,
  "porcentaje_pago": 100,
  "requiere_autorizacion": true,
  "autorizado_por": "RECURSOS_HUMANOS",
  "fecha_autorizacion": "2025-10-15"
}
```

**Tipos de Licencia Remunerada:**

| Tipo | Días | Descripción |
|------|------|-------------|
| **Paternidad** | 8 | Nacimiento de hijo |
| **Calamidad Doméstica** | 3 | Muerte o enfermedad grave familiar |
| **Luto** | 3 | Fallecimiento familiar directo |
| **Asuntos Personales** | 2 | Autorizado por empresa |
| **Capacitación** | Variable | Autorizado por empresa |
| **Cívica** | 1 | Votación electoral |
| **Junta Directiva** | Variable | Si es actividad sindical |

---

### 4. PERMISO SIN REMUNERACIÓN

```json
{
  "tipo_novedad": "PERMISO_SIN_REMUNERACION",
  "razon": "PERMISO_SOLICITADO",
  "fecha_inicio": "2025-10-15",
  "fecha_fin": "2025-10-17",
  "dias_permiso": 3,
  "porcentaje_pago": 0,
  "justificacion": "Asuntos personales"
}
```

**Características:**
- ❌ No genera pago
- 📊 Descuenta días laborales
- ✅ No afecta prestaciones
- ⚖️ Debe estar autorizado

---

### 5. SUSPENSIÓN TEMPORAL

```json
{
  "tipo_novedad": "SUSPENSION_TEMPORAL",
  "razon": "CAUSAL_JUSTA",
  "fecha_inicio": "2025-10-10",
  "fecha_fin": "2025-10-12",
  "dias_suspension": 3,
  "porcentaje_pago": 0,
  "motivo": "INASISTENCIA_INJUSTIFICADA",
  "resolucion": "RES-RH-2025-0001",
  "fecha_resolucion": "2025-10-09"
}
```

**Motivos de Suspensión:**
- Falta disciplinaria
- Incumplimiento contrato
- Ausencia injustificada
- Violación de normas internas

:::warning
Requiere **justificación documented** y **derecho a defensa** del empleado.
:::

---

## 💼 NOVEDADES CONTRACTUALES

### 6. INGRESO (Primer Día)

```json
{
  "tipo_novedad": "INGRESO",
  "fecha_ingreso": "2025-10-01",
  "tipo_contrato": "INDEFINIDO",
  "duracion_contrato": null,
  "salario_ingreso": 2400000,
  "profesion": "ANALISTA_SISTEMAS",
  "cargo": "Analista Senior",
  "departamento": "TECNOLOGIA",
  "centro_costo": "IT-001",
  "jornada": "TIEMPO_COMPLETO",
  "horas_semana": 48
}
```

**Información Requerida:**
- ✅ Salario acuerdo
- ✅ Tipo de contrato
- ✅ Jornada y horario
- ✅ Cargo y departamento

---

### 7. RETIRO (Fin de Relación)

```json
{
  "tipo_novedad": "RETIRO",
  "fecha_retiro": "2025-10-31",
  "causal_retiro": "RENUNCIA_VOLUNTARIA",
  "razon_detallada": "Cambio de empleo",
  "periodo_preaviso": 30,
  "fecha_preaviso": "2025-09-30",
  "ultimo_dia_laboral": "2025-10-31",
  "liquida_prestaciones": true
}
```

**Causales de Retiro:**

| Causal | Descripción | Prestaciones |
|--------|-------------|--------------|
| **Renuncia Voluntaria** | Empleado se retira | Sí, completas |
| **Despido Justificado** | Falta grave probada | Sí, mínimo legal |
| **Despido Injustificado** | Sin justa causa | Sí, + indemnización |
| **Jubilación** | Edad y tiempo | Sí, completas |
| **Término de Contrato** | Fin de plazo fijo | Sí, mínimo legal |
| **Muerte** | Fallecimiento | A beneficiarios |

---

### 8. CAMBIO DE EMPRESA

```json
{
  "tipo_novedad": "CAMBIO_EMPRESA",
  "empresa_anterior": "OLD_COMPANY_LTDA",
  "empresa_nueva": "NEW_COMPANY_LTDA",
  "nit_empresa_nueva": "987654321-0",
  "fecha_cambio": "2025-10-15",
  "periodo_carencia": 0,
  "tipo_contrato_nuevo": "INDEFINIDO",
  "salario_nuevo": 2800000,
  "beneficios_reconocidos": ["CESANTIA", "VACACIONES"]
}
```

---

### 9. CAMBIO DE DEPARTAMENTO/UBICACIÓN

```json
{
  "tipo_novedad": "CAMBIO_DEPARTAMENTO",
  "departamento_anterior": "TECNOLOGIA",
  "departamento_nuevo": "OPERACIONES",
  "centro_costo_anterior": "IT-001",
  "centro_costo_nuevo": "OPS-002",
  "fecha_cambio": "2025-10-15",
  "salario_mantiene": true,
  "tipo_cambio": "PROMOCION"
}
```

---

### 10. CAMBIO DE CARGO/PROFESIÓN

```json
{
  "tipo_novedad": "CAMBIO_PROFESION",
  "cargo_anterior": "Analista Jr.",
  "cargo_nuevo": "Analista Senior",
  "fecha_cambio": "2025-10-01",
  "salario_anterior": 2000000,
  "salario_nuevo": 2800000,
  "tipo_cambio": "PROMOCION"
}
```

---

## 💰 NOVEDADES SALARIALES

### 11. AUMENTO DE SALARIO

```json
{
  "tipo_novedad": "AUMENTO_SALARIO",
  "fecha_vigencia": "2025-10-15",
  "salario_anterior": 2400000,
  "salario_nuevo": 2700000,
  "incremento_valor": 300000,
  "incremento_porcentaje": 12.5,
  "razon": "AJUSTE_ANUAL_INFLACION",
  "acuerdo_numero": "CONVENIO-2025-001",
  "retroactivo": false
}
```

**Razones de Aumento:**
- Ajuste por inflación
- Promoción
- Aumento de responsabilidades
- Reconocimiento de antigüedad
- Acuerdo colectivo

---

### 12. DISMINUCIÓN DE SALARIO

```json
{
  "tipo_novedad": "DISMINUCION_SALARIO",
  "fecha_vigencia": "2025-10-01",
  "salario_anterior": 2400000,
  "salario_nuevo": 2100000,
  "disminucion_valor": 300000,
  "disminucion_porcentaje": 12.5,
  "razon": "DEMANDA_ECONOMICA",
  "acuerdo": true,
  "acuerdo_escrito": "ACTA-NEGOCIACION-2025"
}
```

:::warning
**Restricción:** Disminución solo puede ocurrir si:
1. Hay acuerdo escrito entre partes
2. Hay causal económica válida
3. No viola normas laborales
:::

---

## 📅 NOVEDADES DE TIEMPO

### 13. CAMBIO DE JORNADA

```json
{
  "tipo_novedad": "CAMBIO_JORNADA",
  "jornada_anterior": "TIEMPO_COMPLETO",
  "jornada_nueva": "MEDIO_TIEMPO",
  "horas_semana_anterior": 48,
  "horas_semana_nueva": 24,
  "fecha_vigencia": "2025-10-15",
  "salario_ajusta": true,
  "nuevo_salario": 1200000
}
```

---

### 14. VACACIONES (Disfrute)

```json
{
  "tipo_novedad": "VACACIONES",
  "fecha_inicio_vacaciones": "2025-12-15",
  "fecha_fin_vacaciones": "2025-12-29",
  "dias_disfrutados": 15,
  "dias_pendientes": 0,
  "porcentaje_pago": 100,
  "forma_pago": "PAGADO",
  "anticipada": false
}
```

**Características:**
- 📅 Mínimo 15 días anuales
- 💰 Se paga salario ordinario
- 📊 Generadas mes a mes (2.5 días/mes)
- ⚖️ El empleador decide fecha

---

## 🔄 NOVEDADES DE JORNADA ESPECIAL

### 15. HORA EXTRA (Sistemática)

```json
{
  "tipo_novedad": "HORAS_EXTRA_SISTEMATICA",
  "descripcion": "Autorización de horas extra regulares",
  "horas_semana_autorizadas": 10,
  "fecha_inicio_vigencia": "2025-10-01",
  "fecha_fin_vigencia": "2025-12-31",
  "razon": "PROYECTO_TEMPORAL",
  "autorizado_por": "GERENCIA",
  "requiere_pago_extra": true,
  "compensacion": "PAGO_EN_EFECTIVO"
}
```

---

### 16. CAMBIO DE TURNO

```json
{
  "tipo_novedad": "CAMBIO_TURNO",
  "turno_anterior": "DIURNO",
  "turno_nuevo": "NOCTURNO",
  "fecha_vigencia": "2025-10-15",
  "horario_anterior": "06:00-14:00",
  "horario_nuevo": "22:00-06:00",
  "complemento_nocturnidad": 0.35,
  "salario_se_ajusta": true
}
```

---

## 👶 NOVEDADES ESPECIALES

### 17. LICENCIA DE MATERNIDAD

```json
{
  "tipo_novedad": "LICENCIA",
  "subtipo": "LICENCIA_MATERNIDAD",
  "fecha_inicio": "2025-12-01",
  "fecha_fin": "2026-02-27",
  "semanas": 18,
  "dias": 126,
  "porcentaje_pago": 100,
  "entidad_pago": "CAJA_COMPENSACION",
  "diagnostico": "O80.9 - Parto simple",
  "ciudad_parto": "BOGOTA"
}
```

**Cobertura:**
- 4 semanas antes de fecha probable parto
- 8 semanas después del parto
- Total mínimo: 12 semanas
- Máximo: 18 semanas en casos especiales

---

### 18. LICENCIA DE PATERNIDAD

```json
{
  "tipo_novedad": "LICENCIA",
  "subtipo": "LICENCIA_PATERNIDAD",
  "fecha_inicio": "2025-11-15",
  "fecha_fin": "2025-11-22",
  "dias": 8,
  "porcentaje_pago": 100,
  "entidad_pago": "EMPRESA",
  "tipo_evento": "NACIMIENTO_HIJO",
  "documento_soporte": "REGISTRO_CIVIL"
}
```

---

### 19. LICENCIA POR CUIDADO HIJO

```json
{
  "tipo_novedad": "LICENCIA",
  "subtipo": "LICENCIA_CUIDADO_HIJO",
  "descripcion": "Licencia para cuidado de hijo menor 8 años",
  "fecha_inicio": "2025-10-20",
  "fecha_fin": "2025-10-24",
  "dias": 5,
  "porcentaje_pago": 100,
  "hijo_edad": 4,
  "razon_ausencia_cuidador": "ENFERMEDAD"
}
```

---

## 📋 VALIDACIONES POR NOVEDAD

### Incapacidad
- ✅ Debe haber soporte médico
- ✅ Entidad debe estar activa en Sistema de Salud
- ✅ Diagnostico ICD-10 válido
- ✅ Duración máx 90 días sin revisión

### Licencia
- ✅ Debe estar autorizada
- ✅ Tipo de licencia válido
- ✅ Duración dentro de límites legales
- ✅ Soporte documental

### Cambio Salarial
- ✅ Acuerdo escrito (para disminución)
- ✅ No viola salario mínimo
- ✅ Fecha coherente

### Retiro
- ✅ Causal válida
- ✅ Liquidación completa
- ✅ Documentos finales

---

## 🚫 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Incapacidad sin soporte | Falta certificado médico | Adjuntar documento |
| Novedad duplicada | Registro doble | Verificar fechas |
| Fecha inconsistente | Futura o anterior a período | Revisar calendario |
| Tipo inválido | Código errado | Usar catálogo oficial |
| Pago inconsistente | % fuera de rango | Validar fórmulas |

---

## 📊 Tabla Resumen de Novedades

| Novedad | Pago | Afecta Aportes | Requiere Soporte | Períodico |
|---------|------|---|---|---|
| Incapacidad | 100% | Sí | Sí (Médico) | No |
| Licencia | 100% | Sí | Sí (RH) | No |
| Suspensión | 0% | No | Sí (Discipl.) | No |
| Aumento | Nuevo | Sí | Sí (Acuerdo) | No |
| Vacaciones | 100% | Sí | No | Anual |
| Retiro | Variable | Sí | Sí (Final) | No |

---

**Última actualización:** Octubre 2025  
**Versión:** 3.0 (Resolución 0000040/2024)
