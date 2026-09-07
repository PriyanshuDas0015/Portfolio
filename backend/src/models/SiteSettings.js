import mongoose from 'mongoose';
const featureSchema = new mongoose.Schema(
  { title: String, subtitle: String, icon: String, displayOrder: Number },
  { _id: false },
);
const sectionSchema = new mongoose.Schema(
  {
    key: String,
    label: String,
    visible: { type: Boolean, default: true },
    inNavbar: { type: Boolean, default: true },
    displayOrder: Number,
  },
  { _id: false },
);
const schema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    hero: {
      smallLabel: { type: String, maxlength: 60, default: '// FRONTEND DEVELOPER' },
      name: { type: String, maxlength: 80, default: 'Priyanshu Das' },
      mainRole: { type: String, maxlength: 100, default: 'Frontend Developer' },
      headline: {
        type: String,
        maxlength: 160,
        default: 'I build modern, responsive and meaningful web experiences.',
      },
      shortDescription: { type: String, maxlength: 240, default: '' },
      longDescription: { type: String, maxlength: 700, default: '' },
      availabilityText: { type: String, maxlength: 80, default: 'Open to opportunities' },
      availabilityOn: { type: Boolean, default: true },
      primaryCta: { type: String, maxlength: 40, default: 'View My Projects' },
      secondaryCta: { type: String, maxlength: 40, default: 'Contact Me' },
      primaryTarget: { type: String, maxlength: 80, default: '#projects' },
      secondaryTarget: { type: String, maxlength: 80, default: '#contact' },
      badges: {
        type: [{ label: String, icon: String, color: String, displayOrder: Number }],
        default: [],
      },
    },
    about: {
      sectionLabel: { type: String, maxlength: 80, default: '01. About Me' },
      heading: { type: String, maxlength: 120, default: 'More than just a developer.' },
      description: { type: String, maxlength: 1000, default: '' },
      description2: { type: String, maxlength: 1000, default: '' },
      quote: {
        type: String,
        maxlength: 180,
        default: 'Better solutions for a brighter tomorrow.',
      },
      features: { type: [featureSchema], default: [] },
    },
    profile: {
      imageUrl: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/PriyanshuDas0015' },
      linkedin: {
        type: String,
        default: 'https://www.linkedin.com/in/priyanshu-das-63259b216',
      },
      email: { type: String, default: 'priyanshudassonu@gmail.com' },
      other: {
        type: [
          {
            platform: String,
            label: String,
            url: String,
            icon: String,
            visible: { type: Boolean, default: true },
            displayOrder: Number,
          },
        ],
        default: [],
      },
    },
    contactInfo: {
      email: { type: String, default: 'priyanshudassonu@gmail.com' },
      phone: { type: String, default: '' },
      location: { type: String, default: 'Sonipat, Haryana' },
      heading: { type: String, maxlength: 120, default: "Let's create something amazing." },
      subheading: {
        type: String,
        maxlength: 240,
        default: "Have a project in mind or just want to say hi? I'd love to hear from you.",
      },
    },
    sections: { type: [sectionSchema], default: [] },
    identity: {
      siteName: { type: String, default: 'Priyanshu Das', maxlength: 100 },
      logoText: { type: String, default: 'PD.', maxlength: 20 },
      browserTitle: {
        type: String,
        default: 'Priyanshu Das | Frontend Developer',
        maxlength: 160,
      },
      metaDescription: { type: String, default: '', maxlength: 300 },
      faviconUrl: { type: String, default: '' },
      footerText: { type: String, default: 'Code • Create • Build • Grow', maxlength: 160 },
      copyrightYear: { type: Number, default: null },
    },
    seo: {
      title: { type: String, default: '', maxlength: 160 },
      description: { type: String, default: '', maxlength: 300 },
      ogTitle: { type: String, default: '', maxlength: 160 },
      ogDescription: { type: String, default: '', maxlength: 300 },
      ogImage: { type: String, default: '' },
    },
    announcement: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '', maxlength: 180 },
      link: { type: String, default: '' },
    },
  },
  { timestamps: true },
);
export default mongoose.model('SiteSettings', schema);
