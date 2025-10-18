---
sidebar_position: 1
description: "Guía completa de Nómina Electrónica v3.0 - Resolución DIAN 0000040/2024"
---

# Nómina Electrónica v3.0

## 📌 Visión General

La **Nómina Electrónica (NE)** es un documento electrónico obligatorio que registra todas las transacciones laborales, compensación, aportes y deducciones de los trabajadores. Es el medio oficial para comunicar información salarial a entidades de control y seguridad social.

### Base Normativa

| Aspecto | Detalle |
|--------|---------|
| **Resolución DIAN** | 0000040 de 17 de enero de 2024 |
| **Versión Vigente** | 3.0 |
| **Estándar XML** | UBL 2.1 (Universal Business Language) |
| **Firma Digital** | Obligatoria (certificado de la empresa) |
| **Obligatoriedad** | Todos los empleadores con trabajadores vinculados |
| **Inicio Vigencia** | 1 de febrero de 2024 |

---

## 🎯 Propósitos Principales

✅ **Registro Oficial:** Evidencia de relaciones laborales  
✅ **Seguridad Social:** Base para cálculo de aportes a salud, pensión, ARL  
✅ **Fiscalización:** Control de nómina por parte de DIAN  
✅ **Comprobante:** Soporte de pago a empleados  
✅ **Trazabilidad:** Auditoría completa de transacciones laborales  

---

## 📊 Estructura Fundamental

### Componentes Principales

```
Documento de Nómina Electrónica
├── Identificación
│   ├── Número de secuencia
│   ├── Período (fecha inicio - fecha fin)
│   ├── Tipo de nómina (ordinaria, extraordinaria, ajuste, etc.)
│   └── Estado (activa, reemplazada, eliminada)
│
├── Datos del Empleador
│   ├── NIT / Razón Social
│   ├── Dirección
│   ├── Información de contacto
│   └── Régimen fiscal
│
├── Datos del Empleado
│   ├── Tipo y número de documento
│   ├── Nombre completo
│   ├── Datos de contacto
│   └── Información del contrato
│
├── Período de Nómina
│   ├── Fecha inicio del período
│   ├── Fecha fin del período
│   ├── Días trabajados
│   └── Novedades (ausencias, permisos, etc.)
│
├── Conceptos de Pago
│   ├── Devengos (salario, horas extra, bonificaciones, etc.)
│   ├── Deducciones (aportes, impuestos, préstamos, etc.)
│   └── Neto a pagar
│
└── Información de Seguridad Social
    ├── Aportes a salud
    ├── Aportes a pensión
    ├── Aportes a ARL
    └── SENA, ICBF, etc.
```

---

## 🔄 Tipos de Nómina

### Nómina Ordinaria
```
Descripción:  Nómina regular de período mensual o quincenal
Frecuencia:   Según contrato (semanal, quincenal, mensual)
Conceptos:    Salario base, horas extra, comisiones, bonificaciones
Ejemplos:     Pago mes de octubre, quincena 1-15 octubre
```

### Nómina Extraordinaria
```
Descripción:  Nómina fuera del período establecido
Frecuencia:   Puntual (según necesidad)
Casos:        Bonificación especial, pago de prestaciones, ajustes
Ejemplos:     Pago de prima de navidad, bono de desempeño
```

### Nómina de Ajuste
```
Descripción:  Corrección a nómina previamente emitida
Frecuencia:   Cuando hay error en nómina anterior
Casos:        Error de cálculo, datos incorrectos, novedades olvidadas
Ejemplos:     Corrección de retención, agregar horas olvidadas
Relación:     Referencia a nómina anterior que se ajusta
```

### Nómina de Reemplazo
```
Descripción:  Reemplaza completamente una nómina anterior
Frecuencia:   Cuando necesita cambio total
Casos:        Cambio de empleado, período diferente, cambio de empresa
Documentos:   XML anterior se marca como "reemplazada"
Relación:     Referencia explícita al documento reemplazado
```

### Nómina de Eliminación
```
Descripción:  Elimina una nómina emitida previamente
Frecuencia:   Excepcionalmente (error grave)
Autorización: Requiere justificación a DIAN
Casos:        Cancelación de contrato dentro del período
Documentos:   XML anterior se marca como "eliminada"
```

---

## 📅 Ciclo de Vida de la Nómina

### 1. Creación
```
Paso 1:  Empleador elabora nómina
Paso 2:  Calcula devengos (salario, extras, bonificaciones)
Paso 3:  Calcula deducciones (aportes, impuestos, préstamos)
Paso 4:  Registra novedades (faltas, permisos, incapacidades)
Paso 5:  Sistema valida estructura XML
Paso 6:  Genera documento con número de secuencia
```

### 2. Firma Digital
```
Requisito:   Certificado digital del empleador (A1 o A3)
Proceso:    1. Empleador firma con su certificado
             2. Se añade timestamp
             3. Se valida integridad
Formato:    XML firmado (detached signature)
```

### 3. Transmisión a DIAN
```
Destino:     Servidor de recepción DIAN
Protocolo:   SFTP / WebService seguro
Validación:  DIAN valida estructura, firma, datos
Respuesta:   Radicado o rechazo con errores
```

### 4. Recepción por Empleado
```
Metodo:      Correo electrónico del empleado
Documento:   XML + PDF legible
Plazo:       Antes de fecha de pago (mínimo 5 días)
Formato PDF: Número, período, devengos, deducciones, neto
```

### 5. Reportes a Seguridad Social
```
Entidades:
  - Superintendencia Financiera (salud)
  - Ministerio del Trabajo (pensión, SENA, ICBF)
  - ARL (riesgos laborales)
Frecuencia:  Mensual (antes del 10 del mes siguiente)
Información: Aportes, afiliaciones, novedades
```

---

## 💼 Datos del Empleador

### Información Obligatoria

```json
{
  "empleador": {
    "tipo_documento": "NIT",           // NIT obligatorio
    "numero_documento": "123456789-1", // Con dígito de verificación
    "digito_verificacion": "1",
    "razon_social": "Empresa S.A.S.",
    "primer_nombre": "Empresa",
    "primer_apellido": "S.A.S.",
    "direccion": "Calle 100 #45-50",
    "ciudad": "BOGOTA",
    "codigo_pais": "57",               // Colombia
    "codigo_ciudad": "05001",           // DANE
    "postal": "110210",
    "telefono": "3102345678",
    "email": "nomina@empresa.com.co"
  },
  "informacion_fiscal": {
    "regimen": "COMUN",                // COMUN, SIMPLIFICADO, ESPECIAL
    "actividad_economica": "6201",     // CIIU
    "tipo_trabajo": "200",             // 200=Dependiente, 300=Independiente
    "departamento_prestacion": "05"    // Cundinamarca
  }
}
```

---

## 👤 Datos del Empleado

### Información Personal Requerida

```json
{
  "empleado": {
    "tipo_documento": "CC",            // CC, CE, PA, PE, XX, NIT
    "numero_documento": "1234567890",
    "nombre_completo": "Juan García López",
    "primer_nombre": "Juan",
    "segundo_nombre": "José",
    "primer_apellido": "García",
    "segundo_apellido": "López",
    "direccion": "Calle 50 #30-25",
    "ciudad": "BOGOTA",
    "codigo_pais": "57",
    "codigo_ciudad": "05001",          // DANE
    "postal": "110210",
    "email": "juan.garcia@email.com",
    "telefono": "3001234567"
  },
  "informacion_laboral": {
    "alto_riesgo": false,              // ¿Trabaja en área de alto riesgo?
    "correo_notificacion": "juan.garcia@email.com",
    "tipo_trabajador": "100",          // 100=Prestador servicios, 200=Obrero, etc.
    "subtipo_trabajador": "110"        // Subclasificación
  }
}
```

### Tipos de Documento Válidos

| Código | Documento | Aplicable |
|--------|-----------|-----------|
| **CC** | Cédula de Ciudadanía | Colombianos |
| **CE** | Cédula de Extranjería | Extranjeros residentes |
| **PA** | Pasaporte | Extranjeros visitantes |
| **PE** | Permiso Especial | Residentes especiales |
| **XX** | Sin identificación | Casos excepcionales |
| **NIT** | NIT | Personas jurídicas |

---

## 📋 Período de Nómina

### Definición del Período

```json
{
  "periodo": {
    "fecha_inicio": "2025-10-01",
    "fecha_fin": "2025-10-31",
    "dias_trabajados": 22,
    "dias_ausencia": 4,
    "dias_permitidos": 2,
    "tipo_periodo": "MENSUAL",
    "numero_periodo": 10,
    "ano": 2025
  }
}
```

### Unidades de Tiempo

| Tipo | Frecuencia | Ejemplo | Aplicación |
|------|-----------|---------|-----------|
| **Semanal** | 7 días | Lun-Dom | Obreros, personal por horas |
| **Quincenal** | 15 días | 1-15, 16-30 | Empleados nivel operativo |
| **Mensual** | 30/31 días | 1-31 octubre | Empleados nivel administrativo |
| **Anual** | 365 días | 1 enero - 31 dic | Directivos, especiales |

---

## 💰 Conceptos de Pago

### Devengos (Lo que se Gana)

| Concepto | Descripción | Cálculo |
|----------|-------------|---------|
| **Salario Base** | Remuneración acumulada | Contrato |
| **Horas Extra** | Tiempo adicional | Hora normal × 1.25 (diurna) |
| **Horas Nocturnas** | Trabajadas 22:00-6:00 | Hora normal × 1.35 |
| **Horas Dominical** | Trabajadas domingo/festivo | Hora normal × 1.75 |
| **Comisión** | Ingresos por ventas | % de ventas |
| **Bonificación** | Pago adicional | Fijo o variable |
| **Cestería** | Auxilio para canasta familiar | $106,348 (2025) |
| **Subsidio Familiar** | Para trabajadores de renta baja | Según escala ICBF |
| **Viáticos** | Gastos de desplazamiento | Autorizado por empresa |
| **Gratificación** | Prima de navidad, vacaciones | Según contrato |

:::warning
**Horas Extra:**
- Diurna (6:00-22:00): +25%
- Nocturna (22:00-6:00): +35%
- Dominical/Festivo: +75%

No se pueden acumular porcentajes. Se aplica el mayor.
:::

### Deducciones (Lo que se Descuenta)

| Concepto | Porcentaje | Beneficiario |
|----------|-----------|-------------|
| **Aporte Salud** | 4% | Fondo de Compensación |
| **Aporte Pensión** | 4% | AFP elegida |
| **Retención en la Fuente (RFT)** | Variable | DIAN |
| **Descuento Judicial** | Variable | Orden judicial |
| **Préstamo Empresa** | Variable | Empresa |
| **Cooperativa** | Variable | Cooperativa |
| **Crédito Libranza** | Variable | Banco |

### Neto a Pagar

```
Cálculo:
═════════════════════════════
Devengos Totales
  + Salario Base              $2,000,000
  + Horas Extra                 $150,000
  + Comisión                    $300,000
  + Otros                        $50,000
────────────────────────────
Subtotal Devengos            $2,500,000

Deducciones
  - Aporte Salud (4%)           ($100,000)
  - Aporte Pensión (4%)         ($100,000)
  - Retención en la Fuente      ($75,000)
  - Crédito Libranza            ($50,000)
────────────────────────────
Neto a Pagar                 $2,175,000
═════════════════════════════
```

---

## 🏥 Aportes a Seguridad Social

### Sistema de Salud

```json
{
  "aporte_salud": {
    "base_cotizacion": 2400000,
    "porcentaje_empleado": 4,          // 4% obligatorio
    "porcentaje_empleador": 8.5,       // 8.5% obligatorio
    "aporte_empleado": 96000,
    "aporte_empleador": 204000,
    "total": 300000,
    "eps_afiliacion": "SURA"
  }
}
```

**Características:**
- Obligatorio para todos los trabajadores
- Empleado aporta: 4%
- Empleador aporta: 8.5%
- Total: 12.5%
- Afiliación: EPS certificada

### Sistema de Pensión

```json
{
  "aporte_pension": {
    "base_cotizacion": 2400000,
    "porcentaje_empleado": 4,          // Empleado
    "porcentaje_empleador": 12,        // Empleador
    "aporte_empleado": 96000,
    "aporte_empleador": 288000,
    "total": 384000,
    "comision_asegurador": 1.5,
    "comision_asegurador_valor": 36000,
    "garantia": 1.4,
    "garantia_valor": 33600,
    "afp": "PROTECCCION"
  }
}
```

**Características:**
- Obligatorio para todos (excepto empleados públicos)
- Empleado aporta: 4%
- Empleador aporta: 12%
- AFP recauda: 16% total
- Opciones: PROTECCIÓN, PORVENIR, COLFONDOS, SKANDIA

### Seguro de Riesgos Laborales (ARL)

```json
{
  "arl": {
    "base_cotizacion": 2400000,
    "clase_riesgo": "III",             // I, II, III, IV, V
    "tarifa": 2.436,                   // % según clase
    "aporte": 58464,
    "aseguradora": "POSITIVA"
  }
}
```

**Clases de Riesgo:**
- **I:** Mínimo riesgo (oficinas, comercio) - 0.35%
- **II:** Riesgo bajo (agricultura, manufactura ligera) - 1.044%
- **III:** Riesgo medio (manufactura, construcción) - 2.436%
- **IV:** Riesgo alto (minería, industria pesada) - 4.35%
- **V:** Riesgo muy alto (minería profunda) - 6.96%

### Otros Aportes

| Concepto | Porcentaje | Condición | Beneficio |
|----------|-----------|-----------|-----------|
| **SENA** | 0.8% | Empleador solo | Capacitación |
| **ICBF** | 3% | Empleador solo | Infancia y familia |
| **CAJA COMP.** | 4% | Empleador solo | Compensación |

---

## 📝 Novedades (Cambios Laborales)

### Tipos de Novedades

```json
{
  "novedades": [
    {
      "tipo": "INGRESO",
      "fecha": "2025-10-01",
      "tipo_contrato": "1",             // 1=Indefinido, 2=Fijo, 3=Prestación
      "duracion": null,
      "salario": 2400000
    },
    {
      "tipo": "INCAPACIDAD",
      "fecha": "2025-10-10",
      "razon": "ENFERMEDAD_GENERAL",    // Motivo
      "dias": 3,
      "porcentaje_pago": 100
    },
    {
      "tipo": "LICENCIA",
      "fecha": "2025-10-15",
      "razon": "LICENCIA_REMUNERADA",   // Tipo
      "dias": 5
    },
    {
      "tipo": "SUSPENSION_TEMPORAL",
      "fecha": "2025-10-20",
      "razon": "CAUSAL_JUSTA",
      "dias": 2
    },
    {
      "tipo": "RETIRO",
      "fecha": "2025-10-31",
      "razon": "RENUNCIA_VOLUNTARIA",
      "ultima_fecha_pago": "2025-10-31"
    }
  ]
}
```

### Causas y Descripción

| Tipo | Descripción | Remuneración |
|------|-------------|--------------|
| **INGRESO** | Inicio de relación laboral | Según contrato |
| **INCAPACIDAD** | Enfermedad general o profesional | Subsidio de EPS (100%) |
| **LICENCIA** | Permiso autorizado (paternidad, calamidad) | Remunerada |
| **PERMISO_SIN_REMUNERACION** | Permiso autorizado pero sin pago | No remunerada |
| **SUSPENSION_TEMPORAL** | Suspensión disciplinaria | No remunerada |
| **AUMENTO_SALARIO** | Incremento salarial | Nuevo salario |
| **DISMINUCION_SALARIO** | Reducción de salario | Nuevo salario |
| **CAMBIO_EMPRESA** | Transferencia a otra empresa | Según contrato nuevo |
| **CAMBIO_DEPARTAMENTO** | Cambio de ubicación laboral | Mismo salario |
| **RETIRO** | Fin de relación laboral | Según causal |

---

## 🔐 Firma Digital y Seguridad

### Certificado Requerido

```
Tipo:           X.509 v3 para facturación electrónica
Emisor:         AC autorizada por DIAN
Vigencia:       Mínimo 1 año
Nivel:          Preferentemente A3 (con token o tarjeta)
Uso:            Solo para nómina electrónica
Titular:        Representante legal / Responsable autorizado
```

### Proceso de Firma

1. **Generación:** Sistema crea XML de nómina
2. **Normalización:** Aplicación de canónicas XML
3. **Digestión:** Hash SHA-256 del documento
4. **Firma:** Cifrado con clave privada del certificado
5. **Timestamping:** Marca de tiempo autoridad certificadora
6. **Validación:** Verificación de integridad

---

## 📤 Transmisión a DIAN

### Canalización Disponible

**Opción 1: Directa (Empresa)**
```
- Desarrollo de sistema propio
- Conexión directa a servicios DIAN
- Certificado digital de la empresa
- Mayor inversión inicial
```

**Opción 2: Proveedor Tecnológico**
```
- Contratación de software especializado
- El proveedor transmite en nombre de la empresa
- Certificado del proveedor (o tercero)
- Menor costo, menor complejidad
```

### Respuesta DIAN

```json
{
  "respuesta_dian": {
    "radicado": "FPP862141001202510",  // Si es aceptado
    "estado": "RADICADO",
    "fecha_radicacion": "2025-10-17T14:32:15Z",
    "mensajes": [
      {
        "codigo": "1000",
        "descripcion": "Documento procesado exitosamente"
      }
    ]
  }
}
```

---

## 📧 Notificación al Empleado

### Entrega Obligatoria

```
Documento:      XML + PDF legible
Medio:          Correo electrónico del empleado
Plazo:          Máximo 5 días antes de pago
Contenido PDF:  
  - Período de nómina
  - Devengos detallados
  - Deducciones detalladas
  - Neto a pagar
  - Datos para pago
  - Código QR con información
```

### Formato PDF Recomendado

```
NÓMINA ELECTRÓNICA - Período Octubre 2025
═════════════════════════════════════════
Empleador: Empresa S.A.S. - NIT 123456789-1
Empleado:  Juan García López - CC 1234567890
Período:   01-Oct-2025 a 31-Oct-2025
Días:      22 días trabajados

DEVENGOS
────────────────────────────────────────
Salario Base               $2,000,000
Horas Extra (10 h)          $150,000
Bonificación                 $50,000
Otros                           $0
────────────────────────────────────────
Total Devengos            $2,200,000

DEDUCCIONES
────────────────────────────────────────
Aporte Salud (4%)            ($88,000)
Aporte Pensión (4%)          ($88,000)
Retención RFT                ($50,000)
────────────────────────────────────────
Total Deducciones          ($226,000)

NETO A PAGAR              $1,974,000
═════════════════════════════════════════
```

---

## 🔗 Integración con Otros Documentos

### Relación con Factura Electrónica

```
Diferencia:
┌─────────────────┬──────────────────────┬──────────────────────┐
│     Aspecto     │   Nómina Electrónica │  Factura Electrónica │
├─────────────────┼──────────────────────┼──────────────────────┤
│ Sujeto          │ Empleados            │ Clientes             │
│ Concepto        │ Relación laboral     │ Transacción comercial│
│ Frecuencia      │ Periódica (semanal/quinc/mes) │ Por venta    │
│ Validación      │ Ministerio Trabajo   │ DIAN                 │
│ Reportes        │ Mensual a SG         │ Inmediato DIAN       │
└─────────────────┴──────────────────────┴──────────────────────┘
```

### Deducibilidad Fiscal

```
En declaración de renta:
✅ Nómina es gasto deducible (totalmente)
✅ Se puede descartar como ingreso no tributario (base pensión)
✅ Debe coincidir con registros contables
✅ DIAN cruza información con reportes mensuales
```

---

## ⚠️ Validaciones Críticas

### Antes de Transmitir

```
✅ Período correcto y sin traslapes
✅ Todos los campos obligatorios diligenciados
✅ Firma digital válida y vigente
✅ Datos del empleado coinciden con RIPS/PILA
✅ Aportes calculados correctamente
✅ Radicado DIAN previo (si es ajuste/reemplazo)
✅ No hay nómina duplicada en el período
✅ Conceptos clasificados correctamente
```

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Período traslapado | Nómina duplicada | Revisar fechas |
| Firma inválida | Certificado vencido | Renovar certificado |
| Datos inconsistentes | Información incorrecta | Validar BD de empleados |
| Aportes incorrectos | Error cálculo | Revisar porcentajes |
| Empleado no hallado | Documento no registrado | Verificar RIPS |

---

## 📞 Soporte y Consultas

### Contactos Oficiales

**DIAN - Nómina Electrónica:**
- 🌐 www.dian.gov.co
- 📞 +57 (1) 315 0000
- 📧 contacto@dian.gov.co

**Ministerio del Trabajo:**
- 🌐 www.mintrabajo.gov.co
- 📞 +57 (1) 330 0000

**Superintendencia Financiera:**
- 🌐 www.superfinanciera.gov.co
- 📞 +57 (1) 594 0000

---

## 📚 Recursos Adicionales

- 📖 [Anexo Técnico Oficial DIAN v3.0](https://www.dian.gov.co/impuestos/factura-electronica/Documentos%20compartidos/Caja-de-herramientas-Nomina-Electronica-V1.1.zip)
- 📋 [Ejemplos Prácticos de Nómina](/docs/regulatory-framework/nomina-electronica/ejemplos)
- 🔧 [Campos y Especificaciones](/docs/regulatory-framework/nomina-electronica/campos)
- 📝 [Tipos de Novedades](/docs/regulatory-framework/nomina-electronica/novedades)
- 💻 [Fórmulas de Cálculo](/docs/regulatory-framework/nomina-electronica/calculos)

---

**Última actualización:** Octubre 2025  
**Versión:** 3.0 (Resolución 0000040/2024)  
**Estado:** Vigente desde 1 de febrero de 2024
