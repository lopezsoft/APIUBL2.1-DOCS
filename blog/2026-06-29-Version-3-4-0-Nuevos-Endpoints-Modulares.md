---
slug: version-3-4-0-nuevos-endpoints-modulares
title: "Versión 3.4.0: ¡Nuevos Endpoints Modulares Documentados!"
authors: [lewis]
tags: [release, api, endpoints, documentación]
---

¡Nos emociona anunciar la versión **3.4.0** de nuestra documentación técnica! En este lanzamiento hemos enfocado nuestros esfuerzos en mejorar sustancialmente la experiencia del desarrollador, ofreciendo documentación mucho más completa y modular para el consumo de nuestros endpoints.

<!--truncate-->

### 📚 10 Nuevos Módulos de Endpoints Documentados

Nuestra sección de **Endpoints** (`/docs/endpoints`) ha crecido exponencialmente. Hemos generado la documentación en formato Markdown de 10 nuevas categorías para que tengas ejemplos claros de integración:

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

### 🧹 Estandarización y Optimización

Como parte de este release:
- Estandarizamos el uso de la variable `{{url}}` para los nuevos endpoints de producción y `{{SANDBOX_URL}}` para el entorno de pruebas, manteniendo una estructura coherente y lista para copiar en Postman u otros clientes HTTP.

¡Estamos comprometidos con ofrecerte la mejor experiencia (DX) posible! Te invitamos a navegar por la sección de Endpoints y actualizar tus integraciones si consumías alguno de estos servicios de forma no documentada.
