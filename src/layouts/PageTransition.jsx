import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.28, ease: 'easeIn' },
  },
};

// Golden transition line
const lineVariants = {
  initial: { scaleX: 0, opacity: 1 },
  animate: { scaleX: 0, opacity: 1 },
  exit: {
    scaleX: [0, 1, 1, 0],
    opacity: [0, 1, 1, 0],
    transition: { duration: 0.6, times: [0, 0.3, 0.7, 1] },
  },
};

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {/* Golden line at top during transition */}
        <motion.div
          variants={lineVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed top-0 left-0 right-0 h-0.5 z-[100] origin-left"
          style={{ background: 'linear-gradient(90deg, transparent, #d4a843, transparent)' }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
