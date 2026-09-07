import SocialLinks from '../Shared/SocialLinks';
import './Footer.css';
import { usePortfolio } from '../../context/PortfolioContext';
export default function Footer() {
  const { settings } = usePortfolio();
  const identity = settings.identity || {};
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="logo" href="#home" aria-label="Back to home">
              {identity.logoText || 'PD'}
              <span>.</span>
            </a>
            <div>
              <strong>Priyanshu Das</strong>
              <p>Frontend Developer · Computer Science Undergraduate</p>
            </div>
          </div>
          <nav aria-label="Footer navigation">
            {['Home', 'About', 'Projects', 'Contact'].map((label) => (
              <a key={label} href={`#${label.toLowerCase()}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="footer-social">
            <span>FOLLOW ME</span>
            <SocialLinks />
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {identity.copyrightYear || new Date().getFullYear()} Priyanshu Das. All rights
            reserved.
          </span>
          <span>{identity.footerText || 'Code • Create • Build • Grow'}</span>
        </div>
      </div>
    </footer>
  );
}
