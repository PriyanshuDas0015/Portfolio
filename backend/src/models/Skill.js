import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 80, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillCategory', required: true },
    icon: { type: String, default: 'code', maxlength: 40 },
    iconUrl: { type: String, default: '' },
    iconPublicId: { type: String, default: '' },
    color: { type: String, default: 'purple', maxlength: 30 },
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
    level: { type: String, default: '', maxlength: 40 },
    proficiency: { type: Number, default: null, min: 0, max: 100 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);
schema.index({ category: 1, displayOrder: 1 });
schema.index({ category: 1, name: 1 }, { unique: true });
export default mongoose.model('Skill', schema);
