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
    let frame = 0;
    let heroRect = hero.getBoundingClientRect();
    let pointerX = 0;
    let pointerY = 0;

    const measure = () => {
      heroRect = hero.getBoundingClientRect();
    };

    const paintParallax = () => {
      frame = 0;
      scene.style.setProperty(
        '--parallax-x',
        `${((pointerX - heroRect.left) / heroRect.width - 0.5) * 10}px`,
      );
      scene.style.setProperty(
        '--parallax-y',
        `${((pointerY - heroRect.top) / heroRect.height - 0.5) * 10}px`,
      );
    };

    const parallax = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(paintParallax);
    };
    const resetOrbit = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      scene.style.removeProperty('--parallax-x');
      scene.style.removeProperty('--parallax-y');
    };
    const buttons = [...document.querySelectorAll('a.button')];
    const buttonRects = new WeakMap();
    const measureButton = (event) => {
      buttonRects.set(event.currentTarget, event.currentTarget.getBoundingClientRect());
    };
    const magnetic = (event) => {
      const rect = buttonRects.get(event.currentTarget);
      if (!rect) return;
      event.currentTarget.style.translate = `${Math.max(-2, Math.min(2, (event.clientX - rect.left - rect.width / 2) * 0.03))}px ${Math.max(-2, Math.min(2, (event.clientY - rect.top - rect.height / 2) * 0.03))}px`;
    };
    const resetButton = (event) => {
      event.currentTarget.style.translate = '';
    };
    hero.addEventListener('pointerenter', measure, { passive: true });
    hero.addEventListener('pointermove', parallax, { passive: true });
    hero.addEventListener('pointerleave', resetOrbit);
    window.addEventListener('resize', measure, { passive: true });
    buttons.forEach((button) => {
      button.addEventListener('pointerenter', measureButton, { passive: true });
      button.addEventListener('pointermove', magnetic, { passive: true });
      button.addEventListener('pointerleave', resetButton);
    });
    return () => {
      resetOrbit();
      hero.removeEventListener('pointerenter', measure);
      hero.removeEventListener('pointermove', parallax);
      hero.removeEventListener('pointerleave', resetOrbit);
      window.removeEventListener('resize', measure);
      buttons.forEach((button) => {
        button.removeEventListener('pointerenter', measureButton);
        button.removeEventListener('pointermove', magnetic);
        button.removeEventListener('pointerleave', resetButton);
        button.style.translate = '';
      });
    };
  }, [enabled]);
}
