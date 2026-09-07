import { useState } from 'react';
import { ArrowUpRight, Github, ChevronDown } from 'lucide-react';
import Reveal from '../Shared/Reveal';
import { mouseGlow } from '../../utils/mouseGlow';
function ProjectLink({ url, children, icon: Icon }) {
  return url ? (
    <a className="project-link" href={url} target="_blank" rel="noopener noreferrer">
      {children}
      <Icon size={15} />
    </a>
  ) : (
    <span className="project-link unavailable" title="Awaiting verified project URL">
      {children}
      <Icon size={14} />
      <span className="sr-only"> — link coming soon</span>
    </span>
  );
}
export default function ProjectCard({ project, index }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <Reveal delay={index * 0.04}>
      <article
        className={`project-card glass card-hover project-${project.color}`}
        onPointerMove={mouseGlow}
      >
        <div className="project-cover">
          {project.image && !imageFailed ? (
            <img
              src={project.image}
              alt={`${project.title} project screenshot`}
              loading="lazy"
              width="600"
              height="320"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div
              className="project-abstract"
              aria-label={`${project.title} abstract project artwork`}
              role="img"
            >
              <div className="project-orbits" />
              <span className="project-glyph">{project.glyph}</span>
              <span className="project-cover-caption">{project.subtitle}</span>
              <span className="artwork-label">CONCEPT ARTWORK</span>
            </div>
          )}
          <span className="project-number">PROJECT / {project.number}</span>
          {project.featured && <span className="featured-pill">✦ Featured</span>}
        </div>
        <div className="project-body">
          <div className="project-title-row">
            <h3>{project.title}</h3>
            <span className="project-role">{project.role}</span>
          </div>
          <p>{project.description}</p>
          <div className="project-tags">
            {project.technologies.map((tech) => (
              <span className="pill" key={tech}>
                {tech}
              </span>
            ))}
          </div>
          <details className="project-details">
            <summary>
              Explore project features <ChevronDown size={14} />
            </summary>
            <ul>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </details>
          <div className="project-links">
            <ProjectLink url={project.liveUrl} icon={ArrowUpRight}>
              Live Demo
            </ProjectLink>
            <ProjectLink url={project.githubUrl} icon={Github}>
              GitHub
            </ProjectLink>
            {!project.liveUrl && !project.githubUrl && (
              <span className="links-pending">Links coming soon</span>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
