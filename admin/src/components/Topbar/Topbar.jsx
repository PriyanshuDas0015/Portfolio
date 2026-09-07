import { ExternalLink, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export default function Topbar({ onMenu, onCollapse, compact }) {
  const { admin } = useAuth();
  return (
    <header className="admin-topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Open navigation">
        <Menu />
      </button>
      <button
        className="collapse-button"
        onClick={onCollapse}
        aria-label={compact ? 'Expand navigation' : 'Collapse navigation'}
      >
        {compact ? <PanelLeftOpen /> : <PanelLeftClose />}
      </button>
      <div>
        <span className="online-dot" />
        Portfolio CMS
      </div>
      <div className="topbar-actions">
        <a
          href={import.meta.env.VITE_PUBLIC_URL || 'http://127.0.0.1:5173'}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Portfolio <ExternalLink />
        </a>
        <span>{admin?.name || admin?.email}</span>
      </div>
    </header>
  );
}
