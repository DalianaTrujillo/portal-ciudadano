import React from 'react';
import './QuickAccess.css';

const QuickAccess = () => {
  const links = [
    { 
      title: 'Indicadores', 
      desc: 'Producción, giros y ejecución de regalías por entidad.',
      icon: '📊',
      color: 'ac-green'
    },
    { 
      title: 'Proyectos', 
      desc: 'Consulte el estado de los proyectos financiados con regalías.',
      icon: '🏗️',
      color: 'ac-blue'
    },
    { 
      title: 'Mapas', 
      desc: 'Visualización geográfica de títulos y áreas de fiscalización.',
      icon: '🗺️',
      color: 'ac-yellow'
    },
    { 
      title: 'Transparencia', 
      desc: 'Acceda a reportes oficiales y rendición de cuentas.',
      icon: '⚖️',
      color: 'ac-orange'
    }
  ];

  return (
    <section className="quick-access">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">Gestión Pública</span>
          <h2>Accesos Rápidos</h2>
          <p>Herramientas directas para la consulta y seguimiento del sector minero.</p>
        </div>
        
        <div className="accesos-grid">
          {links.map((link, index) => (
            <a key={index} href={`#${link.title.toLowerCase()}`} className="acceso-card">
              <div className={`acceso-icon ${link.color}`}>
                {link.icon}
              </div>
              <h3>{link.title}</h3>
              <p>{link.desc}</p>
              <div className="acceso-arrow">→</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
