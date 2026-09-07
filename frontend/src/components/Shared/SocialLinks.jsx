import { Github, Linkedin, Mail } from 'lucide-react';
import { site } from '../../data/socialLinks';
export default function SocialLinks() {
  return (
    <div className="social-links">
      {[
        [Github, 'GitHub', site.github],
        [Linkedin, 'LinkedIn', site.linkedin],
        [Mail, 'Email', site.email ? `mailto:${site.email}` : ''],
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
