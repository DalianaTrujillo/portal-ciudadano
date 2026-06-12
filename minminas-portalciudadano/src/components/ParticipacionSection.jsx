import React, { useState } from 'react';
import './ParticipacionSection.css';

/* ── Preguntas frecuentes ─────────────────────────────── */
const faqs = [
  {
    q: '¿Cómo se distribuyen las regalías en mi municipio?',
    a: 'Las regalías se distribuyen a través del Sistema General de Regalías (SGR) mediante proyectos de inversión aprobados por los Órganos Colegiados de Administración y Decisión (OCAD).',
  },
  {
    q: '¿Qué es el Fondo de Ciencia, Tecnología e Innovación?',
    a: 'Es uno de los fondos del SGR destinado a financiar proyectos de ciencia y tecnología que impulsen el desarrollo regional, administrado por el Ministerio de Ciencias (Minciencias).',
  },
  {
    q: '¿Cómo consulto proyectos financiados con regalías?',
    a: 'Acceda al Sistema de Monitoreo, Seguimiento, Control y Evaluación (SMSCE) del DNP para consultar proyectos por entidad territorial.',
  },
];

/* ── Íconos SVG nativos ───────────────────────────────── */
const IconFaq = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconNews = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
  </svg>
);

const IconForos = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconChevron = () => (
  <svg className="pc-faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Componente ───────────────────────────────────────── */
const ParticipacionSection = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const toggle = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <section className="participacion-section">
      <div className="container section-inner">
        <div className="section-header">
          <div className="eyebrow" style={{ color: 'var(--verde)' }}>Diálogo Abierto</div>
          <h2>Participación Ciudadana</h2>
          <p>Involúcrese en la construcción de un sector minero-energético más transparente y equitativo.</p>
        </div>

        <div className="participation-grid">

          {/* Tarjeta 1 — Preguntas frecuentes con acordeón */}
          <div className="participation-card pc-faq">
            <div className="participation-icon p-blue"><IconFaq /></div>
            <h3>Preguntas frecuentes</h3>
            <p className="pc-card-desc">Resolvemos sus dudas sobre el ciclo de regalías y la participación ciudadana en el sector.</p>
            <ul className="pc-accordion">
              {faqs.map((faq, i) => (
                <li key={i} className={`pc-faq-item${openFaq === i ? ' is-open' : ''}`}>
                  <button
                    className="pc-faq-trigger"
                    onClick={() => toggle(i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{faq.q}</span>
                    <IconChevron />
                  </button>
                  {openFaq === i && (
                    <div className="pc-faq-body" role="region">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Tarjeta 2 — Novedades del Ministerio */}
          <div className="participation-card">
            <div className="participation-icon p-green"><IconNews /></div>
            <h3>Novedades del Ministerio</h3>
            <p>Entérese de las últimas noticias, boletines y actualizaciones del sector minero-energético.</p>
          </div>

          {/* Tarjeta 3 — Foros y Encuentros (sin cambios) */}
          <div className="participation-card">
            <div className="participation-icon p-yellow"><IconForos /></div>
            <h3>Foros y Encuentros</h3>
            <p>Participe en espacios de diálogo regionales para conocer de primera mano los avances del sector.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ParticipacionSection;
