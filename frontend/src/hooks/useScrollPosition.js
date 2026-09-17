import { useEffect, useRef, useState } from 'react';

export default function useScrollPosition(threshold = 30) {
  const [passed, setPassed] = useState(() => window.scrollY > threshold);
  const current = useRef(passed);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > threshold;
        if (next !== current.current) {
          current.current = next;
          setPassed(next);
        }
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, [threshold]);

  return passed;
}
