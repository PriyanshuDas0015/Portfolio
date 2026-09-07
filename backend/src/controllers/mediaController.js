import MediaAsset from '../models/MediaAsset.js';
import { destroyMedia, trackMedia, uploadBuffer } from '../services/cloudinaryService.js';

export async function listMedia(req, res) {
  const query = {};
  if (req.query.type && ['image', 'raw', 'video'].includes(req.query.type))
    query.resourceType = req.query.type;
  if (req.query.search)
    query.fileName = { $regex: String(req.query.search).slice(0, 80), $options: 'i' };
  const items = await MediaAsset.find(query).sort({ createdAt: -1 }).lean();
  res.json({ success: true, items });
}

export async function uploadMedia(req, res) {
  if (!req.file)
    return res.status(400).json({ success: false, message: 'Choose a file to upload.' });
  const resourceType = req.file.mimetype.startsWith('image/')
    ? 'image'
    : req.file.mimetype.startsWith('video/')
      ? 'video'
      : 'raw';
  if (resourceType === 'image' && req.file.size > 5e6)
    return res.status(400).json({ success: false, message: 'Images must be 5 MB or smaller.' });
  const uploaded = await uploadBuffer(req.file, 'media', resourceType);
  const item = await trackMedia(uploaded, req.file, 'media', resourceType);
  res.status(201).json({ success: true, item });
}

export async function deleteMedia(req, res) {
  const item = await MediaAsset.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Media file not found.' });
  if (item.recordId || item.usedBy)
    return res.status(409).json({
      success: false,
      message: `This file is currently used by ${item.usedBy || 'portfolio content'}.`,
    });
  await destroyMedia(item.publicId, item.resourceType);
  await item.deleteOne();
  res.json({ success: true });
}
