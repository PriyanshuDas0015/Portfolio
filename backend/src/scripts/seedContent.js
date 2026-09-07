import { connectDatabase } from '../config/database.js';
import { defaultContent } from '../data/defaultContent.js';
import Project from '../models/Project.js';
import SkillCategory from '../models/SkillCategory.js';
import Skill from '../models/Skill.js';
import TimelineItem from '../models/TimelineItem.js';
import Education from '../models/Education.js';
import Service from '../models/Service.js';
import SiteSettings from '../models/SiteSettings.js';

await connectDatabase();
for (const project of defaultContent.projects)
  await Project.findOneAndUpdate({ slug: project.slug }, project, {
    upsert: true,
    runValidators: true,
  });
for (const item of defaultContent.timeline)
  await TimelineItem.findOneAndUpdate({ title: item.title }, item, {
    upsert: true,
    runValidators: true,
  });
for (const service of defaultContent.services)
  await Service.findOneAndUpdate({ title: service.title }, service, {
    upsert: true,
    runValidators: true,
  });
await Education.findOneAndUpdate({}, defaultContent.education, {
  upsert: true,
  runValidators: true,
});
await SiteSettings.findOneAndUpdate({ key: 'main' }, defaultContent.settings, {
  upsert: true,
  runValidators: true,
});
for (const category of defaultContent.categories) {
  const { items, ...categoryData } = category;
  const savedCategory = await SkillCategory.findOneAndUpdate(
    { name: category.name },
    categoryData,
    { upsert: true, new: true, runValidators: true },
  );
  for (const [index, name] of items.entries())
    await Skill.findOneAndUpdate(
      { name, category: savedCategory._id },
      {
        name,
        category: savedCategory._id,
        icon: category.icon,
        color: category.color,
        displayOrder: index + 1,
      },
      { upsert: true, runValidators: true },
    );
}
console.info('Portfolio content seeded without replacing existing edits matched by identity.');
process.exit(0);
