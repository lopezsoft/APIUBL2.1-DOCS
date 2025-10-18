"use strict";
/**
 * RAG Service - Retrieval-Augmented Generation
 *
 * Propósito:
 * - Leer documentación de /docs y /docs-dian
 * - Indexar contenido para búsquedas rápidas
 * - Recuperar contexto relevante según pregunta
 * - Inyectar en prompts de OpenAI
 *
 * Flujo:
 * 1. Lectura de .md files
 * 2. Búsqueda por palabras clave
 * 3. Ranking por relevancia
 * 4. Extracción de fragmentos
 * 5. Inyección en contexto de GPT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ragService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ============================================================================
// CONFIGURACIÓN
// ============================================================================
const DOCS_PATHS = [
    path_1.default.join(process.cwd(), 'docs'),
    path_1.default.join(process.cwd(), 'docs-dian'),
];
const SUPPORTED_EXTENSIONS = ['.md', '.json'];
// ============================================================================
// CLASE RAG SERVICE
// ============================================================================
class RAGService {
    constructor() {
        this.documentIndex = new Map();
        this.isInitialized = false;
    }
    /**
     * Inicializa el servicio cargando toda la documentación
     */
    async initialize() {
        if (this.isInitialized) {
            console.log('✅ RAG Service ya inicializado');
            return;
        }
        console.log('🔄 Inicializando RAG Service...');
        try {
            for (const docPath of DOCS_PATHS) {
                if (fs_1.default.existsSync(docPath)) {
                    await this.indexDirectory(docPath);
                }
            }
            this.isInitialized = true;
            console.log(`✅ RAG Service inicializado con ${this.documentIndex.size} documentos`);
        }
        catch (error) {
            console.error('❌ Error inicializando RAG Service:', error);
            this.isInitialized = false;
        }
    }
    /**
     * Indexa recursivamente todos los archivos en un directorio
     */
    async indexDirectory(dirPath) {
        try {
            const files = fs_1.default.readdirSync(dirPath, { recursive: true });
            for (const file of files) {
                const filePath = path_1.default.join(dirPath, file);
                const stat = fs_1.default.statSync(filePath);
                if (stat.isFile()) {
                    const ext = path_1.default.extname(filePath);
                    if (SUPPORTED_EXTENSIONS.includes(ext)) {
                        await this.indexFile(filePath);
                    }
                }
            }
        }
        catch (error) {
            console.error(`Error indexando directorio ${dirPath}:`, error);
        }
    }
    /**
     * Indexa un archivo individual
     */
    async indexFile(filePath) {
        try {
            const content = fs_1.default.readFileSync(filePath, 'utf-8');
            const relativePath = path_1.default.relative(process.cwd(), filePath);
            const category = this.getCategoryFromPath(filePath);
            const title = this.extractTitle(content, filePath);
            const keywords = this.extractKeywords(content);
            const excerpt = content.substring(0, 500);
            const chunk = {
                id: relativePath,
                source: relativePath,
                category,
                title,
                content,
                excerpt,
                keywords,
            };
            this.documentIndex.set(relativePath, chunk);
        }
        catch (error) {
            console.error(`Error indexando archivo ${filePath}:`, error);
        }
    }
    /**
     * Determina la categoría según la ruta
     */
    getCategoryFromPath(filePath) {
        if (filePath.includes('docs-dian'))
            return 'docs-dian';
        if (filePath.includes('docs-json'))
            return 'docs-json';
        return 'docs';
    }
    /**
     * Extrae el título del contenido
     */
    extractTitle(content, filePath) {
        // Busca primer h1 (# Título)
        const match = content.match(/^#\s+(.+)$/m);
        if (match)
            return match[1];
        // Si no, usa nombre del archivo
        return path_1.default.basename(filePath, path_1.default.extname(filePath));
    }
    /**
     * Extrae palabras clave del contenido
     */
    extractKeywords(content) {
        // Palabras comunes en API/facturación
        const keywords = [];
        const terms = [
            'endpoint', 'api', 'invoice', 'factura', 'nómina', 'payroll',
            'dian', 'validación', 'documento', 'soporte', 'impuesto', 'tax',
            'cliente', 'customer', 'línea', 'line', 'total', 'régimen',
            'operación', 'operation', 'descuento', 'discount', 'nit',
            'bedrock', 'openai', 'chat', 'campo', 'field', 'response',
            'error', 'validación', 'xml', 'json', 'formato', 'format',
        ];
        const contentLower = content.toLowerCase();
        for (const term of terms) {
            if (contentLower.includes(term)) {
                keywords.push(term);
            }
        }
        return keywords;
    }
    /**
     * Busca documentos relevantes para una pregunta
     */
    async search(query, topK = 3) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        const queryTerms = this.tokenizeQuery(query);
        const results = [];
        // Calcula relevancia para cada documento
        for (const [, chunk] of this.documentIndex) {
            const relevance = this.calculateRelevance(queryTerms, chunk);
            const matchedKeywords = queryTerms.filter(term => chunk.keywords.some(kw => kw.includes(term) || term.includes(kw)));
            if (relevance > 0.1) {
                results.push({
                    chunk,
                    relevance,
                    matchedKeywords,
                });
            }
        }
        // Ordena por relevancia (descendente)
        results.sort((a, b) => b.relevance - a.relevance);
        // Prioriza docs-dian si es sobre regulatorio
        if (this.isRegulatoryQuery(query)) {
            results.sort((a, b) => {
                if (a.chunk.category === 'docs-dian' && b.chunk.category !== 'docs-dian')
                    return -1;
                if (a.chunk.category !== 'docs-dian' && b.chunk.category === 'docs-dian')
                    return 1;
                return b.relevance - a.relevance;
            });
        }
        return results.slice(0, topK);
    }
    /**
     * Tokeniza la pregunta en términos
     */
    tokenizeQuery(query) {
        return query
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(term => term.length > 2);
    }
    /**
     * Calcula relevancia entre query y documento
     */
    calculateRelevance(queryTerms, chunk) {
        let score = 0;
        const contentLower = chunk.content.toLowerCase();
        const titleLower = chunk.title.toLowerCase();
        for (const term of queryTerms) {
            // Puntos por coincidencia en título (mayor peso)
            if (titleLower.includes(term)) {
                score += 0.3;
            }
            // Puntos por coincidencia en keywords
            if (chunk.keywords.some(kw => kw.includes(term))) {
                score += 0.2;
            }
            // Puntos por coincidencia en contenido
            const occurrences = (contentLower.match(new RegExp(term, 'g')) || []).length;
            score += Math.min(occurrences * 0.01, 0.2);
        }
        return Math.min(score, 1);
    }
    /**
     * Detecta si es pregunta sobre regulatorio/DIAN
     */
    isRegulatoryQuery(query) {
        const regulatoryTerms = ['dian', 'regulatorio', 'resolución', 'normativa', 'validación', 'requisito', 'obligatorio', 'norma'];
        const queryLower = query.toLowerCase();
        return regulatoryTerms.some(term => queryLower.includes(term));
    }
    /**
     * Obtiene contexto para inyectar en prompt
     */
    async getContext(query, topK = 3) {
        const results = await this.search(query, topK);
        let contextText = '';
        if (results.length > 0) {
            contextText = '### CONTEXTO DE DOCUMENTACIÓN\n\n';
            for (const result of results) {
                contextText += `**Fuente**: ${result.chunk.source} (Relevancia: ${(result.relevance * 100).toFixed(0)}%)\n`;
                contextText += `**Título**: ${result.chunk.title}\n`;
                contextText += `\`\`\`\n${result.chunk.excerpt}\n...\n\`\`\`\n\n`;
            }
        }
        return {
            query,
            results,
            contextText,
        };
    }
    /**
     * Obtiene estadísticas del índice
     */
    getStats() {
        const stats = {
            totalDocuments: this.documentIndex.size,
            byCategory: {
                docs: 0,
                'docs-dian': 0,
                'docs-json': 0,
            },
            sources: [],
        };
        for (const [, chunk] of this.documentIndex) {
            stats.byCategory[chunk.category]++;
            if (!stats.sources.includes(chunk.source)) {
                stats.sources.push(chunk.source);
            }
        }
        return stats;
    }
}
// ============================================================================
// EXPORTAR INSTANCIA SINGLETON
// ============================================================================
exports.ragService = new RAGService();
// Inicializar en background cuando se carga el módulo
exports.ragService.initialize().catch(err => console.error('Error inicializando RAG:', err));
exports.default = exports.ragService;
//# sourceMappingURL=rag.service.js.map