import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import ParticleSystem from '../components/ParticleSystem';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren, scaleIn, pageTransition } from '../utils/animations';

const COLOR_MAP = {
  gold:    { border: 'border-gold/50',       bg: 'from-gold/10 to-gold/3',          badge: 'bg-gold text-charcoal',         btn: 'btn-primary' },
  forest:  { border: 'border-emerald-mid/40', bg: 'from-emerald-mid/15 to-emerald-deep/10', badge: 'bg-emerald-mid text-white', btn: 'btn-outline' },
  emerald: { border: 'border-emerald-400/40', bg: 'from-emerald-400/10 to-transparent', badge: 'bg-emerald-400 text-charcoal', btn: 'btn-outline' },
  bronze:  { border: 'border-amber-600/40',  bg: 'from-amber-600/10 to-transparent', badge: 'bg-amber-600 text-white',        btn: 'btn-outline' },
};

export default function Plans() {
  const { sitePlans } = useApp();
  const plans = sitePlans;
  const [billingCycle] = useState('monthly');

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,168,67,0.08) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <ParticleSystem count={8} type="dot" />
        <SectionHeader
          sanskrit="निवेश योजनाएं"
          title="Investment"
          titleHighlight="Plans"
          description="Choose the yoga plan that fits your lifestyle, goals and budget. Every plan is an investment in your health and wellbeing."
        />
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Annual registration highlight ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-12">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(10,61,46,0.4) 100%)',
            border: '1.5px solid rgba(212,168,67,0.35)',
          }}
        >
          {/* Ornament corners */}
          <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/50 rounded-tl-2xl" aria-hidden="true" />
          <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/50 rounded-tr-2xl" aria-hidden="true" />
          <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/50 rounded-bl-2xl" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/50 rounded-br-2xl" aria-hidden="true" />

          <p className="text-gold/60 text-xs tracking-[0.4em] uppercase font-devanagari mb-3">
            वार्षिक पंजीकरण
          </p>
          <div className="font-serif text-6xl font-bold text-gold text-shadow-gold mb-2">₹567</div>
          <p className="text-cream/70 text-lg mb-1">Annual Registration</p>
          <p className="text-cream/40 text-sm mb-6">₹567/year · Non-refundable registration fee. New members get 17% off their first month.</p>
          <Link to="/membership" className="btn-primary">
            Register Now <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── Plans grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6" aria-label="Yoga investment plans">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {plans.map((plan, i) => {
            const colors = COLOR_MAP[plan.color] || COLOR_MAP.forest;
            return (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                transition={{ delay: i * 0.07 }}
                className={`relative rounded-2xl border overflow-hidden flex flex-col ${colors.border} ${plan.popular ? 'ring-1 ring-gold/40' : ''}`}
                style={{ background: `linear-gradient(160deg, rgba(6,14,10,0.95) 0%, rgba(10,25,15,0.9) 100%)` }}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${colors.badge}`}>
                    {plan.badge}
                  </div>
                )}

                {/* Popular glow */}
                {plan.popular && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{ boxShadow: 'inset 0 0 30px rgba(212,168,67,0.06)' }}
                    aria-hidden="true"
                  />
                )}

                <div className={`p-6 bg-gradient-to-br ${colors.bg} border-b ${colors.border}`}>
                  {plan.popular && (
                    <div className="flex items-center gap-1 text-gold text-xs mb-2">
                      <Star size={12} className="fill-gold" /> Most Popular
                    </div>
                  )}
                  <h3 className="font-serif text-xl font-bold text-cream mb-0.5">{plan.name}</h3>
                  <p className="text-cream/45 text-xs mb-4">{plan.subtitle}</p>

                  <div className="flex items-end gap-1">
                    <span className="font-serif text-3xl font-bold text-gold">{plan.price}</span>
                    <span className="text-cream/40 text-xs mb-1">/ {plan.duration.toLowerCase()}</span>
                  </div>
                  <p className="text-cream/45 text-xs leading-relaxed mt-2">{plan.priceDetails}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gold/10 border border-gold/20 text-gold/70">
                      {plan.mode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-cream/5 border border-cream/10 text-cream/50">
                      {(plan.members || 1)} member{(plan.members || 1) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {(plan.benefits || []).map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-cream/65">
                        <Check size={14} className="text-gold/70 mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/membership"
                    className={`${colors.btn} text-sm py-2.5 px-6 justify-center w-full`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4 mt-16" />

      {/* ── Pricing note ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-cream/35 text-sm italic leading-relaxed">
            A ₹199 trial session is adjustable in your monthly fee. Annual registration is ₹567/year and non-refundable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <a
              href={`tel:+916386659500`}
              className="btn-outline text-sm py-2.5 px-6"
            >
              Call for Pricing
            </a>
            <a
              href={`https://wa.me/918127227284?text=Namaste! Please share details about your yoga plans and pricing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2.5 px-6"
            >
              WhatsApp for Pricing
            </a>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
}
