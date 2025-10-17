---
sidebar_position: 2
---

# Endpoints

## Introducción a los Endpoints de la API

Los endpoints son las URL que se utilizan para acceder a los recursos de la API. 
Cada endpoint es un punto de acceso a la API que puede devolver datos o realizar operaciones en el servidor.

La API cuenta con dos tipos de endpoints: **Públicos y Privados.**

## Endpoints Públicos
 - Los endpoints públicos son aquellos que no requieren autenticación para ser accedidos.
 - Estos endpoints son utilizados para obtener información de la API, como por ejemplo, token de acceso para los endpoints privados.
 - Todas las solicitudes a los endpoints públicos de las tablas referenciadas de la DIAN retornan un objeto de tipo JSON con la siguiente estructura.
```json
{
    "dataRecords": {
        "data": [
            {
                "id": 1,
                "code": 1,
                "environment_name": "Producción"
            },
            {
                "id": 2,
                "code": 2,
                "environment_name": "Pruebas"
            }
        ]
    },
    "success": true
}
```

Donde ``dataRecords`` es el objeto que contiene la información de la tabla referenciada,
``data`` es el arreglo de objetos que contiene la información de la tabla referenciada y ``success`` es el estado de la petición.

## Tablas Referenciadas DIAN. Todas las peticiónes de este tipo de endpoints son ``GET``.
### Documentos electrónicos.
- #### Ambiente de destino de los documentos electrónicos: ``cbc:ProfileExecutionID y cbc:UUID.@schemeID``
 ```http
{{url}}/destination-environment
```
- #### Condiciones de entrega (INCOTERMS)-``LossRiskResponsibilityCode``
```http
{{url}}/delivery-conditions
```
- #### Tipo de correcciones aplicables a las notas contables: 
 Concepto de Corrección para Notas crédito y Notas débito  cac DiscrepancyResponse cbc ResponseCode.
 ```http
{{url}}/correction-notes
```
- #### Códigos de descuentos: 
  Códigos de descuento y recargos
 ```http
{{url}}/discount-codes
```
- #### Tipos de Documentos: Factura, Nota Crédito, Nota Débito, etc. ``cbc:InvoiceTypeCode y cbc:CreditnoteTypeCode``
 ```http
{{url}}/document-type
```
- #### Tipos de operación: Exportación, Nacional, etc. ``cbc:InvoiceTypeCode y cbc:CreditnoteTypeCode``
 ```http
{{url}}/operation-type
```
- #### Documentos de identificación
 ```http
{{url}}/identity-documents
```
- #### Tributos - Impuestos
 ```http
{{url}}/taxes
```
- #### Rango de impuestos
 ```http
{{url}}/tax-rates
```
- #### Tipo de organización
 ```http
{{url}}/organization-type
```
- #### Régimen Fiscal - Responsabilidades fiscales
 ```http
{{url}}/fiscal-regime
```
- #### Régimen contable
 ```http
{{url}}/accounting-regime
```
- #### Unidades de cantidad
 ```http
{{url}}/quantity-units
```
- #### Tipo de identificación del ITEM de cada línea del documento electrónico.
 ```http
{{url}}/type-item-identifications
```
- #### Referencia de precios
 ```http
{{url}}/reference-price
```
- #### Métodos de pago
 ```http
{{url}}/payment-methods
```
- #### Medios de pago
 ```http
{{url}}/payment-means
```
- #### Ciudades
 ```http
{{url}}/cities
```
- #### Departamentos
 ```http
{{url}}/departments
```
- #### Países
 ```http
{{url}}/countries
```
- #### Monedas
 ```http
{{url}}/currencies
```
### Nómina electrónica.
- #### Tipo de ajuste a la nota de ajuste
 ```http
{{url}}/ep/adjustment-note-type
```
- #### Tipo de contrato
 ```http
{{url}}/ep/contract-type
```
- #### Tipo de discapacidad
 ```http
{{url}}/ep/disability-type
```
- #### Horas extras
 ```http
{{url}}/ep/extra-hours
```
- #### Periodicidad de la nómina
 ```http
{{url}}/ep/payroll-period
```
- #### Tipo de trabajo
 ```http
{{url}}/ep/worker-type
```
- #### Subtipo de trabajo
 ```http
{{url}}/ep/worker-subtype
```
## Autenticación
### Autenticación de usuario
- #### Iniciar sesión. Tipo de petición: ``POST``
 ```http
 {{url}}/auth/login
```
## Endpoints Privados
Los endpoints privados son aquellos que requieren autenticación para ser accedidos.
Estos endpoints son utilizados para realizar operaciones en la API, como por ejemplo, realizar el envío de una: **factura, un email u otro tipo de operación**.
### Autenticación
#### Autenticación de usuario
- #### Cerrar sesión. Tipo de petición: ``GET``
 ```
{{url}}/auth/logout
```
### Facturación electrónica
Este endpoint es utilizado para enviar documentos electrónicos a la DIAN, de tipo:  
**Factura nacional y de exportación, Sector salud, Compra y venta de divisas, D.E POS**.
- #### Enviar factura. Tipo de petición: ``POST``
 ```http
{{url}}/invoice
```
### Nota crédito electrónica
Este endpoint es utilizado para enviar notas crédito a la DIAN, de tipo: 
**Factura nacional y de exportación, Sector salud, Compra y venta de divisas, D.E POS**.
- #### Enviar nota crédito. Tipo de petición: ``POST``
 ```http
{{url}}/notes/credit
```
### Nota débito electrónica
Este endpoint es utilizado para enviar notas débito a la DIAN, de tipo: **Factura nacional y de exportación, Sector salud, Compra y venta de divisas, D.E POS**.
- #### Enviar nota débito. Tipo de petición: ``POST``
 ```http
{{url}}/notes/debit
```
### Nómina electrónica
Este endpoint es utilizado para enviar nóminas electrónicas a la DIAN.

- #### Enviar nómina. Tipo de petición: ``POST``
 ```http
{{url}}/ep/payroll
```
### Nota de ajuste electrónica de remplazo (Nómina)
Este endpoint es utilizado para enviar notas de ajuste electrónicas de remplazo a la DIAN.
- #### Enviar nota de ajuste. Tipo de petición: ``POST``
 ```http
{{url}}/ep/payroll/replace
```
### Nota de ajuste electrónica de eliminación (Nómina)
Este endpoint es utilizado para enviar notas de ajuste electrónicas de eliminación a la DIAN.
- #### Enviar nota de ajuste. Tipo de petición: ``POST``
 ```http
{{url}}/ep/payroll/delete
```
### Documento soporte para no obligados a facturar
Este endpoint es utilizado para enviar documentos soporte para no obligados a facturar a la DIAN. Para residentes y no residentes.
- #### Enviar documento soporte. Tipo de petición: ``POST``
 ```http
{{url}}/ds/document
```
### Nota de ajuste para el documento soporte
Este endpoint es utilizado para enviar notas de ajuste para el documento soporte a la DIAN. Para residentes y no residentes.
- #### Enviar nota de ajuste. Tipo de petición: ``POST``
 ```http
{{url}}/ds/adjustment-note
```
## Documentos
### Búsqueda de documentos electrónicos
Este endpoint es utilizado para buscar en los documentos generados por la API.
- #### Buscar documentos. Tipo de petición: ``GET``
 ```http
{{url}}/documents?order_number=251956&query=&limit=1&resolution=&number=&prefix=
```
Para realizar la búsqueda de documentos se pueden utilizar los siguientes parámetros, los cuales se pueden utilizar en cualquier combinación(**opcionales**):
- #### Parámetros de búsqueda
```json
{
    "order_number": "Número de orden",
    "number": "Número de documento",
    "query": "Texto de búsqueda",
    "limit": "Número de registros a traer",
    "resolution": "Resolución de facturación",
    "prefix": "Prefijo de la resolución",
    "start_date": "Fecha de inicio: Fecha en la que se desea comenzar a buscar",
    "end_date": "Fecha de fin: Fecha en la que se desea terminar de buscar",
    "document_key": "Código del documento(CUFE,CUDE)",
    "document_type": "Tipo de documento",
    "document_status": "Estado del documento: -1: Indiferente, 0: Documento sin validar, 1: Documento validado correctamente",
}
```
### Último documento generado
Este endpoint es utilizado para obtener el último documento generado por la API.
- #### Último documento. Tipo de petición: ``GET``
 ```http
{{url}}/documents/last?resolution=18764074347312&prefix=LZT
```
Para obtener el último documento generado se deben enviar los siguientes parámetros:
- #### Parámetros de búsqueda
```json
{
    "resolution": "Resolución de facturación",
    "prefix": "Prefijo de la resolución"
}
```
### Consumo de documentos
Este endpoint es utilizado para consultar el consumo de documentos generados por la API.
- #### Consumo de documentos. Tipo de petición: ``GET``
 ```http
{{url}}/documents/consume?p_year=2024&p_type=4&p_dni=901091403
```
Para  obtener el consumo de documentos se deben enviar los siguientes parámetros:
- #### Parámetros de búsqueda
```json
{
    "p_year": "2024",
    "p_type": "1",
    "p_dni": "452121"
}
```
Descripción de los parámetros:
- **p_year**: Año de consumo.
- **p_dni**: DNI del cliente.
- **p_type**: Tipo de solicitud. 
  - 1: Consumo agrupado por mes y año, por cuenta desarrollador.
  - 2: Consumo agrupado por año, por cuenta desarrollador.
  - 3: Consumo agrupado por mes y año de cada cliente, por cuenta desarrollador.
  - 4: CConsumo agrupado por año de cada cliente, por cuenta desarrollador.
  - 5: Consumo agrupado por mes y año de cada cliente.
  - 6: Consumo agrupado por mes y año de cada cliente por tipo de documento
### Descargar PDF del documento
Este endpoint es utilizado para descargar el PDF del documento generado por la API.
- #### Descargar PDF. Tipo de petición: ``GET``
 ```http
{{url}}/documents/pdf/{trackId}
```
Donde ``trackId`` es el código único de factura electrónica o documento soporte(**CUFE, CUDE**).
Para descargar el PDF del documento se debe enviar el ``trackId`` del documento generado.
- #### Parámetros de búsqueda
```json
{
    "regenerate": "Cuando es 1 le indica al API que debe reescribir representación grafica. Por defecto es 0"
}
```
### Descargar XML del documento
Este endpoint es utilizado para descargar el XML del documento generado por la API.
- #### Descargar XML. Tipo de petición: ``GET``
 ```http
{{url}}/documents/xml/{trackId}
```
Donde ``trackId`` es el código único de factura electrónica o documento soporte (**CUFE, CUDE**).
Para descargar el XML del documento se debe enviar el ``trackId`` del documento generado.

### Descargar ATTACHED del documento
Este endpoint es utilizado para descargar el attachment del documento generado por la API.
- #### Descargar ATTACHED. Tipo de petición: ``POST``
 ```http
{{url}}/documents/attached/{trackId}
```
Donde ``trackId`` es el código único de factura electrónica o documento soporte (**CUFE, CUDE**).
Para descargar el PDF del documento se debe enviar el ``trackId`` del documento generado.
- #### Parámetros de búsqueda
```json
{
    "regenerate": "Cuando es 1 le indica al API que debe reescribir representación grafica. Por defecto es 0"
}
```
## Estado de documentos ``NEW``
Este endpoint es utilizado para consultar el estado de los documentos generados por la API y la DIAN.
- ### ZIP - Estado del documento en la DIAN en modo de pruebas
Este endpoint es utilizado para consultar el estado de los documentos en la DIAN en modo de pruebas.
  - #### Estado del documento. Tipo de petición: ``GET``
     ```https
    {{url}}/status/zip/53405404-0696-4418-9b76-7e63d7943bd0
    ```
    - #### Parámetros de búsqueda
    ```json
    {
        "trackId": "Código único de factura electrónica o documento soporte (CUFE, CUDE)"
    }
    ```

- ### Estado del documento en la DIAN en producción
Este endpoint es utilizado para consultar el estado de los documentos en la DIAN en producción.
  - #### Estado del documento. Tipo de petición: ``GET``
     ```https
    {{url}}/status/document/6b0f76c1d3f9b783602c5e46a0dd2a0d833e01f4f969e5ed2dfbbd2692b2cdbbb0b6a9db2af4a98e0a6df70121ae0892
    ```
    - #### Parámetros de búsqueda
      ```json
      {
          "trackId": "Código único de factura electrónica o documento soporte (CUFE, CUDE)"
      }
      ```
- ### Estado del documento en la API
Este endpoint es utilizado para consultar el estado de los documentos generados por la API.
  - #### Estado del documento. Tipo de petición: ``GET``
     ```https
    {{url}}/status?order_number=251956&resolution=&number=LZT836&prefix=
    ```
    - #### Parámetros de búsqueda
    ```json
    {
        "order_number": "Número de orden",
        "number": "Número del documento",
        "resolution": "Resolución de facturación",
        "prefix": "Prefijo de la resolución"
    }
    ```
    - #### Respuesta
    ```json 
    {
       "document": {
        "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
        "document_number": "LZT836",
        "order_number": null,
        "document_key": "cf9864294501e8a9578235dd2ab3c4fd1d9085fe5d3b345d191fbb8c9afa6ff8acec7a97a177393b2d32735d225a9f1d",
        "document_name": "fv09010914030002500000033.xml",
        "is_valid": true,
        "invoice_date": "2025-02-14T05:00:00.000000Z",
        "qr": {
            "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=cf9864294501e8a9578235dd2ab3c4fd1d9085fe5d3b345d191fbb8c9afa6ff8acec7a97a177393b2d32735d225a9f1d",
            "data": "",
            "path": "1/fv09010914030002500000033.png",
            "url": "http://apidian.test/qr/1/fv09010914030002500000033.png"
        }
    },
      "status": "Validado por la DIAN",
      "message": "Consulta exitosa",
      "success": true
    }
    ```
    - #### Descripción de la respuesta 
    ```json
    {
        "document": {
            "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485", // UUID del documento
            "document_number": "LZT836", // Número de documento
            "order_number": null, // Número de orden
            "document_key": "", // Código único de factura electrónica o documento soporte (CUFE, CUDE)
            "document_name": "fv09010914030002500000033.xml", // Nombre del documento
            "is_valid": true, // Indica si el documento es válido o no
            "invoice_date": "2025-02-14T05:00:00.000000Z", // Fecha de la factura
            "qr": { // Información del QR
                "qrDian": "", // URL del QR en la DIAN
                "data": "", // Datos del QR
                "path": "1/fv09010914030002500000033.png", // Ruta del QR
                "url": "" // URL del QR
            }
        },
        "status": "Validado por la DIAN", // Estado del documento en la DIAN
        "message": "Consulta exitosa", // Mensaje de respuesta
        "success": true // Indica si la consulta fue exitosa o no
    }
    ```
    
## Envío de correos electrónicos personalizados
Este endpoint es utilizado para enviar correos electrónicos personalizados a los clientes.
- ### para enviar un correo electrónico se debe tener en cuenta lo siguiente:
    - Mime type **(mime)** del documento a enviar. 
    ```
        https://help.accusoft.com/PrizmViewer/v10.1/Config/MIME_Types.html
    ```
    - Estilo del documento a enviar, usando el estandar 2.1 de CSS. 
    ```
        https://www.w3.org/TR/2011/REC-CSS2-20110607
    ```
- #### Enviar correo electrónico. Tipo de petición: ``POST``
 ```http
{{url}}/documents/sendmail/to
```
 - #### Parámetros del body
    ```json 
    {
      "email_to"  : "lws_1234@hotmail.com;lopezsoft.com@gmail.com",
      "subject"   : "Documento electrónico",
      "title"     : "Titulo del correo",
      "message"   : "Mensaje del correo electrónico",
      "documents": [
        "content" : "base64",
        "mime"    : "application/pdf",
        "name"    : "Factura.pdf"
      ]
    }
    ```
- #### Descripción de los parámetros
```json
{
    "email_to": "Dirección de correo electrónico del destinatario",
    "subject": "Asunto del correo electrónico",
    "title": "Título del correo electrónico",
    "message": "Mensaje del correo electrónico",
    "documents": [ // Arreglo de documentos a enviar
        {
            "content": "Contenido del documento en base64",
            "mime": "Tipo de contenido del documento",
            "name": "Nombre del documento"
        }
    ]
}
```
## Reenvío de correos electrónicos
Este endpoint es utilizado para reenviar correos electrónicos a los clientes.
- #### Reenviar correo electrónico. Tipo de petición: ``POST``
 ```http
{{url}}//documents/sendmail/{{trackId}}
```
Donde ``trackId`` es el código único de factura electrónica o documento soporte (**CUFE, CUDE**).
 - #### Parámetros del body
    ```json 
    {
      "email_to"  : "lopezsoft.com@gmail.com;lws_1234@hotmail.com"
    }
    ```
 - #### Descripción de los parámetros
     ```json
     {
         "email_to": "Dirección de correo electrónico del destinatario"
     }
     ```
## Consulta de adquirente ``NEW``
Este endpoint es utilizado para consultar el adquirente de la factura electrónica.
De acuerdo a la Resolución 000202 de 2025, el adquirente es la persona natural o jurídica que recibe el bien o servicio.

- ### Consulta de adquirente. Tipo de petición: ``GET``
     ```http
    {{url}}/acquirer?identificationType=13&identificationNumber=1063279303
    ```
 - #### Parámetros de búsqueda
    ```json
    {
        "identificationType": "Tipo de identificación del adquirente",
        "identificationNumber": "Número de identificación del adquirente"
    }
    ```
 - #### Tipos de identificación
| CÓDIGO | NOMBRE DEL TIPO DE IDENTIFICACIÓN      |
|--------|----------------------------------------|
| 13     | Cédula de Ciudadanía                   |
| 22     | Cédula de Extranjeria                  |
| 31     | NIT                                    |
| 11     | Registro civil de nacimiento           |
| 12     | Tarjeta de identidad                   |
| 21     | Tarjeta de extranjería                 |
| 41     | Pasaporte                              |
| 42     | Documento de identificación extranjero |
| 50     | NIT de otro país                       |
| 91     | NUIP                                   |
| 48     | PPT (Permiso Protección Temporal)      |
| 47     | PEP (Permiso Especial de Permanencia)  |
| SC     | Salvoconducto                          |
| CN     | Certificado de nacido vivo             |
| AS     | Adulto sin identificar                 |
| MS     | Menor sin identificar                  |
| SI     | Sin identificación                     |
| CD     | Carné diplomático                      |

- #### Respuesta
    ```json
        {
        "message": "Consulta generada con éxito",
        "content": {
            "Message": {
                "_attributes": {
                    "nil": "true"
                }
            },
            "ReceiverEmail": "lopezsoft.com@gmail.com",
            "ReceiverName": "LOPEZ GOMEZ LEWIS OSWALDO",
            "StatusCode": "200"
        },
        "success": true
    }
    ```

## Eventos - Acuses
**NOTA:** La DIAN solo permite generar eventos para las facturas electrónicas a crédito.
### Mostrar en lista los eventos generados
Este endpoint es utilizado para mostrar en lista los eventos generados por la API.
- #### Mostrar eventos. Tipo de petición: ``GET``
 ```http
{{url}}/events/document-receptions?startDate=&endDate=&trackId=&query&limit=20
```
Para mostrar los eventos generados se pueden utilizar los siguientes parámetros (**opcionales**) de búsqueda:
- #### Parámetros de búsqueda
```json
{
    "startDate": "Fecha de inicio (En la que se generó el evento en el API)",
    "endDate": "Fecha de fin (En la que se generó el evento en el API)",
    "trackId": "trackId del documento",
    "query": "Texto de búsqueda (NIT, nombre del proveedor.)",
    "limit": "Número de registros a traer, por defecto es 20 y máximo 50 registros"
}
```
### Estado del documento en la DIAN
Este endpoint es utilizado para obtener el documento en la DIAN y sus eventos, si tiene eventos generados.

- #### Estado del documento. Tipo de petición: ``GET``
 ```http
{{url}}/events/status/{{trackId}}
```
Donde ``trackId`` es el trackId del documento.

### Importar documentos de la DIAN a la API para generar los eventos(ACUSES)
Estos endpoints son utilizados para importar los documentos de la DIAN a la API para generar los eventos(ACUSES).
- #### Importar documento usando trackId. Tipo de petición: ``POST``
 ```http
{{url}}/events/import-track-id
```
En el body de la petición se debe enviar la propiedad ``{{trackId}}`` que debe contener el valor del trackId del documento.

- #### Importar documento usando trackId. Tipo de petición: ``POST``
 ```http
{{url}}/events/{{trackId}}/import
```
Donde ``trackId`` es el **CUDE** del documento.

- #### Importar usando archivo excel. Tipo de petición: ``POST``
Para importar un archivo, este debe ser en formato EXCEL y debe contener los campos necesarios para la importación. De lo contrario, la importación no se realizará correctamente.
Estos campos son: **Tipo de documento, trackId, Folio, Prefijo, Fecha Emisión, Fecha Recepción, NIT Emisor, Nombre Emisor, NIT Receptor, Nombre Receptor, IVA, ICA, IPC, Total, Estado, Grupo**.
El archivo debe contener una fila de encabezado con los nombres de los campos. Acorde a documento excel que se baja de la plataforma de la DIAN.
 ```http
{{url}}/events/import-excel
```
Este listado lo puede bajar desde el portal de facturación de la DIAN.
Nota: El archivo no debe contener más de 100 registros.

- #### Importar usando el tipo de evento. Tipo de petición: ``POST``
Este endpoint es utilizado para importar los documentos de la DIAN a la API para generar los eventos(ACUSES) por tipo de evento.
 ```http
{{url}}/events/send/{{trackId}}
```
Donde ``trackId`` es el trackId del documento.
- #### Parámetros del body
```json
{
    "code": "Código del evento(030, 031, 032, 033)",
    "notes": "Notas del evento"
}
```
- #### Ejemplo de body Acuse de recibo
```json
{
    "code": "030",
    "notes": "Acuso recibido de factura."
}
```
- #### Ejemplo de body Reclamo de la factura
```json
{
    "code": "031",
    "notes": "Reclamo de factura."
}
```
- #### Ejemplo de body Recibo de la factura
```json
{
    "code": "032",
    "notes": "Recibo del bien y/o prestación del servicio."
}
```
- #### Ejemplo de body Aceptación expresa
```json
{
    "code": "033",
    "notes": "Aceptación expresa."
}
```