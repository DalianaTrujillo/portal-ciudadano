import React from 'react';
import { Database, Zap, Scale, Shield, Microscope, Medal, Wind } from 'lucide-react';
import './AliadosCarousel.css';

const AliadosCarousel = () => {
  const entidades = [
    { name: 'UPME', icon: <Database size={24} />, color: '#EDB600' },
    { name: 'IPSE', icon: <Zap size={24} />, color: '#0055A4' },
    { name: 'CREG', icon: <Scale size={24} />, color: '#00A13A' },
    { name: 'ANH', icon: <Shield size={24} />, color: '#0072CE' },
    { name: 'SGC', icon: <Microscope size={24} />, color: '#E30613' },
    { name: 'ANM', icon: <Medal size={24} />, color: '#203A68' },
    { name: 'FENOGE', icon: <Wind size={24} />, color: '#4CAF50' }
  ];

  // Triplicamos la lista para asegurar un carrusel infinito suave y continuo
  const displayList = [...entidades, ...entidades, ...entidades];

  return (
    <div className="aliados-carousel-container">
      <div className="aliados-track">
        {displayList.map((entidad, index) => (
          <div key={index} className="aliado-slide" style={{ '--hover-color': entidad.color }}>
            <div className="aliado-item-flex">
              <span className="aliado-icon-svg">{entidad.icon}</span>
              <span className="aliado-name-text">{entidad.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AliadosCarousel;
