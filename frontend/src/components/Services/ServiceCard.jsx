import { Code2, Network, Layers, Sparkles, ArrowUpRight } from 'lucide-react';
import Reveal from '../Shared/Reveal';
import { mouseGlow } from '../../utils/mouseGlow';
const icons = { code: Code2, network: Network, layers: Layers, sparkles: Sparkles };
export default function ServiceCard({ service, index }) {
  const Icon = icons[service.icon];
  return (
    <Reveal delay={index * 0.05}>
      <a href="#contact" className="service-card glass card-hover" onPointerMove={mouseGlow}>
        <div className="service-top">
          <Icon size={25} />
          <span>0{index + 1}</span>
        </div>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <span className="service-arrow" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </a>
    </Reveal>
  );
}
