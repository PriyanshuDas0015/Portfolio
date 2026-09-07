import { useEffect, useState } from 'react';
import {
  ExternalLink,
  Upload,
  FileText,
  Calendar,
  HardDrive,
  CheckCircle2,
  Trash2,
  Download,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
import FileUploader from '../../components/FileUploader/FileUploader';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
const size = (v) => (v ? `${(v / 1e6).toFixed(2)} MB` : '—');
const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export default function ResumeManager() {
  const notify = useToast();
  const [data, setData] = useState(undefined);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingDelete, setPendingDelete] = useState(null);
  const load = () =>
    adminApi
      .getResume()
      .then(setData)
      .catch((e) => notify(e.message, 'error'));
  useEffect(() => {
    load();
  }, []);
  const upload = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    const form = new FormData();
    form.append('resume', file);
    try {
      await adminApi.uploadResume(form, (e) =>
        setProgress(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
      );
      setFile(null);
      notify('Resume uploaded and activated');
      await load();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  const activate = async (id) => {
    try {
      await adminApi.activateResume(id);
      notify('Active resume changed');
      await load();
    } catch (e) {
      notify(e.message, 'error');
    }
  };
  const remove = async () => {
    try {
      await adminApi.deleteResume(pendingDelete._id);
      notify('Resume deleted');
      setPendingDelete(null);
      await load();
    } catch (e) {
      notify(e.message, 'error');
    }
  };
  if (data === undefined) return <Loading label="Loading resume..." />;
  const resume = data.resume;
  const items = data.items || [];
  return (
    <>
      <div className="page-heading">
        <div>
          <span>PUBLIC DOCUMENT</span>
          <h1>Resume</h1>
          <p>Upload PDF versions and choose which one visitors can download.</p>
        </div>
      </div>
      <div className="resume-admin-grid">
        <section className="form-panel current-resume">
          <h2>Current Resume</h2>
          {resume ? (
            <>
              <div className="resume-file-icon">
                <FileText />
              </div>
              <strong>{resume.fileName}</strong>
              <div className="resume-meta">
                <span>
                  <Calendar />
                  Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                </span>
                <span>
                  <HardDrive />
                  {size(resume.fileSize)}
                </span>
              </div>
              <a
                className="admin-button secondary"
                href={resume.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Resume <ExternalLink />
              </a>
              <a
                className="admin-button secondary"
                href={`${apiBase}/api/public/resume/download`}
                download={resume.fileName}
              >
                Download <Download />
              </a>
            </>
          ) : (
            <div className="empty-state">
              <FileText />
              <h3>No resume uploaded</h3>
            </div>
          )}
        </section>
        <section className="form-panel">
          <h2>Upload new version</h2>
          <p className="panel-help">PDF only, up to 10 MB.</p>
          <FileUploader
            label="Resume PDF"
            kind="pdf"
            accept=".pdf,application/pdf"
            maxSize={10e6}
            file={file}
            onFile={setFile}
          />
          {busy && (
            <div className="upload-progress">
              <div style={{ width: `${progress}%` }} />
              <span>{progress}% uploaded</span>
            </div>
          )}
          <button
            className="admin-button primary upload-button"
            onClick={upload}
            disabled={!file || busy}
          >
            <Upload />
            {busy ? 'Uploading...' : 'Upload Resume'}
          </button>
        </section>
      </div>
      <section className="dashboard-section">
        <div className="subheading">
          <div>
            <span>VERSION HISTORY</span>
            <h2>Previous uploads</h2>
          </div>
        </div>
        <div className="content-list">
          {items.map((item) => (
            <article key={item._id}>
              <span className="order-chip">
                <FileText />
              </span>
              <div>
                <h2>{item.fileName}</h2>
                <p>
                  {new Date(item.uploadedAt).toLocaleString()} · {size(item.fileSize)}
                </p>
                {item.isActive && <small>Active version</small>}
              </div>
              <div className="row-actions">
                <a href={item.fileUrl} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  View
                </a>
                {!item.isActive && (
                  <button onClick={() => activate(item._id)}>
                    <CheckCircle2 />
                    Activate
                  </button>
                )}
                <button className="danger-text" onClick={() => setPendingDelete(item)}>
                  <Trash2 />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      {pendingDelete && (
        <ConfirmModal
          title="Delete resume?"
          description={`Remove ${pendingDelete.fileName}? The newest remaining version will become active.`}
          busy={busy}
          onCancel={() => setPendingDelete(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}
