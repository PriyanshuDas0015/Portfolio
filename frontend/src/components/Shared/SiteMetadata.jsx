import { useEffect } from 'react';
export default function SiteMetadata() {
  useEffect(() => {
    const configuredUrl = import.meta.env.VITE_SITE_URL;
    if (!configuredUrl) return;
    let url;
    try {
      url = new URL(configuredUrl);
      if (!['http:', 'https:'].includes(url.protocol)) return;
    } catch {
      return;
    }
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url.href;
    const ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = url.href;
    document.head.append(canonical, ogUrl);
    return () => {
      canonical.remove();
      ogUrl.remove();
    };
  }, []);
  return null;
}
