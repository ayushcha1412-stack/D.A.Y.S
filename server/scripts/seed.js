/**
 * Seed script — run once: npm run seed (from server/)
 * Creates the default admin account and seeds social links.
 */
require('dotenv').config();
const mongoose   = require('mongoose');
const Admin      = require('../models/Admin');
const SocialLink = require('../models/SocialLink');
const SiteConfig = require('../models/SiteConfig');

const SOCIAL_LINKS = [
  { label: 'Facebook',         href: 'https://www.facebook.com/profile.php?id=100071712365099', color: '#1877F2', order: 1 },
  { label: 'Instagram',        href: 'https://www.instagram.com/_anyogainstitute?igsh=NnAxeTVhY2E0bmdx', color: '#E1306C', order: 2 },
  { label: 'X / Twitter',      href: 'https://x.com/anyogainstitute', color: '#e7e9ea', order: 3 },
  { label: 'Telegram',         href: 'https://t.me/+hkbqbbDBm9E1ZGI1', color: '#2AABEE', order: 4 },
  { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029VaAJIVI6LwHffuHvKI1p', color: '#25D366', order: 5 },
  { label: 'YouTube',          href: 'https://youtube.com/@anyogainstitute?si=Brb66ZglZk4t934c', color: '#FF0000', order: 6 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Admin
  const email    = process.env.ADMIN_EMAIL    || 'admin@anyogainstitute.org';
  const password = process.env.ADMIN_PASSWORD || 'Admin@DAYS2024!';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${email}`);
  } else {
    await Admin.create({ name: 'Admin', email, password });
    console.log(`✅ Admin created: ${email}`);
  }

  // Site config
  await SiteConfig.findByIdAndUpdate('main', {
    siteName:  'DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE)',
    tagline:   'एक कदम अपने और अपनों के स्वास्थ्य की ओर',
    phones:    ['6386659500'],
    whatsapp:  '8127227284',
    website:   'www.anyogainstitute.org',
    address: {
      area: 'Aliganj', city: 'Lucknow', state: 'Uttar Pradesh',
      country: 'India', mapsUrl: 'https://maps.app.goo.gl/BEqwed6jzNAj1T7m6',
    },
    hours: [
      { days: 'Monday – Saturday', time: '5:00 AM – 9:00 PM' },
      { days: 'Sunday',            time: '5:00 AM – 8:00 AM' },
    ],
    services: [
      'Centre-Based Personal Yoga','Home Personal Yoga','Online Group Yoga',
      'Online Personal Yoga','Park Group Yoga',"Children's Yogasana",
      'Yogasana Sports Training','Yoga Nidra','Wellness Programs','Other Enquiry',
    ],
  }, { upsert: true, new: true });
  console.log('✅ Site config seeded');

  // Social links
  await SocialLink.deleteMany({});
  await SocialLink.insertMany(SOCIAL_LINKS);
  console.log('✅ Social links seeded');

  await mongoose.disconnect();
  console.log('✅ Seeding complete. Disconnected.');
}

seed().catch((err) => { console.error(err); process.exit(1); });
