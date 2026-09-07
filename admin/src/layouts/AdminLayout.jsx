import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/adminApi';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import Loading from '../components/Loading/Loading';
export default function AdminLayout() {
  const { admin, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    if (admin)
      adminApi
        .dashboard()
        .then((d) => setUnread(d.counts.unreadMessages))
        .catch(() => {});
  }, [admin]);
  if (loading) return <Loading label="Checking your session..." />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return (
    <div className={`admin-shell ${compact ? 'sidebar-compact' : ''}`}>
      <Sidebar open={open} onClose={() => setOpen(false)} unread={unread} compact={compact} />
      <div className="admin-workspace">
        <Topbar
          onMenu={() => setOpen(true)}
          onCollapse={() => setCompact((value) => !value)}
          compact={compact}
        />
        <main className="admin-main">
          <Outlet
            context={{
              refreshUnread: () =>
                adminApi.dashboard().then((d) => setUnread(d.counts.unreadMessages)),
            }}
          />
        </main>
      </div>
    </div>
  );
}
