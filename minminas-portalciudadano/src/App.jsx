import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServiceModules from './components/ServiceModules';
import EntidadesSector from './components/EntidadesSector';
import ParticipacionSection from './components/ParticipacionSection';
import IndicatorsSection from './components/IndicatorsSection';
import MapSection from './components/MapSection';
import GeosciencesPanel from './components/GeosciencesPanel';
import RegionesSection from './components/RegionesSection';
import ReportsSection from './components/ReportsSection';
import DatasetsSection from './components/DatasetsSection';
import EventsSection from './components/EventsSection';
import ContactSection from './components/ContactSection';
import PARSection from './components/PARSection';
import NewsGrid from './components/NewsGrid';
import InfographicSection from './components/InfographicSection';
import ChatbotCiudadano from './components/ChatbotCiudadano';
import Footer from './components/Footer';
import './App.css';

const PAGES = {
  inicio: 'inicio',
  ciclo: 'ciclo',
  entidades: 'entidades',
  indicadores: 'indicadores',
  visor: 'visor',
  participa: 'participa',
  noticias: 'noticias',
};

const sectionStyle = { padding: '80px 0' };

function App() {
  const [page, setPage] = useState('inicio');

  const handleNavigate = (target) => {
    if (PAGES[target]) {
      setPage(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <Header activePage={page} onNavigate={handleNavigate} />
      <main>
        {page === 'inicio' && (
          <>
            <Hero onNavigate={handleNavigate} />
            <ServiceModules />
            <InfographicSection />
            <EntidadesSector />
            <ParticipacionSection />
            <IndicatorsSection />
            <MapSection />
            <GeosciencesPanel />
            <RegionesSection />
            <EventsSection />
            <ContactSection />

            {/* ─── Avance de Noticias en Inicio ─── */}
            <section className="home-news-section">
              <div className="container section-inner">
                <div className="section-header">
                  <span className="eyebrow">Actualidad del Sector</span>
                  <h2 className="section-title">Últimas Noticias del Sector</h2>
                  <p className="section-subtitle">Entérate de las novedades, proyectos y convocatorias del ecosistema minero-energético.</p>
                </div>

                <NewsGrid limit={3} embedded />

                <div className="section-footer">
                  <button
                    onClick={() => handleNavigate('noticias')}
                    className="btn-outline-gold"
                  >
                    Ver todas las noticias →
                  </button>
                </div>
              </div>
            </section>

            <PARSection />
          </>
        )}

        {page === 'ciclo' && (
          <>
            <ServiceModules />
            <InfographicSection />
            <ReportsSection />
          </>
        )}

        {page === 'entidades' && (
          <>
            <EntidadesSector />
            <GeosciencesPanel />
          </>
        )}

        {page === 'indicadores' && (
          <>
            <IndicatorsSection />
            <EventsSection />
            <DatasetsSection />
          </>
        )}

        {page === 'visor' && (
          <>
            <MapSection />
          </>
        )}

        {page === 'participa' && (
          <>
            <ParticipacionSection />
            <PARSection />
          </>
        )}

        {page === 'noticias' && (
          <>
            <NewsGrid />
          </>
        )}

      </main>
      <Footer />
      <ChatbotCiudadano />
    </div>
  );
}

export default App;
