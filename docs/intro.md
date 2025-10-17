---
sidebar_position: 1
---

# Introducción
Matias es una plataforma de facturación electrónica que permite a las empresas emitir, enviar y gestionar facturas electrónicas de forma segura y eficiente. Nuestra API RESTful proporciona acceso a los servicios de Matias, permitiendo a los desarrolladores integrar la funcionalidad de facturación electrónica en sus aplicaciones.
## Autenticación de API con OAuth2

La autenticación para acceder a la API se gestiona mediante **Tokens de acceso** siguiendo el estándar de autenticación OAuth2. Esto asegura que las interacciones con la API sean seguras y estén autorizadas.

## Formato de las Solicitudes

- **Tipo de Formato:** Todas las solicitudes hacia la API deben estar en formato `JSON`. Este formato se aplica tanto para las peticiones enviadas como para las respuestas recibidas, facilitando la estandarización del intercambio de datos.

- **Uso de HTTPS:** Es obligatorio realizar solicitudes a través de HTTPS, dado que la API no procesará peticiones enviadas mediante HTTP. Esta medida garantiza la seguridad y la integridad de los datos transmitidos.

## Encabezado de Autorización

Para acceder a los recursos de la API, es necesario incluir un encabezado de autorización en cada solicitud. Este encabezado debe contener el token de acceso obtenido durante el proceso de autenticación:


## URL Base de la API

La URL base para acceder a la API se proporcionará por nuestro equipo al momento de iniciar la integración. En la documentación, utilizaremos el parámetro `{{URL}}` como marcador de posición, el cual debe ser sustituido por la URL base real proporcionada.

## Ejemplo de Encabezado para Solicitudes

A continuación, se muestra un ejemplo de cómo configurar el encabezado `Content-Type` y `Accept` para las solicitudes en formato JSON. Este encabezado es esencial para asegurar que la API interprete correctamente el tipo de contenido de la solicitud:

```http
headers.set('Content-Type', 'application/json');
headers.set('Accept', 'application/json');
```

## Registro en la API

Para acceder y utilizar los servicios de nuestra API, es necesario que primero se registre en nuestra base de datos de autenticación. Ofrecemos dos métodos para completar el proceso de registro, detallados a continuación:

## Opciones de Registro

1. **A través del formulario de registro en nuestro sitio web**: Complete el formulario disponible en nuestro sitio web. Tras enviar el formulario, recibirá por correo electrónico los datos necesarios para acceder a los servicios de la API.

2. **Mediante una petición al servicio REST**: Si prefiere, puede registrarse realizando una petición al servicio REST, siguiendo estos pasos:

  - Realice una petición de tipo `POST` a la siguiente dirección: `{{URL}}/register`.
  - El cuerpo (`BODY`) de la petición debe incluir los siguientes parámetros:
    ```
    {
      "first_name": "Lewis",
      "last_name": "Lopez Gomez",
      "email": "correo@correo.com", 
      "password": "****",
      "password_confirmation": "****",
      "address": "dirección", 
      "city_id": "836", 
      "company_name": "nombre de la empresa", 
      "dni": "12345678", 
      "identity_document_id": 3, 
      "mobile": "3108435431", 
      "tax_level_id": "5", 
      "tax_regime_id": "2",
      "type_organization_id": 1
    }
    ```
  - Si el registro es correcto, la petición devolverá una respuesta HTTP 200 en formato JSON con la estructura:
    ```
    {
      "message": "Empresa creada con éxito. Verifique su dirección de correo electrónico: gerencia@lopezsoft.net.co",
      "success": true
    }
    ```
  - Si el registro es incorrecto, la petición devolverá una respuesta HTTP 422 o 500 en formato JSON con la estructura:
    - respuesta HTTP 422
      ```
      {
         "message": "El correo electrónico ya existe (and 2 more errors)",
         "errors": {
          "email": [
              "El correo electrónico ya existe"
          ],
          "password": [
              "El campo password debe contener al menos 8 caracteres."
          ],
          "dni": [
              "El NIT ya existe"
          ]
        }
      }           
      ```
    - respuesta HTTP 500
        ```
        {
            "success": false,
            "message": "Error interno del servidor. Por favor",
        }
        ```
## Token de Acceso

Después de completar el registro, para realizar acciones como la emisión de documentos al portal de la DIAN, es necesario contar con un token de acceso. Este token proporciona acceso a las URLs protegidas de nuestra API.

El TOKEN generado tiene una validez de 1 año y puede ser revocado en cualquier momento mediante una petición a nuestra API.

## Obtener el Token de Acceso

Para obtener el token de acceso, se debe realizar los siguientes pasos:

- **a.** Enviar una petición de tipo `POST` a `{{URL}}/auth/login`
- **b.** El cuerpo (BODY) de la petición debe contener los siguientes parámetros:

```json
{
  "email": "", // Correo electrónico registrado
  "password": "", // Contraseña enviada al correo
  "remember_me": 0 // Siempre debe ser 0
}
```      
- Si la autenticación es correcta, la petición devolverá una respuesta HTTP 200 en formato JSON con la estructura:

    ```json
    {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM",
        "user": {
            "id": 1,
            "type_id": 2,
            "first_name": "LEWIS",
            "last_name": "LOPEZ GOMEZ",
            "email": "gerencia@lopezsoft.net.co",
            "avatar": "users/1/profile/agente-de-servicio-al-cliente.png",
            "active": 1,
            "name": "LEWIS LOPEZ GOMEZ",
            "avatarUrl": "{{URL}}/storage/users/1/profile/agente-de-servicio-al-cliente.png",
            "user_type": {
                "id": 1,
                "user_type_name": "ADMINISTRADOR",
                "type": 1,
                "active": 1
            }
        },
        "expires_at": "2025-02-02 19:55:42",
        "message": "Bienvenido a Matias. Su sesión ha sido iniciada con éxito.",
        "success": true
    }
    ```
- Si la autenticación es incorrecta, la petición devolverá una respuesta HTTP 401 en formato JSON con la estructura:

    ```json
    {
        "message": "Credenciales inválidas",
        "success": false
    }
    ``` 
## Uso del Token de Acceso
Tras obtener el token de acceso, este debe incluirse en el encabezado de autorización de todas las solicitudes a la API. El encabezado debe tener el siguiente formato:

```http
headers.set('Authorization', 'Bearer ' + token);
headers.set('Content-Type', 'application/json');
headers.set('Accept', 'application/json');
```
Donde `token` es el valor del token de acceso obtenido.
- **Ejemplo de Encabezado de Autorización en nodejs:** 
   ```javascript
   const axios = require('axios');
   const
   const token
   const headers = {
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
   };
   axios.get('{{URL}}/v1/user', { headers: headers })
   .then(response => {
       console.log(response.data);
   })
   .catch(error => {
       console.log(error);
   });
   ```
- ### **Ejemplo de Encabezado de Autorización en PHP:** 
   ```php
   $curl = curl_init();
   curl_setopt_array($curl, array(
     CURLOPT_URL => "{{URL}}/v1/user",
     CURLOPT_RETURNTRANSFER => true,
     CURLOPT_ENCODING => "",
     CURLOPT_MAXREDIRS => 10,
     CURLOPT_TIMEOUT => 0,
     CURLOPT_FOLLOWLOCATION => true,
     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
     CURLOPT_CUSTOMREQUEST => "GET",
     CURLOPT_HTTPHEADER => array(
       "Content-Type: application/json",
       "Accept: application/json",
       "Authorization: Bearer $token"
     ),
   ));
   $response = curl_exec($curl);
   curl_close($curl);
   echo $response;
   ```
- ### **Ejemplo de Encabezado de Autorización en Python:** 
    ```python
    import requests
    url = "{{URL}}/v1/user"
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
    response = requests.request("GET", url, headers=headers)
    print(response.text)
    ```
- ### **Ejemplo de Encabezado de Autorización en Java:** 
    ```java
    OkHttpClient client = new OkHttpClient().newBuilder()
      .build();
    Request request = new Request.Builder()
      .url("{{URL}}/v1/user")
      .method("GET", null)
      .addHeader("Content-Type", "application/json")
      .addHeader("Accept", "application/json")
      .addHeader("Authorization", "Bearer " + token)
      .build();
    Response response = client.newCall(request).execute();
    ```
- ### **Ejemplo de Encabezado de Autorización en C#:** 
    ```csharp
    var client = new RestClient("{{URL}}/v1/user");
    client.Timeout = -1;
    var request = new RestRequest(Method.GET);
    request.AddHeader("Content-Type", "application/json");
    request.AddHeader("Accept", "application/json");
    request.AddHeader("Authorization", "Bearer " + token);
    IRestResponse response = client.Execute(request);
    Console.WriteLine(response.Content);
    ```
- ### **Ejemplo de Encabezado de Autorización en Ruby:** 
    ```ruby
    require 'uri'
    require 'net/http'
    url = URI("{{URL}}/v1/user")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    request = Net::HTTP::Get.new(url)
    request["Content-Type"] = "application/json"
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer " + token
    response = http.request(request)
    puts response.read_body
    ```
- ### **Ejemplo de Encabezado de Autorización en Go:** 
    ```go
    package main
    import (
      "fmt"
      "net/http"
      "io/ioutil"
    )
    func main() {
      url := "{{URL}}/v1/user"
      method := "GET"
      client := &http.Client {
      }
      req, err := http.NewRequest(method, url, nil)
      if err != nil {
        fmt.Println(err)
        return
      }
      req.Header.Add("Content-Type", "application/json")
      req.Header.Add("Accept", "application/json")
      req.Header.Add("Authorization", "Bearer " + token)
      res, err := client.Do(req)
      if err != nil {
        fmt.Println(err)
        return
      }
      defer res.Body.Close()
      body, err := ioutil.ReadAll(res.Body)
      if err != nil {
        fmt.Println(err)
        return
      }
      fmt.Println(string(body))
    }
    ```
## Revocar el Token
Para revocar un token generado anteriormente y que aún no ha vencido, debe enviarse una petición de tipo GET a `{{URL}}/auth/logout`. 
- Si la revocación es correcta, la petición devolverá una respuesta HTTP 200 en formato JSON con la estructura:

    ```json
    {
        "message": "Successfully logged out",
        "success": true
    }
    ```
- Si la revocación es incorrecta, la petición devolverá una respuesta HTTP 401 en formato JSON con la estructura:

    ```json
    {
        "message": "Unauthenticated.",
        "success": false
    }
    ```

## Nota Importante:
Para que pueda dar continuidad a esta documentación, debe haber realizado la subida del certificado digital, 
la información del Software generada por el portal de la DIAN, al igual que la resolución de facturación, 
esta información la registra de forma visual mediante el portal web dispuesto para ello. 
```
{{URL}}/#/auth/login
```
## Ejemplos y endpoints en Postman
Para facilitar la comprensión de los ejemplos de uso de la API, hemos creado una colección de ejemplos en Postman.
Puede descargar la colección de ejemplos en el siguiente enlace:
```
https://documenter.getpostman.com/view/8699065/2s9YyvBLby
```
## Soporte
Si tiene alguna pregunta o necesita ayuda, no dude en ponerse en contacto con nuestro equipo de soporte técnico. Estamos aquí para ayudarle.
```
soporte@matias.com.co
```

## Centro de Ayuda y Soporte vía tikets
Para obtener ayuda con la API, puede abrir un ticket en nuestro Centro de Ayuda y Soporte. En el ticket, proporcionará información sobre su problema o pregunta relacionada con la API, y nuestro equipo de soporte técnico le ayudará a resolverlo.
```
https://support.lopezsoft.net.co/portal
```