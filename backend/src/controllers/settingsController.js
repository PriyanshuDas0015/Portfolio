import SiteSettings from '../models/SiteSettings.js';

export async function getSettings(req, res) {
  const settings = await SiteSettings.findOne({ key: 'main' }).lean();
  res.json({ success: true, settings });
}
export async function updateSettings(req, res) {
  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    { ...req.validated, key: 'main' },
    { new: true, upsert: true, runValidators: true },
  );
  res.json({ success: true, settings });
}
