import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './PageTearTransition.css';

const PageTearContext = createContext({
  isTransitioning: false,
  startTear: (action) => action?.(),
});

const variants = ['a', 'b', 'c'];

export function PageTearProvider({ children }) {
  const [state, setState] = useState('idle');
  const [variant, setVariant] = useState(variants[0]);
  const locked = useRef(false);
  const variantIndex = useRef(0);
  const timers = useRef([]);
  const previousOverflow = useRef('');

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const unlock = useCallback(() => {
    document.body.style.overflow = previousOverflow.current;
    locked.current = false;
    setState('idle');
  }, []);

  useEffect(
    () => () => {
      clearTimers();
      document.body.style.overflow = previousOverflow.current;
    },
    [clearTimers],
  );

  const startTear = useCallback(
    (action) => {
      if (locked.current || typeof action !== 'function') return false;
      locked.current = true;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setVariant(variants[variantIndex.current % variants.length]);
      variantIndex.current += 1;

      if (reduced) {
        setState('reduced');
        timers.current.push(window.setTimeout(action, 80), window.setTimeout(unlock, 280));
        return true;
      }

      setState('tearing');
      timers.current.push(window.setTimeout(action, 390), window.setTimeout(unlock, 1260));
      return true;
    },
    [unlock],
  );

  const tearing = state === 'tearing';
  const sheetTransition = {
    duration: 1.24,
    times: [0, 0.18, 0.42, 0.72, 1],
    ease: [0.72, 0.02, 0.22, 1],
  };

  return (
    <PageTearContext.Provider value={{ isTransitioning: state !== 'idle', startTear }}>
      {children}
      <div
        className={`page-tear page-tear--${state} page-tear--${variant}`}
        aria-hidden="true"
        data-state={state}
      >
        <div className="page-tear__lava" />
        <motion.div
          className="page-tear__backside"
          initial={false}
          animate={
            tearing
              ? {
                  x: ['10px', '10px', '-5%', '-55%', '-116%'],
                  y: ['0%', '0%', '0%', '2%', '5%'],
                  rotateY: [-1, -1, -8, -11, -13],
                  rotateZ: [0, 0, 0.6, -1, -2.5],
                }
              : { x: '10px', y: '0%', rotateY: -1, rotateZ: 0 }
          }
          transition={sheetTransition}
        />
        <motion.div
          className="page-tear__sheet"
          initial={false}
          animate={
            tearing
              ? {
                  x: ['0%', '0%', '-8%', '-56%', '-118%'],
                  y: ['0%', '0%', '0%', '1.5%', '4%'],
                  rotateY: [0, 0, 3, 8, 13],
                  rotateZ: [0, 0, -0.4, -1.7, -3],
                }
              : { x: '0%', y: '0%', rotateY: 0, rotateZ: 0 }
          }
          transition={sheetTransition}
        />
        <motion.div
          className="page-tear__fibers"
          initial={false}
          animate={
            tearing
              ? {
                  x: ['0%', '0%', '-9%', '-56%', '-118%'],
                  y: ['0%', '0%', '0%', '1.5%', '4%'],
                  rotateY: [0, 0, 4, 8, 13],
                  rotateZ: [0, 0, -0.4, -1.7, -3],
                }
              : { x: '0%', y: '0%', rotateY: 0, rotateZ: 0 }
          }
          transition={sheetTransition}
        />
      </div>
    </PageTearContext.Provider>
  );
}

export const usePageTear = () => useContext(PageTearContext);
