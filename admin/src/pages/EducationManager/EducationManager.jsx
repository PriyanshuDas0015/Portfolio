import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const blank = {
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  expectedGraduation: '',
  description: '',
  grade: '',
  coursework: '',
  displayOrder: 0,
  visible: true,
};
export default function EducationManager() {
  const notify = useToast();
  const [items, setItems] = useState(null);
  const [value, setValue] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [logo, setLogo] = useState(null);
  const load = () =>
    adminApi
      .list('education')
      .then((d) => setItems(d.items))
      .catch((e) => notify(e.message, 'error'));
  useEffect(() => {
    load();
  }, []);
  const edit = (item) => {
    setValue({ ...item, coursework: (item.coursework || []).join('\n') });
    setLogo(null);
  };
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const body = new FormData();
    [
      'institution',
      'degree',
      'field',
      'location',
      'startDate',
      'expectedGraduation',
      'description',
      'grade',
      'displayOrder',
      'visible',
    ].forEach((key) => body.append(key, value[key] ?? ''));
    body.append(
      'coursework',
      JSON.stringify(
        String(value.coursework)
          .split('\n')
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    );
    if (logo) body.append('logo', logo);
    try {
      value._id
        ? await adminApi.update('education', value._id, body)
        : await adminApi.create('education', body);
      notify('Education saved');
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
      await adminApi.remove('education', remove._id);
      setRemove(null);
      notify('Education deleted');
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
          <span>ACADEMIC BACKGROUND</span>
          <h1>Education</h1>
          <p>Manage multiple institutions, programs and coursework entries.</p>
        </div>
        <button className="admin-button primary" onClick={() => edit(blank)}>
          <Plus />
          Add Education
        </button>
      </div>
      <div className="content-list">
        {items.map((item) => (
          <article key={item._id}>
            <span className="order-chip">{String(item.displayOrder || 0).padStart(2, '0')}</span>
            <div>
              <h2>
                {item.degree} · {item.field}
              </h2>
              <p>
                {item.institution} · {item.location}
              </p>
              <small>
                {item.startDate}
                {item.startDate && item.expectedGraduation ? ' – ' : ''}
                {item.expectedGraduation}
                {item.visible ? '' : ' · Hidden'}
              </small>
            </div>
            <div className="row-actions">
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
      </div>
      {value && (
        <div className="modal-backdrop">
          <form className="editor-modal wide" onSubmit={save}>
            <header>
              <div>
                <span>{value._id ? 'EDIT' : 'ADD'}</span>
                <h2>Education entry</h2>
              </div>
              <button type="button" onClick={() => setValue(null)}>
                <X />
              </button>
            </header>
            <div className="form-grid">
              {[
                ['institution', 'Institution'],
                ['degree', 'Degree'],
                ['field', 'Field of study'],
                ['location', 'Location'],
                ['startDate', 'Start date'],
                ['expectedGraduation', 'Graduation / end date'],
                ['grade', 'Grade / CGPA'],
                ['displayOrder', 'Display order'],
              ].map(([key, label]) => (
                <label className="admin-field" key={key}>
                  <span>{label}</span>
                  <input
                    required={!['startDate', 'displayOrder'].includes(key)}
                    type={key === 'displayOrder' ? 'number' : 'text'}
                    value={value[key] ?? ''}
                    onChange={(e) => setValue({ ...value, [key]: e.target.value })}
                  />
                </label>
              ))}
              <label className="admin-field span-2">
                <span>Description</span>
                <textarea
                  rows="3"
                  value={value.description || ''}
                  onChange={(e) => setValue({ ...value, description: e.target.value })}
                />
              </label>
              <label className="admin-field span-2">
                <span>Coursework (one per line)</span>
                <textarea
                  rows="5"
                  value={value.coursework || ''}
                  onChange={(e) => setValue({ ...value, coursework: e.target.value })}
                />
              </label>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={value.visible}
                  onChange={(e) => setValue({ ...value, visible: e.target.checked })}
                />
                <span>Visible publicly</span>
              </label>
              <label className="admin-field">
                <span>Institution logo</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setLogo(e.target.files[0])}
                />
                {value.logoUrl && <small>Current logo is uploaded</small>}
              </label>
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
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      {remove && (
        <ConfirmModal
          title="Delete education entry?"
          description={`Remove ${remove.institution} from the portfolio?`}
          busy={busy}
          onCancel={() => setRemove(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
