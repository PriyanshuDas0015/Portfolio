import Education from '../models/Education.js';
import MediaAsset from '../models/MediaAsset.js';
import { destroyMedia, trackMedia, uploadBuffer } from '../services/cloudinaryService.js';

const parseCoursework = (value) => {
  if (Array.isArray(value)) return value;
  try {
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};
const normalize = (body) => ({
  ...body,
  coursework: parseCoursework(body.coursework),
  displayOrder: Number(body.displayOrder || 0),
  visible: body.visible === true || body.visible === 'true',
});
export async function listEducation(req, res) {
  const items = await Education.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
  res.json({ success: true, items });
}
export async function createEducation(req, res) {
  const data = req.educationSchema.parse(normalize(req.body));
  const logo = req.file ? await uploadBuffer(req.file, 'education') : null;
  let item;
  try {
    item = await Education.create({
      ...data,
      logoUrl: logo?.secure_url || '',
      logoPublicId: logo?.public_id || '',
    });
    await trackMedia(
      logo,
      req.file,
      'education',
      'image',
      `Education logo: ${item.institution}`,
      item._id,
    );
  } catch (error) {
    await destroyMedia(logo?.public_id);
    if (item) await item.deleteOne();
    throw error;
  }
  res.status(201).json({ success: true, item });
}
export async function updateEducation(req, res) {
  const data = req.educationSchema.parse(normalize(req.body));
  const item = await Education.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Education entry not found.' });
  const logo = req.file ? await uploadBuffer(req.file, 'education') : null;
  const oldLogo = logo && item.logoPublicId;
  Object.assign(item, data, logo ? { logoUrl: logo.secure_url, logoPublicId: logo.public_id } : {});
  await item.save();
  await Promise.all([
    destroyMedia(oldLogo),
    oldLogo ? MediaAsset.deleteOne({ publicId: oldLogo }) : null,
    trackMedia(
      logo,
      req.file,
      'education',
      'image',
      `Education logo: ${item.institution}`,
      item._id,
    ),
  ]);
  res.json({ success: true, item });
}
export async function deleteEducation(req, res) {
  const item = await Education.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Education entry not found.' });
  await Promise.all([
    destroyMedia(item.logoPublicId),
    MediaAsset.deleteMany({ recordId: item._id }),
  ]);
  res.json({ success: true });
}
