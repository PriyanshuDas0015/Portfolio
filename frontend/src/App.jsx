import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import BackgroundEffects from './components/BackgroundEffects/BackgroundEffects';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import LearningJourney from './components/LearningJourney/LearningJourney';
import Education from './components/Education/Education';
import Services from './components/Services/Services';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import CustomCursor from './components/CustomCursor/CustomCursor';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import SiteMetadata from './components/Shared/SiteMetadata';
import usePointerEffects from './hooks/usePointerEffects';
import { PortfolioProvider } from './context/PortfolioContext';
import MyResume from './components/MyResume/MyResume';
import Certificates from './components/Certificates/Certificates';
import { usePortfolio } from './context/PortfolioContext';
import ProjectDetailPage from './pages/ProjectDetailPage/ProjectDetailPage';
import { PageTearProvider } from './components/PageTearTransition/PageTearTransition';
import { navigationEvent } from './utils/navigation';
import GlobalLava from './components/GlobalLava/GlobalLava';

const sections = {
  about: About,
  skills: Skills,
  projects: Projects,
  experience: LearningJourney,
  education: Education,
  certificates: Certificates,
  services: Services,
  resume: MyResume,
  contact: Contact,
};
function PortfolioPage() {
  const { settings } = usePortfolio();
  const configured = settings.sections?.length
    ? settings.sections
    : Object.keys(sections).map((key, index) => ({ key, visible: true, displayOrder: index }));
  return (
    <>
      <Hero />
      {configured
        .filter((item) => item.visible && sections[item.key])
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((item) => {
          const Section = sections[item.key];
          return <Section key={item.key} />;
        })}
    </>
  );
}

function RoutedExperience() {
  const { settings } = usePortfolio();
  const [locationPath, setLocationPath] = useState(
    `${window.location.pathname}${window.location.hash}`,
  );
  const pathname = locationPath.split('#')[0];
  const match = pathname.match(/^\/projects\/([^/]+)\/?$/);
  const projectMode = Boolean(match);

  useEffect(() => {
    const update = () => setLocationPath(`${window.location.pathname}${window.location.hash}`);
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    window.addEventListener(navigationEvent, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('hashchange', update);
      window.removeEventListener(navigationEvent, update);
    };
  }, []);

  useEffect(() => {
    if (projectMode) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    document.getElementById(id)?.scrollIntoView({ behavior: 'auto' });
    const frame = requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });
    return () => {
      cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
    };
  }, [locationPath, projectMode]);

  return (
    <>
      <SiteMetadata />
      <BackgroundEffects />
      <CustomCursor />
      <ScrollProgress />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {settings.announcement?.enabled && (
        <div className="announcement-bar">
          {settings.announcement.link ? (
            <a href={settings.announcement.link}>{settings.announcement.text}</a>
          ) : (
            settings.announcement.text
          )}
        </div>
      )}
      <Navbar projectMode={projectMode} />
      <main id="main">
        <GlobalLava projectSlug={match?.[1] || ''} />
        {projectMode ? <ProjectDetailPage slug={match[1]} /> : <PortfolioPage />}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default function App() {
  usePointerEffects();
  return (
    <MotionConfig reducedMotion="user">
      <PortfolioProvider>
        <PageTearProvider>
          <RoutedExperience />
        </PageTearProvider>
      </PortfolioProvider>
    </MotionConfig>
  );
}
