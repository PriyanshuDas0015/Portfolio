import { useEffect, useState } from 'react';
export default function useScrollPosition() {
  const [position, setPosition] = useState(0);
  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPosition(window.scrollY));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, []);
  return position;
}
