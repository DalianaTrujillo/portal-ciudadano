import React from 'react';
import { X, ExternalLink, Activity, Map, Shield, BookOpen, Droplets, Zap, Gem, Cpu, Database } from 'lucide-react';

const entityData = {
  anm: {
    acronym: 'ANM',
    name: 'Agencia Nacional de Minería',
    description: 'Autoridad minera en Colombia encargada de administrar, fiscalizar y promover el aprovechamiento de los recursos minerales del Estado.',
    mission: 'Administrar los recursos mineros del Estado, promover la formalización minera, fiscalizar la actividad extractiva y garantizar el aprovechamiento sostenible de los minerales.',
    services: [
      { icon: <Gem size={20} />, label: 'Títulos Mineros', desc: 'Consulta y seguimiento de títulos, contratos y licencias de explotación minera.' },
      { icon: <Shield size={20} />, label: 'Fiscalización Minera', desc: 'Programas de inspección, vigilancia y control de la actividad minera en el territorio nacional.' },
      { icon: <BookOpen size={20} />, label: 'RUCOM', desc: 'Registro Único de Comercializadores de Minerales — consulta de comercializadores autorizados.' },
      { icon: <Activity size={20} />, label: 'Producción y Regalías', desc: 'Estadísticas de producción mineral y liquidación de regalías por tipo de mineral y región.' },
      { icon: <Database size={20} />, label: 'AnnA Minería', desc: 'Plataforma de trámites mineros en línea para solicitudes, pagos y seguimiento.' },
      { icon: <Map size={20} />, label: 'Catastro Minero', desc: 'Mapa de áreas tituladas, solicitudes y áreas de reserva especial.' },
    ],
    links: [
      { label: 'Sitio web ANM', url: 'https://www.anm.gov.co' },
      { label: 'AnnA Minería', url: 'https://www.anm.gov.co/?q=v_minera' },
      { label: 'RUCOM', url: 'https://rucom.anm.gov.co/' },
    ]
  },
  anh: {
    acronym: 'ANH',
    name: 'Agencia Nacional de Hidrocarburos',
    description: 'Entidad encargada de administrar los recursos de hidrocarburos del país y promover su aprovechamiento sostenible.',
    mission: 'Administrar y gestionar los recursos de hidrocarburos del Estado, promoviendo la exploración y producción de petróleo y gas con criterios de responsabilidad social y ambiental.',
    services: [
      { icon: <Droplets size={20} />, label: 'Contratos E&P', desc: 'Asignación y seguimiento de contratos de exploración y producción de hidrocarburos.' },
      { icon: <Map size={20} />, label: 'Áreas de Interés', desc: 'Mapa de áreas disponibles para exploración y producción de hidrocarburos.' },
      { icon: <Activity size={20} />, label: 'Producción de Petróleo', desc: 'Estadísticas de producción nacional de petróleo crudo por campo y región.' },
      { icon: <Activity size={20} />, label: 'Producción de Gas', desc: 'Estadísticas de producción de gas natural y su distribución por regiones.' },
      { icon: <BookOpen size={20} />, label: 'Regalías Hidrocarburos', desc: 'Liquidación y distribución de regalías generadas por la producción de hidrocarburos.' },
      { icon: <Database size={20} />, label: 'Datos Abiertos ANH', desc: 'Catálogo de datos abiertos sobre contratos, producción y pozo.' },
    ],
    links: [
      { label: 'Sitio web ANH', url: 'https://www.anh.gov.co' },
      { label: 'Datos Abiertos ANH', url: 'https://www.anh.gov.co/es/operaciones/estadisticas' },
    ]
  },
  upme: {
    acronym: 'UPME',
    name: 'Unidad de Planeación Minero Energética',
    description: 'Entidad técnica encargada de la planeación integral del sector minero-energético colombiano.',
    mission: 'Planear el desarrollo minero-energético del país, generar información técnica y estadística, y promover el uso eficiente de la energía.',
    services: [
      { icon: <Zap size={20} />, label: 'Planeación Energética', desc: 'Planes indicativos y estratégicos para el desarrollo del sector minero-energético nacional.' },
      { icon: <Activity size={20} />, label: 'Estadísticas Mineras', desc: 'Producción, exportaciones y precios de minerales en Colombia.' },
      { icon: <Activity size={20} />, label: 'Estadísticas Energéticas', desc: 'Indicadores de oferta y demanda de energía eléctrica y combustibles.' },
      { icon: <Map size={20} />, label: 'Atlas Minero', desc: 'Información geográfica de recursos minerales y áreas de interés minero.' },
      { icon: <Shield size={20} />, label: 'Eficiencia Energética', desc: 'Programas y proyectos para el uso racional y eficiente de la energía.' },
      { icon: <Database size={20} />, label: 'SICEP - Minería', desc: 'Sistema de Información Minero Energético Colombiano — consulta de datos del sector.' },
    ],
    links: [
      { label: 'Sitio web UPME', url: 'https://www1.upme.gov.co' },
      { label: 'SICEP', url: 'https://www1.upme.gov.co/simineria' },
    ]
  },
  sgc: {
    acronym: 'SGC',
    name: 'Servicio Geológico Colombiano',
    description: 'Entidad científica y técnica que investiga los recursos del subsuelo, los riesgos geológicos y el conocimiento geocientífico del país.',
    mission: 'Generar conocimiento geocientífico del territorio colombiano para la gestión del riesgo, el aprovechamiento de recursos minerales y la planificación territorial.',
    services: [
      { icon: <Activity size={20} />, label: 'Sismos y Geoamenazas', desc: 'Monitoreo sísmico en tiempo real, alertas de actividad volcánica y evaluación de amenazas geológicas.' },
      { icon: <Map size={20} />, label: 'Cartografía Geológica', desc: 'Mapas geológicos, geoquímicos y geofísicos del territorio nacional a diferentes escalas.' },
      { icon: <Droplets size={20} />, label: 'Aguas Subterráneas', desc: 'Estudios de hidrogeología, calidad y disponibilidad de aguas subterráneas por región.' },
      { icon: <Gem size={20} />, label: 'Recursos Minerales', desc: 'Investigación de depósitos minerales, potencial minero del subsuelo colombiano.' },
      { icon: <Cpu size={20} />, label: 'Asuntos Nucleares', desc: 'Regulación y control de materiales radiactivos, gestión del reactor nuclear y protección radiológica.' },
      { icon: <Shield size={20} />, label: 'Museo Geológico', desc: 'Exposición de fósiles, minerales y rocas representativas de la historia geológica de Colombia.' },
    ],
    links: [
      { label: 'Sitio web SGC', url: 'https://www.sgc.gov.co' },
      { label: 'Geoportal SGC', url: 'https://geoportal.sgc.gov.co/' },
      { label: 'Boletín Sísmico', url: 'https://www2.sgc.gov.co/sismo/BoletinSismico/Paginas/consultaBoletinSismico.aspx' },
      { label: 'MIIG - Información Geológica', url: 'https://miig.sgc.gov.co/' },
    ]
  },
  ipse: {
    acronym: 'IPSE',
    name: 'Instituto de Planificación de Soluciones Energéticas',
    description: 'Entidad que promueve el acceso a energía en zonas no interconectadas del país mediante soluciones sostenibles.',
    mission: 'Llevar energía limpia y sostenible a las comunidades en zonas no interconectadas, mejorando su calidad de vida y fomentando el desarrollo productivo.',
    services: [
      { icon: <Zap size={20} />, label: 'Soluciones Energéticas', desc: 'Implementación de paneles solares, pequeñas hidroeléctricas y otras soluciones renovables.' },
      { icon: <Map size={20} />, label: 'Zonas No Interconectadas', desc: 'Mapa de municipios y comunidades sin acceso a la red eléctrica nacional.' },
      { icon: <Database size={20} />, label: 'Proyectos Ejecutados', desc: 'Base de datos de proyectos de energización rural ejecutados por el IPSE.' },
      { icon: <BookOpen size={20} />, label: 'Asistencia Técnica', desc: 'Capacitación y acompañamiento técnico para comunidades en soluciones energéticas.' },
    ],
    links: [
      { label: 'Sitio web IPSE', url: 'https://www.ipse.gov.co' },
    ]
  }
};

const EntityDetailModal = ({ entityId, onClose }) => {
  const entity = entityData[entityId];
  if (!entity) return null;

  return (
    <div className="entity-modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', overflowY: 'auto'
    }}>
      <div className="entity-modal" onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, maxWidth: 900, width: '100%',
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: '#f1f5f9',
          border: 'none', borderRadius: 8, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 2
        }}>
          <X size={18} />
        </button>

        <div style={{ padding: '40px 40px 32px', borderBottom: '2px solid #EDB600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: '#203A68' }}>{entity.acronym}</span>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#203A68', margin: 0 }}>{entity.name}</h2>
              <p style={{ fontSize: 14, color: '#64748B', margin: '4px 0 0' }}>{entity.description}</p>
            </div>
          </div>
          <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.6, margin: 0 }}>{entity.mission}</p>
        </div>

        <div style={{ padding: '32px 40px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#203A68', marginBottom: 20 }}>Servicios y temas</h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12
          }}>
            {entity.services.map((svc, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, padding: '14px 16px',
                background: '#F8FAFC', borderRadius: 10,
                border: '1px solid #E2E8F0', transition: 'box-shadow 0.2s'
              }}>
                <div style={{ color: '#203A68', flexShrink: 0, marginTop: 2 }}>{svc.icon}</div>
                <div>
                  <strong style={{ fontSize: 14, color: '#203A68', display: 'block' }}>{svc.label}</strong>
                  <span style={{ fontSize: 12, color: '#64748B', lineHeight: 1.4 }}>{svc.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 40px 32px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#203A68', marginBottom: 12 }}>Enlaces externos</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {entity.links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', background: '#EEF2FF', borderRadius: 8,
                  color: '#203A68', fontWeight: 700, fontSize: 13,
                  textDecoration: 'none', border: '1px solid #DBEAFE'
                }}
              >
                {link.label} <ExternalLink size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDetailModal;
