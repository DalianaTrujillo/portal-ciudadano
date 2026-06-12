import React from 'react';
import PieChart from './PieChart';
import './IndicatorsSection.css';

const charts = [
  {
    subtitle: 'SGC – Conocimiento Geológico',
    title: 'Cartografía Geológica de Subsuelo',
    data: [
      { label: 'Área Mapeada',   value: 18200, unit: 'km²', color: '#203A68' },
      { label: 'En Proceso',     value:  2100, unit: 'km²', color: '#EDB600' },
      { label: 'Sin Cubrir',     value:  4700, unit: 'km²', color: '#686868' },
    ],
    metadata: { fuente: 'SGC - Anuario Estadístico Minero 2025', corte: 'Dic 2025', desc: 'Cobertura de cartografía geológica de subsuelo a escala 1:100.000' }
  },
  {
    subtitle: 'ANM – Fiscalización Minera',
    title: 'Inspecciones de Titulares Mineros',
    data: [
      { label: 'Realizadas',  value: 847, unit: 'insp.', color: '#203A68' },
      { label: 'Programadas', value: 102, unit: 'insp.', color: '#EDB600' },
      { label: 'Pendientes',  value:  51, unit: 'insp.', color: '#686868' },
    ],
    metadata: { fuente: 'ANM - Dirección de Fiscalización Minera', corte: 'Abr 2026', desc: 'Inspecciones programadas y ejecutadas a titulares mineros a nivel nacional' }
  },
  {
    subtitle: 'MME – Ejecución Presupuestal',
    title: 'Distribución de Recursos SGR',
    data: [
      { label: 'Ejecutado',     value: 7823, unit: 'M COP', color: '#203A68' },
      { label: 'En Trámite',    value: 2500, unit: 'M COP', color: '#EDB600' },
      { label: 'Por Programar', value: 1677, unit: 'M COP', color: '#686868' },
    ],
    metadata: { fuente: 'DNP - SMSCE SGR', corte: 'Mar 2026', desc: 'Distribución de recursos del Sistema General de Regalías vigencia 2025-2026' }
  },
];

const MetadataBadge = ({ metadata }) => (
  <div style={{
    marginTop: 12, padding: '10px 14px', background: '#F1F5F9',
    borderRadius: 8, fontSize: 11, lineHeight: 1.5, border: '1px solid #E2E8F0'
  }}>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <span><strong style={{ color: '#203A68' }}>Fuente:</strong> {metadata.fuente}</span>
      <span><strong style={{ color: '#203A68' }}>Corte:</strong> {metadata.corte}</span>
    </div>
    <span style={{ color: '#64748B', marginTop: 4, display: 'block' }}>{metadata.desc}</span>
  </div>
);

const IndicatorsSection = () => (
  <section id="indicadores" className="indicators-section">
    <div className="container section-inner">
      <div className="section-header-centered">
        <span className="eyebrow-yellow">Seguimiento SGR</span>
        <h2 className="title-white">Datos e Indicadores del Sector</h2>
        <p className="subtitle-white">
          Distribución proporcional de las métricas clave del ciclo de regalías,
          actualizadas al período vigente.
        </p>
      </div>

      <div className="ind-grid">
        {charts.map((chart, idx) => (
          <div key={idx} className="ind-card-wrapper">
            <PieChart {...chart} />
            <MetadataBadge metadata={chart.metadata} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default IndicatorsSection;
