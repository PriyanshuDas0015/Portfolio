import mongoose from 'mongoose';
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    email: { type: String, required: true, maxlength: 254 },
    message: { type: String, required: true, maxlength: 5000 },
    notificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'not-configured'],
      default: 'pending',
    },
    isRead: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread', index: true },
  },
  { timestamps: true, bufferCommands: false },
);
export default mongoose.model('ContactMessage', contactMessageSchema);
