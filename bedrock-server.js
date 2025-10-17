#!/usr/bin/env node

/**
 * Servidor Bedrock simplificado
 * Ejecutar: node bedrock-server.js
 * 
 * No requiere dependencias externas, usa Node.js nativo
 */

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

// Simular respuestas del asistente sin conectar realmente a Bedrock
// (para demostración, sin necesidad de AWS SDK)
const mockResponses = {
  'estructura': 'Una factura en APIUBL2.1 tiene la siguiente estructura básica:\n\n{\n  "prefix": "FEV",\n  "document_number": "2001",\n  "type_document_id": 7,\n  "operation_type_id": 1,\n  "customer": { ... },\n  "lines": [ ... ],\n  "legal_monetary_totals": { ... },\n  "payments": [ ... ]\n}\n\nLos campos requeridos son: prefix, document_number, type_document_id, operation_type_id, customer, lines, legal_monetary_totals, payments.',
  
  'nit': 'El algoritmo para calcular el dígito verificador de un NIT colombiano:\n\n1. Los documentos en Colombia tienen hasta 10 dígitos (sin incluir el dígito verificador)\n2. Se usan pesos específicos: [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]\n3. Se multiplica cada dígito por el peso correspondiente (de atrás hacia adelante)\n4. Se suman todos los productos\n5. Se calcula: residuo = suma % 11\n6. Si residuo > 1: DV = 11 - residuo; Si residuo ≤ 1: DV = residuo\n\nEjemplo: 901091403 → DV = 2 (resultado: 9010914032)',
  
  'totales': 'El cálculo de totales en una factura:\n\n1. line_extension_amount = (invoiced_quantity × price_amount) - descuentos\n2. tax_exclusive_amount = suma de todos los line_extension_amount\n3. tax_amount = tax_exclusive_amount × (percent / 100)\n4. tax_inclusive_amount = tax_exclusive_amount + tax_amount\n5. payable_amount = tax_inclusive_amount\n\nEsto es lo que debe aparecer en legal_monetary_totals.',
  
  'descuentos': 'Los descuentos en APIUBL2.1 se manejan con allowance_charges:\n\n"allowance_charges": [{\n  "amount": "22.00",\n  "base_amount": "220.00",\n  "charge_indicator": false,\n  "allowance_charge_reason": "Promocion"\n}]\n\nCampos:\n- amount: Valor del descuento\n- base_amount: Valor original (price_amount × quantity)\n- charge_indicator: false para descuento, true para cargo\n- allowance_charge_reason: Razón (Promocion, Volumen, Pronto pago, Bonificacion, Rebaja)',
  
  'default': '👋 Hola, soy un asistente AI para APIUBL2.1. Puedo ayudarte con:\n\n✅ Estructura de facturas\n✅ Validación de NITs\n✅ Cálculo de totales\n✅ Aplicación de descuentos\n✅ Ejemplos JSON\n✅ Errores comunes\n\n¿En qué puedo ayudarte? Pregunta sobre: estructura, nit, totales, descuentos'
};

function generateResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('estructura') || msg.includes('campos')) {
    return mockResponses.estructura;
  } else if (msg.includes('nit') || msg.includes('dígito') || msg.includes('digito')) {
    return mockResponses.nit;
  } else if (msg.includes('total') || msg.includes('cálculo') || msg.includes('calculo')) {
    return mockResponses.totales;
  } else if (msg.includes('descuento') || msg.includes('allowance')) {
    return mockResponses.descuentos;
  }
  
  return mockResponses.default;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      bedrock: 'mock',
      timestamp: new Date().toISOString(),
      message: '✅ Servidor Bedrock simulado ejecutándose'
    }));
    return;
  }

  // Chat endpoint
  if (pathname === '/api/bedrock/chat' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const userMessage = data.message || '';
        
        if (!userMessage.trim()) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Message is required' }));
          return;
        }

        // Generar respuesta
        const response = generateResponse(userMessage);

        res.writeHead(200);
        res.end(JSON.stringify({
          response: response,
          timestamp: new Date().toISOString(),
          mode: 'MOCK (sin AWS Bedrock)'
        }));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({
          error: 'Error processing request',
          details: error.message
        }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          🤖 SERVIDOR BEDROCK SIMULADO INICIADO ✅             ║
║                                                               ║
║  📍 URL: http://localhost:${PORT}                              ║
║  🏥 Health: http://localhost:${PORT}/health                     ║
║  💬 Chat: POST http://localhost:${PORT}/api/bedrock/chat       ║
║                                                               ║
║  📝 MODO: MOCK (Respuestas simuladas sin AWS)                 ║
║  💡 Esto es para demostración. Para AWS real:                 ║
║     1. npm install @aws-sdk/client-bedrock-runtime            ║
║     2. Usar server.ts en lugar de este archivo                ║
║                                                               ║
║  Tópicos disponibles:                                         ║
║    • estructura - Estructura de facturas                      ║
║    • nit - Validación de NITs                                 ║
║    • totales - Cálculo de totales                             ║
║    • descuentos - Aplicar descuentos                          ║
║                                                               ║
║  Prueba:                                                      ║
║    curl -X POST http://localhost:${PORT}/api/bedrock/chat \\    ║
║      -H "Content-Type: application/json" \\                    ║
║      -d '{"message":"¿Qué es un NIT?"}'                       ║
║                                                               ║
║  Presiona Ctrl+C para detener el servidor                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

process.on('SIGINT', () => {
  console.log('\n✋ Servidor detenido');
  process.exit(0);
});
