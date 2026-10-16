const Review = require('../models/Review');

/* Public: only approved reviews */
async function getAll(req, res, next) {
  try {
    const filter = req.role === 'admin' ? {} : { approved: true };
    const items  = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

/* Public: submit a review (pending approval) */
async function create(req, res, next) {
  try {
    const { name, category, rating, review } = req.body;
    const item = await Review.create({ name, category, rating, review, approved: false });
    res.status(201).json({ success: true, message: 'Review submitted. It will appear after approval.', data: item });
  } catch (err) { next(err); }
}

/* Admin: approve / update */
async function update(req, res, next) {
  try {
    const item = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

/* Admin: delete */
async function remove(req, res, next) {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) { next(err); }
}

/* Admin: approve shortcut */
async function approve(req, res, next) {
  try {
    const item = await Review.findByIdAndUpdate(req.params.id, { approved: true, verified: true }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update, remove, approve };
