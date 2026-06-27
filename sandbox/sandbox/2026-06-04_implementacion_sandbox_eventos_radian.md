# Implementación Sandbox — Eventos RADIAN

**Fecha:** 2026-06-04  
**Contexto:** Los endpoints de eventos RADIAN (`/api/ubl2.1/events/*`) realizaban llamadas SOAP directas a la DIAN sin guards sandbox, causando errores en el entorno sandbox.

---

## Problema

El sistema de eventos RADIAN NO usaba la interfaz `DianTransmitterInterface` ni el patrón `FakeDianTransmitter`. En su lugar, instanciaba clases SOAP directamente:

- `SendEvent` → Envío de eventos a DIAN
- `GetStatusEvents` → Consulta de estado de eventos
- `GetXmlByDocumentKey` → Obtención de XML de documentos

En sandbox, estas llamadas fallaban porque no hay servicio DIAN real disponible.

---

## Solución

Se aplicó el patrón `SandboxResponseFactory` (ya usado en facturas, notas y nómina) a los 3 servicios SOAP de eventos.

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `app/Services/Sandbox/SandboxResponseFactory.php` | +3 métodos públicos: `sendEventResponse()`, `getStatusEventsResponse()`, `getXmlByDocumentKeyResponse()`. +1 helper privado: `buildEventResult()` |
| `app/Services/Events/EventDeliveryService.php` | Guard sandbox en `send()` — simula respuesta ACCEPTED, actualiza EventMaster, incrementa consumo |
| `app/Services/Events/DocumentReceptionService.php` | Guard sandbox en `getEventStatus()` — retorna respuesta simulada de estado |
| `app/Services/Xml/XmlExtractDataService.php` | Guard sandbox en `getXml()` — retorna XML UBL 2.1 simulado con datos de proveedor, medio de pago y totales |
| `tests/postman/sandbox-quickstart.postman_collection.json` | +Folder "11. Eventos RADIAN" con 7 requests |

### Cobertura de guards

| Llamada SOAP | Servicio | Guard |
|---|---|---|
| `SendEvent` (envío de evento) | `EventDeliveryService::send()` | ✅ Nuevo |
| `GetStatusEvents` (estado) | `DocumentReceptionService::getEventStatus()` | ✅ Nuevo |
| `GetXmlByDocumentKey` (XML) | `XmlExtractDataService::getXml()` | ✅ Nuevo |
| `SendReceptionEventJob` (job scheduled) | `Jobs/Events/SendReceptionEventJob` | ✅ Ya existía |

### Endpoints disponibles en sandbox

| Método | Ruta | Función |
|---|---|---|
| `POST` | `/events/import-track-id` | Importar documento por CUFE |
| `POST` | `/events/import-excel` | Importar desde Excel |
| `POST` | `/events/{trackId}/import` | Importar por trackId (alt) |
| `GET` | `/events/document-receptions` | Listar recepciones |
| `GET` | `/events/document-receptions/{id}` | Eventos por documento |
| `POST` | `/events/send/{trackId}` | Enviar evento a DIAN |
| `GET` | `/events/status/{trackId}` | Estado del evento |
| `POST` | `/events/send/mail/{trackId}` | Reenviar correo de evento |
| `DELETE` | `/events/document-receptions/{id}` | Eliminar recepción |

---

## XML Simulado (`getXmlByDocumentKeyResponse`)

El mock retorna un Invoice UBL 2.1 mínimo pero funcional con:

- `AccountingSupplierParty` → NIT, razón social, dirección, contacto
- `PaymentMeans` → ID=2 (crédito, para que no sea filtrado como contado)
- `LegalMonetaryTotal` → Totales con `PayableAmount = 119000.00`
- `InvoiceTypeCode` → 01 (factura electrónica)

Esto permite que `ImportReceptionJob` y `EventMasterService::createDocument()` procesen el XML completo sin errores.

---

## Commit sugerido

```
feat(sandbox): add RADIAN events sandbox guards with SandboxResponseFactory

- Guard SendEvent SOAP in EventDeliveryService
- Guard GetStatusEvents SOAP in DocumentReceptionService  
- Guard GetXmlByDocumentKey SOAP in XmlExtractDataService
- Add sendEventResponse(), getStatusEventsResponse(), getXmlByDocumentKeyResponse() to SandboxResponseFactory
- Add "11. Eventos RADIAN" folder to Postman collection (7 requests)
```
