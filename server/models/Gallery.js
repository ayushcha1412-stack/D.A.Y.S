const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    image:    { type: String, required: true },
    alt:      { type: String, default: '' },
    category: { type: String, default: 'General' },
    featured: { type: Boolean, default: false },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
