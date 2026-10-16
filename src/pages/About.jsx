import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Target, CheckCircle, Crown, Users, Shield } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import MysticalCard from '../components/MysticalCard';
import ParticleSystem from '../components/ParticleSystem';
import { fadeUp, staggerChildren, slideLeft, slideRight, scaleIn, pageTransition } from '../utils/animations';

// ── Leadership data ─────────────────────────────────────────────────────────
const founder = {
  name: 'Mr. Ashish',
  position: 'Founder',
  photo: '/images/leadership/ash G.jpeg',
};

const officeBearers = [
  { name: 'Mr. Shivam Verma G',  position: 'Vice President', photo: '/images/leadership/shivam G.jpeg' },
  { name: 'Dr. Santosh Sharma',  position: 'Treasurer',      photo: '/images/leadership/papa g.jpeg' },
  { name: 'Mrs. Neha Khare G',   position: 'Secretary',      photo: '/images/leadership/neha khare g.jpeg' },
  { name: 'Mohd. Umar G',        position: 'F Member',       photo: '/images/leadership/umar G.jpeg' },
  { name: 'Ms. Neha G',          position: 'F Member',       photo: '/images/leadership/nehaa mam g.jpeg' },
];

const members = [
  { name: 'Mr. Amit Rawat G',   position: 'Member', photo: '/images/leadership/amiit g.jpeg' },
  { name: 'Mr. Ram Pal Verma G',position: 'Member', photo: '/images/leadership/shii father G.jpeg' },
  { name: 'Adv. Vivek Pandey G',position: 'Member', photo: '/images/leadership/vivek G.jpeg' },
  { name: 'Mrs. Savita G',      position: 'Member', photo: '/images/leadership/savita G.jpeg' },
  { name: 'Ms. Lalita Yadav G', position: 'Member', photo: '/images/leadership/lalita G.jpeg' },
];

const chaperones = [
  { name: 'Mrs. Chandani Shukla G', position: 'Chaperone', photo: '/images/leadership/chandani mam G.jpeg' },
  { name: 'Mrs. Laxmi Devi G',      position: 'Chaperone', photo: '/images/leadership/maa G.jpeg' },
];

// ── PersonCard ───────────────────────────────────────────────────────────────
function PersonCard({ person, size = 'md', highlighted = false }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = person.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const sizeMap = {
    lg: { wrap: 'w-36 h-36 sm:w-44 sm:h-44', text: 'text-3xl' },
    md: { wrap: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-xl'  },
    sm: { wrap: 'w-20 h-20 sm:w-24 sm:h-24', text: 'text-lg'  },
  };
  const sz = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex flex-col items-center text-center group ${highlighted ? 'px-4' : ''}`}>
      {/* Photo ring */}
      <div
        className={`relative ${sz.wrap} rounded-full mb-4 shrink-0`}
        style={{
          padding: highlighted ? '3px' : '2px',
          background: highlighted
            ? 'linear-gradient(135deg, #f5d98b, #d4a843, #a07828)'
            : 'linear-gradient(135deg, rgba(212,168,67,0.6), rgba(17,92,69,0.4))',
          boxShadow: highlighted
            ? '0 0 32px rgba(212,168,67,0.45), 0 8px 32px rgba(0,0,0,0.5)'
            : '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-emerald-deep/80 border border-gold/10">
          {!imgErr ? (
            <img
              src={person.photo}
              alt={person.name}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center font-serif font-bold ${sz.text} text-gold/70`}
              style={{ background: 'radial-gradient(ellipse at center, rgba(17,92,69,0.6), rgba(6,12,8,0.9))' }}
              aria-label={person.name}
            >
              {initials}
            </div>
          )}
        </div>
        {/* Glow ring on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: '0 0 20px rgba(212,168,67,0.3)' }}
          aria-hidden="true"
        />
      </div>

      {/* Name */}
      <h4
        className={`font-serif font-bold leading-tight mb-1 ${
          highlighted ? 'text-cream text-lg sm:text-xl' : 'text-cream text-sm sm:text-base'
        }`}
      >
        {person.name}
      </h4>

      {/* Position badge */}
      <span
        className={`inline-block rounded-full font-medium tracking-wide ${
          highlighted
            ? 'px-4 py-1 text-xs bg-gold/20 border border-gold/50 text-gold'
            : 'px-3 py-0.5 text-xs bg-gold/10 border border-gold/25 text-gold/75'
        }`}
      >
        {person.position}
      </span>
    </div>
  );
}

const values = [
  { icon: '🎯', title: 'Discipline',          desc: 'Consistent practice with focused intention builds lasting transformation.' },
  { icon: '🔄', title: 'Consistency',         desc: 'Regular sadhana is the foundation of all yogic progress.' },
  { icon: '⏰', title: 'Punctuality',         desc: 'Respecting time is a practice of mindfulness in itself.' },
  { icon: '⭐', title: 'Excellence',          desc: 'We pursue the highest standards in teaching and personal practice.' },
  { icon: '🌿', title: 'Wellness',            desc: 'Holistic health of body, mind, energy and spirit.' },
  { icon: '🙏', title: 'Respect',             desc: 'Honouring the ancient tradition and every individual on the path.' },
  { icon: '✨', title: 'Positive Lifestyle',  desc: 'Yoga extends beyond the mat into every aspect of daily living.' },
];

const journey = [
  { year: '[Year]', title: 'Foundation',           desc: 'DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE) was established with the vision of bringing authentic yoga to Lucknow.' },
  { year: '[Year]', title: 'First Students',       desc: 'Our first batch of students began their yoga journey under dedicated personal guidance.' },
  { year: '[Year]', title: 'Yogasana Sports',      desc: 'Introduction of yogasana sports training and participation in district-level competitions.' },
  { year: '[Year]', title: 'Online Expansion',     desc: 'Launch of online yoga classes bringing our authentic practice to students across India.' },
  { year: '[Year]', title: 'National Presence',    desc: 'Students representing at national-level yogasana sports competitions.' },
  { year: 'Today',  title: 'Growing Community',    desc: 'A thriving community of students, families and wellness seekers practising the ancient science of yoga.' },
];

export default function About() {
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
          sanskrit="हमारे बारे में"
          title="Ancient Wisdom."
          titleHighlight="Modern Wellness."
          description="DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE) is dedicated to preserving and sharing the authentic science of yoga for the holistic wellbeing of every individual and family."
        />
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Philosophy Banner ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(10,61,46,0.5) 0%, rgba(6,12,8,0.7) 100%)',
            border: '1px solid rgba(212,168,67,0.2)',
          }}
        >
          <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl" aria-hidden="true" />
          <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/40 rounded-tr-2xl" aria-hidden="true" />
          <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/40 rounded-bl-2xl" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/40 rounded-br-2xl" aria-hidden="true" />

          <motion.p variants={fadeUp} className="text-gold/50 text-xs tracking-[0.4em] uppercase font-devanagari mb-4">
            हमारी दर्शन
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl font-bold text-cream mb-4">
            Healthy Body · Calm Mind · Happy Life
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gold/80 text-lg font-devanagari">
            स्वस्थ शरीर • शांत मन • खुशहाल जीवन
          </motion.p>
          <motion.p variants={fadeUp} className="text-cream/55 mt-4 text-base max-w-2xl mx-auto leading-relaxed">
            Every program we offer flows from this core philosophy — yoga is not merely exercise,
            it is a complete science for living well in body, mind and spirit.
          </motion.p>
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Mission / Vision / Values ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8" aria-label="Mission, vision and values">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mission */}
          <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <MysticalCard className="p-8 h-full">
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5">
                <Target size={24} className="text-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cream mb-3">Our Mission</h3>
              <p className="text-cream/60 text-sm leading-relaxed">
                To make authentic, affordable and accessible yoga available to every individual —
                regardless of age, background or ability — through professional teaching, personalised
                guidance and a warm community environment rooted in traditional Indian yoga values.
              </p>
            </MysticalCard>
          </motion.div>

          {/* Vision */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <MysticalCard className="p-8 h-full">
              <div className="w-14 h-14 rounded-full bg-emerald-mid/20 border border-emerald-mid/30 flex items-center justify-center mb-5">
                <Eye size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cream mb-3">Our Vision</h3>
              <p className="text-cream/60 text-sm leading-relaxed">
                To create a vibrant yoga community in Lucknow and across India where ancient wisdom
                meets modern wellness — empowering students, families, senior citizens and athletes
                to live healthier, happier and more purposeful lives through the timeless science of yoga.
              </p>
            </MysticalCard>
          </motion.div>

          {/* Values intro */}
          <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <MysticalCard className="p-8 h-full">
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5">
                <Heart size={24} className="text-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cream mb-3">Our Values</h3>
              <ul className="space-y-2">
                {values.slice(0, 4).map((v) => (
                  <li key={v.title} className="flex items-center gap-2.5 text-sm text-cream/65">
                    <CheckCircle size={13} className="text-gold/60 shrink-0" />
                    <span>{v.title}</span>
                  </li>
                ))}
                <li className="text-gold/40 text-xs mt-1 pl-5">+ {values.length - 4} more below</li>
              </ul>
            </MysticalCard>
          </motion.div>
        </div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Values Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8" aria-label="Our values">
        <SectionHeader
          sanskrit="मूल्य"
          title="What We Stand"
          titleHighlight="For"
          description="Our core values guide every class, every interaction and every moment on the yoga mat."
        />
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12"
        >
          {values.map((v, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.07 }}>
              <MysticalCard className="p-6 text-center group" hoverLift>
                <div className="text-3xl mb-3">{v.icon}</div>
                <h4 className="font-serif text-base font-bold text-cream mb-2">{v.title}</h4>
                <p className="text-cream/50 text-xs leading-relaxed">{v.desc}</p>
              </MysticalCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Journey Timeline ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8" aria-label="Our journey">
        <SectionHeader
          sanskrit="हमारी यात्रा"
          title="Our"
          titleHighlight="Journey"
          description="From humble beginnings to a growing community of wellness seekers — the story of DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE)."
        />

        <div className="relative mt-14">
          {/* Spine */}
          <div
            className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,67,0.5) 10%, rgba(212,168,67,0.5) 90%, transparent)' }}
            aria-hidden="true"
          />

          <div className="space-y-10">
            {journey.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  variants={isLeft ? slideRight : slideLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 pl-16 sm:pl-0 ${isLeft ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
                >
                  {/* Node */}
                  <div
                    className="absolute left-3 sm:left-1/2 sm:-translate-x-1/2 top-3 w-7 h-7 rounded-full border-2 border-gold bg-charcoal flex items-center justify-center z-10 text-gold text-xs font-bold"
                    aria-hidden="true"
                  >
                    ✦
                  </div>

                  {/* Card */}
                  <div className={`flex-1 sm:w-[calc(50%-2.5rem)] ${isLeft ? 'sm:mr-10' : 'sm:ml-10'}`}>
                    <div
                      className="scroll-card rounded-xl p-5"
                      style={{ background: 'linear-gradient(135deg, rgba(14,8,4,0.95) 0%, rgba(8,18,10,0.95) 100%)' }}
                    >
                      <span className="inline-block px-3 py-0.5 rounded-full text-xs bg-gold/15 border border-gold/25 text-gold/80 mb-3 font-mono">
                        {item.year}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-cream mb-2">{item.title}</h3>
                      <p className="text-cream/55 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4 mt-6" />

      {/* ════════════════════════════════════════════════════════════
          LEADERSHIP / OFFICE BEARERS
      ════════════════════════════════════════════════════════════ */}
      <section
        id="leadership"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
        aria-label="Leadership and Office Bearers"
      >
        <SectionHeader
          sanskrit="नेतृत्व"
          title="Leadership &"
          titleHighlight="Office Bearers"
          description="The dedicated team guiding DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE) — committed to sharing authentic yoga and building a healthier community."
        />

        {/* ── Founder ── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 mb-12 flex justify-center"
          aria-label="Founder"
        >
          <div
            className="relative rounded-2xl p-8 sm:p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(17,92,69,0.25) 0%, rgba(6,12,8,0.8) 60%, rgba(17,92,69,0.15) 100%)',
              border: '1px solid rgba(212,168,67,0.35)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,168,67,0.1)',
              maxWidth: 360,
              width: '100%',
            }}
          >
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gold/60 rounded-tl-2xl" aria-hidden="true" />
            <span className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gold/60 rounded-tr-2xl" aria-hidden="true" />
            <span className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gold/60 rounded-bl-2xl" aria-hidden="true" />
            <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gold/60 rounded-br-2xl" aria-hidden="true" />

            {/* Crown icon */}
            <div className="flex justify-center mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.4)' }}
                aria-hidden="true"
              >
                <Crown size={18} className="text-gold" />
              </div>
            </div>

            <PersonCard person={founder} size="lg" highlighted />

            <p className="text-cream/40 text-xs mt-5 tracking-widest uppercase font-devanagari">
              संस्थापक
            </p>
          </div>
        </motion.div>

        {/* ── Office Bearers ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
          aria-label="Office Bearers"
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.3)' }}
              aria-hidden="true"
            >
              <Shield size={16} className="text-gold" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-cream">Office Bearers</h3>
              <p className="text-cream/40 text-xs tracking-widest uppercase font-devanagari">पदाधिकारी</p>
            </div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(212,168,67,0.3), transparent)' }} aria-hidden="true" />
          </div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8"
          >
            {officeBearers.map((person, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.08 }}>
                <div
                  className="rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center h-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(10,40,26,0.6) 0%, rgba(6,12,8,0.7) 100%)',
                    border: '1px solid rgba(212,168,67,0.15)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,67,0.35)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 16px rgba(212,168,67,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,67,0.15)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
                  }}
                >
                  <PersonCard person={person} size="md" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="h-px w-full mb-12" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.2), transparent)' }} aria-hidden="true" />

        {/* ── Members ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
          aria-label="Members"
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(17,92,69,0.2)', border: '1px solid rgba(17,92,69,0.4)' }}
              aria-hidden="true"
            >
              <Users size={16} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-cream">Members</h3>
              <p className="text-cream/40 text-xs tracking-widest uppercase font-devanagari">सदस्य</p>
            </div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(17,92,69,0.4), transparent)' }} aria-hidden="true" />
          </div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8"
          >
            {members.map((person, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.07 }}>
                <div
                  className="rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center h-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(8,30,18,0.55) 0%, rgba(6,12,8,0.7) 100%)',
                    border: '1px solid rgba(17,92,69,0.2)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(17,92,69,0.45)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.4), 0 0 14px rgba(17,92,69,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(17,92,69,0.2)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                  }}
                >
                  <PersonCard person={person} size="md" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="h-px w-full mb-12" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.15), transparent)' }} aria-hidden="true" />

        {/* ── Chaperones ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-label="Chaperones"
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}
              aria-hidden="true"
            >
              <Heart size={16} className="text-gold/60" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-cream">Chaperones</h3>
              <p className="text-cream/40 text-xs tracking-widest uppercase font-devanagari">संरक्षक</p>
            </div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(212,168,67,0.2), transparent)' }} aria-hidden="true" />
          </div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-2xl"
          >
            {chaperones.map((person, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                <div
                  className="rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center h-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(10,30,16,0.5) 0%, rgba(6,12,8,0.65) 100%)',
                    border: '1px solid rgba(212,168,67,0.1)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,67,0.25)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,67,0.1)';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.3)';
                  }}
                >
                  <PersonCard person={person} size="sm" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4 mt-6" />

      {/* ── Tagline close ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-gold/60 text-xl sm:text-2xl font-devanagari leading-relaxed"
        >
          एक कदम अपने और अपनों के स्वास्थ्य की ओर
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-cream/40 text-sm mt-3 italic"
        >
          "One step towards your health and the health of your loved ones."
        </motion.p>
      </section>
    </motion.main>
  );
}
