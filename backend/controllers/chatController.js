const chatService = require('../services/chatService');

const handleChat = async (req, res) => {
    try {
        const { question, session_id, context_entity, context_section } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'La pregunta es obligatoria.' });
        }

        const currentSessionId = session_id || `session_${Date.now()}`;
        
        const result = await chatService.processQuestion(question, currentSessionId, context_entity, context_section);
        
        return res.json({
            ...result,
            session_id: currentSessionId
        });
    } catch (error) {
        console.error('Error in handleChat:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {
    handleChat
};
