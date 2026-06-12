const express = require('express');
const router = express.Router();
const multer = require('multer');
const documentController = require('../controllers/documentController');

// Multer se configura para mantener el archivo en memoria y no en disco duro,
// ya que el documentService requiere el buffer.
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('documento'), documentController.uploadDocument);

module.exports = router;
