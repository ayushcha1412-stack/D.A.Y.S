/**
 * SessionRegisterModal
 *
 * Full registration + UPI payment flow for regular yoga sessions.
 *
 * Flow:
 *   Step 1 — Customer fills details (name, phone, email, age, timing)
 *   Step 2 — Payment summary + QR code
 *            Session Fee + ₹567 Annual Registration = Total
 *
 * Props:
 *   plan     { id, name, price (display string), rawPrice (number), mode, priceDetails }
 *   onClose()
 *   onPaid(orderId)
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ChevronRight, User, Calendar } from 'lucide-react';
import PaymentQR from './PaymentQR';
import { useApp } from '../context/AppContext';

const ANNUAL_FEE = 567;

const TIMINGS = [
  '5:15 AM – Morning Sadhana',
  '6:00 AM – Sunrise Yoga',
  '7:00 AM – Power Yogasana',
  "8:00 AM – Children's Yoga",
  '9:00 AM – Wellness Yoga',
  '5:00 PM – Evening Yoga',
  '6:00 PM – Sunset Sadhana',
  '7:00 PM – Night Yoga',
  '10:00 PM – Yoga Nidra (Online)',
];

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-cream/55 text-xs uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function SessionRegisterModal({ plan, onClose, onPaid }) {
  const { addMembership } = useApp();

  const [form, setForm]     = useState({ name: '', phone: '', email: '', age: '', timing: '' });
  const [errors, setErrors] = useState({});
  const [showQR, setShowQR] = useState(false);
  const [paidId, setPaidId] = useState(null);

  const setF = u => setForm(p => ({ ...p, ...u }));

  const totalAmount   = plan.rawPrice + ANNUAL_FEE;
  const breakdown     = [
    { label: `${plan.name} (Monthly)`, amount: plan.rawPrice },
    { label: 'Annual Registration Fee', amount: ANNUAL_FEE },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name   = 'Full name is required';
    if (!form.phone.trim())   e.phone  = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!form.age.trim())     e.age    = 'Age is required';
    else if (isNaN(form.age) || +form.age < 5 || +form.age > 100) e.age = 'Enter a valid age';
    if (!form.timing)         e.timing = 'Please select preferred timing';
    return e;
  };

  const proceed = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setShowQR(true);
  };

  const handlePaid = (orderId) => {
    // Save registration to local state / backend
    addMembership({
      id:             Date.now(),
      name:           form.name,
      phone:          form.phone,
      email:          form.email,
      age:            form.age,
      level:          'New Member',
      mode:           plan.mode,
      membershipType: 'annual',
      selectedPlan:   plan.name,
      timing:         form.timing,
      amountPaid:     totalAmount,
      orderId,
      status:         'active',
      date:           new Date().toISOString(),
    });
    setPaidId(orderId);
    onPaid?.(orderId);
  };

  /* ── Success screen ── */
  if (paidId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm rounded-2xl overflow-hidden text-center"
          style={{ background: 'linear-gradient(160deg,#0d1f12 0%,#060c08 100%)', border: '1px solid rgba(212,168,67,0.3)' }}
        >
          <div className="px-6 py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-emerald-400" />
            </motion.div>
            <h3 className="font-serif text-2xl font-bold text-cream mb-2">Registration Complete!</h3>
            <p className="text-cream/55 text-sm leading-relaxed mb-2">
              <span className="text-gold font-semibold">{form.name}</span>, you're now registered for
            </p>
            <p className="text-gold font-serif font-bold text-base mb-1">{plan.name}</p>
            <p className="text-cream/40 text-xs mb-1">Timing: {form.timing}</p>
            <p className="text-emerald-400/80 text-xs mb-6">
              ₹{totalAmount.toLocaleString('en-IN')} paid · Order: {paidId.slice(-12)}
            </p>
            <p className="text-cream/40 text-xs mb-5 leading-relaxed">
              Our team will contact you on <span className="text-gold/70">{form.phone}</span> to confirm your first session.
            </p>
            <button onClick={onClose} className="btn-primary w-full justify-center">Done</button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── QR Screen ── */
  if (showQR) {
    return (
      <AnimatePresence>
        <PaymentQR
          plan={{
            id:       `session-${plan.id}`,
            label:    plan.name,
            duration: 'Monthly',
            price:    totalAmount,
          }}
          booking={{ name: form.name, phone: form.phone, timing: form.timing }}
          breakdown={breakdown}
          onSuccess={handlePaid}
          onClose={() => setShowQR(false)}
        />
      </AnimatePresence>
    );
  }

  /* ── Registration Form ── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-md rounded-2xl overflow-hidden my-4"
        style={{ background: 'linear-gradient(135deg,#0a1f15 0%,#060c08 100%)', border: '1px solid rgba(212,168,67,0.25)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gold/12">
          <div>
            <p className="text-gold/55 text-[10px] uppercase tracking-[0.3em] mb-0.5">Session Registration</p>
            <h3 className="font-serif text-lg font-bold text-cream">{plan.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-gold font-bold text-base">{plan.price}<span className="text-cream/40 text-xs font-normal">/mo</span></span>
              <span className="text-cream/35 text-xs">+</span>
              <span className="text-cream/55 text-xs">₹567 annual reg.</span>
              <span className="text-cream/35 text-xs">=</span>
              <span className="text-gold font-bold text-sm">₹{totalAmount.toLocaleString('en-IN')} total</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-cream/35 hover:text-cream transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Row: Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name *" error={errors.name}>
              <input className={`input-field ${errors.name ? 'border-red-500/60' : ''}`}
                value={form.name} onChange={e => setF({ name: e.target.value })}
                placeholder="Your name" autoComplete="name" />
            </Field>
            <Field label="Mobile *" error={errors.phone}>
              <input className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`}
                value={form.phone} onChange={e => setF({ phone: e.target.value })}
                placeholder="10 digits" type="tel" maxLength={10} autoComplete="tel" />
            </Field>
          </div>

          {/* Row: Email + Age */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input className="input-field" value={form.email} onChange={e => setF({ email: e.target.value })}
                placeholder="optional" type="email" autoComplete="email" />
            </Field>
            <Field label="Age *" error={errors.age}>
              <input className={`input-field ${errors.age ? 'border-red-500/60' : ''}`}
                value={form.age} onChange={e => setF({ age: e.target.value })}
                placeholder="e.g. 25" type="number" min="5" max="100" />
            </Field>
          </div>

          {/* Timing */}
          <Field label="Preferred Timing *" error={errors.timing}>
            <select className={`input-field ${errors.timing ? 'border-red-500/60' : ''}`}
              value={form.timing} onChange={e => setF({ timing: e.target.value })}>
              <option value="">Choose a batch…</option>
              {TIMINGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          {/* Payment summary box */}
          <div className="rounded-xl border border-gold/15 overflow-hidden" style={{ background: 'rgba(212,168,67,0.04)' }}>
            <div className="px-4 py-2 border-b border-gold/10">
              <p className="text-gold/60 text-[10px] uppercase tracking-widest">Payment Summary</p>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-cream/55">{plan.name}</span>
                <span className="text-cream/75 font-medium">₹{plan.rawPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream/55">Annual Registration</span>
                <span className="text-cream/75 font-medium">₹{ANNUAL_FEE.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gold/12 mt-1">
                <span className="text-gold/80 font-bold text-xs uppercase tracking-wide">Total Payable</span>
                <span className="text-gold font-bold text-base font-serif">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Plan details note */}
          {plan.priceDetails && (
            <p className="text-cream/30 text-xs leading-relaxed">
              <span className="text-gold/50">Note:</span> {plan.priceDetails}
            </p>
          )}

          {/* CTA */}
          <button onClick={proceed} className="btn-primary w-full justify-center py-3 text-sm mt-1">
            Proceed to Pay ₹{totalAmount.toLocaleString('en-IN')}
            <ChevronRight size={15} />
          </button>
          <p className="text-cream/25 text-xs text-center">You will scan a UPI QR code on the next screen.</p>
        </div>
      </motion.div>
    </div>
  );
}
