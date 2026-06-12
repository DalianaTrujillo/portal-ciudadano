const puppeteer = require('puppeteer');
const db = require('../database/connection');
const { processNLP } = require('./nlpService');

/**
 * Recorre una URL local o externa usando Puppeteer (renderiza React JS)
 * e inserta el conocimiento estructurado por secciones.
 */
const indexPage = async (url) => {
    console.log(`[Crawler] Iniciando indexación de: ${url}`);
    
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
        const page = await browser.newPage();
        
        // Vamos a la URL y esperamos a que el DOM y las promesas de red se calmen (ideal para React/Vite)
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Extraer secciones lógicas de la página
        const extractedSections = await page.evaluate(() => {
            const results = [];
            
            // Buscar etiquetas que normalmente separan contenido
            const containers = document.querySelectorAll('section, article, .card, main');
            
            // Si la página no usa section, probamos con el body completo pero fragmentado
            const nodes = containers.length > 0 ? containers : [document.body];

            nodes.forEach((node, index) => {
                // Título: buscar el primer h1, h2, h3 dentro de este nodo
                const heading = node.querySelector('h1, h2, h3, h4');
                const title = heading ? heading.innerText.trim() : `Sección ${index + 1}`;
                
                // Texto principal
                const text = node.innerText.trim();
                
                if (text && text.length > 50) {
                    results.push({
                        title: title,
                        content: text,
                        section_id: index + 1
                    });
                }
            });

            return results;
        });

        console.log(`[Crawler] Encontradas ${extractedSections.length} secciones en ${url}`);

        let insertedCount = 0;

        for (const sec of extractedSections) {
            // Pasamos por el NLP para sacar resumen, metadatos y entidad
            const nlpData = processNLP(sec.title, sec.content);
            const sourceUrlUnique = `${url}#seccion-${sec.section_id}`;
            const relatedJson = JSON.stringify(nlpData.related_questions);

            await db.query(`
                INSERT INTO knowledge_base 
                (entity, section, intent, title, content, summary, keywords, related_questions, source, source_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (source_url) DO UPDATE 
                SET content = EXCLUDED.content,
                    summary = EXCLUDED.summary,
                    title = EXCLUDED.title,
                    updated_at = CURRENT_TIMESTAMP
            `, [
                nlpData.entity,
                sec.title, // guardamos el título como "section" name
                nlpData.intent,
                sec.title,
                sec.content,
                nlpData.summary,
                nlpData.keywords,
                relatedJson,
                'Portal Ciudadano - AutoIndex',
                sourceUrlUnique
            ]);
            
            insertedCount++;
        }

        console.log(`[Crawler] Éxito: ${insertedCount} secciones indexadas de ${url}`);
        return { success: true, count: insertedCount };

    } catch (e) {
        console.error(`[Crawler] Error indexando ${url}:`, e);
        return { success: false, error: e.message };
    } finally {
        if (browser) await browser.close();
    }
};

/**
 * Función que era llamada como fallback.
 * Ahora intentará encolar la página si no existe, 
 * por ahora retornaremos falso y luego se llama indexPage asincrónicamente.
 */
const searchOfficialSources = async (question) => {
    // Si la pregunta es algo del portal que no sabemos, simulamos que vamos a indexarla en background
    // En producción aquí se usaría un sistema de colas (RabbitMQ o un SetTimeout)
    console.log(`[Crawler] Pregunta no resuelta agregada a la cola de indexación: "${question}"`);
    
    // Retornamos falso porque la respuesta NO es síncrona. 
    // El chat dirá "No encontré..." y el crawler podrá trabajar de fondo más tarde.
    return {
        found: false,
        data: null
    };
};

module.exports = {
    indexPage,
    searchOfficialSources
};
