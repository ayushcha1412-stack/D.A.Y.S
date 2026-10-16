const Class = require('../models/Class');

async function getAll(req, res, next) {
  try {
    const filter = req.role === 'admin' ? {} : { isActive: true };
    const items  = await Class.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const item = await Class.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Class not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const item = await Class.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const item = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Class not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const item = await Class.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Class not found.' });
    res.json({ success: true, message: 'Class deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };
