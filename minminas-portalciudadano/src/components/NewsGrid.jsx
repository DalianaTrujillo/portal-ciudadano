import React from 'react';
import { ArrowRight, Calendar, ExternalLink } from 'lucide-react';
import './NewsGrid.css';

const newsData = [
  {
    date: '15 May 2026',
    category: 'Geociencias',
    title: 'SGC publica nuevo Atlas Geológico Nacional con cobertura del 75% del territorio colombiano',
    snippet: 'El Servicio Geológico Colombiano publicó la actualización del Atlas Geológico Nacional, que ahora cubre tres cuartas partes del territorio con cartografía detallada.',
    link: 'https://www.sgc.gov.co/'
  },
  {
    date: '10 May 2026',
    category: 'Minería',
    title: 'ANM adjudica 120 nuevos títulos mineros en el segundo bienio 2025-2026',
    snippet: 'La Agencia Nacional de Minería completó la adjudicación de nuevos títulos para la exploración y explotación de minerales estratégicos.',
    link: 'https://www.anm.gov.co/'
  },
  {
    date: '5 May 2026',
    category: 'Regalías',
    title: 'Distribución de regalías SGR supera los $7.8 billones en el primer semestre del año',
    snippet: 'El Sistema General de Regalías alcanzó una cifra récord en distribución de recursos para proyectos de inversión regional.',
    link: 'https://mapainversiones.dnp.gov.co/'
  },
  {
    date: '28 Abr 2026',
    category: 'Sismología',
    title: 'Nuevo sistema de monitoreo sísmico mejora la detección temprana en 32 departamentos',
    snippet: 'El SGC implementó una red de sensores de última generación que reduce los tiempos de detección y alerta sísmica en todo el país.',
    link: 'https://www.sgc.gov.co/sismos'
  },
  {
    date: '20 Abr 2026',
    category: 'Hidrocarburos',
    title: 'ANH reporta incremento del 12% en reservas de gas natural para 2026',
    snippet: 'Las nuevas incorporaciones de reservas de gas natural aseguran el abastecimiento del mercado interno por los próximos 8 años.',
    link: 'https://www.anh.gov.co/'
  },
  {
    date: '12 Abr 2026',
    category: 'MinMinas',
    title: 'MinMinas lanza programa de formalización minera para pequeños productores',
    snippet: 'El Ministerio de Minas y Energía presentó una nueva estrategia para formalizar a más de 5,000 pequeños mineros en 12 departamentos.',
    link: 'https://www.minenergia.gov.co/'
  },
  {
    date: '5 Abr 2026',
    category: 'Energía',
    title: 'IPSE energiza 15 comunidades rurales con paneles solares en La Guajira',
    snippet: 'El IPSE completó la instalación de sistemas solares fotovoltaicos que benefician a más de 3,000 habitantes de zonas no interconectadas.',
    link: 'https://www.ipse.gov.co/'
  },
  {
    date: '28 Mar 2026',
    category: 'Planeación',
    title: 'UPME presenta nuevo Plan de Expansión Minero-Energético 2026-2030',
    snippet: 'La Unidad de Planeación Minero Energética publicó las proyecciones y metas del sector para los próximos cinco años.',
    link: 'https://www1.upme.gov.co/'
  }
];

const NewsGrid = ({ limit, embedded }) => {
  const displayed = limit ? newsData.slice(0, limit) : newsData;

  const grid = (
    <div className="news-masonry">
      {displayed.map((item, i) => (
        <article key={i} className="news-masonry-card">
          <div className="news-masonry-meta">
            <span className="news-masonry-date">
              <Calendar size={12} /> {item.date}
            </span>
            <span className="news-masonry-cat">{item.category}</span>
          </div>
          <h3 className="news-masonry-title">{item.title}</h3>
          <p className="news-masonry-snippet">{item.snippet}</p>
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-masonry-link">
            Leer más <ArrowRight size={14} />
          </a>
        </article>
      ))}
    </div>
  );

  if (embedded) return grid;

  return (
    <section className="news-grid-section">
      <div className="container section-inner">
        <div className="section-header">
          <span className="eyebrow">Actualidad del Sector</span>
          <h2>Noticias y Novedades</h2>
          <p>Las últimas noticias del sector minero-energético colombiano, mantenerse informado es clave para la participación ciudadana.</p>
        </div>
        {grid}
      </div>
    </section>
  );
};

export default NewsGrid;
