import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import MysticalCard from '../components/MysticalCard';
import ParticleSystem from '../components/ParticleSystem';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren, scaleIn, pageTransition } from '../utils/animations';
import { Link } from 'react-router-dom';

export default function Expertise() {
  const { siteExpertise: expertiseAreas } = useApp();
  const [active, setActive] = useState(null);
  const activeItem = active !== null ? expertiseAreas[active] : null;

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(17,92,69,0.1) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <ParticleSystem count={10} type="lotus" />
        <SectionHeader
          sanskrit="विशेषज्ञता"
          title="Our Areas of"
          titleHighlight="Expertise"
          description="Sixteen dimensions of yoga science — each area a complete discipline, together forming a holistic path to wellness."
        />
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ════════════════════════════════════════════════════════
          Circular Energy Diagram
      ════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8" aria-label="Yoga expertise wheel">
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-20 justify-center">

          {/* ── Wheel ── */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 shrink-0">
            {/* Outer glow ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(212,168,67,0.12)' }}
              aria-hidden="true"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-3 rounded-full"
              style={{ border: '1px dashed rgba(212,168,67,0.08)' }}
              aria-hidden="true"
            />

            {/* Center orb */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full overflow-hidden z-10 border border-gold/30"
              style={{
                boxShadow: '0 0 40px rgba(212,168,67,0.25)',
              }}
              aria-hidden="true"
            >
              <img src="/images/logo.png" alt="DAYS logo" className="w-full h-full object-cover" draggable={false} />
            </div>

            {/* Nodes */}
            {expertiseAreas.map((area, i) => {
              const angle = (i / expertiseAreas.length) * 360 - 90;
              const rad   = (angle * Math.PI) / 180;
              const r     = 43;
              const cx    = 50;
              const cy    = 50;
              const px    = cx + r * Math.cos(rad);
              const py    = cy + r * Math.sin(rad);
              const isActive = active === i;

              return (
                <motion.button
                  key={area.id}
                  onClick={() => setActive(isActive ? null : i)}
                  animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full"
                  style={{ left: `${px}%`, top: `${py}%` }}
                  aria-pressed={isActive}
                  aria-label={`${area.title} — ${area.sanskrit}`}
                >
                  {/* Spoke */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
                    aria-hidden="true"
                  />

                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all duration-300 border text-lg"
                    style={{
                      background: isActive
                        ? `radial-gradient(ellipse, ${area.color}22 0%, ${area.color}08 100%)`
                        : 'rgba(8,20,14,0.85)',
                      borderColor: isActive ? area.color : 'rgba(212,168,67,0.25)',
                      boxShadow:   isActive ? `0 0 20px ${area.color}55` : 'none',
                      color: area.color,
                    }}
                  >
                    <span>{area.icon}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* ── Detail panel ── */}
          <div className="flex-1 xl:max-w-md w-full max-w-lg">
            <AnimatePresence mode="wait">
              {activeItem ? (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mystical-card p-8"
                >
                  <p className="text-gold/40 text-xs tracking-widest uppercase mb-2 font-devanagari">
                    {activeItem.sanskrit}
                  </p>
                  <h3 className="font-serif text-3xl font-bold mb-1" style={{ color: activeItem.color }}>
                    {activeItem.title}
                  </h3>
                  <p className="text-cream/65 text-sm leading-relaxed mb-5">{activeItem.description}</p>

                  <ul className="space-y-2.5 mb-6">
                    {activeItem.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-cream/60">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: activeItem.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="h-px mb-6" style={{ background: `linear-gradient(to right, ${activeItem.color}60, transparent)` }} />

                  <Link to="/classes" className="btn-outline text-sm py-2.5 px-5">
                    Explore Classes <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center xl:text-left"
                >
                  <p className="text-gold/35 text-xs tracking-widest uppercase mb-4 font-devanagari">
                    Tap any node to explore
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream mb-4">
                    Eight Areas of{' '}
                    <span className="text-gold-gradient">Yoga Science</span>
                  </h3>
                  <p className="text-cream/50 text-sm leading-relaxed mb-6">
                    Each discipline is a gateway to a deeper dimension of practice. 
                    Click any area on the wheel to learn more about what we teach.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center xl:justify-start">
                    {expertiseAreas.map((a, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className="px-3 py-1.5 rounded-full text-xs border border-gold/15 text-cream/45 hover:border-gold/40 hover:text-gold transition-all"
                      >
                        {a.icon} {a.title}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4 mt-8" />

      {/* ── Full expertise grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8" aria-label="All expertise areas">
        <SectionHeader
          sanskrit="सम्पूर्ण विशेषज्ञता"
          title="Complete Expertise"
          titleHighlight="Overview"
          description="Every program we offer is grounded in authentic yogic knowledge and modern teaching methodology."
        />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12"
        >
          {expertiseAreas.map((area, i) => (
            <motion.div key={area.id} variants={fadeUp} transition={{ delay: i * 0.05 }}>
              <button
                onClick={() => {
                  setActive(i);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="w-full text-left"
                aria-label={`Learn about ${area.title}`}
              >
                <MysticalCard className="p-5 group" hoverLift>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 border transition-colors"
                    style={{
                      borderColor: `${area.color}40`,
                      background: `${area.color}10`,
                    }}
                  >
                    {area.icon}
                  </div>
                  <p className="text-gold/40 text-xs font-devanagari mb-1">{area.sanskrit}</p>
                  <h3 className="font-serif text-sm font-bold text-cream mb-1">{area.title}</h3>
                  <p className="text-cream/45 text-xs leading-snug line-clamp-2">{area.description}</p>

                  <div className="flex items-center gap-1 mt-3 text-gold/50 text-xs group-hover:text-gold transition-colors">
                    <span>Learn more</span>
                    <ArrowRight size={10} />
                  </div>
                </MysticalCard>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.main>
  );
}
