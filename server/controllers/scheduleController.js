const Schedule = require('../models/Schedule');

async function getAll(req, res, next) {
  try {
    const filter = req.role === 'admin' ? {} : { isActive: true };
    const items  = await Schedule.find(filter).sort({ order: 1, time: 1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const item = await Schedule.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const item = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Schedule item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Schedule item deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, create, update, remove };
