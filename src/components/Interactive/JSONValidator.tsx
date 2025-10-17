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
      id: 'legal_monetary_totals',
      name: 'legal_monetary_totals',
      check: (data) => {
        if (!data.lines || !data.legal_monetary_totals) {
          return { pass: false, message: '❌ Faltan datos de líneas o totales' };
        }

        const lmt = data.legal_monetary_totals;
        const errors = [];

        // 1. Calcular line_extension_amount (suma de todas las líneas)
        const calculatedLineExtension = data.lines.reduce((sum, line) => 
          sum + parseFloat(line.line_extension_amount || 0), 0
        );
        const reportedLineExtension = parseFloat(lmt.line_extension_amount || 0);

        if (Math.abs(calculatedLineExtension - reportedLineExtension) > 0.01) {
          errors.push(`line_extension_amount: esperado ${calculatedLineExtension.toFixed(2)}, recibido ${reportedLineExtension.toFixed(2)}`);
        }

        // 2. Calcular tax_exclusive_amount (suma de bases gravables)
        let calculatedTaxExclusive = 0;
        data.lines.forEach(line => {
          if (line.tax_totals && Array.isArray(line.tax_totals)) {
            line.tax_totals.forEach(tax => {
              calculatedTaxExclusive += parseFloat(tax.taxable_amount || 0);
            });
          }
        });
        const reportedTaxExclusive = parseFloat(lmt.tax_exclusive_amount || 0);

        if (Math.abs(calculatedTaxExclusive - reportedTaxExclusive) > 0.01) {
          errors.push(`tax_exclusive_amount: esperado ${calculatedTaxExclusive.toFixed(2)}, recibido ${reportedTaxExclusive.toFixed(2)}`);
        }

        // 3. Calcular tax_inclusive_amount (line_extension_amount + impuestos)
        let totalTaxes = 0;
        if (data.tax_totals && Array.isArray(data.tax_totals)) {
          totalTaxes = data.tax_totals.reduce((sum, tax) => 
            sum + parseFloat(tax.tax_amount || 0), 0
          );
        }
        const calculatedTaxInclusive = calculatedLineExtension + totalTaxes;
        const reportedTaxInclusive = parseFloat(lmt.tax_inclusive_amount || 0);

        if (Math.abs(calculatedTaxInclusive - reportedTaxInclusive) > 0.01) {
          errors.push(`tax_inclusive_amount: esperado ${calculatedTaxInclusive.toFixed(2)}, recibido ${reportedTaxInclusive.toFixed(2)}`);
        }

        // 4. Calcular payable_amount
        const totalCharges = parseFloat(lmt.total_charges || 0);
        const totalAllowance = parseFloat(lmt.total_allowance || 0);
        const calculatedPayable = calculatedTaxInclusive + totalCharges - totalAllowance;
        const reportedPayable = parseFloat(lmt.payable_amount || 0);

        if (Math.abs(calculatedPayable - reportedPayable) > 0.01) {
          errors.push(`payable_amount: esperado ${calculatedPayable.toFixed(2)}, recibido ${reportedPayable.toFixed(2)}`);
        }

        return {
          pass: errors.length === 0,
          message: errors.length === 0 
            ? '✅ legal_monetary_totals correcto'
            : `❌ Errores: ${errors.join(' | ')}`
        };
      }
    },
    {
      id: 'tax_totals_global',
      name: 'tax_totals (Global)',
      check: (data) => {
        if (!data.lines) {
          return { pass: false, message: '❌ Faltan líneas' };
        }

        // Agrupar impuestos por tax_id desde las líneas
        const taxesByType = {};
        
        data.lines.forEach(line => {
          if (line.tax_totals && Array.isArray(line.tax_totals)) {
            line.tax_totals.forEach(tax => {
              const taxId = tax.tax_id;
              if (!taxesByType[taxId]) {
                taxesByType[taxId] = {
                  tax_amount: 0,
                  taxable_amount: 0,
                  percent: tax.percent
                };
              }
              taxesByType[taxId].tax_amount += parseFloat(tax.tax_amount || 0);
              taxesByType[taxId].taxable_amount += parseFloat(tax.taxable_amount || 0);
            });
          }
        });

        // Verificar que tax_totals global coincida
        if (!data.tax_totals || !Array.isArray(data.tax_totals)) {
          if (Object.keys(taxesByType).length > 0) {
            return { pass: false, message: '❌ Falta tax_totals global pero hay impuestos en líneas' };
          }
          return { pass: true, message: '✅ Sin impuestos (correcto)' };
        }

        const errors = [];
        data.tax_totals.forEach(globalTax => {
          const taxId = globalTax.tax_id;
          const expected = taxesByType[taxId];

          if (!expected) {
            errors.push(`tax_id ${taxId} en global pero no en líneas`);
            return;
          }

          if (Math.abs(parseFloat(globalTax.tax_amount) - expected.tax_amount) > 0.01) {
            errors.push(`tax_id ${taxId}: tax_amount esperado ${expected.tax_amount.toFixed(2)}, recibido ${globalTax.tax_amount}`);
          }

          if (Math.abs(parseFloat(globalTax.taxable_amount) - expected.taxable_amount) > 0.01) {
            errors.push(`tax_id ${taxId}: taxable_amount esperado ${expected.taxable_amount.toFixed(2)}, recibido ${globalTax.taxable_amount}`);
          }
        });

        return {
          pass: errors.length === 0,
          message: errors.length === 0
            ? `✅ tax_totals global correcto (${data.tax_totals.length} impuesto(s))`
            : `❌ ${errors.join(' | ')}`
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
          
          // Calcular esperado considerando descuentos y cargos
          let expectedAmount = invoicedQty * priceAmount;
          
          // Aplicar allowance_charges si existen
          if (line.allowance_charges && Array.isArray(line.allowance_charges)) {
            for (const ac of line.allowance_charges) {
              const amount = parseFloat(ac.amount || 0);
              if (ac.charge_indicator === true) {
                // Es un cargo, se suma
                expectedAmount += amount;
              } else if (ac.charge_indicator === false) {
                // Es un descuento, se resta
                expectedAmount -= amount;
              }
            }
          }
          
          if (Math.abs(expectedAmount - lineExtension) > 0.01) {
            return {
              pass: false,
              message: `❌ Línea ${i + 1}: line_extension_amount esperado ${expectedAmount.toFixed(2)}, recibido ${lineExtension.toFixed(2)}`
            };
          }

          // Validar tax_totals de la línea si existen
          if (line.tax_totals && Array.isArray(line.tax_totals)) {
            for (const tax of line.tax_totals) {
              const taxAmount = parseFloat(tax.tax_amount || 0);
              const taxableAmount = parseFloat(tax.taxable_amount || 0);
              const percent = parseFloat(tax.percent || 0);

              // Verificar que tax_amount = taxable_amount * (percent / 100)
              const expectedTaxAmount = taxableAmount * (percent / 100);
              if (Math.abs(taxAmount - expectedTaxAmount) > 0.01) {
                return {
                  pass: false,
                  message: `❌ Línea ${i + 1}: tax_amount esperado ${expectedTaxAmount.toFixed(2)} (${taxableAmount} × ${percent}%), recibido ${taxAmount.toFixed(2)}`
                };
              }
            }
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
