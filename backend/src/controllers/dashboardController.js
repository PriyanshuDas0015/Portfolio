import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import TimelineItem from '../models/TimelineItem.js';
import ContactMessage from '../models/ContactMessage.js';
import Certificate from '../models/Certificate.js';
import Resume from '../models/Resume.js';
import SiteSettings from '../models/SiteSettings.js';

export async function getDashboard(req, res) {
  const [
    projects,
    publishedProjects,
    skills,
    certificates,
    experience,
    messages,
    unreadMessages,
    currentResume,
    settings,
    latestProject,
    latestSkill,
    latestCertificate,
    latestExperience,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ published: true }),
    Skill.countDocuments(),
    Certificate.countDocuments(),
    TimelineItem.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({
      $or: [{ status: 'unread' }, { status: { $exists: false }, isRead: false }],
    }),
    Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 }).lean(),
    SiteSettings.findOne({ key: 'main' }).lean(),
    Project.findOne().sort({ updatedAt: -1 }).select('title updatedAt').lean(),
    Skill.findOne().sort({ updatedAt: -1 }).select('name updatedAt').lean(),
    Certificate.findOne().sort({ updatedAt: -1 }).select('title updatedAt').lean(),
    TimelineItem.findOne().sort({ updatedAt: -1 }).select('title position updatedAt').lean(),
  ]);
  const recentUpdates = [
    latestProject && {
      type: 'Project',
      title: latestProject.title,
      updatedAt: latestProject.updatedAt,
    },
    latestSkill && { type: 'Skill', title: latestSkill.name, updatedAt: latestSkill.updatedAt },
    latestCertificate && {
      type: 'Certificate',
      title: latestCertificate.title,
      updatedAt: latestCertificate.updatedAt,
    },
    latestExperience && {
      type: 'Experience',
      title: latestExperience.position || latestExperience.title,
      updatedAt: latestExperience.updatedAt,
    },
    settings && { type: 'Settings', title: 'Portfolio settings', updatedAt: settings.updatedAt },
    currentResume && {
      type: 'Resume',
      title: currentResume.fileName,
      updatedAt: currentResume.updatedAt,
    },
  ]
    .filter(Boolean)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);
  res.json({
    success: true,
    counts: {
      projects,
      publishedProjects,
      skills,
      certificates,
      experience,
      messages,
      unreadMessages,
    },
    currentResume,
    recentUpdates,
    lastContentUpdate: recentUpdates[0]?.updatedAt || null,
  });
}
