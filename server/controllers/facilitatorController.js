const Facilitator = require('../models/Facilitator');

const PUBLIC_FILTER = { isActive: true };

/* ── GET /api/facilitators ────────────────────────────── */
async function getAll(req, res, next) {
  try {
    const filter = req.role === 'admin' ? {} : PUBLIC_FILTER;
    const items  = await Facilitator.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

/* ── GET /api/facilitators/:id ────────────────────────── */
async function getOne(req, res, next) {
  try {
    const item = await Facilitator.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Facilitator not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

/* ── POST /api/facilitators  [admin] ──────────────────── */
async function create(req, res, next) {
  try {
    const item = await Facilitator.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

/* ── PUT /api/facilitators/:id  [admin] ───────────────── */
async function update(req, res, next) {
  try {
    const item = await Facilitator.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Facilitator not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

/* ── DELETE /api/facilitators/:id  [admin] ────────────── */
async function remove(req, res, next) {
  try {
    const item = await Facilitator.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Facilitator not found.' });
    res.json({ success: true, message: 'Facilitator deleted.' });
  } catch (err) { next(err); }
}

/* ── POST /api/facilitators/:id/image  [admin] ────────── */
async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded.' });
    const imageUrl = `/uploads/${req.file.filename}`;
    const item = await Facilitator.findByIdAndUpdate(req.params.id, { image: imageUrl }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Facilitator not found.' });
    res.json({ success: true, imageUrl, data: item });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove, uploadImage };
