/**
 * chatbotLinks.js
 * ─────────────────────────────────────────────────────────────────
 * Fuente única de verdad para todos los enlaces externos del
 * ChatbotCiudadano. Las URLs gubernamentales suelen cambiar;
 * centralizar aquí garantiza que una sola edición lo actualice todo.
 * ─────────────────────────────────────────────────────────────────
 */

const CHATBOT_LINKS = {
  /** Página principal de Atención y Servicio al Ciudadano - MinEnergía */
  VENTANILLA_UNICA: {
    url: 'https://www.minenergia.gov.co/es/atencion-y-servicio-al-ciudadano/',
    label: 'Ir a la Ventanilla Única ↗',
  },

  /** Login / registro de la plataforma AnnA Minería (ANM) */
  ANNA_MINERIA: {
    url: 'https://annamineria.anm.gov.co/sigm/externalLogin',
    label: 'Ir a AnnA Minería ↗',
  },

  /** Canal de Atención al Ciudadano - Agencia Nacional de Minería (ANM) */
  ATENCION_ANM: {
    url: 'https://www.anm.gov.co/?q=atencion-al-ciudadano',
    label: 'Ir a Atención al Ciudadano ANM ↗',
  },

  /** Canal PQRSD - Servicio Geológico Colombiano (SGC) */
  ATENCION_SGC: {
    url: 'https://www.sgc.gov.co/atencion-al-ciudadano/pqrsd',
    label: 'Ir a Atención al Ciudadano SGC ↗',
  },

  /** Canal de Atención - Agencia Nacional de Hidrocarburos (ANH) */
  ATENCION_ANH: {
    url: 'https://www.anh.gov.co/atencion-al-ciudadano',
    label: 'Ir a Atención al Ciudadano ANH ↗',
  },

  /** Portal de Trámites Electrónicos - Ministerio de Minas y Energía */
  TRAMITES_MINENERGIA: {
    url: 'https://www.minenergia.gov.co/es/tramites-y-servicios/',
    label: 'Ir a Trámites MinEnergía ↗',
  },

  /** Transparencia y Acceso a la Información Pública - MinEnergía */
  INFO_PUBLICA: {
    url: 'https://www.minenergia.gov.co/es/transparencia-y-acceso-a-la-informacion-publica/',
    label: 'Ver Información Pública ↗',
  },
};

export default CHATBOT_LINKS;
