---
sidebar_position: 3
description: "Casos de uso reales de RADIAN con escenarios completos"
---

# Casos de Uso RADIAN

## 🎯 Introducción

Esta sección presenta 8 casos de uso reales de RADIAN con flujos completos, mostrando cómo diferentes actores utilizan el sistema para resolver problemas comerciales específicos.

---

## 📝 Caso 1: Factoraje Simple (Factor Financiero)

### Contexto

```
Empresa A (Vendedor):        Fabricante de computadores
Empresa B (Comprador):       Distribuidor
Factor Financiero C:         Empresa de factoraje

Situación:
- A vende a B: $10,000,000 en 30 días
- B necesita efectivo inmediato
- B acude a Factor para adelanto
```

### Proceso Paso a Paso

```
PASO 1: Emisión de Factura
───────────────────────────
A emite FE-001: $10,000,000 (30 días crédito)
└─ Bien: Computadores Dell
└─ Cantidad: 50 unidades
└─ Fecha: 2025-10-17
└─ Vencimiento: 2025-11-16

PASO 2: B Recibe y Acepta
───────────────────────────
B recibe notificación DIAN
B valida: Todo correcto ✅
B envía: ACE a DIAN
Estado: FE-001 ACEPTADA

PASO 3: B Acude al Factor C
───────────────────────────
B: "Necesito $9,500,000 hoy"
C: "Tomo los derechos, cobro 5% comisión"
Acuerdo: Cesión del 95% de la factura ($9,500,000)
Comisión: $500,000
Efectivo a B: $9,500,000

PASO 4: B Genera Endoso en RADIAN
──────────────────────────────────
B crea ENDOSO:
└─ Referencia: FE-001
└─ Beneficiario: Factor C
└─ Monto: $9,500,000
└─ Tipo: Cesión de derechos
└─ Firmado: Certificado B

PASO 5: DIAN Radica Endoso
──────────────────────────────
DIAN valida estructura ✅
Radicado: END-FPP-0001-001
Notificación a: A, B, C

PASO 6: A Recibe Aviso
────────────────────────
A notificado: Factor C es nuevo acreedor
A debe: Pagar $9,500,000 a Factor C
A retiene: $500,000 (deuda con B)

PASO 7: Pagos Realizados
────────────────────────
A trasfiere a C: $9,500,000 (antes 2025-11-16)
C trasfiere a B: $9,500,000 inmediato
B ya tiene liquidez

PASO 8: Cierre
──────────────
A: Vendedor cobró (a través de C)
B: Distribuidor tiene liquidez (pagó comisión)
C: Factor cobró comisión ($500,000) + plazo

TRAZABILIDAD EN RADIAN:
└─ FE-001: ACE (Aceptada)
└─ END-FPP-0001-001: Endoso confirmado
└─ Movimientos de dinero evidenciados
└─ Auditoría completa disponible
```

### JSON Completo del Caso

```json
{
  "caso": "FACTORAJE",
  "participantes": {
    "vendedor": {
      "nit": "123456789-1",
      "nombre": "Fabricante Computadores S.A.S.",
      "rol": "EMISOR"
    },
    "comprador": {
      "nit": "987654321-0",
      "nombre": "Distribuidor Nacional S.A.",
      "rol": "RECIBIDOR_Y_CEDENTE"
    },
    "factor": {
      "nit": "555666777-8",
      "nombre": "Factor Financiero Plus Ltda.",
      "rol": "CESIONARIO"
    }
  },
  "documento_original": {
    "radicado": "FPP862141001202510001",
    "tipo": "FACTURA",
    "fecha": "2025-10-17",
    "monto": 10000000,
    "plazo_dias": 30,
    "estado": "ACE"
  },
  "endoso": {
    "radicado": "END-FPP-862141001202510001",
    "tipo": "CESION_TOTAL",
    "monto": 9500000,
    "comision": 500000,
    "fecha": "2025-10-17",
    "efectivo_otorgado_a_comprador": 9500000
  },
  "resultado": "EXITO - Comprador tiene liquidez, Vendedor cobra a vencimiento"
}
```

---

## 📝 Caso 2: Corrección por Error en Cantidad

### Contexto

```
Vendedor V:  Proveedor de insumos
Comprador C: Empresa manufacturera

Problema: Factura con cantidad incorrecta
```

### Proceso

```
PASO 1: Factura Original
└─ FE-100: 500 kilos de acero
└─ Precio: $5,000 por kilo
└─ Total: $2,500,000

PASO 2: Recepción y Problema
└─ C recibe: Solo 480 kilos
└─ C valida: 20 kilos faltantes
└─ Decisión: Aceptación Condicional (ACP)

PASO 3: C Envía ACP
└─ Motivo: "Cantidad incompleta"
└─ Solicita: Nota crédito o envío complementario
└─ Plazo: Extendido 10 días

PASO 4: V Recibe ACP
└─ V investiga: Error de despacho
└─ Acción: Emite Nota Crédito (NC)
└─ Monto NC: 20 kilos × $5,000 = $100,000

PASO 5: NC Enviada a DIAN
└─ Referencia: FE-100
└─ Tipo: NOTA CREDITO
└─ Monto: $100,000 (descuento)
└─ Nueva factura: FE-100 ajustada = $2,400,000

PASO 6: C Recibe NC
└─ Valida: Correcto
└─ Contablemente: -$100,000 en pasivo
└─ Envía: ACE a la NC

PASO 7: Cierre
└─ FE-100: RCH (por cantidad)
└─ NC-100: ACE (aceptada)
└─ Nueva FE-101: $2,400,000 (FE-100 ajustada)
└─ Registros contables normalizados
```

---

## 📝 Caso 3: Rechazo por Factura Duplicada

### Contexto

```
Vendedor V:  Empresa de servicios
Comprador C: Cliente corporativo

Problema: Factura enviada dos veces por error
```

### Proceso

```
PASO 1: Primera Factura
└─ FE-200: Servicios de consultoría
└─ Monto: $3,000,000
└─ Fecha: 2025-10-10

PASO 2: Error - Segunda Factura (Duplicada)
└─ FE-201: Misma factura nuevamente
└─ Monto: $3,000,000
└─ Fecha: 2025-10-12
└─ Motivo: Error administrativo

PASO 3: C Recibe Ambas
└─ FE-200: Valida
└─ FE-201: Ve que es duplicada
└─ Aviso: "Factura duplicada"

PASO 4: C Envía RCH para FE-201
└─ Motivo: "FACTURA_DUPLICADA"
└─ Detalle: "Ya facturado en FE-200"
└─ Solicitud: "Anule esta factura"

PASO 5: V Recibe RCH
└─ Reconoce error
└─ Acción: Emite Nota Débito (ND) negativa
└─ Efecto: Cancela FE-201 completamente
└─ O: Deja FE-201 rechazada

PASO 6: Resolución
└─ FE-200: ACE (aceptada y válida)
└─ FE-201: RCH (permanece rechazada)
└─ RADIAN: Evidencia completa del error y corrección
```

---

## 📝 Caso 4: Negociación de Condiciones

### Contexto

```
Vendedor V:  Importador de equipos
Comprador C: Empresa de telecomunicaciones

Problema: Plazo diferente a lo pactado
```

### Proceso

```
PASO 1: Factura con Plazo No Acordado
└─ FE-300: Equipos de red
└─ Monto: $50,000,000
└─ Plazo en FE: 30 días
└─ Plazo acordado: 45 días
└─ Problema: Discrepancia

PASO 2: C Recibe y Detecta
└─ C: "Plazo debe ser 45, no 30"
└─ Decisión: ACP (Aceptación Condicional)

PASO 3: C Envía ACP
└─ Condición: "Plazo debe ser 45 días"
└─ Nuevo vencimiento: 60 días (desde recepción)
└─ Solicitud: "Confirme nuevo plazo"

PASO 4: V Recibe ACP
└─ V tiene opciones:
│  Opción A: Acepta nuevo plazo
│  └─ Emite Nota Débito (ajuste)
│  └─ Confirma a C
│  └─ ACP se normaliza a ACE
│
│  Opción B: Rechaza nuevo plazo
│  └─ Envía RCH él mismo
│  └─ Mantiene 30 días
│  └─ Negocia con C vía email
│
│  Opción C: No responde
│  └─ Después de 30 días: Aceptación tácita
│  └─ Se asume ACP como válido
│  └─ 45 días es el nuevo plazo

PASO 5: V Elige Opción A (Aceptar)
└─ Emite Nota Débito:
│  ├─ Referencia: FE-300
│  ├─ Monto: $0 (solo ajuste de fecha)
│  ├─ Nueva fecha vencimiento: 45 días
│  └─ Tipo: "Extensión de plazo"

PASO 6: C Recibe ND
└─ C valida: Plazo ahora es 45 días ✅
└─ C envía: ACE a la ND
└─ Resultado: Acuerdo normalizado

PASO 7: Cierre
└─ FE-300: ACE (con ajustes)
└─ ND-300: ACE (plazo extendido)
└─ Ambas partes conformes
└─ Pago realizado en día 45
```

---

## 📝 Caso 5: Flujo con Múltiples Endosos

### Contexto

```
Empresa A (Fabricante)
  ↓ Vende a
Empresa B (Distribuidor 1)
  ↓ Endosa a
Empresa C (Distribuidor 2)
  ↓ Endosa a
Empresa D (Factor)

Cada eslabón transferiendo derechos
```

### Proceso

```
PASO 1: A → B (Venta Original)
└─ Factura FE-001: $1,000,000
└─ B recibe y acepta: ACE

PASO 2: B → C (Primer Endoso)
└─ B genera ENDOSO-1: 80% = $800,000
└─ Beneficiario: C
└─ C es nuevo acreedor por $800,000

PASO 3: C → D (Segundo Endoso)
└─ C genera ENDOSO-2: 100% de su parte = $800,000
└─ Beneficiario: D (Factor)
└─ D es nuevo acreedor por $800,000

PASO 4: Cadena en RADIAN
└─ FE-001: A→B (ACE)
│  └─ ENDOSO-1: B→C ($800,000)
│     └─ ENDOSO-2: C→D ($800,000)
│
└─ Resultado: Cada paso registrado
              Auditoría completa
              Responsabilidades claras

PASO 5: Pagos
└─ A paga a D: $800,000 (Principal acreedor)
└─ B retiene: $200,000 (No endosados)
└─ C: Intermediario, cobra comisión
└─ D: Recibe pago principal

TRAZABILIDAD:
└─ Cada eslabón documentado
└─ Cada transferencia autorizada
└─ Responsabilidades claras
└─ Auditoría sin ambigüedades
```

---

## 📝 Caso 6: Reclamación Post-Aceptación

### Contexto

```
Vendedor V:  Distribuidor de bebidas
Comprador C: Tienda minorista

Problema: Producto defectuoso detectado después de aceptación
```

### Proceso

```
PASO 1: FE Emitida y Aceptada
└─ FE-500: Bebidas (100 cajas)
└─ Monto: $5,000,000
└─ C acepta: ACE

PASO 2: Después de 10 días
└─ C abre cajas
└─ Detecta: Bebidas vencidas
└─ Problema: Productos no usables

PASO 3: C Aún Puede Actuar
└─ Generar Documento de Reclamo en RADIAN
└─ Especificar: Motivo y pruebas
└─ Solicitar: Nota Crédito o devolución

PASO 4: V Recibe Reclamo
└─ V reconoce problema
└─ Emite Nota Crédito: $5,000,000 (100%)
└─ O: Envía nuevos productos
└─ Resuelve situación

PASO 5: Cierre
└─ FE-500: ACE + Reclamo procesado
└─ NC-500: $5,000,000 (Crédito total)
└─ Historial: Problema documentado y resuelto
```

---

## 📝 Caso 7: Pago Parcial Múltiple

### Contexto

```
Vendedor V:   Proveedor B2B
Comprador C:  Empresa manufacturera
3 Compradores Diferentes

Vendedor vende a 3 compradores
Quiere transferir derec a Factor
Cada uno en monto diferente
```

### Proceso

```
PASO 1: Tres Facturas Emitidas
└─ FE-1: C1 → $2,000,000 (Acepta)
└─ FE-2: C2 → $3,000,000 (Acepta)
└─ FE-3: C3 → $4,000,000 (Acepta)
└─ Total: $9,000,000

PASO 2: Factor Negocia Parcialmente
└─ Factor: "Tomo $7,000,000 de $9,000,000"
└─ Comisión: 5% = $350,000
└─ Efectivo: $6,650,000

PASO 3: Estrategia de Endosos
├─ Endoso 1: FE-1 → 100% ($2,000,000) a Factor
├─ Endoso 2: FE-2 → 100% ($3,000,000) a Factor
├─ Endoso 3: FE-3 → Parcial ($2,000,000 de $4,000,000) a Factor
└─ Total endosado: $7,000,000

PASO 4: Radicaciones en RADIAN
└─ 3 Endosos diferentes radicados
└─ Cada uno con su radicado propio
└─ Factor es acreedor por $7,000,000
└─ Vendedor retiene $2,000,000 (FE-3)

PASO 5: Pagos
├─ C1 paga a Factor: $2,000,000
├─ C2 paga a Factor: $3,000,000
├─ C3 paga a Vendedor: $2,000,000
├─ C3 paga a Factor: $2,000,000
└─ Factor paga a Vendedor: $6,650,000

PASO 6: Cierre
└─ 3 facturas: Todas con ACE
└─ 3 endosos: Todos confirmados
└─ Movimientos: Totalmente trazables
└─ Auditoría: Completa y verificable
```

---

## 📝 Caso 8: Resolución de Conflicto

### Contexto

```
Vendedor V:   Empresa de importación
Comprador C:  Retail chain
Problema:     Cantidad facturada vs. recibida
```

### Proceso

```
PASO 1: Factura Polémica
└─ FE-700: 1,000 prendas de vestir
└─ Monto: $10,000,000
└─ Recepción: C reporta solo 950 prendas

PASO 2: C Envía RCH
└─ Motivo: "CANTIDAD_INCORRECTA"
└─ Diferencia: 50 prendas
└─ Solicitud: Nota Crédito o envío complementario

PASO 3: V No Está de Acuerdo
└─ V: "Embalaje correcto al despacho"
└─ V: "Problema es de transporte/C"
└─ V: Envía RCH también (contra-rechazo)

PASO 4: Impasse Temporal
└─ FE: Rechazada
└─ Ambas partes en desacuerdo
└─ RADIAN: Documenta conflicto

PASO 5: Investigación
├─ Revisar Video de embalaje (V)
├─ Revisar transporte (Transportista)
├─ Revisar recepción (C)
└─ Determinar: ¿Dónde se perdieron?

PASO 6: Resolución
Escenario A: Error fue de C
├─ C acepta: Las 50 prendas estaban
├─ C envía: ACE a FE-700
└─ Conflicto resuelto

Escenario B: Error fue de transporte
├─ V contacta: Empresa de transporte
├─ V obtiene: Cobertura de seguro
├─ V emite: Nota Crédito a C
├─ C acepta: NC-700
└─ Conflicto resuelto

Escenario C: Error fue de V (embalaje)
├─ V asume: Responsabilidad
├─ V emite: Nota Crédito completa
├─ V envía: Reemplazo de 50 prendas
├─ C acepta: NC + nueva FE
└─ Conflicto resuelto

PASO 7: Cierre y Lecciones
└─ RADIAN: Evidencia completa del conflicto
└─ Auditoría: Permite análisis de causa raíz
└─ Mejora: Ambas partes aprenden
└─ Confianza: Aumenta con resolución
```

---

## 📊 Tabla Resumen de Casos

| Caso | Tema | Sujetos | Documento | Acción |
|------|------|---------|-----------|--------|
| 1 | Factoraje | V, C, Factor | FE + Endoso | ACE + END |
| 2 | Corrección | V, C | FE + NC | RCH + ACE |
| 3 | Duplicado | V, C | FE duplicada | RCH |
| 4 | Negociación | V, C | FE + ND | ACP + ACE |
| 5 | Multi-Endoso | V, C1, C2, Factor | 3 FE + Endosos | ACE + 2 END |
| 6 | Reclamo | V, C | FE + NC | ACE + Reclamo |
| 7 | Pago Parcial | V, 3C, Factor | 3 FE + Endosos | ACE + Parcial |
| 8 | Conflicto | V, C, Transport | FE | RCH → ACE/NC |

---

**Última actualización:** Octubre 2025  
**Versión:** 2.0 (Resolución 000198/2024)
