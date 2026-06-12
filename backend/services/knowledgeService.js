const db = require('../database/connection');

const getAllKnowledge = async (searchTerm = '') => {
    try {
        let query = 'SELECT * FROM knowledge_base';
        let params = [];

        if (searchTerm) {
            query += ' WHERE title ILIKE $1 OR category ILIKE $1 OR keywords ILIKE $1 ORDER BY id DESC';
            params.push(`%${searchTerm}%`);
        } else {
            query += ' ORDER BY id DESC';
        }

        const { rows } = await db.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error getAllKnowledge:', error);
        throw error;
    }
};

const createKnowledge = async (knowledge) => {
    try {
        const { title, category, keywords, content, source } = knowledge;
        const query = `
            INSERT INTO knowledge_base (title, category, keywords, content, source) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const params = [title, category, keywords, content, source || 'Portal Ciudadano'];
        const { rows } = await db.query(query, params);
        return rows[0];
    } catch (error) {
        console.error('Error createKnowledge:', error);
        throw error;
    }
};

const updateKnowledge = async (id, knowledge) => {
    try {
        const { title, category, keywords, content, source } = knowledge;
        const query = `
            UPDATE knowledge_base 
            SET title = $1, category = $2, keywords = $3, content = $4, source = $5
            WHERE id = $6 RETURNING *
        `;
        const params = [title, category, keywords, content, source, id];
        const { rows } = await db.query(query, params);
        return rows[0];
    } catch (error) {
        console.error('Error updateKnowledge:', error);
        throw error;
    }
};

const deleteKnowledge = async (id) => {
    try {
        const query = 'DELETE FROM knowledge_base WHERE id = $1 RETURNING id';
        const { rows } = await db.query(query, [id]);
        return rows.length > 0;
    } catch (error) {
        console.error('Error deleteKnowledge:', error);
        throw error;
    }
};

module.exports = {
    getAllKnowledge,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge
};
