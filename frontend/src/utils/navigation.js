export const navigationEvent = 'portfolio:navigate';

export function navigateTo(path) {
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` === path) {
    window.dispatchEvent(new Event(navigationEvent));
    return;
  }
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event(navigationEvent));
}
