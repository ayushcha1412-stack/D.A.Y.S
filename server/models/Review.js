const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    category: { type: String, default: 'General' },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    review:   { type: String, required: true },
    avatar:   { type: String, default: null },
    verified: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },  // admin must approve before public display
    date:     { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
