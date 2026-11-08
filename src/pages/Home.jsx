import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Star } from 'lucide-react';
import SectionDivider from '../components/SectionDivider';
import SectionHeader from '../components/SectionHeader';
import MysticalCard from '../components/MysticalCard';
import ParticleSystem from '../components/ParticleSystem';
import AnimatedCounter from '../components/AnimatedCounter';
import MeditationModeButton from '../components/MeditationModeButton';
import { fadeUp, staggerChildren, scaleIn } from '../utils/animations';
import InnerBalanceWheel from '../components/InnerBalanceWheel';
import { useApp } from '../context/AppContext';

// ── Services overview cards (generic descriptions — static by design) ───────
const services = [
  { icon: '🧘', title: 'Yoga Training',        desc: 'Basic to advanced yogasana for all levels' },
  { icon: '🏆', title: 'Yogasana Sports',      desc: 'Competition preparation & sports training' },
  { icon: '💻', title: 'Online Classes',       desc: 'Live sessions from anywhere in the world' },
  { icon: '🎯', title: 'Personal Training',    desc: 'One-on-one tailored yoga programs' },
  { icon: '🌿', title: 'Wellness Programs',    desc: 'Holistic health & lifestyle guidance' },
  { icon: '🥇', title: 'Competition Training', desc: 'District to national level preparation' },
];

// ── What You Will Learn (static curriculum — no admin control needed) ────────
const learningCards = [
  { icon: '🧘', title: 'Yogasana Practice',    desc: 'Basic to advanced yogasanas with proper alignment and breath awareness.' },
  { icon: '💨', title: 'Pranayama',            desc: 'Ancient breathing techniques to regulate prana and calm the mind.' },
  { icon: '🌟', title: 'Meditation',           desc: 'Mindfulness, concentration and deep meditative practices.' },
  { icon: '☀️', title: 'Surya Namaskar',       desc: 'The traditional 12-step sun salutation aligned with breath.' },
  { icon: '🤸', title: 'Warm-up & Joints',     desc: 'Joint mobility sequences and dynamic warm-up routines.' },
  { icon: '🌙', title: 'Yoga Nidra',           desc: 'Yogic sleep for deep healing, stress relief and restoration.' },
  { icon: '🔥', title: 'Shatkarma',            desc: 'Six classical purification practices of Hatha Yoga tradition.' },
  { icon: '🏆', title: 'Yogasana Sports',      desc: 'Competition-level training aligned with national federation standards.' },
];

// ── Fallback stats shown when backend is offline ─────────────────────────────
const fallbackStats = [
  { value: '11+',   label: 'Years Experience', icon: '📅' },
  { value: '1000+', label: 'Students Trained', icon: '🧘' },
  { value: '500+',  label: 'Competitions',     icon: '🏆' },
  { value: '100+',  label: 'Certifications',   icon: '📜' },
];

export default function Home() {
  // ── Live data from admin dashboard ─────────────────────────────────────────
  const { siteStats, siteReviews } = useApp();

  // Use live stats seeded via admin; fall back to static defaults if DB is empty
  const stats = (siteStats && siteStats.length > 0) ? siteStats : fallbackStats;

  // Pick first approved review for the testimonial snippet
  const featuredReview = siteReviews?.find(r => r.approved !== false) ?? null;

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  const orbScale   = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgY        = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY      = useTransform(scrollYProgress, [0, 0.5], ['0%', '-20%']);
  const figureY    = useTransform(scrollYProgress, [0, 1], ['0px', '-60px']);

  return (
    <main>
      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #050f08 0%, #091a10 40%, #060c08 100%)' }}
        aria-label="Hero section"
      >
        {/* Parallax mountain/forest SVG background */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Sky gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,67,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 50% 20%, rgba(17,92,69,0.1) 0%, transparent 60%)',
            }}
          />
          {/* Mountain silhouette SVG */}
          <svg
            viewBox="0 0 1440 400"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 w-full opacity-20"
          >
            <path
              d="M0 400 L0 250 L120 180 L240 220 L360 120 L480 200 L600 80 L720 160 L840 60 L960 150 L1080 90 L1200 170 L1320 100 L1440 200 L1440 400 Z"
              fill="#0a2a1a"
            />
            <path
              d="M0 400 L0 300 L180 260 L300 290 L420 230 L540 270 L660 200 L780 250 L900 190 L1020 240 L1140 200 L1260 250 L1380 210 L1440 250 L1440 400 Z"
              fill="#0d3520"
            />
          </svg>
          {/* Forest tree line */}
          <svg
            viewBox="0 0 1440 200"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 w-full opacity-15"
          >
            {Array.from({ length: 24 }, (_, i) => {
              const x = (i / 23) * 1440;
              const h = 60 + Math.sin(i * 1.7) * 30;
              return (
                <g key={i}>
                  <polygon
                    points={`${x},${200 - h} ${x - 18},200 ${x + 18},200`}
                    fill="#155c35"
                  />
                  <polygon
                    points={`${x},${200 - h - 20} ${x - 12},${200 - h + 10} ${x + 12},${200 - h + 10}`}
                    fill="#1a7040"
                  />
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Particles */}
        <ParticleSystem count={20} type="dot"  className="z-0" />
        <ParticleSystem count={8}  type="leaf" className="z-0" />

        {/* Prana Energy Orb */}
        <motion.div
          style={{ scale: orbScale, opacity: orbOpacity }}
          className="absolute z-10 pointer-events-none"
          aria-hidden="true"
        >
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-20 sm:-inset-32"
          >
            <svg viewBox="0 0 400 400" className="w-full h-full opacity-20">
              <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(212,168,67,0.4)" strokeWidth="0.8" strokeDasharray="6 10" />
              {[0,45,90,135,180,225,270,315].map((deg) => (
                <ellipse key={deg} cx="200" cy="30" rx="12" ry="30" fill="none" stroke="rgba(212,168,67,0.3)" strokeWidth="0.6" transform={`rotate(${deg} 200 200)`} />
              ))}
            </svg>
          </motion.div>
          {/* Middle ring reverse */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-12 sm:-inset-20"
          >
            <svg viewBox="0 0 300 300" className="w-full h-full opacity-25">
              <circle cx="150" cy="150" r="145" fill="none" stroke="rgba(17,92,69,0.5)" strokeWidth="0.6" />
              {[0,60,120,180,240,300].map((deg) => (
                <line key={deg} x1="150" y1="10" x2="150" y2="40" stroke="rgba(212,168,67,0.5)" strokeWidth="1" transform={`rotate(${deg} 150 150)`} />
              ))}
            </svg>
          </motion.div>
          {/* Glow orb */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-60 h-60 sm:w-80 sm:h-80 rounded-full prana-orb"
          />
        </motion.div>

        {/* Meditating figure SVG */}
        <motion.div
          style={{ y: figureY }}
          className="absolute bottom-16 sm:bottom-20 z-10 pointer-events-none"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 220" className="w-32 h-36 sm:w-48 sm:h-52 opacity-70">
            {/* Lotus base */}
            <ellipse cx="100" cy="210" rx="55" ry="8" fill="rgba(212,168,67,0.15)" />
            {/* Body silhouette */}
            <path
              d="M100 40 C100 40, 100 40, 100 40
                 Q105 55 108 75 L130 120 Q140 130 145 140 L55 140 Q60 130 70 120 L92 75
                 Q95 55 100 40Z"
              fill="rgba(17,50,35,0.9)"
            />
            {/* Head */}
            <circle cx="100" cy="28" r="16" fill="rgba(17,50,35,0.9)" />
            {/* Legs crossed */}
            <path d="M55 140 Q45 165 30 175 Q50 178 70 168 L100 155 L130 168 Q150 178 170 175 Q155 165 145 140Z" fill="rgba(17,50,35,0.9)" />
            {/* Arms */}
            <path d="M70 120 Q55 140 50 160" stroke="rgba(17,50,35,0.9)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M130 120 Q145 140 150 160" stroke="rgba(17,50,35,0.9)" strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Chakra glow */}
            <circle cx="100" cy="90" r="5" fill="rgba(212,168,67,0.5)">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* Aura rays */}
            {[0,40,80,120,160,200,240,280,320].map((deg) => (
              <line key={deg}
                x1="100" y1="85" x2="100" y2="65"
                stroke="rgba(212,168,67,0.15)"
                strokeWidth="1"
                transform={`rotate(${deg} 100 85)`}
              />
            ))}
          </svg>
        </motion.div>

        {/* Mandala background */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute z-0 pointer-events-none opacity-5"
          style={{ width: '700px', height: '700px' }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {[40,70,100,130,160,190].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#d4a843" strokeWidth="0.5" />
            ))}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
              <line key={deg} x1="200" y1="10" x2="200" y2="390" stroke="#d4a843" strokeWidth="0.3" transform={`rotate(${deg} 200 200)`} />
            ))}
            {[0,45,90,135,180,225,270,315].map((deg) => (
              <ellipse key={deg} cx="200" cy="60" rx="15" ry="40" fill="none" stroke="#d4a843" strokeWidth="0.4" transform={`rotate(${deg} 200 200)`} />
            ))}
          </svg>
        </motion.div>

        {/* Hero text */}
        <motion.div
          style={{ y: textY }}
          className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-gold/70 text-xs sm:text-sm tracking-[0.4em] uppercase mb-4 font-devanagari"
          >
            ॐ • दिव्य आशीष योग संस्थान • ॐ
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-shadow-gold"
          >
            Transform Your{' '}
            <span className="text-gold-gradient">Body, Mind</span>
            <br />& Lifestyle Through Yoga
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-4 text-gold/80 text-base sm:text-lg font-devanagari tracking-widest"
          >
            स्वस्थ शरीर • शांत मन • खुशहाल जीवन
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-5 text-cream/65 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          >
            Discover authentic yoga practice, yogasana sports training, personalised wellness programs
            and holistic lifestyle guidance with DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE).
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/classes" className="btn-primary">
              Explore Classes <ArrowRight size={16} />
            </Link>
            <Link to="/membership" className="btn-outline">
              Join Today
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-10"
          >
            <MeditationModeButton />
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.8, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-cream/30"
          aria-hidden="true"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, transparent, #060c08)' }}
        />
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(10,61,46,0.4) 0%, rgba(6,12,8,0.8) 100%)' }}
        aria-label="Statistics"
      >
        <div className="absolute inset-0 border-y border-gold/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <AnimatedCounter
                key={i}
                value={s.value}
                suffix={s.suffix || ''}
                label={s.label}
                icon={s.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          INTRODUCTION — Services grid
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" aria-label="Introduction">
        <SectionHeader
          sanskrit="दिव्य आशीष योग संस्थान"
          title="Ancient Wisdom."
          titleHighlight="Modern Wellness."
          description="We offer a comprehensive range of yoga programs — from personal training and group sessions to competition preparation and online classes. Every practice is rooted in authentic Indian yoga tradition."
        />

        <SectionDivider />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        >
          {services.map((s, i) => (
            <motion.div key={i} variants={fadeUp}>
              <MysticalCard className="p-6 group" delay={i * 0.05}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-2xl shrink-0 group-hover:bg-gold/20 transition-colors">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-cream mb-1">{s.title}</h3>
                    <p className="text-cream/55 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                {/* Gold line reveal on hover */}
                <div className="mt-4 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: 'linear-gradient(to right, rgba(212,168,67,0.6), transparent)' }}
                />
              </MysticalCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/classes" className="btn-outline">
            View All Classes <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

      <SectionDivider className="max-w-7xl mx-auto px-4" />

      {/* ════════════════════════════════════════════════════════════
          WHAT YOU WILL LEARN
      ════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4 sm:px-6 relative overflow-hidden"
        aria-label="What you will learn"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(10,30,20,0.3) 50%, transparent 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            sanskrit="शिक्षा"
            title="What You Will"
            titleHighlight="Learn"
            description="A complete curriculum covering every dimension of the ancient yoga science — from physical asanas to inner transformation."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {learningCards.map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07 }}
              >
                <MysticalCard className="p-6 h-full group" hoverLift>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full border border-gold/30 bg-gold/8 flex items-center justify-center text-2xl mb-4 mx-auto group-hover:border-gold/60 transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="font-serif text-base font-semibold text-cream text-center mb-2">
                    {card.title}
                  </h3>
                  <p className="text-cream/50 text-xs text-center leading-relaxed">{card.desc}</p>

                  {/* Arrow */}
                  <div className="flex justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} className="text-gold" />
                  </div>
                </MysticalCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider className="max-w-7xl mx-auto px-4" />

      {/* ════════════════════════════════════════════════════════════
          INNER BALANCE WHEEL
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" aria-label="Inner balance wheel">
        <SectionHeader
          sanskrit="अन्तर संतुलन"
          title="Discover Your"
          titleHighlight="Inner Balance"
          description="Yoga integrates every dimension of your being. Explore how each element connects to bring you to a state of complete harmony."
        />
        <div className="mt-14">
          <InnerBalanceWheel />
        </div>
      </section>

      <SectionDivider className="max-w-7xl mx-auto px-4" />

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIAL PREVIEW
      ════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4 sm:px-6 relative overflow-hidden"
        aria-label="Testimonials preview"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(10,30,20,0.25) 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            sanskrit="प्रतिक्रिया"
            title="What Our Students"
            titleHighlight="Say"
          />
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 mystical-card p-8 sm:p-10 text-center"
          >
            <div className="flex justify-center gap-1 mb-5">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={`${featuredReview && s <= (featuredReview.rating || 5) ? 'text-gold fill-gold' : 'text-gold/30'}`}
                />
              ))}
            </div>
            <p className="text-cream/70 text-base sm:text-lg italic leading-relaxed font-serif">
              {featuredReview
                ? `"${featuredReview.review}"`
                : '"Yoga at DIVY ASHISH YOGA SANSTHAN has truly transformed my life — better health, inner peace and a wonderful community."'}
            </p>
            <p className="text-gold/60 text-sm mt-5 font-medium">
              {featuredReview
                ? `— ${featuredReview.name}${featuredReview.category ? `, ${featuredReview.category}` : ''}`
                : '— Satisfied Student, Lucknow'}
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8"
          >
            <Link to="/reviews" className="btn-outline">
              Read All Reviews <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA BANNER
      ════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4 sm:px-6 relative overflow-hidden"
        aria-label="Call to action"
      >
        <div
          className="max-w-4xl mx-auto rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(10,61,46,0.7) 0%, rgba(20,50,30,0.8) 100%)',
            border: '1px solid rgba(212,168,67,0.25)',
            boxShadow: '0 0 60px rgba(212,168,67,0.08)',
          }}
        >
          {/* Corner ornaments */}
          <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/50 rounded-tl-2xl" aria-hidden="true" />
          <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/50 rounded-tr-2xl" aria-hidden="true" />
          <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/50 rounded-bl-2xl" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/50 rounded-br-2xl" aria-hidden="true" />

          <ParticleSystem count={8} type="lotus" className="opacity-40" />

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="text-gold/60 text-xs tracking-[0.4em] uppercase font-devanagari mb-3">
              एक कदम आगे बढ़ें
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-4">
              Begin Your Yoga Journey Today
            </motion.h2>
            <motion.p variants={fadeUp} className="text-cream/60 text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Join DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE) and transform your body, calm your mind, and enrich your life
              through the ancient science of yoga.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/membership" className="btn-primary">
                Register Now — ₹567
              </Link>
              <Link to="/contact" className="btn-outline">
                Talk to Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
