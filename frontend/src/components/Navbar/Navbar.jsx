import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import useScrollPosition from '../../hooks/useScrollPosition';
import './Navbar.css';
import { usePortfolio } from '../../context/PortfolioContext';
import { navigateTo } from '../../utils/navigation';
export default function Navbar({ projectMode = false }) {
  const { settings } = usePortfolio();
  const links = [
    ['Home', 'home'],
    ...(settings.sections || [])
      .filter((item) => item.visible && item.inNavbar)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => [item.label, item.key]),
  ];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const button = useRef(null);
  const scroll = useScrollPosition();
  useEffect(() => {
    if (projectMode) {
      setActive('projects');
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
    );
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [projectMode]);
  useEffect(() => {
    const close = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return (
    <header className={`navbar ${scroll > 30 ? 'navbar-scrolled' : ''}`}>
      <nav className="container nav-inner" aria-label="Main navigation">
        <a
          href={projectMode ? '/#home' : '#home'}
          className="logo"
          aria-label="Priyanshu Das home"
          onClick={
            projectMode
              ? (event) => {
                  event.preventDefault();
                  navigateTo('/#home');
                }
              : undefined
          }
        >
          {settings.identity?.logoText || 'PD'}
          <span>.</span>
        </a>
        <div id="main-navigation" className={`nav-links ${open ? 'nav-open' : ''}`}>
          {links.map(([label, id]) => (
            <a
              key={label}
              href={projectMode ? `/#${id}` : `#${id}`}
              aria-current={
                (projectMode ? id === 'projects' : active === id) ? 'location' : undefined
              }
              onClick={(event) => {
                setOpen(false);
                if (projectMode) {
                  event.preventDefault();
                  navigateTo(`/#${id}`);
                }
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <a
          className="button nav-cta"
          href={projectMode ? '/#contact' : '#contact'}
          onClick={
            projectMode
              ? (event) => {
                  event.preventDefault();
                  navigateTo('/#contact');
                }
              : undefined
          }
        >
          Let's Talk <ArrowUpRight size={15} />
        </a>
        <button
          ref={button}
          className="icon-button menu-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}
