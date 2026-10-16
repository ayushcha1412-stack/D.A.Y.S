import { motion } from 'framer-motion';
import { fadeUp, staggerChildren } from '../utils/animations';

/**
 * Reusable section header with Sanskrit sub-label, title and description.
 */
export default function SectionHeader({
  sanskrit,
  title,
  titleHighlight,
  description,
  centered = true,
  className = '',
}) {
  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`${centered ? 'text-center' : ''} ${className}`}
    >
      {sanskrit && (
        <motion.p
          variants={fadeUp}
          className="text-gold/60 text-xs font-devanagari tracking-[0.3em] uppercase mb-3 select-none"
        >
          {sanskrit}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight"
      >
        {titleHighlight ? (
          <>
            {title}{' '}
            <span className="text-gold-gradient">{titleHighlight}</span>
          </>
        ) : (
          title
        )}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={`mt-4 text-cream/60 text-base sm:text-lg leading-relaxed max-w-2xl ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
