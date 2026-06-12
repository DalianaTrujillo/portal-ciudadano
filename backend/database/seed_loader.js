const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('./connection');

const loadSeedData = async () => {
    try {
        console.log('⏳ Leyendo archivo seed_knowledge.json...');
        const jsonPath = path.join(__dirname, 'seed_knowledge.json');
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const records = JSON.parse(rawData);

        console.log(`📦 Encontrados ${records.length} registros para cargar.`);
        
        let insertedCount = 0;

        for (const record of records) {
            const { entity, intent, title, content, keywords, related_questions, source, source_url } = record;
            
            // Convertir related_questions a string JSON
            const relatedJson = JSON.stringify(related_questions || []);

            await db.query(`
                INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (source_url) DO UPDATE 
                SET content = EXCLUDED.content, 
                    title = EXCLUDED.title,
                    related_questions = EXCLUDED.related_questions,
                    updated_at = CURRENT_TIMESTAMP
            `, [entity, intent, title, content, keywords, relatedJson, source, source_url]);
            
            insertedCount++;
        }

        console.log(`✅ ¡Carga Masiva completada! ${insertedCount} registros insertados/actualizados.`);
    } catch (e) {
        console.error('❌ Error en la carga masiva:', e);
    } finally {
        process.exit();
    }
};

loadSeedData();
