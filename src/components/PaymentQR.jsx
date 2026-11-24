/**
 * PaymentQR — Dynamic UPI QR payment screen
 *
 * Works 100% offline — QR generated in browser via qrcode package.
 * Backend called silently for logging only.
 *
 * Props:
 *   plan       { id, label, duration, price }  — total amount in price
 *   booking    { name, phone, timing, email? }
 *   breakdown  [{ label, amount }]              — optional line items
 *   onSuccess(orderId)
 *   onClose()
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { CheckCircle, Clock, RefreshCw, X, AlertTriangle, Loader2, Shield } from 'lucide-react';

const UPI_VPA     = 'ashishku325@okhdfcbank';
const UPI_NAME    = 'DAYS Yoga Sansthan';
const QR_TTL_SECS = 60;
const API_BASE    = (import.meta.env.VITE_API_URL || '') + '/api';

function makeOrderId() {
  return `DAYS-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
}

function buildUpiLink(amount, orderId, label) {
  return [
    'upi://pay',
    `?pa=${encodeURIComponent(UPI_VPA)}`,
    `&pn=${encodeURIComponent(UPI_NAME)}`,
    `&am=${amount}.00`,
    `&tr=${orderId}`,
    `&tn=${encodeURIComponent(`DAYS ${label} - ${orderId.slice(-8)}`)}`,
    '&cu=INR&mode=02',
  ].join('');
}

async function renderQR(link) {
  return QRCode.toDataURL(link, {
    width: 300, margin: 2, errorCorrectionLevel: 'H',
    color: { dark: '#0d1f12', light: '#f0e8d0' },
  });
}

async function tryLog({ orderId, planId, name, phone, timing, amount }) {
  try {
    await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, name, phone, timing }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {}
}

async function tryPoll(orderId) {
  try {
    const r = await fetch(`${API_BASE}/payment/status/${orderId}`, { signal: AbortSignal.timeout(3000) });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

export default function PaymentQR({ plan, booking, breakdown, onSuccess, onClose }) {
  const [phase, setPhase]     = useState('creating');
  const [qrUrl, setQrUrl]     = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [secs, setSecs]       = useState(QR_TTL_SECS);
  const [errMsg, setErrMsg]   = useState('');

  const timer = useRef(null);
  const poll  = useRef(null);
  const alive = useRef(true);

  useEffect(() => { alive.current = true; return () => { alive.current = false; clearInterval(timer.current); clearInterval(poll.current); }; }, []);

  const generate = useCallback(async () => {
    if (!alive.current) return;
    clearInterval(timer.current); clearInterval(poll.current);
    setPhase('creating'); setQrUrl(null); setErrMsg('');

    try {
      const oid  = makeOrderId();
      const link = buildUpiLink(plan.price, oid, plan.label);
      const url  = await renderQR(link);
      if (!alive.current) return;

      setOrderId(oid); setQrUrl(url); setSecs(QR_TTL_SECS); setPhase('created');

      tryLog({ orderId: oid, planId: plan.id, name: booking.name, phone: booking.phone, timing: booking.timing || '', amount: plan.price });

      timer.current = setInterval(() => {
        setSecs(s => { if (!alive.current) return s; if (s <= 1) { clearInterval(timer.current); setPhase(p => p === 'created' ? 'expired' : p); return 0; } return s - 1; });
      }, 1000);

      poll.current = setInterval(async () => {
        const d = await tryPoll(oid);
        if (!alive.current || !d?.success) return;
        if (d.status === 'paid')    { clearInterval(poll.current); clearInterval(timer.current); setPhase('paid');    setTimeout(() => onSuccess?.(oid), 1500); }
        if (d.status === 'failed')  { clearInterval(poll.current); clearInterval(timer.current); setPhase('failed');  }
        if (d.status === 'expired') { clearInterval(poll.current); clearInterval(timer.current); setPhase('expired'); setSecs(0); }
      }, 3000);

    } catch (err) { if (alive.current) { setPhase('error'); setErrMsg(err.message); } }
  }, [plan, booking, onSuccess]);

  useEffect(() => { generate(); }, [generate]);

  const pct    = Math.round((secs / QR_TTL_SECS) * 100);
  const tColor = secs > 30 ? '#52c483' : secs > 10 ? '#d4a843' : '#e74c3c';
  const tClass = secs > 30 ? 'text-emerald-400' : secs > 10 ? 'text-amber-400' : 'text-red-400';
  const C      = 2 * Math.PI * 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={e => e.target === e.currentTarget && phase !== 'creating' && onClose?.()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl my-4"
        style={{ background: 'linear-gradient(160deg,#0d1f12 0%,#060c08 100%)', border: '1px solid rgba(212,168,67,0.3)' }}
      >
        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-4 border-b border-gold/12">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-gold/50 text-[10px] uppercase tracking-[0.3em] mb-0.5">DIVY ASHISH YOGA SANSTHAN</p>
              <h3 className="font-serif text-sm font-bold text-cream leading-snug">{plan.label}</h3>
              {booking.name && <p className="text-cream/45 text-xs mt-0.5">For: {booking.name}</p>}
            </div>
            <button onClick={onClose} className="p-1 text-cream/30 hover:text-cream/70 transition-colors shrink-0"><X size={17} /></button>
          </div>

          {/* Payment Breakdown */}
          <div className="rounded-xl px-3 py-3 border border-gold/12" style={{ background: 'rgba(212,168,67,0.04)' }}>
            <p className="text-gold/55 text-[10px] uppercase tracking-widest mb-2">Payment Breakdown</p>
            {breakdown?.length > 0 ? (
              <>
                {breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center mb-1.5">
                    <span className="text-cream/55 text-xs">{item.label}</span>
                    <span className="text-cream/75 text-xs font-medium">₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-gold/15 mt-1">
                  <span className="text-gold/80 text-xs font-bold uppercase tracking-wide">Total Payable</span>
                  <span className="text-gold font-bold text-lg font-serif">₹{plan.price.toLocaleString('en-IN')}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-cream/55 text-xs">Amount</span>
                <span className="text-gold font-bold text-lg font-serif">₹{plan.price.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-4 py-4">
          <AnimatePresence mode="wait">

            {phase === 'creating' && (
              <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-10 gap-3">
                <Loader2 size={34} className="text-gold animate-spin" />
                <p className="text-cream/50 text-sm">Generating QR…</p>
              </motion.div>
            )}

            {phase === 'created' && qrUrl && (
              <motion.div key="q" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Countdown ring */}
                <div className="flex flex-col items-center mb-3">
                  <div className="relative w-14 h-14 mb-1">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(212,168,67,0.12)" strokeWidth="3.5" />
                      <circle cx="24" cy="24" r="20" fill="none" stroke={tColor} strokeWidth="3.5"
                        strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-mono font-bold text-sm ${tClass}`}>{secs}</span>
                    </div>
                  </div>
                  <p className={`text-xs font-medium ${tClass}`}>{secs > 0 ? `Expires in ${secs}s` : 'Expiring…'}</p>
                </div>

                {/* QR */}
                <div className="mx-auto rounded-xl overflow-hidden p-2 mb-3"
                  style={{ background: '#f0e8d0', width: 'fit-content', boxShadow: '0 0 24px rgba(212,168,67,0.2)' }}>
                  <img src={qrUrl} alt="Scan to pay via UPI" className="w-52 h-52 block" />
                </div>

                {/* UPI ID */}
                <div className="text-center mb-3">
                  <p className="text-cream/40 text-xs mb-0.5">Pay to UPI ID</p>
                  <p className="text-gold font-mono text-sm font-semibold">{UPI_VPA}</p>
                </div>

                {/* Instructions */}
                <div className="rounded-xl px-3 py-2.5 border border-gold/10 mb-3" style={{ background: 'rgba(212,168,67,0.04)' }}>
                  <p className="text-gold/55 text-[10px] uppercase tracking-widest mb-1.5">How to Pay</p>
                  {['Open GPay, PhonePe, Paytm or BHIM', 'Scan this QR code',
                    `Confirm ₹${plan.price.toLocaleString('en-IN')} and pay`, 'Wait for confirmation here'].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <span className="w-4 h-4 rounded-full bg-gold/15 text-gold text-[9px] flex items-center justify-center shrink-0 mt-0.5 font-bold">{i+1}</span>
                      <span className="text-cream/50 text-xs">{s}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full border border-cream/12 bg-cream/4 text-xs text-cream/55">
                  <Clock size={13} className="text-gold animate-pulse" /> Waiting for Payment
                </div>
              </motion.div>
            )}

            {phase === 'paid' && (
              <motion.div key="p" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center gap-3">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center">
                  <CheckCircle size={40} className="text-emerald-400" />
                </motion.div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-cream mb-1">Payment Successful!</h4>
                  <p className="text-cream/55 text-sm">₹{plan.price.toLocaleString('en-IN')} received.</p>
                  <p className="text-cream/40 text-xs mt-1">Your session will be confirmed shortly.</p>
                </div>
                <div className="w-full px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/8 text-xs text-emerald-400/70 font-mono break-all">{orderId}</div>
              </motion.div>
            )}

            {phase === 'expired' && (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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

            {(phase === 'failed' || phase === 'error') && (
              <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center py-8 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/12 border-2 border-red-500/30 flex items-center justify-center">
                  <AlertTriangle size={30} className="text-red-400" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream mb-1">{phase === 'failed' ? 'Payment Failed' : 'Error'}</h4>
                  <p className="text-cream/50 text-sm">{phase === 'failed' ? 'Your payment was not completed.' : errMsg}</p>
                </div>
                <button onClick={generate} className="btn-primary w-full justify-center text-sm py-2.5">
                  <RefreshCw size={14} /> Try Again
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div className="px-4 pb-3 flex items-center justify-center gap-1.5 text-cream/20 text-[10px]">
          <Shield size={9} /> <span>Secure UPI · NPCI certified · BHIM</span>
        </div>
      </motion.div>
    </div>
  );
}
