const crawler = require('./services/crawlerService');

(async () => {
    console.log('Iniciando prueba del indexador en el Portal Local...');
    // Crawleamos la página principal del portal
    await crawler.indexPage('http://localhost:3000/');
    console.log('Prueba finalizada.');
    process.exit(0);
})();
