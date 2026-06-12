import React from 'react';
import { Pickaxe, DollarSign, BarChart, Landmark, MapPin, Users, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Pickaxe size={28} />,
    title: 'Explotación',
    desc: 'Las empresas mineras extraen recursos minerales del subsuelo colombiano bajo títulos y contratos otorgados por la ANM.',
    color: '#203A68'
  },
  {
    icon: <DollarSign size={28} />,
    title: 'Liquidación',
    desc: 'Se calculan las regalías como porcentaje de la producción. La ANM liquida y recauda los pagos de los titulares mineros.',
    color: '#EDB600'
  },
  {
    icon: <BarChart size={28} />,
    title: 'Distribución SGR',
    desc: 'Los recursos ingresan al Sistema General de Regalías (SGR) y se distribuyen a entidades territoriales y fondos especializados.',
    color: '#22C55E'
  },
  {
    icon: <Landmark size={28} />,
    title: 'Inversión',
    desc: 'Los municipios, departamentos y fondos ejecutan proyectos de inversión en salud, educación, infraestructura y desarrollo.',
    color: '#7C3AED'
  },
  {
    icon: <MapPin size={28} />,
    title: 'Seguimiento',
    desc: 'El DNP y los OCAD monitorean la ejecución de proyectos a través del SMSCE, garantizando transparencia en el uso de recursos.',
    color: '#0EA5E9'
  },
  {
    icon: <Users size={28} />,
    title: 'Participación',
    desc: 'La ciudadanía puede consultar proyectos, presentar veedurías y participar en espacios de control social y rendición de cuentas.',
    color: '#0D9488'
  }
];

const InfographicSection = () => (
  <section style={{
    background: '#0A192F',
    padding: '80px 0',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")`,
      pointerEvents: 'none'
    }} />
    <div className="container section-inner" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span style={{
          fontSize: 13, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: 1.5, color: '#EDB600', display: 'block', marginBottom: 8
        }}>
          ¿Cómo funciona?
        </span>
        <h2 style={{
          fontSize: 36, fontWeight: 800, color: '#fff', margin: 0
        }}>
          Ciclo de las Regalías Mineras
        </h2>
        <p style={{
          fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '16px auto 0'
        }}>
          Desde la explotación hasta la inversión social — conoce cómo las regalías mineras se transforman en desarrollo para las regiones.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 0,
        position: 'relative',
      }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '24px 16px',
            position: 'relative',
          }}>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute',
                top: 44,
                left: 'calc(50% + 28px)',
                width: 'calc(100% - 56px)',
                height: 2,
                background: `linear-gradient(90deg, ${step.color}, ${steps[i + 1].color})`,
                opacity: 0.3,
                zIndex: 0
              }} />
            )}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: step.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1,
              marginBottom: 16,
              boxShadow: `0 0 0 4px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.3)`
            }}>
              {step.icon}
            </div>
            <strong style={{
              fontSize: 13, fontWeight: 800, color: '#fff',
              textTransform: 'uppercase', letterSpacing: 0.5,
              marginBottom: 8
            }}>
              {step.title}
            </strong>
            <p style={{
              fontSize: 11, color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.5, margin: 0, maxWidth: 180
            }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center', marginTop: 48,
        display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap'
      }}>
        <a href="https://www.minenergia.gov.co/" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: '#EDB600', color: '#203A68',
            fontWeight: 800, fontSize: 14, borderRadius: 8,
            textDecoration: 'none'
          }}>
          Más información <ArrowRight size={16} />
        </a>
      </div>
    </div>
  </section>
);

export default InfographicSection;
