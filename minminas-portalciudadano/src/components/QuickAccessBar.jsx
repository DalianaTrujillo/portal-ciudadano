import React from 'react';
import './QuickAccessBar.css';

const quickLinks = [
  {
    id: 1,
    title: '¿Cuánto se ha generado?',
    desc: 'Consulta los ingresos por regalías',
    page: 'indicadores',
    color: '#22C55E',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 2,
    title: '¿Cómo se distribuyen?',
    desc: 'Conoce la distribución por entidad y territorio',
    page: 'indicadores',
    color: '#2563EB',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="9" width="20" height="12" rx="2" />
        <path d="M16 9V7a4 4 0 0 0-8 0v2" />
        <line x1="12" y1="14" x2="12" y2="16" />
      </svg>
    ),
  },
  {
    id: 3,
    title: '¿Cómo se invierten?',
    desc: 'Explora los proyectos financiados',
    page: 'ciclo',
    color: '#EDB600',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 4,
    title: '¿Cómo se controlan?',
    desc: 'Entidades encargadas del control y seguimiento',
    page: 'entidades',
    color: '#7C3AED',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Participa',
    desc: 'Tu opinión cuenta en el ciclo de regalías',
    page: 'participa',
    color: '#0D9488',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Normativa',
    desc: 'Leyes, decretos y documentos clave',
    page: 'aprende',
    color: '#64748B',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

const QuickAccessBar = ({ onNavigate }) => (
  <section className="qab-section" aria-label="Accesos rápidos al ciclo de regalías">
    <div className="container">
      <ul className="qab-grid" role="list">
        {quickLinks.map((item) => (
          <li key={item.id} className="qab-list-item">
            <button
              onClick={() => onNavigate && onNavigate(item.page)}
              className="qab-card"
              style={{ '--card-accent': item.color, cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%' }}
            >
              <div
                className="qab-icon-wrap"
                style={{ background: item.color }}
                aria-hidden="true"
              >
                {item.icon}
              </div>

              <div className="qab-body">
                <strong className="qab-title">{item.title}</strong>
                <span className="qab-desc">{item.desc}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default QuickAccessBar;
