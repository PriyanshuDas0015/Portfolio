import { z } from 'zod';

const optionalUrl = z.union([z.literal(''), z.string().url('Enter a valid URL.')]);
const githubProfileUrl = z.union([
  z.literal(''),
  z
    .string()
    .url('Enter a valid GitHub profile URL.')
    .regex(
      /^https:\/\/github\.com\/[^/\s?#]+\/?$/i,
      'Enter a GitHub profile URL such as https://github.com/username.',
    ),
]);
const linkedinProfileUrl = z.union([
  z.literal(''),
  z
    .string()
    .url('Enter a valid LinkedIn profile URL.')
    .regex(
      /^https:\/\/www\.linkedin\.com\/in\/[^/\s?#]+\/?$/i,
      'Enter a clean LinkedIn profile URL such as https://www.linkedin.com/in/username.',
    ),
]);
const stringList = z.array(z.string().trim().min(1).max(180)).max(30);
export const adminSchemas = {
  project: z.object({
    title: z.string().trim().min(1).max(100),
    slug: z
      .union([
        z.literal(''),
        z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .max(120),
      ])
      .default(''),
    category: z.string().trim().min(1).max(60),
    role: z.string().trim().min(1).max(100),
    shortDescription: z.string().trim().min(1).max(240),
    fullDescription: z.string().trim().max(2000).default(''),
    technologies: stringList,
    features: stringList,
    githubUrl: optionalUrl.default(''),
    liveUrl: optionalUrl.default(''),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    displayOrder: z.coerce.number().int().min(0).max(999).default(0),
    color: z.enum(['blue', 'red', 'green', 'pink', 'purple', 'cyan']).default('blue'),
  }),
  category: z.object({
    name: z.string().trim().min(1).max(60),
    icon: z.string().trim().min(1).max(40),
    color: z.string().trim().min(1).max(30),
    displayOrder: z.coerce.number().int().min(0).max(999),
    visible: z.boolean().default(true),
  }),
  skill: z.object({
    name: z.string().trim().min(1).max(80),
    category: z.string().regex(/^[a-f\d]{24}$/i, 'Select a category.'),
    icon: z.string().trim().min(1).max(40),
    color: z.string().trim().min(1).max(30),
    displayOrder: z.coerce.number().int().min(0).max(999),
    level: z.string().trim().max(40).default(''),
    proficiency: z
      .union([z.literal(''), z.null(), z.coerce.number().int().min(0).max(100)])
      .transform((value) => (value === '' ? null : value))
      .default(null),
    visible: z.boolean().default(true),
  }),
  timeline: z.object({
    title: z.string().trim().min(1).max(120),
    subtitle: z.string().trim().min(1).max(100),
    position: z.string().trim().max(120).default(''),
    company: z.string().trim().max(120).default(''),
    description: z.string().trim().min(1).max(800),
    date: z.string().trim().max(40).default(''),
    startDate: z.string().trim().max(80).default(''),
    endDate: z.string().trim().max(80).default(''),
    technologies: stringList.default([]),
    icon: z.string().trim().max(40).default('check'),
    displayOrder: z.coerce.number().int().min(0).max(999),
    current: z.boolean().default(false),
    visible: z.boolean().default(true),
  }),
  education: z.object({
    institution: z.string().trim().min(1).max(160),
    degree: z.string().trim().min(1).max(160),
    field: z.string().trim().min(1).max(160),
    location: z.string().trim().min(1).max(120),
    expectedGraduation: z.string().trim().min(1).max(80),
    startDate: z.string().trim().max(80).default(''),
    grade: z.string().trim().max(40).default(''),
    description: z.string().trim().max(800).default(''),
    coursework: stringList,
    displayOrder: z.coerce.number().int().min(0).max(999).default(0),
    visible: z.boolean().default(true),
  }),
  service: z.object({
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(500),
    icon: z.string().trim().min(1).max(40),
    displayOrder: z.coerce.number().int().min(0).max(999),
    visible: z.boolean().default(true),
  }),
  settings: z.object({
    hero: z.object({
      smallLabel: z.string().trim().min(1).max(60),
      name: z.string().trim().min(1).max(80),
      mainRole: z.string().trim().min(1).max(100),
      headline: z.string().trim().min(1).max(160),
      shortDescription: z.string().trim().max(240),
      longDescription: z.string().trim().min(1).max(700),
      availabilityText: z.string().trim().min(1).max(80),
      availabilityOn: z.boolean(),
      primaryCta: z.string().trim().min(1).max(40),
      secondaryCta: z.string().trim().min(1).max(40),
      primaryTarget: z.string().trim().min(1).max(80).default('#projects'),
      secondaryTarget: z.string().trim().min(1).max(80).default('#contact'),
      badges: z
        .array(
          z.object({
            label: z.string().trim().min(1).max(50),
            icon: z.string().trim().min(1).max(40),
            color: z.string().trim().min(1).max(30),
            displayOrder: z.coerce.number().int().min(0).max(999),
          }),
        )
        .max(12)
        .default([]),
    }),
    about: z.object({
      sectionLabel: z.string().trim().min(1).max(80).default('01. About Me'),
      heading: z.string().trim().min(1).max(120),
      description: z.string().trim().min(1).max(1000),
      description2: z.string().trim().max(1000).default(''),
      quote: z.string().trim().min(1).max(180),
      features: z
        .array(
          z.object({
            title: z.string().trim().min(1).max(50),
            subtitle: z.string().trim().min(1).max(80),
            icon: z.string().trim().min(1).max(40),
            displayOrder: z.coerce.number().int().min(0).max(999).default(0),
          }),
        )
        .max(12),
    }),
    profile: z
      .object({
        imageUrl: optionalUrl.default(''),
        imagePublicId: z.string().trim().max(300).default(''),
      })
      .optional(),
    socialLinks: z.object({
      github: githubProfileUrl,
      linkedin: linkedinProfileUrl,
      email: z.union([z.literal(''), z.string().email()]),
      other: z
        .array(
          z.object({
            platform: z.string().trim().max(40).default('Other'),
            label: z.string().trim().min(1).max(40),
            url: z.string().url(),
            icon: z.string().trim().max(40).default('link'),
            visible: z.boolean().default(true),
            displayOrder: z.coerce.number().int().min(0).max(999).default(0),
          }),
        )
        .refine((items) => {
          const platforms = items
            .map((item) => item.platform.toLowerCase())
            .filter((platform) => platform !== 'other');
          return new Set(platforms).size === platforms.length;
        }, 'Each social platform can only be added once.'),
    }),
    contactInfo: z.object({
      email: z.union([z.literal(''), z.string().email()]),
      phone: z.string().trim().max(30),
      location: z.string().trim().min(1).max(120),
      heading: z.string().trim().min(1).max(120),
      subheading: z.string().trim().min(1).max(240),
    }),
    sections: z
      .array(
        z.object({
          key: z.string().trim().min(1).max(40),
          label: z.string().trim().min(1).max(60),
          visible: z.boolean(),
          inNavbar: z.boolean(),
          displayOrder: z.coerce.number().int().min(0).max(99),
        }),
      )
      .max(20)
      .optional(),
    identity: z
      .object({
        siteName: z.string().trim().min(1).max(100),
        logoText: z.string().trim().min(1).max(20),
        browserTitle: z.string().trim().min(1).max(160),
        metaDescription: z.string().trim().max(300),
        faviconUrl: optionalUrl,
        footerText: z.string().trim().min(1).max(160),
        copyrightYear: z.union([z.null(), z.coerce.number().int().min(2000).max(2200)]),
      })
      .optional(),
    seo: z
      .object({
        title: z.string().trim().max(160),
        description: z.string().trim().max(300),
        ogTitle: z.string().trim().max(160),
        ogDescription: z.string().trim().max(300),
        ogImage: optionalUrl,
      })
      .optional(),
    announcement: z
      .object({ enabled: z.boolean(), text: z.string().trim().max(180), link: optionalUrl })
      .optional(),
  }),
  certificate: z.object({
    title: z.string().trim().min(1).max(140),
    issuer: z.string().trim().min(1).max(140),
    issueDate: z.string().trim().max(80).default(''),
    credentialId: z.string().trim().max(160).default(''),
    credentialUrl: optionalUrl.default(''),
    description: z.string().trim().max(1000).default(''),
    skills: stringList,
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  }),
};

export const parseBody = (name) => (req, res, next) => {
  const result = adminSchemas[name].safeParse(req.body);
  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues)
      errors[issue.path.join('.') || 'form'] ??= issue.message;
    return res.status(400).json({ success: false, message: 'Please check the form.', errors });
  }
  req.validated = result.data;
  next();
};
