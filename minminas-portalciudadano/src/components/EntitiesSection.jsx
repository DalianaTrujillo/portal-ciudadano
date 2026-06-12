import React from 'react';
import './EntitiesSection.css';

const EntitiesSection = () => {
  const entities = [
    { name: 'ANM', desc: 'Agencia Nacional de Minería', icon: '🏛️' },
    { name: 'SGC', desc: 'Servicio Geológico Colombiano', icon: '🌍' },
    { name: 'UPME', desc: 'Planeación Minero Energética', icon: '⚡' }
  ];

  return (
    <section className="entities-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">Institucionalidad</span>
          <h2>Entidades del Sector</h2>
        </div>

        <div className="entities-grid">
          {entities.map((ent, index) => (
            <div key={index} className="entity-card">
              <div className="entity-logo">{ent.icon}</div>
              <h3>{ent.name}</h3>
              <p>{ent.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EntitiesSection;
