const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');

router.get('/', knowledgeController.list);
router.post('/', knowledgeController.create);
router.put('/:id', knowledgeController.update);
router.delete('/:id', knowledgeController.remove);

module.exports = router;
