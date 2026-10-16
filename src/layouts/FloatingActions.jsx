import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, UserPlus, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.522 5.857L0 24l6.335-1.507A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.044-1.39l-.361-.215-3.763.895.938-3.671-.235-.376A9.808 9.808 0 012.182 12C2.182 6.562 6.562 2.182 12 2.182S21.818 6.562 21.818 12 17.438 21.818 12 21.818z" />
  </svg>
);

export default function FloatingActions() {
  const { siteContact, setDashOpen } = useApp();
  const whatsapp = siteContact?.whatsapp || '8127227284';
  const phone    = siteContact?.phones?.[0] || '6386659500';

  // Secret 5-tap counter on the toggle button to open owner dashboard
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState(null);
  const handleSecretTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    if (tapTimer) clearTimeout(tapTimer);
    if (next >= 5) { setTapCount(0); setDashOpen(true); return; }
    setTapTimer(setTimeout(() => setTapCount(0), 2000));
  };

  const actions = [
    {
      id: 'whatsapp',
      label: 'Chat With Us',
      icon: <WhatsAppIcon />,
      color: 'bg-green-600 hover:bg-green-500',
      href: `https://wa.me/91${whatsapp}?text=Namaste! I would like to know more about yoga classes.`,
      external: true,
    },
    {
      id: 'call',
      label: 'Call Now',
      icon: <Phone size={18} />,
      color: 'bg-emerald-mid hover:bg-emerald-light',
      href: `tel:+91${phone}`,
      external: true,
    },
    {
      id: 'join',
      label: 'Join Now',
      icon: <UserPlus size={18} />,
      color: 'bg-gold hover:bg-gold-light',
      to: '/membership',
      external: false,
    },
  ];

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded &&
          actions.map((action, i) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.5, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 20 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-2"
            >
              {/* Label */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.1 }}
                className="px-3 py-1.5 rounded-lg glass-panel text-cream text-xs font-medium whitespace-nowrap shadow-mystical"
              >
                {action.label}
              </motion.span>

              {/* Button */}
              {action.external ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={action.label}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 ${action.color}`}
                >
                  {action.icon}
                </a>
              ) : (
                <Link
                  to={action.to}
                  aria-label={action.label}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-charcoal shadow-lg transition-all duration-200 font-bold ${action.color}`}
                >
                  {action.icon}
                </Link>
              )}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Toggle button — tap 5× quickly to open owner dashboard */}
      <motion.button
        onClick={() => { setExpanded((prev) => !prev); handleSecretTap(); }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={expanded ? 'Close quick actions' : 'Open quick actions'}
        className="w-13 h-13 w-14 h-14 rounded-full flex items-center justify-center text-charcoal font-bold shadow-gold animate-pulse-gold"
        style={{
          background: 'linear-gradient(135deg, #f5d98b, #d4a843)',
        }}
      >
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {expanded ? <X size={22} /> : <Plus size={22} />}
        </motion.span>
      </motion.button>
    </div>
  );
}
