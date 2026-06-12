require('dotenv').config();
const db = require('./connection');

async function run() {
    try {
        console.log('⏳ Alterando la tabla knowledge_base...');
        await db.query(`
            ALTER TABLE knowledge_base 
            ADD COLUMN IF NOT EXISTS section VARCHAR(255),
            ADD COLUMN IF NOT EXISTS summary TEXT;
        `);
        console.log('✅ Columnas agregadas exitosamente.');
    } catch (e) {
        console.error('❌ Error alterando BD:', e.message);
    } finally {
        process.exit();
    }
}
run();
