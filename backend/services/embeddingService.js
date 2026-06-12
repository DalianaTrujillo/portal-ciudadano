const { pipeline } = require('@xenova/transformers');

// Variable global para cargar el modelo una sola vez
let embeddingPipeline = null;

const loadModel = async () => {
    if (!embeddingPipeline) {
        console.log("Cargando modelo de embeddings local (all-MiniLM-L6-v2)...");
        // Utilizamos un modelo ligero multilingüe o estándar
        embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log("Modelo de embeddings cargado exitosamente.");
    }
    return embeddingPipeline;
};

/**
 * Convierte un texto en un vector numérico de 384 dimensiones.
 */
const generateEmbedding = async (text) => {
    try {
        const extractor = await loadModel();
        
        // El extractor devuelve un Tensor, obtenemos el arreglo flotante
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        
        // Convertir de Float32Array a un array estándar de JS que pgvector entienda
        const vectorArray = Array.from(output.data);
        return vectorArray;
    } catch (error) {
        console.error('Error al generar embedding:', error);
        throw error;
    }
};

module.exports = {
    generateEmbedding
};
