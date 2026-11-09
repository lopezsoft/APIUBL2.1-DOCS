import React, { useState, useEffect, useRef, useMemo, useCallback, type ReactNode } from 'react';
import { useHistory } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import {
  FaMagnifyingGlass,
  FaArrowTurnDown,
  FaBook,
  FaHashtag,
  FaTriangleExclamation,
  FaRobot,
  FaPlug,
  FaCode,
  FaXmark,
} from 'react-icons/fa6';
import styles from './styles.module.css';

type HeadingItem = {
  level: number;
  title: string;
  id: string;
};

type SearchDocItem = {
  id: string;
  title: string;
  section: string;
  description: string;
  permalink: string;
  markdownPath: string;
  headings: HeadingItem[];
};

type LlmsPluginData = {
  searchIndex?: SearchDocItem[];
};

type SearchResult = {
  key: string;
  title: string;
  subtitle: string;
  section: string;
  url: string;
  kind: 'doc' | 'heading' | 'curated';
  badge?: string;
  score: number;
};

/** Accesos directos curados para los casos de soporte más frecuentes. */
const CURATED_SHORTCUTS: Array<{
  title: string;
  subtitle: string;
  section: string;
  url: string;
  badge: string;
  keywords: string[];
}> = [
  {
    title: 'Login responde HTTP 404 (Correo sin verificar o entorno incorrecto)',
    subtitle: 'Por qué POST /auth/login devuelve 404 y cómo reenviar el correo de activación',
    section: 'Soporte Frecuente · Autenticación',
    url: '/docs/intro/#obtener-el-token-de-acceso',
    badge: 'Top Soporte',
    keywords: ['404', 'login', 'credenciales invalidas', 'correo no verificado', 'auth', 'token', 'verificar'],
  },
  {
    title: 'Diferencia entre Cuenta de Sandbox y Cuenta de Producción',
    subtitle: 'Las credenciales no se comparten entre entornos: URLs y registro independiente',
    section: 'Soporte Frecuente · Entornos',
    url: '/docs/intro/#cuentas-separadas-prod-sandbox',
    badge: 'Top Soporte',
    keywords: ['sandbox', 'produccion', 'credenciales', 'url base', 'entornos', 'cuentas separadas'],
  },
  {
    title: 'Errores 409, 503, DOCUMENT_POSSIBLY_SENT y Regla 90 DIAN',
    subtitle: 'Cuándo NO reemitir un documento con otro consecutivo y cómo consultar su estado',
    section: 'Soporte Frecuente · Concurrencia DIAN',
    url: '/docs/use-cases/common-errors/#errores-de-transmision-concurrente-validacion-pendiente-y-posible-envio',
    badge: 'Crítico DIAN',
    keywords: [
      '409',
      '503',
      '500',
      'regla 90',
      'duplicado',
      'document_in_transmission',
      'document_in_validation',
      'document_possibly_sent',
      'already_authorized',
      'warnings',
      'pdf_not_generated',
    ],
  },
  {
    title: 'Casas de Software: Operar con ?client_uuid y crear clientes',
    subtitle: 'Cómo crear sub-empresas con POST /company/{uuid}/customer y emitir en su nombre',
    section: 'Soporte Frecuente · Multi-Tenant',
    url: '/docs/endpoints/company/#clientes-casa-software',
    badge: 'Casa Software',
    keywords: ['client_uuid', 'casa de software', 'multi-tenant', 'company', 'customer', 'sub-cuenta', '422 register'],
  },
  {
    title: 'Sector Salud (Resolución 000948 de 2026) y Campos RIPS',
    subtitle: 'Estructura del objeto health, usuarios, copagos, moderadoras y ejemplo JSON completo',
    section: 'Emisión · Sector Salud',
    url: '/docs/jsons-billing/invoice-health-sector/',
    badge: 'Res. 000948',
    keywords: ['salud', 'rips', '000948', 'health', 'copago', 'cuota moderadora', 'eps', 'prestador'],
  },
  {
    title: 'Descargar SKILL.md, Reglas IDE y Paquetes para tu IA',
    subtitle: 'Instala el Skill oficial en Antigravity, Claude Code, Cursor, Copilot o descarga los packs .md',
    section: 'AI Hub & Skills',
    url: '/docs/ai-ready/',
    badge: 'AI-Ready',
    keywords: ['ia', 'ai', 'skill', 'cursor', 'claude', 'chatgpt', 'llms.txt', 'agents.md', 'descargar', 'openapi'],
  },
  {
    title: 'Calculadora de Totales, Validador JSON y Dígito Verificador NIT',
    subtitle: 'Valida el algoritmo Módulo 11 y cuadra legal_monetary_totals en el navegador',
    section: 'Herramientas Interactivas',
    url: '/docs/interactive-tools/',
    badge: 'Interactivo',
    keywords: ['nit', 'digito verificador', 'modulo 11', 'dv', 'totales', 'calculadora', 'validador json', 'impuestos'],
  },
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function openGlobalSearch(initialQuery = ''): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('matias:open-search', { detail: { query: initialQuery } }));
  }
}

export default function SearchBar(): ReactNode {
  const history = useHistory();
  const pluginData = usePluginData('docusaurus-plugin-llms-txt') as LlmsPluginData | undefined;
  const searchIndex = pluginData?.searchIndex ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const openModal = useCallback((initialQuery = '') => {
    setQuery(initialQuery);
    setSelectedIndex(0);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }
      if (
        event.key === '/' &&
        !isOpen &&
        document.activeElement &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) &&
        !(document.activeElement as HTMLElement).isContentEditable
      ) {
        event.preventDefault();
        openModal('');
      }
    };

    const handleCustomOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ query?: string }>;
      openModal(customEvent.detail?.query ?? '');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('matias:open-search', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('matias:open-search', handleCustomOpen);
    };
  }, [isOpen, openModal]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const results = useMemo<SearchResult[]>(() => {
    const cleanQuery = normalizeText(query);
    const terms = cleanQuery.split(/\s+/).filter(Boolean);

    const matchesCategory = (section: string, url: string) => {
      if (activeCategory === 'all') return true;
      const normSec = normalizeText(section);
      if (activeCategory === 'endpoints') return url.includes('/endpoints') || normSec.includes('endpoint');
      if (activeCategory === 'errors') return url.includes('common-errors') || url.includes('response-json') || normSec.includes('soporte') || normSec.includes('error');
      if (activeCategory === 'json') return url.includes('/jsons-') || url.includes('/payroll') || normSec.includes('json');
      if (activeCategory === 'ai') return url.includes('ai-ready') || normSec.includes('ai');
      return true;
    };

    if (terms.length === 0) {
      const curated = CURATED_SHORTCUTS.filter((item) => matchesCategory(item.section, item.url)).map(
        (item, index) => ({
          key: `curated-${index}`,
          title: item.title,
          subtitle: item.subtitle,
          section: item.section,
          url: item.url,
          kind: 'curated' as const,
          badge: item.badge,
          score: 100 - index,
        }),
      );
      return curated;
    }

    const scored: SearchResult[] = [];

    // 1. Evaluar atajos curados de soporte
    for (const item of CURATED_SHORTCUTS) {
      if (!matchesCategory(item.section, item.url)) continue;
      const haystack = normalizeText(`${item.title} ${item.subtitle} ${item.keywords.join(' ')}`);
      let score = 0;
      let allMatched = true;
      for (const term of terms) {
        if (haystack.includes(term)) {
          score += normalizeText(item.title).includes(term) ? 35 : 20;
        } else {
          allMatched = false;
        }
      }
      if (allMatched && score > 0) {
        scored.push({
          key: `curated-${item.url}`,
          title: item.title,
          subtitle: item.subtitle,
          section: item.section,
          url: item.url,
          kind: 'curated',
          badge: item.badge,
          score: score + 15,
        });
      }
    }

    // 2. Evaluar páginas y encabezados del índice
    for (const doc of searchIndex) {
      if (!matchesCategory(doc.section, doc.permalink)) continue;
      const normTitle = normalizeText(doc.title);
      const normDesc = normalizeText(doc.description);
      const normSec = normalizeText(doc.section);
      const normId = normalizeText(doc.id);

      let docScore = 0;
      let docMatchedAll = true;
      for (const term of terms) {
        if (normTitle.includes(term)) {
          docScore += normTitle.startsWith(term) ? 45 : 30;
        } else if (normId.includes(term)) {
          docScore += 25;
        } else if (normDesc.includes(term)) {
          docScore += 15;
        } else if (normSec.includes(term)) {
          docScore += 10;
        } else {
          docMatchedAll = false;
        }
      }

      if (docMatchedAll && docScore > 0) {
        scored.push({
          key: `doc-${doc.id}`,
          title: doc.title,
          subtitle: doc.description || doc.permalink,
          section: doc.section,
          url: doc.permalink,
          kind: 'doc',
          score: docScore,
        });
      }

      // Buscar dentro de los encabezados H2/H3 de cada página
      for (const heading of doc.headings) {
        const normHeading = normalizeText(heading.title);
        let hScore = 0;
        let hMatchedAll = true;
        for (const term of terms) {
          if (normHeading.includes(term)) {
            hScore += 28;
          } else if (normTitle.includes(term) || normSec.includes(term)) {
            hScore += 10;
          } else {
            hMatchedAll = false;
          }
        }
        if (hMatchedAll && hScore >= 28) {
          scored.push({
            key: `heading-${doc.id}-${heading.id}`,
            title: heading.title,
            subtitle: `${doc.title}`,
            section: doc.section,
            url: `${doc.permalink}#${heading.id}`,
            kind: 'heading',
            score: hScore,
          });
        }
      }
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, 18);
  }, [query, activeCategory, searchIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      closeModal();
      history.push(result.url);
    },
    [closeModal, history],
  );

  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter' && results[selectedIndex]) {
      event.preventDefault();
      navigateToResult(results[selectedIndex]);
    }
  };

  const renderIcon = (result: SearchResult) => {
    if (result.kind === 'curated') {
      if (result.url.includes('ai-ready')) return <FaRobot className={styles.resultIconAi} aria-hidden="true" />;
      if (result.url.includes('common-errors') || result.url.includes('intro'))
        return <FaTriangleExclamation className={styles.resultIconWarn} aria-hidden="true" />;
      return <FaPlug className={styles.resultIconCurated} aria-hidden="true" />;
    }
    if (result.kind === 'heading') {
      return <FaHashtag className={styles.resultIconHeading} aria-hidden="true" />;
    }
    if (result.url.includes('/jsons-')) {
      return <FaCode className={styles.resultIconDoc} aria-hidden="true" />;
    }
    return <FaBook className={styles.resultIconDoc} aria-hidden="true" />;
  };

  return (
    <>
      <button
        type="button"
        className={styles.searchButton}
        onClick={() => openModal('')}
        aria-label="Buscar en la documentación (Ctrl+K)"
      >
        <FaMagnifyingGlass className={styles.searchButtonIcon} aria-hidden="true" />
        <span className={styles.searchButtonPlaceholder}>Buscar endpoints, errores, JSON...</span>
        <kbd className={styles.searchButtonKbd}>Ctrl K</kbd>
      </button>

      {isOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={closeModal}
          role="presentation"
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Buscador de documentación MATIAS API"
          >
            {/* Barra de entrada */}
            <div className={styles.searchHeader}>
              <FaMagnifyingGlass className={styles.inputIcon} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                className={styles.searchInput}
                placeholder="Busca ej: «login 404», «client_uuid», «regla 90», «salud RIPS», «nota crédito»..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar en la documentación"
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => setQuery('')}
                  aria-label="Limpiar búsqueda"
                >
                  <FaXmark aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                className={styles.escButton}
                onClick={closeModal}
                aria-label="Cerrar buscador"
              >
                ESC
              </button>
            </div>

            {/* Filtros por categoría */}
            <div className={styles.filterBar} role="tablist" aria-label="Filtrar resultados por sección">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'endpoints', label: '🔌 Endpoints' },
                { id: 'errors', label: '🛠️ Errores y Soporte' },
                { id: 'json', label: '📦 Payloads JSON' },
                { id: 'ai', label: '🤖 AI & Skills' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`${styles.filterChip} ${activeCategory === cat.id ? styles.filterChipActive : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Lista de resultados */}
            <div className={styles.resultsList} role="listbox">
              <div className={styles.resultsSectionLabel}>
                {query.trim()
                  ? `Resultados encontrados (${results.length})`
                  : '🔥 Consultas frecuentes en Soporte y Accesos Rápidos'}
              </div>

              {results.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>No encontramos resultados exactos para «{query}»</p>
                  <p className={styles.emptySubtitle}>
                    Prueba buscando términos como <code>404</code>, <code>409</code>, <code>client_uuid</code>,{' '}
                    <code>resolución</code>, <code>salud</code>, <code>nómina</code> o revisa directamente:
                  </p>
                  <div className={styles.emptyLinks}>
                    <button
                      type="button"
                      onClick={() =>
                        navigateToResult({
                          key: 'fallback-errors',
                          title: 'Errores Comunes',
                          subtitle: '',
                          section: '',
                          url: '/docs/use-cases/common-errors/',
                          kind: 'doc',
                          score: 1,
                        })
                      }
                    >
                      🛠️ Guía de Errores Comunes
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        navigateToResult({
                          key: 'fallback-fields',
                          title: 'Campos del Documento',
                          subtitle: '',
                          section: '',
                          url: '/docs/billing-fields/',
                          kind: 'doc',
                          score: 1,
                        })
                      }
                    >
                      📋 Campos del Documento
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        navigateToResult({
                          key: 'fallback-glossary',
                          title: 'Glosario DIAN',
                          subtitle: '',
                          section: '',
                          url: '/docs/glossary/',
                          kind: 'doc',
                          score: 1,
                        })
                      }
                    >
                      📚 Glosario y Catálogos
                    </button>
                  </div>
                </div>
              ) : (
                results.map((item, idx) => (
                  <button
                    key={item.key}
                    type="button"
                    role="option"
                    aria-selected={idx === selectedIndex}
                    className={`${styles.resultItem} ${idx === selectedIndex ? styles.resultItemSelected : ''}`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => navigateToResult(item)}
                  >
                    <div className={styles.resultIconWrap}>{renderIcon(item)}</div>
                    <div className={styles.resultBody}>
                      <div className={styles.resultTopRow}>
                        <span className={styles.resultSection}>{item.section}</span>
                        {item.badge && <span className={styles.resultBadge}>{item.badge}</span>}
                      </div>
                      <div className={styles.resultTitle}>{item.title}</div>
                      {item.subtitle && <div className={styles.resultSubtitle}>{item.subtitle}</div>}
                    </div>
                    <FaArrowTurnDown className={styles.resultEnterIcon} aria-hidden="true" />
                  </button>
                ))
              )}
            </div>

            {/* Footer del modal */}
            <div className={styles.modalFooter}>
              <div className={styles.footerHints}>
                <span>
                  <kbd>↑</kbd> <kbd>↓</kbd> navegar
                </span>
                <span>
                  <kbd>↵</kbd> abrir
                </span>
                <span>
                  <kbd>ESC</kbd> cerrar
                </span>
              </div>
              <a
                href="/docs/ai-ready/"
                className={styles.footerAiLink}
                onClick={closeModal}
              >
                🤖 ¿Usas Cursor, Claude o ChatGPT? Descarga el Skill IA →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
