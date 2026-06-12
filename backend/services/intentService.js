/**
 * intentService.js
 * Detecta la ENTIDAD y la INTENCIÓN de una pregunta del ciudadano.
 * Soporta memoria conversacional (contextEntity).
 */

// ──────────────────────────────────────────────────────────────
// MAPA DE ENTIDADES (14 entidades)
// ──────────────────────────────────────────────────────────────
const ENTITY_MAP = [
    { entity: 'MINENERGIA',           patterns: [/\bminenergia\b/i, /ministerio de minas/i, /mineenergia/i] },
    { entity: 'ANM',                  patterns: [/\banm\b/i, /agencia nacional de miner/i, /agencia minera/i] },
    { entity: 'SGC',                  patterns: [/\bsgc\b/i, /servicio geol/i, /ingeominas/i] },
    { entity: 'REGALIAS',             patterns: [/regal[ií]a/i, /\bocad\b/i, /\bsgr\b/i, /sistema general de regal/i, /fonpet/i] },
    { entity: 'DATOS_INDICADORES',    patterns: [/\bdatos\b/i, /\bindicadores\b/i, /cifras/i, /estad[ií]stica/i] },
    { entity: 'VISOR_TERRITORIAL',    patterns: [/visor territorial/i, /\bmapa\b/i, /geoportal/i] },
    { entity: 'ENTIDADES_TEMAS',      patterns: [/entidades y temas/i, /que entidades/i, /entidades adscritas/i] },
    { entity: 'TRAMITES_SERVICIOS',   patterns: [/tr[aá]mites y servicios/i, /\btr[aá]mites\b/i, /\bservicios\b/i] },
    { entity: 'PARTICIPACION',        patterns: [/participaci[oó]n ciudadana/i, /participar/i, /rendici[oó]n de cuentas/i] },
    { entity: 'PQRSD',                patterns: [/\bpqrsd\b/i, /\bpqrs\b/i, /queja/i, /reclamo/i, /petici[oó]n/i, /denuncia/i] },
    { entity: 'NOTICIAS',             patterns: [/\bnoticia/i, /novedad/i, /bolet[ií]n/i, /comunicado/i, /actualidad/i] },
    { entity: 'NORMATIVIDAD',         patterns: [/\bnormatividad/i, /\bley\b/i, /\bdecreto\b/i, /resoluci[oó]n/i, /\bjur[ií]dic/i, /norma/i] },
    { entity: 'ANNA_MINERIA',         patterns: [/anna miner[ií]a/i, /\banna\b/i, /plataforma anna/i] },
    { entity: 'ATENCION_CIUDADANO',   patterns: [/atenci[oó]n al ciudadano/i, /canales de atenci[oó]n/i, /oficina de atenci[oó]n/i] }
];

// ──────────────────────────────────────────────────────────────
// MAPA DE INTENCIONES (15 intenciones)
// ──────────────────────────────────────────────────────────────
const INTENT_MAP = [
    { intent: 'DEFINICION',    patterns: [/qu[eé] es\b/i, /qu[eé] significa/i, /en qu[eé] consiste/i, /definici[oó]n/i, /\bdefine\b/i] },
    { intent: 'FUNCIONES',     patterns: [/qu[eé] hace\b/i, /\bfunci[oó]n/i, /funciones/i, /\brol\b/i, /\bresponsabilidad/i, /para qu[eé] sirve/i] },
    { intent: 'TRAMITES',      patterns: [/\btr[aá]mit/i, /\bprocedimiento/i, /c[oó]mo hago\b/i, /c[oó]mo radico\b/i] },
    { intent: 'REQUISITOS',    patterns: [/\brequisito/i, /qu[eé] necesito/i, /c[oó]mo solicitar/i, /pasos para/i] },
    { intent: 'DOCUMENTOS',    patterns: [/\bdocumento/i, /formato/i, /formulario/i, /papeles/i] },
    { intent: 'CONTACTO',      patterns: [/c[oó]mo contact/i, /\btel[eé]fono/i, /\bcorreo/i, /comunic/i] },
    { intent: 'HORARIOS',      patterns: [/\bhorario/i, /a qu[eé] hora/i, /d[ií]as de atenci[oó]n/i, /cu[aá]ndo abren/i] },
    { intent: 'NORMATIVIDAD',  patterns: [/\bnormatividad/i, /\bley\b/i, /\bdecreto\b/i, /resoluci[oó]n/i, /\bjur[ií]dic/i] },
    { intent: 'CONSULTA',      patterns: [/\bconsult/i, /estado de/i, /d[oó]nde veo/i, /c[oó]mo busco/i] },
    { intent: 'SERVICIOS',     patterns: [/\bservicio/i, /qu[eé] ofrece/i, /qu[eé] brinda/i, /qu[eé] presta/i] },
    { intent: 'PLATAFORMAS',   patterns: [/\bplataforma/i, /\bportal\b/i, /\bsistema\b/i, /en l[ií]nea/i, /\bdigital/i] },
    { intent: 'UBICACION',     patterns: [/\bdirecci[oó]n/i, /\bsede\b/i, /d[oó]nde queda/i, /d[oó]nde est[aá]/i, /c[oó]mo llegar/i] },
    { intent: 'ESTADISTICAS',  patterns: [/\bcifras/i, /estad[ií]stica/i, /indicadores/i, /cu[aá]nto/i] },
    { intent: 'PROCESOS',      patterns: [/\bproceso/i, /seguimiento/i, /etapa/i, /fase/i] },
    { intent: 'DESCARGAS',     patterns: [/\bdescargar/i, /\bbajar\b/i, /obtener archivo/i, /exportar/i] }
];

// ──────────────────────────────────────────────────────────────
// DETECTOR CON MEMORIA CONVERSACIONAL
// ──────────────────────────────────────────────────────────────
const detectEntityAndIntent = (question, contextEntity = null) => {
    const q = question.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    // 1. Detectar entidad explícita en el texto actual
    let detectedEntity = null;
    for (const { entity: e, patterns } of ENTITY_MAP) {
        if (patterns.some(p => p.test(q))) {
            detectedEntity = e;
            break;
        }
    }

    // MEMORIA CONVERSACIONAL: Si no se mencionó ninguna entidad ahora, pero había una en el contexto, se hereda.
    let finalEntity = detectedEntity || contextEntity || null;

    // 2. Detectar intención
    let finalIntent = 'GENERAL';
    for (const { intent: i, patterns } of INTENT_MAP) {
        if (patterns.some(p => p.test(q))) {
            finalIntent = i;
            break;
        }
    }

    // Lógica especial de intención cruzada: 
    // Si la entidad es explícitamente TRAMITES_SERVICIOS pero la intención es GENERAL, pasamos la intención a TRAMITES.
    if (finalEntity === 'TRAMITES_SERVICIOS' && finalIntent === 'GENERAL') finalIntent = 'TRAMITES';

    return { 
        entity: finalEntity, 
        intent: finalIntent 
    };
};

module.exports = { detectEntityAndIntent };
