import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { mouseGlow } from '../../utils/mouseGlow';
import { usePageTear } from '../PageTearTransition/PageTearTransition';
import { navigateTo } from '../../utils/navigation';
import ProjectMark from './ProjectMark';

export default function ProjectCard({ project, index }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { startTear, isTransitioning } = usePageTear();
  const slug = project.slug || project.id;
  const url = `/projects/${slug}`;

  const openProject = (event) => {
    event.preventDefault();
    startTear(() => navigateTo(url));
  };

  return (
    <article
      className={`project-card project-${project.color || 'blue'}`}
      onPointerMove={mouseGlow}
      style={{ '--project-index': index }}
    >
      <a
        className="project-card-link"
        href={url}
        onClick={openProject}
        aria-disabled={isTransitioning || undefined}
      >
        <div className="project-cover">
          {project.image && !imageFailed ? (
            <>
              <img
                src={project.image}
                alt={`${project.title} project screenshot`}
                loading="lazy"
                width="700"
                height="420"
                onError={() => setImageFailed(true)}
              />
              <ProjectMark project={project} className="project-cover-mark" />
            </>
          ) : (
            <div
              className="project-abstract"
              aria-label={`${project.title} abstract project artwork`}
              role="img"
            >
              <div className="project-orbits" />
              <ProjectMark
                project={project}
                className={`project-glyph identity-${project.color || 'blue'}`}
              />
              <span className="project-cover-caption">{project.subtitle}</span>
            </div>
          )}
          <span className="project-number">
            PROJECT / {project.number || String(index + 1).padStart(2, '0')}
          </span>
          {project.featured && <span className="featured-pill">✦ Featured</span>}
        </div>
        <div className="project-body">
          <div className="project-title-row">
            <h3>{project.title}</h3>
            <span className="project-card-arrow" aria-hidden="true">
              <ArrowRight />
            </span>
          </div>
          <p>{project.description}</p>
          <div className="project-tags">
            {(project.technologies || []).slice(0, 4).map((tech) => (
              <span className="pill" key={tech}>
                {tech}
              </span>
            ))}
          </div>
          <span className="project-read-more">
            Open project chapter <ArrowRight />
          </span>
        </div>
      </a>
    </article>
  );
}
