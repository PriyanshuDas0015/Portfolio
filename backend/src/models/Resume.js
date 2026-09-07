import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    fileName: { type: String, required: true, maxlength: 180 },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileSize: { type: Number, required: true, min: 1 },
    uploadedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);
export default mongoose.model('Resume', schema);
