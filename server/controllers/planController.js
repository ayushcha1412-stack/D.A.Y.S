const Plan = require('../models/Plan');

async function getAll(req, res, next) {
  try {
    const filter = req.role === 'admin' ? {} : { isActive: true };
    const items  = await Plan.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const item = await Plan.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Plan not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const item = await Plan.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const item = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Plan not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const item = await Plan.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Plan not found.' });
    res.json({ success: true, message: 'Plan deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };
