const db = require('../database/connection');
const crawler = require('./crawlerService');
const { detectEntityAndIntent } = require('./intentService');

/**
 * processQuestion
 * @param {string} userQuestion - Pregunta del usuario
 * @param {string} sessionId - ID de la sesión
 * @param {string|null} contextEntity - Última entidad de la que se venía hablando
 * @param {string|null} contextSection - Última sección de la que se venía hablando
 */
const processQuestion = async (userQuestion, sessionId, contextEntity = null, contextSection = null) => {
    try {
        // ── Log del mensaje entrante ──────────────────────────────────────────────
        await db.query(
            `INSERT INTO chat_history (session_id, role, message) VALUES ($1, $2, $3)`,
            [sessionId, 'USER', userQuestion]
        );

        // ── 1. DETECCIÓN DE ENTIDAD E INTENCIÓN (CON MEMORIA) ────────────────────
        const { entity, intent } = detectEntityAndIntent(userQuestion, contextEntity);
        console.log(`[Intent] Entidad: ${entity || 'General'} | Intención: ${intent} | Contexto Previo: ${contextEntity || 'Ninguno'} | Sección Previa: ${contextSection || 'Ninguna'}`);

        let finalAnswer = null;
        let finalSource = null;
        let suggestions = [];
        let finalSection = null;

        // ── 2. BÚSQUEDA POR ENTITY + INTENT EN KNOWLEDGE_BASE ────────────────────
        if (entity) {
            let exactQuery = '';
            let queryParams = [entity, intent];
            
            if (contextSection) {
                exactQuery = `
                    SELECT id, title, section, content, summary, related_questions, source, source_url
                    FROM knowledge_base
                    WHERE entity = $1 AND intent = $2 AND section = $3
                    LIMIT 1
                `;
                queryParams.push(contextSection);
            } else {
                exactQuery = `
                    SELECT id, title, section, content, summary, related_questions, source, source_url
                    FROM knowledge_base
                    WHERE entity = $1 AND intent = $2
                    LIMIT 1
                `;
            }

            const { rows: exactRows } = await db.query(exactQuery, queryParams);
            
            console.log("Entidad:", entity);
            console.log("Intención:", intent);
            console.log("SQL ejecutado:", exactQuery);
            console.log("Resultado:", exactRows);

            if (exactRows.length > 0) {
                console.log(`[Hit] entity=${entity} intent=${intent} section=${contextSection} → respuesta directa`);
                const row = exactRows[0];
                finalAnswer = `**Resumen:**\n${row.summary || 'Información oficial obtenida.'}\n\n**Detalles:**\n${row.content}\n\n**Consulta más información en:** [${row.source || 'Enlace oficial'}](${row.source_url})`;
                finalSource = row.source;
                finalSection = row.section;
                suggestions = row.related_questions || [];
            } else {
                // Si detectó entidad pero no la intención exacta, buscar GENERAL
                let generalQuery = '';
                let generalParams = [entity];
                
                if (contextSection) {
                    generalQuery = `
                        SELECT title, section, content, summary, related_questions, source, source_url
                        FROM knowledge_base
                        WHERE entity = $1 AND intent = 'GENERAL' AND section = $2
                        LIMIT 1
                    `;
                    generalParams.push(contextSection);
                } else {
                    generalQuery = `
                        SELECT title, section, content, summary, related_questions, source, source_url
                        FROM knowledge_base
                        WHERE entity = $1 AND intent = 'GENERAL'
                        LIMIT 1
                    `;
                }

                const { rows: generalRows } = await db.query(generalQuery, generalParams);
                
                console.log("Entidad:", entity);
                console.log("Intención:", 'GENERAL');
                console.log("SQL ejecutado:", generalQuery);
                console.log("Resultado:", generalRows);

                if (generalRows.length > 0) {
                    const row = generalRows[0];
                    finalAnswer = `**Resumen:**\n${row.summary || 'Información oficial obtenida.'}\n\n**Detalles:**\n${row.content}\n\n**Consulta más información en:** [${row.source || 'Enlace oficial'}](${row.source_url})`;
                    finalSource = row.source;
                    suggestions = row.related_questions || [];
                } else {
                    console.log("[KnowledgeBase] No se encontró contenido para entity + intent");
                }
            }
        }

        // ── 3. BÚSQUEDA TEXTUAL ILIKE (si no hubo match directo) ─────────────────
        if (!finalAnswer) {
            const words = userQuestion.split(' ').filter(w => w.length > 3);
            if (words.length > 0) {
                let conditions = [];
                let params = [];
                let paramIndex = 1;

                words.forEach(word => {
                    const term = `%${word}%`;
                    conditions.push(`(title ILIKE $${paramIndex} OR keywords ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
                    params.push(term);
                    paramIndex++;
                });

                const whereClause = conditions.join(' OR ');
                const textQuery = `SELECT title, content, summary, related_questions, source, source_url FROM knowledge_base WHERE ${whereClause} LIMIT 1`;
                
                const { rows: textRows } = await db.query(textQuery, params);
                
                console.log("SQL ejecutado:", textQuery);
                console.log("Resultado:", textRows);

                if (textRows.length > 0) {
                    console.log(`[Text Search] Match por palabras clave`);
                    const row = textRows[0];
                    finalAnswer = `**Resumen:**\n${row.summary || 'Información oficial obtenida.'}\n\n**Detalles:**\n${row.content}\n\n**Consulta más información en:** [${row.source || 'Enlace oficial'}](${row.source_url})`;
                    finalSource = row.source;
                    suggestions = row.related_questions || [];
                }
            }
        }

        // ── 4. AUTOAPRENDIZAJE Y PREGUNTAS PENDIENTES ────────────────────────────
        if (!finalAnswer) {
            console.log(`[Crawler] Buscando en fuentes oficiales...`);
            const scrapResult = await crawler.searchOfficialSources(userQuestion);

            if (scrapResult.found) {
                const info = scrapResult.data;
                finalAnswer = info.answer; // crawlerService still returns answer
                finalSource = info.source;

                // Persistir el nuevo conocimiento
                await db.query(`
                    INSERT INTO knowledge_base (entity, intent, title, content, keywords, source, source_url)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (source_url) DO NOTHING
                `, ['CRAWLER', 'GENERAL', info.question, info.answer, info.keywords.join(' '), info.source, info.source_url]);
                
                console.log(`[Aprendizaje] Guardado desde ${info.source_url}`);
            } else {
                // FALLBACK: pregunta sin respuesta
                finalAnswer = 'No encontré información oficial sobre ese trámite en la Base de Conocimiento actual.';
                finalSource = null;

                // GUARDAR EN pending_questions PARA APRENDIZAJE FUTURO
                await db.query(`
                    INSERT INTO pending_questions (pregunta, cantidad_veces_consultada, entidad_detectada, intencion_detectada)
                    VALUES ($1, 1, $2, $3)
                    ON CONFLICT (pregunta) DO UPDATE SET cantidad_veces_consultada = pending_questions.cantidad_veces_consultada + 1
                `, [userQuestion, entity, intent]);
            }
        }

        // ── 5. Log de la respuesta ────────────────────────────────────────────────
        await db.query(
            `INSERT INTO chat_history (session_id, role, message) VALUES ($1, $2, $3)`,
            [sessionId, 'BOT', finalAnswer]
        );

        return {
            answer: finalAnswer,
            source: finalSource,
            entity: entity || null, // Se retorna la entidad final para que el frontend actualice su contexto
            section: finalSection || null,
            intent,
            suggestions,
        };
    } catch (error) {
        console.error('[chatService] Error:', error);
        throw error;
    }
};

module.exports = { processQuestion };
