import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Home,
  Music2,
  Camera,
  FolderKanban,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
const fallback = { red: 'N', green: Music2, pink: Camera, blue: Home };
export default function ProjectsManager() {
  const navigate = useNavigate();
  const notify = useToast();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const load = () =>
    adminApi
      .list('projects')
      .then((d) => {
        setItems(d.items);
        setError('');
      })
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  const confirm = async () => {
    setBusy(true);
    try {
      await adminApi.remove('projects', remove._id);
      setItems((v) => v.filter((x) => x._id !== remove._id));
      notify('Project deleted');
      setRemove(null);
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="page-heading row">
        <div>
          <span>PORTFOLIO CONTENT</span>
          <h1>Projects</h1>
          <p>Add, edit, reorder and publish your work.</p>
        </div>
        <button className="admin-button primary" onClick={() => navigate('/projects/new')}>
          <Plus />
          Add Project
        </button>
      </div>
      {error && (
        <div className="error-panel">
          {error}
          <button onClick={load}>Retry</button>
        </div>
      )}
      {items === null ? (
        <Loading label="Loading projects..." />
      ) : (
        <div className="project-admin-list">
          <div className="list-toolbar">
            <input
              aria-label="Search projects"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              aria-label="Filter projects"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All projects</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          {items
            .filter(
              (item) =>
                item.title.toLowerCase().includes(search.toLowerCase()) &&
                (filter === 'all' ||
                  (filter === 'published'
                    ? item.published
                    : filter === 'draft'
                      ? !item.published
                      : item.featured)),
            )
            .map((item) => {
              const Fallback = fallback[item.color] || ImageIcon;
              return (
                <article key={item._id}>
                  <div className={`project-thumb color-${item.color}`}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" />
                    ) : typeof Fallback === 'string' ? (
                      <b>{Fallback}</b>
                    ) : (
                      <Fallback />
                    )}
                  </div>
                  <div className="project-admin-info">
                    <div>
                      <h2>{item.title}</h2>
                      {item.featured && <span className="status featured">Featured</span>}
                      <span className={`status ${item.published ? 'ready' : ''}`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p>{item.role}</p>
                    <div className="tag-row">
                      {item.technologies.slice(0, 5).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="link-status">
                    <span className={item.liveUrl ? 'ready' : ''}>
                      <ExternalLink />
                      {item.liveUrl ? 'Live connected' : 'No live URL'}
                    </span>
                    <span className={item.githubUrl ? 'ready' : ''}>
                      <Github />
                      {item.githubUrl ? 'GitHub connected' : 'No GitHub URL'}
                    </span>
                  </div>
                  <div className="row-actions">
                    <button onClick={() => navigate(`/projects/${item._id}/edit`)}>
                      <Pencil />
                      Edit
                    </button>
                    <button className="danger-text" onClick={() => setRemove(item)}>
                      <Trash2 />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          {items.length === 0 && (
            <div className="empty-state">
              <FolderKanban />
              <h2>No projects yet</h2>
              <p>Add your first project to publish it on the portfolio.</p>
            </div>
          )}
        </div>
      )}
      {remove && (
        <ConfirmModal
          title="Delete Project?"
          description={`Are you sure you want to delete “${remove.title}”? This cannot be undone.`}
          busy={busy}
          onCancel={() => setRemove(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
