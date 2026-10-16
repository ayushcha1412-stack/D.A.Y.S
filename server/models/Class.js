const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    category:    { type: String, required: true },          // Offline | Online
    mode:        { type: String, required: true },          // Group | Personal
    description: { type: String, default: '' },
    suitableFor: [{ type: String }],
    timing:      { type: String, default: '' },
    icon:        { type: String, default: '🧘' },
    price:       { type: String, default: '' },
    featured:    { type: Boolean, default: false },
    tags:        [{ type: String }],
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
