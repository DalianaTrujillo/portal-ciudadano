const API_URL = 'http://localhost:3000';

export const getKnowledgeList = async (search = '') => {
    const res = await fetch(`${API_URL}/knowledge?search=${encodeURIComponent(search)}`);
    if (!res.ok) throw new Error('Error listando conocimiento');
    return res.json();
};

export const createKnowledge = async (data) => {
    const res = await fetch(`${API_URL}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error creando conocimiento');
    return res.json();
};

export const updateKnowledge = async (id, data) => {
    const res = await fetch(`${API_URL}/knowledge/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error actualizando conocimiento');
    return res.json();
};

export const deleteKnowledge = async (id) => {
    const res = await fetch(`${API_URL}/knowledge/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error eliminando conocimiento');
    return res.json();
};
