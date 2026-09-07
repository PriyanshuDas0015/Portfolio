import Project from '../models/Project.js';
import SkillCategory from '../models/SkillCategory.js';
import Skill from '../models/Skill.js';
import TimelineItem from '../models/TimelineItem.js';
import Education from '../models/Education.js';
import Service from '../models/Service.js';
import Resume from '../models/Resume.js';
import SiteSettings from '../models/SiteSettings.js';
import Certificate from '../models/Certificate.js';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import mongoose from 'mongoose';

const databaseUnavailable = (res) =>
  res
    .status(503)
    .json({ success: false, message: 'Portfolio content is temporarily unavailable.' });
const ok = (key, query) => async (req, res) => {
  if (mongoose.connection.readyState !== 1) return databaseUnavailable(res);
  return res.json({ success: true, [key]: await query() });
};
export const publicProjects = ok('projects', () =>
  Project.find({ published: true }).sort({ displayOrder: 1, createdAt: 1 }).lean(),
);
export const publicSkills = ok('categories', async () => {
  const categories = await SkillCategory.find({ visible: { $ne: false } })
    .sort({ displayOrder: 1 })
    .lean();
  const skills = await Skill.find({ visible: { $ne: false } })
    .sort({ displayOrder: 1 })
    .lean();
  return categories.map((category) => ({
    ...category,
    items: skills.filter((skill) => String(skill.category) === String(category._id)),
  }));
});
export const publicTimeline = ok('timeline', () =>
  TimelineItem.find({ visible: { $ne: false } })
    .sort({ displayOrder: 1 })
    .lean(),
);
export const publicEducation = ok('education', () =>
  Education.find({ visible: { $ne: false } })
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean(),
);
export const publicServices = ok('services', () =>
  Service.find({ visible: { $ne: false } })
    .sort({ displayOrder: 1 })
    .lean(),
);
export const publicCertificates = ok('certificates', () =>
  Certificate.find({ published: true })
    .sort({ featured: -1, displayOrder: 1, issueDate: -1 })
    .lean(),
);
export const publicResume = ok('resume', () =>
  Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 }).lean(),
);
export const publicSite = ok('settings', () => SiteSettings.findOne({ key: 'main' }).lean());
export async function downloadResume(req, res) {
  if (mongoose.connection.readyState !== 1) return databaseUnavailable(res);
  const resume = await Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 }).lean();
  if (!resume) return res.status(404).json({ success: false, message: 'Resume not available.' });
  const upstream = await fetch(resume.fileUrl, { signal: AbortSignal.timeout(15000) });
  if (!upstream.ok || !upstream.body)
    return res.status(502).json({ success: false, message: 'Resume download is unavailable.' });
  const safeName = resume.fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${safeName}"`,
    'Cache-Control': 'public, max-age=300',
  });
  await pipeline(Readable.fromWeb(upstream.body), res);
}
