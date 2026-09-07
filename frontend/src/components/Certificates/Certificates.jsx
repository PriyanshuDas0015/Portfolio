import { Award, ArrowUpRight, FileText } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import Reveal from '../Shared/Reveal';
import './Certificates.css';

export default function Certificates() {
  const { certificates } = usePortfolio();
  return (
    <section id="certificates" className="section section-divider">
      <div className="container">
        <Reveal className="section-header">
          <div>
            <div className="eyebrow">06. Certificates</div>
            <h2>
              Credentials and learning<span className="gradient-text">.</span>
            </h2>
          </div>
          <p>Verified coursework, certifications and milestones.</p>
        </Reveal>
        {certificates.length ? (
          <div className="certificate-grid">
            {certificates.map((item, index) => (
              <Reveal delay={index * 0.04} key={item._id}>
                <article className="certificate-card glass card-hover">
                  <div className="certificate-cover">
                    {item.imageUrl ? (
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${item.title} certificate image`}
                      >
                        <img src={item.imageUrl} alt={`${item.title} certificate`} loading="lazy" />
                      </a>
                    ) : (
                      <Award />
                    )}
                    {item.featured && <span>Featured</span>}
                  </div>
                  <div className="certificate-body">
                    <small>{item.issueDate || 'CERTIFICATE'}</small>
                    <h3>{item.title}</h3>
                    <p>{item.issuer}</p>
                    {item.description && (
                      <p className="certificate-description">{item.description}</p>
                    )}
                    <div className="project-tags">
                      {(item.skills || []).map((skill) => (
                        <span className="pill" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="project-links">
                      {item.credentialUrl && (
                        <a
                          className="project-link"
                          href={item.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Verify <ArrowUpRight size={15} />
                        </a>
                      )}
                      {item.pdfUrl && (
                        <a
                          className="project-link"
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View PDF <FileText size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="certificate-empty glass">
            <Award />
            <h3>Certificates coming soon.</h3>
            <p>New credentials will appear here after they are published.</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
