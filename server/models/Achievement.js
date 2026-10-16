const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    level:       { type: String, required: true },  // District | State | National | Championship | Certification | Judge / Observer
    year:        { type: String, required: true },
    location:    { type: String, default: '' },
    position:    { type: String, default: '' },
    description: { type: String, default: '' },
    icon:        { type: String, default: '🏆' },
    type:        { type: String, default: 'Competition' },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

const achievementStatSchema = new mongoose.Schema(
  {
    label:   { type: String, required: true },
    value:   { type: String, required: true },
    icon:    { type: String, default: '📊' },
    order:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Achievement     = mongoose.model('Achievement',     achievementSchema);
const AchievementStat = mongoose.model('AchievementStat', achievementStatSchema);

module.exports = { Achievement, AchievementStat };
