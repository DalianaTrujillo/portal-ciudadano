import React from 'react';
import './NuclearBanner.css';

const NuclearBanner = () => {
  return (
    <section className="nuclear-banner-section">
      <div className="nuclear-banner-container">
        <div className="nuclear-banner-content">
          <div className="nuclear-banner-header">
            <div className="nuclear-banner-icon">
              {/* Icono de átomo simplificado */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="2" fill="#FFD100"/>
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#FFD100" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#FFD100" strokeWidth="1.5" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#FFD100" strokeWidth="1.5" transform="rotate(120 12 12)" />
              </svg>
            </div>
            <h1 className="nuclear-banner-title">Asuntos Nucleares</h1>
          </div>
          
          <div className="nuclear-banner-description">
            <p>
              El Reactor IAN-R1 es la única instalación nuclear de potencia cero en Colombia. 
              Es una herramienta fundamental para la investigación, capacitación y producción 
              de radioisótopos en el país, operada bajo los más altos estándares de seguridad.
            </p>
          </div>

          <button className="nuclear-banner-button">
            Conocer Aplicaciones
          </button>
        </div>
        
        <div className="nuclear-banner-image-container">
          {/* Espacio para la imagen del reactor */}
          <div className="nuclear-banner-image-placeholder"></div>
        </div>
      </div>
    </section>
  );
};

export default NuclearBanner;
