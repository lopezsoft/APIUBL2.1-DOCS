#!/usr/bin/env node
/**
 * Launcher para Docusaurus (start / serve) que garantiza:
 * 1. Resolución automática de un puerto libre a partir de 3080 en 127.0.0.1
 *    para que Docusaurus NUNCA bloquee la consola preguntando:
 *    "Would you like to run the app on another port instead? (Y/n)"
 * 2. Apertura automática e inmediata del navegador (desactivando CI=true si
 *    el entorno de terminal lo inyecta).
 */

const { spawn } = require('child_process');
const path = require('path');
const detectPortModule = require('detect-port');

const detectPort = detectPortModule.default || detectPortModule;

const BASE_PORT = Number(process.env.PORT) || 3080;
const HOST = process.env.HOST || '127.0.0.1';

async function main() {
  const mode = process.argv[2] === 'serve' ? 'serve' : 'start';
  const extraArgs = process.argv.slice(3);

  // Resolver un puerto garantizado libre en HOST (127.0.0.1) para evitar el prompt interactivo (Y/n)
  const resolvedPort = await detectPort({
    port: BASE_PORT,
    hostname: HOST,
  });

  if (resolvedPort !== BASE_PORT) {
    console.log(
      `[MATIAS-DOCS] Puerto ${BASE_PORT} ocupado; iniciando automáticamente en http://${HOST}:${resolvedPort} sin confirmación manual...`
    );
  } else {
    console.log(
      `[MATIAS-DOCS] Iniciando servidor (${mode}) en http://${HOST}:${resolvedPort} ...`
    );
  }

  const docusaurusBin = path.resolve(
    __dirname,
    '..',
    'node_modules',
    '@docusaurus',
    'core',
    'bin',
    'docusaurus.mjs'
  );

  const childEnv = {
    ...process.env,
    // Garantizar que Docusaurus no omita abrir el navegador si la terminal define CI=true
    CI: 'false',
  };

  const args = [
    docusaurusBin,
    mode,
    '--port',
    String(resolvedPort),
    '--host',
    HOST,
    ...extraArgs,
  ];

  const child = spawn(process.execPath, args, {
    stdio: 'inherit',
    env: childEnv,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error('[MATIAS-DOCS] Error al iniciar Docusaurus:', err);
  process.exit(1);
});
