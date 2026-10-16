// ─── Framer Motion reusable animation variants ───────────────────────────────

export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const fadeDown = {
  hidden:  { opacity: 0, y: -30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleInBounce = {
  hidden:  { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

export const slideLeft = {
  hidden:  { opacity: 0, x: 60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideRight = {
  hidden:  { opacity: 0, x: -60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerChildren = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const staggerFast = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, y: -10,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

export const cardHover = {
  rest:  { scale: 1,    y: 0,  transition: { duration: 0.3, ease: 'easeOut' } },
  hover: { scale: 1.02, y: -6, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const glowHover = {
  rest:  { boxShadow: '0 0 0px rgba(212,168,67,0)' },
  hover: { boxShadow: '0 0 30px rgba(212,168,67,0.4)' },
};

export const floatAnimation = {
  animate: {
    y: [0, -18, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const orbRotate = {
  animate: {
    rotate: 360,
    transition: { duration: 30, repeat: Infinity, ease: 'linear' },
  },
};

export const orbRotateReverse = {
  animate: {
    rotate: -360,
    transition: { duration: 45, repeat: Infinity, ease: 'linear' },
  },
};

export const breatheAnim = {
  animate: {
    scale: [1, 1.06, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const shimmerVariant = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 2.5, repeat: Infinity, ease: 'linear' },
  },
};

// Stagger delay helper
export const delay = (d) => ({
  hidden:  { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  },
});
