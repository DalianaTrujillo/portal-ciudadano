import React, { useState } from 'react';
import './ServiceModules.css';

/* ── Datos ─────────────────────────────────────────────── */
const ingresosData = [
  { label: 'Carbón',          value: 38, color: '#1E3A5F' },
  { label: 'Petróleo y gas',  value: 35, color: '#203A68' },
  { label: 'Níquel',          value: 10, color: '#64748B' },
  { label: 'Oro',             value: 12, color: '#EDB600' },
  { label: 'Otros',           value:  5, color: '#94A3B8' },
];

const distribucionData = [
  { label: 'Entidades territoriales',          value: 42, color: '#203A68' },
  { label: 'Asignaciones directas',            value: 28, color: '#EDB600' },
  { label: 'Fondo de Compensación Regional',   value: 15, color: '#22C55E' },
  { label: 'Fondo de Ciencia y Tecnología',    value: 10, color: '#7C3AED' },
  { label: 'Fondo de Ahorro y Estabilización', value:  5, color: '#64748B' },
];

/* ── Helpers SVG donut ─────────────────────────────────── */
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildSlicePath(cx, cy, r, ri, start, end) {
  const s1 = polarToCartesian(cx, cy, r, start);
  const s2 = polarToCartesian(cx, cy, r, end);
  const i1 = polarToCartesian(cx, cy, ri, start);
  const i2 = polarToCartesian(cx, cy, ri, end);
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${s2.x} ${s2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${ri} ${ri} 0 ${large} 0 ${i1.x} ${i1.y}`,
    'Z',
  ].join(' ');
}

/* ── Donut chart ───────────────────────────────────────── */
function DonutChart({ data }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const CX = 100, CY = 100, R = 78, RI = 44, GAP = 2.5;

  const total = data.reduce((s, d) => s + d.value, 0);
  let cursor = 0;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * (360 - data.length * GAP);
    const start = cursor;
    const end = cursor + sweep;
    cursor = end + GAP;
    const r = activeIdx === i ? R + 6 : R;
    return { ...d, path: buildSlicePath(CX, CY, r, RI, start, end) };
  });

  const focused = activeIdx !== null ? slices[activeIdx] : null;

  return (
    <div className="sm-donut-wrap">
      <div className="sm-donut-svg-col">
        <svg viewBox="0 0 200 200" className="sm-donut-svg" aria-label="Ingresos por tipo de recurso">
          {slices.map((s, i) => (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              opacity={activeIdx === null || activeIdx === i ? 1 : 0.35}
              style={{ cursor: 'pointer', transition: 'opacity 0.18s' }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            />
          ))}
          {focused ? (
            <>
              <text x={CX} y={CY - 5} textAnchor="middle" fontSize="22" fontWeight="800" fill="#203A68" fontFamily="'Nunito Sans', sans-serif">
                {focused.value}%
              </text>
              <text x={CX} y={CY + 13} textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#64748B" fontFamily="'Nunito Sans', sans-serif">
                {focused.label.split(' ').slice(0, 3).join(' ')}
              </text>
            </>
          ) : (
            <>
              <text x={CX} y={CY - 5} textAnchor="middle" fontSize="18" fontWeight="800" fill="#203A68" fontFamily="'Nunito Sans', sans-serif">
                $12.8B
              </text>
              <text x={CX} y={CY + 13} textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#64748B" fontFamily="'Nunito Sans', sans-serif">
                Total 2024
              </text>
            </>
          )}
        </svg>
      </div>

      <ul className="sm-donut-legend">
        {slices.map((s, i) => (
          <li
            key={i}
            className={`sm-legend-item${activeIdx === i ? ' is-active' : ''}`}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <span className="sm-legend-dot" style={{ background: s.color }} />
            <span className="sm-legend-label">{s.label}</span>
            <span className="sm-legend-pct">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Barras de progreso ────────────────────────────────── */
function ProgressBars({ data }) {
  return (
    <ul className="sm-bars-list">
      {data.map((item, i) => (
        <li key={i} className="sm-bar-item">
          <div className="sm-bar-header">
            <span className="sm-bar-label">{item.label}</span>
            <span className="sm-bar-pct">{item.value}%</span>
          </div>
          <div className="sm-bar-track">
            <div
              className="sm-bar-fill"
              style={{ '--bar-target': `${item.value}%`, background: item.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── Componente principal ──────────────────────────────── */
const ServiceModules = () => (
  <section className="service-modules">
    <div className="container section-inner">
      <div className="section-header">
        <div className="eyebrow">Ecosistema Institucional</div>
        <h2>Portal Unificado del Sector</h2>
        <p>Consulte los principales indicadores del ciclo de regalías del sector minero-energético colombiano.</p>
      </div>

      {/* Tarjetas de indicadores */}
      <div className="sm-indicators-grid">
        <div className="sm-card">
          <div className="sm-card-header">
            <h3 className="sm-card-title">Ingresos por tipo de recurso</h3>
            <span className="sm-badge">2024</span>
          </div>
          <DonutChart data={ingresosData} />
        </div>

        <div className="sm-card">
          <div className="sm-card-header">
            <h3 className="sm-card-title">Distribución de regalías</h3>
            <span className="sm-badge">2024</span>
          </div>
          <ProgressBars data={distribucionData} />
        </div>
      </div>
    </div>
  </section>
);

export default ServiceModules;

