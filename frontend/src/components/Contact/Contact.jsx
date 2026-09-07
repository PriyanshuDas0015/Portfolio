import { ArrowUpRight, Github, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import SocialLinks from '../Shared/SocialLinks';
import Reveal from '../Shared/Reveal';
import ContactForm from './ContactForm';
import './Contact.css';
export default function Contact() {
  const { settings } = usePortfolio();
  const info = settings.contactInfo;
  const social = settings.socialLinks;
  const githubName = social.github
    ? social.github.replace(/\/$/, '').split('/').pop()
    : 'PriyanshuDas0015';
  return (
    <section id="contact" className="section section-divider">
      <div className="container contact-grid">
        <Reveal className="contact-copy">
          <div className="eyebrow">08. Contact</div>
          <h2>
            {info.heading}
            <ArrowUpRight className="contact-heading-arrow" />
          </h2>
          <p>{info.subheading}</p>
          <div className="contact-details">
            {info.email && (
              <a href={`mailto:${info.email}`}>
                <Mail size={17} />
                <span className="contact-link-copy">
                  <small>Email</small>
                  {info.email}
                </span>
                <ArrowUpRight size={14} />
              </a>
            )}
            {social.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer">
                <Github size={17} />
                <span className="contact-link-copy">
                  <small>GitHub</small>
                  {githubName}
                </span>
                <ArrowUpRight size={14} />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={17} />
                <span className="contact-link-copy">
                  <small>LinkedIn</small>
                  Priyanshu Das
                </span>
                <ArrowUpRight size={14} />
              </a>
            )}
            {info.phone && (
              <a href={`tel:${info.phone.replace(/[^+\d]/g, '')}`}>
                <Phone size={17} />
                {info.phone}
              </a>
            )}
            <span>
              <MapPin size={17} />
              {info.location}
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
