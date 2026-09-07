import { useEffect, useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
const defaults = {
  hero: {
    smallLabel: '// FRONTEND DEVELOPER',
    name: 'Priyanshu Das',
    mainRole: 'Frontend Developer',
    headline: 'I build modern, responsive and meaningful web experiences.',
    shortDescription: 'Frontend Developer | Computer Science Undergraduate',
    longDescription:
      "I'm a Computer Science undergraduate and Frontend Developer passionate about web development, building real-world projects and creating digital solutions that make an impact.",
    availabilityText: 'Open to opportunities',
    availabilityOn: true,
    primaryCta: 'View My Projects',
    secondaryCta: 'Contact Me',
    primaryTarget: '#projects',
    secondaryTarget: '#contact',
    badges: [],
  },
  about: {
    sectionLabel: '01. About Me',
    heading: 'More than just a developer.',
    description:
      "I'm Priyanshu, a Computer Science undergraduate and Frontend Developer who enjoys turning ideas into thoughtful digital experiences.",
    description2: '',
    quote: 'Better solutions for a brighter tomorrow.',
    features: [
      { title: 'Focused', subtitle: 'On learning', icon: 'focus' },
      { title: 'Problem Solver', subtitle: 'Solution oriented', icon: 'lightbulb' },
      { title: 'Always', subtitle: 'Building', icon: 'hammer' },
      { title: 'Open', subtitle: 'To opportunities', icon: 'arrow' },
    ],
  },
  socialLinks: {
    github: 'https://github.com/PriyanshuDas0015',
    linkedin: 'https://www.linkedin.com/in/priyanshu-das-63259b216',
    email: 'priyanshudassonu@gmail.com',
    other: [],
  },
  contactInfo: {
    email: 'priyanshudassonu@gmail.com',
    phone: '',
    location: 'Sonipat, Haryana',
    heading: "Let's create something amazing.",
    subheading: "Have a project in mind or just want to say hi? I'd love to hear from you.",
  },
};
const meta = {
  hero: ['HERO CONTENT', 'Hero', 'Control the first impression visitors see.'],
  about: ['ABOUT CONTENT', 'About', 'Update your introduction, quote and feature cards.'],
  contact: ['CONTACT DETAILS', 'Contact Info', 'Keep your public contact details accurate.'],
  settings: ['SOCIAL LINKS', 'Settings', 'Manage public social profiles and optional links.'],
};
export default function SettingsManager({ mode }) {
  const notify = useToast();
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    adminApi
      .getSettings()
      .then((d) => setSettings(d.settings || structuredClone(defaults)))
      .catch((e) => notify(e.message, 'error'));
  }, [notify]);
  if (!settings) return <Loading />;
  const update = (section, key, value) =>
    setSettings((s) => ({ ...s, [section]: { ...s[section], [key]: value } }));
  const save = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (
      mode === 'settings' &&
      settings.socialLinks.github &&
      !/^https:\/\/github\.com\/[^/\s?#]+\/?$/i.test(settings.socialLinks.github)
    )
      nextErrors.github = 'Enter a GitHub profile URL such as https://github.com/username.';
    if (
      mode === 'settings' &&
      settings.socialLinks.linkedin &&
      !/^https:\/\/www\.linkedin\.com\/in\/[^/\s?#]+\/?$/i.test(settings.socialLinks.linkedin)
    )
      nextErrors.linkedin =
        'Enter a clean LinkedIn profile URL such as https://www.linkedin.com/in/username.';
    if (
      mode === 'settings' &&
      settings.socialLinks.email &&
      !/^\S+@\S+\.\S+$/.test(settings.socialLinks.email)
    )
      nextErrors.email = 'Enter a valid email address.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      const clean = {
        hero: { ...defaults.hero, ...settings.hero },
        about: { ...defaults.about, ...settings.about },
        socialLinks: { ...defaults.socialLinks, ...settings.socialLinks },
        contactInfo: { ...defaults.contactInfo, ...settings.contactInfo },
      };
      const data = await adminApi.updateSettings(clean);
      setSettings(data.settings);
      notify('Settings updated');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  const [eyebrow, title, description] = meta[mode];
  return (
    <>
      <div className="page-heading">
        <div>
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <form className="form-panel settings-form" onSubmit={save}>
        {mode === 'hero' && (
          <div className="form-grid">
            {[
              ['smallLabel', 'Small Label', 60],
              ['name', 'Name', 80],
              ['mainRole', 'Main Role', 100],
              ['headline', 'Headline', 160],
              ['shortDescription', 'Short Description', 240],
              ['availabilityText', 'Availability Text', 80],
              ['primaryCta', 'Primary CTA', 40],
              ['secondaryCta', 'Secondary CTA', 40],
              ['primaryTarget', 'Primary CTA target', 80],
              ['secondaryTarget', 'Secondary CTA target', 80],
            ].map(([key, label, max]) => (
              <label className="admin-field" key={key}>
                <span>{label}</span>
                <input
                  required
                  value={settings.hero[key] || ''}
                  maxLength={max}
                  onChange={(e) => update('hero', key, e.target.value)}
                />
                <small className="char-count">
                  {(settings.hero[key] || '').length}/{max}
                </small>
              </label>
            ))}
            <label className="admin-field span-2">
              <span>Long Description</span>
              <textarea
                required
                rows="5"
                maxLength="700"
                value={settings.hero.longDescription || ''}
                onChange={(e) => update('hero', 'longDescription', e.target.value)}
              />
              <small className="char-count">
                {(settings.hero.longDescription || '').length}/700
              </small>
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={settings.hero.availabilityOn}
                onChange={(e) => update('hero', 'availabilityOn', e.target.checked)}
              />
              <span>Show availability badge</span>
            </label>
            <div className="span-2">
              <div className="form-subtitle row">
                <h2>Hero badges</h2>
                <button
                  type="button"
                  className="admin-button secondary"
                  onClick={() =>
                    update('hero', 'badges', [
                      ...(settings.hero.badges || []),
                      {
                        label: '',
                        icon: 'code',
                        color: 'purple',
                        displayOrder: (settings.hero.badges || []).length + 1,
                      },
                    ])
                  }
                >
                  <Plus />
                  Add Badge
                </button>
              </div>
              <div className="features-editor">
                {(settings.hero.badges || []).map((badge, index) => (
                  <div key={index}>
                    <span>{index + 1}</span>
                    <input
                      placeholder="Badge label"
                      value={badge.label}
                      onChange={(e) => {
                        const next = [...settings.hero.badges];
                        next[index] = { ...badge, label: e.target.value };
                        update('hero', 'badges', next);
                      }}
                    />
                    <select
                      value={badge.icon}
                      onChange={(e) => {
                        const next = [...settings.hero.badges];
                        next[index] = { ...badge, icon: e.target.value };
                        update('hero', 'badges', next);
                      }}
                    >
                      {['code', 'terminal', 'sparkles', 'award'].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                    <input
                      aria-label={`Badge ${index + 1} order`}
                      type="number"
                      min="0"
                      max="999"
                      value={badge.displayOrder || 0}
                      onChange={(e) => {
                        const next = [...settings.hero.badges];
                        next[index] = { ...badge, displayOrder: Number(e.target.value) };
                        update('hero', 'badges', next);
                      }}
                    />
                    <button
                      type="button"
                      aria-label="Remove badge"
                      onClick={() =>
                        update(
                          'hero',
                          'badges',
                          settings.hero.badges.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {mode === 'about' && (
          <div>
            <div className="form-grid">
              <label className="admin-field">
                <span>Section label</span>
                <input
                  required
                  maxLength="80"
                  value={settings.about.sectionLabel || ''}
                  onChange={(e) => update('about', 'sectionLabel', e.target.value)}
                />
              </label>
              <label className="admin-field">
                <span>Heading</span>
                <input
                  required
                  maxLength="120"
                  value={settings.about.heading || ''}
                  onChange={(e) => update('about', 'heading', e.target.value)}
                />
              </label>
              <label className="admin-field">
                <span>Quote</span>
                <input
                  required
                  maxLength="180"
                  value={settings.about.quote || ''}
                  onChange={(e) => update('about', 'quote', e.target.value)}
                />
              </label>
              <label className="admin-field span-2">
                <span>Description</span>
                <textarea
                  required
                  rows="6"
                  maxLength="1000"
                  value={settings.about.description || ''}
                  onChange={(e) => update('about', 'description', e.target.value)}
                />
              </label>
              <label className="admin-field span-2">
                <span>Second description</span>
                <textarea
                  rows="5"
                  maxLength="1000"
                  value={settings.about.description2 || ''}
                  onChange={(e) => update('about', 'description2', e.target.value)}
                />
              </label>
            </div>
            <div className="form-subtitle row">
              <h2>Feature cards</h2>
              <button
                type="button"
                className="admin-button secondary"
                onClick={() =>
                  update('about', 'features', [
                    ...settings.about.features,
                    {
                      title: '',
                      subtitle: '',
                      icon: 'focus',
                      displayOrder: settings.about.features.length + 1,
                    },
                  ])
                }
              >
                <Plus />
                Add Card
              </button>
            </div>
            <div className="features-editor">
              {settings.about.features.map((feature, index) => (
                <div key={index}>
                  <span>0{index + 1}</span>
                  <input
                    aria-label={`Feature ${index + 1} title`}
                    value={feature.title}
                    onChange={(e) => {
                      const next = [...settings.about.features];
                      next[index] = { ...feature, title: e.target.value };
                      update('about', 'features', next);
                    }}
                  />
                  <input
                    aria-label={`Feature ${index + 1} subtitle`}
                    value={feature.subtitle}
                    onChange={(e) => {
                      const next = [...settings.about.features];
                      next[index] = { ...feature, subtitle: e.target.value };
                      update('about', 'features', next);
                    }}
                  />
                  <select
                    aria-label={`Feature ${index + 1} icon`}
                    value={feature.icon}
                    onChange={(e) => {
                      const next = [...settings.about.features];
                      next[index] = { ...feature, icon: e.target.value };
                      update('about', 'features', next);
                    }}
                  >
                    {['focus', 'lightbulb', 'hammer', 'arrow'].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                  <input
                    aria-label={`Feature ${index + 1} order`}
                    type="number"
                    min="0"
                    max="999"
                    value={feature.displayOrder || 0}
                    onChange={(e) => {
                      const next = [...settings.about.features];
                      next[index] = { ...feature, displayOrder: Number(e.target.value) };
                      update('about', 'features', next);
                    }}
                  />
                  <button
                    type="button"
                    aria-label={`Remove feature ${index + 1}`}
                    onClick={() =>
                      update(
                        'about',
                        'features',
                        settings.about.features.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {mode === 'contact' && (
          <div className="form-grid">
            {[
              ['email', 'Email', 'email'],
              ['phone', 'Phone', 'tel'],
              ['location', 'Location', 'text'],
              ['heading', 'Contact Heading', 'text'],
            ].map(([key, label, type]) => (
              <label className="admin-field" key={key}>
                <span>{label}</span>
                <input
                  type={type}
                  required={['location', 'heading'].includes(key)}
                  value={settings.contactInfo[key] || ''}
                  onChange={(e) => update('contactInfo', key, e.target.value)}
                />
              </label>
            ))}
            <label className="admin-field span-2">
              <span>Contact Subheading</span>
              <textarea
                required
                rows="4"
                maxLength="240"
                value={settings.contactInfo.subheading || ''}
                onChange={(e) => update('contactInfo', 'subheading', e.target.value)}
              />
            </label>
          </div>
        )}
        {mode === 'settings' && (
          <div>
            <div className="form-grid">
              {[
                ['github', 'GitHub URL', 'url'],
                ['linkedin', 'LinkedIn URL', 'url'],
                ['email', 'Social Email', 'email'],
              ].map(([key, label, type]) => (
                <label className="admin-field" key={key}>
                  <span>{label}</span>
                  <input
                    type={type}
                    value={settings.socialLinks[key] || ''}
                    aria-invalid={Boolean(errors[key])}
                    aria-describedby={errors[key] ? `${key}-error` : undefined}
                    onChange={(e) => {
                      update('socialLinks', key, e.target.value);
                      setErrors((current) => ({ ...current, [key]: undefined }));
                    }}
                  />
                  {errors[key] && (
                    <small className="field-error" id={`${key}-error`}>
                      {errors[key]}
                    </small>
                  )}
                </label>
              ))}
            </div>
            <div className="form-subtitle row">
              <h2>Other links</h2>
              <button
                type="button"
                className="admin-button secondary"
                onClick={() =>
                  update('socialLinks', 'other', [
                    ...settings.socialLinks.other,
                    {
                      platform: '',
                      label: '',
                      url: '',
                      icon: 'link',
                      visible: true,
                      displayOrder: settings.socialLinks.other.length + 1,
                    },
                  ])
                }
              >
                <Plus />
                Add Link
              </button>
            </div>
            <div className="features-editor social-editor">
              {settings.socialLinks.other.map((link, index) => (
                <div key={index}>
                  <span>0{index + 1}</span>
                  <input
                    placeholder="Platform"
                    value={link.platform || ''}
                    onChange={(e) => {
                      const next = [...settings.socialLinks.other];
                      next[index] = { ...link, platform: e.target.value };
                      update('socialLinks', 'other', next);
                    }}
                  />
                  <input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const next = [...settings.socialLinks.other];
                      next[index] = { ...link, label: e.target.value };
                      update('socialLinks', 'other', next);
                    }}
                  />
                  <input
                    placeholder="Icon"
                    value={link.icon || 'link'}
                    onChange={(e) => {
                      const next = [...settings.socialLinks.other];
                      next[index] = { ...link, icon: e.target.value };
                      update('socialLinks', 'other', next);
                    }}
                  />
                  <input
                    aria-label={`${link.label || 'Social link'} order`}
                    type="number"
                    min="0"
                    max="999"
                    value={link.displayOrder || 0}
                    onChange={(e) => {
                      const next = [...settings.socialLinks.other];
                      next[index] = { ...link, displayOrder: Number(e.target.value) };
                      update('socialLinks', 'other', next);
                    }}
                  />
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={link.visible !== false}
                      onChange={(e) => {
                        const next = [...settings.socialLinks.other];
                        next[index] = { ...link, visible: e.target.checked };
                        update('socialLinks', 'other', next);
                      }}
                    />
                    <span>Visible</span>
                  </label>
                  <input
                    placeholder="https://..."
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const next = [...settings.socialLinks.other];
                      next[index] = { ...link, url: e.target.value };
                      update('socialLinks', 'other', next);
                    }}
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${link.label || 'link'}`}
                    onClick={() =>
                      update(
                        'socialLinks',
                        'other',
                        settings.socialLinks.other.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="sticky-save">
          <button className="admin-button primary" disabled={busy}>
            <Save />
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </>
  );
}
