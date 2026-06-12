const { detectEntityAndIntent } = require('./intentService');

const STOPWORDS = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'si', 'no', 'de', 'del', 'a', 'al', 'con', 'por', 'para', 'en', 'es', 'son', 'se', 'lo', 'su', 'sus', 'como', 'que', 'qué', 'cual', 'cuales', 'este', 'esta', 'estos', 'estas', 'eso', 'esas']);

/**
 * Genera palabras clave contando frecuencias.
 */
const generateKeywords = (text) => {
    const words = text.toLowerCase()
        .replace(/[.,:;()?!¿¡"']/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !STOPWORDS.has(w));
    
    const freq = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    
    return Object.keys(freq)
        .sort((a, b) => freq[b] - freq[a])
        .slice(0, 8)
        .join(', ');
};

/**
 * Resumen extractivo simple: Devuelve la primera o las dos primeras oraciones con sentido completo.
 */
const generateSummary = (text) => {
    // Dividir por puntos seguidos de espacio o mayúscula
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    if (sentences.length <= 1) return text.trim();
    
    let summary = sentences[0].trim();
    if (summary.split(' ').length < 15 && sentences[1]) {
        summary += ' ' + sentences[1].trim();
    }
    
    // Forzar límite visual
    if (summary.length > 250) {
        summary = summary.substring(0, 247) + '...';
    }
    return summary;
};

/**
 * Generador de preguntas relacionadas basado en la entidad y la intención.
 */
const generateRelatedQuestions = (title, entity, intent) => {
    const questions = [];
    if (intent === 'DEFINICION') {
        questions.push(`¿Cuáles son las funciones de ${entity}?`, `¿Cómo uso ${title}?`);
    } else if (intent === 'TRAMITES') {
        questions.push(`¿Qué requisitos necesito para esto?`, `¿Dónde consulto el estado del trámite?`);
    } else if (intent === 'FUNCIONES') {
        questions.push(`¿Qué servicios prestan?`, `¿Cómo me comunico con ellos?`);
    } else {
        questions.push(`¿Qué es ${title || entity}?`, `¿Dónde encuentro más información?`);
    }
    return [...new Set(questions)].slice(0, 3);
};

/**
 * Orquestador NLP
 */
const processNLP = (title, content) => {
    const { entity, intent } = detectEntityAndIntent(`${title} ${content}`);
    const summary = generateSummary(content);
    const keywords = generateKeywords(content);
    const related_questions = generateRelatedQuestions(title, entity, intent);

    return {
        entity: entity || 'MINENERGIA',
        intent: intent || 'GENERAL',
        summary,
        keywords,
        related_questions
    };
};

module.exports = {
    processNLP
};
