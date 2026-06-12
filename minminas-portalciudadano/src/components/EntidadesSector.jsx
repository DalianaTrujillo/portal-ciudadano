import React, { useState } from 'react';
import VistaEntidadModal from './VistaEntidadModal';
import './EntidadesSector.css';

const entidades = [
  {
    id: 'anm',
    acronym: 'ANM',
    name: 'Agencia Nacional de Minería',
    desc: 'Administra los recursos minerales del Estado.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: '#1E3A5F',
  },
  {
    id: 'sgc',
    acronym: 'SGC',
    name: 'Servicio Geológico Colombiano',
    desc: 'Investiga el potencial del subsuelo y riesgos geológicos.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    color: '#22779E',
  },
];

const EntidadesSector = () => {
  const [selectedEntity, setSelectedEntity] = useState(null);

  return (
    <>
      <section className="entidades-sector" aria-label="Entidades del sector minero-energético">
        <div className="container es-inner">
          <div className="es-label">
            <span>ENTIDADES DEL SECTOR</span>
          </div>

          <div className="es-scroll-track">
            <ul className="es-grid">
              {entidades.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setSelectedEntity(e.id)}
                    className="es-card"
                    style={{ '--es-accent': e.color, cursor: 'pointer' }}
                    aria-label={`${e.acronym} – ${e.name}`}
                  >
                    <div className="es-icon" style={{ color: e.color }}>
                      {e.icon}
                    </div>
                    <div className="es-body">
                      <strong className="es-acronym">{e.acronym}</strong>
                      <span className="es-name">{e.name}</span>
                      <span className="es-desc">{e.desc}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {selectedEntity && (
        <VistaEntidadModal
          entityId={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </>
  );
};

export default EntidadesSector;
