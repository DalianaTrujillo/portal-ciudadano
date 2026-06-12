import React, { useState, useEffect, useRef } from 'react';
import avatarGif from '../assets/avatar.png.gif';
import energiaAmarillaLogo from '../assets/Energía Amarillo.png';
import CHATBOT_LINKS from '../config/chatbotLinks';
import TRAMITES_CATALOG from '../config/tramitesCatalog';
import { detectIntent, getLocalAnswer } from '../services/intentEngine';

const SAMPLE_DATA = [
  { depto: 'La Guajira', regalias: 1280, proyectos: 23 },
  { depto: 'Cesar', regalias: 980, proyectos: 18 },
  { depto: 'Boyacá', regalias: 740, proyectos: 14 },
  { depto: 'Santander', regalias: 620, proyectos: 11 },
  { depto: 'Antioquia', regalias: 510, proyectos: 9 },
];

const ECOSISTEMA_DATA = [
  { recurso: 'Carbón', participacion: 38 },
  { recurso: 'Petróleo y gas', participacion: 35 },
  { recurso: 'Níquel', participacion: 10 },
  { recurso: 'Oro', participacion: 12 },
  { recurso: 'Otros', participacion: 5 },
];

const ANALITICA_DATA = [
  { categoria: 'Producción Minera Nacional', datasets: 15, frecuencia: 'Mensual' },
  { categoria: 'Títulos Mineros (ANM)', datasets: 42, frecuencia: 'Diario' },
  { categoria: 'Proyectos de Regalías', datasets: 8, frecuencia: 'Mensual' },
  { categoria: 'Sismicidad Histórica (SGC)', datasets: 120, frecuencia: 'Tiempo Real' },
];

const printBtnStyle = {
  marginTop: 10,
  padding: '5px 10px',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 6,
  color: '#94A3B8',
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: "'Nunito Sans', sans-serif",
  transition: 'background 0.2s',
};

const TablaResultados = ({ tipoDatos = 'regalias' }) => {
  // Debug: verificar qué tipo de datos se está renderizando
  console.log('TablaResultados renderizando con tipoDatos:', tipoDatos);
  
  // Determinar qué datos usar
  let data, headers, renderRow;
  
  if (tipoDatos === 'ecosistema') {
    data = ECOSISTEMA_DATA;
    headers = ['Recurso', 'Participación (%)'];
    renderRow = (row) => (
      <>
        <td style={{ ...tdStyle, fontWeight: 700, color: '#EDB600' }}>{row.recurso}</td>
        <td style={tdStyle}>{row.participacion}%</td>
      </>
    );
  } else if (tipoDatos === 'analitica') {
    data = ANALITICA_DATA;
    headers = ['Categoría (Datos Abiertos)', 'Conjuntos de Datos', 'Frecuencia de Actualización'];
    renderRow = (row) => (
      <>
        <td style={{ ...tdStyle, fontWeight: 700, color: '#EDB600' }}>{row.categoria}</td>
        <td style={tdStyle}>{row.datasets}</td>
        <td style={tdStyle}>{row.frecuencia}</td>
      </>
    );
  } else {
    // Regalías (por defecto)
    data = SAMPLE_DATA;
    headers = ['Departamento', 'Regalías (MM $)', 'Proyectos'];
    renderRow = (row) => (
      <>
        <td style={{ ...tdStyle, fontWeight: 700, color: '#EDB600' }}>{row.depto}</td>
        <td style={tdStyle}>{row.regalias.toLocaleString()}</td>
        <td style={tdStyle}>{row.proyectos}</td>
      </>
    );
  }
  
  return (
    <div id="tabla-resultados-print" style={{ marginTop: 8, overflowX: 'auto' }}>
      <div className="print-header">
        <img
          src={energiaAmarillaLogo}
          alt="Ministerio de Minas y Energía"
          style={{ height: 48, width: 'auto', objectFit: 'contain' }}
        />
        <h2 style={{ color: '#203A68', fontSize: 18, fontWeight: 800, fontFamily: "'Nunito Sans', sans-serif" }}>
          Reporte de Datos e Indicadores - Sector Minero
        </h2>
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 11,
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} style={thStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>{renderRow(row)}</tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn-imprimir"
        style={printBtnStyle}
        onClick={() => {
          // Definir nombre dinámico del archivo PDF basado en el tipo de datos
          let nombreArchivo;
          if (tipoDatos === 'ecosistema') {
            nombreArchivo = 'Reporte_Ingresos_Ecosistema_Minero';
          } else if (tipoDatos === 'analitica') {
            nombreArchivo = 'Reporte_Datos_Abiertos_SGC_ANM';
          } else if (tipoDatos === 'regalias') {
            nombreArchivo = 'Consolidado_Asignacion_Regalias';
          } else {
            nombreArchivo = 'Reporte_Portal_Ciudadano';
          }
          
          let rowsHtml, tableHeaders;
          
          if (tipoDatos === 'ecosistema') {
            rowsHtml = data.map((r) => `<tr><td><strong>${r.recurso}</strong></td><td>${r.participacion}%</td></tr>`).join('');
            tableHeaders = '<thead><tr><th>Recurso</th><th>Participación (%)</th></tr></thead>';
          } else if (tipoDatos === 'analitica') {
            rowsHtml = data.map((r) => `<tr><td><strong>${r.categoria}</strong></td><td>${r.datasets}</td><td>${r.frecuencia}</td></tr>`).join('');
            tableHeaders = '<thead><tr><th>Categoría (Datos Abiertos)</th><th>Conjuntos de Datos</th><th>Frecuencia de Actualización</th></tr></thead>';
          } else {
            rowsHtml = data.map((r) => `<tr><td><strong>${r.depto}</strong></td><td>${r.regalias.toLocaleString()}</td><td>${r.proyectos}</td></tr>`).join('');
            tableHeaders = '<thead><tr><th>Departamento</th><th>Regalías (MM $)</th><th>Proyectos</th></tr></thead>';
          }

          const html = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <title>${nombreArchivo}</title>
                <style>
                  @page { margin: 0; }
                  body { margin: 20mm; font-family: 'Nunito Sans', Arial, sans-serif; color: #333; box-sizing: border-box; }
                  .print-header { display: flex; align-items: center; justify-content: flex-start; gap: 20px; border-bottom: 2px solid #203A68; padding-bottom: 15px; margin-bottom: 25px; }
                  .print-header img { width: 140px; height: auto; }
                  .print-header h2 { margin: 0; color: #203A68; font-size: 22px; }
                  table { width: 100%; border-collapse: collapse; font-size: 14px; }
                  th, td { border: 1px solid #E2E8F0; padding: 12px 15px; text-align: left; }
                  th { background-color: #F8FAFC; color: #1E293B; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
                  tr:nth-child(even) { background-color: #F8FAFC; }
                </style>
              </head>
              <body>
                <div class="print-header">
                  <img src="${energiaAmarillaLogo}" alt="Ministerio de Minas y Energía" />
                  <h2>Reporte de Datos e Indicadores - Sector Minero</h2>
                </div>
                <table>
                  ${tableHeaders}
                  <tbody>${rowsHtml}</tbody>
                </table>
              </body>
            </html>
          `;

          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          iframe.contentDocument.open();
          iframe.contentDocument.write(html);
          iframe.contentDocument.close();
          iframe.contentWindow.focus();
          iframe.contentWindow.print();

          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 500);
        }}
        onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.14)'; }}
        onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.08)'; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Imprimir resultados
      </button>
    </div>
  );
};

const thStyle = {
  padding: '6px 8px',
  background: 'rgba(237, 182, 0, 0.15)',
  color: '#EDB600',
  fontWeight: 800,
  textAlign: 'left',
  borderBottom: '2px solid rgba(237, 182, 0, 0.3)',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '5px 8px',
  color: '#E2E8F0',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  fontSize: 11,
};

const INITIAL_MESSAGE = {
  sender: 'bot',
  text: '¡Hola! Soy tu asistente virtual del Sector Minero-Energético. Puedo brindarte información y orientación sobre Regalías Mineras, Datos e Indicadores, el Visor Territorial, la Agencia Nacional de Minería (ANM) y el Servicio Geológico Colombiano (SGC), así como sobre los trámites y servicios relacionados con el sector. ¿Sobre qué tema o trámite te gustaría recibir información hoy?',
};

/**
 * mapeoEntidades
 * ─────────────────────────────────────────────────────────────
 * Diccionario de entrenamiento. Cada array contiene las raíces
 * de palabras clave asociadas a cada entidad, ya en forma
 * normalizada (sin tildes, minúsculas).
 * Para ampliar el vocabulario, añade términos aquí; no es
 * necesario tocar la lógica de clasificación.
 * ─────────────────────────────────────────────────────────────
 */
const mapeoEntidades = {
  ANM: [
    'titulo', 'minero', 'explotacion', 'regalia', 'contrato',
    'anna', 'radicacion', 'mineria', 'anm', 'concesion',
    'recurso mineral', 'licencia minera', 'canon',
  ],
  SGC: [
    'geologico', 'sismo', 'volcan', 'mapa', 'atlas',
    'geociencia', 'geologia', 'radiactiva', 'fuente',
    'desastre', 'riesgo', 'sgc', 'cartografia', 'subsuelo',
    'terremoto', 'amenaza', 'falla geologica',
  ],
};

/**
 * identificarEntidad
 * ─────────────────────────────────────────────────────────────
 * Clasificador por peso (scoring). Tokeniza el texto en palabras
 * y acumula un punto por cada token que contenga una raíz del
 * diccionario (p.includes(k) captura plurales y derivados
 * morfológicos sin necesitar formas adicionales en el dict).
 *
 * Retorna la entidad con mayor puntuación, o 'General' si empate.
 *
 * @param {string} texto - Texto ya normalizado (sin tildes, lower)
 * @returns {'ANM' | 'SGC' | 'General'}
 * ─────────────────────────────────────────────────────────────
 */
const identificarEntidad = (texto) => {
  let scoreANM = 0;
  let scoreSGC = 0;

  const palabras = texto.split(/\s+/);          // tokenizar por espacios

  palabras.forEach((p) => {
    // p.includes(k): 'radiactivas' reconoce la raíz 'radiactiva' ✓
    if (mapeoEntidades.ANM.some((k) => p.includes(k))) scoreANM++;
    if (mapeoEntidades.SGC.some((k) => p.includes(k))) scoreSGC++;
  });

  if (scoreANM > scoreSGC) return 'ANM';
  if (scoreSGC > scoreANM) return 'SGC';
  return 'General';
};

/**
 * UMBRAL_CONFIANZA
 * Score mínimo que debe alcanzar un trámite del catálogo para
 * considerarse una coincidencia válida. Con valor 1 basta que
 * una sola keyword haga match (substring) en el texto del usuario.
 */
const UMBRAL_CONFIANZA = 1;

/**
 * clasificarTramite
 * ───────────────────────────────────────────────────────────────
 * Recorre el catálogo y acumula un punto por cada keyword
 * que sea substring del texto normalizado. Retorna el trámite
 * con mayor score y el score obtenido.
 *
 * @param {string} texto - Texto ya normalizado
 * @returns {{ tramite: object|null, score: number }}
 * ───────────────────────────────────────────────────────────────
 */
const clasificarTramite = (texto) => {
  let mejorScore = 0;
  let mejorTramite = null;

  TRAMITES_CATALOG.forEach((tramite) => {
    let score = 0;
    tramite.keywords.forEach((k) => {
      if (texto.includes(k)) score++;
    });
    if (score > mejorScore) {
      mejorScore = score;
      mejorTramite = tramite;
    }
  });

  return { tramite: mejorTramite, score: mejorScore };
};

const ChatbotCiudadano = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [sessionId, setSessionId] = useState('');
  const [contextEntity, setContextEntity] = useState(null);
  const [contextSection, setContextSection] = useState(null);
  const [chatState, setChatState] = useState('START');
  const [isLoading, setIsLoading] = useState(false);

  // Referencia centinela para scroll automático al último mensaje
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // Limpiar historial de conversación cuando se cierra el chat
  useEffect(() => {
    if (!isOpen) {
      setMessages([INITIAL_MESSAGE]);
      setChatState('START');
      setContextEntity(null);
      setContextSection(null);
      setSessionId('');
    }
  }, [isOpen]);

  // Scroll automático al final cada vez que llega un mensaje nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Función auxiliar para normalizar texto (quitar tildes, minúsculas y espacios)
  const normalizarTexto = (texto) => {
    return texto
      .trim()                              // elimina espacios accidentales al inicio/fin
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');              // colapsa espacios múltiples internos
  };

  const getBotReply = (input) => {
    const textoNormalizado = normalizarTexto(input);

    // ─── PASO 1: Catálogo de trámites oficiales (prioridad máxima) ─────────────
    const { tramite, score } = clasificarTramite(textoNormalizado);
    if (score >= UMBRAL_CONFIANZA && tramite) {
      const canal = CHATBOT_LINKS[tramite.linkKey];
      return {
        tramiteNombre: tramite.nombre,
        text: tramite.descripcion,
        link: canal.url,
        linkText: canal.label,
      };
    }

    // ─── PASO 2: Base de conocimiento local (respuestas directas) ─────────────

    // ANM
    if (/(\banm\b|agencia nacional de mineria|agencia minera)/i.test(textoNormalizado)) {
      return {
        text: 'La Agencia Nacional de Minería (ANM) es la entidad del Estado colombiano encargada de administrar los recursos minerales de la Nación. Sus funciones principales incluyen:\n\n• Otorgar, fiscalizar y terminar contratos de concesión minera.\n• Administrar el Registro Minero Nacional.\n• Recaudar las regalías y contraprestaciones de la actividad minera.\n• Gestionar la plataforma AnnA Minería para trámites en línea.\n\n¿Deseas conocer sus trámites disponibles, cómo solicitar un título minero o cómo contactarlos directamente?',
      };
    }

    // SGC
    if (/(\bsgc\b|servicio geologico|geologico colombiano)/i.test(textoNormalizado)) {
      return {
        text: 'El Servicio Geológico Colombiano (SGC) es la entidad científico-técnica del Estado encargada de investigar y generar conocimiento sobre los recursos del subsuelo colombiano. Sus funciones incluyen:\n\n• Monitoreo de la actividad sísmica y volcánica en tiempo real.\n• Elaboración de mapas geológicos y cartografía del subsuelo.\n• Investigación de recursos minerales y geotérmicos.\n• Gestión del riesgo geológico a nivel nacional.\n\n¿Te interesa consultar información sobre sismos, volcanes, mapas geológicos o gestión del riesgo?',
      };
    }

    // Regalías
    if (/(regalia|regalias|ciclo de regalias|fondo de compensacion|ocad)/i.test(textoNormalizado)) {
      return {
        text: 'Las regalías son la contraprestación económica que recibe el Estado colombiano por la explotación de recursos naturales no renovables como el carbón, petróleo, oro y gas natural.\n\nEl ciclo de las regalías comprende:\n\n• Producción y liquidación: La empresa minera reporta su producción.\n• Recaudo: La ANM cobra las regalías correspondientes.\n• Distribución: Los recursos se distribuyen entre departamentos, municipios y fondos nacionales (FONPET, FCR, FDR).\n• Inversión: Los recursos financian proyectos en educación, salud, agua potable e infraestructura.\n\n¿Quieres ver información de regalías por departamento, conocer los proyectos financiados o entender cómo se fiscaliza su uso?',
        tipoDatos: 'regalias',
      };
    }

    // Visor Territorial / Mapas
    if (/(visor|mapa|geografico|territorial|capas|sismo|volcan|subsuelo|geologi)/i.test(textoNormalizado)) {
      return {
        text: 'El Visor Territorial del Portal Ciudadano permite explorar de forma interactiva información geoespacial del sector minero-energético colombiano, incluyendo:\n\n• Títulos mineros activos por región.\n• Zonas de reserva y áreas de exclusión minera.\n• Monitoreo sísmico y actividad volcánica (SGC).\n• Proyectos de regalías georeferenciados.\n\n¿Buscas información de una región específica o deseas ver los títulos mineros de un departamento en particular?',
      };
    }

    // Indicadores / Ecosistema / Datos
    if (/(indicador|estadistica|produccion|ecosistema|datos abiertos|dataset|analitica|carbon|petroleo|niquel|oro)/i.test(textoNormalizado)) {
      return {
        text: 'El sector minero-energético colombiano genera datos oficiales sobre producción, precios y distribución de recursos. Los principales indicadores disponibles son:\n\n• Producción de carbón, petróleo y gas por departamento.\n• Precios internacionales de referencia (carbón, níquel, oro).\n• Ingresos del sector al Presupuesto General de la Nación.\n• Proyectos financiados con regalías a nivel municipal.\n\n¿Deseas ver estadísticas de producción, ingresos del ecosistema minero o datos de datasets abiertos del SGC y la ANM?',
        tipoDatos: 'ecosistema',
      };
    }

    // Energía / Subsidios
    if (/(energia|electrica|subsidio|tarifa|luz|recibo|estrato|conexion|kilovatio)/i.test(textoNormalizado)) {
      return {
        text: 'El Ministerio de Minas y Energía regula el servicio de energía eléctrica en Colombia. En este tema puedes consultar:\n\n• Subsidios de energía: Los estratos 1, 2 y 3 tienen derecho a un descuento en su factura de energía. Se aplica automáticamente si estás en el SISBEN.\n• Tarifas: Son reguladas por la CREG (Comisión de Regulación de Energía y Gas).\n• Conexión al servicio: Se gestiona directamente con la empresa prestadora en tu municipio.\n\n¿Tienes alguna consulta específica sobre tu factura, un corte de servicio o cómo acceder al subsidio?',
      };
    }

    // Hidrocarburos
    if (/(hidrocarburo|petroleo|gas natural|refineria|anh|combustible)/i.test(textoNormalizado)) {
      return {
        text: 'Los hidrocarburos (petróleo y gas natural) son el recurso energético no renovable de mayor importancia económica en Colombia. En esta área:\n\n• La Agencia Nacional de Hidrocarburos (ANH) administra las áreas de exploración y explotación.\n• El Ministerio de Minas define la política energética nacional.\n• Ecopetrol es la empresa estatal que lidera la producción nacional.\n\n¿Deseas información sobre contratos de exploración, precios del combustible o trámites relacionados con hidrocarburos?',
      };
    }

    // Noticias
    if (/(noticia|novedad|actualidad|boletin|comunicado|prensa)/i.test(textoNormalizado)) {
      return {
        text: 'El Ministerio de Minas y Energía publica regularmente comunicados, resoluciones y noticias sobre el sector. Puedes mantenerte informado sobre:\n\n• Nuevas regulaciones y normativas del sector.\n• Resultados de subastas y contratos mineros.\n• Avances en proyectos de regalías por región.\n• Alertas de la Red Sismológica Nacional (SGC).\n\n¿Buscas noticias sobre un tema o entidad específica del sector?',
      };
    }

    // Participación ciudadana
    if (/(participa|opinion|encuesta|comentar|foro|consulta previa|veeduría)/i.test(textoNormalizado)) {
      return {
        text: 'El Portal Ciudadano cuenta con espacios de participación activa para que la ciudadanía incida en las decisiones del sector minero-energético:\n\n• Consultas públicas sobre normativas en proceso de expedición.\n• Foros de participación ciudadana sobre proyectos mineros.\n• Veedurías y control social al uso de regalías.\n• Mecanismo de Consulta Previa para comunidades étnicas.\n\n¿Deseas participar en algún proceso en curso o conocer tus derechos como ciudadano en proyectos mineros cercanos a tu comunidad?',
      };
    }

    // Glosario / Aprende
    if (/(glosario|concepto|que es|que significa|aprender|definicion|educacion|cartilla)/i.test(textoNormalizado)) {
      return {
        text: 'El sector minero-energético tiene una terminología técnica específica. Algunos conceptos clave:\n\n• Regalía: Pago al Estado por explotar recursos naturales.\n• Título Minero: Contrato de concesión que autoriza la exploración o explotación de minerales.\n• OCAD: Órgano Colegiado de Administración y Decisión — aprueba proyectos financiados con regalías.\n• FONPET: Fondo de Pensiones de las Entidades Territoriales, financiado con regalías.\n• Canon Superficiario: Pago anual por hectárea que hace el titular minero al Estado.\n\n¿Hay algún término específico que quieras explorar o un tema del sector sobre el que quieras aprender más?',
      };
    }

    // Descarga / Formato
    if (/(descarg|excel|pdf|imprim|export|archiv|generar reporte)/i.test(textoNormalizado)) {
      return {
        text: 'Puedo ayudarte a visualizar la información disponible en formato de tabla lista para imprimir o exportar. Los reportes disponibles incluyen:\n\n• Asignación de regalías por departamento.\n• Ingresos del ecosistema minero (carbón, petróleo, níquel, oro).\n• Datasets del SGC y ANM disponibles en datos abiertos.\n\n¿Cuál de estos reportes deseas generar? Indica el tema y te preparo la tabla.',
      };
    }

    // ─── PASO 3: Consulta general sin clasificación clara ─────────────────────
    const esConsultaGeneral = /(tramite|solicit|ayuda|consulta|quiero|necesito|como|donde|informacion)/i;
    if (esConsultaGeneral.test(textoNormalizado)) {
      return {
        text: 'Entiendo que tienes una consulta. Para orientarte de la mejor manera, ¿tu solicitud es sobre alguno de estos temas?\n\n• Minería (títulos mineros, regalías, fiscalización)\n• Energía eléctrica (tarifas, subsidios, conexión)\n• Hidrocarburos (petróleo, gas natural)\n• Geología (sismos, volcanes, mapas)\n• Trámites y PQRSD del Ministerio\n• Datos e indicadores del sector',
      };
    }

    // ─── PASO 4: Detección por entidad (red de seguridad) ────────────────────
    const entidadDetectada = identificarEntidad(textoNormalizado);
    if (entidadDetectada === 'ANM') {
      return {
        text: 'La Agencia Nacional de Minería (ANM) es la autoridad minera de Colombia. Administra los títulos mineros, recauda regalías y fiscaliza la actividad minera en todo el territorio nacional.\n\n¿Deseas conocer sus trámites disponibles o contactarlos directamente?',
        link: CHATBOT_LINKS.ATENCION_ANM.url,
        linkText: CHATBOT_LINKS.ATENCION_ANM.label,
      };
    }
    if (entidadDetectada === 'SGC') {
      return {
        text: 'El Servicio Geológico Colombiano (SGC) es el centro de investigación científica del Estado para el conocimiento del subsuelo y la gestión de amenazas geológicas como sismos y volcanes.\n\n¿Deseas consultar información sísmica, mapas geológicos o contactar al SGC?',
        link: CHATBOT_LINKS.ATENCION_SGC.url,
        linkText: CHATBOT_LINKS.ATENCION_SGC.label,
      };
    }

    // ─── PASO 5: Respuesta por defecto ────────────────────────────────────────
    return {
      text: 'Soy el Asistente Virtual del Sector Minero-Energético. Puedo responderte consultas sobre:\n\n• La ANM, el SGC o el Ministerio de Minas.\n• Regalías y proyectos de inversión.\n• Títulos mineros y trámites.\n• Sismos, volcanes y geología.\n• Energía eléctrica e hidrocarburos.\n\n¿Sobre cuál de estos temas tienes una pregunta hoy?',
    };
  };

  /**
   * enviarRespuestaBot
   * ─────────────────────────────────────────────────────────────────
   * Siempre acumula el nuevo mensaje al historial existente.
   * NUNCA resetea al saludo inicial desde aquí; ese reset solo
   * ocurre cuando el usuario cierra la ventana del chat (useEffect
   * de isOpen), preservando así el contexto de la conversación.
   * ─────────────────────────────────────────────────────────────────
   */
  const enviarRespuestaBot = (nuevoMensaje) => {
    setMessages((prev) => [...prev, nuevoMensaje]);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    if (chatState === 'START') {
      setChatState('CONVERSATION');
    }

    // Agregar mensaje del usuario y activar loading
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Consultar la Base de Conocimiento (API Node.js + PostgreSQL)
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, session_id: sessionId, context_entity: contextEntity, context_section: contextSection })
      });

      if (!res.ok) throw new Error('Backend no disponible');
      const data = await res.json();

      if (data.session_id) {
        setSessionId(data.session_id);
      }
      if (data.entity) {
        setContextEntity(data.entity);
      }
      if (data.section) {
        setContextSection(data.section);
      }

      // Respuesta proveniente de la base de conocimiento
      const respuesta = data.answer || 'No encontré información oficial sobre esta consulta.';

      enviarRespuestaBot({
        sender: 'bot',
        text: respuesta,
        source: data.source,
        suggestions: data.suggestions || [],
      });

      setIsLoading(false);
      return;

    } catch (error) {
      console.warn('Backend no disponible, usando conocimiento local.');
    }

    // 2. Fallback: Motor de intenciones local (entity + intent)
    setTimeout(() => {
      // Intentar primero el catálogo de trámites
      const { tramite, score } = clasificarTramite(normalizarTexto(text));
      if (score >= UMBRAL_CONFIANZA && tramite) {
        const canal = CHATBOT_LINKS[tramite.linkKey];
        enviarRespuestaBot({
          sender: 'bot',
          text: tramite.descripcion,
          tramiteNombre: tramite.nombre,
          link: canal.url,
          linkText: canal.label,
        });
        setIsLoading(false);
        return;
      }

      // Detectar entidad + intención
      const { entity, intent } = detectIntent(text);
      const localResult = getLocalAnswer(entity, intent);

      if (localResult) {
        enviarRespuestaBot({
          sender: 'bot',
          text: localResult.answer,
          suggestions: localResult.suggestions || [],
          link: localResult.link,
          linkText: localResult.linkText,
        });
      } else {
        // Fallback final
        enviarRespuestaBot({
          sender: 'bot',
          text: 'No encontré información oficial sobre esa consulta.',
        });
      }
      setIsLoading(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <style>{`
        @keyframes chat-enter {
          0%   { opacity: 0; transform: translateY(16px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msg-fade-in {
          0%   { opacity: 0; transform: translateY(10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bubble-pulse {
          0%, 100% { opacity: 0; transform: translateY(6px); }
          20%, 80% { opacity: 1; transform: translateY(0); }
        }

        .armi-bubble {
          animation: bubble-pulse 4s ease-in-out infinite;
        }
        .armi-chat {
          animation: chat-enter 0.3s ease-out;
        }
        .armi-msg {
          animation: msg-fade-in 0.35s ease-out;
        }


      `}</style>

      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'transparent', zIndex: 999,
          }}
          onClick={toggleChat}
        />
      )}

      {isOpen && (
        <div
          className="armi-chat"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            bottom: 124,
            right: 28,
            width: 360,
            height: 520,
            borderRadius: 16,
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
            zIndex: 1000,
            overflow: 'hidden',
            fontFamily: "'Nunito Sans', sans-serif",
          }}
        >
          <div
            style={{
              padding: '16px 18px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                width: 10, height: 10, borderRadius: '50%', background: '#22C55E',
                flexShrink: 0, boxShadow: '0 0 8px rgba(34,197,94,0.5)',
              }}
            />
            <span
              style={{
                color: '#EDB600', fontSize: 15, fontWeight: 800, letterSpacing: 0.3,
                flex: 1,
              }}
            >
              Asistente Minero
            </span>
            <button
              onClick={toggleChat}
              aria-label="Cerrar chat"
              style={{
                background: 'none', border: 'none', color: '#94A3B8',
                cursor: 'pointer', padding: 4, display: 'flex',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div
            style={{
              flex: 1, overflowY: 'auto',
              padding: '14px 14px 8px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className="armi-msg"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                }}
              >
                <div
                  style={{
                    maxWidth: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    fontSize: 14,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    wordBreak: 'break-word',
                    background: msg.sender === 'bot' ? '#203A68' : '#E2E8F0',
                    color: msg.sender === 'bot' ? '#fff' : '#1E293B',
                    borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 14,
                    borderBottomRightRadius: msg.sender === 'user' ? 4 : 14,
                    // Evita que bloques de texto muy largos colapsen la ventana
                    maxHeight: msg.tipoDatos ? 'none' : '260px',
                    overflowY: msg.tipoDatos ? 'visible' : 'auto',
                  }}
                >
                  {msg.text}
                  {/* Badge del trámite identificado por el catálogo */}
                  {msg.tramiteNombre && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 10px',
                      background: 'rgba(237,182,0,0.12)',
                      borderLeft: '3px solid #EDB600',
                      borderRadius: '0 6px 6px 0',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#EDB600',
                      lineHeight: 1.4,
                    }}>
                      📋 {msg.tramiteNombre}
                    </div>
                  )}
                  {msg.tipoDatos && <TablaResultados tipoDatos={msg.tipoDatos} />}
                  {msg.link && (
                    <a
                      href={msg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '10px',
                        padding: '7px 14px',
                        background: 'linear-gradient(135deg, #EDB600 0%, #f5c842 100%)',
                        color: '#1E293B',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: '800',
                        letterSpacing: '0.3px',
                        boxShadow: '0 2px 8px rgba(237,182,0,0.35)',
                        transition: 'opacity 0.2s',
                        fontFamily: "'Nunito Sans', sans-serif",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    >
                      {msg.linkText}
                    </a>
                  )}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.suggestions.map((sug, idx) => {
                        const isObject = typeof sug === 'object' && sug !== null;
                        const label = isObject ? sug.label : sug;
                        const url = isObject ? sug.url : null;
                        return (
                          <a
                            key={idx}
                            href={url || '#'}
                            target={url && url.startsWith('http') ? '_blank' : '_self'}
                            style={{
                              display: 'block',
                              padding: '8px 12px',
                              background: 'rgba(255,255,255,0.1)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '6px',
                              color: '#fff',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: '600',
                              textAlign: 'center',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                            onClick={(e) => {
                              if (!url) {
                                e.preventDefault();
                                setInputText(label);
                              }
                            }}
                          >
                            {label}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Indicador de escritura del bot */}
            {isLoading && (
              <div className="armi-msg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  background: '#203A68',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                      width: 7, height: 7,
                      borderRadius: '50%',
                      background: '#EDB600',
                      display: 'inline-block',
                      animation: `bubble-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            {/* Centinela invisible: el scroll automático apunta aquí */}
            <div ref={messagesEndRef} style={{ height: 1 }} />
          </div>

          <div
            style={{
              padding: '12px 14px 14px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', gap: 8, alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                outline: 'none',
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            />
            <button
              onClick={handleSend}
              aria-label="Enviar mensaje"
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: '#EDB600', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#203A68" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        className="armi-avatar"
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 1000,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
          transition: 'transform 0.25s ease',
          userSelect: 'none',
        }}
      >
        {!isOpen && (
          <div
            className="armi-bubble"
            style={{
              background: '#fff',
              color: '#1E293B',
              fontSize: 13,
              fontWeight: 700,
              padding: '8px 14px',
              borderRadius: 16,
              borderBottomRightRadius: 4,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              whiteSpace: 'nowrap',
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            ¿Necesitas ayuda?
          </div>
        )}

        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            border: '2px solid #EDB600',
            overflow: 'hidden',
            background: '#203A68',
            flexShrink: 0,
          }}
        >
          <img
            src={avatarGif}
            alt="Asistente"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ChatbotCiudadano;
