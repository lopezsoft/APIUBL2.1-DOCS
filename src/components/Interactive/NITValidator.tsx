import React, { useState } from 'react';
import styles from './NITValidator.module.css';

/**
 * Componente para validar el dígito verificador de un NIT/documento colombiano
 * 
 * En Colombia: Los números de documento pueden tener hasta 10 dígitos
 * El algoritmo se adapta a la longitud del número ingresado
 * 
 * Algoritmo:
 * 1. Usar vector de pesos según la longitud: [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]
 * 2. Multiplicar cada dígito por el peso correspondiente (de atrás hacia adelante)
 * 3. Sumar todos los productos
 * 4. Calcular residuo = suma % 11
 * 5. Si residuo > 1 → dígito verificador = 11 - residuo
 *    Si residuo ≤ 1 → dígito verificador = residuo
 */

export default function NITValidator() {
  const [nit, setNit] = useState('');
  const [result, setResult] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState([]);

  const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];

  const calculateCheckDigit = (nitNumber) => {
    const nitStr = nitNumber.toString().trim();
    const calculationSteps = [];

    // Validar que solo contenga dígitos
    if (!/^\d+$/.test(nitStr)) {
      return {
        valid: false,
        message: '❌ Solo se permiten dígitos',
        steps: []
      };
    }

    // Validar longitud (1 a 10 dígitos para el número base)
    const length = nitStr.length;
    if (length < 1 || length > 10) {
      return {
        valid: false,
        message: '❌ El documento debe tener entre 1 y 10 dígitos',
        steps: []
      };
    }

    // Calcular el dígito verificador usando el algoritmo colombiano
    let accumulator = 0;
    
    for (let i = 0; i < length; i++) {
      const digit = parseInt(nitStr.charAt(i));
      const weight = weights[length - i]; // Los pesos van de atrás hacia adelante
      const product = digit * weight;
      accumulator += product;

      calculationSteps.push({
        step: i + 1,
        digit,
        weight,
        product,
        cumulative: accumulator
      });
    }

    // Calcular el residuo
    const residue = accumulator % 11;
    
    // Determinar el dígito verificador
    let checkDigit;
    if (residue > 1) {
      checkDigit = 11 - residue;
    } else {
      checkDigit = residue;
    }

    const fullNumber = nitStr + checkDigit;

    return {
      valid: true,
      nit: nitStr,
      accumulator,
      residue,
      checkDigit,
      fullNumber,
      steps: calculationSteps
    };
  };

  const handleValidate = () => {
    if (!nit.trim()) {
      setResult({
        valid: false,
        message: '⚠️ Por favor ingresa un documento'
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
            placeholder="Ingresa el documento (1-10 dígitos)"
            value={nit}
            onChange={handleInputChange}
            maxLength={10}
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
                  <h3>✅ Documento Válido</h3>
                  
                  <div className={styles.resultContent}>
                    <div className={styles.resultItem}>
                      <strong>Documento sin dígito:</strong>
                      <code>{result.nit}</code>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <strong>Dígito Verificador:</strong>
                      <code className={styles.highlightDigit}>{result.checkDigit}</code>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <strong>Documento Completo:</strong>
                      <code className={styles.fullNIT}>{result.fullNumber}</code>
                    </div>
                  </div>

                  <div className={styles.copySection}>
                    <button
                      className={styles.buttonCopy}
                      onClick={() => {
                        navigator.clipboard.writeText(result.fullNumber);
                        alert('Documento copiado al portapapeles');
                      }}
                    >
                      📋 Copiar Documento Completo
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
                          <strong>Acumulador Total:</strong> {result.accumulator}
                        </div>
                        <div className={styles.step}>
                          <strong>Módulo 11:</strong> {result.accumulator} % 11 = {result.residue}
                        </div>
                        <div className={styles.step}>
                          <strong>Dígito Verificador:</strong>
                          {result.residue > 1 ? (
                            <span> 11 - {result.residue} = <strong className={styles.highlightDigit}>{result.checkDigit}</strong></span>
                          ) : (
                            <span> {result.residue} (residuo ≤ 1) = <strong className={styles.highlightDigit}>{result.checkDigit}</strong></span>
                          )}
                        </div>
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
            <li>Los documentos colombianos tienen hasta 10 dígitos (pueden tener menos)</li>
            <li>El dígito verificador se calcula usando pesos específicos (3, 7, 13, 17, 19, 23, 29, 37, 41, 43...)</li>
            <li>El algoritmo se adapta automáticamente a la longitud del documento</li>
            <li>Este validador usa el mismo algoritmo oficial de Colombia (DIAN)</li>
            <li>Si residuo {'>'} 1: DV = 11 - residuo | Si residuo ≤ 1: DV = residuo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
