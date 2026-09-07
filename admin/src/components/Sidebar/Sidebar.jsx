import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  UserRound,
  Boxes,
  FolderKanban,
  Route,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  Contact,
  MessagesSquare,
  Settings,
  LogOut,
  X,
  Award,
  Images,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const groups = [
  {
    label: 'Website',
    links: [
      ['Hero', '/hero', Sparkles],
      ['Profile / About', '/profile', UserRound],
      ['Skills', '/skills', Boxes],
      ['Projects', '/projects', FolderKanban],
      ['Experience', '/experience', Route],
      ['Education', '/education', GraduationCap],
      ['Certificates', '/certificates', Award],
      ['Services', '/services', BriefcaseBusiness],
      ['Resume', '/resume', FileText],
    ],
  },
  {
    label: 'Communication',
    links: [
      ['Contact Information', '/contact', Contact],
      ['Social Links', '/social-links', Share2],
      ['Messages', '/messages', MessagesSquare],
    ],
  },
  { label: 'Content', links: [['Media Library', '/media', Images]] },
  {
    label: 'Settings',
    links: [
      ['Settings', '/settings', Settings],
      ['Admin Account', '/account', ShieldCheck],
    ],
  },
];

export default function Sidebar({ open, onClose, unread = 0, compact = false }) {
  const { logout } = useAuth();
  return (
    <>
      <div className={`sidebar-scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`admin-sidebar ${open ? 'open' : ''} ${compact ? 'compact' : ''}`}>
        <div className="sidebar-brand">
          <div className="admin-logo">
            PD<span>.</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close navigation">
            <X />
          </button>
        </div>
        <nav aria-label="Admin navigation">
          <NavLink end to="/" onClick={onClose}>
            <LayoutDashboard />
            <span>Dashboard</span>
          </NavLink>
          {groups.map((group) => (
            <div className="sidebar-group" key={group.label}>
              <small>{group.label}</small>
              {group.links.map(([label, to, Icon]) => (
                <NavLink key={to} to={to} onClick={onClose}>
                  <Icon />
                  <span>{label}</span>
                  {label === 'Messages' && unread > 0 && <b>{unread}</b>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <button className="logout-button" onClick={logout}>
          <LogOut />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
