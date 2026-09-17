import { useEffect, useRef } from 'react';
import './GlobalLava.css';

const particles = [
  [62, 7, 0],
  [44, 14, 2.4],
  [73, 21, 1.1],
  [31, 30, 3.2],
  [58, 39, 0.7],
  [78, 47, 4.1],
  [38, 55, 1.8],
  [64, 64, 3.6],
];

const paths = {
  main: 'M58 -3 C70 7 67 15 52 22 C35 30 38 38 59 44 C77 50 71 59 48 65 C25 71 31 82 54 88 C69 92 66 98 56 104',
  left: 'M53 20 C38 25 23 27 14 35 C7 42 17 48 31 53 C43 58 38 66 24 73',
  right: 'M59 44 C72 45 89 49 92 57 C95 66 79 70 66 75 C55 80 69 87 84 91',
};

export default function GlobalLava({ projectSlug = '' }) {
  const root = useRef(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return undefined;

    let maximum = 1;
    let scrollTimer = 0;
    const measure = () => {
      maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const commitProgress = () => {
      scrollTimer = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / maximum));
      element.style.setProperty('--lava-progress', String(progress));
    };
    const queueProgress = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(commitProgress, 80);
    };
    const resize = () => {
      measure();
      commitProgress();
    };

    measure();
    commitProgress();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.documentElement);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => element.classList.toggle('global-lava--active', entry.isIntersecting),
      { threshold: 0.001 },
    );
    visibilityObserver.observe(element);
    window.addEventListener('scroll', queueProgress, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    return () => {
      window.clearTimeout(scrollTimer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('scroll', queueProgress);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={root}
      className={`global-lava ${projectSlug ? `global-lava--project global-lava--${projectSlug}` : ''}`}
      aria-hidden="true"
    >
      <div className="global-lava__landscape" />
      <div className="global-lava__readability" />
      <div className="global-lava__fog global-lava__fog--one" />
      <div className="global-lava__fog global-lava__fog--two" />
      <div className="global-lava__flow">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lava-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4e7ff" />
              <stop offset=".22" stopColor="#b06cff" />
              <stop offset=".63" stopColor="#7c3cff" />
              <stop offset="1" stopColor="#45bfff" />
            </linearGradient>
            <filter id="lava-bloom" x="-100%" y="-10%" width="300%" height="120%">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
            <filter id="lava-soft" x="-100%" y="-10%" width="300%" height="120%">
              <feGaussianBlur stdDeviation=".55" />
            </filter>
            <mask id="lava-reveal">
              <path className="lava-reveal" pathLength="1" d={paths.main} />
              <path className="lava-reveal lava-reveal-branch" pathLength="1" d={paths.left} />
              <path className="lava-reveal lava-reveal-branch" pathLength="1" d={paths.right} />
            </mask>
          </defs>
          <g mask="url(#lava-reveal)">
            {[paths.main, paths.left, paths.right].map((path, index) => (
              <g key={path} className={index ? 'lava-branch' : 'lava-main'}>
                <path className="lava-bloom" d={path} />
                <path className="lava-edge" d={path} />
                <path className="lava-body" d={path} />
                <path className="lava-core" pathLength="1" d={path} />
              </g>
            ))}
          </g>
        </svg>
      </div>
      <div className="global-lava-particles">
        {particles.map(([x, y, delay], index) => (
          <i
            key={`${x}-${y}`}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--delay': `${delay}s`,
              '--size': `${2 + (index % 3)}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
