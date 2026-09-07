import { Code2, Server, Database, Terminal, Wrench } from 'lucide-react';
import Reveal from '../Shared/Reveal';
import { mouseGlow } from '../../utils/mouseGlow';
const icons = {
  code: Code2,
  server: Server,
  database: Database,
  terminal: Terminal,
  tools: Wrench,
};
export default function SkillCard({ skill, index }) {
  const Icon = icons[skill.icon];
  return (
    <Reveal delay={index * 0.05} className={`skill-card glass card-hover skill-${skill.color}`}>
      <div onPointerMove={mouseGlow} className="skill-content">
        <div className="skill-icon">
          <Icon size={22} />
        </div>
        <h3>{skill.title}</h3>
        <div className="skill-tags">
          {skill.items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <span className="skill-index">0{index + 1}</span>
      </div>
    </Reveal>
  );
}
