const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone:    { type: String, required: true, unique: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    age:      { type: Number, min: 5, max: 110 },
    gender:   { type: String, enum: ['Male', 'Female', 'Other', ''] },
    isActive: { type: Boolean, default: true },
    role:     { type: String, default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
