import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100, trim: true },
    slug: { type: String, required: true, unique: true, maxlength: 120, trim: true },
    category: { type: String, maxlength: 60, default: 'Frontend' },
    role: { type: String, required: true, maxlength: 100 },
    shortDescription: { type: String, required: true, maxlength: 240 },
    fullDescription: { type: String, maxlength: 2000, default: '' },
    technologies: [{ type: String, maxlength: 50 }],
    features: [{ type: String, maxlength: 180 }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    gallery: {
      type: [{ url: String, publicId: String, fileName: String, size: Number }],
      default: [],
    },
    demoVideoUrl: { type: String, default: '' },
    demoVideoPublicId: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
    color: { type: String, default: 'blue' },
  },
  { timestamps: true },
);
export default mongoose.model('Project', projectSchema);
