const knowledgeService = require('../services/knowledgeService');

const list = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await knowledgeService.getAllKnowledge(search);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener base de conocimiento' });
    }
};

const create = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Título y contenido son obligatorios' });
        }
        const newData = await knowledgeService.createKnowledge(req.body);
        res.status(201).json(newData);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear conocimiento' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = await knowledgeService.updateKnowledge(id, req.body);
        if (!updatedData) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.json(updatedData);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar conocimiento' });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await knowledgeService.deleteKnowledge(id);
        if (!success) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar conocimiento' });
    }
};

module.exports = {
    list,
    create,
    update,
    remove
};
