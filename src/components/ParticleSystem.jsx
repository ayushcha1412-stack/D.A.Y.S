import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Floating ambient particles / golden dust.
 * Renders fewer particles on mobile and respects reduced motion.
 */
export default function ParticleSystem({
  count = 18,
  className = '',
  color = 'rgba(212,168,67,',
  type = 'dot', // 'dot' | 'leaf' | 'lotus'
}) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const actualCount = isMobile ? Math.floor(count / 2) : count;

  const particles = useMemo(
    () =>
      Array.from({ length: actualCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 10,
        duration: Math.random() * 10 + 10,
        opacity: Math.random() * 0.5 + 0.15,
        drift: (Math.random() - 0.5) * 80,
      })),
    [actualCount]
  );

  if (prefersReducedMotion) return null;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-20px',
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -(window.innerHeight + 100)],
            x: [0, p.drift],
            opacity: [0, p.opacity, p.opacity, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {type === 'dot' && (
            <div
              className="rounded-full"
              style={{
                width: '100%',
                height: '100%',
                background: `${color}${p.opacity})`,
                boxShadow: `0 0 ${p.size * 2}px ${color}0.4)`,
              }}
            />
          )}
          {type === 'leaf' && (
            <svg viewBox="0 0 20 30" width={p.size * 2.5} height={p.size * 3.5}>
              <path
                d="M10 2 C16 8, 18 18, 10 28 C2 18, 4 8, 10 2Z"
                fill={`${color}${p.opacity * 0.8})`}
                stroke={`${color}${p.opacity})`}
                strokeWidth="0.5"
              />
            </svg>
          )}
          {type === 'lotus' && (
            <svg viewBox="0 0 24 24" width={p.size * 3} height={p.size * 3}>
              <ellipse cx="12" cy="16" rx="4" ry="7" fill={`${color}${p.opacity * 0.6})`} transform="rotate(-30 12 16)" />
              <ellipse cx="12" cy="16" rx="4" ry="7" fill={`${color}${p.opacity * 0.6})`} />
              <ellipse cx="12" cy="16" rx="4" ry="7" fill={`${color}${p.opacity * 0.6})`} transform="rotate(30 12 16)" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
