import React from 'react';
import { Phone, Mail, AlertTriangle, MessageSquare, MapPin, Headphones } from 'lucide-react';
import './ContactSection.css';

const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="container section-inner">
        <div className="section-header-centered">
          <span className="eyebrow-blue">CONTACTO CIUDADANO</span>
          <h2>Canales de Atención Especializados</h2>
        </div>

        <div className="contact-grid">
          {/* SGC CARD */}
          <div className="contact-card card-emerald">
            <div className="card-top-icon">
              <Headphones size={32} />
            </div>
            <h3>Soporte SGC</h3>
            <div className="contact-fields">
              <div className="field-capsule field-emerald-light">
                <Phone size={16} />
                <span>+57 601 220 0200</span>
              </div>
              <div className="field-capsule field-emerald-light">
                <Mail size={16} />
                <span>cliente@sgc.gov.co</span>
              </div>
              <div className="field-capsule field-emerald-light">
                <AlertTriangle size={16} />
                <span>Reportar Evento Sísmico</span>
              </div>
            </div>
          </div>

          {/* ANM CARD */}
          <div className="contact-card card-royal">
            <div className="card-top-icon">
              <Headphones size={32} />
            </div>
            <h3>Soporte ANM</h3>
            <div className="contact-fields">
              <div className="field-capsule field-royal-light">
                <Phone size={16} />
                <span>+57 601 220 1999</span>
              </div>
              <div className="field-capsule field-royal-light">
                <Mail size={16} />
                <span>contactenos@anm.gov.co</span>
              </div>
              <div className="field-capsule field-royal-light">
                <MessageSquare size={16} />
                <span>Chat en Vivo</span>
              </div>
            </div>
          </div>

          {/* MME CARD */}
          <div className="contact-card card-navy">
            <div className="card-top-icon">
              <Headphones size={32} />
            </div>
            <h3>Sede Central</h3>
            <div className="contact-fields">
              <div className="field-capsule field-navy-light">
                <Phone size={16} />
                <span>+57 601 220 0300</span>
              </div>
              <div className="field-capsule field-navy-light">
                <Mail size={16} />
                <span>contacto@energia.gov.co</span>
              </div>
              <div className="field-capsule field-navy-light">
                <MapPin size={16} />
                <span>CAN - Bogotá D.C.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
