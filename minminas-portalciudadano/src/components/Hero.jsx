import React, { useState } from 'react';
import { Activity, ChevronLeft, ChevronRight, Database, Landmark, Shield, Map } from 'lucide-react';
import QuickAccessBar from './QuickAccessBar';
import './Hero.css';

const slides = [
  {
    id: 1,
    titleTop: 'Conocimiento y Cartografía ',
    titleHighlight: 'Geológica',
    titleBottom: 'al Servicio del País',
    description: 'Monitoreo constante, investigación y análisis geológico para la prevención de desastres y el desarrollo sostenible de los territorios.',
    bgGradient: 'linear-gradient(135deg, #0a1f16 0%, #0d2740 100%)',
    buttons: [
      { label: 'Ver Sismos Recientes', icon: <Activity size={20} />, className: 'btn-hero-solid', link: 'https://www2.sgc.gov.co/sismo/BoletinSismico/Paginas/consultaBoletinSismico.aspx' },
      { label: 'Explorar Atlas Geológico', icon: null, className: 'btn-hero-outline', link: 'https://geoportal.sgc.gov.co/' }
    ],
    chart: {
      title: 'Cobertura Geocientífica',
      data: [
        { label: 'Área Mapeada', value: 18200, color: '#203A68' },
        { label: 'En Proceso', value: 4550, color: '#EDB600' },
        { label: 'Sin Cubrir', value: 4050, color: '#686868' },
      ]
    }
  },
  {
    id: 2,
    titleTop: 'Fiscalización ',
    titleHighlight: 'Minera',
    titleBottom: ' y Formalización',
    description: 'Acceda a AnnA Minería, solicite trámites en línea y consulte el estado de la formalización minera en su región.',
    bgGradient: 'linear-gradient(135deg, #0d2740 0%, #1a365d 100%)',
    buttons: [
      { label: 'Ir a AnnA Minería', icon: <Database size={20} />, className: 'btn-hero-solid-blue', link: 'https://www.anm.gov.co/' },
      { label: 'Ventanilla de Trámites', icon: null, className: 'btn-hero-outline-green', link: 'https://www.anm.gov.co/?q=v_minera' }
    ],
    chart: {
      title: 'Estado de Títulos Mineros',
      data: [
        { label: 'Títulos Activos', value: 3240, color: '#203A68' },
        { label: 'En Trámite', value: 692, color: '#EDB600' },
        { label: 'Suspendidos', value: 389, color: '#686868' },
      ]
    }
  },
  {
    id: 3,
    titleTop: 'Transparencia en el Ciclo de ',
    titleHighlight: 'Regalías SGR',
    titleBottom: ' 2025-2026',
    description: 'Seguimiento detallado a la liquidación, recaudo y distribución de las regalías mineras para el desarrollo del territorio.',
    bgGradient: 'linear-gradient(135deg, #13402E 0%, #0d2740 100%)',
    buttons: [
      { label: 'Ver Distribución', icon: <Landmark size={20} />, className: 'btn-hero-solid-blue', link: 'https://mapainversiones.dnp.gov.co/' },
      { label: 'Reportes de Transparencia', icon: null, className: 'btn-hero-outline-green', link: 'https://www.dnp.gov.co/Paginas/Sistema-General-de-Regalias.aspx' }
    ],
    chart: {
      title: 'Distribución de Regalías SGR',
      data: [
        { label: 'Ejecutado', value: 7800, color: '#203A68' },
        { label: 'En Proceso', value: 2520, color: '#EDB600' },
        { label: 'Pendiente', value: 1680, color: '#686868' },
      ]
    }
  }
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildSlicePath(cx, cy, r, ri, start, end) {
  const s1 = polarToCartesian(cx, cy, r, start);
  const s2 = polarToCartesian(cx, cy, r, end);
  const i1 = polarToCartesian(cx, cy, ri, start);
  const i2 = polarToCartesian(cx, cy, ri, end);
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${s2.x} ${s2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${ri} ${ri} 0 ${large} 0 ${i1.x} ${i1.y}`,
    'Z',
  ].join(' ');
}

function HeroPieChart({ data, title }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const CX = 100, CY = 100, R = 76, RI = 42, GAP = 2.5;

  const total = data.reduce((s, d) => s + d.value, 0);
  let cursor = 0;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * (360 - data.length * GAP);
    const start = cursor;
    const end = cursor + sweep;
    cursor = end + GAP;
    const r = activeIdx === i ? R + 8 : R;
    return { ...d, path: buildSlicePath(CX, CY, r, RI, start, end), pct: Math.round((d.value / total) * 100) };
  });

  const focused = activeIdx !== null ? slices[activeIdx] : slices[0];

  return (
    <div className="hero-chart-card">
      <h3 className="hero-chart-title">{title}</h3>
      <div className="hero-chart-body">
        <svg viewBox="0 0 200 200" className="hero-chart-svg" aria-label={title}>
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              opacity={activeIdx === null || activeIdx === i ? 1 : 0.45}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            />
          ))}
          <text x={CX} y={CY - 5} textAnchor="middle" fontSize="22" fontWeight="800" fill="#ffffff" fontFamily="'Nunito Sans', sans-serif">
            {focused.pct}%
          </text>
          <text x={CX} y={CY + 14} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="rgba(255,255,255,0.6)" fontFamily="'Nunito Sans', sans-serif">
            {focused.label.split(' ').slice(0, 3).join(' ')}
          </text>
        </svg>
      </div>
      <ul className="hero-chart-legend">
        {slices.map((s, i) => (
          <li
            key={i}
            className={`hero-chart-legend-item${activeIdx === i ? ' is-active' : ''}`}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <span className="hero-chart-dot" style={{ background: s.color }} />
            <span className="hero-chart-lbl">{s.label}</span>
            <span className="hero-chart-pct">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Hero = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="hero-fullscreen">
      <div 
        className="hero-carousel-bg"
        style={{ background: slides[currentSlide].bgGradient }}
      >
        <div className="hero-pattern-overlay"></div>
        
        <div className="hero-content container">
          <div className="hero-text-col">
            <h1 className="hero-title">
              {slides[currentSlide].titleTop}
              <span className="hero-highlight">{slides[currentSlide].titleHighlight}</span>
              <br />
              {slides[currentSlide].titleBottom}
            </h1>
            <p className="hero-description">{slides[currentSlide].description}</p>
            
            <div className="hero-btn-group">
              {slides[currentSlide].buttons.map((btn, idx) => (
                <a 
                  key={idx} 
                  href={btn.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={btn.className}
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  {btn.icon}
                  {btn.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hero-form-col">
            <HeroPieChart
              data={slides[currentSlide].chart.data}
              title={slides[currentSlide].chart.title}
            />
          </div>
        </div>

        <div className="hero-controls">
          <button className="hero-control-btn" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="hero-control-btn" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <QuickAccessBar onNavigate={onNavigate} />
    </section>
  );
};

export default Hero;
