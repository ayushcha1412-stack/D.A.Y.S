import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Smooth scroll to the #connect anchor in the footer ─────────────────────
function scrollToConnect(e) {
  e.preventDefault();
  const el = document.getElementById('connect');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    // Not on the same page yet — navigate home then scroll after render
    window.location.href = '/#connect';
  }
}

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

              {/* Connect With Us */}
              <button
                onClick={scrollToConnect}
                className="nav-link px-3 py-2 rounded-md text-xs font-medium tracking-wide text-cream/75 hover:text-gold transition-colors duration-200 flex items-center gap-1.5"
                aria-label="Scroll to social media links"
              >
                <span className="text-gold/60">✦</span>
                Connect
              </button>
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

                {/* Social links in mobile drawer */}
                <div className="mt-5">
                  <p className="text-gold/50 text-xs tracking-[0.3em] uppercase text-center mb-3">Connect With Us</p>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {[
                      { id: 'yt',  href: 'https://youtube.com/@anyogainstitute?si=Brb66ZglZk4t934c',                       label: 'YouTube',   color: '#FF0000', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                      { id: 'fb',  href: 'https://www.facebook.com/profile.php?id=100071712365099',                         label: 'Facebook',  color: '#1877F2', path: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z' },
                      { id: 'tw',  href: 'https://x.com/anyogainstitute',                                                   label: 'X',         color: '#e7e9ea', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z' },
                      { id: 'tg',  href: 'https://t.me/+hkbqbbDBm9E1ZGI1',                                                 label: 'Telegram',  color: '#2AABEE', path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' },
                      { id: 'wa',  href: 'https://whatsapp.com/channel/0029Vb9FX423AzNKZLNwZS1w',                          label: 'WhatsApp',  color: '#25D366', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
                      { id: 'ig',  href: 'https://www.instagram.com/_anyogainstitute?igsh=NnAxeTVhY2E0bmdx',                label: 'Instagram', color: '#E1306C', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                    ].map(s => (
                      <a
                        key={s.id}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className="w-9 h-9 rounded-full flex items-center justify-center border border-gold/20 bg-white/4 text-cream/50 hover:border-gold/40 transition-all duration-200"
                        style={{ '--c': s.color }}
                        onMouseEnter={e => { e.currentTarget.style.color = s.color; e.currentTarget.style.borderColor = s.color + '60'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                          <path d={s.path} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>

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
