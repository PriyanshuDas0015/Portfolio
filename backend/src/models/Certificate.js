import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 140, trim: true },
    issuer: { type: String, required: true, maxlength: 140, trim: true },
    issueDate: { type: String, default: '', maxlength: 80 },
    credentialId: { type: String, default: '', maxlength: 160 },
    credentialUrl: { type: String, default: '' },
    description: { type: String, default: '', maxlength: 1000 },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    pdfPublicId: { type: String, default: '' },
    imageSize: { type: Number, default: 0 },
    pdfSize: { type: Number, default: 0 },
    skills: [{ type: String, maxlength: 80 }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
  },
  { timestamps: true },
);
export default mongoose.model('Certificate', schema);
