import { useState } from 'react';
import { Github, ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { site } from '../../data/socialLinks';
import Reveal from '../Shared/Reveal';
import ProjectCard from './ProjectCard';
import './Projects.css';
const filters = ['All Projects', 'Frontend', 'API Projects', 'Full Stack'];
export default function Projects() {
  const [filter, setFilter] = useState('All Projects');
  const visible = projects.filter(
    (project) => filter === 'All Projects' || project.category === filter,
  );
  return (
    <section id="projects" className="section section-divider">
      <div className="container">
        <Reveal className="section-header">
          <div>
            <div className="eyebrow">03. Projects</div>
            <h2>
              Some things I've built<span className="gradient-text">.</span>
            </h2>
          </div>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-link">
            <Github size={16} /> More on GitHub <ArrowUpRight size={16} />
          </a>
        </Reveal>
        <div className="project-filters" role="group" aria-label="Filter projects">
          {filters.map((item) => (
            <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>
              {item}
              {item === 'All Projects' && <span>04</span>}
            </button>
          ))}
        </div>
        <p className="sr-only" role="status">
          Showing {visible.length} projects
        </p>
        <div className="projects-grid">
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
