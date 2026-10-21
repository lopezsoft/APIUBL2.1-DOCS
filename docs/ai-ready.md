---
sidebar_position: 2
sidebar_label: 🤖 Documentación para IA
title: Documentación para agentes de IA
description: Cómo usar la documentación de MATIAS API con ChatGPT, Claude, Cursor, Copilot y otros asistentes de IA (llms.txt, Markdown y OpenAPI).
---

# 🤖 Documentación para agentes de IA

Toda la documentación de MATIAS API está disponible en formatos que un asistente de IA puede leer directamente, sin navegar el sitio: Markdown plano, el estándar [llms.txt](https://llmstxt.org) y una especificación OpenAPI 3.

## Recursos

| Recurso | URL | Úsalo para |
|---|---|---|
| Índice para IA | [`/llms.txt`](https://docs.matias-api.com/llms.txt) | Que el agente vea todas las páginas y abra solo las que necesita. |
| Documentación completa | [`/llms-full.txt`](https://docs.matias-api.com/llms-full.txt) | Cargar toda la documentación de una vez en un chat o en tu proyecto. |
| Cada página en Markdown | Agrega `.md` a la URL, p. ej. [`/docs/intro.md`](https://docs.matias-api.com/docs/intro.md) | Pasarle a la IA solo el tema en el que trabajas. |
| Especificación OpenAPI 3 | [`/openapi.json`](https://docs.matias-api.com/openapi.json) | Generar clientes, validar payloads o dar al agente el contrato exacto de cada endpoint. |
| Colección Postman Sandbox | [`/sandbox-quickstart.postman_collection.json`](https://docs.matias-api.com/sandbox-quickstart.postman_collection.json) | Probar el flujo mínimo contra el sandbox. |
| Colección Postman completa | [`/postman_collection.json`](https://docs.matias-api.com/postman_collection.json) | Importar todos los endpoints en Postman. Es un archivo grande (más de 5 MB): para un chat usa mejor `llms-full.txt`. |

Cada página del sitio tiene además, arriba a la derecha, los botones **Copiar Markdown**, **Ver .md**, **Abrir en ChatGPT** y **Abrir en Claude**.

:::tip Negociación de contenido
Un agente que pide cualquier página con el header `Accept: text/markdown` recibe la versión Markdown en lugar del HTML:

```bash
curl -L -H "Accept: text/markdown" https://docs.matias-api.com/docs/intro/
```
:::

## Cómo usarlo con tu asistente

### ChatGPT, Claude y otros chats

Pega en el chat el enlace de la página que necesitas (con `.md`) o el de `llms-full.txt`, o descarga el archivo y adjúntalo. Ejemplo de instrucción:

```text
Lee https://docs.matias-api.com/llms-full.txt y ayúdame a emitir una factura
electrónica contra el sandbox de MATIAS API desde mi aplicación en <lenguaje>.
```

### Cursor, GitHub Copilot, Claude Code y otros editores

Guarda la documentación dentro de tu proyecto para que el asistente la tenga como contexto:

```bash
curl -o docs/matias-api.md https://docs.matias-api.com/llms-full.txt
curl -o docs/matias-api.openapi.json https://docs.matias-api.com/openapi.json
```

Si tu editor permite indexar documentación por URL, regístrala con `https://docs.matias-api.com/llms.txt`.

## Buenas prácticas

:::danger Nunca compartas tu token
No pegues tu token de acceso (`Authorization: Bearer ...`) ni certificados en un chat de IA. Para que el asistente pruebe llamadas, usa el [Sandbox](./sandbox/quickstart.md) y variables de entorno en tu código.
:::

- Pide al asistente que trabaje primero contra el **sandbox** (`https://sandbox-api.matias-api.com/api/ubl2.1`) y que use los [valores mágicos](./sandbox/magic-values.md) para simular respuestas de la DIAN.
- Indica tu rol: si eres **Casa de Software**, las llamadas en nombre de tus clientes llevan `?client_uuid={uuid}`.
- Cuando la IA proponga un campo o un endpoint, verifica que exista en [Campos del documento](./billing-fields.md) o en `openapi.json`.
