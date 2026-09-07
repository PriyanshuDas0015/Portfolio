import { Focus, Lightbulb, Hammer, ArrowUpRight, Download, Code2 } from 'lucide-react';
import Reveal from '../Shared/Reveal';
import { usePortfolio } from '../../context/PortfolioContext';
import './About.css';
export default function About() {
  const { settings, resume } = usePortfolio();
  const { about } = settings;
  const icons = { focus: Focus, lightbulb: Lightbulb, hammer: Hammer, arrow: ArrowUpRight };
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal className="about-grid">
          <div className={`about-art glass ${settings.profile?.imageUrl ? 'has-photo' : ''}`}>
            {settings.profile?.imageUrl ? (
              <img
                className="about-profile-image"
                src={settings.profile.imageUrl}
                alt={`${settings.hero?.name || 'Profile'} portrait`}
              />
            ) : (
              <>
                <div className="about-art-grid" />
                <div className="about-art-orbit orbit-a" />
                <div className="about-art-orbit orbit-b" />
                <div className="about-symbol">
                  <Code2 size={46} />
                </div>
              </>
            )}
            <span className="art-coordinate">01 / THE PERSON BEHIND THE CODE</span>
            {!settings.profile?.imageUrl && (
              <>
                <span className="art-tag">Curiosity meets creativity.</span>
                <span className="art-point" />
              </>
            )}
          </div>
          <div className="about-copy">
            <div className="eyebrow">{about.sectionLabel || '01. About Me'}</div>
            <h2>
              {about.heading.replace(/\.+$/, '')}
              <span className="gradient-text">.</span>
            </h2>
            <p>{about.description}</p>
            {about.description2 && <p>{about.description2}</p>}
            <div className="about-traits">
              {[...about.features]
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map(({ icon, title, subtitle }) => {
                  const Icon = icons[icon] || Focus;
                  return (
                    <div key={title}>
                      <Icon size={17} />
                      <span>
                        <strong>{title}</strong>
                        <small>{subtitle}</small>
                      </span>
                    </div>
                  );
                })}
            </div>
            {resume ? (
              <a href={resume.downloadUrl} className="text-link" download={resume.fileName}>
                Download Resume <Download size={15} />
              </a>
            ) : (
              <span className="resume-unavailable">
                <Download size={15} /> Resume coming soon
              </span>
            )}
          </div>
        </Reveal>
        <Reveal>
          <blockquote className="about-quote">
            <span>“</span>
            {about.quote}
            <span>”</span>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
