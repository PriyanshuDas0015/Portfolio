import { skills } from '../../data/skills';
import Reveal from '../Shared/Reveal';
import SkillCard from './SkillCard';
import './Skills.css';
export default function Skills() {
  return (
    <section id="skills" className="section section-divider">
      <div className="container">
        <Reveal className="section-header">
          <div>
            <div className="eyebrow">02. Skills</div>
            <h2>
              Technologies I work with<span className="gradient-text">.</span>
            </h2>
          </div>
          <p>
            My toolkit for turning ideas into
            <br />
            something you can interact with.
          </p>
        </Reveal>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <SkillCard key={skill.title} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
