import React, { useState, useCallback, type ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import {
  FaDownload,
  FaRegCopy,
  FaCheck,
  FaTerminal,
  FaRobot,
  FaFileCode,
  FaBolt,
  FaRocket,
  FaFileInvoiceDollar,
  FaHeartPulse,
  FaBriefcase,
  FaShieldHalved,
  FaArrowUpRightFromSquare,
} from 'react-icons/fa6';
import styles from './styles.module.css';

type AiPackItem = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  icon: string;
  description: string;
  url: string;
  docCount: number;
};

type LlmsPluginData = {
  aiPacks?: AiPackItem[];
};

const IDE_RULES = [
  {
    id: 'skill-md',
    name: 'SKILL.md Oficial',
    target: 'Antigravity · Claude Code · Cursor · Codex',
    pathHint: '.claude/skills/matias-api-ubl21/SKILL.md o .gemini/skills/matias-api-ubl21/SKILL.md',
    url: '/ai/matias-api-skill/SKILL.md',
    downloadName: 'SKILL.md',
    badge: 'Recomendado',
    description:
      'Skill estándar con frontmatter YAML, reglas de cálculo UBL 2.1, separación Sandbox/Producción, multi-tenant (?client_uuid) y manejo de concurrencia DIAN.',
  },
  {
    id: 'agents-md',
    name: 'AGENTS.md',
    target: 'Estándar Universal (Raíz del proyecto)',
    pathHint: 'AGENTS.md en la raíz de tu repositorio',
    url: '/ai/AGENTS.md',
    downloadName: 'AGENTS.md',
    badge: 'Universal',
    description:
      'Archivo estándar leído automáticamente por OpenAI Codex, Antigravity, Claude Code, Cursor y agentes autónomos al abrir tu repositorio.',
  },
  {
    id: 'cursorrules',
    name: '.cursorrules / .mdc',
    target: 'Cursor IDE',
    pathHint: '.cursorrules o .cursor/rules/matias-api.mdc',
    url: '/ai/matias-api.cursorrules',
    downloadName: '.cursorrules',
    badge: 'Cursor',
    description:
      'Reglas listas para Cursor IDE: evita alucinaciones de campos UBL 2.1, exige cabeceras Accept: application/json y valida cálculos antes de enviar.',
  },
  {
    id: 'claude-md',
    name: 'CLAUDE.md',
    target: 'Claude Code CLI / Desktop',
    pathHint: 'CLAUDE.md en la raíz de tu proyecto',
    url: '/ai/CLAUDE.md',
    downloadName: 'CLAUDE.md',
    badge: 'Claude Code',
    description:
      'Memoria persistente de proyecto para Claude Code con contratos de endpoints, códigos de documento DIAN y flujos de recuperación de errores.',
  },
  {
    id: 'copilot-md',
    name: 'copilot-instructions.md',
    target: 'GitHub Copilot (VS Code / JetBrains)',
    pathHint: '.github/copilot-instructions.md',
    url: '/ai/copilot-instructions.md',
    downloadName: 'copilot-instructions.md',
    badge: 'Copilot',
    description:
      'Instrucciones contextuales para GitHub Copilot Chat y ediciones inline en VS Code o Visual Studio.',
  },
];

const LANGUAGES = [
  { id: 'nodejs', label: 'Node.js / TypeScript' },
  { id: 'php', label: 'PHP / Laravel' },
  { id: 'python', label: 'Python / FastAPI / Django' },
  { id: 'csharp', label: 'C# / .NET' },
  { id: 'java', label: 'Java / Spring Boot' },
  { id: 'go', label: 'Go (Golang)' },
];

const TASKS = [
  {
    id: 'invoice',
    label: 'Emitir Factura Electrónica (FEV)',
    packUrl: '/ai/packs/invoicing-pos-notes.md',
    goal: 'implementar la emisión de Factura Electrónica de Venta (POST /invoice) con cálculo exacto de legal_monetary_totals, impuestos y validación de NIT Módulo 11, incluyendo uuid de idempotencia',
  },
  {
    id: 'health',
    label: 'Sector Salud RIPS (Res. 000948 de 2026)',
    packUrl: '/ai/packs/health-sector-rips.md',
    goal: 'integrar la emisión de Factura Electrónica del Sector Salud con el objeto health conforme a la Resolución 000948 de 2026 (RIPS, modalidades de pago, copagos y cuotas moderadoras)',
  },
  {
    id: 'software-house',
    label: 'Casa de Software Multi-Tenant (?client_uuid)',
    packUrl: '/ai/packs/quickstart-auth-sandbox.md',
    goal: 'estructurar un cliente HTTP multi-empresa para una Casa de Software que cree clientes con POST /company/{uuid}/customer y opere en su nombre enviando ?client_uuid={uuid}',
  },
  {
    id: 'payroll',
    label: 'Nómina Electrónica y Documento Soporte',
    packUrl: '/ai/packs/payroll-support-doc.md',
    goal: 'integrar la emisión de Nómina Electrónica (POST /payroll, reemplazo y eliminación) y Documento Soporte (POST /ds/document)',
  },
  {
    id: 'resilience',
    label: 'Manejo de Concurrencia, Errores 409 y Regla 90 DIAN',
    packUrl: '/ai/packs/troubleshooting-errors.md',
    goal: 'implementar el manejo resiliente de respuestas de MATIAS API evitando reemitir consecutivos ante errores 409 (DOCUMENT_IN_TRANSMISSION, DOCUMENT_IN_VALIDATION), 503 (DIAN_STATUS_UNAVAILABLE), 500 (DOCUMENT_POSSIBLY_SENT), conciliación de Regla 90 (ALREADY_AUTHORIZED_*) y warnings de PDF/Email',
  },
  {
    id: 'bulk-radian',
    label: 'Envíos Masivos (API Bulk), RADIAN y Webhooks HMAC',
    packUrl: '/ai/packs/radian-bulk-webhooks.md',
    goal: 'implementar envíos por lotes asíncronos (POST /documents/bulk), eventos RADIAN y un receptor de Webhooks con verificación de firma HMAC-SHA256',
  },
];

async function copyUrlContent(url: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  await navigator.clipboard.writeText(text);
}

export default function AiHub(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const pluginData = usePluginData('docusaurus-plugin-llms-txt') as LlmsPluginData | undefined;
  const siteUrl = siteConfig.url.replace(/\/+$/, '');

  const [terminalTab, setTerminalTab] = useState<'bash' | 'powershell' | 'manual'>('bash');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>('nodejs');
  const [selectedTask, setSelectedTask] = useState<string>('invoice');

  const triggerCopyFeedback = useCallback((id: string) => {
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2400);
  }, []);

  const handleCopyText = useCallback(
    async (id: string, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        triggerCopyFeedback(id);
      } catch {
        // Fallback silencioso
      }
    },
    [triggerCopyFeedback],
  );

  const handleCopyRemoteFile = useCallback(
    async (id: string, url: string) => {
      try {
        await copyUrlContent(url);
        triggerCopyFeedback(id);
      } catch {
        // Si falla la descarga en dev, copiar la URL absoluta
        await navigator.clipboard.writeText(`${siteUrl}${url}`);
        triggerCopyFeedback(id);
      }
    },
    [siteUrl, triggerCopyFeedback],
  );

  const bashCommand = `curl -fsSL ${siteUrl}/ai/install-skill.sh | bash`;
  const psCommand = `irm ${siteUrl}/ai/install-skill.ps1 | iex`;
  const manualCommands = `# Descargar Skill para Claude Code / Antigravity y Reglas para Cursor
mkdir -p .claude/skills/matias-api-ubl21 .gemini/skills/matias-api-ubl21 .cursor/rules
curl -fsSL ${siteUrl}/ai/matias-api-skill/SKILL.md -o .claude/skills/matias-api-ubl21/SKILL.md
cp .claude/skills/matias-api-ubl21/SKILL.md .gemini/skills/matias-api-ubl21/SKILL.md
curl -fsSL ${siteUrl}/ai/matias-api.cursorrules -o .cursor/rules/matias-api.mdc
curl -fsSL ${siteUrl}/openapi.json -o .claude/skills/matias-api-ubl21/openapi.json`;

  const currentLangObj = LANGUAGES.find((l) => l.id === selectedLang) ?? LANGUAGES[0];
  const currentTaskObj = TASKS.find((t) => t.id === selectedTask) ?? TASKS[0];

  const generatedPrompt = `Actúa como un Arquitecto de Software experto en facturación electrónica DIAN UBL 2.1 con MATIAS API.

Lee primero las reglas oficiales y el paquete de contexto técnico:
1. Skill Oficial y Reglas de Negocio: ${siteUrl}/ai/matias-api-skill/SKILL.md
2. Paquete de Contexto del Módulo: ${siteUrl}${currentTaskObj.packUrl}
3. Contrato OpenAPI 3.0: ${siteUrl}/openapi.json

Mi proyecto está desarrollado en **${currentLangObj.label}**.
Necesito ${currentTaskObj.goal}.

Requisitos obligatorios:
- Configura la URL base parametrizable por entorno (Sandbox: https://sandbox-api.matias-api.com/api/ubl2.1 vs Producción), recordando que usan cuentas y tokens independientes.
- Incluye siempre las cabeceras Authorization: Bearer {token}, Accept: application/json y Content-Type: application/json.
- No inventes nombres de campos ni endpoints fuera del contrato oficial.
- Entrega código limpio, tipado y con manejo explícito de errores HTTP (401, 404 en login, 409, 422, 500 y 503).`;

  const encodedPrompt = encodeURIComponent(generatedPrompt);

  const packs = pluginData?.aiPacks ?? [];

  const getPackIcon = (iconName: string) => {
    switch (iconName) {
      case 'rocket':
        return <FaRocket aria-hidden="true" />;
      case 'invoice':
        return <FaFileInvoiceDollar aria-hidden="true" />;
      case 'health':
        return <FaHeartPulse aria-hidden="true" />;
      case 'payroll':
        return <FaBriefcase aria-hidden="true" />;
      case 'bolt':
        return <FaBolt aria-hidden="true" />;
      default:
        return <FaShieldHalved aria-hidden="true" />;
    }
  };

  return (
    <div className={styles.hubWrapper}>
      {/* 1. Instalador CLI en 1 Paso */}
      <section className={styles.cliCard} aria-labelledby="cli-install-heading">
        <div className={styles.cliHeader}>
          <div>
            <span className={styles.sectionEyebrow}>
              <FaTerminal aria-hidden="true" /> Instalación Rápida en tu Proyecto
            </span>
            <h2 id="cli-install-heading" className={styles.cliTitle}>
              Instala el Skill Oficial y Contexto de MATIAS API en 1 comando
            </h2>
            <p className={styles.cliSubtitle}>
              Configura automáticamente <strong>Antigravity</strong> (<code>.gemini/skills</code>),{' '}
              <strong>Claude Code</strong> (<code>.claude/skills</code>), <strong>Cursor</strong> (
              <code>.cursor/rules</code>) y descarga los 6 paquetes de referencia +{' '}
              <code>openapi.json</code> dentro de tu repositorio.
            </p>
          </div>
        </div>

        <div className={styles.terminalTabs} role="tablist" aria-label="Sistema operativo para instalación">
          <button
            type="button"
            role="tab"
            aria-selected={terminalTab === 'bash'}
            className={`${styles.terminalTab} ${terminalTab === 'bash' ? styles.terminalTabActive : ''}`}
            onClick={() => setTerminalTab('bash')}
          >
            macOS / Linux / Git Bash
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={terminalTab === 'powershell'}
            className={`${styles.terminalTab} ${terminalTab === 'powershell' ? styles.terminalTabActive : ''}`}
            onClick={() => setTerminalTab('powershell')}
          >
            Windows PowerShell
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={terminalTab === 'manual'}
            className={`${styles.terminalTab} ${terminalTab === 'manual' ? styles.terminalTabActive : ''}`}
            onClick={() => setTerminalTab('manual')}
          >
            Comandos cURL Individuales
          </button>
        </div>

        <div className={styles.terminalBody}>
          <pre className={styles.terminalCode}>
            <code>
              {terminalTab === 'bash'
                ? bashCommand
                : terminalTab === 'powershell'
                  ? psCommand
                  : manualCommands}
            </code>
          </pre>
          <button
            type="button"
            className={styles.terminalCopyBtn}
            onClick={() =>
              handleCopyText(
                `cli-${terminalTab}`,
                terminalTab === 'bash'
                  ? bashCommand
                  : terminalTab === 'powershell'
                    ? psCommand
                    : manualCommands,
              )
            }
          >
            {copiedId === `cli-${terminalTab}` ? (
              <>
                <FaCheck aria-hidden="true" /> ¡Copiado!
              </>
            ) : (
              <>
                <FaRegCopy aria-hidden="true" /> Copiar comando
              </>
            )}
          </button>
        </div>
      </section>

      {/* 2. Descarga de Skills y Reglas para IDEs */}
      <section className={styles.sectionBlock} aria-labelledby="ide-skills-heading">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <FaRobot aria-hidden="true" /> Skills y Reglas para Editores con IA
          </span>
          <h2 id="ide-skills-heading">Descarga el Skill o archivo de reglas para tu IDE</h2>
          <p>
            Descarga el archivo listo para colocar en tu repositorio o copia su contenido con un clic. Se regeneran automáticamente en cada versión de la documentación.
          </p>
        </div>

        <div className={styles.rulesGrid}>
          {IDE_RULES.map((rule) => (
            <div key={rule.id} className={styles.ruleCard}>
              <div className={styles.ruleTop}>
                <span className={styles.ruleBadge}>{rule.badge}</span>
                <span className={styles.ruleTarget}>{rule.target}</span>
              </div>
              <h3 className={styles.ruleTitle}>{rule.name}</h3>
              <p className={styles.ruleDesc}>{rule.description}</p>
              <div className={styles.rulePath}>
                <code>{rule.pathHint}</code>
              </div>
              <div className={styles.ruleActions}>
                <a
                  href={rule.url}
                  download={rule.downloadName}
                  className={styles.btnPrimarySmall}
                >
                  <FaDownload aria-hidden="true" /> Descargar
                </a>
                <button
                  type="button"
                  className={styles.btnOutlineSmall}
                  onClick={() => handleCopyRemoteFile(`rule-${rule.id}`, rule.url)}
                >
                  {copiedId === `rule-${rule.id}` ? (
                    <>
                      <FaCheck aria-hidden="true" /> ¡Copiado!
                    </>
                  ) : (
                    <>
                      <FaRegCopy aria-hidden="true" /> Copiar contenido
                    </>
                  )}
                </button>
                <a
                  href={rule.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnGhostSmall}
                >
                  Ver <FaArrowUpRightFromSquare aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Paquetes Modulares de Contexto Descargables */}
      <section className={styles.sectionBlock} aria-labelledby="modular-packs-heading">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <FaFileCode aria-hidden="true" /> Contexto Modular Optimizado en Tokens
          </span>
          <h2 id="modular-packs-heading">Paquetes de Documentación por Módulo Funcional</h2>
          <p>
            ¿Solo vas a integrar Facturación, Sector Salud o Nómina? Descarga o copia únicamente el paquete del módulo que necesitas para ahorrar ventana de contexto en ChatGPT, Claude o tu agente local.
          </p>
        </div>

        <div className={styles.packsGrid}>
          {packs.map((pack) => (
            <div key={pack.id} className={styles.packCard}>
              <div className={styles.packHeader}>
                <div className={styles.packIconWrap}>{getPackIcon(pack.icon)}</div>
                <div>
                  <span className={styles.packCategory}>
                    {pack.category} · {pack.docCount} docs consolidados
                  </span>
                  <h3 className={styles.packTitle}>{pack.title}</h3>
                </div>
              </div>
              <p className={styles.packDesc}>{pack.description}</p>
              <div className={styles.packActions}>
                <a
                  href={pack.url}
                  download={`matias-api-pack-${pack.id}.md`}
                  className={styles.btnPrimarySmall}
                >
                  <FaDownload aria-hidden="true" /> Descargar .md
                </a>
                <button
                  type="button"
                  className={styles.btnOutlineSmall}
                  onClick={() => handleCopyRemoteFile(`pack-${pack.id}`, pack.url)}
                >
                  {copiedId === `pack-${pack.id}` ? (
                    <>
                      <FaCheck aria-hidden="true" /> ¡Copiado!
                    </>
                  ) : (
                    <>
                      <FaRegCopy aria-hidden="true" /> Copiar Markdown
                    </>
                  )}
                </button>
                <a
                  href={pack.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnGhostSmall}
                >
                  Abrir <FaArrowUpRightFromSquare aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Generador Interactivo de Prompts */}
      <section className={styles.promptBuilderCard} aria-labelledby="prompt-builder-heading">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <FaBolt aria-hidden="true" /> Generador de Prompts Técnicos
          </span>
          <h2 id="prompt-builder-heading">Crea un Prompt listo para ChatGPT, Claude o Cursor</h2>
          <p>
            Selecciona tu lenguaje de programación y el caso de uso que vas a construir. El prompt incluirá automáticamente las reglas oficiales UBL 2.1 y el paquete de contexto exacto.
          </p>
        </div>

        <div className={styles.builderControls}>
          <div className={styles.controlGroup}>
            <label htmlFor="ai-lang-select">1. Tu lenguaje o framework:</label>
            <select
              id="ai-lang-select"
              className={styles.selectInput}
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="ai-task-select">2. ¿Qué deseas implementar hoy?</label>
            <select
              id="ai-task-select"
              className={styles.selectInput}
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              {TASKS.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.promptPreviewWrap}>
          <pre className={styles.promptPreview}>{generatedPrompt}</pre>
        </div>

        <div className={styles.promptActions}>
          <button
            type="button"
            className={styles.btnPrimaryLarge}
            onClick={() => handleCopyText('custom-prompt', generatedPrompt)}
          >
            {copiedId === 'custom-prompt' ? (
              <>
                <FaCheck aria-hidden="true" /> ¡Prompt copiado al portapapeles!
              </>
            ) : (
              <>
                <FaRegCopy aria-hidden="true" /> Copiar Prompt
              </>
            )}
          </button>
          <a
            href={`https://chatgpt.com/?hints=search&q=${encodedPrompt}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnSecondaryLarge}
          >
            <FaRobot aria-hidden="true" /> Abrir en ChatGPT
          </a>
          <a
            href={`https://claude.ai/new?q=${encodedPrompt}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnSecondaryLarge}
          >
            <FaRobot aria-hidden="true" /> Abrir en Claude
          </a>
        </div>
      </section>
    </div>
  );
}
