# 🎯 QUICK START - Cómo Ejecutar Todo en 2 Minutos

## 📦 Lo que tienes

Un proyecto con **2 servidores independientes** que trabajan juntos:

```
┌──────────────────────────────────────────────────────────┐
│ PROYECTO MATIAS API - GPT-4o Mini                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  🌐 FRONTEND (Docusaurus)                               │
│  ├─ Puerto: 3000                                        │
│  ├─ Comando: npm start                                  │
│  ├─ Contenido: Documentación + UI Chat                  │
│  └─ Estado: Viendo en navegador                         │
│                                                          │
│  ⚙️  BACKEND (Express + OpenAI)                         │
│  ├─ Puerto: 3001                                        │
│  ├─ Comando: npm run ai-server:dev                      │
│  ├─ Contenido: API GPT-4o Mini                          │
│  └─ Estado: Procesa peticiones HTTP                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## ⚡ Paso 1: Configuración (1 minuto)

### Crear archivo `.env.local`

En la **carpeta raíz** (`d:\wamp64\www\APIUBL2.1-DOCS`):

**Archivo: `.env.local`**
```
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NODE_ENV=development
PORT=3001
```

> Reemplaza `sk-proj-XXXXX` con tu **API Key real** de OpenAI  
> 👉 Obtener en: https://platform.openai.com/api-keys

---

## 🚀 Paso 2: Ejecutar los Servidores (1 minuto)

### Opción A: Dos Terminales (Recomendado ✅)

**Abre 2 terminales en la carpeta del proyecto**

#### Terminal 1️⃣ - FRONTEND
```bash
npm start
```

Se abre automáticamente en http://localhost:3000

#### Terminal 2️⃣ - BACKEND
```bash
npm run ai-server:dev
```

Deberías ver:
```
╔════════════════════════════════════════════════════════╗
║  🚀 Servidor OpenAI GPT-4o Mini iniciado              ║
║  🌐 URL: http://localhost:3001                        ║
╚════════════════════════════════════════════════════════╝
```

---

### Opción B: Una Terminal (Windows PowerShell)

```powershell
# Inicia backend en background
Start-Process npm -ArgumentList "run ai-server:dev"

# Espera 3 segundos
Start-Sleep -Seconds 3

# Inicia frontend
npm start
```

---

## ✅ Verificación (30 segundos)

### ¿Todo funciona?

Abre una **nueva terminal** y ejecuta:

```bash
curl http://localhost:3001/health
```

Debe responder:
```json
{
  "status": "ok",
  "service": "OpenAI GPT-4o Mini",
  "environment": {
    "model": "gpt-4o-mini",
    "hasApiKey": true
  }
}
```

Si ves eso ✅ **¡Estás listo!**

---

## 🧪 Prueba el Chat

1. Abre el navegador: http://localhost:3000
2. Ve a la **esquina inferior derecha** - verás un botón **azul redondo**
3. Haz clic ➜ Se abre un **popup de chat**
4. Escribe: `¿Cómo valido un NIT?`
5. Presiona **Enter**
6. El asistente responde en 2-3 segundos

---

## 🎨 Colores Actualizados

El popup del chat ahora usa el **azul del template**:

| Elemento | Color |
|----------|-------|
| Botón flotante | `#3c6ab2` |
| Header popup | `#3c6ab2` → `#2556a3` |
| Mensajes usuario | `#3c6ab2` |
| Botón enviar | `#3c6ab2` → `#2556a3` |

---

## 📚 Documentación Disponible

| Archivo | Minutos | Para Qué |
|---------|---------|----------|
| **GUIA_INICIO_RAPIDO.md** | 10 | Guía completa (este archivo expandido) |
| **SERVIDOR_CONFIGURACION.md** | 15 | Configuración avanzada y producción |
| **DOCUMENTACION_INDEX.md** | 5 | Índice de toda la documentación |
| **CAMBIOS_RESUMEN.md** | 5 | Resumen de cambios realizados |

---

## 🛑 Si algo falla

### Error: "OPENAI_API_KEY no existe"
```bash
# Verifica que .env.local existe
type .env.local

# Verifica que tiene tu API key
# Si no, crea el archivo nuevamente
```

### Error: "Puerto 3000 o 3001 ya en uso"
```bash
# Windows - Ver qué usa el puerto 3000
netstat -ano | findstr :3000

# Windows - Matar el proceso
taskkill /PID <número> /F

# O cambiar puerto en .env.local
# PORT=3002
```

### Chat no responde
```bash
# Verifica que backend está corriendo
curl http://localhost:3001/health

# Verifica que tienes internet (OpenAI lo requiere)
# Verifica que API key es válida
```

---

## 🎯 Próximos Pasos

### Inmediato (Ahora)
- ✅ Crear `.env.local`
- ✅ Ejecutar: `npm start` (Terminal 1)
- ✅ Ejecutar: `npm run ai-server:dev` (Terminal 2)
- ✅ Probar chat en http://localhost:3000

### Entendimiento (Luego)
- 📖 Leer: `GUIA_INICIO_RAPIDO.md` (completo)
- 📖 Leer: `SERVIDOR_CONFIGURACION.md` (avanzado)
- 📖 Ver: `DOCUMENTACION_INDEX.md` (todas las guías)

### Producción (Después)
- 🚀 Compilar: `npm run ai-server:build`
- 🚀 Ejecutar: `NODE_ENV=production node server.js`
- 🚀 Ejecutar: `npm run build && npm run serve`

---

## 🔗 Enlaces Útiles

- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [GPT-4o Mini Models](https://platform.openai.com/docs/models)
- [Express.js Docs](https://expressjs.com/)
- [Docusaurus Docs](https://docusaurus.io/)

---

## 💡 Tips & Tricks

### Ver logs del backend
El servidor muestra todos los requests en Terminal 2

### Actualizar colores
Están en: `src/components/Interactive/*.module.css`

### Cambiar system prompt
Está en: `server.ts` línea 51-120

### Hacer que sea más rápido
Cambiar temperatura en `server.ts` línea 263 (default: 0.5)

---

## 📞 Soporte

| Problema | Solución |
|----------|----------|
| No sé por dónde empezar | Lee GUIA_INICIO_RAPIDO.md |
| Algo no funciona | Ve a SERVIDOR_CONFIGURACION.md → Troubleshooting |
| Quiero entender el código | Ve a DOCUMENTACION_INDEX.md |
| Necesito producción | Ve a SERVIDOR_CONFIGURACION.md → Para Producción |

---

**¡Estás listo! Abre dos terminales y comienza con:**

```bash
# Terminal 1
npm start

# Terminal 2
npm run ai-server:dev
```

**Luego abre http://localhost:3000** 🎉

---

*Última actualización: Octubre 17, 2025*  
*Versión: GPT-4o Mini v2.0*  
*Estado: ✅ Producción Lista*
