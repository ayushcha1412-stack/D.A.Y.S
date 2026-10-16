/**
 * Seed script — populates the DB with all website content.
 * Run from the server/ directory:  npm run seed
 *
 * Safe to re-run: existing records are cleared and re-seeded.
 * The admin account is created only if it doesn't already exist.
 */
require('dotenv').config();
const mongoose          = require('mongoose');
const Admin             = require('../models/Admin');
const SiteConfig        = require('../models/SiteConfig');
const SocialLink        = require('../models/SocialLink');
const Facilitator       = require('../models/Facilitator');
const Class             = require('../models/Class');
const Plan              = require('../models/Plan');
const { Achievement, AchievementStat } = require('../models/Achievement');
const Schedule          = require('../models/Schedule');
const Review            = require('../models/Review');

/* ════════════════════════════════════════════════════════
   SEED DATA  (mirrors src/data/*.js — no images, text only)
════════════════════════════════════════════════════════ */

const SOCIAL_LINKS = [
  { label: 'Facebook',         href: 'https://www.facebook.com/profile.php?id=100071712365099',           color: '#1877F2', order: 1, isActive: true },
  { label: 'Instagram',        href: 'https://www.instagram.com/_anyogainstitute?igsh=NnAxeTVhY2E0bmdx', color: '#E1306C', order: 2, isActive: true },
  { label: 'X / Twitter',      href: 'https://x.com/anyogainstitute',                                    color: '#e7e9ea', order: 3, isActive: true },
  { label: 'Telegram',         href: 'https://t.me/+hkbqbbDBm9E1ZGI1',                                   color: '#2AABEE', order: 4, isActive: true },
  { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029VaAJIVI6LwHffuHvKI1p',            color: '#25D366', order: 5, isActive: true },
  { label: 'YouTube',          href: 'https://youtube.com/@anyogainstitute?si=Brb66ZglZk4t934c',         color: '#FF0000', order: 6, isActive: true },
];

const FACILITATORS = [
  {
    name: 'Ashish',
    title: 'Founder of DAYS & Yoga Facilitator',
    qualification: 'Yoga, Fitness & Wellness Expert',
    specialization: ['Yogasana', 'Pranayama', 'Meditation', 'Fitness Training'],
    experience: '11+ Years',
    certifications: ['UPYSA Certified', 'Yogasana Sports Judge'],
    biography: 'Ashish is a passionate Yoga Facilitator, Fitness Mentor, Yogasana Athlete, and Founder & CEO of Divy Ashish Yoga Sansthan. Since 2016, he has been dedicated to promoting Yoga, fitness, mental wellness, discipline, and spiritual growth. His mission is to inspire people to make Yoga a way of life and build a healthier, stronger, and more conscious society.',
    social: { whatsapp: '8127227284' },
    featured: true,
    order: 1,
    isActive: true,
  },
  {
    name: 'Ayush Chaurasiya',
    title: 'Yoga Facilitator',
    qualification: 'BCA',
    specialization: ['Advanced Yogasana', 'Pranayama', 'Yoga Training'],
    experience: '4+ Years',
    certifications: ['UPYSA Judge Yogasana Certification'],
    biography: 'Ayush Chaurasiya is a dedicated Yoga Facilitator associated with Divy Ashish Yoga Sansthan, specializing in Advanced Yoga, Kids Yoga, General Yoga, and Common Yoga Protocol (CYP). He conducts sessions focused on pranayama, meditation, flexibility, strength, stress management, and overall wellness.',
    social: { whatsapp: '8127227284' },
    featured: true,
    order: 2,
    isActive: true,
  },
  {
    name: 'Palak Chaurasiya',
    title: 'Wellness & Meditation Guide',
    qualification: 'Yoga Practitioner',
    specialization: ['Yoga Nidra', 'Therapeutic Yoga', 'Senior Wellness'],
    experience: '3+ Years',
    certifications: ['Yoga Facilitator Certification'],
    biography: 'Palak Chaurasiya is a dedicated Yoga Facilitator specializing in Kids Yoga, General Yoga, and Common Yoga Protocol (CYP). She conducts engaging sessions focused on flexibility, strength, balance, pranayama, meditation, and relaxation.',
    social: { whatsapp: '8127227284' },
    featured: false,
    order: 3,
    isActive: true,
  },
  {
    name: 'Raj Kanaujia',
    title: 'Wellness & Meditation Guide',
    qualification: 'Yogasana Sports Athlete',
    specialization: ['Yogasana', 'Pranayama', 'Yoga Training', 'Body Detox Yoga'],
    experience: '3.5+ Years',
    certifications: ['State Level Yogasana Athlete'],
    biography: 'Raj Kanaujia is a National Level Yogasana Athlete, Yoga Facilitator, and Wellness & Fitness Motivator. He has earned 1 Gold & 4 Silver Medals at State Level and 5 Gold & 1 Silver Medal in SGFI Yogasana Championships. He specializes in Yogasana sports training, advanced yoga, strength, flexibility, balance, and athlete preparation.',
    social: { whatsapp: '8127227284' },
    featured: false,
    order: 4,
    isActive: true,
  },
  {
    name: 'Khushi Sonkar',
    title: 'Yoga Facilitator',
    qualification: 'M.A. Yoga (Pursuing)',
    specialization: ['Yogasana Sports', 'Flexibility Training', 'Competition Prep'],
    experience: '3+ Years',
    certifications: ['Yoga Facilitator Certification'],
    biography: 'Khushi is a dedicated Yoga Facilitator, Yogasana Player, and Manager associated with Divy Ashish Yog Sansthan. She specializes in Advanced Yoga, Kids Yoga, General Yoga, and Common Yoga Protocol (CYP), focusing on pranayama, meditation, flexibility, strength, and holistic wellness.',
    social: { whatsapp: '8127227284' },
    featured: true,
    order: 5,
    isActive: true,
  },
  {
    name: 'Anjali Kannojiya',
    title: 'Yoga Facilitator',
    qualification: 'Graduate',
    specialization: ['Yogasana Sports', 'Flexibility Training', 'Competition Prep'],
    experience: '2+ Years',
    certifications: ['Yoga Competition Judge Certification'],
    biography: 'Anjali Kannojiya is the Manager of DAYS Group of Mehndi Artists and a dedicated Yoga Practitioner. An experienced Yoga Competition Judge, she believes yoga builds physical strength, mental peace, discipline, confidence, and positivity.',
    social: { whatsapp: '8127227284' },
    featured: true,
    order: 6,
    isActive: true,
  },
  {
    name: 'Nidhi',
    title: 'Yoga Facilitator',
    qualification: 'Yoga Practitioner',
    specialization: ['Kids Yoga', 'General Yoga', 'Common Yoga Protocol'],
    experience: '2+ Years',
    certifications: ['Yoga Facilitator Certification'],
    biography: 'Nidhi is a dedicated Yoga Facilitator specializing in Kids Yoga, General Yoga, and holistic wellness programs. She is passionate about helping students of all ages develop a regular yoga practice focused on flexibility, mindfulness, and overall well-being.',
    social: { whatsapp: '8127227284' },
    featured: false,
    order: 7,
    isActive: true,
  },
];

const CLASSES = [
  {
    title: 'Group Yoga at Center',
    category: 'Offline',
    mode: 'Group',
    description: 'Group yoga sessions conducted at our centre in Aliganj, Lucknow. Practice with others in a supportive environment.',
    suitableFor: ['Beginners', 'Intermediate', 'Advanced', 'Therapeutic needs'],
    timing: 'As per schedule — morning & evening slots',
    icon: '🏛️',
    price: 'Regular ₹2,666/month · Offer ₹2,222/month (1 person) · 2 persons ₹1,999/person · 3 persons ₹1,777/person',
    featured: true,
    tags: ['Group', 'Offline'],
    order: 1,
    isActive: true,
  },
  {
    title: 'Home Personal Yoga',
    category: 'Offline',
    mode: 'Personal',
    description: 'Our certified facilitator visits your home for a completely personalised yoga session. Practice in the comfort of your own space.',
    suitableFor: ['All age groups', 'Senior citizens', 'Working professionals'],
    timing: 'Flexible — morning & evening available',
    icon: '🏠',
    price: 'Regular ₹12,222/month · Offer ₹9,999 (up to 3 members) · ₹8,888 within 3km · extra member ₹2,222',
    featured: false,
    tags: ['Personal', 'Offline'],
    order: 2,
    isActive: true,
  },
  {
    title: 'Online Group Yoga Sessions',
    category: 'Online',
    mode: 'Group',
    description: 'Live interactive group yoga classes conducted online. Join from anywhere in the world and practice with a community of like-minded wellness seekers.',
    suitableFor: ['All levels', 'Working professionals', 'Students', 'NRIs'],
    timing: '05:15 AM | 06:00 AM | 07:00 AM | 05:00 PM | 06:00 PM',
    icon: '💻',
    price: 'Regular ₹2,222/month · Offer ₹1,888/month (1 person) · 2 persons ₹1,666/person · 3 persons ₹1,555/person',
    featured: true,
    tags: ['Group', 'Online'],
    order: 3,
    isActive: true,
  },
  {
    title: 'Online Personal Yoga',
    category: 'Online',
    mode: 'Personal',
    description: 'Private one-on-one yoga sessions conducted via video call. Get dedicated attention and a fully customised program online.',
    suitableFor: ['Therapeutic', 'Specific health conditions', 'Advanced practitioners'],
    timing: 'Flexible — by appointment',
    icon: '🎯',
    price: 'From ₹2,222/session',
    featured: false,
    tags: ['Personal', 'Online'],
    order: 4,
    isActive: true,
  },
  {
    title: 'Park Group Yoga',
    category: 'Offline',
    mode: 'Group',
    description: 'Experience yoga in the open air at a local park. Connect with nature while practising asanas in a community environment.',
    suitableFor: ['All levels', 'Nature lovers', 'Seniors', 'Families'],
    timing: '05:15 AM | 06:00 AM | 07:00 AM',
    icon: '🌳',
    price: '₹777/month',
    featured: true,
    tags: ['Group', 'Offline'],
    order: 5,
    isActive: true,
  },
  {
    title: 'Advanced Group Yogasana Sessions',
    category: 'Offline',
    mode: 'Group',
    description: 'Focused group sessions for yogasana sports training. Emphasis on precision, form and performance for competition-level practice.',
    suitableFor: ['Sports aspirants', 'Competition participants', 'Advanced students'],
    timing: '03:45 PM',
    icon: '🏆',
    price: 'Regular ₹2,222/month · Offer ₹1,888/month',
    featured: false,
    tags: ['Group', 'Sports', 'Offline'],
    order: 6,
    isActive: true,
  },
];

const PLANS = [
  {
    name: 'Group Yoga at Center',
    subtitle: 'Start Your Journey',
    price: '₹2,222',
    priceDetails: 'Regular ₹2,666 · Offer ₹2,222/person · 2 persons: ₹1,999/person · 3 persons: ₹1,777/person',
    duration: 'Monthly',
    mode: 'Offline Group',
    popular: false,
    color: 'forest',
    benefits: [
      'Group yoga classes (choose any one batch)',
      'Access to morning or evening schedule',
      'Pranayama & yogasana practice',
      'Monthly progress assessment',
      'WhatsApp support',
    ],
    cta: 'Get Started',
    badge: null,
    order: 1,
    isActive: true,
  },
  {
    name: 'Personal Yoga at Center',
    subtitle: 'Complete Wellness',
    price: '₹6,666',
    priceDetails: 'Offer price · up to 3 members',
    duration: 'Monthly',
    mode: 'Offline Personal',
    popular: true,
    color: 'gold',
    benefits: [
      'Personal one-on-one sessions',
      'Customised yoga program',
      'Diet & lifestyle guidance',
      'Competition preparation support',
      'Unlimited schedule access',
      'Priority WhatsApp support',
      'Monthly health assessment',
    ],
    cta: 'Join Premium',
    badge: 'Most Popular',
    order: 2,
    isActive: true,
  },
  {
    name: 'Online Group Yoga',
    subtitle: 'Yoga Anywhere',
    price: '₹1,888',
    priceDetails: 'Regular ₹2,222 · Offer ₹1,888/person · 2 persons: ₹1,666/person · 3 persons: ₹1,555/person',
    duration: 'Monthly',
    mode: 'Online',
    popular: false,
    color: 'emerald',
    benefits: [
      'Live online group classes',
      'Morning & evening batches',
      'Yoga Nidra (10 PM session)',
      'Recorded session access',
      'WhatsApp community support',
    ],
    cta: 'Go Digital',
    badge: null,
    order: 3,
    isActive: true,
  },
  {
    name: 'Personal Yoga at Home',
    subtitle: 'Tailored For You',
    price: '₹9,999',
    priceDetails: 'Within 3km ₹8,888 · extra member ₹2,222',
    duration: 'Monthly',
    mode: 'Offline Personal / Home Visit',
    popular: false,
    color: 'bronze',
    benefits: [
      'Home visit personal sessions',
      'Online personal sessions',
      'Fully customised program',
      'Health condition specific practice',
      'Direct facilitator access',
    ],
    cta: 'Personalise Now',
    badge: null,
    order: 4,
    isActive: true,
  },
  {
    name: 'Student Wellness Plan',
    subtitle: 'Focus & Perform',
    price: 'From ₹499',
    priceDetails: 'Special plans for students',
    duration: 'Monthly',
    mode: 'Offline / Online',
    popular: false,
    color: 'forest',
    benefits: [
      'Student-focused yoga sequences',
      'Concentration & memory enhancement',
      'Stress management techniques',
      'Yogasana sports training option',
      'Flexible morning/evening slots',
    ],
    cta: 'Student Enroll',
    badge: 'Student Special',
    order: 5,
    isActive: true,
  },
  {
    name: 'Park Yoga',
    subtitle: 'Wellness For All',
    price: '₹777',
    priceDetails: 'Per month',
    duration: 'Monthly',
    mode: 'Outdoor Group',
    popular: false,
    color: 'emerald',
    benefits: [
      'Open-air yoga practice',
      'Community environment',
      'Suitable for all levels',
      'Morning park sessions',
      'Nature-connected practice',
      'Monthly membership',
    ],
    cta: 'Park Enroll',
    badge: 'Outdoor Wellness',
    order: 6,
    isActive: true,
  },
];

const ACHIEVEMENTS = [
  {
    title: 'District Yogasana Championship — Gold Medal',
    level: 'District',
    year: '2023',
    location: 'Lucknow, Uttar Pradesh',
    position: '1st Place — Gold Medal',
    description: 'District-level Yogasana sports competition. Students of DAYS secured gold medals in multiple categories.',
    icon: '🥇',
    type: 'Competition',
    order: 1,
    isActive: true,
  },
  {
    title: 'State Yogasana Championship',
    level: 'State',
    year: '2023',
    location: 'Uttar Pradesh',
    position: '1 Gold, 4 Silver Medals',
    description: 'State-level Yogasana competition — DAYS athletes secured multiple medals across age categories.',
    icon: '🏆',
    type: 'Championship',
    order: 2,
    isActive: true,
  },
  {
    title: 'SGFI Yogasana Championship',
    level: 'National',
    year: '2023',
    location: 'India',
    position: '5 Gold, 1 Silver Medal',
    description: 'School Games Federation of India (SGFI) Yogasana Championship — outstanding national performance.',
    icon: '🎖️',
    type: 'Championship',
    order: 3,
    isActive: true,
  },
  {
    title: 'UPYSA Yoga Judge Certification',
    level: 'Certification',
    year: '2022',
    location: 'Uttar Pradesh Yogasana Sports Association',
    position: 'Certified Judge',
    description: 'Official UPYSA certification as a Yogasana sports judge, qualifying to officiate at state and national events.',
    icon: '📜',
    type: 'Certification',
    order: 4,
    isActive: true,
  },
  {
    title: 'Yoga Competition Observer / Judge',
    level: 'Judge / Observer',
    year: '2023',
    location: 'Multiple Events, Uttar Pradesh',
    position: 'Official Judge / Observer',
    description: 'Officiated as judge and observer at multiple district and state-level Yogasana competitions.',
    icon: '⚖️',
    type: 'Judge / Observer',
    order: 5,
    isActive: true,
  },
];

const ACHIEVEMENT_STATS = [
  { label: 'Years of Experience', value: '11+',  icon: '📅', order: 1 },
  { label: 'Students Trained',    value: '1000+', icon: '🧘', order: 2 },
  { label: 'Competitions Won',    value: '500+',  icon: '🏆', order: 3 },
  { label: 'Certifications Held', value: '100+',  icon: '📜', order: 4 },
];

const SCHEDULE = [
  { time: '05:15 AM', session: 'Morning Sadhana',    type: 'Group',            mode: 'Offline / Online', description: 'Early morning group yoga — pranayama, surya namaskar & asanas',              period: 'morning', duration: '45 min', suitable: 'All levels',                        order: 1, isActive: true },
  { time: '06:00 AM', session: 'Sunrise Yoga',       type: 'Group / Personal', mode: 'Offline / Online', description: 'Yogasana practice aligned with the sunrise energy',                          period: 'morning', duration: '60 min', suitable: 'Beginner to Advanced',               order: 2, isActive: true },
  { time: '07:00 AM', session: 'Power Yogasana',     type: 'Group / Sports',   mode: 'Offline',          description: 'Yogasana sports training — strength, flexibility & competition prep',         period: 'morning', duration: '60 min', suitable: 'Intermediate to Advanced',           order: 3, isActive: true },
  { time: '08:00 AM', session: "Children's Yoga",    type: 'Group',            mode: 'Offline',          description: 'Fun & engaging yoga for children — builds focus and flexibility',              period: 'morning', duration: '45 min', suitable: 'Age 5–16',                          order: 4, isActive: true },
  { time: '09:00 AM', session: 'Wellness Yoga',      type: 'Personal / Group', mode: 'Offline / Online', description: 'Therapeutic yoga, senior wellness and personal sessions',                     period: 'morning', duration: '60 min', suitable: 'Seniors, therapeutic needs',         order: 5, isActive: true },
  { time: '03:30 PM', session: 'Afternoon Practice', type: 'Personal',         mode: 'Offline / Home',   description: 'Home personal yoga visits and centre personal sessions',                      period: 'evening', duration: '60 min', suitable: 'Working professionals',              order: 6, isActive: true },
  { time: '05:00 PM', session: 'Evening Yoga',       type: 'Group',            mode: 'Offline / Online', description: 'Relaxing group yoga — asanas, breathing & mindfulness',                      period: 'evening', duration: '60 min', suitable: 'All levels',                        order: 7, isActive: true },
  { time: '06:00 PM', session: 'Sunset Sadhana',     type: 'Group / Personal', mode: 'Offline / Online', description: 'Yoga aligned with evening energy — flexibility & relaxation focus',           period: 'evening', duration: '60 min', suitable: 'All levels',                        order: 8, isActive: true },
  { time: '07:00 PM', session: 'Night Yoga',         type: 'Group / Personal', mode: 'Online / Offline', description: 'Gentle yoga and pranayama to wind down the day',                             period: 'evening', duration: '45 min', suitable: 'All levels',                        order: 9, isActive: true },
  { time: '10:00 PM', session: 'Yoga Nidra',         type: 'Group',            mode: 'Online',           description: 'Guided yogic sleep — deep relaxation, stress relief and healing',             period: 'night',   duration: '45 min', suitable: 'All levels — especially for stress & insomnia', order: 10, isActive: true },
];

const REVIEWS = [
  {
    name: 'Priya Sharma',
    category: 'Group Yoga',
    rating: 5,
    review: 'DIVY ASHISH YOGA SANSTHAN ne meri zindagi badal di. Pehle kamar dard aur stress bahut tha, lekin 3 mahine ki group yoga ke baad main bilkul fit feel kar rahi hoon. Ashish sir ka guidance bahut professional aur caring hai. Highly recommended!',
    approved: true,
    verified: true,
    date: new Date('2026-03-12'),
  },
  {
    name: 'Rahul Verma',
    category: 'Yogasana Sports',
    rating: 5,
    review: 'Mujhe district level yogasana competition ke liye prepare karna tha. AN Yoga Institute ki training world class hai. Sir ne har asana ko itne detail se sikhaya ki main district champion ban gaya. Inka dedication aur expertise truly outstanding hai.',
    approved: true,
    verified: true,
    date: new Date('2026-02-28'),
  },
  {
    name: 'Sunita Gupta',
    category: 'Online Yoga',
    rating: 5,
    review: 'Main Delhi mein hoon aur online personal yoga classes le rahi hoon. Technology aur yoga ka ye combination amazing hai. Har session ke baad fresh aur energetic feel hota hai. Timing bhi flexible hai jo working professionals ke liye perfect hai.',
    approved: true,
    verified: true,
    date: new Date('2026-04-01'),
  },
  {
    name: 'Anil Kumar',
    category: 'Personal Yoga',
    rating: 5,
    review: 'Diabetes aur BP ke liye doctor ne yoga recommend kiya tha. AN Yoga Institute mein personal training li — 2 mahine mein blood sugar control mein aa gaya. Ayush sir ne meri health condition samajh ke customized program banaya. Bahut grateful hoon.',
    approved: true,
    verified: true,
    date: new Date('2026-01-20'),
  },
  {
    name: 'Kavita Singh',
    category: "Children's Yoga",
    rating: 5,
    review: 'Mere bete (age 10) ki concentration aur flexibility dono mein bahut improvement aayi hai. Children\'s yoga program ekdum age-appropriate hai. Teachers bahut patient aur friendly hain. School performance bhi better hui hai. Thank you AN Yoga!',
    approved: true,
    verified: true,
    date: new Date('2026-03-05'),
  },
  {
    name: 'Meena Tiwari',
    category: 'Group Yoga',
    rating: 5,
    review: 'Lucknow mein itna dedicated yoga institute dhundna mushkil tha. Subah 5:30 AM ki class mein bhi full energy se sikhate hain. Morning routine completely transform ho gayi. Weight bhi 8 kg kam hua 4 mahine mein. Shukriya DIVY ASHISH YOGA SANSTHAN!',
    approved: true,
    verified: true,
    date: new Date('2026-02-14'),
  },
  {
    name: 'Deepak Mishra',
    category: 'Yogasana Sports',
    rating: 5,
    review: 'State level competition ki preparation yahan se ki. Coaching style bilkul alag hai — technique pe focus, strength pe focus, aur mental preparation bhi. Result: State level mein bronze medal mila. Inka experience aur knowledge unmatched hai.',
    approved: true,
    verified: true,
    date: new Date('2026-04-10'),
  },
  {
    name: 'Anjali Yadav',
    category: 'Personal Yoga',
    rating: 4,
    review: 'Home personal yoga classes leti hoon. Convenience bahut hai — apne ghar mein certified trainer aata hai. PCOD aur stress management ke liye specifically designed routine di gayi. 6 hafte mein noticeable difference aa gaya. Very professional service.',
    approved: true,
    verified: true,
    date: new Date('2026-01-30'),
  },
];

/* ════════════════════════════════════════════════════════
   SEED RUNNER
════════════════════════════════════════════════════════ */
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // ── 1. Admin ───────────────────────────────────────────
  const email    = process.env.ADMIN_EMAIL    || 'admin@anyogainstitute.org';
  const password = process.env.ADMIN_PASSWORD || 'Admin@DAYS2024!';
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${email}`);
  } else {
    await Admin.create({ name: 'Admin', email, password });
    console.log(`✅ Admin created: ${email}`);
  }

  // ── 2. Site config ─────────────────────────────────────
  await SiteConfig.findByIdAndUpdate('main', {
    siteName: 'DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE)',
    tagline:  'एक कदम अपने और अपनों के स्वास्थ्य की ओर',
    phones:   ['6386659500'],
    whatsapp: '8127227284',
    website:  'www.anyogainstitute.org',
    address: {
      area: 'Aliganj', city: 'Lucknow', state: 'Uttar Pradesh',
      country: 'India', mapsUrl: 'https://maps.app.goo.gl/BEqwed6jzNAj1T7m6',
    },
    hours: [
      { days: 'Monday – Saturday', time: '5:00 AM – 9:00 PM' },
      { days: 'Sunday',            time: '5:00 AM – 8:00 AM' },
    ],
    services: [
      'Centre-Based Personal Yoga', 'Home Personal Yoga', 'Online Group Yoga',
      'Online Personal Yoga', 'Park Group Yoga', "Children's Yogasana",
      'Yogasana Sports Training', 'Yoga Nidra', 'Wellness Programs', 'Other Enquiry',
    ],
  }, { upsert: true, new: true });
  console.log('✅ Site config seeded');

  // ── 3. Social links ────────────────────────────────────
  await SocialLink.deleteMany({});
  await SocialLink.insertMany(SOCIAL_LINKS);
  console.log(`✅ Social links seeded (${SOCIAL_LINKS.length})`);

  // ── 4. Facilitators ────────────────────────────────────
  await Facilitator.deleteMany({});
  await Facilitator.insertMany(FACILITATORS);
  console.log(`✅ Facilitators seeded (${FACILITATORS.length})`);

  // ── 5. Classes ─────────────────────────────────────────
  await Class.deleteMany({});
  await Class.insertMany(CLASSES);
  console.log(`✅ Classes seeded (${CLASSES.length})`);

  // ── 6. Plans ───────────────────────────────────────────
  await Plan.deleteMany({});
  await Plan.insertMany(PLANS);
  console.log(`✅ Plans seeded (${PLANS.length})`);

  // ── 7. Achievements ────────────────────────────────────
  await Achievement.deleteMany({});
  await Achievement.insertMany(ACHIEVEMENTS);
  console.log(`✅ Achievements seeded (${ACHIEVEMENTS.length})`);

  await AchievementStat.deleteMany({});
  await AchievementStat.insertMany(ACHIEVEMENT_STATS);
  console.log(`✅ Achievement stats seeded (${ACHIEVEMENT_STATS.length})`);

  // ── 8. Schedule ────────────────────────────────────────
  await Schedule.deleteMany({});
  await Schedule.insertMany(SCHEDULE);
  console.log(`✅ Schedule slots seeded (${SCHEDULE.length})`);

  // ── 9. Reviews ─────────────────────────────────────────
  await Review.deleteMany({});
  await Review.insertMany(REVIEWS);
  console.log(`✅ Reviews seeded (${REVIEWS.length})`);

  // ── Done ───────────────────────────────────────────────
  console.log('\n🌿 Seeding complete!');
  console.log(`📊 Admin dashboard: your-server-url/admin`);
  console.log(`🔑 Login: ${email} / ${password}\n`);

  await mongoose.disconnect();
}

seed().catch((err) => { console.error('❌ Seed failed:', err); process.exit(1); });
