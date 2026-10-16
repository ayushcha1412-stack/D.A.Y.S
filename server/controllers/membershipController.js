const Membership = require('../models/Membership');

/* Public: submit membership registration */
async function create(req, res, next) {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
    const item = await Membership.create({ ...req.body, ip });
    res.status(201).json({ success: true, message: 'Registration received. We will contact you to confirm.', id: item._id });
  } catch (err) { next(err); }
}

/* Admin: list */
async function getAll(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [items, total] = await Promise.all([
      Membership.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Membership.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
}

/* Admin: get single */
async function getOne(req, res, next) {
  try {
    const item = await Membership.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Membership not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

/* Admin: update status / notes */
async function update(req, res, next) {
  try {
    const item = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Membership not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

/* Admin: delete */
async function remove(req, res, next) {
  try {
    await Membership.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Membership deleted.' });
  } catch (err) { next(err); }
}

module.exports = { create, getAll, getOne, update, remove };
