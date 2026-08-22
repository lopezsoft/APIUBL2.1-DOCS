---
sidebar_position: 4
title: Colección Postman
description: Colección de 43 requests listas para usar y probar la integración en el sandbox.
---

# 📮 Colección Postman — MATIAS API Sandbox {#postman-sandbox}

Para acelerar la integración técnica y las pruebas de comportamiento en el sandbox, disponemos de una **Colección Postman oficial con 43 solicitudes** preconfiguradas que cubren tanto el flujo exitoso (*happy path*) como todos los escenarios de error simulables (*Magic Values*).

---

## 📥 Descarga e Importación {#descarga-importacion}

<div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1.5rem 0'}}>
  <a href="https://documenter.getpostman.com/view/8699065/2s9YyvBLby" target="_blank" rel="noopener noreferrer" className="button button--warning button--lg">
    📮 Ver Documentación Interactiva en Postman
  </a>
  <a href="/sandbox-quickstart.postman_collection.json" download className="button button--secondary button--lg">
    ⬇️ Descargar Archivo JSON de Colección
  </a>
</div>

### Pasos para importar en Postman:
1. Abre tu aplicación Postman (Web o Desktop).
2. Haz clic en **Import** (esquina superior izquierda).
3. Arrastra o selecciona el archivo `sandbox-quickstart.postman_collection.json`.
4. Selecciona el Environment de Sandbox y comienza a realizar tus peticiones.

---

## 📁 Estructura de la Colección (43 Requests) {#estructura-coleccion}

La colección se encuentra estructurada en **11 carpetas lógicas**:

| Carpeta | Requests | Descripción |
|---|:---:|---|
| **1. Producción** | 1 | Registro de cuenta en ambiente productivo. |
| **2. Sandbox — Auth** | 2 | Login y generación de tokens de acceso (PAT) para el Sandbox. |
| **3. Sandbox — Facturación** | 14 | Happy Path y **13 simulaciones de error (Magic Values)** para facturas. |
| **4. Sandbox — PDF & Status** | 3 | Consulta asíncrona de estado, descarga de PDF y metadatos. |
| **5. Sandbox — Notas Crédito/Débito** | 2 | Pruebas de notas y validaciones de fechas desfasadas. |
| **6. Sandbox — Documento Soporte** | 2 | Documento Soporte electrónico y tributos no permitidos. |
| **7. Sandbox — Nómina Electrónica** | 3 | Simulación de nómina, CUNE alterado y validación territorial. |
| **8. Sandbox — Auto-Increment** | 2 | Pruebas de emisión con series y consecutivos automáticos. |
| **9. Sandbox — POS Electrónico** | 5 | Documento Equivalente POS y notas de ajuste (NC/ND). |
| **10. Sandbox — DS No Residente** | 2 | Documentos Soporte y notas para proveedores del exterior. |
| **11. Sandbox — Eventos RADIAN** | 7 | Envío y consulta de eventos de factura (030, 031, 032, 033). |

---

## ⚙️ Variables de Entorno Recomendadas {#variables-entorno}

Configura un **Environment** en Postman con las siguientes variables para operar de forma dinámica:

| Variable | Tipo | Valor Sugerido | Descripción |
|:---|:---|:---|:---|
| `url` | default | `https://api-v2.matias-api.com/api/ubl2.1` | URL base de producción. |
| `sandbox_url` | default | `https://sandbox-api.matias-api.com/api/ubl2.1` | URL base del Sandbox. |
| `access_token` | secret | `eyJ...` | Token JWT obtenido en `/auth/login`. |
| `pat_token` | secret | `1\|eyJ...` | Personal Access Token (PAT) persistente. |

:::tip Scripts Automatizados en Tests
La colección incluye scripts en la pestaña **Tests** del Login y Creación de PAT que extraen y guardan automáticamente los tokens en tus variables de entorno para que no tengas que copiarlos manualmente.
:::
