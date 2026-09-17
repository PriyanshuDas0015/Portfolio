import { useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import HeroContent from './HeroContent';
import HeroStats from './HeroStats';
import ScrollIndicator from './ScrollIndicator';
import VolcanoScene from './VolcanoScene';
import './Hero.css';

const preferredSkills = ['React', 'JavaScript', 'Node.js', 'Firebase', 'MongoDB', 'Git'];

const getSkillNames = (groups = []) => {
  const names = groups.flatMap((group) =>
    (group.items || []).map((item) => (typeof item === 'string' ? item : item.name)),
  );
  const uniqueNames = [...new Set(names.filter(Boolean))];
  return [
    ...preferredSkills.filter((name) => uniqueNames.includes(name)),
    ...uniqueNames.filter((name) => !preferredSkills.includes(name)),
  ].slice(0, 6);
};

const splitName = (name = 'Priyanshu Das') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { firstName: parts[0] || 'Priyanshu', lastName: '' };
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts.at(-1) };
};

export default function Hero() {
  const { settings, skills, projects, education } = usePortfolio();
  const hero = settings.hero;
  const name = splitName(hero.name);
  const root = useRef(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => element.classList.toggle('hero-motion-active', entry.isIntersecting),
      { rootMargin: '100px 0px', threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={root} id="home" className="hero">
      <div className="hero-cosmos" aria-hidden="true">
        <div className="hero-stars hero-stars-far" />
        <div className="hero-stars hero-stars-near" />
        <div className="hero-horizon" />
      </div>
      <div className="hero-left-shade" aria-hidden="true" />
      <div className="container hero-stage">
        <HeroContent hero={hero} {...name} />
        <VolcanoScene skills={getSkillNames(skills)} />
      </div>
      <div className="container hero-footer">
        <HeroStats
          projectCount={projects.length}
          education={education}
          availability={hero.availabilityText}
        />
        <ScrollIndicator />
      </div>
    </section>
  );
}
