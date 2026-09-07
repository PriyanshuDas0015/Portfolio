import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
const categoryBlank = { name: '', icon: 'code', color: 'purple', displayOrder: 0, visible: true };
const skillBlank = {
  name: '',
  category: '',
  icon: 'code',
  color: 'purple',
  displayOrder: 0,
  level: '',
  proficiency: '',
  visible: true,
};
export default function SkillsManager() {
  const notify = useToast();
  const [categories, setCategories] = useState(null);
  const [skills, setSkills] = useState(null);
  const [mode, setMode] = useState(null);
  const [value, setValue] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () =>
    Promise.all([adminApi.list('skill-categories'), adminApi.list('skills')])
      .then(([a, b]) => {
        setCategories(a.items);
        setSkills(b.items);
      })
      .catch((e) => notify(e.message, 'error'));
  useEffect(() => {
    load();
  }, []);
  const open = (type, item) => {
    setMode(type);
    setValue(
      item
        ? { ...item, category: item.category?._id || item.category }
        : type === 'category'
          ? categoryBlank
          : skillBlank,
    );
  };
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const resource = mode === 'category' ? 'skill-categories' : 'skills';
    try {
      if (value._id) await adminApi.update(resource, value._id, value);
      else await adminApi.create(resource, value);
      notify(value._id ? 'Skill updated successfully' : 'Skill added successfully');
      setMode(null);
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
      await adminApi.remove(remove.resource, remove.item._id);
      notify('Skill deleted');
      setRemove(null);
      await load();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  if (!categories || !skills) return <Loading label="Loading skills..." />;
  return (
    <>
      <div className="page-heading row">
        <div>
          <span>TECHNICAL TOOLKIT</span>
          <h1>Skills</h1>
          <p>Create categories, add skills and control their display order.</p>
        </div>
        <div className="heading-actions">
          <button className="admin-button secondary" onClick={() => open('category')}>
            <Plus />
            Add Category
          </button>
          <button className="admin-button primary" onClick={() => open('skill')}>
            <Plus />
            Add Skill
          </button>
        </div>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <section className="category-card" key={category._id}>
            <header>
              <div>
                <span className={`category-dot color-${category.color}`} />
                <h2>{category.name}</h2>
              </div>
              <div>
                <button
                  onClick={() => open('category', category)}
                  aria-label={`Edit ${category.name}`}
                >
                  <Pencil />
                </button>
                <button
                  onClick={() => setRemove({ resource: 'skill-categories', item: category })}
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 />
                </button>
              </div>
            </header>
            <div className="skill-list">
              {skills
                .filter((skill) => (skill.category?._id || skill.category) === category._id)
                .map((skill) => (
                  <div key={skill._id}>
                    <span>{skill.name}</span>
                    <small>{skill.icon}</small>
                    {skill.level && <small>{skill.level}</small>}
                    {skill.proficiency != null && <small>{skill.proficiency}%</small>}
                    <button onClick={() => open('skill', skill)}>
                      <Pencil />
                    </button>
                    <button onClick={() => setRemove({ resource: 'skills', item: skill })}>
                      <Trash2 />
                    </button>
                  </div>
                ))}
              {!skills.some(
                (skill) => (skill.category?._id || skill.category) === category._id,
              ) && <p>No skills in this category.</p>}
            </div>
          </section>
        ))}
      </div>
      {mode && (
        <div className="modal-backdrop">
          <form className="editor-modal" onSubmit={save}>
            <header>
              <div>
                <span>{value._id ? 'EDIT' : 'ADD'}</span>
                <h2>{mode === 'category' ? 'Skill Category' : 'Skill'}</h2>
              </div>
              <button type="button" onClick={() => setMode(null)} aria-label="Close">
                <X />
              </button>
            </header>
            <label className="admin-field">
              <span>{mode === 'category' ? 'Category Name' : 'Skill Name'} *</span>
              <input
                value={value.name}
                maxLength="80"
                required
                onChange={(e) => setValue({ ...value, name: e.target.value })}
              />
            </label>
            {mode === 'skill' && (
              <label className="admin-field">
                <span>Category *</span>
                <select
                  required
                  value={value.category}
                  onChange={(e) => setValue({ ...value, category: e.target.value })}
                >
                  <option value="">Choose category</option>
                  {categories.map((c) => (
                    <option value={c._id} key={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="form-grid">
              {mode === 'skill' && (
                <label className="admin-field">
                  <span>Level</span>
                  <input
                    value={value.level || ''}
                    placeholder="e.g. Intermediate"
                    onChange={(e) => setValue({ ...value, level: e.target.value })}
                  />
                </label>
              )}
              {mode === 'skill' && (
                <label className="admin-field">
                  <span>Proficiency percentage (optional)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={value.proficiency ?? ''}
                    placeholder="e.g. 85"
                    onChange={(e) => setValue({ ...value, proficiency: e.target.value })}
                  />
                </label>
              )}
              <label className="admin-field">
                <span>Lucide icon name</span>
                <select
                  value={value.icon}
                  onChange={(e) => setValue({ ...value, icon: e.target.value })}
                >
                  {['code', 'server', 'database', 'terminal', 'tools', 'layers', 'sparkles'].map(
                    (i) => (
                      <option key={i}>{i}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={value.visible !== false}
                  onChange={(e) => setValue({ ...value, visible: e.target.checked })}
                />
                <span>Visible publicly</span>
              </label>
              <label className="admin-field">
                <span>Color</span>
                <select
                  value={value.color}
                  onChange={(e) => setValue({ ...value, color: e.target.value })}
                >
                  {['purple', 'blue', 'green', 'pink', 'cyan'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Display Order</span>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={value.displayOrder}
                  onChange={(e) => setValue({ ...value, displayOrder: e.target.value })}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="admin-button secondary"
                onClick={() => setMode(null)}
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
          title={`Delete ${remove.item.name}?`}
          description="This removes the item from the public portfolio. Delete skills in a category before deleting that category."
          busy={busy}
          onCancel={() => setRemove(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
