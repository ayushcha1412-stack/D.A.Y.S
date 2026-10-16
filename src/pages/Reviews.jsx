import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Send, CheckCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import MysticalCard from '../components/MysticalCard';
import ParticleSystem from '../components/ParticleSystem';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren, scaleIn, pageTransition } from '../utils/animations';

const CATEGORIES = ['All', 'Online Yoga', 'Personal Yoga', 'Yogasana Sports', 'Children\'s Yoga', 'Group Yoga', 'Other'];

function StarRating({ value, onChange, size = 20 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1,2,3,4,5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
          aria-label={`${s} star${s !== 1 ? 's' : ''}`}
          aria-pressed={value >= s}
        >
          <Star
            size={size}
            className={`transition-colors duration-150 ${
              (hover || value) >= s ? 'text-gold fill-gold' : 'text-gold/25'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { reviewDraft, setReviewDraft, siteReviews: allReviews, addPendingReview } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');
  const [current, setCurrent]           = useState(0);
  const [isHovered, setIsHovered]       = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors]     = useState({});
  const intervalRef = useRef(null);

  const filtered = activeFilter === 'All'
    ? allReviews
    : allReviews.filter((r) => r.category === activeFilter);

  const total = filtered.length;

  const goNext = useCallback(() => setCurrent((p) => (p + 1) % Math.max(total, 1)), [total]);
  const goPrev = useCallback(() => setCurrent((p) => (p - 1 + Math.max(total, 1)) % Math.max(total, 1)), [total]);

  // Reset current index when filter changes or total changes
  useEffect(() => { setCurrent(0); }, [activeFilter]);
  useEffect(() => {
    if (total > 0 && current >= total) setCurrent(0);
  }, [total, current]);

  // Auto-carousel
  useEffect(() => {
    if (isHovered || total <= 1) return;
    intervalRef.current = setInterval(goNext, 5000);
    return () => clearInterval(intervalRef.current);
  }, [goNext, isHovered, total]);

  // Touch swipe
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  // Form validation
  const validateReview = (d) => {
    const e = {};
    if (!d.name?.trim())   e.name   = 'Name is required';
    if (!d.review?.trim()) e.review = 'Review text is required';
    if (!d.category)       e.category = 'Select a category';
    return e;
  };

  const handleFormSubmit = (ev) => {
    ev.preventDefault();
    const errs = validateReview(reviewDraft);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const newReview = {
      id: Date.now(),
      name: reviewDraft.name,
      category: reviewDraft.category,
      rating: reviewDraft.rating || 5,
      review: reviewDraft.review,
      date: new Date().toISOString().split('T')[0],
      avatar: null,
      verified: false,
    };
    // Send to owner dashboard as pending review
    addPendingReview(newReview);
    // Remove old localStorage approach
    setReviewDraft({ name: '', rating: 5, review: '', category: '' });
    setFormErrors({});
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  // Guard: agar current index out of range ho toh reset
  const safeIndex = total > 0 ? Math.min(current, total - 1) : 0;
  const currentReview = filtered[safeIndex];

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,168,67,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <ParticleSystem count={8} type="dot" />
        <SectionHeader
          sanskrit="प्रतिक्रिया"
          title="Student & Member"
          titleHighlight="Reviews"
          description="Hear from those who have experienced the transformation. Authentic voices from our yoga community."
        />
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Filter tabs ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter reviews">
          {CATEGORIES.map((cat) => (
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

      {/* ── Carousel ── */}
      <section
        className="max-w-3xl mx-auto px-4 sm:px-6 mb-16"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Reviews carousel"
        aria-live="polite"
      >
        {total === 0 ? (
          <div className="text-center py-16 text-cream/40">
            <p className="text-4xl mb-3">⭐</p>
            <p>No reviews in this category yet.</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {currentReview && (
                <motion.div
                  key={`${safeIndex}-${activeFilter}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MysticalCard className="p-8 sm:p-10 text-center" hoverLift={false}>
                    {/* Quote mark */}
                    <div className="text-gold/20 text-6xl font-serif leading-none mb-4 select-none" aria-hidden="true">"</div>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-5">
                      {[1,2,3,4,5].map((s) => (
                        <Star
                          key={s}
                          size={18}
                          className={s <= currentReview.rating ? 'text-gold fill-gold' : 'text-gold/20'}
                        />
                      ))}
                    </div>

                    <p className="text-cream/80 text-base sm:text-lg italic leading-relaxed font-serif mb-6">
                      {currentReview.review}
                    </p>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">
                        {currentReview.name?.[0] || '?'}
                      </div>
                      <p className="text-gold font-semibold text-sm">{currentReview.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gold/10 border border-gold/20 text-gold/70">
                          {currentReview.category}
                        </span>
                        {currentReview.verified && (
                          <span className="text-emerald-400 text-xs flex items-center gap-1">
                            <CheckCircle size={10} /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-cream/30 text-xs mt-1">{currentReview.date}</p>
                    </div>
                  </MysticalCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold/70 hover:bg-gold/10 hover:text-gold transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dots */}
              <div className="flex gap-2" role="tablist" aria-label="Review navigation">
                {Array.from({ length: Math.min(total, 8) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    role="tab"
                    aria-selected={current === i}
                    className={`rounded-full transition-all duration-300 ${
                      current === i ? 'w-5 h-2 bg-gold' : 'w-2 h-2 bg-gold/30'
                    }`}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold/70 hover:bg-gold/10 hover:text-gold transition-colors"
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      {/* ── Write a Review Form ── */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-8" aria-label="Write a review">
        <SectionHeader
          sanskrit="अपनी राय दें"
          title="Write a"
          titleHighlight="Review"
          description="Share your experience with the DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE) community."
        />

        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10"
        >
          <MysticalCard className="p-8">
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gold/15 border-2 border-gold/40 flex items-center justify-center mb-4">
                    <CheckCircle size={28} className="text-gold" />
                  </div>
                  <h4 className="font-serif text-xl text-cream font-bold mb-2">Thank You!</h4>
                  <p className="text-cream/55 text-sm">Your review has been added. 🙏</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleFormSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="r-name" className="block text-cream/60 text-xs uppercase tracking-wide mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="r-name"
                        type="text"
                        value={reviewDraft.name || ''}
                        onChange={(e) => setReviewDraft((d) => ({ ...d, name: e.target.value }))}
                        placeholder="Your name"
                        className={`input-field ${formErrors.name ? 'border-red-500/60' : ''}`}
                        aria-invalid={!!formErrors.name}
                      />
                      {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="r-category" className="block text-cream/60 text-xs uppercase tracking-wide mb-1.5">
                        Category *
                      </label>
                      <select
                        id="r-category"
                        value={reviewDraft.category || ''}
                        onChange={(e) => setReviewDraft((d) => ({ ...d, category: e.target.value }))}
                        className={`input-field ${formErrors.category ? 'border-red-500/60' : ''}`}
                        aria-invalid={!!formErrors.category}
                      >
                        <option value="">Select category…</option>
                        {CATEGORIES.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {formErrors.category && <p className="text-red-400 text-xs mt-1">{formErrors.category}</p>}
                    </div>
                  </div>

                  <div>
                    <p className="text-cream/60 text-xs uppercase tracking-wide mb-2">Your Rating *</p>
                    <StarRating
                      value={reviewDraft.rating || 5}
                      onChange={(v) => setReviewDraft((d) => ({ ...d, rating: v }))}
                      size={24}
                    />
                  </div>

                  <div>
                    <label htmlFor="r-review" className="block text-cream/60 text-xs uppercase tracking-wide mb-1.5">
                      Your Review *
                    </label>
                    <textarea
                      id="r-review"
                      rows={4}
                      value={reviewDraft.review || ''}
                      onChange={(e) => setReviewDraft((d) => ({ ...d, review: e.target.value }))}
                      placeholder="Share your experience with us…"
                      className={`input-field resize-none ${formErrors.review ? 'border-red-500/60' : ''}`}
                      aria-invalid={!!formErrors.review}
                    />
                    {formErrors.review && <p className="text-red-400 text-xs mt-1">{formErrors.review}</p>}
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center">
                    <Send size={15} /> Submit Review
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </MysticalCard>
        </motion.div>
      </section>
    </motion.main>
  );
}
