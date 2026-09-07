import { ArrowRight, ArrowDown, Code2, Atom, Braces, Leaf, Flame, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import SocialLinks from '../Shared/SocialLinks';
import './Hero.css';
const technologies = [
  { label: 'React', Icon: Atom, cls: 'react' },
  { label: 'JavaScript', Icon: Braces, cls: 'javascript' },
  { label: 'Node.js', Icon: Hexagon, cls: 'node' },
  { label: 'MongoDB', Icon: Leaf, cls: 'mongo' },
  { label: 'Firebase', Icon: Flame, cls: 'firebase' },
];
export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="availability">
            <span /> Open to opportunities
          </div>
          <div className="hero-label">// FRONTEND DEVELOPER</div>
          <h1>
            Hi, I'm
            <br />
            <span className="gradient-text">Priyanshu Das</span>
            <span className="heading-period">.</span>
          </h1>
          <h2>
            I build modern, responsive and
            <br className="desktop-break" /> meaningful web experiences.
          </h2>
          <p>
            I'm a Computer Science undergraduate and Frontend Developer passionate about web
            development, building real-world projects and creating digital solutions that make an
            impact.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="button button-primary">
              View My Projects <ArrowRight />
            </a>
            <a href="#contact" className="button">
              Contact Me <ArrowRight />
            </a>
          </div>
          <div className="hero-social">
            <SocialLinks />
            <span className="social-separator" />
            <span>Let's connect</span>
          </div>
        </motion.div>
        <motion.div
          className="orbit-scene"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          aria-label="Code, Create, Build, Repeat. React, JavaScript, Node.js, MongoDB and Firebase."
        >
          <div className="orbit-halo" />
          <div className="orbit-ring ring-outer" />
          <div className="orbit-ring ring-middle" />
          <div className="orbit-ring ring-inner" />
          <div className="orbit-track">
            <i />
            <i />
          </div>
          <div className="orbit-axis axis-one" />
          <div className="orbit-axis axis-two" />
          <div className="orbit-center">
            <Code2 size={26} />
            <span>
              Code
              <span className="orbit-word">
                Create
                <span className="orbit-word">
                  Build
                  <span className="orbit-word orbit-repeat">
                    Repeat<span className="orbit-dot">.</span>
                  </span>
                </span>
              </span>
            </span>
            <small>IDEAS → EXPERIENCES</small>
          </div>
          {technologies.map(({ label, Icon, cls }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className={`technology-badge ${cls}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </motion.div>
          ))}
          <span className="orbit-spark spark-one" />
          <span className="orbit-spark spark-two" />
          <div className="orbit-caption">
            <span /> CRAFTED WITH CURIOSITY
          </div>
        </motion.div>
      </div>
      <div className="container hero-bottom">
        <a href="#about">
          <span className="scroll-mouse">
            <i />
          </span>{' '}
          Scroll to explore <ArrowDown size={14} />
        </a>
        <span>GOOD DESIGN. CLEAN CODE. REAL IMPACT.</span>
      </div>
    </section>
  );
}
