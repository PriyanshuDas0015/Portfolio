import { useEffect, useRef } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import './CustomCursor.css';
export default function CustomCursor() {
  const supported = useMediaQuery(
    '(hover: hover) and (pointer: fine) and (min-width: 901px) and (prefers-reduced-motion: no-preference)',
  );
  const ring = useRef(null);
  const dot = useRef(null);
  useEffect(() => {
    if (!supported) return;
    let frame = 0;
    let x = -100;
    let y = -100;
    let active = false;
    let hovering = false;

    const paint = () => {
      frame = 0;
      if (ring.current) ring.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
    };

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!active) {
        active = true;
        document.documentElement.classList.add('cursor-active');
      }
      if (!frame) frame = requestAnimationFrame(paint);

      const nextHovering = Boolean(
        event.target.closest(
          'a,button,summary,input,textarea,.project-card,.skill-card,.skill-orb',
        ),
      );
      if (nextHovering !== hovering) {
        hovering = nextHovering;
        ring.current?.classList.toggle('cursor-hover', hovering);
      }
    };
    const hide = () => {
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      document.documentElement.classList.remove('cursor-active');
    };
    const keyboard = (event) => {
      if (event.key === 'Tab') hide();
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('keydown', keyboard);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('keydown', keyboard);
    };
  }, [supported]);
  if (!supported) return null;
  return (
    <>
      <div ref={ring} className="custom-cursor cursor-ring" aria-hidden="true" />
      <div ref={dot} className="custom-cursor cursor-dot" aria-hidden="true" />
    </>
  );
}
