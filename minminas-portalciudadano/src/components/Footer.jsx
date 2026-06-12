import React from 'react';
import energiaAmarillaLogo from '../assets/Energía Amarillo.png';
import AliadosCarousel from './AliadosCarousel';
import './Footer.css';
import logoSGC from '../assets/Logo SGC (2).png';
import logoANM from '../assets/Logo ANM (1).png';

// Componentes SVG internos para asegurar disponibilidad y fidelidad al mockup
const IconX = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const IconFacebook = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconYoutube = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 58.38 58.38 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 58.38 58.38 0 0 1-15 0 2 2 0 0 1-2-2z" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const IconTiktok = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer-energia">
      {/* 1. Carrusel de Aliados (Superior) - Automático e Infinito */}
      <AliadosCarousel />

      {/* 2. Estructura de 3 Columnas (Cuerpo) */}
      <div className="footer-content-main">
        <div className="container footer-grid-system">
          {/* Columna 1 */}
          <div className="footer-col-1">
            <h2 className="brand-title">Energía</h2>
            <div className="title-divider-gold"></div>
            <div className="col-details">
              <h3 className="sub-title">Sede Principal</h3>
              <p>Calle 43 No. 57-31 CAN, Bogotá D.C., Colombia.</p>
              <p><strong>Horario:</strong> Lunes a Viernes de 8:00 a.m. a 5:00 p.m. Jornada continua.</p>
              <p><strong>Teléfono Conmutador:</strong> (60+1) 2200 300</p>
              <p><strong>Correo Institucional:</strong> contacto@energia.gov.co</p>
              <p><strong>Correo Anticorrupción:</strong> anticorrupcion@energia.gov.co</p>
              <p><strong>Notificaciones Judiciales:</strong> notificacionesjudiciales@energia.gov.co</p>
            </div>
          </div>

          {/* Columna 2 */}
          <div className="footer-col-2">
            <h3 className="sub-title">Sede Archivo Central</h3>
            <div className="col-details">
              <p><strong>Dirección:</strong> Carrera 50 No. 18-92, Bogotá D.C.</p>
              <p><strong>Horario de atención:</strong> Lunes a Viernes de 7:00 a.m. a 4:00 p.m. Jornada continua.</p>
            </div>
          </div>

          {/* Columna 3 */}
          <div className="footer-col-3">
            <h2 className="brand-title">Contacto Rápido</h2>
            <div className="col-details">
              <p className="linea-label">Línea Gratuita Nacional:</p>
              <p className="linea-highlight">01-8000-910-180</p>
              <div className="footer-logo-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <img src={energiaAmarillaLogo} alt="Energía" className="footer-logo-res" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <img src={logoSGC} alt="Logo SGC" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
                  <span style={{ fontWeight: 700, color: '#203A68', fontSize: 18 }}>SGC</span>
                  <img src={logoANM} alt="Logo ANM" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
                  <span style={{ fontWeight: 700, color: '#203A68', fontSize: 18 }}>ANM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Redes Sociales e Información Legal (Inferior) */}
      <div className="footer-bottom-bar">
        <div className="container">
          <div className="social-row-flex">
            <a href="#" className="social-icon-link" aria-label="X">
              <IconX size={24} color="#203A68" /> <span>@EnergíaCo</span>
            </a>
            <a href="#" className="social-icon-link" aria-label="YouTube">
              <IconYoutube size={24} color="#203A68" /> <span>Energía TV</span>
            </a>
            <a href="#" className="social-icon-link" aria-label="TikTok">
              <IconTiktok size={24} color="#203A68" /> <span>@energia</span>
            </a>
            <a href="#" className="social-icon-link" aria-label="Facebook">
              <IconFacebook size={24} color="#203A68" /> <span>Energía Oficial</span>
            </a>
          </div>
          
          <div className="legal-info-row">
            <div className="legal-links-wrap">
              <a href="#">Privacidad</a>
              <a href="#">Mapa del sitio</a>
              <a href="#">Contacto</a>
            </div>
            <div className="legal-copyright-text">
              © 2026 Energía - Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
