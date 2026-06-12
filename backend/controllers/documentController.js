const documentService = require('../services/documentService');

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Debe subir un archivo.' });
        }

        const fileBuffer = req.file.buffer;
        const mimetype = req.file.mimetype;
        const originalFileName = req.file.originalname;
        const sourceUrl = req.body.sourceUrl || `file://${originalFileName}`;

        const result = await documentService.processAndSave(fileBuffer, mimetype, originalFileName, sourceUrl);

        return res.status(200).json({
            message: 'Documento procesado e importado con éxito.',
            ...result
        });
    } catch (error) {
        console.error('[DocumentController] Error:', error);
        return res.status(500).json({ error: 'Error procesando el documento.', details: error.message });
    }
};

module.exports = {
    uploadDocument
};
