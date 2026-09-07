import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
const configs = {
  services: {
    title: 'Services',
    eyebrow: 'WHAT YOU OFFER',
    description: 'Add, edit and reorder services.',
    blank: { title: '', description: '', icon: 'code', displayOrder: 0, visible: true },
    fields: [
      ['title', 'Title', 'text'],
      ['description', 'Description', 'textarea'],
      ['icon', 'Icon', 'select'],
      ['displayOrder', 'Display Order', 'number'],
      ['visible', 'Visible publicly', 'checkbox'],
    ],
  },
  timeline: {
    title: 'Experience',
    eyebrow: 'PROFESSIONAL JOURNEY',
    description: 'Manage roles, companies, dates and technologies.',
    blank: {
      position: '',
      company: '',
      description: '',
      startDate: '',
      endDate: '',
      technologies: '',
      icon: 'check',
      displayOrder: 0,
      current: false,
      visible: true,
    },
    fields: [
      ['position', 'Position', 'text'],
      ['company', 'Company', 'text'],
      ['startDate', 'Start date', 'text'],
      ['endDate', 'End date', 'text'],
      ['description', 'Description', 'textarea'],
      ['technologies', 'Technologies (one per line or comma separated)', 'textarea'],
      ['icon', 'Icon', 'select'],
      ['displayOrder', 'Display Order', 'number'],
      ['current', 'Current milestone', 'checkbox'],
      ['visible', 'Visible publicly', 'checkbox'],
    ],
  },
};
export default function SimpleManager({ resource }) {
  const config = configs[resource];
  const notify = useToast();
  const [items, setItems] = useState(null);
  const [value, setValue] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () =>
    adminApi
      .list(resource)
      .then((d) => setItems(d.items))
      .catch((e) => notify(e.message, 'error'));
  useEffect(() => {
    load();
  }, [resource]);
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload =
      resource === 'timeline'
        ? {
            ...value,
            title: value.position || value.title,
            subtitle: value.company || value.subtitle,
            position: value.position || value.title,
            company: value.company || value.subtitle,
            date: [value.startDate, value.current ? 'Present' : value.endDate]
              .filter(Boolean)
              .join(' – '),
            technologies: Array.isArray(value.technologies)
              ? value.technologies
              : String(value.technologies || '')
                  .split(/[\n,]/)
                  .map((item) => item.trim())
                  .filter(Boolean),
          }
        : value;
    try {
      if (value._id) await adminApi.update(resource, value._id, payload);
      else await adminApi.create(resource, payload);
      notify(value._id ? `${config.title} updated` : `${config.title} item added`);
      setValue(null);
      await load();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  const confirm = async () => {
    setBusy(true);
    try {
      await adminApi.remove(resource, remove._id);
      setRemove(null);
      notify('Item deleted');
      await load();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  if (!items) return <Loading />;
  return (
    <>
      <div className="page-heading row">
        <div>
          <span>{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <button className="admin-button primary" onClick={() => setValue({ ...config.blank })}>
          <Plus />
          Add Item
        </button>
      </div>
      <div className="content-list">
        {items.map((item) => (
          <article key={item._id}>
            <span className="order-chip">{String(item.displayOrder).padStart(2, '0')}</span>
            <div>
              <h2>{item.position || item.title}</h2>
              <p>{item.company || item.subtitle || item.description}</p>
              {item.date && <small>{item.date}</small>}
            </div>
            <div className="row-actions">
              <button
                onClick={() =>
                  setValue({
                    ...item,
                    position: item.position || item.title,
                    company: item.company || item.subtitle,
                    technologies: (item.technologies || []).join('\n'),
                  })
                }
              >
                <Pencil />
                Edit
              </button>
              <button className="danger-text" onClick={() => setRemove(item)}>
                <Trash2 />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {value && (
        <div className="modal-backdrop">
          <form className="editor-modal" onSubmit={save}>
            <header>
              <div>
                <span>{value._id ? 'EDIT' : 'ADD'}</span>
                <h2>{config.title} item</h2>
              </div>
              <button type="button" onClick={() => setValue(null)} aria-label="Close">
                <X />
              </button>
            </header>
            {config.fields.map(([name, label, type]) =>
              type === 'checkbox' ? (
                <label className="checkbox-field" key={name}>
                  <input
                    type="checkbox"
                    checked={value[name]}
                    onChange={(e) => setValue({ ...value, [name]: e.target.checked })}
                  />
                  <span>{label}</span>
                </label>
              ) : (
                <label className="admin-field" key={name}>
                  <span>
                    {label}
                    {['title', 'description', 'subtitle', 'position', 'company'].includes(name)
                      ? ' *'
                      : ''}
                  </span>
                  {type === 'textarea' ? (
                    <textarea
                      rows="4"
                      value={value[name]}
                      required={['title', 'description'].includes(name)}
                      onChange={(e) => setValue({ ...value, [name]: e.target.value })}
                    />
                  ) : type === 'select' ? (
                    <select
                      value={value[name]}
                      onChange={(e) => setValue({ ...value, [name]: e.target.value })}
                    >
                      {['code', 'network', 'layers', 'sparkles', 'check', 'route'].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      min={type === 'number' ? '0' : undefined}
                      max={type === 'number' ? '999' : undefined}
                      value={value[name]}
                      required={['title', 'subtitle', 'position', 'company'].includes(name)}
                      onChange={(e) => setValue({ ...value, [name]: e.target.value })}
                    />
                  )}
                </label>
              ),
            )}
            <div className="modal-actions">
              <button
                type="button"
                className="admin-button secondary"
                onClick={() => setValue(null)}
              >
                Cancel
              </button>
              <button className="admin-button primary" disabled={busy}>
                <Save />
                {busy ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
      {remove && (
        <ConfirmModal
          title={`Delete ${remove.title}?`}
          description="This item will be removed from the public portfolio."
          busy={busy}
          onCancel={() => setRemove(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
