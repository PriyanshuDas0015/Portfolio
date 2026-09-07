import { Focus, Lightbulb, Hammer, ArrowUpRight, Download, Code2 } from 'lucide-react';
import Reveal from '../Shared/Reveal';
import { site } from '../../data/socialLinks';
import './About.css';
export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal className="about-grid">
          <div className="about-art glass" aria-hidden="true">
            <div className="about-art-grid" />
            <div className="about-art-orbit orbit-a" />
            <div className="about-art-orbit orbit-b" />
            <div className="about-symbol">
              <Code2 size={46} />
            </div>
            <span className="art-coordinate">01 / THE PERSON BEHIND THE CODE</span>
            <span className="art-tag">Curiosity meets creativity.</span>
            <span className="art-point" />
          </div>
          <div className="about-copy">
            <div className="eyebrow">01. About Me</div>
            <h2>
              More than just
              <br />a developer<span className="gradient-text">.</span>
            </h2>
            <p>
              I'm Priyanshu, a Computer Science undergraduate and Frontend Developer who enjoys
              turning ideas into thoughtful digital experiences.
            </p>
            <p>
              From crafting clean interfaces to solving real-world problems, I learn best by
              building. Every project is a chance to explore, improve and create something
              meaningful.
            </p>
            <div className="about-traits">
              {[
                [Focus, 'Focused', 'On learning'],
                [Lightbulb, 'Problem Solver', 'Solution oriented'],
                [Hammer, 'Always', 'Building'],
                [ArrowUpRight, 'Open', 'To opportunities'],
              ].map(([Icon, title, subtitle]) => (
                <div key={title}>
                  <Icon size={17} />
                  <span>
                    <strong>{title}</strong>
                    <small>{subtitle}</small>
                  </span>
                </div>
              ))}
            </div>
            {site.resume ? (
              <a href={site.resume} className="text-link" download>
                Download Resume <Download size={15} />
              </a>
            ) : (
              <span className="resume-unavailable">
                <Download size={15} /> Resume coming soon
              </span>
            )}
          </div>
        </Reveal>
        <Reveal>
          <blockquote className="about-quote">
            <span>“</span>Better solutions for a brighter tomorrow.<span>”</span>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
