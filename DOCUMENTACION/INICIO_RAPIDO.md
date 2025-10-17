# 🚀 INICIO RÁPIDO - 5 minutos

## ⚡ Pasos Relámpago

### 1️⃣ API Key (2 min)

```bash
# Ir a:
https://platform.openai.com/api/keys

# Crear nueva key → Copiar
# Ejemplo: sk-proj-xxx...yyy
```

### 2️⃣ Configurar (1 min)

```bash
# Editar .env.local
cd /d/wamp64/www/APIUBL2.1-DOCS

# Reemplazar en .env.local:
OPENAI_API_KEY=sk-proj-xxx...yyy
```

### 3️⃣ Ejecutar (2 min)

```bash
# Terminal 1: Backend
npx ts-node server.ts

# Terminal 2: Frontend
npm run start

# Abre navegador automáticamente o:
# http://localhost:3000
```

### ✅ ¡LISTO! 

Ver icono 💬 flotante en esquina inferior derecha. ¡Click y prueba!

---

## 📝 Ejemplo de Primer Mensaje

```
Usuario: "¿Cuáles son los campos requeridos para una factura?"

Respuesta (aproximada):
"Las facturas electrónicas en Colombia requieren:

1. **Información del Documento**
   - type_document_id: Tipo de documento (01 para Factura)
   - operation_type_id: Código de operación
   - issue_date: Fecha de emisión
   - due_date: Fecha de vencimiento

2. **Datos del Cliente**
   - customer:
     * id_document: NIT o cédula
     * id_document_type: Tipo de identificación
     * name: Razón social o nombre

3. **Líneas de Items**
   - quantity: Cantidad
   - unit_price: Precio unitario
   - tax_rate: % IVA

4. **Totales**
   - legal_monetary_totals con:
     * line_extension_amount
     * tax_exclusive_amount
     * tax_inclusive_amount

..."
```

---

## 🔍 Verificar que Todo Funciona

```bash
# Terminal 3: Test del servidor
curl http://localhost:3001/health

# Respuesta esperada:
# {
#   "status": "ok",
#   "service": "OpenAI GPT-4 Turbo",
#   "timestamp": "2025-10-17T...",
#   "environment": {
#     "model": "gpt-4-turbo",
#     "hasApiKey": true
#   }
# }
```

---

## 🆘 Si Algo Falla

| Error | Solución |
|-------|----------|
| "OPENAI_API_KEY no encontrada" | Verificar `.env.local` contiene la clave |
| Error 401 en chat | API Key inválida o expirada → Generar nueva |
| Puerto 3001 ocupado | Cambiar `PORT=3002` en `.env.local` |
| Servidor no inicia | Verificar dependencias: `npm install` |
| Chat no aparece en navegador | Limpiar caché (Ctrl+Shift+Delete) |

---

## 📚 Documentación Completa

Para más detalles, ver:

- **OPENAI_IMPLEMENTATION.md** → Configuración avanzada
- **CHECKLIST_OPENAI.md** → Checklist paso-a-paso
- **ARQUITECTURA_VISUAL.md** → Diagramas técnicos
- **OPENAI_RESUMEN.md** → Resumen ejecutivo

---

## 🎯 Pruebas Recomendadas

Después de iniciar, prueba preguntas como:

1. "¿Cómo se calcula el IVA en una factura?"
2. "¿Cuál es el formato del NIT?"
3. "¿Qué significa operation_type_id = 10?"
4. "¿Cuál es la estructura de una nota crédito?"
5. "¿Cómo manejar descuentos en las líneas?"

---

✅ **¡Listo para comenzar!**
