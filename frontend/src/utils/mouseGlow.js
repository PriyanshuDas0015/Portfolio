export function mouseGlow(event) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
}
