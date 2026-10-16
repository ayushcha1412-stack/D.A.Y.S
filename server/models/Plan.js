const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    subtitle:     { type: String, default: '' },
    price:        { type: String, required: true },
    priceDetails: { type: String, default: '' },
    duration:     { type: String, default: 'Monthly' },
    mode:         { type: String, default: '' },
    members:      { type: Number, default: 1 },
    popular:      { type: Boolean, default: false },
    color:        { type: String, default: 'forest', enum: ['gold', 'forest', 'emerald', 'bronze'] },
    benefits:     [{ type: String }],
    cta:          { type: String, default: 'Get Started' },
    badge:        { type: String, default: null },
    isActive:     { type: Boolean, default: true },
    order:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
