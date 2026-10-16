import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   High-quality Buddha image sources (Unsplash CDN, free to use)
   Multiple fallbacks so at least one will load.
   Photo credits: Unsplash contributors (free licence)
───────────────────────────────────────────────────────────── */
const BUDDHA_IMAGES = [
  // Golden meditating Buddha statue — close up, warm light
  'blob:https://web.whatsapp.com/a8f36359-5b18-4115-92fb-225cd895df5a',
  // Buddha face — serene, golden
  'https://images.unsplash.com/photo-1524614338594-1b0b20d91e0c?w=700&q=90&auto=format&fit=crop',
  // Golden temple Buddha
  'https://images.unsplash.com/photo-1567604486906-ee9e8e4c23b2?w=700&q=90&auto=format&fit=crop',
];

/* ─────────────────────────────────────────────────────────────
   Floating particle
───────────────────────────────────────────────────────────── */
function Particle({ x, y, size, delay, duration, drift }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top:  `${y}%`,
        width:  size,
        height: size,
        background:
          'radial-gradient(circle, rgba(245,217,139,0.95) 0%, rgba(212,168,67,0.4) 55%, transparent 100%)',
        boxShadow: `0 0 ${size * 2}px rgba(212,168,67,0.7)`,
      }}
      initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.7, 0],
        y:       [0, -(50 + Math.random() * 80)],
        x:       [0, drift],
        scale:   [0, 1.3, 0.9, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Light ray
───────────────────────────────────────────────────────────── */
function LightRay({ angle, delay, length = '42vh', opacity = 0.55 }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 origin-bottom pointer-events-none"
      style={{
        width: 1.5,
        height: length,
        marginLeft: -0.75,
        marginTop: `-${length}`,
        rotate: `${angle}deg`,
        background: `linear-gradient(to top, rgba(212,168,67,${opacity}) 0%, rgba(245,217,139,0.06) 70%, transparent 100%)`,
        borderRadius: 2,
      }}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: [0, 0.8, 0.5, 0.8], scaleY: [0, 1, 0.9, 1] }}
      transition={{ duration: 2.8, delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Particle config
───────────────────────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  id:       i,
  x:        12 + Math.random() * 76,
  y:        20 + Math.random() * 60,
  size:     1.5 + Math.random() * 4,
  delay:    Math.random() * 4,
  duration: 3.5 + Math.random() * 3.5,
  drift:    -25 + Math.random() * 50,
}));

const RAYS = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];

/* ─────────────────────────────────────────────────────────────
   Fallback SVG — only shown if all images fail to load
───────────────────────────────────────────────────────────── */
function BuddhaFallbackSVG() {
  return (
    <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-label="Buddha silhouette">
      <defs>
        <linearGradient id="fg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#f5d98b" stopOpacity="0.95" />
          <stop offset="50%"  stopColor="#d4a843" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7a5a18" stopOpacity="0.75" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
        <filter id="hb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
      </defs>
      {/* halo */}
      <circle cx="100" cy="72" r="46" fill="rgba(212,168,67,0.1)" filter="url(#hb)" />
      <circle cx="100" cy="72" r="44" fill="none" stroke="rgba(212,168,67,0.4)" strokeWidth="1" />
      {[0,45,90,135,180,225,270,315].map(d=>{const r=d*Math.PI/180;return(<line key={d} x1={100+10*Math.cos(r)} y1={72+10*Math.sin(r)} x2={100+40*Math.cos(r)} y2={72+40*Math.sin(r)} stroke="rgba(212,168,67,0.2)" strokeWidth="0.5"/>);})}
      {/* ushnisha */}
      <ellipse cx="100" cy="33" rx="10" ry="13" fill="url(#fg)" filter="url(#glow)" />
      {/* head */}
      <ellipse cx="100" cy="58" rx="22" ry="24" fill="url(#fg)" filter="url(#glow)" />
      {/* eyes closed */}
      <path d="M91 57 Q95 54 99 57" fill="none" stroke="rgba(70,40,8,0.7)" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M101 57 Q105 54 109 57" fill="none" stroke="rgba(70,40,8,0.7)" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="100" cy="52" r="1.2" fill="rgba(245,217,139,0.9)"/>
      <path d="M95 66 Q100 70 105 66" fill="none" stroke="rgba(70,40,8,0.45)" strokeWidth="0.9" strokeLinecap="round"/>
      {/* ears */}
      <ellipse cx="78" cy="60" rx="4" ry="7" fill="url(#fg)"/>
      <ellipse cx="122" cy="60" rx="4" ry="7" fill="url(#fg)"/>
      {/* neck */}
      <rect x="94" y="80" width="12" height="10" rx="4" fill="url(#fg)"/>
      {/* body */}
      <path d="M80 90 C65 100 50 118 44 148 C40 165 38 190 40 218 L160 218 C162 190 160 165 156 148 C150 118 135 100 120 90 C113 87 106 85 100 85 C94 85 87 87 80 90 Z" fill="url(#fg)" filter="url(#glow)"/>
      {/* arms */}
      <path d="M62 140 C54 155 50 172 52 186 C53 196 60 204 72 210 L80 212" fill="none" stroke="url(#fg)" strokeWidth="16" strokeLinecap="round" filter="url(#glow)"/>
      <path d="M138 140 C146 155 150 172 148 186 C147 196 140 204 128 210 L120 212" fill="none" stroke="url(#fg)" strokeWidth="16" strokeLinecap="round" filter="url(#glow)"/>
      {/* hands + lotus base */}
      <ellipse cx="100" cy="218" rx="28" ry="8" fill="url(#fg)" filter="url(#glow)"/>
      {[-36,-18,0,18,36].map((dx,i)=>(<ellipse key={i} cx={100+dx} cy="236" rx="10" ry="13" fill="rgba(212,168,67,0.2)" stroke="rgba(212,168,67,0.45)" strokeWidth="0.7"/>))}
      <ellipse cx="100" cy="242" rx="20" ry="7" fill="rgba(212,168,67,0.28)" stroke="rgba(212,168,67,0.55)" strokeWidth="0.9"/>
      {/* ground glow */}
      <ellipse cx="100" cy="254" rx="58" ry="8" fill="url(#fg)" opacity="0.18"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main BuddhaLoader
   Phase timeline:
     0.0s  dark bg + rays visible
     0.5s  → 'image' : Buddha photo rises with glow
     2.2s  → 'title' : text fades in
     5.2s  → 'fade'  : cinematic fade-out
     6.5s  → onComplete fires
───────────────────────────────────────────────────────────── */
export default function BuddhaLoader({ onComplete }) {
  const [phase, setPhase]         = useState('rays');
  const [imgSrc, setImgSrc]       = useState(BUDDHA_IMAGES[0]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const imgIndexRef = useRef(0);
  const calledRef   = useRef(false);

  /* Phase timers */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('image'), 500);
    const t2 = setTimeout(() => setPhase('title'), 2200);
    const t3 = setTimeout(() => setPhase('fade'),  5200);
    const t4 = setTimeout(() => {
      if (!calledRef.current) { calledRef.current = true; onComplete?.(); }
    }, 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  /* Try next image on error */
  const handleImgError = () => {
    const next = imgIndexRef.current + 1;
    if (next < BUDDHA_IMAGES.length) {
      imgIndexRef.current = next;
      setImgSrc(BUDDHA_IMAGES[next]);
    } else {
      setUseFallback(true);
    }
  };

  const showVisual = phase === 'image' || phase === 'title' || phase === 'fade';
  const showTitle  = phase === 'title'  || phase === 'fade';
  const isFading   = phase === 'fade';

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="buddha-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 60%, #0d2618 0%, #06100a 50%, #020704 100%)',
          }}
          role="status"
          aria-label="Loading — Buddha meditation animation"
        >
          {/* Deep vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(ellipse 65% 75% at 50% 48%, transparent 35%, rgba(1,4,2,0.9) 100%)',
            }}
          />

          {/* Cinematic letterbox bars */}
          <motion.div
            className="absolute top-0 left-0 right-0 pointer-events-none z-20"
            style={{ height: '7vh', background: 'rgba(1,4,2,0.95)' }}
            initial={{ scaleY: 1 }}
            animate={isFading ? { scaleY: 0 } : { scaleY: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-20"
            style={{ height: '7vh', background: 'rgba(1,4,2,0.95)' }}
            initial={{ scaleY: 1 }}
            animate={isFading ? { scaleY: 0 } : { scaleY: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          {/* ── Light rays ── */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {RAYS.map((angle, i) => (
              <LightRay key={angle} angle={angle} delay={i * 0.06} />
            ))}
          </div>

          {/* ── Floating particles ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {PARTICLES.map((p) => <Particle key={p.id} {...p} />)}
          </div>

          {/* ── Central ambient glow (behind Buddha) ── */}
          <motion.div
            className="absolute pointer-events-none z-0"
            style={{
              width: '55vmin',
              height: '55vmin',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(212,168,67,0.16) 0%, rgba(17,80,50,0.07) 45%, transparent 70%)',
              filter: 'blur(30px)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Buddha image / fallback SVG ── */}
          <AnimatePresence>
            {showVisual && (
              <motion.div
                key="buddha-visual"
                initial={{ opacity: 0, y: 32, scale: 0.9 }}
                animate={
                  isFading
                    ? { opacity: 0, y: -24, scale: 1.05 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                transition={
                  isFading
                    ? { duration: 1.3, ease: [0.4, 0, 0.2, 1] }
                    : { duration: 1.6, ease: [0.16, 1, 0.3, 1] }
                }
                className="relative z-10 flex items-end justify-center"
                style={{
                  width:  'clamp(180px, 32vmin, 300px)',
                  height: 'clamp(220px, 42vmin, 380px)',
                }}
              >
                {/* Outer halo ring */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    inset: '-20%',
                    borderRadius: '50%',
                    border: '1px solid rgba(212,168,67,0.18)',
                    boxShadow: '0 0 60px rgba(212,168,67,0.12), inset 0 0 40px rgba(212,168,67,0.06)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                />
                {/* Inner halo ring — reverse */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    inset: '-10%',
                    borderRadius: '50%',
                    border: '0.5px dashed rgba(212,168,67,0.12)',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                />

                {/* Breathing glow behind figure */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '50% 50% 45% 45%',
                    background: 'radial-gradient(ellipse 70% 80% at 50% 40%, rgba(212,168,67,0.28) 0%, rgba(17,80,50,0.12) 50%, transparent 75%)',
                    filter: 'blur(22px)',
                    zIndex: -1,
                  }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.08, 0.95] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Floor glow */}
                <div
                  className="absolute bottom-0 left-1/2 pointer-events-none"
                  style={{
                    transform: 'translateX(-50%)',
                    width: '140%',
                    height: 60,
                    background: 'radial-gradient(ellipse, rgba(212,168,67,0.22) 0%, transparent 70%)',
                    filter: 'blur(14px)',
                    zIndex: -1,
                  }}
                />

                {/* ── The actual image ── */}
                {!useFallback ? (
                  <>
                    {/* Shimmer placeholder while loading */}
                    {!imgLoaded && (
                      <div
                        className="absolute inset-0 rounded-2xl shimmer-bg"
                        style={{ background: 'rgba(212,168,67,0.06)' }}
                      />
                    )}
                    <img
                      key={imgSrc}
                      src={imgSrc}
                      alt="Buddha Ji — peaceful meditation"
                      onLoad={() => setImgLoaded(true)}
                      onError={handleImgError}
                      className="w-full h-full rounded-2xl"
                      style={{
                        objectFit:     'cover',
                        objectPosition: 'center top',
                        opacity: imgLoaded ? 1 : 0,
                        transition: 'opacity 0.8s ease',
                        /* Cinematic colour grading */
                        filter: 'contrast(1.08) brightness(0.92) saturate(1.12) sepia(0.12)',
                        /* Gold-tinted shadow border */
                        boxShadow: '0 0 0 1px rgba(212,168,67,0.2), 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(212,168,67,0.18)',
                      }}
                      draggable={false}
                    />

                    {/* Gold gradient overlay on image — top dark, bottom fade */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(2,8,4,0.45) 0%, transparent 30%, transparent 55%, rgba(2,8,4,0.82) 100%)',
                      }}
                    />
                    {/* Subtle gold sheen */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212,168,67,0.07) 0%, transparent 50%, rgba(212,168,67,0.04) 100%)',
                      }}
                    />
                  </>
                ) : (
                  /* SVG fallback if no images loaded */
                  <BuddhaFallbackSVG />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Text block ── */}
          <AnimatePresence>
            {showTitle && !isFading && (
              <motion.div
                key="loader-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center mt-5 px-6"
              >
                {/* Sanskrit */}
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '0.15em' }}
                  animate={{ opacity: 0.6, letterSpacing: '0.45em' }}
                  transition={{ duration: 1.4, delay: 0.1 }}
                  className="text-gold text-xs uppercase font-devanagari mb-2"
                >
                  शान्ति · ज्ञान · योग
                </motion.p>

                {/* Gold line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                  className="mx-auto mb-3"
                  style={{
                    width: 80,
                    height: 1,
                    background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.8), transparent)',
                    transformOrigin: 'center',
                  }}
                />

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="font-serif font-bold text-cream tracking-wide"
                  style={{ fontSize: 'clamp(12px, 2.1vw, 17px)', letterSpacing: '0.12em' }}
                >
                  DIVY ASHISH YOGA SANSTHAN
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.8, delay: 0.45 }}
                  className="text-gold text-xs tracking-[0.32em] uppercase mt-1"
                >
                  (AN YOGA INSTITUTE)
                </motion.p>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.38 }}
                  transition={{ duration: 0.9, delay: 0.75 }}
                  className="text-cream text-xs mt-3 font-devanagari tracking-wide italic"
                >
                  एक कदम अपने और अपनों के स्वास्थ्य की ओर
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Progress bar ── */}
          <AnimatePresence>
            {!isFading && (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
                style={{ width: 'clamp(90px, 16vw, 140px)' }}
              >
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 1.5, background: 'rgba(212,168,67,0.12)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        'linear-gradient(to right, rgba(212,168,67,0.3), rgba(245,217,139,1), rgba(212,168,67,0.3))',
                      boxShadow: '0 0 8px rgba(212,168,67,0.6)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5.5, ease: [0.1, 0.4, 0.6, 1] }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
