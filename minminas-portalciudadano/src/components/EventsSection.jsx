import React from 'react';
import logoSGC from '../assets/Logo SGC (2).png';
import logoANM from '../assets/Logo ANM (1).png';

export default function EventsSection() {
  const donutLegend = [
    { label: 'Geociencias', color: '#0ea5e9', pct: 30 },
    { label: 'Geoamenazas', color: '#0284c7', pct: 25 },
    { label: 'Recursos Minerales', color: '#0369a1', pct: 25 },
    { label: 'Hidrogeología', color: '#10b981', pct: 20 },
  ];
  const barData = [
    { label: 'Títulos y Registro Minero', pct: 35 },
    { label: 'RUCOM y Formalización', pct: 30 },
    { label: 'Producción y Regalías', pct: 20 },
    { label: 'Plantas de Beneficio', pct: 15 },
  ];
  return (
    <section style={{ padding: '70px 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <h2 style={{
          color: '#203A68',
          fontWeight: 900,
          fontSize: 32,
          textAlign: 'center',
          marginBottom: 38,
          letterSpacing: 0.5
        }}>
          Centro de Analítica y Datos Abiertos
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 32
        }}>
          {/* Columna 1: Donut Chart */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 24
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              width: '100%'
            }}>
              <span style={{
                color: '#203A68',
                fontWeight: 800,
                fontSize: 20,
                textAlign: 'left'
              }}>
                SGC - Distribución de Investigaciones
              </span>
              <img
                src={logoSGC}
                alt="Logo SGC"
                style={{ height: '35px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'conic-gradient(#0ea5e9 0% 30%, #0284c7 30% 55%, #0369a1 55% 80%, #10b981 80% 100%)',
              position: 'relative',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 120,
                height: 120,
                background: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2
              }}></div>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '32px 0 0 0',
              width: '100%'
            }}>
              {donutLegend.map((item, idx) => (
                <li key={item.label} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, fontSize: 15, color: '#334155', fontWeight: 500 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    background: item.color,
                    borderRadius: 4,
                    marginRight: 10
                  }}></span>
                  {item.label} <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{item.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Columna 2: Barras Horizontales */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: 24
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              width: '100%'
            }}>
              <span style={{
                color: '#203A68',
                fontWeight: 800,
                fontSize: 20,
                textAlign: 'left'
              }}>
                ANM - Categorías de Información
              </span>
              <img
                src={logoANM}
                alt="Logo ANM"
                style={{ height: '35px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              {barData.map((item) => (
                <div key={item.label} style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ color: '#334155', fontSize: 15, fontWeight: 500 }}>
                      {item.label}
                    </span>
                    <span style={{ color: '#eab308', fontWeight: 700, fontSize: 15 }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '10px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '5px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: '#eab308',
                        width: `${item.pct}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
