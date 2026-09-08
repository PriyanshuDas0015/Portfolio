import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Code2,
  Image as ImageIcon,
  PanelsTopLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTear } from '../../components/PageTearTransition/PageTearTransition';
import TornDivider from '../../components/TornDivider/TornDivider';
import ProjectMark from '../../components/Projects/ProjectMark';
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

function ProjectArtwork({ project, eager = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="project-detail-artwork">
      {project.image && !failed ? (
        <img
          src={project.image}
          alt={`${project.title} project screenshot`}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="project-detail-placeholder"
          role="img"
          aria-label={`${project.title} project artwork placeholder`}
        >
          <ImageIcon />
          <strong>{project.title}</strong>
          <small>Project visual coming soon</small>
        </div>
      )}
      <ProjectMark project={project} className="project-detail-mark" />
    </div>
  );
}

export default function ProjectDetailPage({ slug }) {
  const { projects, loading } = usePortfolio();
  const { startTear, isTransitioning } = usePageTear();
  const decodedSlug = useMemo(() => decodeURIComponent(slug || ''), [slug]);
  const index = projects.findIndex((item) => projectSlug(item) === decodedSlug);
  const project = projects[index];
  const nextProject = index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

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
  const features = (project.features || []).slice(0, 4);
  const gallery = (project.gallery || []).map(galleryUrl).filter(Boolean);
  const metadata = [
    { label: 'Project Duration', value: project.duration || 'Independent build', Icon: Clock3 },
    { label: 'Project Type', value: project.projectType || project.category, Icon: PanelsTopLeft },
    {
      label: 'Completed',
      value: project.completionYear || 'Portfolio project',
      Icon: CalendarDays,
    },
  ];

  return (
    <motion.article
      className={`project-detail project-detail-${project.color || 'blue'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <section className="project-chapter-page">
        <div className="project-detail-glow" aria-hidden="true" />
        <div className="container project-detail-shell">
          <a
            className="project-back-link"
            href="/#projects"
            onClick={(event) => go(event, '/#projects')}
          >
            <ArrowLeft /> Back to Projects
          </a>
          <div className="project-title-line">
            <span className="project-chapter">PROJECT / {String(index + 1).padStart(2, '0')}</span>
            {project.featured && <span className="project-featured-badge">✦ Featured</span>}
          </div>
          <AccentTitle title={project.title} />
          <ProjectArtwork project={project} eager />

          <div className="project-description-row">
            <p>{description}</p>
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
          <div className="project-detail-meta-grid">
            {metadata.map(({ label, value, Icon }) => (
              <div key={label}>
                <Icon />
                <span>
                  {label}
                  <strong>{value}</strong>
                </span>
              </div>
            ))}
          </div>

          {features.length > 0 && (
            <section className="project-features-section" aria-labelledby="key-features">
              <h2 id="key-features">
                Key <span>Features</span>
              </h2>
              <div className="project-feature-grid">
                {features.map((feature, featureIndex) => (
                  <motion.div
                    className="project-feature-card"
                    key={feature}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: featureIndex * 0.05 }}
                  >
                    <Check />
                    <strong>{feature}</strong>
                    <small>{String(featureIndex + 1).padStart(2, '0')}</small>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="project-gallery-section" aria-label="Project gallery">
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
        </div>
      </section>

      <section
        className={`next-project-section ${nextProject ? '' : 'next-project-section--final'}`}
      >
        <TornDivider />
        <div className="next-project-lava" aria-hidden="true" />
        <div className="container next-project-content">
          {nextProject ? (
            <>
              <span className="project-chapter">NEXT PROJECT</span>
              <a
                className="next-project-card"
                href={`/projects/${projectSlug(nextProject)}`}
                onClick={(event) => go(event, `/projects/${projectSlug(nextProject)}`)}
                aria-disabled={isTransitioning || undefined}
              >
                {nextProject.image && <img src={nextProject.image} alt="" />}
                <span>
                  <small>Next Project</small>
                  <strong>{nextProject.title}</strong>
                </span>
                <ArrowRight />
              </a>
            </>
          ) : (
            <>
              <p className="final-project-note">
                That’s all for now…
                <br />
                More exciting projects
                <br />
                coming soon!
              </p>
              <a
                className="button project-code-button"
                href="/#projects"
                onClick={(event) => go(event, '/#projects')}
              >
                Back to Projects <ArrowLeft />
              </a>
            </>
          )}
        </div>
      </section>
    </motion.article>
  );
}
