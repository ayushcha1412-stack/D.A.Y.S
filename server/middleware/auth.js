const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User  = require('../models/User');

/* ── Generic token verifier ───────────────────────────── */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/* ── Extract Bearer token from header ────────────────── */
function extractToken(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

/* ── Protect: any authenticated user or admin ─────────── */
async function protect(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated. Token missing.' });

  try {
    const decoded = verifyToken(token);
    // Try admin first, then user
    let account = await Admin.findById(decoded.id).select('-password');
    if (!account) account = await User.findById(decoded.id).select('-password');
    if (!account) return res.status(401).json({ success: false, message: 'Account not found.' });

    req.user = account;
    req.role = decoded.role || 'user';
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

/* ── Admin only ───────────────────────────────────────── */
async function adminOnly(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated.' });

  try {
    const decoded = verifyToken(token);
    if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required.' });

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ success: false, message: 'Admin account not found.' });

    req.user = admin;
    req.role = 'admin';
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

/* ── Optional auth: sets req.role if token present, never blocks ── */
async function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return next(); // no token → continue as public
  try {
    const decoded = verifyToken(token);
    let account = await Admin.findById(decoded.id).select('-password');
    if (!account) account = await User.findById(decoded.id).select('-password');
    if (account) {
      req.user = account;
      req.role = decoded.role || 'user';
    }
  } catch { /* invalid token — treat as unauthenticated */ }
  next();
}

module.exports = { protect, adminOnly, optionalAuth };
