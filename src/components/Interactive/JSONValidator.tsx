import React, { useState } from 'react';
import styles from './JSONValidator.module.css';

/**
 * Componente validador de facturas JSON
 * Valida estructura, tipos de datos y reglas de negocio
 */

export default function JSONValidator() {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [showPretty, setShowPretty] = useState(false);

  const validations = [
    {
      id: 'structure',
      name: 'Estructura',
      check: (data) => {
        const required = ['prefix', 'document_number', 'date', 'issuer', 'customer', 'lines', 'totals'];
        const missing = required.filter(field => !data[field]);
        return {
          pass: missing.length === 0,
          message: missing.length === 0 
            ? '✅ Estructura completa'
            : `❌ Campos faltantes: ${missing.join(', ')}`
        };
      }
    },
    {
      id: 'totals',
      name: 'Cálculo de Totales',
      check: (data) => {
        if (!data.lines || !data.totals) return { pass: false, message: '❌ Datos incompletos' };
        
        const subtotal = data.lines.reduce((sum, line) => sum + (line.line_extension_amount || 0), 0);
        const expectedTotal = subtotal - (data.totals.total_discount || 0) + (data.totals.total_tax || 0);
        
        const match = Math.abs(expectedTotal - (data.totals.payable_amount || 0)) < 0.01;
        
        return {
          pass: match,
          message: match
            ? `✅ Totales correctos (${expectedTotal.toLocaleString()})`
            : `❌ Total no coincide. Esperado: ${expectedTotal.toLocaleString()}, Recibido: ${data.totals.payable_amount || 0}`
        };
      }
    },
    {
      id: 'lines',
      name: 'Líneas de Factura',
      check: (data) => {
        if (!data.lines || data.lines.length === 0) {
          return { pass: false, message: '❌ Debe tener al menos 1 línea' };
        }
        
        for (let i = 0; i < data.lines.length; i++) {
          const line = data.lines[i];
          const quantity = line.quantity || 0;
          const unitPrice = line.unit_price || 0;
          const expected = quantity * unitPrice;
          const actual = line.line_extension_amount || 0;
          
          if (Math.abs(expected - actual) > 0.01) {
            return {
              pass: false,
              message: `❌ Línea ${i + 1}: quantity × unit_price (${expected.toFixed(2)}) ≠ line_extension_amount (${actual.toFixed(2)})`
            };
          }
        }
        
        return { pass: true, message: `✅ ${data.lines.length} línea(s) válida(s)` };
      }
    },
    {
      id: 'dates',
      name: 'Fechas Válidas',
      check: (data) => {
        if (!data.date) return { pass: false, message: '❌ Falta fecha de documento' };
        
        const docDate = new Date(data.date);
        const today = new Date();
        
        if (docDate > today) {
          return { pass: false, message: '❌ Fecha no puede ser en el futuro' };
        }
        
        return { pass: true, message: `✅ Fecha válida (${data.date})` };
      }
    },
    {
      id: 'issuer',
      name: 'Datos del Emisor',
      check: (data) => {
        if (!data.issuer) return { pass: false, message: '❌ Falta información del emisor' };
        
        const required = ['tax_id', 'name', 'address', 'city'];
        const missing = required.filter(field => !data.issuer[field]);
        
        return {
          pass: missing.length === 0,
          message: missing.length === 0
            ? '✅ Datos del emisor completos'
            : `❌ Campos del emisor faltantes: ${missing.join(', ')}`
        };
      }
    },
    {
      id: 'customer',
      name: 'Datos del Cliente',
      check: (data) => {
        if (!data.customer) return { pass: false, message: '❌ Falta información del cliente' };
        
        const required = ['identity_document_id', 'document_number', 'company_name', 'city'];
        const missing = required.filter(field => !data.customer[field]);
        
        return {
          pass: missing.length === 0,
          message: missing.length === 0
            ? '✅ Datos del cliente completos'
            : `❌ Campos del cliente faltantes: ${missing.join(', ')}`
        };
      }
    }
  ];

  const handleValidate = () => {
    try {
      const data = JSON.parse(jsonInput);
      const results = validations.map(v => ({
        ...v,
        result: v.check(data)
      }));
      
      setValidationResult({
        valid: results.every(r => r.result.pass),
        results,
        data
      });
    } catch (error) {
      setValidationResult({
        valid: false,
        error: `❌ JSON inválido: ${error.message}`,
        results: []
      });
    }
  };

  const handleLoadExample = () => {
    const example = {
      "prefix": "FEV",
      "document_number": 2001,
      "date": "2024-10-17",
      "time": "14:30:00",
      "currency_id": 170,
      "issuer": {
        "tax_id": "9001234567",
        "name": "MI EMPRESA SAS",
        "address": "Carrera 10 #25-50",
        "city": "Bogotá",
        "country_id": "169"
      },
      "customer": {
        "identity_document_id": "2",
        "document_number": "8001234567",
        "company_name": "CLIENTE EMPRESA LTDA",
        "city": "Medellín",
        "country_id": "169"
      },
      "lines": [
        {
          "description": "PRODUCTO A",
          "quantity": 2,
          "unit_price": 50000,
          "line_extension_amount": 100000,
          "taxes": [{"tax_type_id": 1, "tax_percentage": 19, "tax_amount": 19000}]
        }
      ],
      "totals": {
        "subtotal": 100000,
        "total_discount": 0,
        "total_tax": 19000,
        "payable_amount": 119000
      }
    };
    
    setJsonInput(JSON.stringify(example, null, 2));
  };

  const handleClear = () => {
    setJsonInput('');
    setValidationResult(null);
    setShowPretty(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>✅ Validador de Factura JSON</h2>
        
        <div className={styles.controls}>
          <button onClick={handleLoadExample} className={styles.buttonSecondary}>
            📋 Cargar Ejemplo
          </button>
          <button onClick={handleValidate} className={styles.buttonPrimary}>
            Validar
          </button>
          <button onClick={handleClear} className={styles.buttonSecondary}>
            Limpiar
          </button>
        </div>

        <div className={styles.editorSection}>
          <label>Ingresa o pega tu JSON de factura:</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Pega aquí tu JSON de factura..."
            className={styles.textarea}
          />
        </div>

        {validationResult && (
          <div className={styles.resultSection}>
            <div className={`${styles.resultHeader} ${validationResult.valid ? styles.success : styles.error}`}>
              {validationResult.valid ? (
                <h3>✅ ¡Factura válida!</h3>
              ) : (
                <h3>❌ Errores encontrados</h3>
              )}
            </div>

            {validationResult.error && (
              <div className={styles.errorBox}>
                {validationResult.error}
              </div>
            )}

            <div className={styles.validationsList}>
              {validationResult.results.map((validation) => (
                <div
                  key={validation.id}
                  className={`${styles.validationItem} ${validation.result.pass ? styles.pass : styles.fail}`}
                >
                  <span className={styles.validationName}>{validation.name}</span>
                  <span className={styles.validationMessage}>{validation.result.message}</span>
                </div>
              ))}
            </div>

            {validationResult.valid && (
              <div className={styles.successBox}>
                <p>🎉 Tu factura cumple con todas las validaciones básicas</p>
                <p className={styles.disclaimer}>
                  ℹ️ Aún requiere validación completa de DIAN
                </p>
              </div>
            )}
          </div>
        )}

        <div className={styles.infoBox}>
          <h4>ℹ️ Validaciones Realizadas</h4>
          <ul>
            <li><strong>Estructura:</strong> Campos obligatorios presentes</li>
            <li><strong>Cálculo de Totales:</strong> Subtotal - Descuento + Impuesto = Total</li>
            <li><strong>Líneas:</strong> Cantidad × Precio = Monto de línea</li>
            <li><strong>Fechas:</strong> No pueden ser en el futuro</li>
            <li><strong>Emisor:</strong> Información requerida presente</li>
            <li><strong>Cliente:</strong> Datos de identificación completos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
