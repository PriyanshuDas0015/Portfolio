import { ArrowUpRight, MapPin, Mail } from 'lucide-react';
import { site } from '../../data/socialLinks';
import SocialLinks from '../Shared/SocialLinks';
import Reveal from '../Shared/Reveal';
import ContactForm from './ContactForm';
import './Contact.css';
export default function Contact() {
  return (
    <section id="contact" className="section section-divider">
      <div className="container contact-grid">
        <Reveal className="contact-copy">
          <div className="eyebrow">07. Contact</div>
          <h2>
            Let's create
            <br />
            something
            <br />
            <span className="gradient-text">amazing.</span>
            <ArrowUpRight className="contact-heading-arrow" />
          </h2>
          <p>
            Have a project in mind or just want to say hi?
            <br />
            I'd love to hear from you.
          </p>
          <div className="contact-details">
            {site.email && (
              <a href={`mailto:${site.email}`}>
                <Mail size={17} />
                {site.email}
                <ArrowUpRight size={14} />
              </a>
            )}
            <span>
              <MapPin size={17} />
              {site.location}
            </span>
          </div>
          <SocialLinks />
          <div className="contact-availability">
            <i /> Open to projects & opportunities
          </div>
        </Reveal>
        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
