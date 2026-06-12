import React, { useMemo, useState } from 'react';

const tendencias = {
  up: {
    label: 'Al alza',
    color: '#F97316',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </svg>
    ),
  },
  flat: {
    label: 'Estable',
    color: '#EDB600',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 12h16" />
      </svg>
    ),
  },
  down: {
    label: 'A la baja',
    color: '#22C55E',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M18 13l-6 6-6-6" />
      </svg>
    ),
  },
};

const alertasVolcanicas = [
  {
    nombre: 'Puracé',
    departamento: 'Cauca - Huila',
    estado: 'Naranja',
    ultimoReporte: 'Hace 2 horas',
    tendencia: 'up',
    colorBase: '#F97316',
  },
  {
    nombre: 'Nevado del Ruiz',
    departamento: 'Tolima - Caldas',
    estado: 'Amarilla',
    ultimoReporte: 'Hace 5 horas',
    tendencia: 'flat',
    colorBase: '#EDB600',
  },
  {
    nombre: 'Galeras',
    departamento: 'Nariño',
    estado: 'Amarilla',
    ultimoReporte: 'Hace 12 horas',
    tendencia: 'flat',
    colorBase: '#EDB600',
  },
  {
    nombre: 'Nevado del Huila',
    departamento: 'Huila - Cauca - Tolima',
    estado: 'Verde',
    ultimoReporte: 'Hace 1 día',
    tendencia: 'down',
    colorBase: '#22C55E',
  },
];

const TablaAlertasVolcanicas = () => {
  const [busqueda, setBusqueda] = useState('');

  const filas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) {
      return alertasVolcanicas;
    }

    return alertasVolcanicas.filter((item) => {
      return (
        item.nombre.toLowerCase().includes(termino) ||
        item.departamento.toLowerCase().includes(termino) ||
        item.estado.toLowerCase().includes(termino)
      );
    });
  }, [busqueda]);

  return (
    <section
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '8px',
        padding: '24px',
        fontFamily: 'Nunito Sans, sans-serif',
        border: '1px solid rgba(255,255,255,0.12)',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          style={{
            margin: 0,
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '0.02em',
          }}
        >
          ESTADO DE ALERTA VOLCÁNICA
        </h2>

        <input
          type="search"
          placeholder="Buscar volcán, estado o departamento"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '10px 12px',
            minWidth: '260px',
            outline: 'none',
            fontSize: '0.9rem',
          }}
          aria-label="Buscar alertas volcánicas"
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.8rem', padding: '12px 8px' }}>Nombre</th>
              <th style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.8rem', padding: '12px 8px' }}>Departamento</th>
              <th style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.8rem', padding: '12px 8px' }}>Estado</th>
              <th style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.8rem', padding: '12px 8px' }}>Último Reporte</th>
              <th style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.8rem', padding: '12px 8px' }}>Tendencia</th>
              <th style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.8rem', padding: '12px 8px' }} />
            </tr>
          </thead>
          <tbody>
            {filas.map((item) => {
              const tendencia = tendencias[item.tendencia];

              return (
                <tr key={item.nombre} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ color: '#FFFFFF', padding: '14px 8px', fontWeight: 700 }}>{item.nombre}</td>
                  <td style={{ color: 'rgba(255,255,255,0.8)', padding: '14px 8px' }}>{item.departamento}</td>
                  <td style={{ padding: '14px 8px' }}>
                    <span
                      style={{
                        borderRadius: '16px',
                        padding: '6px 12px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: item.colorBase,
                        backgroundColor: `${item.colorBase}20`,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.8)', padding: '14px 8px' }}>{item.ultimoReporte}</td>
                  <td style={{ color: tendencia.color, padding: '14px 8px' }} aria-label={tendencia.label}>
                    {tendencia.icon}
                  </td>
                  <td style={{ padding: '14px 8px' }}>
                    <button
                      type="button"
                      aria-label={`Ver detalle de ${item.nombre}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.03)',
                        color: 'rgba(255,255,255,0.8)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TablaAlertasVolcanicas;
