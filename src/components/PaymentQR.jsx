/**
 * PaymentQR — Dynamic UPI QR payment screen
 *
 * Props:
 *   plan     { id, label, duration, price }  — the selected plan
 *   booking  { name, phone, timing }          — customer details from form
 *   onSuccess(orderId)  — called when status === 'paid'
 *   onClose()           — called when user dismisses
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, RefreshCw, X, AlertTriangle, Loader2, Shield, Smartphone } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

// Status display config
const STATUS_CONFIG = {
  creating:  { color: 'text-gold',          bg: 'bg-gold/10 border-gold/30',           icon: <Loader2 size={18} className="animate-spin text-gold" />,        label: 'Generating QR…' },
  created:   { color: 'text-cream/70',      bg: 'bg-cream/5 border-cream/15',           icon: <Clock size={18} className="text-gold" />,                       label: 'Waiting for Payment' },
  paid:      { color: 'text-emerald-400',   bg: 'bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle size={18} className="text-emerald-400" />,       label: 'Payment Successful' },
  failed:    { color: 'text-red-400',       bg: 'bg-red-500/10 border-red-500/30',      icon: <AlertTriangle size={18} className="text-red-400" />,             label: 'Payment Failed' },
  expired:   { color: 'text-cream/40',      bg: 'bg-cream/4 border-cream/10',           icon: <AlertTriangle size={18} className="text-cream/40" />,            label: 'Payment Session Expired' },
  error:     { color: 'text-red-400',       bg: 'bg-red-500/10 border-red-500/30',      icon: <AlertTriangle size={18} className="text-red-400" />,             label: 'Something went wrong' },
};

export default function PaymentQR({ plan, booking, onSuccess, onClose }) {
  const [phase, setPhase]         = useState('creating');  // creating | created | paid | failed | expired | error
  const [orderId, setOrderId]     = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [secondsLeft, setSeconds] = useState(60);
  const [upiVpa, setUpiVpa]       = useState('');
  const [errorMsg, setErrorMsg]   = useState('');

  const pollRef    = useRef(null);
  const timerRef   = useRef(null);
  const mountedRef = useRef(true);

  // ── Cleanup on unmount ───────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  // ── Create order on mount ────────────────────────────
  const createOrder = useCallback(async () => {
    if (!mountedRef.current) return;
    setPhase('creating');
    setErrorMsg('');
    setQrDataUrl(null);
    setOrderId(null);

    try {
      const res = await fetch(`${API_BASE}/payment/create-order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          planId:  plan.id,
          name:    booking.name,
          phone:   booking.phone,
          timing:  booking.timing || '',
        }),
      });
      const data = await res.json();

      if (!mountedRef.current) return;

      if (!data.success) {
        setPhase('error');
        setErrorMsg(data.message || 'Could not create payment order.');
        return;
      }

      setOrderId(data.orderId);
      setQrDataUrl(data.qrDataUrl);
      setUpiVpa(data.upiVpa || '');
      setSeconds(data.secondsLeft || 60);
      setPhase('created');

      // Start client-side countdown (UI feedback only)
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(timerRef.current); return 0; }
          return s - 1;
        });
      }, 1000);

      // Start status polling every 3 seconds
      clearInterval(pollRef.current);
      pollRef.current = setInterval(() => pollStatus(data.orderId), 3000);

    } catch (err) {
      if (!mountedRef.current) return;
      setPhase('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  }, [plan.id, booking]);

  useEffect(() => { createOrder(); }, [createOrder]);

  // ── Poll payment status ──────────────────────────────
  const pollStatus = useCallback(async (oid) => {
    try {
      const res  = await fetch(`${API_BASE}/payment/status/${oid}`);
      const data = await res.json();
      if (!mountedRef.current) return;

      if (data.success) {
        const s = data.status;
        setSeconds(data.secondsLeft || 0);

        if (s === 'paid') {
          setPhase('paid');
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setTimeout(() => onSuccess?.(oid), 1800); // brief success pause
        } else if (s === 'failed') {
          setPhase('failed');
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
        } else if (s === 'expired') {
          setPhase('expired');
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setSeconds(0);
        }
      }
    } catch { /* network hiccup — keep polling */ }
  }, [onSuccess]);

  // ── Countdown colour ─────────────────────────────────
  const countdownColor = secondsLeft > 30 ? 'text-emerald-400' : secondsLeft > 10 ? 'text-amber-400' : 'text-red-400';
  const progressPct    = Math.round((secondsLeft / 60) * 100);

  const cfg = STATUS_CONFIG[phase] || STATUS_CONFIG.error;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && phase !== 'creating' && onClose?.()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1,   y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #0d1f12 0%, #060c08 100%)', border: '1px solid rgba(212,168,67,0.25)' }}
      >
        {/* ── Header ── */}
        <div className="relative px-5 pt-5 pb-4 border-b border-gold/12">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gold/55 text-[10px] uppercase tracking-[0.3em] mb-0.5">UPI Payment</p>
              <h3 className="font-serif text-base font-bold text-cream leading-snug">{plan.label}</h3>
              <p className="text-gold font-bold text-2xl mt-1 font-serif">₹{plan.price}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-cream/30 hover:text-cream/70 transition-colors mt-0.5"
              aria-label="Close payment screen"
            >
              <X size={18} />
            </button>
          </div>

          {/* Duration badge */}
          <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-500/30 text-emerald-400/80 bg-emerald-500/8">
            <Clock size={9} /> {plan.duration} Introductory Session
          </span>
        </div>

        {/* ── QR area ── */}
        <div className="px-5 py-5">
          <AnimatePresence mode="wait">

            {/* Creating */}
            {phase === 'creating' && (
              <motion.div key="creating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 gap-3"
              >
                <Loader2 size={36} className="text-gold animate-spin" />
                <p className="text-cream/50 text-sm">Generating secure QR code…</p>
              </motion.div>
            )}

            {/* QR visible */}
            {phase === 'created' && qrDataUrl && (
              <motion.div key="qr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Countdown ring */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-16 h-16 mb-2">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(212,168,67,0.12)" strokeWidth="3.5" />
                      <circle
                        cx="24" cy="24" r="20" fill="none"
                        stroke={secondsLeft > 30 ? '#52c483' : secondsLeft > 10 ? '#d4a843' : '#e74c3c'}
                        strokeWidth="3.5"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPct / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-mono font-bold text-sm ${countdownColor}`}>{secondsLeft}</span>
                    </div>
                  </div>
                  <p className={`text-xs font-medium ${countdownColor}`}>
                    {secondsLeft > 0 ? `Expires in ${secondsLeft}s` : 'Expiring…'}
                  </p>
                </div>

                {/* QR image */}
                <div
                  className="mx-auto rounded-xl overflow-hidden p-2 mb-4"
                  style={{ background: '#f0e8d0', width: 'fit-content', boxShadow: '0 0 24px rgba(212,168,67,0.2)' }}
                >
                  <img src={qrDataUrl} alt="UPI Payment QR Code" className="w-56 h-56 object-cover block" />
                </div>

                {/* UPI info */}
                <div className="text-center mb-4">
                  <p className="text-cream/40 text-xs mb-1">Pay to UPI ID</p>
                  <p className="text-gold font-mono text-sm font-semibold tracking-wide">{upiVpa}</p>
                </div>

                {/* Instructions */}
                <div
                  className="rounded-xl px-4 py-3 border border-gold/10 mb-3"
                  style={{ background: 'rgba(212,168,67,0.04)' }}
                >
                  <p className="text-gold/60 text-[10px] uppercase tracking-widest mb-2">How to Pay</p>
                  <ol className="space-y-1.5">
                    {[
                      'Open any UPI app (GPay, PhonePe, Paytm, BHIM)',
                      'Scan this QR code',
                      `Confirm amount ₹${plan.price} and pay`,
                      'Wait for confirmation on this screen',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-cream/55 text-xs">
                        <span className="w-4 h-4 rounded-full bg-gold/15 text-gold text-[9px] flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Status badge */}
                <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                  {cfg.icon} {cfg.label}
                </div>
              </motion.div>
            )}

            {/* Paid ✓ */}
            {phase === 'paid' && (
              <motion.div key="paid" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 text-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center"
                >
                  <CheckCircle size={40} className="text-emerald-400" />
                </motion.div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-cream mb-1">Payment Successful!</h4>
                  <p className="text-cream/55 text-sm leading-relaxed">
                    ₹{plan.price} received for {plan.label}.
                    <br />Your session will be confirmed shortly.
                  </p>
                </div>
                <div className="w-full px-3 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-xs text-emerald-400/80 font-mono">
                  Ref: {orderId}
                </div>
              </motion.div>
            )}

            {/* Failed */}
            {phase === 'failed' && (
              <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/12 border-2 border-red-500/35 flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-400" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-cream mb-1">Payment Failed</h4>
                  <p className="text-cream/50 text-sm">Your payment was not completed. Please try again.</p>
                </div>
                <button onClick={createOrder} className="btn-primary text-sm py-2.5 px-6 w-full justify-center">
                  <RefreshCw size={14} /> Try Again
                </button>
              </motion.div>
            )}

            {/* Expired */}
            {phase === 'expired' && (
              <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-cream/5 border-2 border-cream/15 flex items-center justify-center">
                  <Clock size={32} className="text-cream/40" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-cream mb-1">Payment Session Expired</h4>
                  <p className="text-cream/50 text-sm leading-relaxed">
                    The 60-second payment window has closed.
                    <br />Please generate a fresh QR code to pay.
                  </p>
                </div>
                <button onClick={createOrder} className="btn-primary text-sm py-2.5 px-6 w-full justify-center">
                  <RefreshCw size={14} /> Generate New QR Code
                </button>
              </motion.div>
            )}

            {/* Error */}
            {phase === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/12 border-2 border-red-500/30 flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-400" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream mb-1">Could Not Create Payment</h4>
                  <p className="text-cream/50 text-sm leading-relaxed">{errorMsg}</p>
                </div>
                <button onClick={createOrder} className="btn-primary text-sm py-2.5 px-6 w-full justify-center">
                  <RefreshCw size={14} /> Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-4 flex items-center justify-center gap-2 text-cream/25 text-[10px]">
          <Shield size={10} />
          <span>Secure UPI · NPCI certified · Powered by BHIM</span>
        </div>
      </motion.div>
    </div>
  );
}
