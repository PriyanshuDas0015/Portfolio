import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import useScrollPosition from '../../hooks/useScrollPosition';
import './Navbar.css';
const links = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Services', 'Contact'];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const button = useRef(null);
  const scroll = useScrollPosition();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 },
    );
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
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
        <a href="#home" className="logo" aria-label="Priyanshu Das home">
          PD<span>.</span>
        </a>
        <div id="main-navigation" className={`nav-links ${open ? 'nav-open' : ''}`}>
          {links.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              aria-current={active === label.toLowerCase() ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
        <a className="button nav-cta" href="#contact">
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
