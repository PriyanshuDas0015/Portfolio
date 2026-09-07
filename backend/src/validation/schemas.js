import { z } from 'zod';
const optionalUrl = z.union([z.literal(''), z.string().url('Enter a valid URL.')]);
const stringList = z.array(z.string().trim().min(1).max(180)).max(30);
export const projectSchema = z.object({
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
});
