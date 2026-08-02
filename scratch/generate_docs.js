const fs = require('fs');
const path = require('path');

const swaggerPath = 'd:/wamp64/www/APIUBL2.1-DOCS/DOCUMENTACION/api-docs.json';
const docsDir = 'd:/wamp64/www/APIUBL2.1-DOCS/docs/endpoints';

const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const fileMap = {
  "Empresa": "11-empresa.md",
  "Perfil": "12-perfil.md",
  "Resoluciones DIAN": "13-resoluciones-dian.md",
  "Software DIAN": "14-software-dian.md",
  "Company Templates": "15-company-templates.md",
  "Configuración de Reportes": "16-configuracion-reportes.md",
  "Funciones Auxiliares": "17-funciones-auxiliares.md",
  "Payments - Wompi": "18-payments-wompi.md",
  "Registros de Email": "19-registros-email.md",
  "Envío Masivo (Bulk)": "20-bulk-documents.md"
};

const emojiMap = {
  "GET": "🔵 GET",
  "POST": "🟘 POST",
  "PUT": "🟠 PUT",
  "PATCH": "🟠 PATCH",
  "DELETE": "🔴 DELETE"
};

function getEmojiIcon(tag) {
  const icons = {
    "Empresa": "🏢",
    "Perfil": "👤",
    "Resoluciones DIAN": "📄",
    "Software DIAN": "💻",
    "Company Templates": "🎨",
    "Configuración de Reportes": "📊",
    "Funciones Auxiliares": "🛠️",
    "Payments - Wompi": "💳",
    "Registros de Email": "📧",
    "Envío Masivo (Bulk)": "📦"
  };
  return icons[tag] || "📌";
}

function resolveRef(ref) {
  if (!ref) return null;
  const parts = ref.split('/');
  let current = swagger;
  for (let i = 1; i < parts.length; i++) {
    current = current[parts[i]];
  }
  return current;
}

function generateExample(schema) {
  if (!schema) return {};
  if (schema.$ref) {
    schema = resolveRef(schema.$ref);
  }
  
  if (schema.type === 'object' && schema.properties) {
    const obj = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.example !== undefined) {
        obj[key] = prop.example;
      } else if (prop.type === 'string') {
        obj[key] = "string";
      } else if (prop.type === 'integer' || prop.type === 'number') {
        obj[key] = 0;
      } else if (prop.type === 'boolean') {
        obj[key] = true;
      } else if (prop.type === 'array') {
        obj[key] = [generateExample(prop.items)];
      } else if (prop.type === 'object') {
        obj[key] = generateExample(prop);
      } else if (prop.allOf || prop.anyOf || prop.oneOf) {
        const sub = prop.allOf ? prop.allOf[0] : (prop.anyOf ? prop.anyOf[0] : prop.oneOf[0]);
        obj[key] = generateExample(sub);
      }
    }
    return obj;
  } else if (schema.type === 'array') {
    return [generateExample(schema.items)];
  } else if (schema.allOf || schema.anyOf || schema.oneOf) {
    const sub = schema.allOf ? schema.allOf[0] : (schema.anyOf ? schema.anyOf[0] : schema.oneOf[0]);
    return generateExample(sub);
  }
  return {};
}

Object.entries(fileMap).forEach(([tag, filename]) => {
  const fileNum = filename.split('-')[0];
  let md = `---
sidebar_position: ${fileNum}
sidebar_label: ${tag}
---

# ${getEmojiIcon(tag)} ${tag}

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: \`Authorization: Bearer {token}\`

`;

  // Gather endpoints for this tag
  const endpoints = [];
  Object.entries(swagger.paths).forEach(([apiPath, pathObj]) => {
    Object.entries(pathObj).forEach(([method, methodObj]) => {
      if (methodObj.tags && methodObj.tags.includes(tag)) {
        endpoints.push({ path: apiPath, method: method.toUpperCase(), ...methodObj });
      }
    });
  });

  endpoints.forEach(ep => {
    const title = ep.summary || `${ep.method} ${ep.path}`;
    const url = ep.path.replace('/api/ubl2.1', '{{url}}').replace('/api', '{{url}}');
    
    md += `## ${title}\n\n`;
    md += `### ${title} - ${emojiMap[ep.method] || ep.method}\n`;
    md += `\`\`\`http\n${ep.method} ${url}\nAuthorization: Bearer {token}\nContent-Type: application/json\n\`\`\`\n\n`;
    
    if (ep.description) {
      const safeDesc = ep.description.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
      md += `**Descripción:** ${safeDesc}\n\n`;
    }

    if (ep.parameters && ep.parameters.length > 0) {
      md += `**Parámetros:**\n`;
      md += `| Nombre | Ubicación | Requerido | Descripción |\n`;
      md += `|---|---|---|---|\n`;
      ep.parameters.forEach(p => {
        md += `| \`${p.name}\` | ${p.in} | ${p.required ? 'Sí' : 'No'} | ${p.description || ''} |\n`;
      });
      md += `\n`;
    }

    if (ep.requestBody && ep.requestBody.content && ep.requestBody.content['application/json']) {
      const schema = ep.requestBody.content['application/json'].schema;
      const example = generateExample(schema);
      if (Object.keys(example).length > 0) {
        md += `**Body (JSON):**\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
      }
    } else if (ep.requestBody && ep.requestBody.content && ep.requestBody.content['multipart/form-data']) {
      md += `**Body (Form Data):**\n(Ver documentación interactiva Swagger para más detalles de campos multipartes)\n\n`;
    }

    if (ep.responses && ep.responses['200']) {
      let respSchema = null;
      if (ep.responses['200'].content && ep.responses['200'].content['application/json']) {
        respSchema = ep.responses['200'].content['application/json'].schema;
      }
      const example = generateExample(respSchema);
      md += `**Respuesta Exitosa (HTTP 200):**\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
    } else if (ep.responses && ep.responses['201']) {
      let respSchema = null;
      if (ep.responses['201'].content && ep.responses['201'].content['application/json']) {
        respSchema = ep.responses['201'].content['application/json'].schema;
      }
      const example = generateExample(respSchema);
      md += `**Respuesta Exitosa (HTTP 201):**\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
    }
    
    md += `---\n\n`;
  });
  
  fs.writeFileSync(path.join(docsDir, filename), md);
});

console.log('Docs generated successfully!');
