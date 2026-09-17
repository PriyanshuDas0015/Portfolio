const glowState = new WeakMap();

export function mouseGlow(event) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const target = event.currentTarget;
  const previous = glowState.get(target) || {};
  previous.x = event.clientX;
  previous.y = event.clientY;
  if (!previous.rect || performance.now() - previous.measuredAt > 1000) {
    previous.rect = target.getBoundingClientRect();
    previous.measuredAt = performance.now();
  }
  if (!previous.frame) {
    previous.frame = requestAnimationFrame(() => {
      previous.frame = 0;
      target.style.setProperty('--mouse-x', `${previous.x - previous.rect.left}px`);
      target.style.setProperty('--mouse-y', `${previous.y - previous.rect.top}px`);
    });
  }
  glowState.set(target, previous);
}
