const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    // Step 1 — Personal info
    name:   { type: String, required: true, trim: true },
    phone:  { type: String, required: true, trim: true },
    age:    { type: Number, required: true, min: 5, max: 110 },
    gender: { type: String, default: '' },
    email:  { type: String, default: '', lowercase: true, trim: true },

    // Step 2 — Yoga preferences
    level:  { type: String, required: true },           // Beginner | Intermediate | Advanced
    mode:   { type: String, required: true },           // Online Group | Offline Group | etc.
    goals:  [{ type: String }],                        // multi-select array

    // Step 3 — Membership type
    membershipType: {
      type: String,
      required: true,
      enum: ['annual', 'monthly', 'trial'],
    },

    // Admin fields
    status: { type: String, enum: ['pending', 'active', 'cancelled', 'expired'], default: 'pending' },
    notes:  { type: String, default: '' },
    ip:     { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
