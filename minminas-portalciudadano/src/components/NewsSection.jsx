import React, { useState } from 'react';
import './NewsSection.css';

const NewsSection = () => {
  const [activeTab, setActiveTab] = useState('energia');

  const tabs = [
    { id: 'energia', label: 'Energía', title: 'Energía', color: 'var(--verde)' },
    { id: 'sgc', label: 'SGC', title: 'Servicio Geológico', color: 'var(--sgc-green)' },
    { id: 'anm', label: 'ANM', title: 'Agencia Nacional', color: 'var(--anm-blue)' }
  ];

  return (
    <section className="news-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">Actualidad Sectorial</span>
          <h2>Noticias y Avisos</h2>
        </div>

        <div className="news-tabs">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`news-tab ${activeTab === tab.id ? 'active' : ''} tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="news-content">
          <div className="news-featured">
            <div className="news-card-large">
              <div className="news-img-placeholder">📰</div>
              <div className="news-info-lg">
                <span className="news-date">24 ABRIL, 2026</span>
                <h3>Avance significativo en la fiscalización de títulos mineros en el departamento de Boyacá</h3>
                <p>
                  El Sector Energía reporta un incremento del 15% en la eficiencia 
                  de seguimiento técnico a las obligaciones de los concesionarios...
                </p>
                <button className="btn-read-more">Leer más</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
