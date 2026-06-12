const fs = require('fs');

const runTest = async () => {
    try {
        const textContent = `Resolución 1234 de 2026

Por la cual se establecen los lineamientos de fiscalización minera en Colombia.

El Ministerio de Minas y Energía, en uso de sus facultades legales, decreta los nuevos parámetros para la revisión de títulos mineros.

1. Requisitos para Títulos Mineros
Todos los solicitantes deben presentar los estudios técnicos en formato digital a través de la plataforma AnnA Minería. La Agencia Nacional de Minería (ANM) será la encargada de validar dicha información en un plazo máximo de 30 días hábiles.

2. Distribución de Regalías
El Sistema General de Regalías distribuirá los recursos recaudados a las regiones productoras, destinando el 20% al Fondo de Ciencia, Tecnología e Innovación.
`;
        
        fs.writeFileSync('test-doc.txt', textContent);
        
        const formData = new FormData();
        const fileBlob = new Blob([fs.readFileSync('test-doc.txt')], { type: 'text/plain' });
        formData.append('documento', fileBlob, 'test-doc.txt');
        formData.append('sourceUrl', 'https://minenergia.gov.co/resolucion-1234');

        console.log('Enviando documento de prueba al servidor...');
        const response = await fetch('http://localhost:3001/documents/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', JSON.stringify(data, null, 2));

    } catch (e) {
        console.error('Error:', e);
    }
};

runTest();
