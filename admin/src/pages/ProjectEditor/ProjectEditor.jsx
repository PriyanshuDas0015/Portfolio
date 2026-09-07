import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import FormInput from '../../components/FormInput/FormInput';
import FileUploader from '../../components/FileUploader/FileUploader';
import Loading from '../../components/Loading/Loading';
import TagInput from '../../components/TagInput/TagInput';
const blank = {
  title: '',
  slug: '',
  category: 'Frontend',
  role: '',
  shortDescription: '',
  fullDescription: '',
  technologies: '',
  features: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
  published: true,
  displayOrder: 0,
  color: 'blue',
};
const isUrl = (value) => !value || /^https?:\/\//i.test(value);
export default function ProjectEditor() {
  const { id } = useParams();
  const edit = Boolean(id);
  const navigate = useNavigate();
  const notify = useToast();
  const [values, setValues] = useState(blank);
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [video, setVideo] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(edit);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!edit) return;
    adminApi
      .list('projects')
      .then((d) => {
        const item = d.items.find((x) => x._id === id);
        if (!item) throw new Error('Project not found.');
        setCurrent(item);
        setValues({
          ...item,
          technologies: item.technologies.join(', '),
          features: item.features.join('\n'),
        });
      })
      .catch((e) => notify(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [edit, id, notify]);
  const imagePreview = useMemo(
    () => (image ? URL.createObjectURL(image) : current?.imageUrl),
    [image, current],
  );
  const logoPreview = useMemo(
    () => (logo ? URL.createObjectURL(logo) : current?.logoUrl),
    [logo, current],
  );
  const change = (e) =>
    setValues((v) => ({
      ...v,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!values.title.trim()) next.title = 'Project title is required.';
    if (!values.role.trim()) next.role = 'Role is required.';
    if (!values.shortDescription.trim()) next.shortDescription = 'Short description is required.';
    if (!isUrl(values.githubUrl)) next.githubUrl = 'Enter a full http(s) URL.';
    if (!isUrl(values.liveUrl)) next.liveUrl = 'Enter a full http(s) URL.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    const form = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      form.append(
        key,
        ['technologies', 'features'].includes(key)
          ? JSON.stringify(
              String(value)
                .split(key === 'features' ? /\n/ : /,/)
                .map((x) => x.trim())
                .filter(Boolean),
            )
          : value,
      ),
    );
    if (image) form.append('image', image);
    if (logo) form.append('logo', logo);
    gallery.forEach((file) => form.append('gallery', file));
    if (video) form.append('demoVideo', video);
    try {
      if (edit) await adminApi.update('projects', id, form);
      else await adminApi.create('projects', form);
      notify(edit ? 'Project updated successfully' : 'Project added successfully');
      navigate('/projects');
    } catch (err) {
      setErrors(err.errors || {});
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  const removeGalleryImage = async (asset) => {
    try {
      const data = await adminApi.deleteProjectGalleryImage(id, asset._id);
      setCurrent(data.item);
      notify('Gallery image removed');
    } catch (error) {
      notify(error.message, 'error');
    }
  };
  if (loading) return <Loading label="Loading project..." />;
  return (
    <>
      <button className="back-link" onClick={() => navigate('/projects')}>
        <ArrowLeft />
        Back to projects
      </button>
      <div className="page-heading">
        <div>
          <span>{edit ? 'EDIT PROJECT' : 'NEW PROJECT'}</span>
          <h1>{edit ? `Update ${current?.title}` : 'Add a project'}</h1>
          <p>Fields marked required appear on the public portfolio after saving.</p>
        </div>
      </div>
      <form className="editor-form" onSubmit={submit}>
        <section className="form-panel">
          <h2>Project details</h2>
          <div className="form-grid">
            <FormInput
              label="Project Title *"
              name="title"
              value={values.title}
              onChange={change}
              maxLength="100"
              error={errors.title}
            />
            <FormInput
              label="URL Slug"
              name="slug"
              value={values.slug || ''}
              onChange={change}
              maxLength="120"
              error={errors.slug}
            />
            <FormInput
              label="Role *"
              name="role"
              value={values.role}
              onChange={change}
              maxLength="100"
              error={errors.role}
            />
            <FormInput
              label="Category *"
              name="category"
              value={values.category}
              onChange={change}
              maxLength="60"
              error={errors.category}
            />
            <FormInput
              label="Display Order"
              name="displayOrder"
              type="number"
              min="0"
              max="999"
              value={values.displayOrder}
              onChange={change}
              error={errors.displayOrder}
            />
            <FormInput
              className="span-2"
              label="Short Description *"
              name="shortDescription"
              as="textarea"
              rows="3"
              maxLength="240"
              value={values.shortDescription}
              onChange={change}
              error={errors.shortDescription}
            />
            <FormInput
              className="span-2"
              label="Full Description"
              name="fullDescription"
              as="textarea"
              rows="5"
              maxLength="2000"
              value={values.fullDescription}
              onChange={change}
              error={errors.fullDescription}
            />
            <TagInput
              label="Technologies"
              value={values.technologies}
              onChange={(technologies) => setValues((current) => ({ ...current, technologies }))}
            />
            <FormInput
              label="Features (one per line)"
              name="features"
              as="textarea"
              rows="4"
              value={values.features}
              onChange={change}
            />
            <FormInput
              label="GitHub URL"
              name="githubUrl"
              type="url"
              value={values.githubUrl}
              onChange={change}
              error={errors.githubUrl}
            />
            <FormInput
              label="Live Demo URL"
              name="liveUrl"
              type="url"
              value={values.liveUrl}
              onChange={change}
              error={errors.liveUrl}
            />
            <label className="admin-field">
              <span>Accent color</span>
              <select name="color" value={values.color} onChange={change}>
                {['blue', 'red', 'green', 'pink', 'purple', 'cyan'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="checkbox-field">
              <input type="checkbox" name="featured" checked={values.featured} onChange={change} />
              <span>Feature this project</span>
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="published"
                checked={values.published}
                onChange={change}
              />
              <span>Published on portfolio</span>
            </label>
          </div>
        </section>
        <section className="form-panel">
          <h2>Project media</h2>
          <p className="panel-help">
            Images upload to Cloudinary when you save. PNG, JPG and WebP up to 5 MB.
          </p>
          <div className="media-grid">
            <FileUploader
              label="Project cover"
              accept="image/png,image/jpeg,image/webp"
              maxSize={5e6}
              onFile={setImage}
              file={image}
            />
            <FileUploader
              label="Project logo"
              accept="image/png,image/jpeg,image/webp"
              maxSize={5e6}
              onFile={setLogo}
              file={logo}
            />
            <label className="admin-field">
              <span>Gallery images (up to 8)</span>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setGallery(Array.from(e.target.files || []).slice(0, 8))}
              />
              <small>{gallery.length ? `${gallery.length} selected` : 'Optional'}</small>
            </label>
            <FileUploader
              label="Demo video"
              accept="video/mp4,video/webm"
              maxSize={50e6}
              onFile={setVideo}
              file={video}
            />
          </div>
          {(imagePreview || logoPreview) && (
            <div className="preview-row">
              {imagePreview && <img src={imagePreview} alt="Selected project cover preview" />}
              {logoPreview && <img src={logoPreview} alt="Selected project logo preview" />}
            </div>
          )}
          {current?.gallery?.length > 0 && (
            <div className="preview-row">
              {current.gallery.map((asset) => (
                <div className="gallery-admin-preview" key={asset._id}>
                  <img src={asset.url} alt="Project gallery" />
                  <button
                    type="button"
                    aria-label="Remove gallery image"
                    onClick={() => removeGalleryImage(asset)}
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        <div className="sticky-save">
          <button
            type="button"
            className="admin-button secondary"
            onClick={() => navigate('/projects')}
          >
            Cancel
          </button>
          <button className="admin-button primary" disabled={busy}>
            <Save />
            {busy ? 'Saving...' : edit ? 'Update Project' : 'Save Project'}
          </button>
        </div>
      </form>
    </>
  );
}
