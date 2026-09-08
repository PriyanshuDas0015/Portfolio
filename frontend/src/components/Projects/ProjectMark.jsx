import { BookOpen, Building2, House, Mic2 } from 'lucide-react';

const iconFor = {
  'your-home': House,
  'gen-villa': Building2,
  'zara-vice-assistant': Mic2,
  'engineering-vault': BookOpen,
};

export default function ProjectMark({ project, className = '' }) {
  const slug = project.slug || project.id;
  if (project.logo) {
    return <img className={className} src={project.logo} alt={`${project.title} logo`} />;
  }
  if (slug === 'netflix-clone') {
    return (
      <span
        className={`${className} project-mark project-mark--netflix`}
        aria-label="Netflix Clone logo"
      >
        N
      </span>
    );
  }
  const Icon = iconFor[slug] || House;
  return (
    <span
      className={`${className} project-mark project-mark--${slug}`}
      aria-label={`${project.title} logo`}
    >
      <Icon />
    </span>
  );
}
