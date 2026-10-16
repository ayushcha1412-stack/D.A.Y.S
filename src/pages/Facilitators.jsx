import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, BookOpen, Star, MessageCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import MysticalCard from '../components/MysticalCard';
import ImagePlaceholder from '../components/ImagePlaceholder';
import ParticleSystem from '../components/ParticleSystem';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren, scaleIn, pageTransition } from '../utils/animations';

export default function Facilitators() {
  const { siteFacilitators: facilitators, siteContact } = useApp();
  const contactInfo = siteContact;
  const [selected, setSelected] = useState(null);

  const openModal  = (f) => { setSelected(f); document.body.style.overflow = 'hidden'; };
  const closeModal = ()  => { setSelected(null); document.body.style.overflow = ''; };

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Page hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,168,67,0.08) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <ParticleSystem count={10} type="lotus" />

        <SectionHeader
          sanskrit="सुविधाकर्ता"
          title="Meet Our Yoga"
          titleHighlight="Facilitators"
          description="Experienced, certified and passionate yoga teachers dedicated to guiding you on your journey toward holistic wellness."
        />
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Cards grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6" aria-label="Facilitator profiles">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {facilitators.map((f, i) => (
            <motion.div key={f.id} variants={fadeUp} transition={{ delay: i * 0.1 }}>
              <MysticalCard className="p-0 overflow-hidden group" hoverLift>
                {/* Image */}
                <div className="relative overflow-hidden">
                  {f.image ? (
                    <img
                      src={f.image}
                      alt={`${f.name} — yoga facilitator`}
                      className="w-full h-50 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImagePlaceholder
                      alt={`${f.name} — ${f.title}`}
                      className="w-full h-60"
                      aspectRatio="auto"
                    />
                  
                  )}
                  {/* Featured badge */}
                  {f.featured && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-charcoal bg-gradient-to-r from-gold-light to-gold">
                      Featured
                    </span>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-cream mb-0.5">{f.name}</h3>
                  <p className="text-gold text-sm font-medium mb-3">{f.title}</p>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.specialization.map((sp) => (
                      <span
                        key={sp}
                        className="px-2.5 py-0.5 rounded-full text-xs bg-gold/10 border border-gold/20 text-gold/80"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-cream/50 text-xs mb-5">
                    <span className="flex items-center gap-1">
                      <Award size={12} className="text-gold/60" />
                      {f.experience}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} className="text-gold/60" />
                      {f.qualification}
                    </span>
                  </div>

                  <button
                    onClick={() => openModal(f)}
                    className="btn-outline w-full justify-center text-sm py-2.5"
                    aria-label={`View profile of ${f.name}`}
                  >
                    View Profile
                  </button>
                </div>
              </MysticalCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4 mt-16" />

      {/* ── Join CTA ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-cream/50 text-sm leading-relaxed mb-6">
            Interested in practising with our facilitators? Register today and get matched with
            the right teacher for your goals.
          </p>
          <a
            href={`https://wa.me/91${contactInfo.whatsapp}?text=Namaste! I would like to know more about your facilitators.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <MessageCircle size={16} />
            Connect on WhatsApp
          </a>
        </motion.div>
      </section>

      {/* ════════════════ MODAL ════════════════ */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.88, y: 40 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{ opacity: 0,  scale: 0.92,   y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="fixed inset-x-4 inset-y-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl z-50 overflow-y-auto rounded-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={`Profile of ${selected.name}`}
              style={{
                background: 'linear-gradient(135deg, #0a1f15 0%, #060c08 100%)',
                border: '1px solid rgba(212,168,67,0.25)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
                maxHeight: '90vh',
              }}
            >
              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full glass-panel text-cream/60 hover:text-gold transition-colors"
                aria-label="Close profile modal"
              >
                <X size={18} />
              </button>

              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-gold/40 shrink-0 mx-auto sm:mx-0"
                  >
                    {selected.image ? (
                      <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlaceholder alt={selected.name} className="w-full h-full" aspectRatio="1/1" />
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 text-center sm:text-left"
                  >
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream mb-1">
                      {selected.name}
                    </h2>
                    <p className="text-gold font-medium mb-2">{selected.title}</p>
                    <p className="text-cream/50 text-sm mb-3">{selected.qualification}</p>
                    <div className="flex items-center gap-1 justify-center sm:justify-start mb-3">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={14} className="text-gold fill-gold" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-gold/10 border border-gold/25 text-gold/80">
                      <Award size={11} />
                      {selected.experience} Experience
                    </span>
                  </motion.div>
                </div>

                <SectionDivider symbol="✦ ✦ ✦" className="my-4" />

                {/* Specializations */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <h3 className="text-gold/70 text-xs tracking-widest uppercase mb-3 font-medium">Specialization</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selected.specialization.map((sp) => (
                      <span key={sp} className="px-3 py-1 rounded-full text-sm bg-emerald-deep/50 border border-gold/20 text-cream/80">
                        {sp}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Certifications */}
                {selected.certifications?.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h3 className="text-gold/70 text-xs tracking-widest uppercase mb-3 font-medium">Certifications</h3>
                    <ul className="space-y-1.5 mb-6">
                      {selected.certifications.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-cream/65 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Biography */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <h3 className="text-gold/70 text-xs tracking-widest uppercase mb-3 font-medium">Biography</h3>
                  <p className="text-cream/60 text-sm leading-relaxed mb-6">{selected.biography}</p>
                </motion.div>

                {/* WhatsApp CTA */}
                <motion.a
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  href={`https://wa.me/91${selected.social?.whatsapp || contactInfo.whatsapp}?text=Namaste! I would like to book a session with ${selected.name}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                >
                  <MessageCircle size={16} />
                  Book a Session
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
