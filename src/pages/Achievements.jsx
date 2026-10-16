import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, BookOpen, Gavel } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import AnimatedCounter from '../components/AnimatedCounter';
import ParticleSystem from '../components/ParticleSystem';
import { achievementCategories } from '../data/achievements';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren, slideLeft, slideRight, pageTransition } from '../utils/animations';

const LEVEL_CONFIG = {
  'District':       { color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/25',  icon: <Medal size={16} /> },
  'State':          { color: 'text-gold',         bg: 'bg-gold/10 border-gold/25',             icon: <Trophy size={16} /> },
  'National':       { color: 'text-yellow-300',   bg: 'bg-yellow-300/10 border-yellow-300/25', icon: <Trophy size={16} /> },
  'Championship':   { color: 'text-gold',         bg: 'bg-gold/10 border-gold/25',             icon: <Award size={16} /> },
  'Certification':  { color: 'text-emerald-400',  bg: 'bg-emerald-400/10 border-emerald-400/25', icon: <BookOpen size={16} /> },
  'Judge / Observer':{ color: 'text-sky-400',     bg: 'bg-sky-400/10 border-sky-400/25',       icon: <Gavel size={16} /> },
};

export default function Achievements() {
  const { siteAchievements: achievements, siteStats: achievementStats } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? achievements
    : achievements.filter((a) => a.level === activeFilter || a.type === activeFilter);

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,168,67,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <ParticleSystem count={10} type="dot" />

        <SectionHeader
          sanskrit="उपलब्धियाँ"
          title="The Journey of"
          titleHighlight="Excellence"
          description="A testament to dedication, discipline and the transformative power of yoga practice — from district stages to national arenas."
        />
      </section>

      {/* ── Stats bar ── */}
      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 py-10"
        aria-label="Achievement statistics"
        style={{ background: 'linear-gradient(135deg, rgba(10,61,46,0.3) 0%, rgba(6,12,8,0.5) 100%)', borderTop: '1px solid rgba(212,168,67,0.08)', borderBottom: '1px solid rgba(212,168,67,0.08)' }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {achievementStats.map((s, i) => (
            <AnimatedCounter key={i} value={s.value} label={s.label} icon={s.icon} />
          ))}
        </div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Filter ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter achievements">
          {achievementCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeFilter === cat
                  ? 'bg-gold text-charcoal border-gold'
                  : 'border-gold/20 text-cream/60 hover:border-gold/40 hover:text-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6" aria-label="Achievement timeline">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Timeline spine */}
            <div
              className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px timeline-line"
              aria-hidden="true"
            />

            <div className="space-y-10">
              {filtered.map((item, i) => {
                const cfg = LEVEL_CONFIG[item.level] || LEVEL_CONFIG['District'];
                const isLeft = i % 2 === 0;

                return (
                  <motion.div
                    key={item.id}
                    variants={isLeft ? slideRight : slideLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative flex items-start gap-6 ${
                      isLeft
                        ? 'sm:flex-row-reverse sm:text-right'
                        : 'sm:flex-row sm:text-left'
                    } pl-14 sm:pl-0`}
                  >
                    {/* Timeline node */}
                    <div
                      className="absolute left-3 sm:left-1/2 sm:-translate-x-1/2 top-2 w-7 h-7 rounded-full border-2 border-gold/50 bg-charcoal flex items-center justify-center z-10"
                      aria-hidden="true"
                    >
                      <span className="text-gold text-sm leading-none">{item.icon}</span>
                    </div>

                    {/* Card */}
                    <div
                      className={`flex-1 sm:w-[calc(50%-2rem)] sm:max-w-sm ${isLeft ? 'sm:mr-8' : 'sm:ml-8'}`}
                    >
                      <div
                        className="scroll-card rounded-xl p-5 hover:border-gold/40 transition-colors duration-300"
                        style={{ background: 'linear-gradient(135deg, rgba(18,10,6,0.95) 0%, rgba(10,20,12,0.95) 100%)' }}
                      >
                        {/* Year + level badge */}
                        <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'sm:justify-end' : ''} flex-wrap`}>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}
                          >
                            {cfg.icon}
                            {item.level}
                          </span>
                          <span className="text-gold/50 text-xs font-mono">{item.year}</span>
                        </div>

                        <h3 className="font-serif text-lg font-bold text-cream mb-1">{item.title}</h3>

                        <p className="text-gold/70 text-sm font-medium mb-2">{item.position}</p>
                        <p className="text-cream/50 text-xs mb-1">{item.location}</p>
                        <p className="text-cream/45 text-sm leading-relaxed mt-3">{item.description}</p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden sm:block flex-1" />
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-cream/40">
                <p className="text-4xl mb-3">🏆</p>
                <p>No achievements found for this category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4 mt-16" />

      {/* ── Add achievements CTA ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-cream/40 text-sm italic">
            Achievement records are maintained by DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE).
            Contact us to update the official achievement list.
          </p>
        </motion.div>
      </section>
    </motion.main>
  );
}
