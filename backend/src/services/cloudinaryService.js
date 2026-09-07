import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import MediaAsset from '../models/MediaAsset.js';

const configured = Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret,
);
if (configured) cloudinary.config(env.cloudinary);

export function uploadBuffer(file, folder, resourceType = 'image') {
  if (!configured) {
    const error = new Error('Media storage is not configured.');
    error.status = 503;
    throw error;
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `priyanshu-portfolio/${folder}`,
        resource_type: resourceType,
        access_mode: 'public',
        ...(resourceType === 'image'
          ? {
              transformation: [
                { width: 1600, height: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
              ],
            }
          : {}),
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    stream.end(file.buffer);
  });
}

export async function destroyMedia(publicId, resourceType = 'image') {
  if (configured && publicId)
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export async function trackMedia(result, file, folder, resourceType, usedBy = '', recordId = null) {
  if (!result) return null;
  return MediaAsset.findOneAndUpdate(
    { publicId: result.public_id },
    {
      fileName: file.originalname,
      resourceType,
      format: result.format || file.mimetype.split('/').pop(),
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes || file.size,
      folder,
      usedBy,
      recordId,
    },
    { upsert: true, new: true, runValidators: true },
  );
}
