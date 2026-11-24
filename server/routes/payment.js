const router    = require('express').Router();
const rateLimit = require('express-rate-limit');
const ctrl      = require('../controllers/paymentController');
const { adminOnly } = require('../middleware/auth');

// Stricter limiter for order creation — prevents QR spam
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many payment requests. Please wait a moment.' },
});

// Public
router.post('/create-order', orderLimiter, ctrl.createOrder);
router.get('/status/:orderId', ctrl.getStatus);

// Admin only
router.post('/confirm',  adminOnly, ctrl.confirmPayment);
router.get('/list',      adminOnly, ctrl.listPayments);

module.exports = router;
