import Certificate from '../models/Certificate.js';
import MediaAsset from '../models/MediaAsset.js';
import { destroyMedia, trackMedia, uploadBuffer } from '../services/cloudinaryService.js';

const parseSkills = (value) => {
  if (Array.isArray(value)) return value;
  try {
    return value ? JSON.parse(value) : [];
  } catch {
    return String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const normalize = (body) => ({
  ...body,
  skills: parseSkills(body.skills),
  featured: body.featured === true || body.featured === 'true',
  published: body.published === true || body.published === 'true',
  displayOrder: Number(body.displayOrder || 0),
});

export async function listCertificates(req, res) {
  const items = await Certificate.find()
    .sort({ displayOrder: 1, issueDate: -1, createdAt: -1 })
    .lean();
  res.json({ success: true, items });
}

export async function createCertificate(req, res) {
  const data = req.certificateSchema.parse(normalize(req.body));
  const imageFile = req.files?.certificateImage?.[0];
  const pdfFile = req.files?.certificatePdf?.[0];
  if (imageFile?.size > 5e6)
    return res
      .status(400)
      .json({ success: false, message: 'Certificate images must be 5 MB or smaller.' });
  const [image, pdf] = await Promise.all([
    imageFile ? uploadBuffer(imageFile, 'certificates') : null,
    pdfFile ? uploadBuffer(pdfFile, 'certificates', 'raw') : null,
  ]);
  let item;
  try {
    item = await Certificate.create({
      ...data,
      imageUrl: image?.secure_url || '',
      imagePublicId: image?.public_id || '',
      imageSize: image?.bytes || imageFile?.size || 0,
      pdfUrl: pdf?.secure_url || '',
      pdfPublicId: pdf?.public_id || '',
      pdfSize: pdf?.bytes || pdfFile?.size || 0,
    });
  } catch (error) {
    await Promise.all([destroyMedia(image?.public_id), destroyMedia(pdf?.public_id, 'raw')]);
    throw error;
  }
  await Promise.all([
    trackMedia(
      image,
      imageFile,
      'certificates',
      'image',
      `Certificate image: ${item.title}`,
      item._id,
    ),
    trackMedia(pdf, pdfFile, 'certificates', 'raw', `Certificate PDF: ${item.title}`, item._id),
  ]);
  res.status(201).json({ success: true, item });
}

export async function updateCertificate(req, res) {
  const data = req.certificateSchema.parse(normalize(req.body));
  const item = await Certificate.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Certificate not found.' });
  const imageFile = req.files?.certificateImage?.[0];
  const pdfFile = req.files?.certificatePdf?.[0];
  if (imageFile?.size > 5e6)
    return res
      .status(400)
      .json({ success: false, message: 'Certificate images must be 5 MB or smaller.' });
  const [image, pdf] = await Promise.all([
    imageFile ? uploadBuffer(imageFile, 'certificates') : null,
    pdfFile ? uploadBuffer(pdfFile, 'certificates', 'raw') : null,
  ]);
  const oldImage = image && item.imagePublicId;
  const oldPdf = pdf && item.pdfPublicId;
  Object.assign(item, data, {
    ...(image
      ? {
          imageUrl: image.secure_url,
          imagePublicId: image.public_id,
          imageSize: image.bytes || imageFile.size,
        }
      : {}),
    ...(pdf
      ? { pdfUrl: pdf.secure_url, pdfPublicId: pdf.public_id, pdfSize: pdf.bytes || pdfFile.size }
      : {}),
  });
  await item.save();
  await Promise.all([
    destroyMedia(oldImage),
    destroyMedia(oldPdf, 'raw'),
    oldImage ? MediaAsset.deleteOne({ publicId: oldImage }) : null,
    oldPdf ? MediaAsset.deleteOne({ publicId: oldPdf }) : null,
    trackMedia(
      image,
      imageFile,
      'certificates',
      'image',
      `Certificate image: ${item.title}`,
      item._id,
    ),
    trackMedia(pdf, pdfFile, 'certificates', 'raw', `Certificate PDF: ${item.title}`, item._id),
  ]);
  res.json({ success: true, item });
}

export async function deleteCertificate(req, res) {
  const item = await Certificate.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Certificate not found.' });
  await Promise.all([
    destroyMedia(item.imagePublicId),
    destroyMedia(item.pdfPublicId, 'raw'),
    MediaAsset.deleteMany({ recordId: item._id }),
  ]);
  res.json({ success: true });
}
