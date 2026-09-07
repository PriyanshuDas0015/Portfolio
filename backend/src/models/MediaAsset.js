import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    fileName: { type: String, required: true, maxlength: 200 },
    resourceType: { type: String, enum: ['image', 'raw', 'video'], required: true },
    format: { type: String, default: '', maxlength: 30 },
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    size: { type: Number, default: 0 },
    folder: { type: String, required: true },
    usedBy: { type: String, default: '', maxlength: 180 },
    recordId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true },
);
export default mongoose.model('MediaAsset', schema);
