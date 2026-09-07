import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Boxes,
  MessagesSquare,
  Plus,
  FileUp,
  ArrowRight,
  Award,
  UserRound,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import StatCard from '../../components/StatCard/StatCard';
import Loading from '../../components/Loading/Loading';
const actions = [
  ['Add Project', 'Create and publish a portfolio project.', '/projects/new', Plus],
  ['Add Certificate', 'Publish a credential or award.', '/certificates', Award],
  ['Upload Resume', 'Upload a new public PDF version.', '/resume', FileUp],
  ['Add Skill', 'Keep your technical toolkit current.', '/skills', Boxes],
  ['Edit Profile', 'Update your identity, photo and About text.', '/profile', UserRound],
  ['View Messages', 'Read and manage visitor messages.', '/messages', MessagesSquare],
];
export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    adminApi
      .dashboard()
      .then(setDashboard)
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);
  const counts = dashboard?.counts;
  return (
    <>
      <div className="page-heading">
        <div>
          <span>PORTFOLIO CMS</span>
          <h1>Dashboard</h1>
          <p>Manage your portfolio from one place.</p>
        </div>
      </div>
      {error && (
        <div className="error-panel">
          {error}
          <button onClick={load}>Retry</button>
        </div>
      )}
      {!counts ? (
        <Loading />
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={FolderKanban}
              label="Projects"
              value={counts.projects}
              accent="#8b7cff"
            />
            <StatCard icon={Boxes} label="Skills" value={counts.skills} accent="#33c7df" />
            <StatCard
              icon={Award}
              label="Certificates"
              value={counts.certificates || 0}
              accent="#65d8a8"
            />
            <StatCard
              icon={UserRound}
              label="Experiences"
              value={counts.experience}
              accent="#e995bd"
            />
          </div>
          <div className="dashboard-metrics form-panel">
            <div>
              <small>Current Resume</small>
              <strong>{dashboard.currentResume?.fileName || 'Not uploaded'}</strong>
            </div>
            <div>
              <small>Published Projects</small>
              <strong>{counts.publishedProjects ?? counts.projects}</strong>
            </div>
            <div>
              <small>Unread Messages</small>
              <strong>{counts.unreadMessages}</strong>
            </div>
            <div>
              <small>Last Updated</small>
              <strong>
                {dashboard.lastContentUpdate
                  ? new Date(dashboard.lastContentUpdate).toLocaleDateString()
                  : 'No updates yet'}
              </strong>
            </div>
          </div>
        </>
      )}
      <section className="dashboard-section">
        <div className="subheading">
          <div>
            <span>QUICK ACTIONS</span>
            <h2>What would you like to update?</h2>
          </div>
        </div>
        <div className="quick-grid">
          {actions.map(([title, description, to, Icon]) => (
            <button key={title} onClick={() => navigate(to)}>
              <span>
                <Icon />
              </span>
              <div>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
              <ArrowRight />
            </button>
          ))}
        </div>
      </section>
      {dashboard?.recentUpdates?.length > 0 && (
        <section className="dashboard-section">
          <div className="subheading">
            <div>
              <span>RECENT UPDATES</span>
              <h2>Latest content changes</h2>
            </div>
          </div>
          <div className="content-list">
            {dashboard.recentUpdates.map((update) => (
              <article key={`${update.type}-${update.updatedAt}`}>
                <span className="order-chip">{update.type.slice(0, 1)}</span>
                <div>
                  <h2>{update.title}</h2>
                  <p>{update.type}</p>
                  <small>{new Date(update.updatedAt).toLocaleString()}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
