import { AlertTriangle } from 'lucide-react';
export default function ConfirmModal({ title, description, busy, onConfirm, onCancel }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="danger-icon">
          <AlertTriangle />
        </div>
        <h2 id="confirm-title">{title}</h2>
        <p>{description}</p>
        <div className="modal-actions">
          <button className="admin-button secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="admin-button danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
