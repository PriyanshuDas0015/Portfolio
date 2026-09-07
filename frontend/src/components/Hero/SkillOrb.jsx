import {
  Atom,
  Braces,
  CodeXml,
  Flame,
  GitBranch,
  Hexagon,
  Leaf,
  Palette,
  Terminal,
} from 'lucide-react';
import { motion } from 'framer-motion';

const visuals = {
  react: { Icon: Atom, className: 'brand-react', mark: '' },
  javascript: { Icon: Braces, className: 'brand-javascript', mark: 'JS' },
  'node.js': { Icon: Hexagon, className: 'brand-node', mark: 'N' },
  firebase: { Icon: Flame, className: 'brand-firebase', mark: '' },
  mongodb: { Icon: Leaf, className: 'brand-mongodb', mark: '' },
  git: { Icon: GitBranch, className: 'brand-git', mark: '' },
  html5: { Icon: CodeXml, className: 'brand-html', mark: '5' },
  css3: { Icon: Palette, className: 'brand-css', mark: '3' },
  python: { Icon: Terminal, className: 'brand-python', mark: 'Py' },
};

export default function SkillOrb({ name, index }) {
  const visual = visuals[name.toLowerCase()] || {
    Icon: CodeXml,
    className: 'brand-default',
    mark: '',
  };
  const Icon = visual.Icon;
  return (
    <motion.div
      className={`skill-orb skill-orb-${index + 1} ${visual.className}`}
      initial={{ opacity: 0, y: 95, scale: 0.55 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.72 + index * 0.1, duration: 0.72, ease: 'easeOut' }}
      role="img"
      aria-label={`${name} skill`}
    >
      <span className="skill-trail" aria-hidden="true" />
      <span className="skill-orb-shell">
        <span className="skill-brand-icon">
          <Icon />
          {visual.mark && <b>{visual.mark}</b>}
        </span>
        <strong>{name}</strong>
      </span>
    </motion.div>
  );
}
