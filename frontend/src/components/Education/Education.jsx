import { GraduationCap, MapPin, CalendarDays } from 'lucide-react';
import Reveal from '../Shared/Reveal';
import './Education.css';
import { usePortfolio } from '../../context/PortfolioContext';
export default function Education() {
  const { education } = usePortfolio();
  const items = Array.isArray(education) ? education : [education];
  return (
    <section id="education" className="section section-divider">
      <div className="container">
        <Reveal className="section-header">
          <div>
            <div className="eyebrow">05. Education</div>
            <h2>
              Academic background<span className="gradient-text">.</span>
            </h2>
          </div>
        </Reveal>
        {items.map((education) => (
          <Reveal
            className="education-card glass"
            key={education._id || `${education.institution}-${education.degree}`}
          >
            <div className="education-icon">
              {education.logoUrl ? (
                <img src={education.logoUrl} alt={`${education.institution} logo`} loading="lazy" />
              ) : (
                <GraduationCap size={30} />
              )}
            </div>
            <div className="education-main">
              <span className="education-kicker">{education.degree}</span>
              <h3>{education.field}</h3>
              <p>{education.institution}</p>
              <div className="education-meta">
                <span>
                  <MapPin size={14} /> {education.location}
                </span>
                <span>
                  <CalendarDays size={14} /> Expected {education.expectedGraduation}
                </span>
                {education.grade && <span>Grade / CGPA: {education.grade}</span>}
              </div>
              <div className="coursework">
                <span>RELEVANT COURSEWORK</span>
                <div>
                  {(education.coursework || []).map((course) => (
                    <span className="pill" key={course}>
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <span className="education-status">
              <i /> Pursuing
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
