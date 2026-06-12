import React, { useState, useEffect, useCallback } from 'react';
import { Search, Lock } from 'lucide-react';
import energiaAmarillaLogo from '../assets/Energía Amarillo.png';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'inicio',      label: 'Inicio' },
  { id: 'ciclo',       label: 'Regalías' },
  { id: 'entidades',   label: 'Entidades' },
  { id: 'indicadores', label: 'Indicadores' },
  { id: 'documental',  label: 'Gestor Documental' },
];

const Navbar = ({ activePage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header className={`navbar-root${scrolled ? ' is-scrolled' : ''}`}>

      {/* ─── Barra Superior — Utilidades ─── */}
      <div className="navbar-topbar">
        <div className="navbar-topbar-inner">
          <div className="navbar-topbar-right">
            <button
              className="navbar-top-link"
              onClick={() => onNavigate('aprende')}
            >
              Aprende sobre el sector
            </button>

            <button
              className="navbar-top-btn"
              onClick={() => onNavigate('buscar')}
              aria-label="Buscar en el portal"
            >
              <Search size={16} />
            </button>

            <a
              href="#"
              className="navbar-top-btn navbar-top-btn--login"
              onClick={(e) => e.preventDefault()}
            >
              <Lock size={14} />
              <span>Ingreso Institucional</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Barra Principal — Navegación Misional ─── */}
      <div className="navbar-mainbar">
        <div className="navbar-mainbar-inner">
          <div className="navbar-brand">
            <img src={energiaAmarillaLogo} alt="Ministerio de Minas y Energía" className="navbar-logo" />
            <div className="navbar-divider" />
            <div className="navbar-title-group">
              <span className="navbar-ministry">Ministerio de Minas y Energía</span>
              <span className="navbar-title">Módulo Ciudadano Sector Minero</span>
              <span className="navbar-subtitle">Portal Ciudadano | MinMinas</span>
            </div>
          </div>

          <nav className="navbar-nav" role="navigation" aria-label="Navegación principal">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`navbar-nav-link${activePage === item.id ? ' is-active' : ''}`}
                onClick={() => onNavigate(item.id)}
                aria-current={activePage === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
