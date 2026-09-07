import { z } from 'zod';
import SiteSettings from '../models/SiteSettings.js';
import MediaAsset from '../models/MediaAsset.js';
import { destroyMedia, trackMedia, uploadBuffer } from '../services/cloudinaryService.js';

const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  professionalTitle: z.string().trim().min(1).max(100),
  shortIntroduction: z.string().trim().max(240).default(''),
  fullAbout: z.string().trim().min(1).max(1000),
  location: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).default(''),
});

const present = (settings) => ({
  name: settings.hero?.name || '',
  professionalTitle: settings.hero?.mainRole || '',
  shortIntroduction: settings.hero?.shortDescription || '',
  fullAbout: settings.about?.description || '',
  location: settings.contactInfo?.location || '',
  email: settings.contactInfo?.email || '',
  phone: settings.contactInfo?.phone || '',
  profileImageUrl: settings.profile?.imageUrl || '',
});

export async function getProfile(req, res) {
  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  res.json({ success: true, profile: present(settings) });
}

export async function updateProfile(req, res) {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Please check the profile form.',
    });

  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  const uploaded = req.file ? await uploadBuffer(req.file, 'profile') : null;
  const oldPublicId = uploaded ? settings.profile?.imagePublicId : '';
  const { name, professionalTitle, shortIntroduction, fullAbout, location, email, phone } =
    parsed.data;

  settings.hero.name = name;
  settings.hero.mainRole = professionalTitle;
  settings.hero.shortDescription = shortIntroduction;
  settings.about.description = fullAbout;
  settings.contactInfo.location = location;
  settings.contactInfo.email = email;
  settings.contactInfo.phone = phone;
  if (uploaded) {
    settings.profile ||= {};
    settings.profile.imageUrl = uploaded.secure_url;
    settings.profile.imagePublicId = uploaded.public_id;
  }

  try {
    await settings.save();
    await Promise.all([
      destroyMedia(oldPublicId),
      oldPublicId ? MediaAsset.deleteOne({ publicId: oldPublicId }) : null,
      trackMedia(uploaded, req.file, 'profile', 'image', 'Public profile photo', settings._id),
    ]);
  } catch (error) {
    await destroyMedia(uploaded?.public_id);
    throw error;
  }

  res.json({ success: true, profile: present(settings) });
}
