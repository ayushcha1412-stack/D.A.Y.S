import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, ChevronLeft, Send, User, Heart, CreditCard } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import MysticalCard from '../components/MysticalCard';
import ParticleSystem from '../components/ParticleSystem';
import { fadeUp, staggerChildren, scaleIn, pageTransition } from '../utils/animations';
import { useApp } from '../context/AppContext';

const STEPS = [
  { id: 1, label: 'Personal Info',     icon: <User size={18} />,        desc: 'Basic details' },
  { id: 2, label: 'Yoga Preference',   icon: <Heart size={18} />,       desc: 'Your goals' },
  { id: 3, label: 'Membership Type',   icon: <CreditCard size={18} />,  desc: 'Choose plan' },
  { id: 4, label: 'Confirmation',      icon: <CheckCircle size={18} />, desc: 'Review & submit' },
];

const MEMBERSHIP_TYPES = [
  { id: 'annual', label: 'Annual Registration', price: '₹567/year', badge: 'Best Value', desc: 'Non-refundable annual registration fee.' },
  { id: 'monthly', label: 'Monthly Membership', price: 'From ₹499', badge: '', desc: 'New members get 17% off in their first month.' },
  { id: 'trial', label: 'Trial Session', price: '₹199', badge: 'Try First', desc: 'Adjustable in your monthly fee.' },
];

const YOGA_MODES = ['Online Group', 'Offline Group', 'Online Personal', 'Offline Personal', 'Home Visit'];
const GOALS      = ['Weight Management', 'Stress Relief', 'Flexibility', 'Strength', 'Sports Competition', 'Therapeutic', 'Spiritual Growth', 'Overall Wellness'];
const LEVELS     = ['Complete Beginner', 'Some Experience', 'Intermediate', 'Advanced'];

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
    if (!data.level)    e.level   = 'Select your experience level';
    if (!data.mode)     e.mode    = 'Select preferred mode';
  }
  if (step === 3) {
    if (!data.membershipType) e.membershipType = 'Select a membership type';
  }
  return e;
}

export default function Membership() {
  const { membershipDraft, setMembershipDraft, addMembership, siteContact } = useApp();
  const [step, setStep]         = useState(1);
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  const data = membershipDraft;
  const set  = (updates) => setMembershipDraft((prev) => ({ ...prev, ...updates }));

  const handleNext = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    if (step < 4) setStep(step + 1);
  };
  const handleBack = () => { setErrors({}); if (step > 1) setStep(step - 1); };

  const handleSubmit = () => {
    // Save to owner dashboard
    addMembership({
      id:             Date.now(),
      name:           data.name,
      phone:          data.phone,
      age:            data.age,
      gender:         data.gender || '',
      email:          data.email  || '',
      level:          data.level,
      mode:           data.mode,
      goals:          data.goals  || [],
      membershipType: data.membershipType,
      status:         'pending',
      date:           new Date().toISOString(),
    });
    setSubmitted(true);
    setMembershipDraft({});
  };

  if (submitted) {
    return (
      <motion.main {...pageTransition} className="pt-24 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="w-24 h-24 rounded-full bg-gold/15 border-2 border-gold/50 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={44} className="text-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl font-bold text-cream mb-3"
          >
            Registration Complete!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-cream/60 text-base mb-6 leading-relaxed"
          >
            Thank you for joining DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE).
            <br />We will contact you shortly to confirm your membership details.
          </motion.p>
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            href={`https://wa.me/91${siteContact?.whatsapp || '8127227284'}?text=Namaste! I have just registered for membership at DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE).`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            Confirm on WhatsApp
          </motion.a>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,168,67,0.09) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <ParticleSystem count={8} type="lotus" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="inline-block mb-5"
        >
          <div
            className="px-6 py-3 rounded-2xl border border-gold/30 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(10,61,46,0.3))' }}
          >
            <p className="text-gold/60 text-xs tracking-widest uppercase mb-1">Annual Registration</p>
            <p className="font-serif text-5xl font-bold text-gold text-shadow-gold">₹567</p>
            <p className="text-cream/50 text-sm mt-1">Non-refundable annual fee</p>
          </div>
        </motion.div>

        <SectionHeader
          sanskrit="सदस्यता"
          title="Join Our Yoga"
          titleHighlight="Community"
          description="Register for ₹567/year, get 17% off your first month, or book a ₹199 trial session adjustable in your monthly fee."
        />
      </section>

      {/* ── Benefits ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col items-center text-center p-4 rounded-xl border border-gold/12 bg-gold/4"
            >
              <span className="text-2xl mb-2">{b.icon}</span>
              <p className="text-cream/60 text-xs leading-snug">{b.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Multi-step form ── */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6" aria-label="Registration form">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-0 right-0 h-px bg-gold/15 z-0" aria-hidden="true" />
            <div
              className="absolute top-5 left-0 h-px bg-gold z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              aria-hidden="true"
            />
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step > s.id
                      ? 'bg-gold border-gold text-charcoal'
                      : step === s.id
                        ? 'bg-gold/15 border-gold text-gold'
                        : 'bg-charcoal border-gold/25 text-cream/30'
                  }`}
                  aria-current={step === s.id ? 'step' : undefined}
                >
                  {step > s.id ? <CheckCircle size={16} /> : s.icon}
                </div>
                <p className={`text-xs mt-2 font-medium transition-colors ${step >= s.id ? 'text-gold' : 'text-cream/30'}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <MysticalCard className="p-8">
          <AnimatePresence mode="wait">
            {/* ── Step 1 ── */}
            {step === 1 && (
              <StepWrapper key="step1" title="Personal Information">
                <FormField label="Full Name *" error={errors.name}>
                  <input className={`input-field ${errors.name ? 'border-red-500/60' : ''}`} value={data.name || ''} onChange={(e) => set({ name: e.target.value })} placeholder="Your full name" autoComplete="name" />
                </FormField>
                <FormField label="Phone *" error={errors.phone}>
                  <input className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`} value={data.phone || ''} onChange={(e) => set({ phone: e.target.value })} placeholder="10-digit mobile" type="tel" maxLength={10} autoComplete="tel" />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Age *" error={errors.age}>
                    <input className={`input-field ${errors.age ? 'border-red-500/60' : ''}`} value={data.age || ''} onChange={(e) => set({ age: e.target.value })} placeholder="Your age" type="number" min="5" max="100" />
                  </FormField>
                  <FormField label="Gender">
                    <select className="input-field" value={data.gender || ''} onChange={(e) => set({ gender: e.target.value })}>
                      <option value="">Select…</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </FormField>
                </div>
                <FormField label="Email (optional)">
                  <input className="input-field" value={data.email || ''} onChange={(e) => set({ email: e.target.value })} placeholder="your@email.com" type="email" autoComplete="email" />
                </FormField>
              </StepWrapper>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <StepWrapper key="step2" title="Yoga Preference">
                <FormField label="Experience Level *" error={errors.level}>
                  <div className="grid grid-cols-2 gap-2">
                    {LEVELS.map((l) => (
                      <button key={l} type="button" onClick={() => set({ level: l })}
                        className={`px-3 py-2.5 rounded-lg text-sm border transition-all ${data.level === l ? 'bg-gold/15 border-gold text-gold' : 'border-gold/20 text-cream/60 hover:border-gold/40'}`}
                        aria-pressed={data.level === l}
                      >{l}</button>
                    ))}
                  </div>
                  {errors.level && <p className="text-red-400 text-xs mt-1">{errors.level}</p>}
                </FormField>

                <FormField label="Preferred Mode *" error={errors.mode}>
                  <div className="grid grid-cols-2 gap-2">
                    {YOGA_MODES.map((m) => (
                      <button key={m} type="button" onClick={() => set({ mode: m })}
                        className={`px-3 py-2.5 rounded-lg text-sm border transition-all ${data.mode === m ? 'bg-gold/15 border-gold text-gold' : 'border-gold/20 text-cream/60 hover:border-gold/40'}`}
                        aria-pressed={data.mode === m}
                      >{m}</button>
                    ))}
                  </div>
                  {errors.mode && <p className="text-red-400 text-xs mt-1">{errors.mode}</p>}
                </FormField>

                <FormField label="Your Goals (select all that apply)">
                  <div className="flex flex-wrap gap-2">
                    {GOALS.map((g) => {
                      const sel = (data.goals || []).includes(g);
                      return (
                        <button key={g} type="button"
                          onClick={() => set({ goals: sel ? (data.goals || []).filter((x) => x !== g) : [...(data.goals || []), g] })}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${sel ? 'bg-gold/15 border-gold text-gold' : 'border-gold/15 text-cream/50 hover:border-gold/35'}`}
                          aria-pressed={sel}
                        >{g}</button>
                      );
                    })}
                  </div>
                </FormField>
              </StepWrapper>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <StepWrapper key="step3" title="Choose Membership">
                <div className="space-y-3">
                  {MEMBERSHIP_TYPES.map((type) => (
                    <button key={type.id} type="button" onClick={() => set({ membershipType: type.id })}
                      className={`w-full text-left rounded-xl p-5 border transition-all duration-250 ${data.membershipType === type.id ? 'bg-gold/10 border-gold' : 'border-gold/15 hover:border-gold/35'}`}
                      aria-pressed={data.membershipType === type.id}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-serif font-bold text-cream">{type.label}</span>
                            {type.badge && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gold text-charcoal font-bold">{type.badge}</span>
                            )}
                          </div>
                          <p className="text-cream/50 text-xs">{type.desc}</p>
                        </div>
                        <span className="font-serif font-bold text-gold text-xl">{type.price}</span>
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

            {/* ── Step 4 ── */}
            {step === 4 && (
              <StepWrapper key="step4" title="Confirm Registration">
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Name',       value: data.name },
                    { label: 'Phone',      value: data.phone },
                    { label: 'Age',        value: data.age },
                    { label: 'Gender',     value: data.gender },
                    { label: 'Email',      value: data.email || '—' },
                    { label: 'Level',      value: data.level },
                    { label: 'Mode',       value: data.mode },
                    { label: 'Goals',      value: (data.goals || []).join(', ') || '—' },
                    { label: 'Membership', value: MEMBERSHIP_TYPES.find((t) => t.id === data.membershipType)?.label || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-gold/8 text-sm">
                      <span className="text-cream/45 w-28 shrink-0">{label}</span>
                      <span className="text-cream/80 font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-cream/40 text-xs leading-relaxed mb-5">
                  By submitting, you agree to be contacted by DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE) to confirm your
                  registration and arrange payment.
                </p>
                <button onClick={handleSubmit} className="btn-primary w-full justify-center">
                  <Send size={15} /> Complete Registration
                </button>
              </StepWrapper>
            )}
          </AnimatePresence>

          {/* Step navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-6 pt-6 border-t border-gold/10">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gold/25 text-cream/60 text-sm hover:border-gold/50 hover:text-cream disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button onClick={handleNext} className="btn-primary text-sm py-2.5 px-6">
                {step === 3 ? 'Review' : 'Next'} <ChevronRight size={15} />
              </button>
            </div>
          )}
        </MysticalCard>
      </section>
    </motion.main>
  );
}

function StepWrapper({ title, children }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
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
