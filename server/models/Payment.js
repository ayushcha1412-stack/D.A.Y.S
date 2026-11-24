const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    // Unique order reference  e.g. DAYS-1718001234567-A3F2
    orderId:   { type: String, required: true, unique: true },

    // Customer details
    name:      { type: String, required: true, trim: true },
    phone:     { type: String, required: true, trim: true },
    timing:    { type: String, default: '' },

    // Plan details stored server-side — amount cannot be manipulated
    planId:    { type: String, required: true },
    planLabel: { type: String, required: true },
    planMode:  { type: String, default: '' },
    duration:  { type: String, default: '' },

    // Amount
    amountPaise:  { type: Number, required: true },   // paise (amount × 100)
    amountRupees: { type: Number, required: true },   // display value

    // UPI fields
    upiLink:   { type: String, default: '' },         // upi://pay?... deep-link
    qrDataUrl: { type: String, default: '' },         // base64 PNG for display

    // Status lifecycle
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'expired'],
      default: 'created',
    },

    // Admin confirmation
    utrNumber: { type: String, default: '' },         // UPI Transaction Reference

    // QR expiry (60 seconds from creation)
    expiresAt: { type: Date, required: true },

    // Linked Membership record (created on confirmation)
    membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', default: null },

    // Misc
    ip:         { type: String, default: '' },
    webhookRaw: { type: String, default: '' },
  },
  { timestamps: true }
);

paymentSchema.index({ phone: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ expiresAt: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
