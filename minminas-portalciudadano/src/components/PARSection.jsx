import React, { useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import './PARSection.css';

const parData = [
  {
    id: 'antioquia',
    region: 'Punto de Atención Regional Antioquia - Chocó',
    address: 'Carrera 43A # 1-50, San Fernando Plaza, Medellín',
    phone: '+57 (604) 220 0200',
    schedule: 'Lunes a Viernes: 8:00 a.m. - 5:00 p.m.'
  },
  {
    id: 'valle',
    region: 'Punto de Atención Regional Valle del Cauca',
    address: 'Calle 11 # 100-121, Edificio Holguines Trade Center, Cali',
    phone: '+57 (602) 220 0200',
    schedule: 'Lunes a Viernes: 7:30 a.m. - 4:30 p.m.'
  },
  {
    id: 'santanderes',
    region: 'Punto de Atención Regional Santanderes',
    address: 'Carrera 29 # 45-45, Bucaramanga',
    phone: '+57 (607) 220 0200',
    schedule: 'Lunes a Viernes: 8:00 a.m. - 5:00 p.m.'
  },
  {
    id: 'narino',
    region: 'Punto de Atención Regional Nariño',
    address: 'Calle 18 # 25-45, Centro, Pasto',
    phone: '+57 (602) 720 0200',
    schedule: 'Lunes a Jueves: 8:00 a.m. - 5:00 p.m. / Viernes: 8:00 a.m. - 4:00 p.m.'
  }
];

const PARSection = () => {
  const [activeTab, setActiveTab] = useState(parData[0]);

  return (
    <section className="par-section">
      <div className="container">
        <div className="section-header-centered">
          <h2>Puntos de Atención Regional (PAR)</h2>
          <p>Encuentra tu sede más cercana para trámites y servicios minero-energéticos.</p>
        </div>

        <div className="par-container">
          <div className="par-sidebar">
            {parData.map((item) => (
              <button
                key={item.id}
                className={`par-tab-btn ${activeTab.id === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item)}
              >
                {item.region}
              </button>
            ))}
          </div>

          <div className="par-content">
            <div className="par-card">
              <h3 className="par-region-title">{activeTab.region}</h3>
              <ul className="par-details-list">
                <li>
                  <div className="par-icon-wrapper">
                    <MapPin size={20} />
                  </div>
                  <span>{activeTab.address}</span>
                </li>
                <li>
                  <div className="par-icon-wrapper">
                    <Phone size={20} />
                  </div>
                  <span>{activeTab.phone}</span>
                </li>
                <li>
                  <div className="par-icon-wrapper">
                    <Clock size={20} />
                  </div>
                  <span>{activeTab.schedule}</span>
                </li>
              </ul>
              <button className="par-action-btn">Ver Mapa de Sede</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PARSection;
