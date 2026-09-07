import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';

const defaultSections = [
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'certificates',
  'services',
  'resume',
  'contact',
].map((key, index) => ({
  key,
  label: key === 'resume' ? 'My Resume' : key[0].toUpperCase() + key.slice(1),
  visible: true,
  inNavbar: !['education', 'services'].includes(key),
  displayOrder: index + 1,
}));
const identity = {
  siteName: 'Priyanshu Das Portfolio',
  logoText: 'PD',
  browserTitle: 'Priyanshu Das | Frontend Developer',
  metaDescription: '',
  faviconUrl: '',
  footerText: 'Designed and built by Priyanshu Das.',
  copyrightYear: null,
};
const seo = { title: '', description: '', ogTitle: '', ogDescription: '', ogImage: '' };
export default function WebsiteSettings() {
  const notify = useToast();
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    adminApi
      .getSettings()
      .then((d) =>
        setSettings({
          ...d.settings,
          sections: d.settings?.sections?.length ? d.settings.sections : defaultSections,
          identity: { ...identity, ...d.settings?.identity },
          seo: { ...seo, ...d.settings?.seo },
          announcement: { enabled: false, text: '', link: '', ...d.settings?.announcement },
        }),
      )
      .catch((e) => notify(e.message, 'error'));
  }, []);
  if (!settings) return <Loading />;
  const nested = (section, key, value) =>
    setSettings((s) => ({ ...s, [section]: { ...s[section], [key]: value } }));
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await adminApi.updateSettings(settings);
      setSettings(data.settings);
      notify('Website settings saved');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span>SITE CONFIGURATION</span>
          <h1>Website Settings</h1>
          <p>Control public sections, branding, metadata and announcements.</p>
        </div>
      </div>
      <form className="settings-form" onSubmit={save}>
        <section className="form-panel">
          <h2>Section visibility and navigation</h2>
          <div className="section-settings">
            {settings.sections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((item, index) => (
                <div key={item.key}>
                  <strong>{item.label}</strong>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(e) => {
                        const next = [...settings.sections];
                        next[index] = { ...item, visible: e.target.checked };
                        setSettings({ ...settings, sections: next });
                      }}
                    />
                    <span>Visible</span>
                  </label>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={item.inNavbar}
                      onChange={(e) => {
                        const next = [...settings.sections];
                        next[index] = { ...item, inNavbar: e.target.checked };
                        setSettings({ ...settings, sections: next });
                      }}
                    />
                    <span>Navbar</span>
                  </label>
                  <input
                    aria-label={`${item.label} order`}
                    type="number"
                    min="1"
                    max="99"
                    value={item.displayOrder}
                    onChange={(e) => {
                      const next = [...settings.sections];
                      next[index] = { ...item, displayOrder: Number(e.target.value) };
                      setSettings({ ...settings, sections: next });
                    }}
                  />
                </div>
              ))}
          </div>
        </section>
        <section className="form-panel">
          <h2>Identity</h2>
          <div className="form-grid">
            {[
              ['siteName', 'Site name'],
              ['logoText', 'Logo text'],
              ['browserTitle', 'Browser title'],
              ['faviconUrl', 'Favicon URL'],
              ['footerText', 'Footer text'],
              ['copyrightYear', 'Copyright year'],
            ].map(([key, label]) => (
              <label className="admin-field" key={key}>
                <span>{label}</span>
                <input
                  required={['siteName', 'logoText', 'browserTitle', 'footerText'].includes(key)}
                  type={key === 'copyrightYear' ? 'number' : key === 'faviconUrl' ? 'url' : 'text'}
                  value={settings.identity[key] ?? ''}
                  onChange={(e) =>
                    nested(
                      'identity',
                      key,
                      key === 'copyrightYear'
                        ? e.target.value
                          ? Number(e.target.value)
                          : null
                        : e.target.value,
                    )
                  }
                />
              </label>
            ))}
            <label className="admin-field span-2">
              <span>Meta description</span>
              <textarea
                rows="3"
                value={settings.identity.metaDescription || ''}
                onChange={(e) => nested('identity', 'metaDescription', e.target.value)}
              />
            </label>
          </div>
        </section>
        <section className="form-panel">
          <h2>Search and social previews</h2>
          <div className="form-grid">
            {[
              ['title', 'SEO title'],
              ['ogTitle', 'Social title'],
              ['ogImage', 'Social image URL'],
            ].map(([key, label]) => (
              <label className="admin-field" key={key}>
                <span>{label}</span>
                <input
                  type={key === 'ogImage' ? 'url' : 'text'}
                  value={settings.seo[key] || ''}
                  onChange={(e) => nested('seo', key, e.target.value)}
                />
              </label>
            ))}
            {[
              ['description', 'SEO description'],
              ['ogDescription', 'Social description'],
            ].map(([key, label]) => (
              <label className="admin-field span-2" key={key}>
                <span>{label}</span>
                <textarea
                  rows="3"
                  value={settings.seo[key] || ''}
                  onChange={(e) => nested('seo', key, e.target.value)}
                />
              </label>
            ))}
          </div>
        </section>
        <section className="form-panel">
          <h2>Announcement</h2>
          <div className="form-grid">
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={settings.announcement.enabled}
                onChange={(e) => nested('announcement', 'enabled', e.target.checked)}
              />
              <span>Show announcement</span>
            </label>
            <label className="admin-field">
              <span>Link</span>
              <input
                type="url"
                value={settings.announcement.link || ''}
                onChange={(e) => nested('announcement', 'link', e.target.value)}
              />
            </label>
            <label className="admin-field span-2">
              <span>Announcement text</span>
              <input
                value={settings.announcement.text || ''}
                onChange={(e) => nested('announcement', 'text', e.target.value)}
              />
            </label>
          </div>
        </section>
        <div className="sticky-save">
          <button className="admin-button primary" disabled={busy}>
            <Save />
            {busy ? 'Saving...' : 'Save Website Settings'}
          </button>
        </div>
      </form>
    </>
  );
}
