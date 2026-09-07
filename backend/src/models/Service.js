import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    icon: { type: String, default: 'code', maxlength: 40 },
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.model('Service', schema);
