import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Atom, ArrowRight, Calendar, Download } from 'lucide-react';
import './GeosciencesPanel.css';
import bgImage from '../assets/geosciences_bg.png';

const carouselItems = [
  {
    title: 'MIIG - Información Geológica',
    desc: 'Consulta el Modelo Integrado de Información Geológica del SGC con datos de cartografía, sismicidad, recursos minerales y más.',
    link: 'https://miig.sgc.gov.co/',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="2 12 6 8 10 14 14 10 18 14 22 12" />
      </svg>
    )
  },
  {
    title: 'Volcanes',
    desc: 'Conoce el estado actual de nuestros volcanes y las alertas para mantener a tu comunidad segura.',
    link: 'https://www.sgc.gov.co/volcanes',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 22 20 2 20" />
      </svg>
    )
  },
  {
    title: 'Mapas Geocient\u00edficos',
    desc: 'Explora mapas interactivos para conocer la geografía, los suelos y los recursos de nuestra tierra.',
    link: 'https://srvags.sgc.gov.co/Flexviewer/Cartografia_Geocientifica/',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    )
  },
  {
    title: 'B\u00fasqueda Geocient\u00edfica',
    desc: 'Encuentra estudios, datos e investigaciones fáciles de entender sobre el subsuelo colombiano.',
    link: 'https://www2.sgc.gov.co/Paginas/Busqueda-geocientifica.aspx',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )
  },
  {
    title: 'Museo Geol\u00f3gico Nacional',
    desc: 'Descubre la historia antigua de nuestro país a través de fósiles, minerales y exposiciones.',
    link: 'https://www2.sgc.gov.co/museo-geologico/Paginas/museo-geologico-nacional-jrg.aspx',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="2" y1="22" x2="22" y2="22" />
        <rect x="3" y="10" width="18" height="12" />
        <polyline points="3 10 12 3 21 10" />
        <line x1="9" y1="22" x2="9" y2="15" />
        <line x1="15" y1="22" x2="15" y2="15" />
      </svg>
    )
  },
  {
    title: 'Asuntos Nucleares',
    desc: 'Aprende cómo el país regula y usa los materiales radiactivos de forma segura para proteger a todos.',
    link: 'https://www2.sgc.gov.co/Direcciones-Tecnicas/AsuntosNucleares/Paginas/GT-Reactor-Nuclear.aspx',
    icon: <Atom size={36} />
  }
];

const GeosciencesPanel = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = () => setActiveIdx(i => (i - 1 + carouselItems.length) % carouselItems.length);
  const next = () => setActiveIdx(i => (i + 1) % carouselItems.length);
  const active = carouselItems[activeIdx];


  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  // Gradiente, flechas y autoplay para reportes
  const reportsRowRef = useRef(null);
  const [reportsFadeHidden, setReportsFadeHidden] = useState(false);
  const [reportsPaused, setReportsPaused] = useState(false);
  // Gradiente
  const handleReportsScroll = () => {
    const el = reportsRowRef.current;
    if (!el) return;
    setReportsFadeHidden(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };
  useEffect(() => {
    handleReportsScroll();
    // eslint-disable-next-line
  }, []);
  // Flechas
  const scrollReports = (dir = 1) => {
    const el = reportsRowRef.current;
    if (!el) return;
    const card = el.querySelector('.sgc-report-card');
    const scrollAmount = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
  };
  // Autoplay
  useEffect(() => {
    if (reportsPaused) return;
    const el = reportsRowRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      // Si ya está al final, vuelve al inicio
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollReports(1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [reportsPaused]);
  // Pausar autoplay al interactuar
  const handleReportsUserInteract = () => {
    setReportsPaused(true);
    clearTimeout(window.__sgcReportsResumeTimeout);
    window.__sgcReportsResumeTimeout = setTimeout(() => setReportsPaused(false), 8000);
  };


  return (
    <section className="geosciences-panel" style={{ backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url(${bgImage})` }}>
      <div className="container section-inner">

        {/* 1. Centro de Monitoreo Section */}
        <div className="monitoring-section">
          <div className="section-header-centered">
            <span className="eyebrow-yellow">CIENCIA DEL SUBSUELO</span>
            <h2 className="title-white">Centro de Monitoreo Geocientífico</h2>
            <p className="subtitle-white">Vigilancia permanente de la actividad volcánica y sísmica en el territorio nacional con tecnología de vanguardia.</p>
          </div>

          {/* ── Carrusel cíclico ── */}
          <div
            className="gp-carousel"
            aria-label="Temas geocientíficos"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <button className="gp-carousel-nav" onClick={prev} aria-label="Anterior">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="gp-carousel-stage">
              <div key={activeIdx} className="gp-slide">
                <div className="gp-slide-icon">{active.icon}</div>
                <p className="gp-slide-counter">
                  {String(activeIdx + 1).padStart(2, '0')} / {String(carouselItems.length).padStart(2, '0')}
                </p>
                <h3 className="gp-slide-title">{active.title}</h3>
                <p className="gp-slide-desc">{active.desc}</p>
                <a href={active.link} target="_blank" rel="noopener noreferrer" className="gp-slide-link">
                  Explorar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>

              <div className="gp-dots" role="tablist">
                {carouselItems.map((item, i) => (
                  <button
                    key={i}
                    className={`gp-dot${i === activeIdx ? ' is-active' : ''}`}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Ir a ${item.title}`}
                    role="tab"
                    aria-selected={i === activeIdx}
                  />
                ))}
              </div>
            </div>

            <button className="gp-carousel-nav" onClick={next} aria-label="Siguiente">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* 2. Cifras y Estadísticas del Sector */}
        <section className="stats-section">
          <div className="section-header-centered">
            <h2 className="title-white">Cifras y Estadísticas del Sector</h2>
            <p className="subtitle-white">Transparencia y ejecución de recursos minero-energéticos</p>
          </div>
          <div className="stats-grid">
            {/* Tarjeta 1: Barras por región */}
            <div className="stats-card">
              <h3 className="stats-card-title">Ejecución de Proyectos por Región</h3>
              <ul className="bar-list">
                {[
                  { region: 'Caribe', pct: 85 },
                  { region: 'Andina', pct: 72 },
                  { region: 'Pacífico', pct: 60 },
                  { region: 'Orinoquía', pct: 48 },
                  { region: 'Amazonía', pct: 35 },
                ].map(item => (
                  <li key={item.region} className="bar-item">
                    <span className="bar-label">{item.region}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${item.pct}%` }} />
                      <span className="bar-pct">{item.pct}%</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Tarjeta 2: Donut chart */}
            <div className="stats-card">
              <h3 className="stats-card-title">Distribución de Regalías 2026</h3>
              <div className="donut-chart-container">
                <div
                  className="donut-chart"
                  style={{
                    background: 'conic-gradient(#203A68 0% 40%, #0ea5e9 40% 75%, #eab308 75% 100%)',
                  }}
                >
                  <div className="donut-center">100%</div>
                </div>
                <div className="donut-legend">
                  <div className="legend-row"><span className="legend-color" style={{ background: '#203A68' }} /> Asignaciones directas</div>
                  <div className="legend-row"><span className="legend-color" style={{ background: '#0ea5e9' }} /> Fondo de compensación</div>
                  <div className="legend-row"><span className="legend-color" style={{ background: '#eab308' }} /> Incentivo a la producción</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ...existing code... */}

        {/* NUEVO BLOQUE: Reportes y Alertas SGC */}
        <div style={{ margin: '64px 0 0 0', position: 'relative' }}>
          <h2 style={{ color: '#fff', marginBottom: 28 }}>Reportes y Alertas SGC</h2>
          {/* Flechas navegación */}
          <button
            aria-label="Ver reportes anteriores"
            style={{
              position: 'absolute',
              left: -32,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              background: 'rgba(31,41,55,0.85)',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}
            onClick={() => { scrollReports(-1); handleReportsUserInteract(); }}
            onMouseDown={e => e.preventDefault()}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            aria-label="Ver reportes siguientes"
            style={{
              position: 'absolute',
              right: -32,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              background: 'rgba(31,41,55,0.85)',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}
            onClick={() => { scrollReports(1); handleReportsUserInteract(); }}
            onMouseDown={e => e.preventDefault()}
          >
            <ChevronRight size={24} />
          </button>
          <div
            className={"sgc-reports-row" + (reportsFadeHidden ? " hide-fade" : "")}
            ref={reportsRowRef}
            onScroll={e => { handleReportsScroll(); handleReportsUserInteract(); }}
            onMouseDown={handleReportsUserInteract}
            onTouchStart={handleReportsUserInteract}
          >
            {/* Tarjeta 1 */}
            <div
              className="sgc-report-card"
              style={{
                backgroundColor: '#fff',
                color: '#1f2937',
                borderRadius: 12,
                padding: 24,
                minWidth: 300,
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Boletín Sísmico Semanal</h3>
              <p style={{ margin: '16px 0 24px 0', fontSize: 16 }}>Resumen de la actividad sísmica en el territorio nacional</p>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1f2937',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left'
                }}
              >
                Leer reporte &rarr;
              </button>
            </div>
            {/* Tarjeta 2 */}
            <div
              className="sgc-report-card"
              style={{
                backgroundColor: '#fff',
                color: '#1f2937',
                borderRadius: 12,
                padding: 24,
                minWidth: 300,
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Estado Volcán Nevado del Ruiz</h3>
              <p style={{ margin: '16px 0 24px 0', fontSize: 16 }}>Nivel de actividad actual y recomendaciones</p>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1f2937',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left'
                }}
              >
                Leer reporte &rarr;
              </button>
            </div>
            {/* Tarjeta 3 */}
            <div
              className="sgc-report-card"
              style={{
                backgroundColor: '#fff',
                color: '#1f2937',
                borderRadius: 12,
                padding: 24,
                minWidth: 300,
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Monitoreo de Aguas Subterráneas</h3>
              <p style={{ margin: '16px 0 24px 0', fontSize: 16 }}>Informe de niveles y calidad del agua por regiones</p>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1f2937',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left'
                }}
              >
                Leer reporte &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeosciencesPanel;
