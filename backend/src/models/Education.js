import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    institution: { type: String, required: true, maxlength: 160 },
    degree: { type: String, required: true, maxlength: 160 },
    field: { type: String, required: true, maxlength: 160 },
    location: { type: String, required: true, maxlength: 120 },
    expectedGraduation: { type: String, required: true, maxlength: 80 },
    startDate: { type: String, default: '', maxlength: 80 },
    grade: { type: String, default: '', maxlength: 40 },
    description: { type: String, default: '', maxlength: 800 },
    logoUrl: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    coursework: [{ type: String, maxlength: 120 }],
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.model('Education', schema);
