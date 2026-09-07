import { useEffect, useState } from 'react';
import { Award, Plus, Pencil, Trash2, X, Save, ExternalLink } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const blank = {
  title: '',
  issuer: '',
  issueDate: '',
  credentialId: '',
  credentialUrl: '',
  description: '',
  skills: '',
  featured: false,
  published: true,
  displayOrder: 0,
};
export default function CertificatesManager() {
  const notify = useToast();
  const [items, setItems] = useState(null);
  const [value, setValue] = useState(null);
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const load = () =>
    adminApi
      .list('certificates')
      .then((d) => setItems(d.items))
      .catch((e) => notify(e.message, 'error'));
  useEffect(() => {
    load();
  }, []);
  const edit = (item) => {
    setValue({ ...item, skills: (item.skills || []).join(', ') });
    setImage(null);
    setPdf(null);
  };
  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    const form = new FormData();
    Object.entries(value).forEach(([key, val]) => {
      if (
        !key.startsWith('_') &&
        ![
          'createdAt',
          'updatedAt',
          'imageUrl',
          'imagePublicId',
          'imageSize',
          'pdfUrl',
          'pdfPublicId',
          'pdfSize',
          '__v',
        ].includes(key)
      )
        form.append(
          key,
          key === 'skills'
            ? JSON.stringify(
                String(val)
                  .split(',')
                  .map((x) => x.trim())
                  .filter(Boolean),
              )
            : val,
        );
    });
    if (image) form.append('certificateImage', image);
    if (pdf) form.append('certificatePdf', pdf);
    try {
      if (value._id) await adminApi.update('certificates', value._id, form);
      else await adminApi.create('certificates', form);
      notify(value._id ? 'Certificate updated' : 'Certificate added');
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
      await adminApi.remove('certificates', remove._id);
      setRemove(null);
      notify('Certificate deleted');
      await load();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  if (!items) return <Loading label="Loading certificates..." />;
  return (
    <>
      <div className="page-heading row">
        <div>
          <span>CREDENTIALS</span>
          <h1>Certificates</h1>
          <p>Publish certificates, credentials and supporting documents.</p>
        </div>
        <button className="admin-button primary" onClick={() => edit(blank)}>
          <Plus />
          Add Certificate
        </button>
      </div>
      <div className="list-toolbar form-panel">
        <input
          aria-label="Search certificates"
          placeholder="Search certificates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Filter certificates"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All certificates</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="featured">Featured</option>
        </select>
      </div>
      <div className="content-list">
        {items
          .filter(
            (item) =>
              `${item.title} ${item.issuer}`.toLowerCase().includes(search.toLowerCase()) &&
              (filter === 'all' ||
                (filter === 'published'
                  ? item.published
                  : filter === 'draft'
                    ? !item.published
                    : item.featured)),
          )
          .map((item) => (
            <article key={item._id}>
              <span className="order-chip">
                <Award />
              </span>
              <div>
                <h2>{item.title}</h2>
                <p>
                  {item.issuer}
                  {item.issueDate ? ` · ${item.issueDate}` : ''}
                </p>
                <small>
                  {item.published ? 'Published' : 'Draft'}
                  {item.featured ? ' · Featured' : ''}
                </small>
              </div>
              <div className="row-actions">
                {(item.credentialUrl || item.pdfUrl) && (
                  <a href={item.credentialUrl || item.pdfUrl} target="_blank" rel="noreferrer">
                    <ExternalLink />
                    View
                  </a>
                )}
                <button onClick={() => edit(item)}>
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
        {items.length === 0 && (
          <div className="empty-state">
            <Award />
            <h2>No certificates yet</h2>
            <p>Add a credential when you are ready to publish it.</p>
          </div>
        )}
      </div>
      {value && (
        <div className="modal-backdrop">
          <form className="editor-modal wide" onSubmit={save}>
            <header>
              <div>
                <span>{value._id ? 'EDIT' : 'ADD'}</span>
                <h2>Certificate</h2>
              </div>
              <button type="button" onClick={() => setValue(null)} aria-label="Close">
                <X />
              </button>
            </header>
            <div className="form-grid">
              {[
                'title',
                'issuer',
                'issueDate',
                'credentialId',
                'credentialUrl',
                'skills',
                'displayOrder',
              ].map((key) => (
                <label className="admin-field" key={key}>
                  <span>
                    {
                      {
                        title: 'Title *',
                        issuer: 'Issuer *',
                        issueDate: 'Issue date',
                        credentialId: 'Credential ID',
                        credentialUrl: 'Credential URL',
                        skills: 'Skills (comma separated)',
                        displayOrder: 'Display order',
                      }[key]
                    }
                  </span>
                  <input
                    required={['title', 'issuer'].includes(key)}
                    type={
                      key === 'displayOrder' ? 'number' : key === 'credentialUrl' ? 'url' : 'text'
                    }
                    value={value[key] ?? ''}
                    onChange={(e) => setValue({ ...value, [key]: e.target.value })}
                  />
                </label>
              ))}
              <label className="admin-field span-2">
                <span>Description</span>
                <textarea
                  rows="4"
                  value={value.description || ''}
                  onChange={(e) => setValue({ ...value, description: e.target.value })}
                />
              </label>
              <label className="admin-field">
                <span>Certificate image (5 MB)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <label className="admin-field">
                <span>Certificate PDF (10 MB)</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files[0])}
                />
              </label>
              {['featured', 'published'].map((key) => (
                <label className="checkbox-field" key={key}>
                  <input
                    type="checkbox"
                    checked={value[key]}
                    onChange={(e) => setValue({ ...value, [key]: e.target.checked })}
                  />
                  <span>
                    {key === 'featured' ? 'Featured certificate' : 'Published on portfolio'}
                  </span>
                </label>
              ))}
            </div>
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
                {busy ? 'Saving...' : 'Save Certificate'}
              </button>
            </div>
          </form>
        </div>
      )}
      {remove && (
        <ConfirmModal
          title={`Delete ${remove.title}?`}
          description="The certificate and its uploaded files will be removed."
          busy={busy}
          onCancel={() => setRemove(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
