import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navLinks = [
  { to: '/',             label: 'Home' },
  { to: '/facilitators', label: 'Facilitators' },
  { to: '/classes',      label: 'Classes' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/expertise',    label: 'Our Expertise' },
  { to: '/about',        label: 'About' },
  { to: '/contact',      label: 'Contact' },
  { to: '/reviews',      label: 'Reviews' },
  { to: '/gallery',      label: 'Gallery' },
  { to: '/membership',   label: 'Membership' },
  { to: '/plans',        label: 'Plans' },
];

export default function Navbar() {
  const { scrolled } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-charcoal/95 backdrop-blur-md shadow-lg border-b border-gold/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="Home">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-9 h-9 rounded-full overflow-hidden border border-gold/30 shrink-0"
              >
                <img
                  src="/images/logo.png"
                  alt="DIVY ASHISH YOGA SANSTHAN logo"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </motion.div>
              <div className="hidden sm:block">
                <p className="text-gold font-serif font-bold text-sm leading-tight tracking-wide">
                  DIVY ASHISH YOGA SANSTHAN
                </p>
                <p className="text-cream/50 text-xs tracking-widest uppercase leading-tight">
                  (AN YOGA INSTITUTE)
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 8).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-md text-xs font-medium tracking-wide transition-all duration-200 ${
                      isActive ? 'text-gold' : 'text-cream/75 hover:text-gold'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative">
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                        />
                      )}
                    </span>
                  )}
                </NavLink>
              ))}
              {/* More dropdown for gallery, membership, plans */}
              <MoreMenu links={navLinks.slice(8)} />
            </div>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <Link
                to="/membership"
                className="hidden md:inline-flex btn-primary text-xs px-5 py-2.5"
              >
                Join Today
              </Link>
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2 text-cream/80 hover:text-gold transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-charcoal border-l border-gold/15 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
                <div>
                  <p className="text-gold font-serif font-bold text-sm">DIVY ASHISH YOGA SANSTHAN</p>
                  <p className="text-cream/40 text-xs tracking-widest">(AN YOGA INSTITUTE)</p>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-cream/60 hover:text-gold"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gold/15 text-gold border-l-2 border-gold'
                            : 'text-cream/70 hover:text-gold hover:bg-gold/8'
                        }`
                      }
                    >
                      <Leaf size={14} className="text-gold/50" />
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Footer CTA */}
              <div className="px-6 py-5 border-t border-gold/10">
                <Link to="/membership" className="btn-primary w-full justify-center text-sm">
                  Join Today
                </Link>
                <div className="section-divider mt-4 mb-2">
                  <img src="/images/logo.png" alt="DAYS logo" className="w-8 h-8 rounded-full object-cover mx-auto opacity-50" />
                </div>
                <p className="text-cream/30 text-xs text-center font-devanagari">
                  एक कदम अपने और अपनों के स्वास्थ्य की ओर
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MoreMenu({ links }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="nav-link px-3 py-2 rounded-md text-xs font-medium tracking-wide text-cream/75 hover:text-gold">
        More ▾
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-1 py-2 w-44 glass-panel rounded-lg border border-gold/20 shadow-mystical"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-xs font-medium transition-colors duration-150 ${
                    isActive ? 'text-gold bg-gold/10' : 'text-cream/70 hover:text-gold hover:bg-gold/8'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
