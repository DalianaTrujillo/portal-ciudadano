-- ============================================================
-- PORTAL CIUDADANO - Asistente Virtual Inteligente
-- Ejecutar en DBeaver sobre la BD: postgres o mediante setup_db.js
-- ============================================================

DROP TABLE IF EXISTS knowledge_base CASCADE;
DROP TABLE IF EXISTS unknown_questions CASCADE;
DROP TABLE IF EXISTS pending_questions CASCADE;
DROP TABLE IF EXISTS chat_history CASCADE;

CREATE TABLE knowledge_base (
    id                SERIAL PRIMARY KEY,
    entity            VARCHAR(100),
    intent            VARCHAR(50),
    title             VARCHAR(255),
    content           TEXT NOT NULL,
    keywords          TEXT,
    related_questions JSONB,
    source            VARCHAR(255) NOT NULL,
    source_url        VARCHAR(500) UNIQUE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kb_entity_intent ON knowledge_base (entity, intent);

-- Nueva tabla de aprendizaje
CREATE TABLE pending_questions (
    id                          SERIAL PRIMARY KEY,
    pregunta                    TEXT NOT NULL UNIQUE,
    cantidad_veces_consultada   INTEGER DEFAULT 1,
    entidad_detectada           VARCHAR(100),
    intencion_detectada         VARCHAR(50),
    fecha                       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_history (
    id         SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    role       VARCHAR(50),
    message    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BASE DE CONOCIMIENTO INICIAL (Muestra adaptada al nuevo esquema)
-- ============================================================

-- ANM
INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url) VALUES
('ANM', 'DEFINICION', 'Definición de la Agencia Nacional de Minería',
 'La Agencia Nacional de Minería (ANM) es la entidad del Estado colombiano encargada de administrar los recursos minerales de la Nación. Fue creada mediante el Decreto 4134 de 2011 y es una Agencia Nacional Estatal de Naturaleza Especial, adscrita al Ministerio de Minas y Energía. Su misión es promover el aprovechamiento sostenible y responsable del patrimonio minero.',
 'anm definicion que es agencia nacional mineria',
 '["¿Cuáles son las funciones de la ANM?", "¿Qué trámites ofrece la ANM?", "¿Cómo contacto a la ANM?"]',
 'Agencia Nacional de Minería', 'https://www.anm.gov.co/institucional/quienes-somos');

INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url) VALUES
('ANM', 'FUNCIONES', 'Funciones de la ANM',
 'Las funciones principales de la ANM son:
• Otorgar, fiscalizar y terminar contratos de concesión minera.
• Administrar el Registro Minero Nacional (RMN).
• Recaudar las regalías y cánones de la actividad minera.
• Declarar y administrar las Áreas de Reserva Especial.
• Gestionar la plataforma AnnA Minería.',
 'anm funciones que hace administra titulos mineros regalias',
 '["¿Qué es AnnA Minería?", "¿Cómo solicitar un título minero?", "¿Cómo contacto a la ANM?"]',
 'Agencia Nacional de Minería', 'https://www.anm.gov.co/institucional/funciones');

INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url) VALUES
('ANM', 'TRAMITES', 'Trámites de la ANM',
 'La ANM ofrece los siguientes trámites principales:
• Solicitud de contrato de concesión minera.
• Cesión de derechos mineros.
• Autorización de subcontrato de operación.
• Consulta de estado de títulos en el RMN.
Todos los trámites se gestionan a través de la plataforma AnnA Minería.',
 'anm tramites solicitud contrato concesion cesion autorizacion',
 '["¿Cómo solicitar un título minero?", "¿Qué es AnnA Minería?", "¿Cuáles son los requisitos?"]',
 'Agencia Nacional de Minería', 'https://www.anm.gov.co/tramites');

INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url) VALUES
('ANM', 'CONTACTO', 'Atención al Ciudadano ANM',
 'Los canales oficiales de atención de la ANM son:
• Línea gratuita: 01 8000 910 048
• Correo: servicioalciudadano@anm.gov.co
• Sede principal: Cra. 54 No. 26-50, Bogotá D.C.
• Horario: Lunes a viernes de 8:00 a.m. a 5:00 p.m.',
 'anm contacto telefono correo atencion pqrsd sede',
 '["¿Qué trámites ofrece la ANM?", "¿Cómo solicitar un título minero?"]',
 'Agencia Nacional de Minería', 'https://www.anm.gov.co/atencion-al-ciudadano');

-- SGC
INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url) VALUES
('SGC', 'DEFINICION', '¿Qué es el SGC?',
 'El Servicio Geológico Colombiano (SGC) es la entidad científico-técnica del Estado encargada de investigar, generar y difundir el conocimiento sobre los recursos del subsuelo y las amenazas de origen geológico. Está adscrito al Minciencias.',
 'sgc definicion que es servicio geologico colombiano ingeominas',
 '["¿Cuáles son las funciones del SGC?", "¿Qué servicios presta el SGC?", "¿Dónde consulto sismos recientes?"]',
 'Servicio Geológico Colombiano', 'https://www.sgc.gov.co/institucional/quienes-somos');

INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url) VALUES
('SGC', 'SERVICIOS', 'Servicios del SGC',
 'El Servicio Geológico Colombiano presta servicios como:
• Consulta del Catálogo Sísmico Nacional.
• Monitoreo de actividad volcánica.
• Mapas geológicos descargables.
• Laboratorios de análisis geoquímico.',
 'sgc servicios catalogo sismico volcanes mapas amenaza',
 '["¿Dónde consulto sismos recientes?", "¿Cuáles son las funciones del SGC?"]',
 'Servicio Geológico Colombiano', 'https://www.sgc.gov.co/servicios');

-- REGALIAS
INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url) VALUES
('REGALIAS', 'DEFINICION', 'Concepto de Regalías',
 'Las regalías son la contraprestación económica que recibe el Estado colombiano por la explotación de recursos naturales no renovables que se encuentran en el subsuelo y son propiedad de la Nación.',
 'regalias definicion que son contraprestacion recursos',
 '["¿Cómo se distribuyen las regalías?", "¿Qué proyectos financian las regalías?"]',
 'Sistema General de Regalías', 'https://www.sgr.gov.co/que-son-regalias');

-- ENERGIA
INSERT INTO knowledge_base (entity, intent, title, content, keywords, related_questions, source, source_url) VALUES
('ENERGIA', 'SERVICIOS', 'Subsidio de Energía Eléctrica',
 'Los subsidios de energía se asignan a usuarios residenciales:
• Estrato 1: Subsidio del 50% sobre el consumo básico.
• Estrato 2: Subsidio del 40%.
• Estrato 3: Subsidio del 15%.
El descuento se aplica automáticamente en la factura.',
 'subsidio energia electrica estrato factura descuento',
 '["¿Cómo presento un PQRSD energético?", "¿Qué regula el Ministerio de Minas?"]',
 'Ministerio de Minas y Energía', 'https://www.minenergia.gov.co/subsidios');
