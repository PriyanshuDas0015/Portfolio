import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, maxlength: 60, trim: true },
    icon: { type: String, default: 'code', maxlength: 40 },
    color: { type: String, default: 'purple', maxlength: 30 },
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.model('SkillCategory', schema);
