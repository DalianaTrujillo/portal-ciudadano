import React, { useState } from 'react';
import { X, FileText, Shield, ExternalLink, BookOpen, Map, Activity, Database } from 'lucide-react';

const GLOSARIO = {
  ANM: 'Agencia Nacional de Minería — entidad que administra y fiscaliza los recursos mineros del Estado colombiano.',
  SGC: 'Servicio Geológico Colombiano — entidad científica que investiga el subsuelo, los riesgos geológicos y los recursos minerales del país.',
  SGR: 'Sistema General de Regalías — mecanismo de distribución de los ingresos provenientes de la explotación de recursos naturales no renovables.',
  UPME: 'Unidad de Planeación Minero Energética — entidad técnica de planeación del sector minero-energético.',
  RUCOM: 'Registro Único de Comercializadores de Minerales — registro oficial de comercializadores autorizados.',
  MIIG: 'Modelo Integrado de Información Geológica — plataforma del SGC para consulta integrada de datos geocientíficos.',
  OCAD: 'Órgano Colegiado de Administración y Decisión — instancia que aprueba proyectos financiados con regalías.',
};

function Tooltip({ term, children }) {
  const [show, setShow] = useState(false);
  const def = GLOSARIO[term];
  if (!def) return children;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        cursor: 'help',
        borderBottom: '1px dashed #EDB600',
        fontWeight: 700,
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children || term}
      {show && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1E293B',
            color: '#F8FAFC',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.5,
            padding: '10px 14px',
            borderRadius: 8,
            maxWidth: 280,
            width: 'max-content',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 9999,
            pointerEvents: 'none',
            whiteSpace: 'normal',
          }}
        >
          <strong style={{ color: '#EDB600' }}>{term}</strong>: {def}
        </span>
      )}
    </span>
  );
}

const DATOS = {
  anm: {
    sigla: 'ANM',
    nombre: 'Agencia Nacional de Minería',
    descripcion: 'Autoridad minera del Estado colombiano encargada de administrar, fiscalizar y promover el aprovechamiento de los recursos minerales.',
    rol: 'La ANM es la entidad rectora de la actividad minera en Colombia. Se encarga de otorgar títulos mineros, fiscalizar su cumplimiento, recaudar regalías y promover la formalización de la pequeña y mediana minería.',
    infoCiudadania: 'Los ciudadanos pueden consultar el estado de títulos mineros, reportar minería ilegal, acceder a datos de producción mineral por región, y realizar trámites en línea a través de la plataforma AnnA Minería.',
    subBotones: [
      { label: 'Títulos Mineros', icon: <FileText size={22} /> },
      { label: 'FISCALIZACIÓN MINERA', icon: <Shield size={22} /> },
      { label: 'Trámites', icon: <ExternalLink size={22} /> },
      { label: 'Datos Abiertos', icon: <Database size={22} /> },
    ],
    enlaces: [
      { label: 'AnnA Minería', url: 'https://www.anm.gov.co/?q=v_minera' },
      { label: 'RUCOM', url: 'https://rucom.anm.gov.co/' },
    ],
    color: '#1E3A5F',
  },
  sgc: {
    sigla: 'SGC',
    nombre: 'Servicio Geológico Colombiano',
    descripcion: 'Entidad científica y técnica que genera conocimiento geocientífico del territorio colombiano para la gestión del riesgo y el desarrollo sostenible.',
    rol: 'El SGC investiga el subsuelo colombiano, monitorea la actividad sísmica y volcánica, produce cartografía geológica, evalúa amenazas naturales y gestiona el conocimiento geocientífico del país.',
    infoCiudadania: 'La ciudadanía puede consultar el boletín sísmico en tiempo real, conocer el nivel de actividad volcánica, acceder a mapas geológicos interactivos, y descargar publicaciones científicas del suelo y subsuelo colombiano.',
    subBotones: [
      { label: 'CONOCIMIENTO Y CARTOGRAFÍA GEOLÓGICA', icon: <Map size={22} /> },
      { label: 'Geoamenazas', icon: <Activity size={22} /> },
      { label: 'Mapas', icon: <Map size={22} /> },
      { label: 'Publicaciones', icon: <BookOpen size={22} /> },
    ],
    enlaces: [
      { label: 'Geoportal SGC', url: 'https://geoportal.sgc.gov.co/' },
      { label: 'MIIG', url: 'https://miig.sgc.gov.co/' },
      { label: 'Boletín Sísmico', url: 'https://www2.sgc.gov.co/sismo/BoletinSismico/Paginas/consultaBoletinSismico.aspx' },
    ],
    color: '#22779E',
  },
};

function SubBoton({ icon, label }) {
  return (
    <button
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '20px 12px',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        color: '#F8FAFC',
        cursor: 'pointer',
        fontFamily: "'Nunito Sans', sans-serif",
        fontSize: 12,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        transition: 'all 0.2s ease',
        minHeight: 90,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(237, 182, 0, 0.15)';
        e.currentTarget.style.borderColor = '#EDB600';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ color: '#EDB600' }}>{icon}</span>
      <span style={{ textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </button>
  );
}

function SeccionEducativa({ titulo, contenido }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        padding: '16px 20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <h4
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: '#EDB600',
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          margin: '0 0 6px',
        }}
      >
        {titulo}
      </h4>
      <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, margin: 0 }}>
        {contenido}
      </p>
    </div>
  );
}

function VistaEntidadModal({ entityId, onClose }) {
  const entidad = DATOS[entityId];
  if (!entidad) return null;

  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    color: '#F8FAFC',
    fontWeight: 700,
    fontSize: 13,
    textDecoration: 'none',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    transition: 'background 0.15s',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 16,
          maxWidth: 800,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#F8FAFC',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: 8,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#F8FAFC',
            zIndex: 2,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <X size={18} />
        </button>

        <div style={{ padding: '36px 36px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <span
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: '#EDB600',
                lineHeight: 1,
              }}
            >
              <Tooltip term={entidad.sigla}>{entidad.sigla}</Tooltip>
            </span>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                {entidad.nombre}
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0' }}>
                {entidad.descripcion}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 36px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SeccionEducativa titulo="¿Qué hace la entidad?" contenido={entidad.descripcion} />
          <SeccionEducativa titulo="¿Cuál es su rol en el sector?" contenido={entidad.rol} />
          <SeccionEducativa titulo="¿Qué información de interés hay para la ciudadanía?" contenido={entidad.infoCiudadania} />
        </div>

        <div style={{ padding: '0 36px 28px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#EDB600', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Servicios y temas de interés
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 10,
            }}
          >
            {entidad.subBotones.map((btn, i) => (
              <SubBoton key={i} icon={btn.icon} label={btn.label} />
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '20px 36px 32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
            ENLACES DE INTERÉS
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {entidad.enlaces.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                {link.label} <ExternalLink size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VistaEntidadModal;
