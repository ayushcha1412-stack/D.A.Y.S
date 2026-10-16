import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Monitor, MapPin, ChevronRight } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import MysticalCard from '../components/MysticalCard';
import ParticleSystem from '../components/ParticleSystem';
import { classCategories } from '../data/classes';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren, pageTransition } from '../utils/animations';
import { Link } from 'react-router-dom';

const PERIOD_COLORS = {
  morning: 'text-gold',
  evening: 'text-emerald-400',
  night:   'text-blue-300',
};
const PERIOD_BG = {
  morning: 'bg-gold/10 border-gold/20',
  evening: 'bg-emerald-mid/20 border-emerald-mid/30',
  night:   'bg-blue-900/20 border-blue-400/20',
};

export default function Classes() {
  const { siteClasses, siteSchedule } = useApp();
  const classes       = siteClasses.filter(Boolean);
  const scheduleSlots = siteSchedule;
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return classes;
    return classes.filter((c) => {
      const tags = Array.isArray(c.tags) ? c.tags : [c.category, c.mode].filter(Boolean);
      return tags.includes(activeFilter) || c.category === activeFilter || c.mode === activeFilter;
    });
  }, [activeFilter, classes]);

  const morningSlots = scheduleSlots.filter((s) => s.period === 'morning');
  const eveningSlots = scheduleSlots.filter((s) => s.period === 'evening');
  const nightSlots   = scheduleSlots.filter((s) => s.period === 'night');

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(17,92,69,0.12) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <ParticleSystem count={8} type="leaf" />
        <SectionHeader
          sanskrit="योग कक्षाएं"
          title="Our Yoga"
          titleHighlight="Classes"
          description="From personal to group sessions, online to offline — choose the class that fits your life, goals and schedule."
        />
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Filter bar ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-10" aria-label="Class filters">
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter classes">
          {classCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-250 border ${
                activeFilter === cat
                  ? 'bg-gold text-charcoal border-gold shadow-gold'
                  : 'bg-transparent border-gold/25 text-cream/65 hover:border-gold/50 hover:text-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Classes grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6" aria-label="Class listing">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((cls, i) => (
              <motion.div
                key={cls.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.06 }}
              >
                <MysticalCard className="p-6 h-full flex flex-col group" hoverLift>
                  {/* Icon + tags */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-2xl group-hover:bg-gold/20 transition-colors">
                      {cls.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {cls.featured && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gold text-charcoal font-bold">
                          Popular
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-mid/20 border border-emerald-mid/30 text-emerald-400">
                        {cls.mode}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-cream mb-2">{cls.title}</h3>
                  <p className="text-cream/55 text-sm leading-relaxed flex-1 mb-4">{cls.description}</p>

                  {/* Meta */}
                  <div className="space-y-2 text-xs text-cream/50 mb-5">
                    <div className="flex items-start gap-2">
                      <Clock size={12} className="text-gold/60 mt-0.5 shrink-0" />
                      <span>{cls.timing}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users size={12} className="text-gold/60 mt-0.5 shrink-0" />
                      <span>{(cls.suitableFor || []).join(' · ') || 'All levels'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      {cls.mode === 'Online' || cls.mode.includes('Online') ? (
                        <Monitor size={12} className="text-gold/60 mt-0.5 shrink-0" />
                      ) : (
                        <MapPin size={12} className="text-gold/60 mt-0.5 shrink-0" />
                      )}
                      <span>{cls.category} · {cls.mode}</span>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                    <div>
                      <p className="text-gold/50 text-xs">Starting from</p>
                      <p className="text-gold font-bold text-lg font-serif">{cls.price}</p>
                    </div>
                    <Link
                      to="/membership"
                      className="flex items-center gap-1 text-xs text-gold border border-gold/30 px-3 py-1.5 rounded-full hover:bg-gold/10 transition-colors"
                    >
                      Enroll <ChevronRight size={12} />
                    </Link>
                  </div>
                </MysticalCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-cream/40">
            <p className="text-4xl mb-3">🧘</p>
            <p className="text-base">No classes found for this filter.</p>
          </div>
        )}
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4 mt-16" />

      {/* ════════════════════════════════════════════════════════
          CLASS SCHEDULE
      ════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8" aria-label="Class schedule">
        <SectionHeader
          sanskrit="समय सारणी"
          title="Class"
          titleHighlight="Schedule"
          description="Choose your batch — morning, evening or night. All sessions available both online and offline unless noted."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Morning */}
          <ScheduleColumn label="🌅 Morning" slots={morningSlots} period="morning" />
          {/* Evening */}
          <ScheduleColumn label="🌇 Evening" slots={eveningSlots} period="evening" />
          {/* Night */}
          <ScheduleColumn label="🌙 Night"   slots={nightSlots}   period="night" />
        </div>
      </section>
    </motion.main>
  );
}

function ScheduleColumn({ label, slots, period }) {
  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h3 className={`font-serif text-xl font-bold mb-5 ${PERIOD_COLORS[period]}`}>{label}</h3>
      <div className="space-y-3">
        {slots.map((slot, i) => (
          <motion.div
            key={slot.id}
            variants={fadeUp}
            transition={{ delay: i * 0.07 }}
            className={`rounded-xl p-4 border backdrop-blur-sm ${PERIOD_BG[period]}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-bold text-sm font-mono ${PERIOD_COLORS[period]}`}>
                {slot.time}
              </span>
              <span className="text-xs text-cream/40">{slot.duration}</span>
            </div>
            <p className="font-serif text-sm font-semibold text-cream mb-0.5">{slot.session}</p>
            <p className="text-cream/45 text-xs leading-snug mb-2">{slot.description}</p>
            <div className="flex items-center gap-3 text-xs text-cream/40">
              <span>{slot.mode}</span>
              <span>·</span>
              <span>{slot.type}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
