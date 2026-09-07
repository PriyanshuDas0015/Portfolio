import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Save } from 'lucide-react';
import Loading from '../../components/Loading/Loading';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../services/adminApi';

export default function ProfileManager() {
  const notify = useToast();
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const preview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : profile?.profileImageUrl),
    [photo, profile],
  );

  useEffect(() => {
    adminApi
      .getProfile()
      .then((data) => setProfile(data.profile))
      .catch((error) => notify(error.message, 'error'));
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    const body = new FormData();
    [
      'name',
      'professionalTitle',
      'shortIntroduction',
      'fullAbout',
      'location',
      'email',
      'phone',
    ].forEach((key) => body.append(key, profile[key] || ''));
    if (photo) body.append('profileImage', photo);
    try {
      const data = await adminApi.updateProfile(body);
      setProfile(data.profile);
      setPhoto(null);
      notify('Profile and About content updated');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  if (!profile) return <Loading label="Loading profile..." />;
  const change = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  return (
    <>
      <div className="page-heading">
        <div>
          <span>PUBLIC IDENTITY</span>
          <h1>Profile / About</h1>
          <p>Update the personal details shown throughout the public portfolio.</p>
        </div>
      </div>
      <form className="form-panel" onSubmit={save}>
        <div className="form-grid">
          <label className="admin-field">
            <span>Full name *</span>
            <input
              required
              maxLength="80"
              value={profile.name}
              onChange={(e) => change('name', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Professional title *</span>
            <input
              required
              maxLength="100"
              value={profile.professionalTitle}
              onChange={(e) => change('professionalTitle', e.target.value)}
            />
          </label>
          <label className="admin-field span-2">
            <span>Short introduction</span>
            <textarea
              rows="3"
              maxLength="240"
              value={profile.shortIntroduction}
              onChange={(e) => change('shortIntroduction', e.target.value)}
            />
          </label>
          <label className="admin-field span-2">
            <span>Full About text *</span>
            <textarea
              required
              rows="7"
              maxLength="1000"
              value={profile.fullAbout}
              onChange={(e) => change('fullAbout', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Location *</span>
            <input
              required
              maxLength="120"
              value={profile.location}
              onChange={(e) => change('location', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Public email *</span>
            <input
              required
              type="email"
              value={profile.email}
              onChange={(e) => change('email', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Phone (optional)</span>
            <input
              type="tel"
              maxLength="30"
              value={profile.phone}
              onChange={(e) => change('phone', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Profile photo (PNG, JPG or WebP, up to 5 MB)</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setPhoto(e.target.files[0] || null)}
            />
          </label>
        </div>
        {preview ? (
          <img className="profile-photo-preview" src={preview} alt="Profile preview" />
        ) : (
          <div className="profile-photo-empty">
            <ImagePlus /> No profile photo uploaded
          </div>
        )}
        <button className="admin-button primary" disabled={busy}>
          <Save /> {busy ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </>
  );
}
