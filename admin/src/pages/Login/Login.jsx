import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, UserRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (admin) return <Navigate to="/admin/dashboard" replace />;
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (values.identifier.trim().length < 3 || values.password.length < 8) {
      setError('Enter your username or email and password.');
      return;
    }
    setBusy(true);
    try {
      await login(values);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="login-page">
      <div className="login-glow" />
      <section className="login-card">
        <div className="admin-logo">
          PD<span>.</span>
        </div>
        <p className="login-kicker">SECURE PORTFOLIO ACCESS</p>
        <h1>Admin Login</h1>
        <p>Manage your portfolio content</p>
        <form onSubmit={submit}>
          <label>
            <span>Email or username</span>
            <div className="input-with-icon">
              <UserRound />
              <input
                type="text"
                autoComplete="username"
                value={values.identifier}
                onChange={(e) => setValues({ ...values, identifier: e.target.value })}
                placeholder="username or you@example.com"
                required
              />
            </div>
          </label>
          <label>
            <span>Password</span>
            <div className="input-with-icon">
              <LockKeyhole />
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                placeholder="Your password"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}
          <button className="admin-button primary login-button" disabled={busy}>
            {busy ? (
              'Signing in...'
            ) : (
              <>
                Login <ArrowRight />
              </>
            )}
          </button>
        </form>
        <small>Protected with encrypted authentication</small>
      </section>
    </main>
  );
}
