import Resume from '../models/Resume.js';
import MediaAsset from '../models/MediaAsset.js';
import { destroyMedia, trackMedia, uploadBuffer } from '../services/cloudinaryService.js';

export async function getResume(req, res) {
  const resume = await Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 }).lean();
  const items = await Resume.find().sort({ uploadedAt: -1 }).lean();
  res.json({ success: true, resume, items });
}
export async function uploadResume(req, res) {
  if (!req.file)
    return res.status(400).json({ success: false, message: 'Choose a PDF to upload.' });
  const uploaded = await uploadBuffer(req.file, 'resume', 'raw');
  let resume;
  try {
    resume = await Resume.create({
      fileName: req.file.originalname,
      fileUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      fileSize: req.file.size,
      isActive: true,
    });
    await trackMedia(uploaded, req.file, 'resume', 'raw', `Resume: ${resume.fileName}`, resume._id);
    await Resume.updateMany({ _id: { $ne: resume._id }, isActive: true }, { isActive: false });
  } catch (error) {
    await Promise.all([
      destroyMedia(uploaded.public_id, 'raw'),
      resume?._id ? Resume.deleteOne({ _id: resume._id }) : null,
      MediaAsset.deleteOne({ publicId: uploaded.public_id }),
    ]);
    throw error;
  }
  res.status(201).json({ success: true, resume });
}

export async function activateResume(req, res) {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
  await Resume.updateMany({ _id: { $ne: resume._id } }, { isActive: false });
  resume.isActive = true;
  await resume.save();
  res.json({ success: true, resume });
}

export async function deleteResume(req, res) {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
  const wasActive = resume.isActive;
  await Promise.all([
    destroyMedia(resume.publicId, 'raw'),
    MediaAsset.deleteMany({ recordId: resume._id }),
    resume.deleteOne(),
  ]);
  if (wasActive) {
    const replacement = await Resume.findOne().sort({ uploadedAt: -1 });
    if (replacement) {
      replacement.isActive = true;
      await replacement.save();
    }
  }
  res.json({ success: true });
}
