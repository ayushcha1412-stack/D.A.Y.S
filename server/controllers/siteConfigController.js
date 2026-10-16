const SiteConfig  = require('../models/SiteConfig');
const SocialLink  = require('../models/SocialLink');

/* ── GET /api/config ──────────────────────────────────── */
async function getConfig(req, res, next) {
  try {
    let config = await SiteConfig.findById('main');
    if (!config) config = await SiteConfig.create({ _id: 'main' });
    const socials = await SocialLink.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: { ...config.toObject(), socials } });
  } catch (err) { next(err); }
}

/* ── PUT /api/config  [admin] ─────────────────────────── */
async function updateConfig(req, res, next) {
  try {
    const config = await SiteConfig.findByIdAndUpdate('main', req.body, { new: true, upsert: true, runValidators: true });
    res.json({ success: true, data: config });
  } catch (err) { next(err); }
}

/* ── Social links ─────────────────────────────────────── */
async function getSocials(req, res, next) {
  try {
    const items = await SocialLink.find().sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

async function createSocial(req, res, next) {
  try {
    const item = await SocialLink.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function updateSocial(req, res, next) {
  try {
    const item = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Social link not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function removeSocial(req, res, next) {
  try {
    await SocialLink.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Social link deleted.' });
  } catch (err) { next(err); }
}

/* ── Dashboard stats ──────────────────────────────────── */
async function getDashboardStats(req, res, next) {
  try {
    const Enquiry    = require('../models/Enquiry');
    const Membership = require('../models/Membership');
    const Review     = require('../models/Review');
    const Facilitator= require('../models/Facilitator');

    const [enquiries, memberships, reviews, facilitators, newEnquiries, pendingMemberships, pendingReviews] =
      await Promise.all([
        Enquiry.countDocuments(),
        Membership.countDocuments(),
        Review.countDocuments(),
        Facilitator.countDocuments({ isActive: true }),
        Enquiry.countDocuments({ status: 'new' }),
        Membership.countDocuments({ status: 'pending' }),
        Review.countDocuments({ approved: false }),
      ]);

    res.json({
      success: true,
      data: {
        enquiries,    memberships,    reviews,    facilitators,
        newEnquiries, pendingMemberships, pendingReviews,
      },
    });
  } catch (err) { next(err); }
}

module.exports = { getConfig, updateConfig, getSocials, createSocial, updateSocial, removeSocial, getDashboardStats };
