const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema(
  {
    _id:      { type: String, default: 'main' },
    siteName: { type: String, default: 'DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE)' },
    tagline:  { type: String, default: 'एक कदम अपने और अपनों के स्वास्थ्य की ओर' },
    phones:   [{ type: String }],
    whatsapp: { type: String, default: '' },
    email:    { type: String, default: '' },
    website:  { type: String, default: '' },
    address: {
      area:    { type: String, default: 'Aliganj' },
      city:    { type: String, default: 'Lucknow' },
      state:   { type: String, default: 'Uttar Pradesh' },
      country: { type: String, default: 'India' },
      pin:     { type: String, default: '' },
      mapsUrl: { type: String, default: '' },
    },
    hours: [{ days: { type: String }, time: { type: String } }],
    services: [{ type: String }],

    // SEO
    metaTitle:    { type: String, default: '' },
    metaDesc:     { type: String, default: '' },
    metaKeywords: { type: String, default: '' },

    // Section visibility toggles (owner can hide/show entire sections)
    sections: {
      home:         { type: Boolean, default: true },
      about:        { type: Boolean, default: true },
      facilitators: { type: Boolean, default: true },
      classes:      { type: Boolean, default: true },
      plans:        { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      gallery:      { type: Boolean, default: true },
      reviews:      { type: Boolean, default: true },
      schedule:     { type: Boolean, default: true },
      expertise:    { type: Boolean, default: true },
      contact:      { type: Boolean, default: true },
      membership:   { type: Boolean, default: true },
    },
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
