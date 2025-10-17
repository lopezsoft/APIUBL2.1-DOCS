import React, { useState } from 'react';
import styles from './TotalCalculator.module.css';

/**
 * Calculadora de totales para facturas
 * Calcula correctamente: Subtotal - Descuentos + Impuestos = Total
 */

export default function TotalCalculator() {
  const [lines, setLines] = useState([
    { id: 1, description: 'Producto A', quantity: 1, unitPrice: 100000, taxPercentage: 19 }
  ]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' o 'amount'

  const addLine = () => {
    const newId = Math.max(...lines.map(l => l.id), 0) + 1;
    setLines([
      ...lines,
      { id: newId, description: '', quantity: 1, unitPrice: 0, taxPercentage: 19 }
    ]);
  };

  const removeLine = (id) => {
    setLines(lines.filter(line => line.id !== id));
  };

  const updateLine = (id, field, value) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  // Cálculos
  const subtotal = lines.reduce((sum, line) => {
    const lineAmount = (line.quantity || 0) * (line.unitPrice || 0);
    return sum + lineAmount;
  }, 0);

  const discountAmount = discountType === 'percentage'
    ? (subtotal * (globalDiscount || 0)) / 100
    : (globalDiscount || 0);

  const taxableBase = subtotal - discountAmount;

  const totalTax = lines.reduce((sum, line) => {
    const lineAmount = (line.quantity || 0) * (line.unitPrice || 0);
    const lineTaxBase = lineAmount * (1 - (discountAmount / subtotal || 0)); // Prorratea descuento
    const lineTax = lineTaxBase * ((line.taxPercentage || 0) / 100);
    return sum + lineTax;
  }, 0);

  const total = taxableBase + totalTax;

  const copyCalculation = () => {
    const text = `
Subtotal: $${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
Descuento: -$${discountAmount.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
Base Imponible: $${taxableBase.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
Total Impuestos: +$${totalTax.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
────────────────────────────────────────
TOTAL: $${total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
    `.trim();
    navigator.clipboard.writeText(text);
    alert('Cálculo copiado');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>🧮 Calculadora de Totales</h2>

        <div className={styles.section}>
          <h3>Líneas de Factura</h3>
          
          {lines.map((line, index) => (
            <div key={line.id} className={styles.lineItem}>
              <div className={styles.lineInputs}>
                <input
                  type="text"
                  placeholder="Descripción"
                  value={line.description}
                  onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                  className={styles.input}
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={line.quantity}
                  onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className={styles.inputSmall}
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={line.unitPrice}
                  onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className={styles.inputSmall}
                />
                <select
                  value={line.taxPercentage}
                  onChange={(e) => updateLine(line.id, 'taxPercentage', parseFloat(e.target.value))}
                  className={styles.inputSmall}
                >
                  <option value="0">IVA 0%</option>
                  <option value="5">IVA 5%</option>
                  <option value="19">IVA 19%</option>
                </select>
                <button
                  onClick={() => removeLine(line.id)}
                  className={styles.buttonRemove}
                  disabled={lines.length === 1}
                >
                  🗑️
                </button>
              </div>
              
              <div className={styles.lineResult}>
                <span>
                  ${((line.quantity || 0) * (line.unitPrice || 0)).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}

          <button onClick={addLine} className={styles.buttonAdd}>
            + Agregar Línea
          </button>
        </div>

        <div className={styles.section}>
          <h3>Descuento Global</h3>
          <div className={styles.discountGroup}>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className={styles.inputSmall}
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="amount">Monto ($)</option>
            </select>
            <input
              type="number"
              placeholder="0"
              value={globalDiscount}
              onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
            <span className={styles.indicator}>
              {discountType === 'percentage' ? '%' : '$'}
            </span>
          </div>
        </div>

        <div className={`${styles.section} ${styles.results}`}>
          <h3>📊 Resumen de Cálculo</h3>
          
          <div className={styles.resultRow}>
            <span>Subtotal:</span>
            <code>${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</code>
          </div>

          {discountAmount > 0 && (
            <div className={styles.resultRow}>
              <span>Descuento {discountType === 'percentage' ? `(${globalDiscount}%)` : ''}:</span>
              <code className={styles.negative}>
                -${discountAmount.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </code>
            </div>
          )}

          <div className={styles.resultRow}>
            <span>Base Imponible:</span>
            <code>${taxableBase.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</code>
          </div>

          <div className={styles.resultRow}>
            <span>Total Impuestos:</span>
            <code className={styles.positive}>
              +${totalTax.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
            </code>
          </div>

          <div className={`${styles.resultRow} ${styles.total}`}>
            <strong>TOTAL A PAGAR:</strong>
            <code className={styles.highlight}>
              ${total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
            </code>
          </div>

          <button onClick={copyCalculation} className={styles.buttonCopy}>
            📋 Copiar Cálculo
          </button>
        </div>

        <div className={styles.infoBox}>
          <h4>ℹ️ Fórmula Correcta</h4>
          <code>
            SUBTOTAL - DESCUENTOS = BASE IMPONIBLE<br/>
            BASE IMPONIBLE × (1 + IVA%) = TOTAL
          </code>
        </div>
      </div>
    </div>
  );
}
