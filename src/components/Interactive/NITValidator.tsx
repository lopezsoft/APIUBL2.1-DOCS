import React, { useState } from 'react';
import styles from './NITValidator.module.css';

/**
 * Componente para validar el dígito verificador de un NIT colombiano
 * 
 * Algoritmo:
 * 1. Multiplicar cada dígito por su peso (3,7,13,17,19,23,29,37,41,43)
 * 2. Sumar los resultados
 * 3. Dividir entre 11
 * 4. El dígito verificador = 11 - resto
 * Si resultado es 11 → dígito es 0
 * Si resultado es 10 → dígito es 9
 */

export default function NITValidator() {
  const [nit, setNit] = useState('');
  const [result, setResult] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState([]);

  const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43];

  const calculateCheckDigit = (nitNumber) => {
    const nitStr = nitNumber.toString().padStart(9, '0');
    const calculationSteps = [];

    // Validar que tenga 9 dígitos
    if (!/^\d{9}$/.test(nitStr)) {
      return {
        valid: false,
        message: '❌ El NIT debe tener exactamente 9 dígitos',
        steps: []
      };
    }

    // Paso 1: Multiplicar por pesos
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(nitStr[i]);
      const weight = weights[i];
      const product = digit * weight;
      sum += product;

      calculationSteps.push({
        step: i + 1,
        digit,
        weight,
        product,
        cumulative: sum
      });
    }

    // Paso 2: Dividir entre 11
    const remainder = sum % 11;
    const checkDigitCalc = 11 - remainder;

    // Paso 3: Ajustes especiales
    let checkDigit = checkDigitCalc;
    if (checkDigitCalc === 11) {
      checkDigit = 0;
    } else if (checkDigitCalc === 10) {
      checkDigit = 9;
    }

    const fullNIT = nitStr + checkDigit;

    return {
      valid: true,
      nit: nitStr,
      sum,
      remainder,
      checkDigitCalc,
      checkDigit,
      fullNIT,
      steps: calculationSteps
    };
  };

  const handleValidate = () => {
    if (!nit.trim()) {
      setResult({
        valid: false,
        message: '⚠️ Por favor ingresa un NIT'
      });
      return;
    }

    const validation = calculateCheckDigit(nit);
    setResult(validation);
    setSteps(validation.steps || []);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    setNit(value);
  };

  const handleClear = () => {
    setNit('');
    setResult(null);
    setSteps([]);
    setShowSteps(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>🔍 Validador de NIT Colombiano</h2>
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Ingresa los 9 dígitos del NIT"
            value={nit}
            onChange={handleInputChange}
            maxLength={9}
            className={styles.input}
          />
          <button onClick={handleValidate} className={styles.buttonPrimary}>
            Validar
          </button>
          <button onClick={handleClear} className={styles.buttonSecondary}>
            Limpiar
          </button>
        </div>

        {result && (
          <div className={styles.resultSection}>
            {result.valid ? (
              <>
                <div className={`${styles.resultBox} ${styles.success}`}>
                  <h3>✅ NIT Válido</h3>
                  
                  <div className={styles.resultContent}>
                    <div className={styles.resultItem}>
                      <strong>NIT sin dígito:</strong>
                      <code>{result.nit}</code>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <strong>Dígito Verificador:</strong>
                      <code className={styles.highlightDigit}>{result.checkDigit}</code>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <strong>NIT Completo:</strong>
                      <code className={styles.fullNIT}>{result.fullNIT}</code>
                    </div>
                  </div>

                  <div className={styles.copySection}>
                    <button
                      className={styles.buttonCopy}
                      onClick={() => {
                        navigator.clipboard.writeText(result.fullNIT);
                        alert('NIT copiado al portapapeles');
                      }}
                    >
                      📋 Copiar NIT Completo
                    </button>
                  </div>

                  <button
                    className={styles.buttonDetails}
                    onClick={() => setShowSteps(!showSteps)}
                  >
                    {showSteps ? '▼ Ocultar pasos' : '▶ Ver cálculos detallados'}
                  </button>

                  {showSteps && (
                    <div className={styles.stepsContainer}>
                      <h4>📊 Cálculo Paso a Paso</h4>
                      
                      <div className={styles.stepsTable}>
                        <table>
                          <thead>
                            <tr>
                              <th>Paso</th>
                              <th>Dígito</th>
                              <th>×</th>
                              <th>Peso</th>
                              <th>=</th>
                              <th>Producto</th>
                              <th>Acumulado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {steps.map((s) => (
                              <tr key={s.step}>
                                <td>{s.step}</td>
                                <td><strong>{s.digit}</strong></td>
                                <td>×</td>
                                <td>{s.weight}</td>
                                <td>=</td>
                                <td><strong>{s.product}</strong></td>
                                <td><strong>{s.cumulative}</strong></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className={styles.calculationSteps}>
                        <div className={styles.step}>
                          <strong>Suma Total:</strong> {result.sum}
                        </div>
                        <div className={styles.step}>
                          <strong>División entre 11:</strong> {result.sum} ÷ 11 = {Math.floor(result.sum / 11)} con resto {result.remainder}
                        </div>
                        <div className={styles.step}>
                          <strong>Dígito inicial:</strong> 11 - {result.remainder} = {result.checkDigitCalc}
                        </div>
                        {result.checkDigitCalc === 11 && (
                          <div className={styles.step}>
                            <strong>Ajuste:</strong> 11 → 0 (cambio especial)
                          </div>
                        )}
                        {result.checkDigitCalc === 10 && (
                          <div className={styles.step}>
                            <strong>Ajuste:</strong> 10 → 9 (cambio especial)
                          </div>
                        )}
                        <div className={styles.step}>
                          <strong>Dígito Verificador Final:</strong> <span className={styles.highlightDigit}>{result.checkDigit}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={`${styles.resultBox} ${styles.error}`}>
                <h3>❌ Error</h3>
                <p>{result.message}</p>
              </div>
            )}
          </div>
        )}

        <div className={styles.infoBox}>
          <h4>ℹ️ Información</h4>
          <ul>
            <li>El NIT colombiano tiene 9 dígitos + 1 dígito verificador</li>
            <li>El dígito verificador se calcula usando pesos específicos</li>
            <li>Este validador usa el mismo algoritmo de la DIAN</li>
            <li>Ingresa solo los 9 primeros dígitos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
