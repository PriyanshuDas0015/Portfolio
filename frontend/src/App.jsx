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

export default function App() {
  usePointerEffects();
  return (
    <MotionConfig reducedMotion="user">
      <SiteMetadata />
      <BackgroundEffects />
      <CustomCursor />
      <ScrollProgress />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <LearningJourney />
        <Education />
        <Services />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </MotionConfig>
  );
}
