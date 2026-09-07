import { services } from '../../data/services';
import Reveal from '../Shared/Reveal';
import ServiceCard from './ServiceCard';
import './Services.css';
export default function Services() {
  return (
    <section id="services" className="section section-divider">
      <div className="container">
        <Reveal className="section-header">
          <div>
            <div className="eyebrow">06. Services</div>
            <h2>
              What I can do for you<span className="gradient-text">.</span>
            </h2>
          </div>
          <p>
            Thoughtful development.
            <br />
            Built around your ideas.
          </p>
        </Reveal>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
