import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCounter } from '../hooks/useCounter';

/**
 * Animated number counter that starts when scrolled into view.
 * @param {number|string} value  - target value (number) or string like "500+"
 * @param {string} suffix        - appended after number ("+", "%", etc.)
 * @param {string} label
 * @param {string} icon
 */
export default function AnimatedCounter({ value, suffix = '', label, icon, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // Parse numeric value from strings like "500+" or "[X]+"
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
  const isPlaceholder = typeof value === 'string' && value.startsWith('[');

  const count = useCounter(numericValue, 2000, inView && !isPlaceholder);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center ${className}`}
    >
      {icon && (
        <span className="text-3xl mb-2 block" aria-hidden="true">{icon}</span>
      )}
      <div className="font-serif text-4xl lg:text-5xl font-bold text-gold-gradient">
        {isPlaceholder ? value : `${count}${suffix}`}
      </div>
      {label && (
        <p className="text-cream/60 text-sm mt-1.5 font-medium tracking-wide">{label}</p>
      )}
    </motion.div>
  );
}
