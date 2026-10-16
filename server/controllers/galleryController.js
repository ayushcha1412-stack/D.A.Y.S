const Gallery = require('../models/Gallery');
const path    = require('path');
const fs      = require('fs');

async function getAll(req, res, next) {
  try {
    const filter = req.role === 'admin' ? {} : { isActive: true };
    const items  = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required.' });
    const imageUrl = `/uploads/${req.file.filename}`;
    const item = await Gallery.create({ ...req.body, image: imageUrl });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    const item = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });

    // Delete file from disk
    if (item.image) {
      const filePath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };
