---
sidebar_position: 4
description: "Matriz de Sujetos, Eventos y Roles en RADIAN"
---

# Matriz Sujeto-Evento-Rol

## 🎯 Introducción

La matriz RADIAN define todas las combinaciones válidas entre:
- **Sujetos RADIAN**: Emisor (E), Recibidor (R), Tercero (T)
- **Eventos RADIAN**: Acciones que pueden ocurrir sobre un documento
- **Roles**: Funciones que puede asumir cada sujeto

---

## 📋 Sujetos RADIAN

```
┌──────────────────────────────────────────┐
│           SUJETOS RADIAN (3)             │
├──────────────────────────────────────────┤
│ E: EMISOR (Vendedor/Prestador)           │
│    - Crea el documento                    │
│    - Responsable original                 │
│    - Puede endosar                        │
│                                          │
│ R: RECIBIDOR (Comprador/Cliente)         │
│    - Recibe el documento                  │
│    - Responde (ACE, ACP, RCH)             │
│    - Puede endosar                        │
│                                          │
│ T: TERCERO (Factor, Auditor, etc.)       │
│    - Participa en gestión                 │
│    - Puede recibir endosos                │
│    - Funciones especializadas             │
└──────────────────────────────────────────┘
```

---

## 🎬 Eventos RADIAN (6 Principales)

```
GENERACIÓN (GEN)
├─ Emisor crea documento original
├─ Envío a DIAN
├─ Notificación a Recibidor
└─ Estado: PENDIENTE_RESPUESTA

RECEPCIÓN (REC)
├─ Recibidor recibe notificación
├─ Descarga documento
├─ Valida estructura
└─ Estado: RECIBIDA

ACEPTACIÓN (ACE)
├─ Recibidor valida completamente
├─ Acepta sin condiciones
├─ Registra contablemente
└─ Estado: ACEPTADA

RESPUESTA_CONDICIONAL (ACP)
├─ Recibidor acepta con condiciones
├─ Especifica cambios requeridos
├─ Emisor debe resolver
└─ Estado: ACEPTACION_CONDICIONAL

RECHAZO (RCH)
├─ Recibidor rechaza documento
├─ Especifica motivo
├─ Emisor debe corregir
└─ Estado: RECHAZADA

ENDOSO (END)
├─ Recibidor transfiere derechos
├─ Designa nuevo acreedor
├─ Cadena de custodia mantiene
└─ Estado: ENDOSADA
```

---

## 🔄 Matriz Completa Sujeto-Evento

### **Tabla 1: GENERACIÓN (GEN)**

```
┌─────────┬──────────┬─────────────┬──────────────────────┐
│ Sujeto  │ Rol      │ Acción      │ Resultado            │
├─────────┼──────────┼─────────────┼──────────────────────┤
│ E       │ EMISOR   │ Crea FE/NC/ │ Doc radicado en DIAN │
│         │          │ ND/Doc Sup  │ Notificación a R     │
│         │          │ → DIAN      │ Estado: PENDIENTE    │
├─────────┼──────────┼─────────────┼──────────────────────┤
│ R       │ -        │ NADA        │ No aplica            │
│         │          │ (recibe     │ (espera en DIAN)     │
│         │          │ después)    │                      │
├─────────┼──────────┼─────────────┼──────────────────────┤
│ T       │ -        │ NADA        │ No participa         │
│         │          │ (aún)       │ en generación        │
└─────────┴──────────┴─────────────┴──────────────────────┘
```

### **Tabla 2: RECEPCIÓN (REC)**

```
┌─────────┬──────────┬──────────────┬────────────────────────┐
│ Sujeto  │ Rol      │ Acción       │ Resultado              │
├─────────┼──────────┼──────────────┼────────────────────────┤
│ E       │ EMISOR   │ Valida que R │ Confirmación de envío  │
│         │          │ recibió      │ Timestamp en DIAN      │
├─────────┼──────────┼──────────────┼────────────────────────┤
│ R       │ RECIBIDOR│ Descarga y   │ Estado: RECIBIDA       │
│         │          │ valida       │ Puede proceder a       │
│         │          │ estructura   │ aceptar/rechazar       │
├─────────┼──────────┼──────────────┼────────────────────────┤
│ T       │ AUDITOR  │ Puede        │ Log de recepción       │
│ (opt)   │ (opt)    │ validar      │ para auditoría         │
└─────────┴──────────┴──────────────┴────────────────────────┘
```

### **Tabla 3: ACEPTACIÓN (ACE)**

```
┌─────────┬──────────────┬──────────────┬──────────────────────┐
│ Sujeto  │ Rol          │ Acción       │ Resultado            │
├─────────┼──────────────┼──────────────┼──────────────────────┤
│ E       │ EMISOR       │ Recibe ACE   │ Confirma validez     │
│         │              │ de R         │ Procede a contabl.   │
│         │              │              │ Crea obligación       │
├─────────┼──────────────┼──────────────┼──────────────────────┤
│ R       │ RECIBIDOR    │ Valida       │ Estado: ACEPTADA     │
│         │              │ completamente│ Firma y envía ACE    │
│         │              │ Firma y      │ Registra contable    │
│         │              │ responde     │ (pasivo = documento) │
├─────────┼──────────────┼──────────────┼──────────────────────┤
│ T       │ FACTOR       │ Puede        │ Autoriza endoso      │
│ (cond)  │ (cond)       │ autorizar    │ Participa desde aquí │
│         │              │ endoso       │                      │
└─────────┴──────────────┴──────────────┴──────────────────────┘
```

### **Tabla 4: ACEPTACIÓN CONDICIONAL (ACP)**

```
┌─────────┬──────────────┬────────────────┬──────────────────────┐
│ Sujeto  │ Rol          │ Acción         │ Resultado            │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ E       │ EMISOR       │ Recibe ACP     │ Debe resolver con R  │
│         │              │ de R           │ Puede:               │
│         │              │                │ a) Aceptar cambios   │
│         │              │                │ b) Rechazar (RCH)    │
│         │              │                │ c) No responder      │
│         │              │                │    (→ tácita en 30d) │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ R       │ RECIBIDOR    │ Especifica     │ Estado: ACP          │
│         │              │ condiciones    │ Espera respuesta E   │
│         │              │ Firma y envía  │ Plazo: hasta 30 días │
│         │              │ ACP            │                      │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ T       │ NEGOCIADOR   │ Puede          │ Mediación entre      │
│ (opt)   │ (opt)        │ participar en  │ E y R                │
│         │              │ resolución     │ Registra en RADIAN   │
└─────────┴──────────────┴────────────────┴──────────────────────┘
```

### **Tabla 5: RECHAZO (RCH)**

```
┌─────────┬──────────────┬────────────────┬──────────────────────┐
│ Sujeto  │ Rol          │ Acción         │ Resultado            │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ E       │ EMISOR       │ Recibe RCH     │ Debe:                │
│         │              │ de R           │ a) Emitir NC (si ok) │
│         │              │                │ b) Emitir FE nueva   │
│         │              │                │ c) Contactar R       │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ R       │ RECIBIDOR    │ Especifica     │ Estado: RECHAZADA    │
│         │              │ motivos        │ FE anulada           │
│         │              │ Firma RCH      │ No registra contable │
│         │              │ y envía        │                      │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ T       │ AUDITOR      │ Registra       │ Análisis de causa    │
│ (opt)   │ (opt)        │ razón del      │ raíz disponible      │
│         │              │ rechazo        │                      │
└─────────┴──────────────┴────────────────┴──────────────────────┘
```

### **Tabla 6: ENDOSO (END)**

```
┌─────────┬──────────────┬────────────────┬──────────────────────┐
│ Sujeto  │ Rol          │ Acción         │ Resultado            │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ E       │ EMISOR       │ Es notificado  │ Nuevo acreedor es R' │
│         │              │ de endoso      │ Debe pagar a R' no E │
│         │              │ (R→T)          │                      │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ R       │ CEDENTE      │ Transfiere     │ Crea ENDOSO          │
│         │              │ derechos a T   │ Monto: Total/Parcial │
│         │              │ Firma y envía  │ Autoriza nuevo pago  │
│         │              │                │ a T                  │
├─────────┼──────────────┼────────────────┼──────────────────────┤
│ T       │ CESIONARIO   │ Recibe y       │ Estado: ENDOSADA     │
│         │              │ acepta endoso  │ Nuevo acreedor       │
│         │              │ Valida         │ Puede cobrar directo │
│         │              │ autorización   │ o endosar nuevamente │
└─────────┴──────────────┴────────────────┴──────────────────────┘
```

---

## 🔀 Transiciones de Estado Válidas

```
                    GENERACIÓN
                        │
                        ├──→ RECEPCIÓN
                        │
                        └──→ PENDIENTE_RESPUESTA (máx 30 días)
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
            ACEPTADA    ACEPTACION_       RECHAZADA
            (ACE)       CONDICIONAL
                        (ACP)
                │              │              │
                │              │              └──→ FIN (Anulada)
                │              │
                │              ├─→ ACEPTADA (si E resuelve)
                │              └─→ RECHAZADA (si E no resuelve)
                │
                └──→ ENDOSADA (END)
                       │
                       └──→ Circulación entre T...
                           (puede endosarse nuevamente)
```

---

## 📊 Matriz de Responsabilidades

```
┌──────────────┬─────────┬─────────┬─────────┐
│ Acción       │ Emisor  │ Recibidor│ Tercero │
├──────────────┼─────────┼─────────┼─────────┤
│ Generar      │ ✅      │ ❌      │ ❌      │
│ Validar      │ ✅      │ ✅      │ ⭐      │
│ Aceptar      │ ❌      │ ✅      │ ❌      │
│ Rechazar     │ ❌      │ ✅      │ ❌      │
│ Cond.Accept  │ ❌      │ ✅      │ ❌      │
│ Resolver ACP │ ✅      │ ❌      │ ⭐      │
│ Endosar      │ ✅      │ ✅      │ ✅      │
│ Recibir End. │ ❌      │ ✅      │ ✅      │
│ Pagar        │ ❌      │ ✅      │ ✅      │
│ Auditar      │ ⭐      │ ⭐      │ ✅      │
└──────────────┴─────────┴─────────┴─────────┘

✅ = Responsable principal
⭐ = Puede participar (opcional)
❌ = No aplica
```

---

## 🎯 Escenarios Complejos

### Escenario 1: Comprador → Factor → Nuevo Factor

```
ORIGINAL:
  E (Vendedor) ──FE──→ R (Comprador)
  
PRIMER ENDOSO:
  R (Cedente) ──END1──→ T1 (Factor A)
  
SEGUNDO ENDOSO:
  T1 (Ahora Cedente) ──END2──→ T2 (Factor B)

MATRIZ DE EVENTOS:
┌─────┬──────┬────────┬────────┬────────┐
│Evt  │ E    │ R      │ T1     │ T2     │
├─────┼──────┼────────┼────────┼────────┤
│GEN  │ ✅   │ -      │ -      │ -      │
│REC  │ ✅   │ ✅     │ -      │ -      │
│ACE  │ ✅   │ ✅     │ -      │ -      │
│END1 │ ✅   │ ✅     │ ✅     │ -      │
│END2 │ ✅   │ ✅     │ ✅     │ ✅     │
└─────┴──────┴────────┴────────┴────────┘

RESPONSABILIDADES FINALES:
- E: Paga a T2 (último cesionario)
- R: Cedió derechos
- T1: Fue intermediario
- T2: Acreedor final
```

### Escenario 2: Endoso Parcial Múltiple

```
ORIGINAL:
  E ──FE: $10M──→ R

ENDOSOS:
  R ──END1: $4M──→ T1 (Factor A)
  R ──END2: $3M──→ T2 (Factor B)
  R ──END3: $3M──→ Retiene para sí

MATRIZ:
┌────────┬────────┬────────┬────────┬────────┐
│ Monto  │ E      │ R      │ T1     │ T2     │
├────────┼────────┼────────┼────────┼────────┤
│$4M     │ Acreedor│Cedente │Cesion.│ -      │
│$3M     │ Acreedor│Cedente │ -     │Cesion. │
│$3M     │ Acreedor│Cedente │ -     │ -      │
└────────┴────────┴────────┴────────┴────────┘

PAGOS RESULTANTES:
- T1 cobra: $4M
- T2 cobra: $3M
- E cobra: $3M (retención)
- Total: $10M distribuido
```

### Escenario 3: Aceptación Condicional Resuelta

```
PASO 1: E genera FE
  ├─ Monto: $5M
  ├─ Plazo: 30 días
  └─ Notifica a R

PASO 2: R recibe y rechaza parcialmente
  ├─ Envía ACP
  ├─ Condición: "Plazo debe ser 45 días"
  └─ Espera respuesta de E

PASO 3: E resuelve positivamente
  ├─ Acepta nuevo plazo
  ├─ Emite ND de ajuste
  └─ Envía confirmación

PASO 4: R valida resolución
  ├─ Recibe ND
  ├─ Envía ACE a ND
  └─ FE se normaliza

MATRIZ DE EVENTOS:
┌─────┬──────┬────────┐
│Evt  │ E    │ R      │
├─────┼──────┼────────┤
│GEN  │ ✅   │ -      │
│REC  │ -    │ ✅     │
│ACP  │ ✅   │ ✅     │
│RES  │ ✅   │ -      │
│ACE  │ -    │ ✅     │
└─────┴──────┴────────┘

ESTADO FINAL: ACEPTADA
```

---

## 🔐 Restricciones y Validaciones

```
┌──────────────────────────────────────────────────────┐
│           RESTRICCIONES OBLIGATORIAS                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 1. GENERACIÓN                                        │
│    └─ Solo E puede generar                           │
│    └─ Debe incluir firma digital de E                │
│    └─ DIAN valida estructura                         │
│                                                      │
│ 2. RECEPCIÓN                                         │
│    └─ Solo R puede confirmar recepción               │
│    └─ Dentro de 30 días                              │
│    └─ Debe descargar de DIAN                         │
│                                                      │
│ 3. ACEPTACIÓN                                        │
│    └─ Solo R puede aceptar                           │
│    └─ Firma digital obligatoria                      │
│    └─ Crea obligación inmediata                      │
│                                                      │
│ 4. RECHAZO                                           │
│    └─ Solo R puede rechazar                          │
│    └─ Debe especificar motivo                        │
│    └─ Documento anulado automáticamente              │
│                                                      │
│ 5. ACEPTACIÓN CONDICIONAL                            │
│    └─ Solo R puede hacer ACP                         │
│    └─ E tiene 30 días para responder                 │
│    └─ Después: ACP se convierte en ACE (tácita)      │
│                                                      │
│ 6. ENDOSO                                            │
│    └─ Requiere FE ACE primero                        │
│    └─ Cedente es siempre R anterior                  │
│    └─ Cesionario es nuevo acreedor                   │
│    └─ E es notificado obligatoriamente               │
│    └─ Endoso es irrevocable                          │
│                                                      │
│ 7. CADENA DE ENDOSOS                                 │
│    └─ Cada endoso referencia anterior                │
│    └─ Trazabilidad completa mantenida                │
│    └─ Pago va al último cesionario                   │
│    └─ Historial auditable                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🎓 Tabla de Decisiones para Recibidor

```
┌─────────────────────────────────────────────────────────┐
│              ÁRBOL DE DECISIÓN RECIBIDOR                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ¿DOCUMENTO OK COMPLETAMENTE?                           │
│     │                                                   │
│     ├─ SI:  ┌─→ FIRMAR Y ENVIAR ACE                     │
│     │       └─→ Estado: ACEPTADA ✅                     │
│     │                                                   │
│     └─ NO:  ¿TIENE PROBLEMAS GRAVES?                    │
│             │                                           │
│             ├─ SI (Factura duplicada, precio total,  │
│             │      cantidad radicalmente diferente):    │
│             │  ┌─→ FIRMAR Y ENVIAR RCH                  │
│             │  └─→ Estado: RECHAZADA ❌                 │
│             │                                           │
│             └─ NO (Pequeña discrepancia,              │
│                   puede resolverse):                    │
│                ┌─→ FIRMAR Y ENVIAR ACP                  │
│                ├─→ Especificar condiciones               │
│                └─→ Estado: ACP (espera resolución)      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 Estadísticas de Transiciones

```
De 6 eventos principales:

GENERACIÓN → RECEPCIÓN:     100% (obligatorio)
RECEPCIÓN → RESPUESTA:      100% (plazo 30 días)
RESPUESTA:
  ├─ ACE:                   ~60% (casos normales)
  ├─ RCH:                   ~15% (problemas graves)
  └─ ACP:                   ~25% (discrepancias menores)

ACEPTADA → ENDOSO:          ~30% (según financiamiento)
ENDOSO → NUEVA CESIÓN:      ~10% (secundarias)

TOTAL CAMINOS POSIBLES:     8+ combinaciones válidas
```

---

**Última actualización:** Octubre 2025  
**Versión:** 2.0 (Resolución 000198/2024)  
**Referencia DIAN:** Matriz Sujeto-Evento-Rol, Anexo Técnico RADIAN
