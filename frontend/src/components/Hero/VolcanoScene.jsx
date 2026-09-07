import { motion } from 'framer-motion';
import SkillOrb from './SkillOrb';

const particles = [
  [17, 27, 0.8, 11],
  [24, 48, 2.1, 14],
  [31, 17, 1.4, 9],
  [37, 39, 3.2, 13],
  [42, 12, 0.2, 15],
  [47, 31, 2.7, 10],
  [52, 19, 1.1, 12],
  [57, 40, 3.5, 16],
  [63, 13, 2.3, 11],
  [68, 30, 0.5, 14],
  [73, 21, 3.8, 9],
  [79, 42, 1.8, 13],
  [34, 52, 4.2, 15],
  [59, 54, 0.9, 12],
  [84, 34, 2.9, 16],
  [13, 40, 3.7, 10],
  [45, 48, 1.6, 14],
  [66, 49, 4.6, 11],
  [28, 29, 2.4, 13],
  [76, 14, 1.2, 15],
  [50, 7, 3.1, 12],
  [89, 28, 0.4, 14],
  [39, 25, 4.3, 16],
  [61, 34, 1.9, 10],
  [70, 51, 3.6, 13],
  [55, 27, 0.7, 11],
];

export default function VolcanoScene({ skills }) {
  return (
    <motion.div
      className="volcano-scene"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.9 }}
      aria-label={`Technology volcano powered by ${skills.join(', ')}`}
    >
      <div className="volcano-atmosphere" aria-hidden="true" />
      <div className="volcano-image-frame" aria-hidden="true">
        <img
          className="volcano-image"
          src="/hero/volcano.webp"
          alt=""
          width="1586"
          height="992"
          decoding="async"
          fetchPriority="high"
        />
        <span className="volcano-crater-pulse" />
        <span className="volcano-energy-column" />
        <span className="volcano-ground-fog" />
      </div>

      <div className="volcano-note" aria-hidden="true">
        <span>Turning Ideas</span>
        <strong>Into Reality</strong>
      </div>

      <div className="skill-eruption">
        {skills.map((skill, index) => (
          <SkillOrb name={skill} index={index} key={skill} />
        ))}
      </div>

      <div className="volcano-particles" aria-hidden="true">
        {particles.map(([x, y, delay, duration], index) => (
          <i
            key={`${x}-${y}`}
            style={{
              '--particle-x': `${x}%`,
              '--particle-y': `${y}%`,
              '--particle-delay': `${delay}s`,
              '--particle-duration': `${duration}s`,
              '--particle-size': `${2 + (index % 3)}px`,
            }}
          />
        ))}
      </div>
      <div className="volcano-rocks" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <i className={`volcano-rock rock-${index + 1}`} key={index} />
        ))}
      </div>
      <div className="build-mantra" aria-hidden="true">
        <span>BUILD</span>
        <span>LEARN</span>
        <span>IMPROVE</span>
        <strong>REPEAT</strong>
      </div>
    </motion.div>
  );
}
