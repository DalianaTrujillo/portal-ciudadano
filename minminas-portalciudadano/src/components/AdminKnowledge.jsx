import React, { useState, useEffect } from 'react';
import { getKnowledgeList, createKnowledge, updateKnowledge, deleteKnowledge } from '../services/api';

const AdminKnowledge = () => {
    const [knowledge, setKnowledge] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        keywords: '',
        content: '',
        source: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getKnowledgeList(searchTerm);
            setKnowledge(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [searchTerm]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateKnowledge(editingId, formData);
            } else {
                await createKnowledge(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', category: '', keywords: '', content: '', source: '' });
            loadData();
        } catch (error) {
            alert('Error guardando los datos');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            category: item.category || '',
            keywords: item.keywords || '',
            content: item.content,
            source: item.source || ''
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este registro?')) {
            try {
                await deleteKnowledge(id);
                loadData();
            } catch (error) {
                alert('Error eliminando');
            }
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: "'Nunito Sans', sans-serif", maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1 style={{ color: '#203A68', margin: 0 }}>Base de Conocimiento</h1>
                <a href="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Volver al Portal</a>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <input 
                    type="text" 
                    placeholder="Buscar por título, categoría o palabra clave..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '12px', width: '350px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                />
                <button 
                    onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', category: '', keywords: '', content: '', source: '' }); }}
                    style={{ padding: '12px 20px', backgroundColor: '#EDB600', color: '#1E293B', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}
                >
                    + Nuevo Conocimiento
                </button>
            </div>

            {loading ? <p>Cargando datos...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#203A68', color: 'white' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Título</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Categoría</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Fuente</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {knowledge.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>{item.id}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#1E293B' }}>{item.title}</td>
                                <td style={{ padding: '15px', color: '#64748B' }}>{item.category}</td>
                                <td style={{ padding: '15px', color: '#64748B' }}>{item.source}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button onClick={() => handleEdit(item)} style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#F8FAFC', color: '#203A68', border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                                    <button onClick={() => handleDelete(item.id)} style={{ padding: '8px 16px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {knowledge.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                                    No hay registros de conocimiento aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginTop: 0, color: '#203A68' }}>{editingId ? 'Editar Conocimiento' : 'Nuevo Conocimiento'}</h2>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1E293B' }}>Título</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1E293B' }}>Categoría</label>
                                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1E293B' }}>Fuente Oficial</label>
                                    <input type="text" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="Portal Ciudadano" />
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1E293B' }}>Palabras Clave (Keywords)</label>
                                <input type="text" value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="ej: mineria anm regalias titulo" />
                                <small style={{ color: '#64748B' }}>Separadas por espacios.</small>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1E293B' }}>Contenido (Respuesta del Bot)</label>
                                <textarea required rows="6" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }}></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', border: '1px solid #ccc', background: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '10px 20px', background: '#203A68', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Conocimiento</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminKnowledge;
