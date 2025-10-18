# 📚 Guía de Publicación - Matias API Documentation v1.4.0

## 🎯 Objetivo

Publicar la documentación de Matias API en producción (https://docs.matias-api.com/) y configurar el agente de IA para acceder a la documentación como contexto.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Verificación Previa](#paso-1-verificación-previa)
3. [Paso 2: Compilación para Producción](#paso-2-compilación-para-producción)
4. [Paso 3: Configuración del Servidor](#paso-3-configuración-del-servidor)
5. [Paso 4: Publicación](#paso-4-publicación)
6. [Paso 5: Configuración del Agente de IA](#paso-5-configuración-del-agente-de-ia)
7. [Verificación y Monitoreo](#verificación-y-monitoreo)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos Previos

Antes de proceder con la publicación, asegúrate de tener:

- ✅ Node.js v18.0+ instalado
- ✅ npm v9.0+ instalado
- ✅ Acceso SSH al servidor (usuario/contraseña o clave SSH)
- ✅ Dominio configurado: `docs.matias-api.com`
- ✅ Certificado SSL/TLS configurado (Let's Encrypt o similar)
- ✅ Git configurado en el servidor
- ✅ PM2 o similar para gestión de procesos (opcional pero recomendado)

### Verificar Instalaciones

```bash
node --version    # Debe ser v18.0 o superior
npm --version     # Debe ser v9.0 o superior
git --version     # Verificar disponibilidad
```

---

## 📝 Paso 1: Verificación Previa

### 1.1 Verificar Estado del Repositorio

```bash
cd /home/ubuntu/www/APIUBL2.1-DOCS  # Cambiar según tu servidor
git status                             # Verificar cambios pendientes
git log --oneline -5                   # Ver últimos commits
```

**Esperado:**
- Sin cambios pendientes
- Último commit: "feat: v1.4.0 - Marco Regulatorio DIAN Completo"

### 1.2 Verificar Dependencias Instaladas

```bash
npm list --depth=0               # Ver dependencias principales
npm outdated                     # Verificar versiones desactualizadas
```

### 1.3 Ejecutar Pruebas de Build Local

```bash
npm run build              # Compilar proyecto
echo $?                    # Verificar código de salida (0 = éxito)
```

**Esperado:** Build completa sin errores

---

## 🚀 Paso 2: Compilación para Producción

### 2.1 Limpiar Artifacts Anteriores

```bash
npm run clear              # Limpiar caché de Docusaurus
rm -rf build/              # Eliminar build anterior
```

### 2.2 Instalar Dependencias Actualizadas

```bash
npm install                # Instalar/actualizar dependencias
npm audit fix              # Corregir vulnerabilidades
```

### 2.3 Compilación Final

```bash
npm run build              # Compilación de producción
```

**Salida esperada:**
```
[SUCCESS] Generated static files in "build".
[INFO] Use `npm run serve` command to test your build locally.
```

### 2.4 Verificar Archivos de Build

```bash
ls -lah build/             # Listar archivos generados
du -sh build/              # Tamaño total del build
find build -name "*.html" | wc -l  # Contar archivos HTML
```

**Esperado:**
- Carpeta `build/` generada correctamente
- Archivos HTML, CSS, JS presentes
- Tamaño aproximado: 50-100 MB

---

## 🌍 Paso 3: Configuración del Servidor

### 3.1 Estructura de Carpetas en Servidor

```bash
# Conectar al servidor
ssh usuario@docs.matias-api.com

# Crear estructura de carpetas
mkdir -p /home/app/matias-api-docs/{releases,shared,current}
cd /home/app/matias-api-docs

# Crear carpetas compartidas
mkdir -p shared/{logs,node_modules}
```

### 3.2 Opción A: Usar Nginx como Reverse Proxy

**Archivo de configuración:** `/etc/nginx/sites-available/docs.matias-api.com`

```nginx
upstream matias_docs {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name docs.matias-api.com;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name docs.matias-api.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/docs.matias-api.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.matias-api.com/privkey.pem;

    # Configuraciones SSL recomendadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy inverso
    location / {
        proxy_pass http://matias_docs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    # Cache de archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    access_log /var/log/nginx/docs.matias-api.com.access.log;
    error_log /var/log/nginx/docs.matias-api.com.error.log;
}
```

**Habilitar el sitio:**
```bash
sudo ln -s /etc/nginx/sites-available/docs.matias-api.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3.3 Opción B: Usar Apache como Reverse Proxy

**Archivo de configuración:** `/etc/apache2/sites-available/docs.matias-api.com.conf`

```apache
<VirtualHost *:80>
    ServerName docs.matias-api.com
    Redirect permanent / https://docs.matias-api.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName docs.matias-api.com
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/docs.matias-api.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/docs.matias-api.com/privkey.pem

    # Proxy
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Headers
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/docs.matias-api.com.error.log
    CustomLog ${APACHE_LOG_DIR}/docs.matias-api.com.access.log combined
</VirtualHost>
```

**Habilitar el sitio:**
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2ensite docs.matias-api.com
sudo apache2ctl configtest
sudo systemctl restart apache2
```

---

## 📦 Paso 4: Publicación

### 4.1 Método A: Deployment Manual (Recomendado para Pruebas)

```bash
# 1. En tu máquina local, hacer push a la rama principal
git checkout main
git merge feature/integrate-dian-wiki
git push origin main

# 2. En el servidor, clonar/actualizar repositorio
ssh usuario@docs.matias-api.com
cd /home/app/matias-api-docs/releases/v1.4.0
git clone https://github.com/lopezsoft/APIUBL2.1-DOCS.git .

# 3. Instalar dependencias
npm install --production

# 4. Compilar
npm run build

# 5. Actualizar enlace simbólico
cd /home/app/matias-api-docs
rm -f current
ln -s releases/v1.4.0 current

# 6. Reiniciar aplicación
pm2 restart matias-docs || npm run serve &
```

### 4.2 Método B: GitHub Actions (Automatizado - Recomendado)

**Archivo:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_PATH }}
          SCRIPT_AFTER: |
            cd ${{ secrets.REMOTE_PATH }}
            npm install --production
            npm run build
            pm2 restart matias-docs
      
      - name: Notify Deployment
        run: echo "✅ Deployment completado en https://docs.matias-api.com"
```

**Configurar Secretos en GitHub:**
- `SSH_PRIVATE_KEY`: Tu clave SSH privada
- `REMOTE_HOST`: IP o dominio del servidor
- `REMOTE_USER`: Usuario SSH
- `REMOTE_PATH`: Ruta de destino en servidor

### 4.3 Método C: Docker (Escalable - Recomendado para Producción)

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "serve"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  matias-docs:
    build: .
    container_name: matias-docs
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - ./build:/app/build
    networks:
      - matias-network

networks:
  matias-network:
    driver: bridge
```

**Deployment con Docker:**
```bash
docker-compose up -d
docker-compose logs -f
```

---

## 🤖 Paso 5: Configuración del Agente de IA

### 5.1 Crear Endpoint de API para Búsqueda de Documentación

**Archivo:** `server.ts` (Actualizar)

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para búsqueda de documentación
app.post('/api/ai/search', (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Query parameter is required' 
      });
    }

    // Buscar en archivos markdown
    const docsPath = path.join(__dirname, '../docs');
    const results = searchDocs(docsPath, query);

    res.json({
      success: true,
      query,
      results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error searching documentation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint para obtener contenido de documento específico
app.get('/api/ai/docs/:docPath', (req: Request, res: Response) => {
  try {
    const { docPath } = req.params;
    
    // Sanitizar path
    if (docPath.includes('..')) {
      return res.status(400).json({ 
        error: 'Invalid document path' 
      });
    }

    const fullPath = path.join(__dirname, '../docs', docPath + '.md');
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        error: 'Document not found' 
      });
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    
    res.json({
      success: true,
      path: docPath,
      content,
      size: content.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error retrieving document',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint de salud para verificación
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.4.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Función auxiliar para búsqueda
function searchDocs(dir: string, query: string): any[] {
  const results = [];
  const files = fs.readdirSync(dir, { recursive: true });

  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('.md')) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      if (content.toLowerCase().includes(query.toLowerCase())) {
        const lines = content.split('\n');
        const matchedLines = lines
          .map((line, idx) => ({ line, idx }))
          .filter(({ line }) => 
            line.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 3); // Limitar a 3 líneas

        results.push({
          file: file.replace(/\.md$/, ''),
          matches: matchedLines.length,
          preview: matchedLines.map(m => m.line.trim()).join(' ... ')
        });
      }
    }
  }

  return results;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📚 Documentation API running on port ${PORT}`);
});
```

**Compilar:**
```bash
npm run ai-server:build
```

### 5.2 Configurar Cliente Python para Agente de IA

**Archivo:** `ai-client.py`

```python
import requests
import json
from typing import List, Dict, Optional

class MatiasDocs:
    """Cliente para acceder a la documentación de Matias API"""
    
    def __init__(self, base_url: str = "https://docs.matias-api.com"):
        self.base_url = base_url
        self.api_endpoint = f"{base_url}/api"
    
    def search(self, query: str) -> List[Dict]:
        """
        Buscar en la documentación
        
        Args:
            query: Término de búsqueda
            
        Returns:
            Lista de resultados coincidentes
        """
        try:
            response = requests.post(
                f"{self.api_endpoint}/ai/search",
                json={"query": query},
                timeout=10
            )
            response.raise_for_status()
            return response.json()["results"]
        except requests.RequestException as e:
            print(f"Error buscando documentación: {e}")
            return []
    
    def get_document(self, doc_path: str) -> Optional[str]:
        """
        Obtener contenido completo de un documento
        
        Args:
            doc_path: Ruta del documento (sin .md)
            
        Returns:
            Contenido del documento o None
        """
        try:
            response = requests.get(
                f"{self.api_endpoint}/ai/docs/{doc_path}",
                timeout=10
            )
            response.raise_for_status()
            return response.json()["content"]
        except requests.RequestException as e:
            print(f"Error obteniendo documento: {e}")
            return None
    
    def health_check(self) -> bool:
        """Verificar estado del servidor"""
        try:
            response = requests.get(
                f"{self.api_endpoint}/health",
                timeout=5
            )
            return response.status_code == 200
        except:
            return False

# Ejemplo de uso
if __name__ == "__main__":
    docs = MatiasDocs("https://docs.matias-api.com")
    
    # Buscar
    results = docs.search("factura electrónica")
    print(f"Encontrados {len(results)} resultados")
    
    # Obtener documento
    content = docs.get_document("regulatory-framework/factura-electronica/intro")
    if content:
        print(f"Documento obtenido: {len(content)} caracteres")
```

### 5.3 Integración con OpenAI/Claude

**Archivo:** `ai-integration.ts`

```typescript
import axios from 'axios';

interface AIAgentConfig {
  docsUrl: string;
  apiKey: string;
  model: string;
}

class DocumentationAIAgent {
  private config: AIAgentConfig;
  private docCache: Map<string, string> = new Map();

  constructor(config: AIAgentConfig) {
    this.config = config;
  }

  /**
   * Obtener contexto de documentación para prompt del AI
   */
  async getDocumentationContext(topic: string): Promise<string> {
    try {
      // Buscar en documentación
      const searchResponse = await axios.post(
        `${this.config.docsUrl}/api/ai/search`,
        { query: topic }
      );

      const results = searchResponse.data.results || [];
      let context = "# Contexto de Documentación de Matias API\n\n";

      // Obtener contenido de documentos relevantes
      for (const result of results.slice(0, 3)) {
        const docContent = await this.getDocument(result.file);
        if (docContent) {
          context += `## ${result.file}\n${docContent}\n\n`;
        }
      }

      return context;
    } catch (error) {
      console.error('Error obteniendo contexto:', error);
      return '';
    }
  }

  /**
   * Obtener contenido de documento
   */
  private async getDocument(docPath: string): Promise<string | null> {
    // Verificar caché
    if (this.docCache.has(docPath)) {
      return this.docCache.get(docPath) || null;
    }

    try {
      const response = await axios.get(
        `${this.config.docsUrl}/api/ai/docs/${docPath}`
      );
      const content = response.data.content;
      this.docCache.set(docPath, content);
      return content;
    } catch (error) {
      console.error(`Error obteniendo documento ${docPath}:`, error);
      return null;
    }
  }

  /**
   * Hacer pregunta al AI con contexto de documentación
   */
  async askQuestion(question: string): Promise<string> {
    try {
      // Obtener contexto relevante
      const context = await this.getDocumentationContext(question);

      // Preparar prompt con contexto
      const systemPrompt = `Eres un asistente experto en Matias API Documentation.
Responde preguntas basándote en la documentación proporcionada.
Si la respuesta no está en la documentación, indícalo claramente.

${context}`;

      // Llamar a API de OpenAI (o tu proveedor preferido)
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error en AI:', error);
      throw error;
    }
  }
}

export default DocumentationAIAgent;
```

---

## ✅ Verificación y Monitoreo

### 6.1 Verificar Publicación

```bash
# Verificar que el sitio está accesible
curl -I https://docs.matias-api.com

# Verificar salud de la API
curl https://docs.matias-api.com/api/health

# Buscar en documentación
curl -X POST https://docs.matias-api.com/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query": "factura electrónica"}'
```

**Respuestas esperadas:**
- Status 200 OK
- SSL certificate válido
- API respondiendo correctamente

### 6.2 Monitoreo Continuo

**Configurar PM2:**
```bash
pm2 start "npm run serve" --name "matias-docs"
pm2 save
pm2 startup
pm2 logs matias-docs
```

**Monitorear con Uptime Kuma (opcional):**
```bash
# Crear monitoreo cada 5 minutos
curl -X POST http://localhost:3001/api/addMonitor \
  -H "Content-Type: application/json" \
  -d '{
    "type": "http",
    "name": "Matias Docs",
    "url": "https://docs.matias-api.com",
    "interval": 300
  }'
```

### 6.3 Logs y Métricas

```bash
# Ver logs en tiempo real
tail -f /var/log/nginx/docs.matias-api.com.access.log

# Analizar errores
tail -f /var/log/nginx/docs.matias-api.com.error.log

# Ver estadísticas de PM2
pm2 monit
```

---

## 🔧 Troubleshooting

### Problema: "Build failed with MDX error"
**Solución:**
```bash
npm run clear
rm -rf node_modules
npm install
npm run build
```

### Problema: "Port 3000 already in use"
**Solución:**
```bash
# Encontrar proceso que ocupa el puerto
lsof -i :3000
# Matar proceso
kill -9 <PID>
# O usar puerto diferente
PORT=3001 npm run serve
```

### Problema: "SSL certificate not found"
**Solución:**
```bash
# Renovar certificado con Let's Encrypt
sudo certbot renew --force-renewal
# Verificar estado
sudo certbot certificates
```

### Problema: "AI Agent no puede acceder a la documentación"
**Solución:**
```bash
# Verificar que la API está funcionando
curl https://docs.matias-api.com/api/health

# Verificar CORS
# Asegurarse de que `server.ts` tiene CORS habilitado
# Verificar logs del servidor
pm2 logs matias-docs
```

### Problema: "Documentación muy lenta"
**Solución:**
```bash
# Habilitar caché en Nginx
# Agregar a configuración nginx:
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=matias_cache:10m;

# En location block:
proxy_cache matias_cache;
proxy_cache_valid 200 10m;
add_header X-Cache-Status $upstream_cache_status;

# Reiniciar nginx
sudo systemctl restart nginx
```

---

## 📊 Checklist Final de Publicación

- [ ] Verificar build local sin errores
- [ ] Hacer commit y push a main
- [ ] Configurar certificado SSL
- [ ] Configurar servidor web (Nginx/Apache)
- [ ] Deployar archivos de build
- [ ] Iniciar servidor/aplicación
- [ ] Verificar acceso a https://docs.matias-api.com
- [ ] Verificar API en /api/health
- [ ] Configurar agente de IA
- [ ] Probar búsqueda de documentación
- [ ] Configurar backups automáticos
- [ ] Configurar monitoreo y alertas
- [ ] Verificar logs sin errores críticos
- [ ] Documentar credenciales en lugar seguro
- [ ] Notificar al equipo de la publicación

---

## 📞 Soporte

Si necesitas ayuda:

1. **Revisar logs:** `pm2 logs matias-docs`
2. **Verificar status:** `curl https://docs.matias-api.com/api/health`
3. **Contactar equipo:** support@matias-api.com

---

**Versión:** 1.4.0  
**Última actualización:** Octubre 17, 2025  
**Status:** ✅ Listo para Producción
