import { useEffect, useState } from 'react';
import { Save, KeyRound } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';

export default function AccountSettings() {
  const notify = useToast();
  const [profile, setProfile] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    adminApi
      .getAccount()
      .then((d) => setProfile(d.admin))
      .catch((e) => notify(e.message, 'error'));
  }, []);
  if (!profile) return <Loading />;
  const saveProfile = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await adminApi.updateAccount({
        username: profile.username,
        name: profile.name,
        email: profile.email,
      });
      setProfile(d.admin);
      notify('Account profile updated');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword)
      return notify('New passwords do not match.', 'error');
    setBusy(true);
    try {
      await adminApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      notify('Password updated');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <span>SECURITY</span>
          <h1>Admin Account</h1>
          <p>Update the administrator identity and password.</p>
        </div>
      </div>
      <div className="resume-admin-grid">
        <form className="form-panel" onSubmit={saveProfile}>
          <h2>Profile</h2>
          {[
            ['username', 'Username', 'text'],
            ['name', 'Name', 'text'],
            ['email', 'Email', 'email'],
          ].map(([key, label, type]) => (
            <label className="admin-field" key={key}>
              <span>{label}</span>
              <input
                required
                type={type}
                value={profile[key] || ''}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              />
            </label>
          ))}
          <button className="admin-button primary" disabled={busy}>
            <Save />
            Save Profile
          </button>
        </form>
        <form className="form-panel" onSubmit={savePassword}>
          <h2>Change password</h2>
          {[
            ['currentPassword', 'Current password'],
            ['newPassword', 'New password'],
            ['confirmPassword', 'Confirm new password'],
          ].map(([key, label]) => (
            <label className="admin-field" key={key}>
              <span>{label}</span>
              <input
                required
                minLength={key === 'currentPassword' ? 8 : 12}
                type="password"
                value={passwords[key]}
                onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
              />
            </label>
          ))}
          <button className="admin-button primary" disabled={busy}>
            <KeyRound />
            Update Password
          </button>
        </form>
      </div>
    </>
  );
}
