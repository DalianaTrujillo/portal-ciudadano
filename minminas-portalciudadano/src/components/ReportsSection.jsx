import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ReportsSection.css';

const allReports = [
  { id: 1, title: 'Informe de Gestión Anual 2024', excerpt: 'Resultados detallados de la inversión en el sector minero-energético y cumplimiento de metas del Plan Nacional de Desarrollo.', date: '18 Ene 2026', category: 'Todo el Sector' },
  { id: 2, title: 'Boletín de Transparencia SGR', excerpt: 'Seguimiento a la transparencia en la adjudicación de proyectos financiados por el Sistema General de Regalías en zonas PDET.', date: '12 Ene 2026', category: 'Regalías' },
  { id: 3, title: 'Avance en Formalización Minera', excerpt: 'Progreso en los procesos de regularización de pequeños mineros y minería de subsistencia en el departamento de Antioquia.', date: '05 Ene 2026', category: 'Minería' },
  { id: 4, title: 'Nuevas Planchas Geológicas 1:25.000', excerpt: 'El SGC publica la cartografía geológica detallada para el sector norte de la cordillera central, facilitando la exploración técnica.', date: '28 Dic 2025', category: 'SGC' },
  { id: 5, title: 'Subasta de Energías Renovables', excerpt: 'Resultados de la última subasta para proyectos de energía eólica y solar en la región Caribe, asegurando la transición energética.', date: '20 Dic 2025', category: 'Energía' },
  { id: 6, title: 'Manual de Liquidación SGR 2026', excerpt: 'Nueva guía técnica para entes territoriales sobre la correcta liquidación y recaudo de las regalías mineras vigentes.', date: '15 Dic 2025', category: 'Regalías' }
];

const ReportsSection = () => {
  const [activeTab, setActiveTab] = useState('Todo el Sector');
  const [filteredReports, setFilteredReports] = useState(allReports);
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  const tabs = ['Todo el Sector', 'Minería', 'Energía', 'Regalías', 'SGC'];

  useEffect(() => {
    if (activeTab === 'Todo el Sector') {
      setFilteredReports(allReports);
    } else {
      setFilteredReports(allReports.filter(r => r.category === activeTab));
    }
  }, [activeTab]);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [filteredReports]);

  return (
    <section className="reports-section">
      <div className="container section-inner">
        <div className="section-header-centered">
          <span className="eyebrow-blue">TRANSPARENCIA Y GESTIÓN</span>
          <h2>Reportes y Novedades</h2>
          <p>Consulte los últimos informes técnicos y noticias relevantes sobre la administración del sector.</p>
        </div>

        <div className="reports-tabs">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              className={`pill-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="carousel-wrapper">
          <div className="carousel-nav-arrows">
            <button className="nav-arrow left" onClick={() => carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' })}>
              <ChevronLeft size={20} />
            </button>
            <button className="nav-arrow right" onClick={() => carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' })}>
              <ChevronRight size={20} />
            </button>
          </div>

          <motion.div 
            ref={carouselRef} 
            className="carousel-container"
            whileTap={{ cursor: 'grabbing' }}
          >
            <motion.div 
              drag="x" 
              dragConstraints={{ right: 0, left: -width }}
              className="inner-carousel"
            >
              <AnimatePresence mode="popLayout">
                {filteredReports.map((report) => (
                  <motion.div 
                    key={report.id} 
                    className="report-card-carousel"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="report-card-body">
                      <h3 className="report-title-navy">{report.title}</h3>
                      <p className="report-excerpt">{report.excerpt}</p>
                    </div>
                    <div className="report-card-footer-tech">
                      <span className="report-date">{report.date}</span>
                      <span className="report-cat">{report.category}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="carousel-dots">
          {filteredReports.length > 2 && <div className="dot active"></div>}
          {filteredReports.length > 2 && <div className="dot"></div>}
        </div>
      </div>
    </section>
  );
};

export default ReportsSection;
