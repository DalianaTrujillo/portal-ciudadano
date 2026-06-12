import React, { useState } from 'react';
import { Map as MapIcon, ExternalLink, Database, Clock, Search } from 'lucide-react';
import './MapSection.css';

const departamentos = ["Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"];

const organizaciones = [
  'Seleccione organización...', 'ANM', 'SGC', 'MinMinas'
];

const inputStyle = {
  height: 42,
  padding: '0 12px',
  fontSize: 14,
  flex: '1 1 200px',
  boxSizing: 'border-box',
  borderRadius: 4,
  border: '1px solid #E2E8F0',
  backgroundColor: '#FFFFFF',
  color: '#475569',
  outline: 'none',
  fontFamily: "'Nunito Sans', sans-serif",
};

const btnFiltroStyle = {
  height: 42,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 4,
  border: 'none',
  backgroundColor: '#EDB600',
  color: '#203A68',
  cursor: 'pointer',
  flex: '0 1 auto',
  minWidth: '150px',
  boxSizing: 'border-box',
  fontFamily: "'Nunito Sans', sans-serif",
  transition: 'background-color 0.2s',
};

const MapSection = () => {
  const [selectedDept, setSelectedDept] = useState('');
  const [titulo, setTitulo] = useState('');
  const [producto, setProducto] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [fechaCert, setFechaCert] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('titulos');

  const layers = [
    { id: 'titulos', name: 'Títulos Mineros (ANM)', color: '#3366CC', val: '8,420 Polígonos' },
    { id: 'cartografia', name: 'Cartografía Geológica (SGC)', color: '#2D6A4F', val: '1,248 Mapas' },
    { id: 'reservas', name: 'Áreas de Reserva', color: '#E67E22', val: '32 Zonas' },
    { id: 'sismicidad', name: 'Sismicidad Histórica', color: '#DC2626', val: '4,210 Eventos' }
  ];

  return (
    <section className="map-section-technical">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">VISOR TERRITORIAL</span>
          <h2>Visualización Geográfica Interactiva</h2>
          <p>Consulte la información geocientífica y minera del territorio colombiano con filtros por departamento y capas temáticas.</p>
        </div>

        <div className="map-grid-technical">
          <div className="map-visor-box">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                padding: '24px',
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                marginBottom: '32px',
              }}
            >
              <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} style={inputStyle}>
                <option value="">Seleccione departamento...</option>
                {departamentos.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Buscar por título minero..."
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Filtrar por producto (ej. Oro, Carbón)..."
                value={producto}
                onChange={e => setProducto(e.target.value)}
                style={inputStyle}
              />
              <select value={selectedOrg} onChange={e => setSelectedOrg(e.target.value)} style={inputStyle}>
                {organizaciones.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <input
                type="date"
                value={fechaCert}
                onChange={e => setFechaCert(e.target.value)}
                style={inputStyle}
              />
              <button style={btnFiltroStyle} onClick={() => {}}>
                Aplicar Filtros
              </button>
            </div>

            <div
              className="visor-content"
              style={{
                height: 500,
                borderRadius: 8,
                background: '#F1F5F9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                color: '#94A3B8',
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              <MapIcon size={48} strokeWidth={1.5} color="#94A3B8" />
              <span style={{ fontWeight: 700, fontSize: 15, color: '#64748B' }}>
                Visor Geográfico (Modo Maqueta)
              </span>
              <span style={{ fontSize: 13 }}>
                El mapa real requiere integración por API
              </span>
            </div>
          </div>

          <div className="map-sidebar-technical">
            <h4 className="sidebar-title">CAPAS TEMÁTICAS</h4>
            <div className="layers-column">
              {layers.map((l, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedLayer(l.id)}
                  className={`layer-card-tech${selectedLayer === l.id ? ' is-active' : ''}`}
                  style={{ borderLeftColor: l.color, cursor: 'pointer', width: '100%', textAlign: 'left' }}
                >
                  <div className="layer-info">
                    <span className="layer-name">{l.name}</span>
                    <span className="layer-val">{l.val}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="visor-stats">
              <h4 className="sidebar-title">DATOS DEL VISOR</h4>
              <div className="stats-tech-row">
                <div className="stat-tech-box">
                  <Database size={14} />
                  <div>
                    <span className="s-label">Capas Activas</span>
                    <span className="s-val">4</span>
                  </div>
                </div>
                <div className="stat-tech-box">
                  <Clock size={14} />
                  <div>
                    <span className="s-label">Actualizado</span>
                    <span className="s-val">Abr 2026</span>
                  </div>
                </div>
              </div>
              <div className="stat-tech-box" style={{ marginTop: 8 }}>
                <Search size={14} />
                <div>
                  <span className="s-label">Fuente</span>
                  <span className="s-val" style={{ fontSize: 11 }}>SGC - Geoportal Nacional</span>
                </div>
              </div>
            </div>

            <a
              href="https://geoportal.sgc.gov.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-open-geoportal"
              style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Abrir Geoportal completo <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
