const mongoose = require('mongoose');

const facilitatorSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    title:          { type: String, required: true, trim: true },
    qualification:  { type: String, default: '' },
    specialization: [{ type: String }],
    experience:     { type: String, default: '' },
    certifications: [{ type: String }],
    biography:      { type: String, default: '' },
    image:          { type: String, default: null },        // URL / path
    social: {
      whatsapp: { type: String, default: '' },
      instagram:{ type: String, default: '' },
      facebook: { type: String, default: '' },
    },
    featured:  { type: Boolean, default: false },
    order:     { type: Number, default: 0 },               // display order
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facilitator', facilitatorSchema);
