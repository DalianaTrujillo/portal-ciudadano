/**
 * tramitesCatalog.js
 * ─────────────────────────────────────────────────────────────────────────
 * Catálogo oficial de trámites y servicios del Ministerio de Minas y
 * Energía y entidades adscritas. Fuente única de verdad para el motor
 * de clasificación del ChatbotCiudadano.
 *
 * Para añadir un trámite: agrega una entrada al array TRAMITES_CATALOG.
 * No es necesario modificar la lógica del chatbot.
 *
 * Campos:
 *   id          — clave única (kebab-case)
 *   nombre      — nombre oficial del trámite
 *   descripcion — descripción de una línea para mostrar al ciudadano
 *   entidad     — 'MinEnergia' | 'ANM' | 'SGC' | 'ANH'
 *   linkKey     — clave en CHATBOT_LINKS que apunta al canal correcto
 *   keywords    — raíces normalizadas (sin tildes, minúsculas) para scoring
 * ─────────────────────────────────────────────────────────────────────────
 */

export const TRAMITES_CATALOG = [

  // ── 1. INSTALACIONES RADIACTIVAS ────────────────────────────────────────
  {
    id: 'instalaciones-radiactivas',
    nombre: 'Registro y Autorización de Instalaciones Radiactivas',
    descripcion:
      'Autorización para uso, manejo y operación de fuentes radiactivas con fines industriales, médicos o de investigación.',
    entidad: 'SGC',
    linkKey: 'ATENCION_SGC',
    keywords: [
      'radiactiv', 'radioactiv', 'nuclear', 'radiacion', 'isotopo',
      'fuente radiactiv', 'instalacion radiactiv', 'material radiactiv',
      'desecho radiactiv', 'residuo nuclear', 'fuente sellada',
    ],
  },

  // ── 2. LICENCIAS Y AUTORIZACIONES MINERAS ───────────────────────────────
  {
    id: 'licencia-minera',
    nombre: 'Licencia, Autorización y Contrato de Concesión Minera',
    descripcion:
      'Solicitud de contratos de concesión, autorizaciones temporales y licencias de exploración y explotación minera.',
    entidad: 'ANM',
    linkKey: 'ATENCION_ANM',
    keywords: [
      'licencia miner', 'titulo miner', 'concesion miner', 'autorizacion miner',
      'exploracion miner', 'explotacion miner', 'contrato miner', 'permiso miner',
      'area miner', 'derecho miner', 'canon superfici',
    ],
  },

  // ── 3. PQRSD ────────────────────────────────────────────────────────────
  {
    id: 'pqrsd',
    nombre: 'Radicación de PQRSD (Peticiones, Quejas, Reclamos, Sugerencias y Denuncias)',
    descripcion:
      'Canal oficial para radicar solicitudes ciudadanas ante el Ministerio de Minas y Energía.',
    entidad: 'MinEnergia',
    linkKey: 'VENTANILLA_UNICA',
    keywords: [
      'pqrs', 'pqrsd', 'peticion', 'queja', 'reclamo',
      'sugerencia', 'denuncia', 'radicar', 'radicacion',
      'derecho peticion', 'solicitud ciudadana',
    ],
  },

  // ── 4. INFORMACIÓN PÚBLICA ───────────────────────────────────────────────
  {
    id: 'informacion-publica',
    nombre: 'Solicitud de Información Pública (Ley de Transparencia 1712/2014)',
    descripcion:
      'Acceso a documentos, contratos y datos en poder del Ministerio según la Ley 1712 de 2014.',
    entidad: 'MinEnergia',
    linkKey: 'INFO_PUBLICA',
    keywords: [
      'informacion public', 'transparencia', 'acceso informacion',
      'ley 1712', 'documento public', 'dato public', 'informacion reservad',
      'acceso document', 'publicidad informacion',
    ],
  },

  // ── 5. REGALÍAS ──────────────────────────────────────────────────────────
  {
    id: 'regalias',
    nombre: 'Consulta, Liquidación y Pago de Regalías Mineras',
    descripcion:
      'Liquidación, pago y consulta de saldos de regalías provenientes de la explotación de recursos naturales no renovables.',
    entidad: 'ANM',
    linkKey: 'ATENCION_ANM',
    keywords: [
      'regalia', 'liquidacion regalia', 'pago regalia',
      'distribucion regalia', 'recaudo regalia', 'sgr',
      'sistema general regalia', 'transferencia regalia',
      'participacion regalia', 'calculo regalia',
    ],
  },

  // ── 6. FISCALIZACIÓN MINERA ──────────────────────────────────────────────
  {
    id: 'fiscalizacion-minera',
    nombre: 'Fiscalización y Control Minero',
    descripcion:
      'Reporte de infracciones, visitas de fiscalización y seguimiento al cumplimiento de obligaciones del título minero.',
    entidad: 'ANM',
    linkKey: 'ATENCION_ANM',
    keywords: [
      'fiscalizacion', 'control miner', 'infraccion miner',
      'obligacion miner', 'inspeccion miner', 'seguimiento miner',
      'cumplimiento miner', 'sancion miner', 'mineria ilegal',
      'mineria informal', 'intervencion miner',
    ],
  },

  // ── 7. ENERGÍA ELÉCTRICA ─────────────────────────────────────────────────
  {
    id: 'energia-electrica',
    nombre: 'Trámites del Sector Eléctrico',
    descripcion:
      'Conexión a la red, solicitudes tarifarias, habilitación de agentes del mercado eléctrico y permisos de generación.',
    entidad: 'MinEnergia',
    linkKey: 'TRAMITES_MINENERGIA',
    keywords: [
      'electrico', 'energia electric', 'red electric', 'tarifa electric',
      'conexion electric', 'generacion electric', 'distribucion electric',
      'comercializacion', 'kwh', 'megawatt', 'voltaje', 'subestacion',
      'factura electric', 'corte servicio', 'reconexion', 'subsidio electric',
    ],
  },

  // ── 8. HIDROCARBUROS ─────────────────────────────────────────────────────
  {
    id: 'hidrocarburos',
    nombre: 'Licencias de Exploración y Producción de Hidrocarburos',
    descripcion:
      'Contratos E&P de petróleo y gas, asignación de áreas y cumplimiento de obligaciones con la Agencia Nacional de Hidrocarburos.',
    entidad: 'ANH',
    linkKey: 'ATENCION_ANH',
    keywords: [
      'hidrocarburo', 'petroleo', 'gas natural', 'exploracion petroleo',
      'produccion gas', 'anh', 'agencia hidrocarburos', 'barril',
      'pozo petroleo', 'campo petrolifero', 'refineria', 'gasolina',
      'combustible', 'oleoducto', 'gasoducto', 'crudo',
    ],
  },

  // ── 9. GEOLOGÍA Y CARTOGRAFÍA ────────────────────────────────────────────
  {
    id: 'geologia',
    nombre: 'Acceso a Datos Geológicos, Cartografía y Amenazas Naturales',
    descripcion:
      'Solicitud de mapas geológicos, información sísmica, datos de volcanes, amenazas naturales y acceso al Atlas Geológico de Colombia.',
    entidad: 'SGC',
    linkKey: 'ATENCION_SGC',
    keywords: [
      'geologi', 'mapa geologi', 'cartografi', 'sismo', 'terremoto',
      'volcan', 'amenaza natural', 'atlas geologi', 'subsuelo',
      'estratigrafi', 'falla geologi', 'movimiento masa', 'deslizamiento',
      'inundacion geologi', 'riesgo geologi', 'monitoreo sismico',
    ],
  },

  // ── 10. TRÁMITES CIUDADANOS GENERALES ───────────────────────────────────
  {
    id: 'tramites-ciudadanos',
    nombre: 'Trámites y Servicios Ciudadanos — Ventanilla Única MinEnergía',
    descripcion:
      'Portal central de trámites electrónicos del Ministerio para todas las solicitudes ciudadanas del sector minero-energético.',
    entidad: 'MinEnergia',
    linkKey: 'VENTANILLA_UNICA',
    keywords: [
      'tramite ciudadano', 'ventanilla unica', 'servicio ciudadano',
      'tramite ministerio', 'tramite electronico', 'atencion ciudadano',
      'tramite minenergia', 'tramite sector', 'certificado ministerio',
    ],
  },
];

export default TRAMITES_CATALOG;
