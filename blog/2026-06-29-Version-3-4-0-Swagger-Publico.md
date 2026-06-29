---
slug: version-3-4-0-swagger-api-docs
title: "Versión 3.4.0: ¡Swagger API Integrado y Nuevos Endpoints Modulares!"
authors: [lewis]
tags: [release, api, swagger, endpoints, documentación]
---

¡Nos emociona anunciar la versión **3.4.0** de nuestra documentación técnica! En este lanzamiento hemos enfocado nuestros esfuerzos en mejorar sustancialmente la experiencia del desarrollador, ofreciendo herramientas más poderosas y documentación mucho más completa para el consumo de nuestros endpoints.

<!--truncate-->

### 🚀 Integración de Swagger API (OpenAPI)

Hemos añadido una nueva pestaña dedicada exclusivamente a la visualización de nuestra especificación oficial en formato **OpenAPI (Swagger)**.

Ahora puedes acceder a la ruta `/api-docs/` (disponible desde el menú de navegación principal superior) para inspeccionar interactivamente todos nuestros endpoints públicos, modelos de datos, esquemas de solicitud y esquemas de respuesta, todo renderizado automáticamente a través de Redocusaurus.

### 📚 10 Nuevos Módulos de Endpoints Documentados

Nuestra sección de **Endpoints** (`/docs/endpoints`) ha crecido exponencialmente. Hemos generado, a partir de nuestra especificación técnica oficial, la documentación en formato Markdown de 10 nuevas categorías para que tengas ejemplos claros de integración:

* **🏢 Empresa:** Gestión de datos, configuración y clientes.
* **👤 Perfil de Usuario:** Administración de cuenta, avatar, preferencias y contraseñas.
* **📄 Resoluciones DIAN:** Control del ciclo de vida de las resoluciones de facturación.
* **💻 Software DIAN:** Configuración y pruebas de software propio ante la entidad.
* **🎨 Company Templates:** Administración y personalización de plantillas gráficas PDF.
* **📊 Configuración de Reportes:** Accesos a configuraciones de reportes generados.
* **🛠️ Funciones Auxiliares:** Endpoints utilitarios de conversión y dígitos de verificación.
* **💳 Payments - Wompi:** Endpoints para gestión de suscripciones, cupones y pasarela Wompi.
* **📧 Registros de Email:** Seguimiento y bitácora de correos electrónicos enviados (SMTP logs).
* **📦 Envío Masivo (Bulk):** Procesamiento de documentos asincrónicos por lotes.

### 🧹 Limpieza y Optimización

Como parte de este release:
- Se **purgaron 20 endpoints administrativos internos** de la especificación OpenAPI pública (analíticas, cupones internos y rutas `/admin`), asegurando que solo veas las rutas a las que verdaderamente tienes acceso como integrador.
- Estandarizamos el uso de la variable `{{url}}` para los nuevos endpoints de producción y `{{SANDBOX_URL}}` para el entorno de pruebas, manteniendo una estructura coherente y lista para copiar en Postman u otros clientes HTTP.

¡Estamos comprometidos con ofrecerte la mejor experiencia (DX) posible! Te invitamos a navegar por la nueva sección de Swagger y actualizar tus integraciones si consumías alguno de estos servicios de forma no documentada.
