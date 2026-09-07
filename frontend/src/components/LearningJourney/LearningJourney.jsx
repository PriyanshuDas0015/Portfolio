import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { journey } from '../../data/journey';
import Reveal from '../Shared/Reveal';
import TimelineItem from './TimelineItem';
import './LearningJourney.css';
export default function LearningJourney() {
  const timeline = useRef(null);
  const { scrollYProgress } = useScroll({ target: timeline, offset: ['start 75%', 'end 75%'] });
  return (
    <section id="experience" className="section section-divider">
      <div className="container journey-layout">
        <Reveal className="journey-intro">
          <div className="eyebrow">04. Experience</div>
          <h2>
            My learning
            <br />
            journey<span className="gradient-text">.</span>
          </h2>
          <p>
            One concept, one challenge,
            <br />
            one project at a time.
          </p>
          <div className="journey-note">
            <span>↗</span>
            <p>
              Learning by doing.
              <br />
              <strong>Growing with every build.</strong>
            </p>
          </div>
        </Reveal>
        <div className="timeline" ref={timeline}>
          <div className="timeline-track">
            <motion.div style={{ scaleY: scrollYProgress }} />
          </div>
          {journey.map((item, index) => (
            <TimelineItem key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
