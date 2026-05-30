# Test Certificate — MATIAS API Sandbox

## Resumen

El sandbox emite automáticamente un **certificado de prueba (Test Cert)** para cada empresa nueva. Este certificado es **estructuralmente equivalente** a un certificado real emitido por una CA autorizada por ONAC, pero está emitido por nuestra CA simulada `MATIAS SANDBOX TEST CA`.

## Especificaciones

| Atributo | Valor |
|---|---|
| Formato | PKCS#12 (`.p12`) |
| Versión X.509 | v3 |
| Algoritmo | `sha256WithRSAEncryption` |
| Tamaño llave | RSA 2048 bits |
| Issuer | `CN=MATIAS SANDBOX TEST CA, O=MATIAS API, OU=Sandbox, C=CO` |
| Subject | `CN={NIT}{DV}, O={razón_social}, OU=Persona Juridica, C=CO` |
| Validez | 1 año desde la generación |
| KeyUsage | `digitalSignature`, `nonRepudiation`, `keyEncipherment` |
| Passphrase | Única por empresa (consultar vía `GET /certificate`) |

## Comportamiento

### Asignación automática

El Test Cert se asigna automáticamente cuando:
1. Se crea una nueva empresa en el sandbox
2. Se ejecuta el `SandboxDemoSeeder` (uso interno)

### Endpoints `/certificate/*`

Todos los endpoints de certificado funcionan **idénticos a producción**:

| Endpoint | Sandbox |
|---|---|
| `POST /certificate` | Puedes subir tu propio `.p12` (funciona igual) |
| `GET /certificate` | Devuelve metadata + passphrase del Test Cert |
| `GET /certificate/expiration/{dni}` | Expiración real del Test Cert |
| `PUT /certificate/{id}` | Actualizar (funciona igual) |
| `DELETE /certificate/{id}` | Eliminar (funciona igual) |

### Firma XMLDSig

El XML firmado con el Test Cert tiene una firma **estructuralmente válida**:
- `SignedInfo`, `SignatureValue`, `KeyInfo`, `X509Data` correctamente poblados
- Cualquier validador XSD UBL 2.1 lo aceptará
- DIAN lo rechazaría (la CA no encadena a ONAC) — exactamente el comportamiento deseado

### Tipos de documento soportados

El Test Cert se usa para firmar **todos** los tipos de documento electrónico en el sandbox:

| Tipo | Endpoint |
|---|---|
| Factura electrónica | `POST /invoice` |
| Nota crédito | `POST /notes/credit` |
| Nota débito | `POST /notes/debit` |
| Documento soporte | `POST /ds/document` |
| Nota de ajuste DS | `POST /ds/adjustment-note` |
| Nómina electrónica | `POST /ep/payroll` |
| Reemplazo de nómina | `POST /ep/payroll/replace` |
| Eliminación de nómina | `POST /ep/payroll/delete` |
| Factura auto-increment | `POST /auto-increment/invoices` |
| NC auto-increment | `POST /auto-increment/credit-notes` |
| ND auto-increment | `POST /auto-increment/debit-notes` |
| DS auto-increment | `POST /auto-increment/support-documents` |
| Ajuste auto-increment | `POST /auto-increment/adjustment-notes` |
| POS auto-increment | `POST /auto-increment/pos-documents` |

## Red de seguridad

El `CertificateFingerprintGuard` previene que un Test Cert se use en producción:
- Verifica fingerprint SHA-256 contra `storage/sandbox/pki/fingerprints.json`
- Verifica que el `issuer.CN` no contenga `MATIAS SANDBOX TEST CA`
- Si se detecta en producción → `RuntimeException` antes de firmar

## CA Pública

La CA de prueba está disponible para descarga:

```
{{SANDBOX_URL}}/pki/test-ca.crt
```

Puedes añadirla a tu truststore local para validar firmas del sandbox.

## Magic Values de Certificado

| Header | Efecto |
|---|---|
| `X-Sandbox-Force-Status: CERT_EXPIRED` | Simula certificado expirado |
| `X-Sandbox-Force-Status: CERT_NEAR_EXPIRY` | Cert con validez de +5 días |
