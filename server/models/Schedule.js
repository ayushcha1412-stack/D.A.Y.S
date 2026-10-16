const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    time:        { type: String, required: true },
    session:     { type: String, required: true },
    type:        { type: String, default: 'Group' },
    mode:        { type: String, default: 'Offline' },
    description: { type: String, default: '' },
    period:      { type: String, enum: ['morning', 'evening', 'night'], default: 'morning' },
    duration:    { type: String, default: '60 min' },
    suitable:    { type: String, default: 'All levels' },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);
