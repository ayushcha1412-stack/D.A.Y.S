import { motion } from 'framer-motion';
import { scaleIn } from '../utils/animations';

/**
 * Reusable ancient-style mystical card with gold border corners and hover glow.
 */
export default function MysticalCard({
  children,
  className = '',
  hoverLift = true,
  delay = 0,
  onClick,
  role,
  tabIndex,
  'aria-label': ariaLabel,
}) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay }}
      whileHover={hoverLift ? { y: -6, scale: 1.015 } : undefined}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={`mystical-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ outline: 'none' }}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {/* Corner ornaments */}
      <span
        className="absolute top-0 left-0 w-4 h-4 pointer-events-none"
        style={{
          borderTop: '1.5px solid rgba(212,168,67,0.7)',
          borderLeft: '1.5px solid rgba(212,168,67,0.7)',
        }}
        aria-hidden="true"
      />
      <span
        className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
        style={{
          borderTop: '1.5px solid rgba(212,168,67,0.7)',
          borderRight: '1.5px solid rgba(212,168,67,0.7)',
        }}
        aria-hidden="true"
      />
      <span
        className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none"
        style={{
          borderBottom: '1.5px solid rgba(212,168,67,0.7)',
          borderLeft: '1.5px solid rgba(212,168,67,0.7)',
        }}
        aria-hidden="true"
      />
      <span
        className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none"
        style={{
          borderBottom: '1.5px solid rgba(212,168,67,0.7)',
          borderRight: '1.5px solid rgba(212,168,67,0.7)',
        }}
        aria-hidden="true"
      />

      {children}
    </motion.div>
  );
}
