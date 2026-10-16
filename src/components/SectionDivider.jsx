import { motion } from 'framer-motion';

/**
 * Ancient-style section divider with OM symbol.
 * @param {string} symbol  - center symbol (default ✦ ॐ ✦)
 * @param {string} className
 */
export default function SectionDivider({ symbol = '✦ ॐ ✦', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.4 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-4 my-10 ${className}`}
    >
      <span
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45), transparent)' }}
      />
      <span className="text-gold/70 text-sm font-devanagari tracking-widest select-none whitespace-nowrap">
        {symbol}
      </span>
      <span
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45), transparent)' }}
      />
    </motion.div>
  );
}
