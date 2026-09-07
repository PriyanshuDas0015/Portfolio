import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SocialLinks from '../Shared/SocialLinks';
import { usePageTear } from '../PageTearTransition/PageTearTransition';
import { navigateTo } from '../../utils/navigation';

const reveal = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function HeroContent({ hero, firstName, lastName }) {
  const { startTear, isTransitioning } = usePageTear();
  const primaryTarget = hero.primaryTarget || '#projects';
  const openProjects = (event) => {
    if (primaryTarget !== '#projects') return;
    event.preventDefault();
    startTear(() => navigateTo('/#projects'));
  };
  return (
    <div className="hero-copy">
      <motion.div {...reveal} transition={{ duration: 0.45 }} className="hero-intro-row">
        <span className="hero-label">{hero.smallLabel || '// FRONTEND DEVELOPER'}</span>
        {hero.availabilityOn && (
          <span className="hero-availability">
            <i /> {hero.availabilityText}
          </span>
        )}
      </motion.div>

      <motion.h2 {...reveal} transition={{ delay: 0.12, duration: 0.5 }} className="hero-kicker">
        Crafting <span>Digital Worlds</span>
      </motion.h2>

      <motion.h1
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.22, duration: 0.62 }}
        className="hero-name"
      >
        <span className="hero-full-name">{hero.name}</span>
        <span className="hero-first-name" aria-hidden="true">
          {firstName}
          <i className="signature-crown" />
        </span>
        <span className="hero-last-name" aria-hidden="true">
          {lastName.toUpperCase()}
          <b>.</b>
        </span>
      </motion.h1>

      <motion.p {...reveal} transition={{ delay: 0.36, duration: 0.5 }} className="hero-lead">
        {hero.headline}
      </motion.p>
      <motion.p
        {...reveal}
        transition={{ delay: 0.44, duration: 0.5 }}
        className="hero-description"
      >
        {hero.longDescription}
      </motion.p>

      <motion.div {...reveal} transition={{ delay: 0.55, duration: 0.5 }} className="hero-actions">
        <a
          href={primaryTarget}
          className="button button-primary"
          onClick={openProjects}
          aria-disabled={isTransitioning || undefined}
        >
          {hero.primaryCta} <ArrowRight />
        </a>
        <a href={hero.secondaryTarget || '#contact'} className="button hero-secondary-button">
          {hero.secondaryCta} <ArrowRight />
        </a>
      </motion.div>

      <motion.div {...reveal} transition={{ delay: 0.65, duration: 0.5 }} className="hero-social">
        <SocialLinks />
        <span className="social-separator" />
        <span>Let&apos;s connect</span>
      </motion.div>
    </div>
  );
}
