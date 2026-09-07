import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { projectSchema } from '../src/validation/schemas.js';
import { adminSchemas } from '../src/middleware/adminValidation.js';

test('admin management endpoints reject unauthenticated requests', async () => {
  const app = createApp();
  for (const path of [
    '/api/admin/dashboard',
    '/api/admin/projects',
    '/api/admin/messages',
    '/api/admin/settings',
    '/api/admin/profile',
  ]) {
    const response = await request(app).get(path);
    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
  }
});
test('admin login fails safely when authentication is not configured', async () => {
  const response = await request(createApp())
    .post('/api/admin/login')
    .send({ email: 'admin@example.com', password: 'password123' });
  assert.equal(response.status, 503);
  assert.match(response.body.message, /not configured/i);
});

test('admin login accepts the username credential shape before configuration checks', async () => {
  const response = await request(createApp())
    .post('/api/admin/login')
    .send({ identifier: 'portfolio-admin', password: 'password123' });
  assert.equal(response.status, 503);
  assert.match(response.body.message, /not configured/i);
});
test('project schema rejects invalid URLs and accepts empty project links', () => {
  const base = {
    title: 'Project',
    category: 'Frontend',
    role: 'Developer',
    shortDescription: 'A valid description',
    fullDescription: '',
    technologies: ['React'],
    features: [],
    featured: false,
    displayOrder: 1,
    color: 'blue',
  };
  assert.equal(
    projectSchema.safeParse({ ...base, githubUrl: 'not-a-url', liveUrl: '' }).success,
    false,
  );
  assert.equal(projectSchema.safeParse({ ...base, githubUrl: '', liveUrl: '' }).success, true);
});

test('skill, experience and education schemas accept the extended CMS fields', () => {
  assert.equal(
    adminSchemas.skill.safeParse({
      name: 'React',
      category: '507f1f77bcf86cd799439011',
      icon: 'code',
      color: 'blue',
      displayOrder: 1,
      level: 'Advanced',
      proficiency: 90,
      visible: true,
    }).success,
    true,
  );
  assert.equal(
    adminSchemas.timeline.safeParse({
      title: 'Frontend Developer',
      subtitle: 'Example Company',
      position: 'Frontend Developer',
      company: 'Example Company',
      description: 'Built accessible interfaces.',
      startDate: '2025',
      endDate: '',
      technologies: ['React'],
      displayOrder: 1,
      current: true,
      visible: true,
    }).success,
    true,
  );
  assert.equal(
    adminSchemas.education.safeParse({
      institution: 'Example University',
      degree: 'B.Tech',
      field: 'Computer Science',
      location: 'India',
      expectedGraduation: '2027',
      startDate: '2023',
      grade: '8.5 CGPA',
      description: '',
      coursework: [],
      displayOrder: 1,
      visible: true,
    }).success,
    true,
  );
});

test('site settings accept only clean GitHub and LinkedIn profile URLs', () => {
  const base = {
    hero: {
      smallLabel: '// FRONTEND DEVELOPER',
      name: 'Priyanshu Das',
      mainRole: 'Frontend Developer',
      headline: 'I build web experiences.',
      shortDescription: '',
      longDescription: 'A sufficiently complete portfolio introduction.',
      availabilityText: 'Open to opportunities',
      availabilityOn: true,
      primaryCta: 'Projects',
      secondaryCta: 'Contact',
    },
    about: {
      heading: 'About',
      description: 'Portfolio description.',
      quote: 'Build thoughtfully.',
      features: Array.from({ length: 4 }, (_, index) => ({
        title: `Feature ${index + 1}`,
        subtitle: 'Description',
        icon: 'focus',
      })),
    },
    socialLinks: {
      github: 'https://github.com/PriyanshuDas0015',
      linkedin: 'https://www.linkedin.com/in/priyanshu-das-63259b216',
      email: 'priyanshudassonu@gmail.com',
      other: [],
    },
    contactInfo: {
      email: 'priyanshudassonu@gmail.com',
      phone: '',
      location: 'Sonipat, Haryana',
      heading: 'Contact',
      subheading: 'Send a message.',
    },
  };
  assert.equal(adminSchemas.settings.safeParse(base).success, true);
  assert.equal(
    adminSchemas.settings.safeParse({
      ...base,
      socialLinks: { ...base.socialLinks, github: 'https://example.com/profile' },
    }).success,
    false,
  );
  assert.equal(
    adminSchemas.settings.safeParse({
      ...base,
      socialLinks: {
        ...base.socialLinks,
        linkedin: `${base.socialLinks.linkedin}?utm_source=test`,
      },
    }).success,
    false,
  );
});
