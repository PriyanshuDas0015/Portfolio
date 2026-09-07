import { useEffect } from 'react';
import useMediaQuery from './useMediaQuery';

export default function usePointerEffects() {
  const enabled = useMediaQuery(
    '(hover: hover) and (pointer: fine) and (min-width: 901px) and (prefers-reduced-motion: no-preference)',
  );
  useEffect(() => {
    if (!enabled) return;
    const hero = document.querySelector('.hero');
    const scene = document.querySelector('.volcano-scene');
    if (!hero || !scene) return;
    let frame;
    const parallax = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        scene.style.setProperty(
          '--parallax-x',
          `${((event.clientX - rect.left) / rect.width - 0.5) * 10}px`,
        );
        scene.style.setProperty(
          '--parallax-y',
          `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`,
        );
      });
    };
    const resetOrbit = () => {
      cancelAnimationFrame(frame);
      scene.style.removeProperty('--parallax-x');
      scene.style.removeProperty('--parallax-y');
    };
    const buttons = [...document.querySelectorAll('a.button')];
    const magnetic = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.translate = `${Math.max(-2, Math.min(2, (event.clientX - rect.left - rect.width / 2) * 0.03))}px ${Math.max(-2, Math.min(2, (event.clientY - rect.top - rect.height / 2) * 0.03))}px`;
    };
    const resetButton = (event) => {
      event.currentTarget.style.translate = '';
    };
    hero.addEventListener('pointermove', parallax, { passive: true });
    hero.addEventListener('pointerleave', resetOrbit);
    buttons.forEach((button) => {
      button.addEventListener('pointermove', magnetic);
      button.addEventListener('pointerleave', resetButton);
    });
    return () => {
      resetOrbit();
      hero.removeEventListener('pointermove', parallax);
      hero.removeEventListener('pointerleave', resetOrbit);
      buttons.forEach((button) => {
        button.removeEventListener('pointermove', magnetic);
        button.removeEventListener('pointerleave', resetButton);
        button.style.translate = '';
      });
    };
  }, [enabled]);
}
