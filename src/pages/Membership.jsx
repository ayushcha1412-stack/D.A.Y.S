import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, ChevronRight, ChevronLeft, Send,
  User, Heart, CreditCard, Calendar, Clock, X,
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import MysticalCard from '../components/MysticalCard';
import ParticleSystem from '../components/ParticleSystem';
import PaymentQR from '../components/PaymentQR';
import { fadeUp, staggerChildren, pageTransition } from '../utils/animations';
import { useApp } from '../context/AppContext';

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */
const MEMBERSHIP_TYPES = [
  {
    id: 'annual',
    label: 'Annual Registration',
    price: '₹567/year',
    rawPrice: 567,
    badge: 'Best Value',
    desc: 'Non-refundable annual registration fee.',
  },
];

const TRIAL_PLANS = [
  { id: 'park-group',      label: 'Park Group Yoga',          type: 'Group',    mode: 'Outdoor',  duration: '5 Days', price: 99   },
  { id: 'online-group',    label: 'Online Group Yoga',        type: 'Group',    mode: 'Online',   duration: '4 Days', price: 149  },
  { id: 'centre-group',    label: 'Centre Group Yoga',        type: 'Group',    mode: 'Offline',  duration: '5 Days', price: 199  },
  { id: 'online-personal', label: 'Online Personal Yoga',     type: 'Personal', mode: 'Online',   duration: '4 Days', price: 499  },
  { id: 'centre-personal', label: 'Centre Personal Yoga',     type: 'Personal', mode: 'Offline',  duration: '4 Days', price: 999  },
  { id: 'home-personal',   label: 'Home Visit Personal Yoga', type: 'Personal', mode: 'Home',     duration: '4 Days', price: 1499 },
];

const YOGA_MODES = ['Online Group', 'Offline Group', 'Online Personal', 'Offline Personal', 'Home Visit'];
const GOALS      = ['Weight Management', 'Stress Relief', 'Flexibility', 'Strength', 'Sports Competition', 'Therapeutic', 'Spiritual Growth', 'Overall Wellness'];
const LEVELS     = ['Complete Beginner', 'Some Experience', 'Intermediate', 'Advanced'];

const STEPS = [
  { id: 1, label: 'Personal Info',   icon: <User size={18} /> },
  { id: 2, label: 'Yoga Preference', icon: <Heart size={18} /> },
  { id: 3, label: 'Membership',      icon: <CreditCard size={18} /> },
  { id: 4, label: 'Confirmation',    icon: <CheckCircle size={18} /> },
];

const benefits = [
  { icon: '🎫', text: 'Official membership card' },
  { icon: '📋', text: 'Personal member record' },
  { icon: '📈', text: 'Progress tracking' },
  { icon: '💬', text: 'WhatsApp support' },
  { icon: '🏆', text: 'Competition eligibility' },
  { icon: '🌿', text: 'Wellness guidance' },
];

function validate(step, data) {
  const e = {};
  if (step === 1) {
    if (!data.name?.trim())  e.name  = 'Name is required';
    if (!data.phone?.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(data.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!data.age?.trim())   e.age   = 'Age is required';
  }
  if (step === 2) {
    if (!data.level) e.level = 'Select your experience level';
    if (!data.mode)  e.mode  = 'Select preferred mode';
  }
  if (step === 3) {
    if (!data.membershipType) e.membershipType = 'Select a membership type';
  }
  return e;
}

/* ════════════════════════════════════════
   TRIAL BOOKING FORM → then PaymentQR
════════════════════════════════════════ */
function TrialBookingFlow({ plan, onClose, onPaid }) {
  const [form, setForm]       = useState({ name: '', phone: '', timing: '' });
  const [errors, setErrors]   = useState({});
  const [showQR, setShowQR]   = useState(false);
  const setF = u => setForm(p => ({ ...p, ...u }));

  const proceed = () => {
    const e = {};
    if (!form.name.trim())   e.name   = 'Name is required';
    if (!form.phone.trim())  e.phone  = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number';
    if (!form.timing.trim()) e.timing = 'Preferred timing is required';
    if (Object.keys(e).length) { setErrors(e); return; }
    setShowQR(true);
  };

  if (showQR) {
    return (
      <AnimatePresence>
        <PaymentQR
          plan={{ id: plan.id, label: plan.label, duration: plan.duration, price: plan.price }}
          booking={{ name: form.name, phone: form.phone, timing: form.timing }}
          onSuccess={onPaid}
          onClose={onClose}
        />
      </AnimatePresence>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-md rounded-2xl border border-gold/30 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1f15 0%, #060c08 100%)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gold/15">
          <div>
            <p className="text-gold/55 text-xs uppercase tracking-widest mb-0.5">Book Trial Session</p>
            <h3 className="font-serif text-lg font-bold text-cream">{plan.label}</h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-emerald-400/80">
                <Clock size={11} /> {plan.duration}
              </span>
              <span className="text-gold font-bold">₹{plan.price}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-cream/40 hover:text-cream transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-cream/55 text-xs uppercase tracking-wide mb-1.5">Full Name *</label>
            <input className={`input-field ${errors.name ? 'border-red-500/60' : ''}`}
              value={form.name} onChange={e => setF({ name: e.target.value })}
              placeholder="Your full name" autoComplete="name" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-cream/55 text-xs uppercase tracking-wide mb-1.5">Mobile Number *</label>
            <input className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`}
              value={form.phone} onChange={e => setF({ phone: e.target.value })}
              placeholder="10-digit mobile" type="tel" maxLength={10} autoComplete="tel" />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-cream/55 text-xs uppercase tracking-wide mb-1.5">Preferred Timing *</label>
            <input className={`input-field ${errors.timing ? 'border-red-500/60' : ''}`}
              value={form.timing} onChange={e => setF({ timing: e.target.value })}
              placeholder="e.g. Morning 6 AM, Evening 6 PM" />
            {errors.timing && <p className="text-red-400 text-xs mt-1">{errors.timing}</p>}
          </div>

          {/* Summary */}
          <div className="rounded-xl px-4 py-3 border border-gold/15" style={{ background: 'rgba(212,168,67,0.05)' }}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-cream/55">Plan</span>
              <span className="text-cream/85 font-medium text-right">{plan.label}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-cream/55">Duration</span>
              <span className="text-emerald-400/80">{plan.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream/55">Amount</span>
              <span className="text-gold font-bold text-base">₹{plan.price}</span>
            </div>
          </div>

          <button onClick={proceed} className="btn-primary w-full justify-center">
            Proceed to Pay ₹{plan.price} →
          </button>
          <p className="text-cream/30 text-xs text-center">You will scan a UPI QR code on the next screen.</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function Membership() {
  const { membershipDraft, setMembershipDraft, addMembership, siteContact } = useApp();

  const [step, setStep]           = useState(1);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Trial flow
  const [selectedTrials, setSelectedTrials] = useState([]);
  const [bookingPlan, setBookingPlan]        = useState(null);
  const [paidOrderId, setPaidOrderId]        = useState(null);

  const data = membershipDraft;
  const set  = updates => setMembershipDraft(prev => ({ ...prev, ...updates }));

  const toggleTrial = id =>
    setSelectedTrials(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const openBooking = () => {
    if (!selectedTrials.length) return;
    setBookingPlan(TRIAL_PLANS.find(p => p.id === selectedTrials[0]));
  };

  const handleNext = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    if (step < 4) setStep(step + 1);
  };
  const handleBack = () => { setErrors({}); if (step > 1) setStep(step - 1); };

  const handleSubmit = () => {
    addMembership({
      id: Date.now(), name: data.name, phone: data.phone, age: data.age,
      gender: data.gender || '', email: data.email || '',
      level: data.level, mode: data.mode, goals: data.goals || [],
      membershipType: data.membershipType, status: 'pending',
      date: new Date().toISOString(),
    });
    setSubmitted(true);
    setMembershipDraft({});
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <motion.main {...pageTransition} className="pt-24 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="w-24 h-24 rounded-full bg-gold/15 border-2 border-gold/50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={44} className="text-gold" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }} className="font-serif text-3xl font-bold text-cream mb-3">
            Registration Complete!
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-cream/60 text-base mb-6 leading-relaxed">
            Thank you for joining DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE).<br />
            We will contact you shortly to confirm your membership details.
          </motion.p>
          <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            href={`https://wa.me/91${siteContact?.whatsapp || '8127227284'}?text=Namaste! I have just registered for membership at DIVY ASHISH YOGA SANSTHAN.`}
            target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
            Confirm on WhatsApp
          </motion.a>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">

      {/* ── Hero ── */}
      <section className="relative py-14 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,168,67,0.09) 0%, transparent 70%)' }}
          aria-hidden="true" />
        <ParticleSystem count={8} type="lotus" />
        <SectionHeader
          sanskrit="सदस्यता"
          title="Join Our Yoga"
          titleHighlight="Community"
          description="Choose your plan — annual registration or start with an introductory trial session and pay instantly via UPI."
        />
      </section>

      {/* ── A: Regular Membership ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-2 mb-16" aria-label="Regular membership fees">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mb-8 text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest uppercase border border-gold/30 text-gold/70 bg-gold/5 mb-3">
            सदस्यता शुल्क
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
            Regular <span className="text-gold">Membership Fees</span>
          </h2>
          <p className="text-cream/45 text-sm mt-2 max-w-md mx-auto">
            Official membership with full access to all classes, progress tracking and competition eligibility.
          </p>
        </motion.div>

        <motion.div variants={staggerChildren} initial="hidden" whileInView="visible"
          viewport={{ once: true }} className="flex justify-center">
          {MEMBERSHIP_TYPES.map((type, i) => (
            <motion.div key={type.id} variants={fadeUp} transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-gold/20 overflow-hidden group hover:border-gold/50 transition-all duration-300 w-full max-w-sm"
              style={{ background: 'linear-gradient(135deg, rgba(10,61,46,0.35) 0%, rgba(6,12,8,0.7) 100%)' }}>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <div className="p-7">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-serif text-lg font-bold text-cream">{type.label}</h3>
                      {type.badge && (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-gold text-charcoal uppercase tracking-wide">
                          {type.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-cream/45 text-sm">{type.desc}</p>
                  </div>
                  <p className="font-serif font-bold text-gold text-2xl shrink-0 ml-3">{type.price}</p>
                </div>
                <a href="#registration-form"
                  onClick={e => {
                    e.preventDefault();
                    set({ membershipType: type.id });
                    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gold/70 hover:text-gold transition-colors">
                  Register Now <ChevronRight size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── B: Trial Sessions ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14" aria-label="Trial session fees">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mb-8 text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest uppercase border border-emerald-500/30 text-emerald-400/70 bg-emerald-500/5 mb-3">
            परिचयात्मक सत्र
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
            Yoga Introductory / <span className="text-gold">Trial Session Fees</span>
          </h2>
          <p className="text-cream/45 text-sm mt-2 max-w-lg mx-auto">
            New to yoga? Book a trial session and pay instantly via UPI QR code. Session fee adjustable in monthly membership.
          </p>
        </motion.div>

        {/* Trial cards */}
        <motion.div variants={staggerChildren} initial="hidden" whileInView="visible"
          viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TRIAL_PLANS.map((plan, i) => {
            const selected = selectedTrials.includes(plan.id);
            return (
              <motion.label key={plan.id} variants={fadeUp} transition={{ delay: i * 0.08 }}
                htmlFor={`trial-${plan.id}`}
                className={`relative flex flex-col rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                  selected ? 'border-gold bg-gold/8 shadow-lg shadow-gold/10' : 'border-gold/18 hover:border-gold/40'
                }`}
                style={{ background: selected ? undefined : 'linear-gradient(135deg, rgba(10,61,46,0.3), rgba(6,12,8,0.6))' }}>
                <input id={`trial-${plan.id}`} type="checkbox" checked={selected}
                  onChange={() => toggleTrial(plan.id)} className="sr-only" />
                {selected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                    <CheckCircle size={12} className="text-charcoal" />
                  </div>
                )}
                <div className={`h-0.5 w-full bg-gradient-to-r from-transparent ${selected ? 'via-gold' : 'via-gold/30'} to-transparent`} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                      plan.type === 'Personal'
                        ? 'border-amber-400/35 text-amber-400/80 bg-amber-400/8'
                        : 'border-emerald-500/35 text-emerald-400/80 bg-emerald-500/8'
                    }`}>{plan.type}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full border border-gold/20 text-gold/60 bg-gold/5">
                      {plan.mode}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-cream leading-snug mb-2 flex-1">
                    {plan.label}<br />
                    <span className="text-gold/60 font-normal text-xs">Introductory Session</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Calendar size={12} className="text-emerald-400/70" />
                    <span className="text-emerald-400/80 text-xs font-medium">{plan.duration}</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto pt-3 border-t border-gold/10">
                    <span className="text-cream/40 text-xs">Session Fee</span>
                    <span className="font-serif font-bold text-gold text-xl">₹{plan.price}</span>
                  </div>
                </div>
              </motion.label>
            );
          })}
        </motion.div>

        {/* Booking bar */}
        <AnimatePresence>
          {selectedTrials.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="rounded-2xl border border-gold/30 p-5 sm:p-6"
              style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(10,61,46,0.3))' }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">Selected Plan</p>
                  {selectedTrials.map(id => {
                    const p = TRIAL_PLANS.find(x => x.id === id);
                    return (
                      <div key={id} className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-cream/85 text-sm font-medium">{p.label}</span>
                        <span className="text-emerald-400/80 text-xs flex items-center gap-1">
                          <Clock size={10} /> {p.duration}
                        </span>
                        <span className="text-gold font-bold">₹{p.price}</span>
                        <button onClick={() => toggleTrial(id)}
                          className="text-cream/30 hover:text-red-400/70 transition-colors text-xs">✕</button>
                      </div>
                    );
                  })}
                </div>
                <button onClick={openBooking} className="btn-primary shrink-0 text-sm py-2.5 px-6">
                  <Calendar size={14} /> Book & Pay Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trial paid confirmation */}
        {paidOrderId && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-5 text-center">
            <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-emerald-400 font-semibold text-sm mb-1">Payment Successful!</p>
            <p className="text-cream/50 text-xs">Order: {paidOrderId}</p>
            <p className="text-cream/45 text-xs mt-1">Your session will be confirmed by our team shortly. Check WhatsApp.</p>
          </motion.div>
        )}
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── C: Benefits ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12" aria-label="Membership benefits">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-8">
          <h2 className="font-serif text-2xl font-bold text-cream">Member <span className="text-gold">Benefits</span></h2>
        </motion.div>
        <motion.div variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {benefits.map((b, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.07 }}
              className="flex flex-col items-center text-center p-4 rounded-xl border border-gold/12 bg-gold/4 hover:border-gold/30 transition-colors">
              <span className="text-2xl mb-2">{b.icon}</span>
              <p className="text-cream/60 text-xs leading-snug">{b.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── D: Registration Form ── */}
      <section id="registration-form" className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-4 scroll-mt-24"
        aria-label="Registration form">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-8">
          <h2 className="font-serif text-2xl font-bold text-cream">
            Register for <span className="text-gold">Membership</span>
          </h2>
          <p className="text-cream/45 text-sm mt-2">Complete the form below to join DIVY ASHISH YOGA SANSTHAN.</p>
        </motion.div>

        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-px bg-gold/15 z-0" aria-hidden="true" />
            <div className="absolute top-5 left-0 h-px bg-gold z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} aria-hidden="true" />
            {STEPS.map(s => (
              <div key={s.id} className="flex flex-col items-center z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step > s.id ? 'bg-gold border-gold text-charcoal'
                  : step === s.id ? 'bg-gold/15 border-gold text-gold'
                  : 'bg-charcoal border-gold/25 text-cream/30'
                }`} aria-current={step === s.id ? 'step' : undefined}>
                  {step > s.id ? <CheckCircle size={16} /> : s.icon}
                </div>
                <p className={`text-xs mt-2 font-medium ${step >= s.id ? 'text-gold' : 'text-cream/30'}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <MysticalCard className="p-8">
          <AnimatePresence mode="wait">

            {/* Step 1 */}
            {step === 1 && (
              <StepWrapper key="s1" title="Personal Information">
                <FormField label="Full Name *" error={errors.name}>
                  <input className={`input-field ${errors.name ? 'border-red-500/60' : ''}`}
                    value={data.name || ''} onChange={e => set({ name: e.target.value })}
                    placeholder="Your full name" autoComplete="name" />
                </FormField>
                <FormField label="Phone *" error={errors.phone}>
                  <input className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`}
                    value={data.phone || ''} onChange={e => set({ phone: e.target.value })}
                    placeholder="10-digit mobile" type="tel" maxLength={10} />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Age *" error={errors.age}>
                    <input className={`input-field ${errors.age ? 'border-red-500/60' : ''}`}
                      value={data.age || ''} onChange={e => set({ age: e.target.value })}
                      placeholder="Your age" type="number" min="5" max="100" />
                  </FormField>
                  <FormField label="Gender">
                    <select className="input-field" value={data.gender || ''} onChange={e => set({ gender: e.target.value })}>
                      <option value="">Select…</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </FormField>
                </div>
                <FormField label="Email (optional)">
                  <input className="input-field" value={data.email || ''} onChange={e => set({ email: e.target.value })}
                    placeholder="your@email.com" type="email" />
                </FormField>
              </StepWrapper>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <StepWrapper key="s2" title="Yoga Preference">
                <FormField label="Experience Level *" error={errors.level}>
                  <div className="grid grid-cols-2 gap-2">
                    {LEVELS.map(l => (
                      <button key={l} type="button" onClick={() => set({ level: l })}
                        className={`px-3 py-2.5 rounded-lg text-sm border transition-all ${data.level === l ? 'bg-gold/15 border-gold text-gold' : 'border-gold/20 text-cream/60 hover:border-gold/40'}`}
                        aria-pressed={data.level === l}>{l}</button>
                    ))}
                  </div>
                  {errors.level && <p className="text-red-400 text-xs mt-1">{errors.level}</p>}
                </FormField>
                <FormField label="Preferred Mode *" error={errors.mode}>
                  <div className="grid grid-cols-2 gap-2">
                    {YOGA_MODES.map(m => (
                      <button key={m} type="button" onClick={() => set({ mode: m })}
                        className={`px-3 py-2.5 rounded-lg text-sm border transition-all ${data.mode === m ? 'bg-gold/15 border-gold text-gold' : 'border-gold/20 text-cream/60 hover:border-gold/40'}`}
                        aria-pressed={data.mode === m}>{m}</button>
                    ))}
                  </div>
                  {errors.mode && <p className="text-red-400 text-xs mt-1">{errors.mode}</p>}
                </FormField>
                <FormField label="Your Goals (optional)">
                  <div className="flex flex-wrap gap-2">
                    {GOALS.map(g => {
                      const sel = (data.goals || []).includes(g);
                      return (
                        <button key={g} type="button"
                          onClick={() => set({ goals: sel ? (data.goals || []).filter(x => x !== g) : [...(data.goals || []), g] })}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${sel ? 'bg-gold/15 border-gold text-gold' : 'border-gold/15 text-cream/50 hover:border-gold/35'}`}
                          aria-pressed={sel}>{g}</button>
                      );
                    })}
                  </div>
                </FormField>
              </StepWrapper>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <StepWrapper key="s3" title="Choose Membership">
                <div className="space-y-3">
                  {MEMBERSHIP_TYPES.map(type => (
                    <button key={type.id} type="button" onClick={() => set({ membershipType: type.id })}
                      className={`w-full text-left rounded-xl p-5 border transition-all ${data.membershipType === type.id ? 'bg-gold/10 border-gold' : 'border-gold/15 hover:border-gold/35'}`}
                      aria-pressed={data.membershipType === type.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-serif font-bold text-cream">{type.label}</span>
                            {type.badge && <span className="px-2 py-0.5 text-[10px] rounded-full bg-gold text-charcoal font-bold">{type.badge}</span>}
                          </div>
                          <p className="text-cream/50 text-xs">{type.desc}</p>
                        </div>
                        <span className="font-serif font-bold text-gold text-xl shrink-0 ml-3">{type.price}</span>
                      </div>
                      {data.membershipType === type.id && (
                        <div className="mt-2 flex items-center gap-1 text-gold text-xs">
                          <CheckCircle size={12} /> Selected
                        </div>
                      )}
                    </button>
                  ))}
                  {errors.membershipType && <p className="text-red-400 text-xs mt-1">{errors.membershipType}</p>}
                </div>
              </StepWrapper>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <StepWrapper key="s4" title="Confirm Registration">
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Name',       value: data.name },
                    { label: 'Phone',      value: data.phone },
                    { label: 'Age',        value: data.age },
                    { label: 'Level',      value: data.level },
                    { label: 'Mode',       value: data.mode },
                    { label: 'Goals',      value: (data.goals || []).join(', ') || '—' },
                    { label: 'Membership', value: MEMBERSHIP_TYPES.find(t => t.id === data.membershipType)?.label || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-gold/8 text-sm">
                      <span className="text-cream/45 w-28 shrink-0">{label}</span>
                      <span className="text-cream/80 font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-cream/40 text-xs leading-relaxed mb-5">
                  By submitting, you agree to be contacted by DIVY ASHISH YOGA SANSTHAN to confirm your registration.
                </p>
                <button onClick={handleSubmit} className="btn-primary w-full justify-center">
                  <Send size={15} /> Complete Registration
                </button>
              </StepWrapper>
            )}
          </AnimatePresence>

          {step < 4 && (
            <div className="flex justify-between mt-6 pt-6 border-t border-gold/10">
              <button onClick={handleBack} disabled={step === 1}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gold/25 text-cream/60 text-sm hover:border-gold/50 hover:text-cream disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={15} /> Back
              </button>
              <button onClick={handleNext} className="btn-primary text-sm py-2.5 px-6">
                {step === 3 ? 'Review' : 'Next'} <ChevronRight size={15} />
              </button>
            </div>
          )}
        </MysticalCard>
      </section>

      {/* ── Trial booking flow modal ── */}
      <AnimatePresence>
        {bookingPlan && (
          <TrialBookingFlow
            plan={bookingPlan}
            onClose={() => setBookingPlan(null)}
            onPaid={oid => {
              setPaidOrderId(oid);
              setBookingPlan(null);
              setSelectedTrials([]);
            }}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}

/* ── Sub-components ── */
function StepWrapper({ title, children }) {
  return (
    <motion.div key={title}
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
      <h3 className="font-serif text-xl font-bold text-cream mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-cream/55 text-xs uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
