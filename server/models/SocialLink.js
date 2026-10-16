const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
  {
    label:    { type: String, required: true },         // Facebook | Instagram | X / Twitter | etc.
    href:     { type: String, required: true },
    icon:     { type: String, default: '' },            // SVG string or icon name
    color:    { type: String, default: '#ffffff' },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SocialLink', socialLinkSchema);
