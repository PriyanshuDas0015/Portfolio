import { GraduationCap, MapPin, CalendarDays } from 'lucide-react';
import Reveal from '../Shared/Reveal';
import './Education.css';
export default function Education() {
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
        <Reveal className="education-card glass">
          <div className="education-icon">
            <GraduationCap size={30} />
          </div>
          <div className="education-main">
            <span className="education-kicker">BACHELOR OF TECHNOLOGY</span>
            <h3>Computer Science and Engineering</h3>
            <p>SRM University</p>
            <div className="education-meta">
              <span>
                <MapPin size={14} /> Sonipat, Haryana
              </span>
              <span>
                <CalendarDays size={14} /> Expected August 2027
              </span>
            </div>
            <div className="coursework">
              <span>RELEVANT COURSEWORK</span>
              <div>
                {[
                  'Data Structures and Algorithms',
                  'Object-Oriented Programming',
                  'Database Management Systems',
                  'Operating Systems',
                ].map((course) => (
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
      </div>
    </section>
  );
}
