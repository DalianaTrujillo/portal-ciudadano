require('dotenv').config();
const db = require('./database/connection');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        console.log('⏳ Leyendo init.sql...');
        const sql = fs.readFileSync(path.join(__dirname, 'database', 'init.sql'), 'utf8');
        
        console.log('⏳ Ejecutando script SQL en la base de datos...');
        await db.query(sql);
        
        console.log('✅ ¡ÉXITO! La base de datos y todas sus tablas se crearon correctamente con los datos iniciales.');
    } catch (e) {
        console.error('❌ Error al ejecutar el SQL:', e.message);
    } finally {
        process.exit();
    }
}

run();
