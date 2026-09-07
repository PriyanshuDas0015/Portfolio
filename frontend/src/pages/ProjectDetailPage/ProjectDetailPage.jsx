import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Image as ImageIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTear } from '../../components/PageTearTransition/PageTearTransition';
import TornDivider from '../../components/TornDivider/TornDivider';
import { navigateTo } from '../../utils/navigation';
import './ProjectDetailPage.css';

const projectSlug = (project) => project.slug || project.id;
const galleryUrl = (asset) => (typeof asset === 'string' ? asset : asset?.url);

function AccentTitle({ title }) {
  const words = title.trim().split(/\s+/);
  const accent = words.pop();
  return (
    <h1>
      {words.length ? `${words.join(' ')} ` : ''}
      <span>{accent}</span>
    </h1>
  );
}

function ProjectArtwork({ project, eager = false, className = '' }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`project-detail-artwork ${className}`}>
      {project.image && !failed ? (
        <img
          src={project.image}
          alt={`${project.title} project screenshot`}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={`project-detail-placeholder project-${project.color || 'blue'}`}
          role="img"
          aria-label={`${project.title} project artwork placeholder`}
        >
          <span>
            <ImageIcon />
          </span>
          <strong>{project.title}</strong>
          <small>Project visual coming soon</small>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage({ slug }) {
  const { projects, loading } = usePortfolio();
  const { startTear, isTransitioning } = usePageTear();
  const decodedSlug = useMemo(() => decodeURIComponent(slug || ''), [slug]);
  const index = projects.findIndex((item) => projectSlug(item) === decodedSlug);
  const project = projects[index];
  const nextProject = projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [decodedSlug]);

  const go = (event, path) => {
    event.preventDefault();
    startTear(() => navigateTo(path));
  };

  if (!project && loading) {
    return (
      <section
        className="project-detail project-detail-loading"
        aria-busy="true"
        aria-label="Loading project"
      >
        <div className="container project-skeleton">
          <i />
          <i />
          <i />
          <i />
          <span className="sr-only">Loading project…</span>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="project-detail project-not-found">
        <div className="container">
          <span className="project-chapter">PROJECT ARCHIVE</span>
          <h1>
            Project <span>not found.</span>
          </h1>
          <p>The requested chapter is not available or is no longer published.</p>
          <a
            className="button button-primary"
            href="/#projects"
            onClick={(event) => go(event, '/#projects')}
          >
            <ArrowLeft /> Back to Projects
          </a>
        </div>
      </section>
    );
  }

  const description = project.fullDescription || project.subtitle || project.description;
  const features = (project.features || []).slice(0, 6);
  const gallery = (project.gallery || []).map(galleryUrl).filter(Boolean);

  return (
    <motion.article
      className={`project-detail project-detail-${project.color || 'blue'}`}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <header className="project-detail-hero">
        <div className="project-detail-glow" aria-hidden="true" />
        <div className="container">
          <a
            className="project-back-link"
            href="/#projects"
            onClick={(event) => go(event, '/#projects')}
          >
            <ArrowLeft /> Back to Projects
          </a>
          <div className="project-detail-heading">
            <div>
              <span className="project-chapter">
                PROJECT / {String(index + 1).padStart(2, '0')}
              </span>
              <AccentTitle title={project.title} />
              <p className="project-detail-subtitle">{project.subtitle || project.description}</p>
            </div>
            <div className="project-detail-meta">
              <span>Role</span>
              <strong>{project.role || 'Developer'}</strong>
              {project.featured && <b>✦ Featured chapter</b>}
            </div>
          </div>
          <div className="project-detail-tags">
            {(project.technologies || []).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
          <div className="project-detail-actions">
            {project.liveUrl && (
              <a
                className="button button-primary"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo <ArrowUpRight />
              </a>
            )}
            {project.githubUrl && (
              <a
                className="button project-code-button"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Code <Code2 />
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="project-detail-visual container" aria-label="Project preview">
        <span className="project-margin-note">
          A project is a chapter
          <br />
          in the learning journey.
        </span>
        <ProjectArtwork project={project} eager />
      </section>

      <section className="project-story">
        <TornDivider />
        <div className="container project-story-grid">
          <div>
            <span className="project-chapter">THE STORY</span>
            <h2>
              Built with purpose<span className="gradient-text">.</span>
            </h2>
          </div>
          <p>{description}</p>
        </div>
      </section>

      {features.length > 0 && (
        <section className="project-features-section container">
          <div className="project-section-heading">
            <span className="project-chapter">CORE DETAILS</span>
            <h2>
              What it includes<span className="gradient-text">.</span>
            </h2>
          </div>
          <div className="project-feature-grid">
            {features.map((feature, featureIndex) => (
              <motion.div
                className="project-feature-card"
                key={feature}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: featureIndex * 0.06 }}
              >
                <span>
                  <Check />
                </span>
                <strong>{feature}</strong>
                <small>{String(featureIndex + 1).padStart(2, '0')}</small>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="project-gallery-section container">
          <div className="project-section-heading">
            <span className="project-chapter">GALLERY</span>
            <h2>
              More of the build<span className="gradient-text">.</span>
            </h2>
          </div>
          <div className="project-detail-gallery">
            {gallery.map((url, galleryIndex) => (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                key={`${url}-${galleryIndex}`}
              >
                <img
                  src={url}
                  alt={`${project.title} gallery view ${galleryIndex + 1}`}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      {nextProject && (
        <section className="next-project-section">
          <TornDivider />
          <div className="container">
            <span className="project-chapter">NEXT PROJECT</span>
            <a
              className="next-project-link"
              href={`/projects/${projectSlug(nextProject)}`}
              onClick={(event) => go(event, `/projects/${projectSlug(nextProject)}`)}
              aria-disabled={isTransitioning || undefined}
            >
              <span>{nextProject.title}</span>
              <ArrowRight />
            </a>
            <p>Turn the page to the next chapter.</p>
          </div>
        </section>
      )}
    </motion.article>
  );
}
