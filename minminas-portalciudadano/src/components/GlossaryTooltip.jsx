import React, { useState } from 'react';

const glossary = {
  SGR: 'Sistema General de Regalías — mecanismo de distribución de los ingresos provenientes de la explotación de recursos naturales no renovables.',
  ANM: 'Agencia Nacional de Minería — entidad que administra y fiscaliza los recursos mineros del Estado colombiano.',
  SGC: 'Servicio Geológico Colombiano — entidad científica que investiga el subsuelo, riesgos geológicos y recursos minerales.',
  ANH: 'Agencia Nacional de Hidrocarburos — administra los recursos de petróleo y gas del país.',
  UPME: 'Unidad de Planeación Minero Energética — entidad técnica de planeación del sector minero-energético.',
  IPSE: 'Instituto de Planificación de Soluciones Energéticas — lleva energía a zonas no interconectadas.',
  OCAD: 'Órgano Colegiado de Administración y Decisión — instancia que aprueba proyectos financiados con regalías.',
  SMSCE: 'Sistema de Monitoreo, Seguimiento, Control y Evaluación — plataforma del DNP para seguimiento de proyectos SGR.',
  RUCOM: 'Registro Único de Comercializadores de Minerales — registro oficial de comercializadores autorizados.',
  MIIG: 'Modelo Integrado de Información Geológica — plataforma del SGC para consulta integrada de datos geocientíficos.',
  SICEP: 'Sistema de Información Minero Energético Colombiano — plataforma de datos del sector minero-energético.',
  DNP: 'Departamento Nacional de Planeación — entidad que coordina y evalúa la inversión pública, incluyendo regalías.',
  MinMinas: 'Ministerio de Minas y Energía — rector del sector minero-energético colombiano.',
  AnnA: 'AnnA Minería — plataforma digital de la ANM para trámites mineros en línea.',
};

const GlossaryTooltip = ({ term, children }) => {
  const [show, setShow] = useState(false);
  const definition = glossary[term];

  if (!definition) return children;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        cursor: 'help',
        borderBottom: '1px dashed #EDB600',
        fontWeight: 700,
        color: '#203A68'
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children || term}
      {show && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1E293B',
          color: '#fff',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: 1.5,
          padding: '10px 14px',
          borderRadius: 8,
          maxWidth: 300,
          width: 'max-content',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 999,
          pointerEvents: 'none',
          whiteSpace: 'normal',
        }}>
          <strong style={{ color: '#EDB600' }}>{term}</strong>: {definition}
        </span>
      )}
    </span>
  );
};

const GlossarySection = () => (
  <div style={{
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    border: '1px solid #E2E8F0',
    marginTop: 32
  }}>
    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#203A68', marginBottom: 20 }}>
      Glosario del Sector
    </h3>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 12
    }}>
      {Object.entries(glossary).map(([term, def]) => (
        <div key={term} style={{
          padding: '12px 16px',
          background: '#F8FAFC',
          borderRadius: 8,
          border: '1px solid #E2E8F0'
        }}>
          <strong style={{ color: '#203A68', fontSize: 13, display: 'block', marginBottom: 4 }}>{term}</strong>
          <span style={{ color: '#64748B', fontSize: 11, lineHeight: 1.4 }}>{def}</span>
        </div>
      ))}
    </div>
  </div>
);

export { GlossaryTooltip, GlossarySection };
export default GlossaryTooltip;
