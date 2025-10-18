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
interface DocumentChunk {
    id: string;
    source: string;
    category: string;
    title: string;
    content: string;
    excerpt: string;
    keywords: string[];
}
interface SearchResult {
    chunk: DocumentChunk;
    relevance: number;
    matchedKeywords: string[];
}
interface RAGContext {
    query: string;
    results: SearchResult[];
    contextText: string;
}
declare class RAGService {
    private documentIndex;
    private isInitialized;
    /**
     * Inicializa el servicio cargando toda la documentación
     */
    initialize(): Promise<void>;
    /**
     * Indexa recursivamente todos los archivos en un directorio
     */
    private indexDirectory;
    /**
     * Indexa un archivo individual
     */
    private indexFile;
    /**
     * Determina la categoría según la ruta
     */
    private getCategoryFromPath;
    /**
     * Extrae el título del contenido
     */
    private extractTitle;
    /**
     * Extrae palabras clave del contenido
     */
    private extractKeywords;
    /**
     * Busca documentos relevantes para una pregunta
     */
    search(query: string, topK?: number): Promise<SearchResult[]>;
    /**
     * Tokeniza la pregunta en términos
     */
    private tokenizeQuery;
    /**
     * Calcula relevancia entre query y documento
     */
    private calculateRelevance;
    /**
     * Detecta si es pregunta sobre regulatorio/DIAN
     */
    private isRegulatoryQuery;
    /**
     * Obtiene contexto para inyectar en prompt
     */
    getContext(query: string, topK?: number): Promise<RAGContext>;
    /**
     * Obtiene estadísticas del índice
     */
    getStats(): {
        totalDocuments: number;
        byCategory: {
            docs: number;
            'docs-dian': number;
            'docs-json': number;
        };
        sources: string[];
    };
}
export declare const ragService: RAGService;
export default ragService;
//# sourceMappingURL=rag.service.d.ts.map