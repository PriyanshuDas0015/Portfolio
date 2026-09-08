import Project from '../models/Project.js';
import { uploadBuffer, destroyMedia, trackMedia } from '../services/cloudinaryService.js';
import MediaAsset from '../models/MediaAsset.js';

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const parseJsonField = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
const normalize = (body) => ({
  ...body,
  technologies: parseJsonField(body.technologies, body.technologies || []),
  features: parseJsonField(body.features, body.features || []),
  featured: body.featured === true || body.featured === 'true',
  published: body.published === true || body.published === 'true',
  displayOrder: Number(body.displayOrder || 0),
});

export async function createProject(req, res) {
  req.body = normalize(req.body);
  const data = req.projectSchema.parse(req.body);
  const baseSlug = data.slug || slugify(data.title);
  let slug = baseSlug;
  for (let suffix = 2; await Project.exists({ slug }); suffix += 1) slug = `${baseSlug}-${suffix}`;
  const imageFile = req.files?.image?.[0];
  const logoFile = req.files?.logo?.[0];
  const galleryFiles = req.files?.gallery || [];
  const videoFile = req.files?.demoVideo?.[0];
  for (const file of [imageFile, logoFile, ...galleryFiles].filter(Boolean))
    if (file.size > 5e6)
      return res.status(400).json({ success: false, message: 'Images must be 5 MB or smaller.' });
  const [image, logo, gallery, video] = await Promise.all([
    imageFile ? uploadBuffer(imageFile, 'projects') : null,
    logoFile ? uploadBuffer(logoFile, 'project-logos') : null,
    Promise.all(galleryFiles.map((file) => uploadBuffer(file, 'project-gallery'))),
    videoFile ? uploadBuffer(videoFile, 'videos', 'video') : null,
  ]);
  const project = await Project.create({
    ...data,
    slug,
    imageUrl: image?.secure_url || '',
    imagePublicId: image?.public_id || '',
    logoUrl: logo?.secure_url || '',
    logoPublicId: logo?.public_id || '',
    gallery: gallery.map((asset, index) => ({
      url: asset.secure_url,
      publicId: asset.public_id,
      fileName: galleryFiles[index].originalname,
      size: asset.bytes || galleryFiles[index].size,
    })),
    demoVideoUrl: video?.secure_url || '',
    demoVideoPublicId: video?.public_id || '',
  });
  await Promise.all([
    trackMedia(
      image,
      imageFile,
      'projects',
      'image',
      `Project cover: ${project.title}`,
      project._id,
    ),
    trackMedia(
      logo,
      logoFile,
      'project-logos',
      'image',
      `Project logo: ${project.title}`,
      project._id,
    ),
    ...gallery.map((asset, index) =>
      trackMedia(
        asset,
        galleryFiles[index],
        'project-gallery',
        'image',
        `Project gallery: ${project.title}`,
        project._id,
      ),
    ),
    trackMedia(video, videoFile, 'videos', 'video', `Project video: ${project.title}`, project._id),
  ]);
  res.status(201).json({ success: true, item: project });
}

export async function updateProject(req, res) {
  req.body = normalize(req.body);
  const data = req.projectSchema.parse(req.body);
  const existing = await Project.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Project not found.' });
  if (
    data.slug &&
    data.slug !== existing.slug &&
    (await Project.exists({ slug: data.slug, _id: { $ne: existing._id } }))
  )
    return res
      .status(409)
      .json({ success: false, message: 'That project slug is already in use.' });
  const imageFile = req.files?.image?.[0];
  const logoFile = req.files?.logo?.[0];
  const galleryFiles = req.files?.gallery || [];
  const videoFile = req.files?.demoVideo?.[0];
  for (const file of [imageFile, logoFile, ...galleryFiles].filter(Boolean))
    if (file.size > 5e6)
      return res.status(400).json({ success: false, message: 'Images must be 5 MB or smaller.' });
  const [image, logo, gallery, video] = await Promise.all([
    imageFile ? uploadBuffer(imageFile, 'projects') : null,
    logoFile ? uploadBuffer(logoFile, 'project-logos') : null,
    Promise.all(galleryFiles.map((file) => uploadBuffer(file, 'project-gallery'))),
    videoFile ? uploadBuffer(videoFile, 'videos', 'video') : null,
  ]);
  const oldImage = image && existing.imagePublicId;
  const oldLogo = logo && existing.logoPublicId;
  const oldVideo = video && existing.demoVideoPublicId;
  Object.assign(existing, data, {
    ...(image ? { imageUrl: image.secure_url, imagePublicId: image.public_id } : {}),
    ...(logo ? { logoUrl: logo.secure_url, logoPublicId: logo.public_id } : {}),
    ...(gallery.length
      ? {
          gallery: [
            ...existing.gallery,
            ...gallery.map((asset, index) => ({
              url: asset.secure_url,
              publicId: asset.public_id,
              fileName: galleryFiles[index].originalname,
              size: asset.bytes || galleryFiles[index].size,
            })),
          ],
        }
      : {}),
    ...(video ? { demoVideoUrl: video.secure_url, demoVideoPublicId: video.public_id } : {}),
  });
  await existing.save();
  await Promise.all([
    destroyMedia(oldImage),
    destroyMedia(oldLogo),
    destroyMedia(oldVideo, 'video'),
    oldImage ? MediaAsset.deleteOne({ publicId: oldImage }) : null,
    oldLogo ? MediaAsset.deleteOne({ publicId: oldLogo }) : null,
    oldVideo ? MediaAsset.deleteOne({ publicId: oldVideo }) : null,
    trackMedia(
      image,
      imageFile,
      'projects',
      'image',
      `Project cover: ${existing.title}`,
      existing._id,
    ),
    trackMedia(
      logo,
      logoFile,
      'project-logos',
      'image',
      `Project logo: ${existing.title}`,
      existing._id,
    ),
    ...gallery.map((asset, index) =>
      trackMedia(
        asset,
        galleryFiles[index],
        'project-gallery',
        'image',
        `Project gallery: ${existing.title}`,
        existing._id,
      ),
    ),
    trackMedia(
      video,
      videoFile,
      'videos',
      'video',
      `Project video: ${existing.title}`,
      existing._id,
    ),
  ]);
  res.json({ success: true, item: existing });
}

export async function deleteProject(req, res) {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  await Promise.all([
    destroyMedia(project.imagePublicId),
    destroyMedia(project.logoPublicId),
    ...project.gallery.map((asset) => destroyMedia(asset.publicId)),
    destroyMedia(project.demoVideoPublicId, 'video'),
    MediaAsset.deleteMany({ recordId: project._id }),
  ]);
  res.json({ success: true });
}

export async function deleteProjectGalleryImage(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  const asset = project.gallery.id(req.params.assetId);
  if (!asset) return res.status(404).json({ success: false, message: 'Gallery image not found.' });
  const publicId = asset.publicId;
  asset.deleteOne();
  await project.save();
  await Promise.all([destroyMedia(publicId), MediaAsset.deleteOne({ publicId })]);
  res.json({ success: true, item: project });
}

export async function deleteProjectMedia(req, res) {
  const mediaFields = {
    image: ['imageUrl', 'imagePublicId'],
    logo: ['logoUrl', 'logoPublicId'],
  };
  const fields = mediaFields[req.params.kind];
  if (!fields) return res.status(400).json({ success: false, message: 'Unsupported media type.' });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
  const [urlField, publicIdField] = fields;
  const publicId = project[publicIdField];
  project[urlField] = '';
  project[publicIdField] = '';
  await project.save();
  await Promise.all([destroyMedia(publicId), publicId ? MediaAsset.deleteOne({ publicId }) : null]);
  res.json({ success: true, item: project });
}
