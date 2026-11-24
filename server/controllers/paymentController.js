/**
 * paymentController.js  — UPI Direct QR Payment System
 *
 * Flow:
 *   1. POST /api/payment/create-order
 *        → validates plan, generates unique txnRef, builds UPI deep-link,
 *          renders QR server-side, saves Payment doc with 60s expiry
 *
 *   2. GET  /api/payment/status/:orderId
 *        → frontend polls every 3s; auto-expires on timeout
 *
 *   3. POST /api/payment/confirm  [admin only]
 *        → admin opens dashboard, enters UTR / confirms payment received,
 *          marks status = 'paid', creates Membership record
 *
 * Amount is ALWAYS read from the server's PLAN_PRICES table — the client
 * never sends an amount, preventing manipulation.
 */

const crypto     = require('crypto');
const QRCode     = require('qrcode');
const Payment    = require('../models/Payment');
const Membership = require('../models/Membership');

// ── UPI config ───────────────────────────────────────────────────────────────
const UPI_VPA      = process.env.UPI_VPA      || 'ashishku325@okhdfcbank';
const UPI_NAME     = process.env.UPI_NAME     || 'DAYS Yoga Sansthan';
const QR_TTL_SECS  = parseInt(process.env.PAYMENT_TTL_SECONDS || '60', 10);

// ── Plan catalogue — single source of truth for prices ───────────────────────
// Session plans include session fee + ₹567 annual registration.
// Trial plans are standalone (no annual fee added).
const PLAN_PRICES = {
  // Regular session plans (session + ₹567 annual registration = total)
  'session-1': { label: 'Group Yoga at Center',        mode: 'Offline Group',        duration: 'Monthly', rupees: 2789 },
  'session-2': { label: 'Personal Yoga at Center',     mode: 'Offline Personal',     duration: 'Monthly', rupees: 7233 },
  'session-3': { label: 'Online Group Yoga',           mode: 'Online',               duration: 'Monthly', rupees: 2455 },
  'session-4': { label: 'Personal Yoga at Home',       mode: 'Online/Home',          duration: 'Monthly', rupees: 10566 },
  'session-5': { label: 'Student Wellness Plan',       mode: 'Offline / Online',     duration: 'Monthly', rupees: 1066 },
  'session-6': { label: 'Park Yoga',                   mode: 'Outdoor Group',        duration: 'Monthly', rupees: 1344 },
  // Trial / introductory sessions (standalone fee)
  'park-group':      { label: 'Park Group Yoga (Trial)',          mode: 'Outdoor',  duration: '5 Days', rupees: 99   },
  'online-group':    { label: 'Online Group Yoga (Trial)',        mode: 'Online',   duration: '4 Days', rupees: 149  },
  'centre-group':    { label: 'Centre Group Yoga (Trial)',        mode: 'Offline',  duration: '5 Days', rupees: 199  },
  'online-personal': { label: 'Online Personal Yoga (Trial)',     mode: 'Online',   duration: '4 Days', rupees: 499  },
  'centre-personal': { label: 'Centre Personal Yoga (Trial)',     mode: 'Offline',  duration: '4 Days', rupees: 999  },
  'home-personal':   { label: 'Home Visit Personal Yoga (Trial)', mode: 'Home',     duration: '4 Days', rupees: 1499 },
  // Annual registration only
  'annual':          { label: 'Annual Registration',              mode: 'All',      duration: '1 Year', rupees: 567  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeOrderId() {
  // e.g.  DAYS-1718001234567-A3F2
  const ts   = Date.now();
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `DAYS-${ts}-${rand}`;
}

async function buildQR(upiLink) {
  return QRCode.toDataURL(upiLink, {
    width:        320,
    margin:       2,
    errorCorrectionLevel: 'H',
    color: { dark: '#0d1f12', light: '#f0e8d0' },
  });
}

/* ══════════════════════════════════════════════════════════
   POST /api/payment/create-order
   Body: { planId, name, phone, timing? }
══════════════════════════════════════════════════════════ */
async function createOrder(req, res, next) {
  try {
    // Fail fast with helpful message if DB is not connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable. Please try again in a moment.',
        db_offline: true,
      });
    }

    const { planId, name, phone, timing } = req.body;

    // 1. Input validation
    if (!planId || !name?.trim() || !phone?.trim()) {
      return res.status(400).json({ success: false, message: 'planId, name and phone are required.' });
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit phone number.' });
    }

    // 2. Server-side price lookup — never accept amount from client
    const plan = PLAN_PRICES[planId];
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan ID.' });
    }

    // 3. Reuse active (unexpired + unpaid) order for same phone+plan
    //    Prevents spamming new QRs before the previous one expires
    const existing = await Payment.findOne({
      phone: phone.trim(),
      planId,
      status: 'created',
      expiresAt: { $gt: new Date() },
    });

    if (existing) {
      const secondsLeft = Math.max(0, Math.round((existing.expiresAt - Date.now()) / 1000));
      return res.json({
        success:      true,
        orderId:      existing.orderId,
        amountRupees: existing.amountRupees,
        planLabel:    existing.planLabel,
        duration:     existing.duration,
        qrDataUrl:    existing.qrDataUrl,
        expiresAt:    existing.expiresAt,
        secondsLeft,
        reused:       true,
      });
    }

    // 4. Generate unique transaction reference
    const orderId  = makeOrderId();
    const txnNote  = encodeURIComponent(`DAYS ${plan.label} - ${orderId.slice(-8)}`);

    // 5. Build UPI deep-link
    //    Format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&tr=REF&tn=NOTE&cu=INR
    const upiLink = [
      `upi://pay`,
      `?pa=${encodeURIComponent(UPI_VPA)}`,
      `&pn=${encodeURIComponent(UPI_NAME)}`,
      `&am=${plan.rupees}.00`,
      `&tr=${orderId}`,
      `&tn=${txnNote}`,
      `&cu=INR`,
      `&mode=02`,   // 02 = QR payment mode per NPCI spec
    ].join('');

    // 6. Render QR server-side
    const qrDataUrl = await buildQR(upiLink);

    // 7. Persist order
    const expiresAt = new Date(Date.now() + QR_TTL_SECS * 1000);
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '';

    await Payment.create({
      orderId,
      name:         name.trim(),
      phone:        phone.trim(),
      timing:       timing?.trim() || '',
      planId,
      planLabel:    plan.label,
      planMode:     plan.mode,
      duration:     plan.duration,
      amountPaise:  plan.rupees * 100,
      amountRupees: plan.rupees,
      status:       'created',
      expiresAt,
      qrDataUrl,
      upiLink,
      ip,
    });

    return res.status(201).json({
      success:      true,
      orderId,
      amountRupees: plan.rupees,
      planLabel:    plan.label,
      duration:     plan.duration,
      qrDataUrl,
      expiresAt,
      secondsLeft:  QR_TTL_SECS,
      upiVpa:       UPI_VPA,       // safe to expose — it's the receiver's VPA
      upiName:      UPI_NAME,
      reused:       false,
    });

  } catch (err) { next(err); }
}

/* ══════════════════════════════════════════════════════════
   GET /api/payment/status/:orderId
   Frontend polls every 3 seconds.
══════════════════════════════════════════════════════════ */
async function getStatus(req, res, next) {
  try {
    const payment = await Payment.findOne(
      { orderId: req.params.orderId },
      '-qrDataUrl -upiLink -webhookRaw -ip' // exclude heavy / sensitive fields
    );
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Auto-expire in DB if TTL passed and still pending
    if (payment.status === 'created' && payment.expiresAt < new Date()) {
      payment.status = 'expired';
      await payment.save();
    }

    return res.json({
      success:      true,
      status:       payment.status,   // created | paid | failed | expired
      orderId:      payment.orderId,
      amountRupees: payment.amountRupees,
      planLabel:    payment.planLabel,
      expiresAt:    payment.expiresAt,
      secondsLeft:  payment.status === 'created'
        ? Math.max(0, Math.round((payment.expiresAt - Date.now()) / 1000))
        : 0,
      utrNumber:    payment.utrNumber || null,
    });
  } catch (err) { next(err); }
}

/* ══════════════════════════════════════════════════════════
   POST /api/payment/confirm  [admin only]
   Admin opens dashboard, finds the order, enters UTR and
   confirms payment received in their UPI app.
   Body: { orderId, utrNumber }
══════════════════════════════════════════════════════════ */
async function confirmPayment(req, res, next) {
  try {
    const { orderId, utrNumber } = req.body;
    if (!orderId || !utrNumber?.trim()) {
      return res.status(400).json({ success: false, message: 'orderId and utrNumber are required.' });
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Idempotent — already confirmed
    if (payment.status === 'paid') {
      return res.json({ success: true, message: 'Already confirmed.', data: payment });
    }

    if (payment.status === 'expired' || payment.status === 'failed') {
      return res.status(400).json({ success: false, message: `Cannot confirm — order is ${payment.status}.` });
    }

    // Mark paid
    payment.status    = 'paid';
    payment.utrNumber = utrNumber.trim();
    await payment.save();

    // Create / update Membership record
    if (!payment.membershipId) {
      const membership = await Membership.create({
        name:           payment.name,
        phone:          payment.phone,
        age:            0,
        level:          'Trial',
        mode:           payment.planMode,
        membershipType: payment.planId === 'annual' ? 'annual' : 'trial',
        status:         'active',
        notes:          `UPI payment confirmed by admin. UTR: ${utrNumber.trim()}. Order: ${orderId}`,
        ip:             payment.ip,
      });
      payment.membershipId = membership._id;
      await payment.save();
    }

    return res.json({ success: true, message: 'Payment confirmed.', data: payment });
  } catch (err) { next(err); }
}

/* ══════════════════════════════════════════════════════════
   GET /api/payment/list  [admin only]
   List all payments for the admin dashboard.
══════════════════════════════════════════════════════════ */
async function listPayments(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [items, total] = await Promise.all([
      Payment.find(filter, '-qrDataUrl -upiLink')
        .sort({ createdAt: -1 })
        .skip((page - 1) * Number(limit))
        .limit(Number(limit)),
      Payment.countDocuments(filter),
    ]);
    return res.json({ success: true, data: items, total, page: Number(page) });
  } catch (err) { next(err); }
}

module.exports = { createOrder, getStatus, confirmPayment, listPayments };
