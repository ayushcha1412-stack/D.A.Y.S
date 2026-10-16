import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import ParticleSystem from '../components/ParticleSystem';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren, pageTransition } from '../utils/animations';

export default function Gallery() {
  const { siteGallery, siteFacilitators: facilitators } = useApp();

  // Handle both imported image objects (local) and URL strings (MongoDB)
  const galleryItems = siteGallery.map(item => ({
    ...item,
    image: typeof item.image === 'string'
      ? (item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image)
      : item.image, // already an imported asset object
  }));
  const [lightbox, setLightbox] = useState(null);

  const openLightbox  = useCallback((i) => { setLightbox(i); document.body.style.overflow = 'hidden'; }, []);
  const closeLightbox = useCallback(() => { setLightbox(null); document.body.style.overflow = ''; }, []);
  const prevItem = useCallback(() => setLightbox((p) => (p - 1 + galleryItems.length) % galleryItems.length), []);
  const nextItem = useCallback(() => setLightbox((p) => (p + 1) % galleryItems.length), []);

  const handleKeyDown = useCallback((e) => {
    if (lightbox === null) return;
    if (e.key === 'ArrowRight') nextItem();
    if (e.key === 'ArrowLeft')  prevItem();
    if (e.key === 'Escape')     closeLightbox();
  }, [lightbox, nextItem, prevItem, closeLightbox]);

  return (
    <motion.main
      {...pageTransition}
      className="pt-24 pb-20"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,168,67,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <ParticleSystem count={8} type="leaf" />
        <SectionHeader
          sanskrit="गैलरी"
          title="Our Yoga"
          titleHighlight="Gallery"
          description="A visual journey through the passionate team behind DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE)."
        />
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Photo Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6" aria-label="Gallery photos">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              transition={{ delay: i * 0.06 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
              onClick={() => openLightbox(i)}
              role="button"
              tabIndex={0}
              aria-label={`View photo of ${item.title}`}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(i)}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div className="flex items-end justify-between w-full">
                  <p className="text-cream text-sm font-serif font-semibold leading-tight">{item.title}</p>
                  <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center shrink-0">
                    <ZoomIn size={13} className="text-gold" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4 mt-12" />

      {/* ── Meet Our Facilitators ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14" aria-label="Meet our facilitators">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-gold/50 text-xs tracking-[0.35em] uppercase font-devanagari mb-1">सुविधाकर्ता</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream mb-2">
            Meet Our <span className="text-gold">Facilitators</span>
          </h2>
          <p className="text-cream/45 text-sm max-w-lg mx-auto leading-relaxed">
            The faces behind every photo — passionate yoga teachers dedicated to your holistic wellness.
          </p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4"
        >
          {facilitators.map((f, i) => (
            <motion.div
              key={f.id}
              variants={fadeUp}
              transition={{ delay: i * 0.07 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gold/15 mb-3 group-hover:border-gold/40 transition-colors duration-300">
                {f.image ? (
                  <img
                    src={f.image}
                    alt={`${f.name} — ${f.title}`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <ImagePlaceholder
                    alt={`${f.name} — ${f.title}`}
                    className="w-full h-full rounded-none border-0"
                    aspectRatio="square"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {f.featured && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gold border-2 border-charcoal" aria-label="Featured facilitator" />
                )}
              </div>
              <p className="text-cream text-xs font-serif font-semibold leading-snug px-1 group-hover:text-gold transition-colors duration-200">
                {f.name.replace(/\[|\]/g, '')}
              </p>
              <p className="text-gold/60 text-[10px] mt-0.5 leading-snug px-1 line-clamp-2">
                {f.title}
              </p>
              <div className="hidden sm:flex flex-wrap justify-center gap-1 mt-2 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300">
                {(f.specialization || []).slice(0, 2).map((sp) => (
                  <span key={sp} className="px-2 py-0.5 rounded-full text-[9px] bg-gold/10 border border-gold/20 text-gold/70">
                    {sp}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/facilitators" className="btn-outline text-sm py-2.5 px-8 inline-flex items-center gap-2">
            View Full Profiles
          </Link>
        </motion.div>
      </section>

      {/* ════════════════ LIGHTBOX ════════════════ */}
      <AnimatePresence>
        {lightbox !== null && galleryItems[lightbox] && (
          <>
            <motion.div
              key="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
              onClick={closeLightbox}
            />
            <motion.div
              key="lb-panel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="fixed inset-4 sm:inset-8 lg:inset-16 z-50 flex flex-col items-center justify-center"
              role="dialog"
              aria-modal="true"
              aria-label="Image lightbox"
            >
              <button
                onClick={closeLightbox}
                className="absolute top-0 right-0 w-10 h-10 rounded-full bg-charcoal/80 border border-gold/30 text-cream/70 hover:text-gold flex items-center justify-center transition-colors z-10"
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>

              <div className="w-full h-full max-h-[70vh] rounded-xl overflow-hidden border border-gold/15">
                <img
                  src={galleryItems[lightbox].image}
                  alt={galleryItems[lightbox].alt}
                  className="w-full h-full object-contain bg-charcoal/80"
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-cream font-serif font-semibold">{galleryItems[lightbox].title}</p>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); prevItem(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-panel border border-gold/20 text-gold/70 hover:text-gold flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextItem(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-panel border border-gold/20 text-gold/70 hover:text-gold flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>

              <p className="absolute bottom-0 text-cream/30 text-xs">
                {lightbox + 1} / {galleryItems.length}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
