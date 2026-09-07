import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 50,
      match: /^[a-z0-9._-]{3,50}$/,
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: 'Priyanshu Das', maxlength: 100, trim: true },
    password: { type: String, select: false },
    // Kept temporarily so accounts created by older project versions can still sign in.
    passwordHash: { type: String, select: false },
    lastLoginAt: Date,
  },
  { timestamps: true },
);
adminSchema.pre('validate', function requirePassword(next) {
  if (!this.password && !this.passwordHash)
    this.invalidate('password', 'Password hash is required.');
  next();
});
export default mongoose.model('Admin', adminSchema);
