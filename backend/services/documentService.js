const db = require('../database/connection');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cheerio = require('cheerio');
const { marked } = require('marked');
const { detectEntityAndIntent } = require('./intentService');

const STOPWORDS = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'si', 'no', 'de', 'del', 'a', 'al', 'con', 'por', 'para', 'en', 'es', 'son', 'se', 'lo', 'su', 'sus', 'como', 'que', 'qué', 'cual', 'cuales']);

/**
 * 1. Extrae el texto crudo según el mimetype
 */
const extractText = async (fileBuffer, mimetype) => {
    try {
        if (mimetype === 'application/pdf') {
            const data = await pdfParse(fileBuffer);
            return data.text;
        } 
        if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const data = await mammoth.extractRawText({ buffer: fileBuffer });
            return data.value;
        }
        if (mimetype === 'text/html') {
            const html = fileBuffer.toString('utf-8');
            const $ = cheerio.load(html);
            return $('body').text();
        }
        if (mimetype === 'text/markdown' || mimetype === 'text/x-markdown') {
            const md = fileBuffer.toString('utf-8');
            const html = marked.parse(md);
            const $ = cheerio.load(html);
            return $('body').text();
        }
        if (mimetype === 'text/plain') {
            return fileBuffer.toString('utf-8');
        }
        throw new Error(`Formato no soportado: ${mimetype}`);
    } catch (error) {
        throw new Error(`Error extrayendo texto: ${error.message}`);
    }
};

/**
 * 2. Limpia encabezados y saltos excesivos
 */
const cleanText = (text) => {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\n\s*\n+/g, '\n\n') // Reducir multiples saltos
        .replace(/^[ \t]+|[ \t]+$/gm, '') // Limpiar bordes
        .trim();
};

/**
 * 3. Divide en fragmentos basados en subtítulos y límite de palabras (~500)
 */
const chunkText = (text, maxWords = 500) => {
    const paragraphs = text.split('\n\n');
    const chunks = [];
    let currentChunk = [];
    let currentWords = 0;
    let currentTitle = "Sección del documento";

    for (const p of paragraphs) {
        const words = p.split(/\s+/).filter(w => w.length > 0);
        
        // Heurística simple para título: corto (1-10 palabras) y termina sin puntuación final
        const isTitle = words.length > 0 && words.length <= 10 && !/[.!?]$/.test(p);

        if (isTitle) {
            // Si ya hay un chunk acumulado, guardarlo antes de empezar el nuevo título
            if (currentWords > 0) {
                chunks.push({ title: currentTitle, content: currentChunk.join('\n\n') });
                currentChunk = [];
                currentWords = 0;
            }
            currentTitle = p;
            continue; // El título será el nombre de la sección, no parte del contenido crudo si queremos
        }

        if (currentWords + words.length > maxWords && currentWords > 0) {
            // Se excedió el límite, guardar chunk actual
            chunks.push({ title: currentTitle, content: currentChunk.join('\n\n') });
            currentChunk = [p];
            currentWords = words.length;
        } else {
            currentChunk.push(p);
            currentWords += words.length;
        }
    }

    if (currentWords > 0) {
        chunks.push({ title: currentTitle, content: currentChunk.join('\n\n') });
    }

    return chunks;
};

/**
 * 4. Extraer palabras clave de un texto
 */
const extractKeywords = (text) => {
    const words = text.toLowerCase()
        .replace(/[.,:;()?!¿¡"']/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !STOPWORDS.has(w));
    
    // Contar frecuencias
    const freq = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    
    // Top 10 palabras
    return Object.keys(freq)
        .sort((a, b) => freq[b] - freq[a])
        .slice(0, 10)
        .join(' ');
};

/**
 * Orquestador principal
 */
const processAndSave = async (fileBuffer, mimetype, originalFileName, baseSourceUrl) => {
    console.log(`[DocumentService] Procesando ${originalFileName}...`);
    
    const rawText = await extractText(fileBuffer, mimetype);
    const cleanedText = cleanText(rawText);
    const chunks = chunkText(cleanedText);

    let insertedCount = 0;

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // Si el chunk está vacío o muy corto, lo saltamos
        if (chunk.content.split(/\s+/).length < 10) continue;

        const keywords = extractKeywords(chunk.content);
        const { entity, intent } = detectEntityAndIntent(chunk.title + ' ' + chunk.content);
        
        const finalEntity = entity || 'MINENERGIA'; // Por defecto asignamos MINENERGIA si no detecta
        
        // Para evitar conflicto UNIQUE de source_url, le adjuntamos el fragmento
        const uniqueUrl = `${baseSourceUrl}#seccion-${i + 1}`;

        try {
            await db.query(`
                INSERT INTO knowledge_base (entity, intent, title, content, keywords, source, source_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (source_url) DO UPDATE 
                SET content = EXCLUDED.content, updated_at = CURRENT_TIMESTAMP
            `, [
                finalEntity, 
                intent, 
                chunk.title, 
                chunk.content, 
                keywords, 
                originalFileName, 
                uniqueUrl
            ]);
            insertedCount++;
        } catch (dbError) {
            console.error(`[DocumentService] Error insertando chunk ${i}:`, dbError);
        }
    }

    console.log(`[DocumentService] Finalizado. ${insertedCount} fragmentos guardados.`);
    return { success: true, chunksProcessed: insertedCount };
};

module.exports = {
    processAndSave
};
