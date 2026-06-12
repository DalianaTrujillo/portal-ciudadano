import React from 'react';
import './OpenDataSection.css';

const OpenDataSection = () => {
  const datasets = [
    {
      title: 'Producción Histórica de Oro',
      desc: 'Dataset detallado de la producción de oro por municipio y departamento (2010-2024).',
      format: 'CSV / JSON',
      type: 'theme-anm',
      date: 'Actualizado: 15 Abr 2026'
    },
    {
      title: 'Mapa de Títulos Mineros',
      desc: 'Capa geográfica con la delimitación de todos los títulos mineros vigentes.',
      format: 'SHP / GeoJSON',
      type: 'theme-sgc',
      date: 'Actualizado: 12 Abr 2026'
    },
    {
      title: 'Recaudación Regalías SGR',
      desc: 'Reporte trimestral de giros y distribución a entes territoriales.',
      format: 'XLSX / PDF',
      type: 'theme-sgr',
      date: 'Actualizado: 20 Abr 2026'
    }
  ];

  return (
    <section className="open-data-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">Transparencia</span>
          <h2>Datos Abiertos</h2>
          <p>Acceda y descargue información oficial en formatos procesables para su análisis.</p>
        </div>

        <div className="datos-grid">
          {datasets.map((data, index) => (
            <div key={index} className={`dato-card ${data.type}`}>
              <div className="dato-card-top">
                <div className="dato-icon">📄</div>
                <span className="dato-format">{data.format}</span>
              </div>
              <h3>{data.title}</h3>
              <p>{data.desc}</p>
              <div className="meta-box">
                <div className="meta-row">
                  <span>📅 {data.date}</span>
                </div>
              </div>
              <button className="btn-descargar">Descargar Recurso</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpenDataSection;
