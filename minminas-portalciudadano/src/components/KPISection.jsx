import React from 'react';
import './KPISection.css';

const KPISection = () => {
  const kpis = [
    { val: '$12.0M', label: 'Asignación 2025–2026' },
    { val: '3', label: 'Entidades articuladas' },
    { val: '32', label: 'Departamentos cubiertos' },
    { val: '97%', label: 'Disponibilidad del Sistema' }
  ];

  return (
    <section className="kpi-section">
      <div className="container kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-item">
            <span className="kpi-val">{kpi.val}</span>
            <span className="kpi-label">{kpi.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KPISection;
