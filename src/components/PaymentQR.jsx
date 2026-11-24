/**
 * PaymentQR — Dynamic UPI QR payment screen
 *
 * Generates the UPI deep-link QR entirely in the browser using the
 * `qrcode` npm package — works even when the backend is offline.
 *
 * The backend is called to log the transaction and check confirmation,
 * but the QR itself never depends on the server being available.
 *
 * Props:
 *   plan     { id, label, duration, price }
 *   booking  { name, phone, timing }
 *   onSuccess(orderId)
 *   onClose()
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import {
  CheckCircle, Clock, RefreshCw, X,
  AlertTriangle, Loader2, Shield,
} from 'lucide-react';

// ── Config ────────────────────────────────────────────────
const UPI_VPA     = 'ashishku325@okhdfcbank';
const UPI_NAME    = 'DAYS Yoga Sansthan';
const QR_TTL_SECS = 60;
const API_BASE    = (import.meta.env.VITE_API_URL || '') + '/api';

// ── Generate a local unique order ref (no backend needed) ──
function makeLocalOrderId() {
  const ts   = Date.now();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DAYS-${ts}-${rand}`;
}

// ── Build UPI deep-link ───────────────────────────────────
function buildUpiLink(amount, orderId, planLabel) {
  const note = encodeURIComponent(`DAYS ${planLabel} - ${orderId.slice(-8)}`);
  return [
    'upi://pay',
    `?pa=${encodeURIComponent(UPI_VPA)}`,
    `&pn=${encodeURIComponent(UPI_NAME)}`,
    `&am=${amount}.00`,
    `&tr=${orderId}`,
    `&tn=${note}`,
    `&cu=INR`,
    `&mode=02`,
  ].join('');
}

// ── Render QR to canvas data URL ──────────────────────────
async function renderQR(upiLink) {
  return QRCode.toDataURL(upiLink, {
    width:                320,
    margin:               2,
    errorCorrectionLevel: 'H',
    color: { dark: '#0d1f12', light: '#f0e8d0' },
  });
}

// ── Try to log order on backend (best-effort, never blocks QR) ──
async function tryLogOrder({ orderId, planId, name, phone, timing, amount }) {
  try {
    await fetch(`${API_BASE}/payment/create-order`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ planId, name, phone, timing }),
      signal:  AbortSignal.timeout(4000),
    });
  } catch { /* backend offline — QR still works */ }
}

// ── Try to poll status from backend ───────────────────────
async function tryPollStatus(orderId) {
  try {
    const res  = await fetch(`${API_BASE}/payment/status/${orderId}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

/* ══════════════════════════════════════════
   Component
══════════════════════════════════════════ */
export default function PaymentQR({ plan, booking, onSuccess, onClose }) {
  const [phase, setPhase]         = useState('creating');
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [orderId, setOrderId]     = useState(null);
  const [secondsLeft, setSeconds] = useState(QR_TTL_SECS);
  const [errorMsg, setErrorMsg]   = useState('');

  const timerRef   = useRef(null);
  const pollRef    = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, []);

  /* ── Generate QR ── */
  const generate = useCallback(async () => {
    if (!mountedRef.current) return;
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);

    setPhase('creating');
    setQrDataUrl(null);
    setErrorMsg('');

    try {
      const oid     = makeLocalOrderId();
      const upiLink = buildUpiLink(plan.price, oid, plan.label);
      const dataUrl = await renderQR(upiLink);

      if (!mountedRef.current) return;

      setOrderId(oid);
      setQrDataUrl(dataUrl);
      setSeconds(QR_TTL_SECS);
      setPhase('created');

      // Log to backend silently — QR already shown to user
      tryLogOrder({
        orderId:  oid,
        planId:   plan.id,
        name:     booking.name,
        phone:    booking.phone,
        timing:   booking.timing || '',
        amount:   plan.price,
      });

      // Client-side countdown
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (!mountedRef.current) return s;
          if (s <= 1) {
            clearInterval(timerRef.current);
            if (mountedRef.current) setPhase('expired');
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      // Poll backend for admin confirmation every 3s
      pollRef.current = setInterval(async () => {
        const data = await tryPollStatus(oid);
        if (!mountedRef.current) return;
        if (!data?.success) return;
        if (data.status === 'paid') {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setPhase('paid');
          setTimeout(() => onSuccess?.(oid), 1600);
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setPhase('failed');
        } else if (data.status === 'expired') {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setPhase('expired');
          setSeconds(0);
        }
      }, 3000);

    } catch (err) {
      if (!mountedRef.current) return;
      setPhase('error');
      setErrorMsg(err.message || 'Could not generate QR code.');
    }
  }, [plan, booking, onSuccess]);

  useEffect(() => { generate(); }, [generate]);

  /* ── UI helpers ── */
  const pct   = Math.round((secondsLeft / QR_TTL_SECS) * 100);
  const tColor = secondsLeft > 30 ? '#52c483' : secondsLeft > 10 ? '#d4a843' : '#e74c3c';
  const tClass = secondsLeft > 30 ? 'text-emerald-400' : secondsLeft > 10 ? 'text-amber-400' : 'text-red-400';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && phase !== 'creating' && onClose?.()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg,#0d1f12 0%,#060c08 100%)',
          border: '1px solid rgba(212,168,67,0.3)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gold/12">
          <div>
            <p className="text-gold/55 text-[10px] uppercase tracking-[0.3em] mb-0.5">UPI Payment</p>
            <h3 className="font-serif text-sm font-bold text-cream leading-snug">{plan.label}</h3>
            <p className="text-gold font-bold text-2xl font-serif mt-0.5">₹{plan.price}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-emerald-400/80">
              <Clock size={9} /> {plan.duration}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-cream/30 hover:text-cream/70 transition-colors" aria-label="Close">
            <X size={17} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-4 py-4">
          <AnimatePresence mode="wait">

            {/* Creating */}
            {phase === 'creating' && (
              <motion.div key="creating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-10 gap-3">
                <Loader2 size={34} className="text-gold animate-spin" />
                <p className="text-cream/50 text-sm">Generating QR…</p>
              </motion.div>
            )}

            {/* QR visible */}
            {phase === 'created' && qrDataUrl && (
              <motion.div key="qr" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                {/* Countdown ring */}
                <div className="flex flex-col items-center mb-3">
                  <div className="relative w-14 h-14 mb-1">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(212,168,67,0.12)" strokeWidth="3.5" />
                      <circle cx="24" cy="24" r="20" fill="none" stroke={tColor} strokeWidth="3.5"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-mono font-bold text-sm ${tClass}`}>{secondsLeft}</span>
                    </div>
                  </div>
                  <p className={`text-xs font-medium ${tClass}`}>
                    {secondsLeft > 0 ? `Expires in ${secondsLeft}s` : 'Expiring…'}
                  </p>
                </div>

                {/* QR image */}
                <div className="mx-auto rounded-xl overflow-hidden p-2 mb-3"
                  style={{ background: '#f0e8d0', width: 'fit-content', boxShadow: '0 0 24px rgba(212,168,67,0.18)' }}>
                  <img src={qrDataUrl} alt="Scan to pay via UPI" className="w-52 h-52 block" />
                </div>

                {/* UPI ID */}
                <div className="text-center mb-3">
                  <p className="text-cream/40 text-xs mb-0.5">Pay to UPI ID</p>
                  <p className="text-gold font-mono text-sm font-semibold">{UPI_VPA}</p>
                </div>

                {/* Instructions */}
                <div className="rounded-xl px-3 py-2.5 border border-gold/10 mb-3"
                  style={{ background: 'rgba(212,168,67,0.04)' }}>
                  <p className="text-gold/55 text-[10px] uppercase tracking-widest mb-1.5">How to Pay</p>
                  {[
                    'Open GPay, PhonePe, Paytm or BHIM',
                    'Scan this QR code',
                    `Confirm ₹${plan.price} and pay`,
                    'Wait for confirmation here',
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <span className="w-4 h-4 rounded-full bg-gold/15 text-gold text-[9px] flex items-center justify-center shrink-0 mt-0.5 font-bold">{i+1}</span>
                      <span className="text-cream/50 text-xs">{s}</span>
                    </div>
                  ))}
                </div>

                {/* Status badge */}
                <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full border border-cream/12 bg-cream/4 text-xs text-cream/55">
                  <Clock size={13} className="text-gold animate-pulse" />
                  Waiting for Payment
                </div>
              </motion.div>
            )}

            {/* Paid */}
            {phase === 'paid' && (
              <motion.div key="paid" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center gap-3">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center">
                  <CheckCircle size={40} className="text-emerald-400" />
                </motion.div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-cream mb-1">Payment Successful!</h4>
                  <p className="text-cream/55 text-sm">₹{plan.price} received for {plan.label}.</p>
                  <p className="text-cream/40 text-xs mt-1">Your session will be confirmed shortly.</p>
                </div>
                <div className="w-full px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/8 text-xs text-emerald-400/70 font-mono break-all">
                  {orderId}
                </div>
              </motion.div>
            )}

            {/* Expired */}
            {phase === 'expired' && (
              <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center py-8 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cream/5 border-2 border-cream/15 flex items-center justify-center">
                  <Clock size={30} className="text-cream/40" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream mb-1">Session Expired</h4>
                  <p className="text-cream/50 text-sm">The 60-second window has closed.</p>
                </div>
                <button onClick={generate} className="btn-primary w-full justify-center text-sm py-2.5">
                  <RefreshCw size={14} /> Generate New QR Code
                </button>
              </motion.div>
            )}

            {/* Failed */}
            {phase === 'failed' && (
              <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center py-8 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/12 border-2 border-red-500/30 flex items-center justify-center">
                  <AlertTriangle size={30} className="text-red-400" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream mb-1">Payment Failed</h4>
                  <p className="text-cream/50 text-sm">Your payment was not completed.</p>
                </div>
                <button onClick={generate} className="btn-primary w-full justify-center text-sm py-2.5">
                  <RefreshCw size={14} /> Try Again
                </button>
              </motion.div>
            )}

            {/* Error */}
            {phase === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center py-8 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/25 flex items-center justify-center">
                  <AlertTriangle size={30} className="text-red-400" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream mb-1">Error</h4>
                  <p className="text-cream/50 text-sm">{errorMsg}</p>
                </div>
                <button onClick={generate} className="btn-primary w-full justify-center text-sm py-2.5">
                  <RefreshCw size={14} /> Retry
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 pb-3 flex items-center justify-center gap-1.5 text-cream/20 text-[10px]">
          <Shield size={9} />
          <span>Secure UPI · NPCI certified · BHIM</span>
        </div>
      </motion.div>
    </div>
  );
}
