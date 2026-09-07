import { ExternalLink, Download, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import Reveal from '../Shared/Reveal';
import ResumePreview from './ResumePreview';
import './MyResume.css';
export default function MyResume() {
  const { resume } = usePortfolio();
  return (
    <section id="resume" className="section section-divider resume-section">
      <div className="container">
        <Reveal className="section-header">
          <div>
            <div className="eyebrow">07. My Resume</div>
            <h2>
              Want the complete picture?
              <br />
              <span className="gradient-text">Here's my resume.</span>
            </h2>
          </div>
          <p>Explore my skills, projects, education and technical background in one place.</p>
        </Reveal>
        <motion.div
          className="resume-card glass"
          initial={{ opacity: 0, y: 45, rotateX: 5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="resume-info">
            <span className="resume-badge">
              <FileText /> PROFESSIONAL PROFILE
            </span>
            <h3>Priyanshu Das</h3>
            <p>
              Frontend Developer <span>·</span> Computer Science Undergraduate
            </p>
            <ul>
              <li>
                <CheckCircle2 />
                Skills and technical toolkit
              </li>
              <li>
                <CheckCircle2 />
                Selected development projects
              </li>
              <li>
                <CheckCircle2 />
                Education and technical background
              </li>
            </ul>
            {resume ? (
              <div className="resume-actions">
                <a
                  className="button button-primary"
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume <ExternalLink />
                </a>
                <a className="button" href={resume.downloadUrl} download={resume.fileName}>
                  Download Resume <Download />
                </a>
              </div>
            ) : (
              <div className="resume-pending" role="status">
                <FileText />
                <span>
                  <strong>Resume upload pending</strong>The resume file was not included with the
                  supplied task. Upload it from the admin dashboard to activate both actions.
                </span>
              </div>
            )}
          </div>
          <ResumePreview resume={resume} />
        </motion.div>
      </div>
    </section>
  );
}
