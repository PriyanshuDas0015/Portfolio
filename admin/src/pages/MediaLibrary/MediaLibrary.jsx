import { useEffect, useMemo, useState } from 'react';
import { Images, Upload, Trash2, FileText, Video } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';

export default function MediaLibrary() {
  const notify = useToast();
  const [items, setItems] = useState(null);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const load = () =>
    adminApi
      .list('media')
      .then((d) => setItems(d.items))
      .catch((e) => notify(e.message, 'error'));
  useEffect(() => {
    load();
  }, []);
  const visible = useMemo(
    () => (items || []).filter((x) => x.fileName.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );
  const upload = async () => {
    if (!file) return;
    setBusy(true);
    const form = new FormData();
    form.append('media', file);
    try {
      await adminApi.create('media', form);
      setFile(null);
      notify('Media uploaded');
      await load();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  const remove = async (item) => {
    try {
      await adminApi.remove('media', item._id);
      notify('Media deleted');
      await load();
    } catch (e) {
      notify(e.message, 'error');
    }
  };
  if (!items) return <Loading />;
  return (
    <>
      <div className="page-heading">
        <div>
          <span>CONTENT ASSETS</span>
          <h1>Media Library</h1>
          <p>Upload and review images, videos and PDF documents.</p>
        </div>
      </div>
      <section className="form-panel">
        <div className="list-toolbar">
          <input
            placeholder="Search media…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button className="admin-button primary" onClick={upload} disabled={!file || busy}>
            <Upload />
            Upload
          </button>
        </div>
      </section>
      <div className="media-library-grid">
        {visible.map((item) => (
          <article key={item._id}>
            {item.resourceType === 'image' ? (
              <img src={item.url} alt="" />
            ) : (
              <div className="media-placeholder">
                {item.resourceType === 'video' ? <Video /> : <FileText />}
              </div>
            )}
            <strong>{item.fileName}</strong>
            <small>
              {item.resourceType.toUpperCase()} · {(item.size / 1e6).toFixed(2)} MB
            </small>
            <small>
              {new Date(item.createdAt).toLocaleDateString()} · {item.usedBy || 'Unused'}
            </small>
            <div className="row-actions">
              <a href={item.url} target="_blank" rel="noreferrer">
                Open
              </a>
              <button
                onClick={() =>
                  navigator.clipboard
                    .writeText(item.url)
                    .then(() => notify('Media URL copied'))
                    .catch(() => notify('Unable to copy URL', 'error'))
                }
              >
                Copy URL
              </button>
              <button
                className="danger-text"
                disabled={Boolean(item.usedBy)}
                onClick={() => remove(item)}
              >
                <Trash2 />
                Delete
              </button>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <div className="empty-state">
            <Images />
            <h2>No media found</h2>
          </div>
        )}
      </div>
    </>
  );
}
