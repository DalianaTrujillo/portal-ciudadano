import React, { useState, useRef } from 'react';
import './PieChart.css';

/* ─── SVG math helpers ─────────────────────────────────────────────────────── */
const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const buildSlicePath = (cx, cy, r, ri, startAngle, endAngle) => {
  // Clamp to avoid degenerate arcs
  const sweep = endAngle - startAngle;
  if (sweep <= 0) return '';

  const p1 = polarToCartesian(cx, cy, r, startAngle);
  const p2 = polarToCartesian(cx, cy, r, endAngle);
  const p3 = polarToCartesian(cx, cy, ri, endAngle);
  const p4 = polarToCartesian(cx, cy, ri, startAngle);
  const large = sweep > 180 ? 1 : 0;

  return [
    `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}`,
    `A ${r} ${r} 0 ${large} 1 ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
    `L ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`,
    `A ${ri} ${ri} 0 ${large} 0 ${p4.x.toFixed(3)} ${p4.y.toFixed(3)}`,
    'Z',
  ].join(' ');
};

/* ─── Component ────────────────────────────────────────────────────────────── */
/**
 * PieChart – interactive donut chart rendered with native SVG.
 *
 * Props
 *  data     : Array<{ label: string, value: number, color: string, unit?: string }>
 *  title    : string  – card title
 *  subtitle : string  – small eyebrow label (entity name)
 */
const PieChart = ({ data, title, subtitle }) => {
  const [activeIdx, setActiveIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const areaRef = useRef(null);

  const total = data.reduce((s, d) => s + d.value, 0);

  /* Build slices with a small angular gap between them */
  const GAP_DEG = 2.5;
  let cumAngle = 0;
  const slices = data.map((d) => {
    const sweep = (d.value / total) * 360;
    const start = cumAngle + GAP_DEG / 2;
    const end = cumAngle + sweep - GAP_DEG / 2;
    cumAngle += sweep;
    return { ...d, start, end, pct: ((d.value / total) * 100).toFixed(1) };
  });

  const CX = 110, CY = 110, R = 90, RI = 46;

  /* The "active" slice whose data appears in the donut centre */
  const displayed = activeIdx !== null ? slices[activeIdx] : slices[0];

  /* Track mouse within the chart area for tooltip placement */
  const handleMouseMove = (e) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="pc-card">
      {/* ── Header ── */}
      <div className="pc-header">
        <span className="pc-eyebrow">{subtitle}</span>
        <h3 className="pc-title">{title}</h3>
      </div>

      {/* ── SVG chart area ── */}
      <div
        ref={areaRef}
        className="pc-area"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveIdx(null)}
      >
        <svg viewBox="0 0 220 220" className="pc-svg">
          {slices.map((s, i) => (
            <path
              key={i}
              d={buildSlicePath(CX, CY, activeIdx === i ? R + 9 : R, RI, s.start, s.end)}
              fill={s.color}
              className="pc-slice"
              onMouseEnter={() => setActiveIdx(i)}
            />
          ))}

          {/* Donut centre — percentage */}
          <text x={CX} y={CY - 8} textAnchor="middle" className="pc-center-pct">
            {displayed.pct}%
          </text>
          {/* Donut centre — short label */}
          <text x={CX} y={CY + 13} textAnchor="middle" className="pc-center-lbl">
            {displayed.label.split(' ').slice(0, 2).join(' ')}
          </text>
        </svg>

        {/* ── Floating tooltip ── */}
        {activeIdx !== null && (
          <div
            className="pc-tooltip"
            style={{
              left: Math.min(tooltipPos.x + 14, 200),
              top: Math.max(tooltipPos.y - 60, 4),
            }}
          >
            <div className="pc-tt-label">{slices[activeIdx].label}</div>
            <div className="pc-tt-row">
              <span className="pc-tt-pct">{slices[activeIdx].pct}%</span>
              <span className="pc-tt-val">
                {slices[activeIdx].value.toLocaleString('es-CO')}
                {slices[activeIdx].unit ? ` ${slices[activeIdx].unit}` : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <ul className="pc-legend">
        {slices.map((s, i) => (
          <li
            key={i}
            className={`pc-legend-item${activeIdx === i ? ' pc-legend-item--on' : ''}`}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <span className="pc-dot" style={{ background: s.color }} />
            <span className="pc-leg-label">{s.label}</span>
            <span className="pc-leg-pct">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PieChart;
