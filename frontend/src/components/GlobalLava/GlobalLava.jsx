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
  [25, 72, 0.4],
  [52, 81, 2.8],
  [72, 89, 1.4],
  [41, 96, 4.5],
];

const paths = {
  main: 'M58 -3 C70 7 67 15 52 22 C35 30 38 38 59 44 C77 50 71 59 48 65 C25 71 31 82 54 88 C69 92 66 98 56 104',
  left: 'M53 20 C38 25 23 27 14 35 C7 42 17 48 31 53 C43 58 38 66 24 73',
  right: 'M59 44 C72 45 89 49 92 57 C95 66 79 70 66 75 C55 80 69 87 84 91',
};

export default function GlobalLava({ projectSlug = '' }) {
  const root = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, window.scrollY / maximum));
        root.current?.style.setProperty('--lava-progress', String(progress));
        root.current?.style.setProperty('--mountain-shift', `${progress * -58}px`);
        root.current?.style.setProperty('--lava-shift', `${progress * 34}px`);
        root.current?.style.setProperty('--fog-shift', `${progress * -92}px`);
        root.current?.style.setProperty('--fog-shift-reverse', `${progress * 60}px`);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
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
