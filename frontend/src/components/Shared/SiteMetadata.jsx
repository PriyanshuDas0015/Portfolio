import { useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
export default function SiteMetadata() {
  const { settings } = usePortfolio();
  useEffect(() => {
    const identity = settings.identity || {};
    const seo = settings.seo || {};
    document.title = seo.title || identity.browserTitle || 'Priyanshu Das | Frontend Developer';
    const setMeta = (selector, attribute, value) => {
      if (!value) return;
      let node = document.head.querySelector(selector);
      if (!node) {
        node = document.createElement('meta');
        Object.entries(attribute).forEach(([key, val]) => node.setAttribute(key, val));
        document.head.appendChild(node);
      }
      node.content = value;
    };
    setMeta(
      'meta[name="description"]',
      { name: 'description' },
      seo.description || identity.metaDescription,
    );
    setMeta('meta[property="og:title"]', { property: 'og:title' }, seo.ogTitle || seo.title);
    setMeta(
      'meta[property="og:description"]',
      { property: 'og:description' },
      seo.ogDescription || seo.description,
    );
    setMeta('meta[property="og:image"]', { property: 'og:image' }, seo.ogImage);
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
  }, [settings]);
  return null;
}
