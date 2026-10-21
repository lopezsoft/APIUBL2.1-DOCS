import React, { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { FaCheck, FaMarkdown, FaRegCopy, FaRobot } from 'react-icons/fa';
import styles from './styles.module.css';

type LlmsGlobalData = { markdownPaths?: Record<string, string> };

type CopyState = 'idle' | 'copying' | 'copied' | 'error';

const COPY_LABELS: Record<CopyState, string> = {
  idle: 'Copiar Markdown',
  copying: 'Copiando…',
  copied: 'Copiado',
  error: 'No se pudo copiar',
};

function buildPrompt(markdownUrl: string, llmsUrl: string): string {
  return `Lee la documentación de MATIAS API en ${markdownUrl} y ayúdame a integrarla. Índice completo para agentes: ${llmsUrl}`;
}

async function fetchMarkdown(path: string): Promise<string> {
  const response = await fetch(path, { headers: { Accept: 'text/markdown' } });
  if (!response.ok) throw new Error(String(response.status));
  return response.text();
}

/**
 * Copia el Markdown de la página. Safari exige que la escritura en el
 * portapapeles empiece dentro del gesto del usuario: con ClipboardItem se
 * entrega la promesa del fetch en el mismo clic. Si no existe, writeText.
 */
async function copyMarkdownToClipboard(path: string): Promise<void> {
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    const blob = fetchMarkdown(path).then((text) => new Blob([text], { type: 'text/plain' }));
    await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
    return;
  }
  await navigator.clipboard.writeText(await fetchMarkdown(path));
}

export default function AiPageActions(): ReactNode {
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const data = usePluginData('docusaurus-plugin-llms-txt') as LlmsGlobalData | undefined;
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const markdownPath = data?.markdownPaths?.[metadata.permalink];

  const copyMarkdown = useCallback(async () => {
    if (!markdownPath || copyState === 'copying') return;
    window.clearTimeout(resetTimer.current);
    setCopyState('copying');
    try {
      await copyMarkdownToClipboard(markdownPath);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), 2500);
  }, [markdownPath, copyState]);

  if (!markdownPath) return null;

  const siteUrl = siteConfig.url.replace(/\/+$/, '');
  const prompt = encodeURIComponent(buildPrompt(`${siteUrl}${markdownPath}`, `${siteUrl}/llms.txt`));

  return (
    <>
      <Head>
        <link rel="alternate" type="text/markdown" href={markdownPath} title="Versión Markdown" />
      </Head>
      <div className={styles.actions} role="group" aria-label="Usar esta página con IA">
        <button
          type="button"
          className={styles.action}
          onClick={copyMarkdown}
          aria-busy={copyState === 'copying'}
        >
          {copyState === 'copied' ? <FaCheck aria-hidden /> : <FaRegCopy aria-hidden />}
          <span>{COPY_LABELS[copyState]}</span>
        </button>
        <a className={styles.action} href={markdownPath} target="_blank" rel="noopener">
          <FaMarkdown aria-hidden />
          <span>Ver .md</span>
        </a>
        <a
          className={styles.action}
          href={`https://chatgpt.com/?hints=search&q=${prompt}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaRobot aria-hidden />
          <span>Abrir en ChatGPT</span>
        </a>
        <a
          className={styles.action}
          href={`https://claude.ai/new?q=${prompt}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaRobot aria-hidden />
          <span>Abrir en Claude</span>
        </a>
        <span role="status" className={styles.srOnly}>
          {copyState === 'copied' || copyState === 'error' ? COPY_LABELS[copyState] : ''}
        </span>
      </div>
    </>
  );
}
