const { Achievement, AchievementStat } = require('../models/Achievement');

/* ── Achievements ─────────────────────────────────────── */
async function getAll(req, res, next) {
  try {
    const filter = req.role === 'admin' ? {} : { isActive: true };
    const [items, stats] = await Promise.all([
      Achievement.find(filter).sort({ order: 1, year: -1 }),
      AchievementStat.find().sort({ order: 1 }),
    ]);
    res.json({ success: true, data: items, stats });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Achievement not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const item = await Achievement.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Achievement not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Achievement deleted.' });
  } catch (err) { next(err); }
}

/* ── Stats ────────────────────────────────────────────── */
async function getStats(req, res, next) {
  try {
    const stats = await AchievementStat.find().sort({ order: 1 });
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
}

async function createStat(req, res, next) {
  try {
    const stat = await AchievementStat.create(req.body);
    res.status(201).json({ success: true, data: stat });
  } catch (err) { next(err); }
}

async function updateStat(req, res, next) {
  try {
    const stat = await AchievementStat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stat) return res.status(404).json({ success: false, message: 'Stat not found.' });
    res.json({ success: true, data: stat });
  } catch (err) { next(err); }
}

async function removeStat(req, res, next) {
  try {
    await AchievementStat.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Stat deleted.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove, getStats, createStat, updateStat, removeStat };
