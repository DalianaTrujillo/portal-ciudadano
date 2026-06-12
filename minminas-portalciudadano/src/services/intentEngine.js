/**
 * intentEngine.js
 * Motor local de detección de entidad + intención para el fallback del frontend.
 * Refleja la misma lógica del intentService.js del backend,
 * pero ejecutada en el navegador cuando el backend no está disponible.
 */

// ─────────────────────────────────────────────────────────────
// KNOWLEDGE BASE LOCAL (espejo reducido de la BD)
// ─────────────────────────────────────────────────────────────
const LOCAL_KNOWLEDGE = {
  ANM: {
    DEFINICION: {
      answer: 'La Agencia Nacional de Minería (ANM) es la entidad del Estado colombiano encargada de administrar los recursos minerales de la Nación. Fue creada mediante el Decreto 4134 de 2011, adscrita al Ministerio de Minas y Energía. Su misión es administrar el patrimonio minero nacional promoviendo el aprovechamiento sostenible y responsable.',
      suggestions: ['¿Cuáles son las funciones de la ANM?', '¿Qué trámites ofrece la ANM?', '¿Cómo contacto a la ANM?'],
    },
    FUNCIONES: {
      answer: 'Las funciones principales de la ANM son:\n\n• Otorgar, fiscalizar y terminar contratos de concesión minera.\n• Administrar el Registro Minero Nacional (RMN).\n• Recaudar regalías, cánones superficiarios y contraprestaciones.\n• Declarar y administrar Áreas de Reserva Especial.\n• Gestionar la plataforma AnnA Minería para trámites en línea.\n• Adelantar procesos de selección objetiva para contratos.\n• Imponer medidas sancionatorias ante infracciones al Código de Minas.',
      suggestions: ['¿Qué es AnnA Minería?', '¿Cómo solicitar un título minero?', '¿Cómo contacto a la ANM?'],
    },
    TRAMITES: {
      answer: 'La ANM ofrece los siguientes trámites principales:\n\n• Solicitud de contrato de concesión minera.\n• Cesión de derechos mineros.\n• Autorización de subcontrato de operación.\n• Consulta de estado de títulos en el RMN.\n• Solicitud de servidumbres mineras.\n• Declaratoria de caducidad y renuncia a contratos.\n• Registro de beneficiarios reales.\n• Autorizaciones de minería de subsistencia.\n\nTodos se gestionan en la plataforma AnnA Minería.',
      suggestions: ['¿Cómo solicitar un título minero?', '¿Qué es AnnA Minería?', '¿Cómo contacto a la ANM?'],
    },
    CONTACTO: {
      answer: 'Los canales oficiales de atención de la ANM son:\n\n• Línea gratuita: 01 8000 910 048\n• Correo PQRSD: servicioalciudadano@anm.gov.co\n• Sede: Cra. 54 No. 26-50, Bogotá D.C.\n• Horario: Lunes a viernes, 8:00 a.m. – 5:00 p.m.\n• Portal: www.anm.gov.co\n• Trámites en línea: annamineria.anm.gov.co',
      suggestions: ['¿Qué trámites ofrece la ANM?', '¿Cómo solicitar un título minero?', '¿Qué es AnnA Minería?'],
      link: 'https://www.anm.gov.co/atencion-al-ciudadano',
      linkText: 'Ir a Atención al Ciudadano ANM ↗',
    },
    PLATAFORMAS: {
      answer: 'AnnA Minería es la plataforma digital oficial de la ANM para gestionar trámites mineros en línea. Permite:\n\n• Radicar solicitudes de contratos de concesión.\n• Consultar el estado de títulos en el RMN.\n• Gestionar cesiones, subcontratos y autorizaciones.\n• Pagar el PIN de validación de solicitudes.\n• Cargar documentos y hacer seguimiento en tiempo real.\n\nAccede en: annamineria.anm.gov.co',
      suggestions: ['¿Cómo solicitar un título minero?', '¿Qué trámites ofrece la ANM?', '¿Cómo contacto a la ANM?'],
      link: 'https://annamineria.anm.gov.co',
      linkText: 'Ir a AnnA Minería ↗',
    },
    REQUISITOS: {
      answer: 'Para solicitar un contrato de concesión minera ante la ANM:\n\n1. Crear cuenta en AnnA Minería (annamineria.anm.gov.co).\n2. Verificar que el área esté libre de títulos en el RMN.\n3. Adquirir el PIN de radicación (aprox. $600.000 COP).\n4. Cargar las coordenadas del polígono (MAGNA-SIRGAS).\n5. Radicar la solicitud con todos los documentos.\n6. Esperar el proceso de selección objetiva si hay traslapes.\n\nDocumentos: cédula, NIT (si es empresa), pago de derechos y polígono.',
      suggestions: ['¿Qué es AnnA Minería?', '¿Qué trámites ofrece la ANM?', '¿Cómo contacto a la ANM?'],
      link: 'https://annamineria.anm.gov.co',
      linkText: 'Ir a AnnA Minería ↗',
    },
    NORMATIVIDAD: {
      answer: 'La actividad minera en Colombia se rige por:\n\n• Ley 685 de 2001 – Código de Minas.\n• Decreto 4134 de 2011 – Creación de la ANM.\n• Ley 1753 de 2015 – Plan Nacional de Desarrollo.\n• Ley 2056 de 2020 – Reforma al Sistema General de Regalías.\n• Decreto 1655 de 2021 – Formalización minera.\n\n¿Deseas información sobre una norma en particular?',
      suggestions: ['¿Qué es la ANM?', '¿Qué trámites ofrece la ANM?', '¿Cómo contacto a la ANM?'],
    },
    GENERAL: {
      answer: 'La ANM (Agencia Nacional de Minería) administra los recursos minerales del Estado colombiano. ¿Sobre qué aspecto deseas más información?',
      suggestions: ['¿Qué es la ANM?', '¿Cuáles son las funciones de la ANM?', '¿Qué trámites ofrece la ANM?'],
    },
  },

  SGC: {
    DEFINICION: {
      answer: 'El Servicio Geológico Colombiano (SGC) es la entidad científico-técnica del Estado encargada de investigar y difundir el conocimiento sobre el subsuelo y las amenazas geológicas. Fue creado en 2013 como sucesor del INGEOMINAS y está adscrito al Ministerio de Ciencia, Tecnología e Innovación.',
      suggestions: ['¿Cuáles son las funciones del SGC?', '¿Qué servicios presta el SGC?', '¿Cómo contacto al SGC?'],
    },
    FUNCIONES: {
      answer: 'Las funciones principales del SGC son:\n\n• Investigación geológica básica del territorio.\n• Monitoreo sísmico y volcánico en tiempo real.\n• Elaboración de mapas geológicos nacionales.\n• Gestión del riesgo geológico (sismos, movimientos en masa).\n• Investigación de recursos del subsuelo (minerales, geotermia).\n• Regulación del uso de materiales radiactivos en Colombia.',
      suggestions: ['¿Qué servicios presta el SGC?', '¿Dónde consulto sismos recientes?', '¿Cómo contacto al SGC?'],
    },
    SERVICIOS: {
      answer: 'El SGC presta los siguientes servicios:\n\n• Catálogo Sísmico Nacional (histórico de sismos).\n• Monitoreo de volcanes activos de Colombia.\n• Mapas geológicos y geoquímicos descargables.\n• Estudios de amenaza sísmica por municipio.\n• Laboratorios de análisis geoquímico y petrográfico.\n• Licencias para uso de materiales radiactivos.\n• Información sobre recursos geotérmicos.',
      suggestions: ['¿Cómo contacto al SGC?', '¿Cuáles son las funciones del SGC?', '¿Qué es el SGC?'],
    },
    CONTACTO: {
      answer: 'Los canales de atención del SGC son:\n\n• Teléfono: (601) 220 0200\n• Correo PQRSD: sgc@sgc.gov.co\n• Sede: Diagonal 53 No. 34-53, Bogotá D.C.\n• Horario: Lunes a viernes, 8:00 a.m. – 5:00 p.m.\n• Portal: www.sgc.gov.co\n• Sismos en tiempo real: www2.sgc.gov.co/sismos',
      suggestions: ['¿Qué servicios presta el SGC?', '¿Cuáles son las funciones del SGC?', '¿Qué es el SGC?'],
      link: 'https://www.sgc.gov.co/atencion-al-ciudadano',
      linkText: 'Ir a Atención al Ciudadano SGC ↗',
    },
    GENERAL: {
      answer: 'El SGC (Servicio Geológico Colombiano) investiga el subsuelo y monitorea amenazas geológicas como sismos y volcanes. ¿Sobre qué aspecto deseas más información?',
      suggestions: ['¿Qué es el SGC?', '¿Cuáles son las funciones del SGC?', '¿Qué servicios presta el SGC?'],
    },
  },

  REGALIAS: {
    DEFINICION: {
      answer: 'Las regalías son la contraprestación económica que recibe el Estado colombiano por la explotación de recursos naturales no renovables del subsuelo. Están reguladas por el Sistema General de Regalías (SGR), creado mediante el Acto Legislativo 05 de 2011 y la Ley 2056 de 2020.',
      suggestions: ['¿Cómo se distribuyen las regalías?', '¿Qué es el OCAD?', '¿Qué es la ANM?'],
    },
    GENERAL: {
      answer: 'Las regalías financian proyectos de inversión en educación, salud, agua potable e infraestructura en todo el país. Se distribuyen mediante el Sistema General de Regalías (SGR) entre departamentos, municipios y fondos nacionales.',
      suggestions: ['¿Qué son las regalías?', '¿Cómo se distribuyen las regalías?', '¿Qué proyectos se financian con regalías?'],
    },
  },

  ENERGIA: {
    SERVICIOS: {
      answer: 'Los subsidios de energía eléctrica en Colombia:\n\n• Beneficiarios: estratos 1, 2 y 3.\n• Se aplica automáticamente en la factura.\n• Estrato 1: 50% de descuento sobre consumo básico.\n• Estrato 2: 40% de descuento.\n• Estrato 3: 15% de descuento.\n\nSi no te aplican el subsidio, presenta un PQRSD ante tu empresa de energía o la SSPD.',
      suggestions: ['¿Qué es la CREG?', '¿Cómo presento un PQRSD?', '¿Qué regula el Ministerio de Minas en energía?'],
    },
    GENERAL: {
      answer: 'El Ministerio de Minas y Energía regula la política energética nacional: energía eléctrica, gas, energías renovables y eficiencia energética.',
      suggestions: ['¿Cómo accedo al subsidio de energía?', '¿Qué es la CREG?', '¿Cómo contacto al Ministerio de Minas?'],
    },
  },
};

// ─────────────────────────────────────────────────────────────
// DETECTORES (espejo del backend)
// ─────────────────────────────────────────────────────────────
const normalize = (text) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const ENTITY_RULES = [
  { entity: 'ANM',          tests: [/\banm\b/, /agencia nacional de miner/, /agencia minera/, /anna mineria/, /annamineria/] },
  { entity: 'SGC',          tests: [/\bsgc\b/, /servicio geol/, /geologico colombiano/, /ingeominas/] },
  { entity: 'REGALIAS',     tests: [/regali/, /\bocad\b/, /\bsgr\b/, /sistema general de regal/, /fonpet/] },
  { entity: 'ENERGIA',      tests: [/subsidio.*(energ|luz|electr)/, /tarifa.*(energ|luz)/, /energ.*(electr|subsidio)/, /\bcreg\b/] },
  { entity: 'MINENERGIA',   tests: [/ministerio de minas/, /minenergia/] },
];

const INTENT_RULES = [
  { intent: 'DEFINICION',   tests: [/que es\b/, /que significa/, /en que consiste/, /definicion/] },
  { intent: 'FUNCIONES',    tests: [/que hace\b/, /funciones/, /\brol\b/, /para que sirve/, /competencia/] },
  { intent: 'TRAMITES',     tests: [/\btramit/, /que tramites/, /cuales tramites/, /que servicios ofrece/] },
  { intent: 'CONTACTO',     tests: [/como contact/, /\btelefono\b/, /\bcorreo\b/, /\batencion\b/, /\bpqrs/, /\bsede\b/, /\bdirecci/] },
  { intent: 'PLATAFORMAS',  tests: [/\bplataforma/, /\banna\b/, /en linea/, /\bdigital\b/] },
  { intent: 'REQUISITOS',   tests: [/\brequisito/, /que necesito/, /como solicitar/, /pasos para/, /\bdocumento/] },
  { intent: 'NORMATIVIDAD', tests: [/\bley\b/, /\bdecreto\b/, /\bnorma/, /\bcodigo\b/] },
  { intent: 'SERVICIOS',    tests: [/\bservicio/, /que ofrece/, /que presta/, /que brinda/] },
];

export const detectIntent = (question) => {
  const q = normalize(question);

  let entity = null;
  for (const { entity: e, tests } of ENTITY_RULES) {
    if (tests.some((t) => t.test(q))) { entity = e; break; }
  }

  let intent = 'GENERAL';
  for (const { intent: i, tests } of INTENT_RULES) {
    if (tests.some((t) => t.test(q))) { intent = i; break; }
  }

  return { entity, intent };
};

export const getLocalAnswer = (entity, intent) => {
  if (!entity) return null;
  const entityKB = LOCAL_KNOWLEDGE[entity];
  if (!entityKB) return null;
  return entityKB[intent] || entityKB['GENERAL'] || null;
};
