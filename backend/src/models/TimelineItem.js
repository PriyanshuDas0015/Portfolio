import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 120 },
    subtitle: { type: String, required: true, maxlength: 100 },
    position: { type: String, default: '', maxlength: 120 },
    company: { type: String, default: '', maxlength: 120 },
    description: { type: String, required: true, maxlength: 800 },
    date: { type: String, default: '', maxlength: 40 },
    startDate: { type: String, default: '', maxlength: 80 },
    endDate: { type: String, default: '', maxlength: 80 },
    technologies: [{ type: String, maxlength: 100 }],
    icon: { type: String, default: 'check', maxlength: 40 },
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
    current: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.model('TimelineItem', schema);
