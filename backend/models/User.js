const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters long'],
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    authProviders: [
      {
        provider: { type: String, enum: ['local', 'google'] },
        providerId: { type: String },
        linkedAt: { type: Date, default: Date.now },
      },
    ],
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'mentor', 'counselor', 'student'],
      default: 'student',
    },
    enrolledCourses: [
      {
        courseId: { type: String },
        title: { type: String },
        progress: { type: Number, default: 0 },
        enrolledAt: { type: Date, default: Date.now },
      },
    ],
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
