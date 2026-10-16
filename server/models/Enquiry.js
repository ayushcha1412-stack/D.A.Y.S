const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    phone:   { type: String, required: true, trim: true },
    email:   { type: String, default: '', lowercase: true, trim: true },
    service: { type: String, required: true },
    message: { type: String, required: true },
    status:  { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
    notes:   { type: String, default: '' },         // admin internal notes
    ip:      { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
