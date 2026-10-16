const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User  = require('../models/User');

function signToken(id, role, expiresIn) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
}

/* ── POST /api/auth/admin/login ───────────────────────── */
async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    if (!admin.isActive) return res.status(403).json({ success: false, message: 'Account disabled.' });

    admin.lastLogin = new Date();
    await admin.save();

    const token = signToken(admin._id, 'admin', process.env.JWT_ADMIN_EXPIRES_IN || '1d');
    res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
    });
  } catch (err) { next(err); }
}

/* ── POST /api/auth/register ──────────────────────────── */
async function register(req, res, next) {
  try {
    const { name, phone, email, password, age, gender } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ success: false, message: 'Phone already registered.' });

    const user = await User.create({ name, phone, email, password, age, gender });
    const token = signToken(user._id, 'user', process.env.JWT_EXPIRES_IN || '7d');
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, phone: user.phone, email: user.email },
    });
  } catch (err) { next(err); }
}

/* ── POST /api/auth/login ─────────────────────────────── */
async function login(req, res, next) {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid phone or password.' });
    }
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account disabled.' });

    const token = signToken(user._id, 'user', process.env.JWT_EXPIRES_IN || '7d');
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, phone: user.phone, email: user.email },
    });
  } catch (err) { next(err); }
}

/* ── GET /api/auth/me ─────────────────────────────────── */
async function getMe(req, res) {
  res.json({ success: true, user: req.user });
}

module.exports = { adminLogin, register, login, getMe };
