import React from 'react';
import './HelpCenter.css';

const HelpCenter = () => {
  const cards = [
    {
      title: 'Atención al Ciudadano',
      links: ['Peticiones, Quejas y Reclamos (PQRS)', 'Canales de atención', 'Chat institucional']
    },
    {
      title: 'Participación',
      links: ['Foros y Consultas Públicas', 'Rendición de Cuentas', 'Plan Anticorrupción']
    },
    {
      title: 'Trámites y Servicios',
      links: ['Registro Minero Nacional', 'Certificaciones de producción', 'Liquidación de regalías']
    }
  ];

  return (
    <section className="help-center">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">Transparencia</span>
          <h2>Centro de Ayuda y PQRS</h2>
        </div>

        <div className="help-center-grid">
          {cards.map((card, index) => (
            <div key={index} className="help-card">
              <h4>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {card.title}
              </h4>
              <div className="help-links">
                {card.links.map((link, lIndex) => (
                  <a key={lIndex} href="/" className="help-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;
