const Enquiry = require('../models/Enquiry');

/* Public: submit contact form */
async function create(req, res, next) {
  try {
    const { name, phone, email, service, message } = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
    const item = await Enquiry.create({ name, phone, email, service, message, ip });
    res.status(201).json({ success: true, message: 'Enquiry received. We will contact you soon.' });
    void item; // suppress unused warning
  } catch (err) { next(err); }
}

/* Admin: list all enquiries */
async function getAll(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [items, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Enquiry.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
}

/* Admin: get single */
async function getOne(req, res, next) {
  try {
    const item = await Enquiry.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

/* Admin: update status / notes */
async function update(req, res, next) {
  try {
    const item = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

/* Admin: delete */
async function remove(req, res, next) {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (err) { next(err); }
}

module.exports = { create, getAll, getOne, update, remove };
