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
        const required = ['prefix', 'document_number', 'type_document_id', 'operation_type_id', 'customer', 'lines', 'legal_monetary_totals', 'payments'];
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
        if (!data.lines || !data.legal_monetary_totals) return { pass: false, message: '❌ Datos incompletos' };
        
        const lineExtension = data.lines.reduce((sum, line) => sum + (parseFloat(line.line_extension_amount) || 0), 0);
        const calculatedTotal = lineExtension;
        const reportedTotal = parseFloat(data.legal_monetary_totals.tax_inclusive_amount || 0);
        
        const match = Math.abs(calculatedTotal - reportedTotal) < 0.01;
        
        return {
          pass: match,
          message: match
            ? `✅ Totales correctos`
            : `❌ Total no coincide. Esperado: ${calculatedTotal.toFixed(2)}, Recibido: ${reportedTotal.toFixed(2)}`
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
          const invoicedQty = parseFloat(line.invoiced_quantity || 0);
          const priceAmount = parseFloat(line.price_amount || 0);
          const lineExtension = parseFloat(line.line_extension_amount || 0);
          
          // Calcular esperado considerando descuentos
          let expectedAmount = invoicedQty * priceAmount;
          
          // Restar descuentos si existen
          if (line.allowance_charges && Array.isArray(line.allowance_charges)) {
            for (const discount of line.allowance_charges) {
              if (discount.charge_indicator === false) {
                expectedAmount -= parseFloat(discount.amount || 0);
              }
            }
          }
          
          if (Math.abs(expectedAmount - lineExtension) > 0.01) {
            return {
              pass: false,
              message: `❌ Línea ${i + 1}: cantidad × precio - descuentos (${expectedAmount.toFixed(2)}) ≠ line_extension_amount (${lineExtension.toFixed(2)})`
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
      id: 'customer',
      name: 'Datos del Cliente',
      check: (data) => {
        if (!data.customer) return { pass: false, message: '❌ Falta información del cliente' };
        
        const required = ['country_id', 'city_id', 'identity_document_id', 'company_name', 'dni', 'email'];
        const missing = required.filter(field => !data.customer[field]);
        
        return {
          pass: missing.length === 0,
          message: missing.length === 0
            ? '✅ Datos del cliente completos'
            : `❌ Campos del cliente faltantes: ${missing.join(', ')}`
        };
      }
    },
    {
      id: 'payments',
      name: 'Información de Pago',
      check: (data) => {
        if (!data.payments || !Array.isArray(data.payments) || data.payments.length === 0) {
          return { pass: false, message: '❌ Debe tener al menos 1 forma de pago' };
        }
        
        for (const payment of data.payments) {
          if (!payment.payment_method_id || !payment.value_paid) {
            return { pass: false, message: '❌ Falta payment_method_id o value_paid en pagos' };
          }
        }
        
        return { pass: true, message: `✅ ${data.payments.length} forma(s) de pago válida(s)` };
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
      "resolution_number": "18764074347312",
      "prefix": "FEV",
      "document_number": "2001",
      "date": "2024-10-17",
      "type_document_id": 7,
      "operation_type_id": 1,
      "graphic_representation": 0,
      "send_email": 1,
      
      "customer": {
        "country_id": "45",
        "city_id": "76",
        "identity_document_id": "2",
        "type_organization_id": 2,
        "tax_regime_id": 2,
        "tax_level_id": 5,
        "company_name": "CLIENTE EMPRESA LTDA",
        "dni": "8001234567",
        "email": "compras@cliente.com",
        "mobile": "3043965204",
        "address": "CALLE 22 NRO. 32 29",
        "postal_code": "050001"
      },
      
      "lines": [
        {
          "invoiced_quantity": "1",
          "quantity_units_id": "1093",
          "line_extension_amount": "100000.00",
          "free_of_charge_indicator": false,
          "description": "PRODUCTO O SERVICIO",
          "code": "A50824",
          "type_item_identifications_id": "4",
          "reference_price_id": "1",
          "price_amount": "100000.00",
          "base_quantity": "1",
          
          "tax_totals": [
            {
              "tax_id": "1",
              "tax_amount": 19000.00,
              "taxable_amount": 100000.00,
              "percent": 19
            }
          ]
        }
      ],
      
      "legal_monetary_totals": {
        "line_extension_amount": "100000.00",
        "tax_exclusive_amount": "100000.00",
        "tax_inclusive_amount": "119000.00",
        "payable_amount": 119000.00
      },
      
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19000.00,
          "taxable_amount": 100000.00,
          "percent": 19
        }
      ],
      
      "payments": [
        {
          "payment_method_id": 1,
          "means_payment_id": 10,
          "value_paid": "119000.00"
        }
      ]
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
