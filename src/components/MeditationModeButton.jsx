import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function MeditationModeButton() {
  const { meditationMode, toggleMeditationMode } = useApp();

  return (
    <motion.button
      onClick={toggleMeditationMode}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-500 border ${
        meditationMode
          ? 'bg-gold/20 border-gold/50 text-gold'
          : 'bg-charcoal/50 border-gold/20 text-cream/60 hover:border-gold/40 hover:text-cream/80'
      }`}
      aria-pressed={meditationMode}
      aria-label={meditationMode ? 'Exit Meditation Mode' : 'Enter Meditation Mode'}
    >
      <span className="text-base" aria-hidden="true">{meditationMode ? '🌙' : '🧘'}</span>
      {meditationMode ? 'Exit Meditation Mode' : 'Enter Meditation Mode'}
    </motion.button>
  );
}
