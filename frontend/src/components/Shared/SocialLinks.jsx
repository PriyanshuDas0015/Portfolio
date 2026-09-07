import {
  Github,
  Linkedin,
  Mail,
  Link2,
  Instagram,
  Youtube,
  Twitter,
  Code2,
  Globe2,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
export default function SocialLinks() {
  const { settings } = usePortfolio();
  const site = settings.socialLinks;
  const iconMap = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    x: Twitter,
    code: Code2,
    globe: Globe2,
    link: Link2,
  };
  const other = (site.other || [])
    .filter((item) => item.visible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .map((item) => [
      iconMap[String(item.icon || item.platform).toLowerCase()] || Link2,
      item.label || item.platform,
      item.url,
    ]);
  return (
    <div className="social-links">
      {[
        [Github, 'GitHub', site.github],
        [Linkedin, 'LinkedIn', site.linkedin],
        [Mail, 'Email', site.email ? `mailto:${site.email}` : ''],
        ...other,
      ].map(([Icon, label, url]) =>
        url ? (
          <a
            className="icon-button"
            key={label}
            href={url}
            aria-label={label}
            target={label === 'Email' ? undefined : '_blank'}
            rel="noopener noreferrer"
          >
            <Icon />
          </a>
        ) : (
          <button
            className="icon-button"
            key={label}
            disabled
            aria-label={`${label} unavailable`}
            title={`${label} not yet provided`}
          >
            <Icon />
          </button>
        ),
      )}
    </div>
  );
}
