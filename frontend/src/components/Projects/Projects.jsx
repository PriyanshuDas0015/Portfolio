import { ArrowUpRight, Github } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import TornDivider from '../TornDivider/TornDivider';
import ProjectCard from './ProjectCard';
import './Projects.css';

export default function Projects() {
  const { projects, settings } = usePortfolio();
  const featured = projects.filter((project) => project.featured);
  const visible = featured.length ? featured : projects;

  return (
    <section id="projects" className="section projects-section">
      <TornDivider />
      <div className="projects-paper-grain" aria-hidden="true" />
      <div className="container">
        <div className="section-header projects-heading">
          <div>
            <div className="eyebrow">03. Selected Work</div>
            <h2>
              Featured <span className="gradient-text">Projects.</span>
            </h2>
            <p>Each project is a unique chapter in my journey.</p>
          </div>
          {settings.socialLinks.github && (
            <a
              href={settings.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              <Github size={16} /> More on GitHub <ArrowUpRight size={16} />
            </a>
          )}
        </div>

        <p className="sr-only" role="status">
          Showing {visible.length} featured projects
        </p>
        <div className="projects-grid">
          {visible.map((project, index) => (
            <ProjectCard key={project.slug || project.id} project={project} index={index} />
          ))}
          <article className="projects-coming-soon" aria-label="More projects coming soon">
            <span className="projects-coming-plus" aria-hidden="true">
              +
            </span>
            <p>
              More Projects
              <br />
              Coming Soon…
            </p>
          </article>
        </div>
        <p className="projects-margin-note">
          More than projects,
          <br />
          these are chapters of my journey.
        </p>
      </div>
    </section>
  );
}
