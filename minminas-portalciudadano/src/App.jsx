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
import { GlossarySection } from './components/GlossaryTooltip';
import ChatbotCiudadano from './components/ChatbotCiudadano';
import Footer from './components/Footer';
import { Search } from 'lucide-react';
import './App.css';

const PAGES = {
  inicio: 'inicio',
  ciclo: 'ciclo',
  entidades: 'entidades',
  indicadores: 'indicadores',
  visor: 'visor',
  aprende: 'aprende',
  participa: 'participa',
  noticias: 'noticias',
  buscar: 'buscar',
  documental: 'documental',
};

const sectionStyle = { padding: '80px 0' };

function SearchPage() {
  const [query, setQuery] = useState('');
  return (
    <section style={{ ...sectionStyle, background: '#F8FAFC', minHeight: '60vh' }}>
      <div className="container section-inner">
        <div className="section-header">
          <h2>Buscar en el portal</h2>
          <p>Encuentre información sobre el sector minero-energético colombiano.</p>
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: 12, background: '#fff',
            padding: 8, borderRadius: 12, border: '2px solid #E2E8F0'
          }}>
            <input
              type="text"
              placeholder="Escriba su búsqueda..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1, padding: '12px 16px', border: 'none',
                fontSize: 16, fontWeight: 600, outline: 'none',
                fontFamily: "'Nunito Sans', sans-serif", background: 'transparent'
              }}
            />
            <button style={{
              padding: '12px 24px', background: '#203A68', color: '#fff',
              border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Search size={16} /> Buscar
            </button>
          </div>
          {query && (
            <div style={{ marginTop: 32, color: '#64748B', fontSize: 14, textAlign: 'center' }}>
              Resultados para "<strong>{query}</strong>": funcionalidad en desarrollo.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

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

        {page === 'aprende' && (
          <section style={sectionStyle}>
            <div className="container section-inner">
              <div className="section-header">
                <span className="eyebrow">Conocimiento</span>
                <h2>Aprende sobre el sector</h2>
                <p>Recursos educativos, guías y material de consulta para entender el sector minero-energético colombiano.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                <div className="news-masonry-card" style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#203A68', marginBottom: 8 }}>Guía del Ciclo de Regalías</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>Documento explicativo sobre cómo se liquidan, distribuyen y ejecutan las regalías mineras en Colombia.</p>
                </div>
                <div className="news-masonry-card" style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#203A68', marginBottom: 8 }}>Glosario Minero-Energético</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>Definiciones de los términos técnicos más usados en el sector minero y energético colombiano.</p>
                </div>
                <div className="news-masonry-card" style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#203A68', marginBottom: 8 }}>Normativa Aplicable</h3>
                  <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>Leyes, decretos y resoluciones que rigen la actividad minera y la distribución de regalías.</p>
                </div>
              </div>
              <GlossarySection />
            </div>
          </section>
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

        {page === 'documental' && (
          <section style={sectionStyle}>
            <div className="container section-inner">
              <div className="section-header">
                <span className="eyebrow">Gestión Documental</span>
                <h2>Gestor Documental</h2>
                <p>Consulte y descargue documentos oficiales, informes y normativas del sector minero-energético colombiano.</p>
              </div>
            </div>
          </section>
        )}

        {page === 'buscar' && (
          <SearchPage />
        )}
      </main>
      <Footer />
      <ChatbotCiudadano />
    </div>
  );
}

export default App;
