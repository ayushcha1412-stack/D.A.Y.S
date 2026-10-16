import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wheelNodes } from '../data/expertise';

const NODE_COLORS = [
  'rgba(212,168,67,0.9)',   // BODY
  'rgba(82,160,82,0.9)',    // BREATH
  'rgba(212,168,67,0.9)',   // MIND
  'rgba(23,110,82,0.9)',    // ENERGY
  'rgba(212,168,67,0.9)',   // BALANCE
];

const BG_COLORS = [
  'rgba(212,168,67,0.05)',
  'rgba(82,160,82,0.05)',
  'rgba(212,168,67,0.05)',
  'rgba(23,110,82,0.05)',
  'rgba(10,61,46,0.1)',
];

export default function InnerBalanceWheel() {
  const [active, setActive] = useState(null);

  const activeNode = active !== null ? wheelNodes[active] : null;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 justify-center">
      {/* ── Wheel ── */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 shrink-0" role="group" aria-label="Inner balance wheel">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-gold/15"
          aria-hidden="true"
        />
        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border border-gold/10"
          aria-hidden="true"
        />

        {/* Spoke lines */}
        {wheelNodes.map((_, i) => {
          const angle = (i / wheelNodes.length) * 360 - 90;
          const rad   = (angle * Math.PI) / 180;
          const cx    = 50;
          const cy    = 50;
          const r     = 44;
          const x2    = cx + r * Math.cos(rad);
          const y2    = cy + r * Math.sin(rad);
          return (
            <svg
              key={i}
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              aria-hidden="true"
            >
              <line
                x1={cx} y1={cy} x2={x2} y2={y2}
                stroke="#d4a843"
                strokeWidth="0.5"
              />
            </svg>
          );
        })}

        {/* Center orb */}
        <motion.button
          onClick={() => setActive(null)}
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.25) 0%, rgba(17,92,69,0.1) 60%, transparent 100%)',
            boxShadow: '0 0 30px rgba(212,168,67,0.3)',
          }}
          aria-label="Center - reset selection"
        >
          <span className="text-gold text-2xl font-devanagari leading-none">ॐ</span>
        </motion.button>

        {/* Nodes */}
        {wheelNodes.map((node, i) => {
          const angle = (i / wheelNodes.length) * 360 - 90;
          const rad   = (angle * Math.PI) / 180;
          const r     = 42;
          const cx    = 50;
          const cy    = 50;
          const pct_x = cx + r * Math.cos(rad);
          const pct_y = cy + r * Math.sin(rad);
          const isActive = active === i;

          return (
            <motion.button
              key={i}
              onClick={() => setActive(isActive ? null : i)}
              animate={isActive ? { scale: 1.2 } : { scale: 1 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full"
              style={{
                left: `${pct_x}%`,
                top:  `${pct_y}%`,
              }}
              aria-pressed={isActive}
              aria-label={`${node.label} — ${isActive ? 'collapse' : 'expand'}`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold tracking-wider transition-all duration-300 border"
                style={{
                  background: isActive
                    ? `radial-gradient(ellipse, ${NODE_COLORS[i].replace('0.9','0.2')} 0%, ${NODE_COLORS[i].replace('0.9','0.05')} 100%)`
                    : 'rgba(10,30,20,0.8)',
                  borderColor: isActive ? NODE_COLORS[i] : 'rgba(212,168,67,0.3)',
                  color: NODE_COLORS[i],
                  boxShadow: isActive ? `0 0 20px ${NODE_COLORS[i].replace('0.9','0.4')}` : 'none',
                }}
              >
                <span className="text-center leading-tight text-[10px]">{node.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Description panel ── */}
      <div className="flex-1 max-w-sm lg:max-w-md">
        <AnimatePresence mode="wait">
          {activeNode ? (
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mystical-card p-8"
              style={{ background: BG_COLORS[active] }}
            >
              <p className="text-gold/50 text-xs tracking-widest uppercase mb-2 font-devanagari">
                अन्वेषण करें
              </p>
              <h3
                className="font-serif text-3xl font-bold mb-4"
                style={{ color: NODE_COLORS[active] }}
              >
                {activeNode.label}
              </h3>
              <p className="text-cream/70 text-base leading-relaxed">
                {activeNode.description}
              </p>
              <div
                className="mt-6 h-px w-16"
                style={{ background: `linear-gradient(to right, ${NODE_COLORS[active]}, transparent)` }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center lg:text-left"
            >
              <p className="text-gold/40 text-xs tracking-widest uppercase mb-4 font-devanagari">
                Hover or tap a node to explore
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream mb-4">
                The Five Pillars of{' '}
                <span className="text-gold-gradient">Yoga Balance</span>
              </h3>
              <p className="text-cream/55 text-sm leading-relaxed">
                True yoga is not just physical — it is a complete science of holistic living.
                Explore each dimension of the practice by interacting with the wheel.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                {wheelNodes.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="px-3 py-1.5 rounded-full text-xs border border-gold/20 text-cream/50 hover:border-gold/50 hover:text-gold transition-all"
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
