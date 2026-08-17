---
sidebar_position: 3
title: Test Certificate
description: Certificado de prueba autogenerado para firmar documentos digitalmente en el sandbox.
---

# Test Certificate — MATIAS API Sandbox

Para facilitar el desarrollo, el entorno sandbox emite de forma automática un **certificado digital de prueba (Test Cert)** único para cada empresa que se registre en la plataforma. 

Este certificado es **estructuralmente equivalente** a un certificado de firma real emitido por una entidad de certificación abierta (CA) acreditada ante la ONAC en Colombia, pero está firmado bajo nuestra CA interna y simulada de desarrollo.

---

## Especificaciones Técnicas

| Atributo / Campo | Valor Técnico de Prueba |
|:---|:---|
| **Formato** | PKCS#12 (`.p12` / binario) |
| **Versión X.509** | v3 |
| **Algoritmo de firma** | `sha256WithRSAEncryption` |
| **Tamaño de Llave** | RSA 2048 bits |
| **Issuer (Emisor)** | `CN=MATIAS SANDBOX TEST CA, O=MATIAS API, OU=Sandbox, C=CO` |
| **Subject (Sujeto)** | `CN={NIT}{DV}, O={razón_social}, OU=Persona Juridica, C=CO` |
| **Validez** | 1 año a partir del momento de generación |
| **Uso de Llave (Key Usage)** | `digitalSignature`, `nonRepudiation`, `keyEncipherment` |
| **Clave de Acceso (Passphrase)**| Única por empresa (consúltala dinámicamente vía `GET /certificate`) |

---

## Comportamiento del Certificado

### 1. Auto-Asignación
El certificado de pruebas se genera y asocia a tu cuenta automáticamente en dos escenarios:
*   Al crear una nueva cuenta/empresa a través del endpoint de registro del sandbox.
*   Al ejecutar seeders de inicialización rápida en tu ambiente aislado.

### 2. Ciclo de Vida Homologado
Todos los endpoints de gestión de certificados se comportan de forma **exactamente idéntica a producción**:

| Endpoint API | Comportamiento en Sandbox |
|:---|:---|
| `POST /certificate` | Permite subir tu propio archivo de firma `.p12` de prueba. |
| `GET /certificate` | Devuelve la metadata completa y la passphrase del certificado activo. |
| `GET /certificate/expiration/{dni}` | Expone el cálculo de expiración real del Test Cert asignado. |
| `PUT /certificate/{id}` | Permite actualizar la firma digital asociada. |
| `DELETE /certificate/{id}` | Desvincula el certificado asignado. |

### 3. Tipos de Documento Firmados
El certificado digital de prueba se utiliza de forma automática para firmar criptográficamente **todas** las tipologías de documentos electrónicos enviadas al sandbox:

| Tipo de Documento Electrónico | Endpoint del API de Pruebas |
|:---|:---|
| Factura electrónica estándar / Salud (Res. 000948/2026) | `POST /invoice` |
| Documento Equivalente POS Electrónico | `POST /pos` |
| Nota crédito electrónica (estándar / salud) | `POST /notes/credit` |
| Nota débito electrónica | `POST /notes/debit` |
| Documento soporte electrónico | `POST /ds/document` |
| Nota de ajuste a Documento Soporte | `POST /ds/adjustment-note` |
| Nómina electrónica individual | `POST /ep/payroll` |
| Reemplazo de nómina electrónica | `POST /ep/payroll/replace` |
| Eliminación/Anulación de nómina | `POST /ep/payroll/delete` |
| Factura auto-incrementable | `POST /auto-increment/invoices` |
| NC auto-incrementable | `POST /auto-increment/credit-notes` |
| ND auto-incrementable | `POST /auto-increment/debit-notes` |
| DS auto-incrementable | `POST /auto-increment/support-documents` |
| Nota de ajuste auto-incrementable | `POST /auto-increment/adjustment-notes` |
| POS equivalente auto-incrementable | `POST /auto-increment/pos-documents` |

---

## Firma Estructural (XMLDSig)

El XML resultante de la firma digital con el Test Cert del sandbox cuenta con todas las estructuras criptográficas requeridas:
*   Bloques `SignedInfo`, `SignatureValue`, `KeyInfo` y `X509Data` correctamente poblados.
*   Pasa de forma exitosa cualquier validador de esquemas XSD de la especificación UBL 2.1 de la DIAN.
*   :::info Rechazo DIAN
    Cualquier envío de este XML a servidores reales de la DIAN resultará en un rechazo inmediato debido a que la CA de emisión (`MATIAS SANDBOX TEST CA`) no forma parte de la cadena oficial de certificación digital ONAC.
    :::

---

## Red de Seguridad en Producción

Para garantizar que un certificado de pruebas del sandbox nunca sea transmitido por error a ambientes reales y productivos de la DIAN, el gateway de producción de MATIAS API cuenta con una capa de seguridad activa llamada `CertificateFingerprintGuard`:

:::caution Protección Activa
*   **Validación de Huella:** Valida la firma del certificado mediante una base de datos local de huellas SHA-256 de desarrollo (`fingerprints.json`).
*   **Verificación de CN:** Examina que el atributo `issuer.CN` no coincida con el nombre `MATIAS SANDBOX TEST CA`.
*   **Bloqueo Preventivo:** Si el emisor o la firma corresponden al Test Cert en una llamada productiva, el API arrojará inmediatamente una excepción `RuntimeException` de seguridad, cancelando el envío del documento.
:::

---

## Descarga de la CA de Pruebas

Si tu software o validador local de firmas requiere incorporar nuestra CA simulada al truststore para validar la firma de los documentos que recibes en el sandbox, puedes descargar el archivo de certificado raíz libremente:

```http
{{SANDBOX_URL}}/pki/test-ca.crt
```
