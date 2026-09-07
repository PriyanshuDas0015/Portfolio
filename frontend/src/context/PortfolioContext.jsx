import { createContext, useContext, useEffect, useState } from 'react';
import { defaults } from '../data/defaultContent';
const PortfolioContext = createContext(defaults);
const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const fetchJson = async (path) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${base}${path}`, { signal: controller.signal });
    if (!response.ok) throw new Error('Content unavailable');
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
};
const mapProject = (item, index) => ({
  id: item.slug || item._id,
  slug: item.slug || item._id,
  title: item.title,
  category: item.category || 'Projects',
  role: item.role || 'Developer',
  number: String(index + 1).padStart(2, '0'),
  color: item.color || 'blue',
  subtitle: item.fullDescription || item.shortDescription,
  description: item.shortDescription,
  fullDescription: item.fullDescription || '',
  technologies: item.technologies || [],
  features: item.features || [],
  githubUrl: item.githubUrl || '',
  liveUrl: item.liveUrl || '',
  image: item.imageUrl || '',
  logo: item.logoUrl || '',
  featured: item.featured,
  gallery: item.gallery || [],
  demoVideoUrl: item.demoVideoUrl || '',
});
export function PortfolioProvider({ children }) {
  const [content, setContent] = useState({ ...defaults, source: 'default', loading: true });
  useEffect(() => {
    let active = true;
    Promise.all([
      fetchJson('/api/public/site'),
      fetchJson('/api/public/projects'),
      fetchJson('/api/public/skills'),
      fetchJson('/api/public/timeline'),
      fetchJson('/api/public/education'),
      fetchJson('/api/public/services'),
      fetchJson('/api/public/resume'),
      fetchJson('/api/public/certificates'),
    ])
      .then(([site, projects, skills, timeline, education, services, resume, certificates]) => {
        if (active)
          setContent({
            settings: site.settings || defaults.settings,
            projects: Array.isArray(projects.projects)
              ? projects.projects.map(mapProject)
              : defaults.projects,
            skills: Array.isArray(skills.categories)
              ? skills.categories.map((c) => ({
                  title: c.name,
                  icon: c.icon,
                  color: c.color,
                  items: c.items.map((item) => ({
                    name: item.name,
                    proficiency: item.proficiency,
                  })),
                }))
              : defaults.skills,
            journey: Array.isArray(timeline.timeline)
              ? timeline.timeline.map((item) => ({
                  ...item,
                  title: item.position || item.title,
                  label: item.company || item.subtitle,
                }))
              : defaults.journey,
            education: Array.isArray(education.education)
              ? education.education
              : defaults.education,
            services: Array.isArray(services.services) ? services.services : defaults.services,
            certificates: Array.isArray(certificates.certificates) ? certificates.certificates : [],
            resume: resume.resume
              ? { ...resume.resume, downloadUrl: `${base}/api/public/resume/download` }
              : null,
            source: 'api',
            loading: false,
          });
      })
      .catch(() => {
        if (active) setContent((current) => ({ ...current, loading: false }));
      });
    return () => {
      active = false;
    };
  }, []);
  return <PortfolioContext.Provider value={content}>{children}</PortfolioContext.Provider>;
}
export const usePortfolio = () => useContext(PortfolioContext);
