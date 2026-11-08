import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Globe, MapPin, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren } from '../utils/animations';

// ── Social icon map (icons are SVG — can't store in MongoDB) ─────────────────
const SOCIAL_ICONS = {
  Facebook: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  'X / Twitter': (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  ),
  Telegram: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  'WhatsApp Channel': (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

// Fallback icon for unknown social platforms
const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const quickLinks = [
  { to: '/',             label: 'Home' },
  { to: '/facilitators', label: 'Facilitators' },
  { to: '/classes',      label: 'Classes' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/expertise',    label: 'Our Expertise' },
  { to: '/about',        label: 'About' },
  { to: '/contact',      label: 'Contact' },
  { to: '/reviews',      label: 'Reviews' },
];

// Static fallback services (shown if siteContact.services is empty)
const fallbackServices = [
  'Personal Yoga', 'Group Yoga', 'Online Yoga',
  'Yogasana Sports', 'Wellness Programs', 'Yoga Nidra',
];

export default function Footer() {
  const { siteContact: contactInfo } = useApp();

  // Social links from admin dashboard (embedded in siteContact by /api/config)
  // Fall back to empty array — footer still renders without social icons
  const liveSocials = Array.isArray(contactInfo?.socials)
    ? contactInfo.socials.filter(s => s.isActive !== false)
    : [];

  // Services list from admin dashboard SiteConfig
  const services = Array.isArray(contactInfo?.services) && contactInfo.services.length > 0
    ? contactInfo.services.slice(0, 6)   // show first 6 to keep footer compact
    : fallbackServices;

  return (
    <footer className="relative bg-charcoal border-t border-gold/10 overflow-hidden">
      {/* Background mandala */}
      <div
        className="absolute inset-0 opacity-3 pointer-events-none select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='180' fill='none' stroke='%23d4a843' stroke-width='0.5' opacity='0.3'/%3E%3Ccircle cx='200' cy='200' r='140' fill='none' stroke='%23d4a843' stroke-width='0.5' opacity='0.3'/%3E%3Ccircle cx='200' cy='200' r='100' fill='none' stroke='%23d4a843' stroke-width='0.5' opacity='0.3'/%3E%3Cpath d='M200 20 L220 180 L380 200 L220 220 L200 380 L180 220 L20 200 L180 180 Z' fill='none' stroke='%23d4a843' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right -100px',
          backgroundSize: '500px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/30 shrink-0">
                <img
                  src="/images/logo.png"
                  alt="DIVY ASHISH YOGA SANSTHAN logo"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div>
                <p className="text-gold font-serif font-bold text-base leading-tight">
                  DIVY ASHISH YOGA SANSTHAN
                </p>
                <p className="text-cream/40 text-xs tracking-widest uppercase">(AN YOGA INSTITUTE)</p>
              </div>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed font-devanagari mb-4">
              {contactInfo.tagline}
            </p>
            <p className="text-cream/40 text-xs leading-relaxed italic">
              "Ancient Wisdom. Modern Wellness."
            </p>

            {/* Social / WhatsApp */}
            <a
              href={`https://wa.me/91${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-green-700/25 border border-green-500/30 text-green-400 text-xs hover:bg-green-700/40 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.522 5.857L0 24l6.335-1.507A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.044-1.39l-.361-.215-3.763.895.938-3.671-.235-.376A9.808 9.808 0 012.182 12C2.182 6.562 6.562 2.182 12 2.182S21.818 6.562 21.818 12 17.438 21.818 12 21.818z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp}>
            <h3 className="text-gold font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-gold/50" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-cream/55 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeUp}>
            <h3 className="text-gold font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-gold/50" />
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    to="/classes"
                    className="text-cream/55 hover:text-gold text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h3 className="text-gold font-serif text-base font-semibold mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-gold/50" />
              Contact
            </h3>
            <ul className="space-y-4">
              {contactInfo.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:+91${phone}`}
                    className="flex items-center gap-3 text-cream/60 hover:text-gold text-sm transition-colors group"
                  >
                    <Phone size={14} className="text-gold/60 group-hover:text-gold shrink-0" />
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={contactInfo.websiteUrl || `https://${contactInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream/60 hover:text-gold text-sm transition-colors group"
                >
                  <Globe size={14} className="text-gold/60 group-hover:text-gold shrink-0" />
                  {contactInfo.website}
                </a>
              </li>
              <li>
                <a
                  href={contactInfo.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-cream/60 hover:text-gold text-sm transition-colors group"
                  aria-label="Get directions — open in Google Maps"
                >
                  <MapPin size={14} className="text-gold/60 group-hover:text-gold shrink-0 mt-0.5" />
                  <span>
                    {contactInfo.address.area}, {contactInfo.address.city}
                    <br />
                    <span className="text-cream/40 group-hover:text-gold/60">{contactInfo.address.state}, India</span>
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Connect With Us ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          {/* Section heading */}
          <p className="text-gold/50 text-xs tracking-[0.35em] uppercase font-devanagari mb-1">
            जुड़ें हमसे
          </p>
          <h3 className="font-serif text-lg font-semibold text-cream mb-1">
            Connect With Us
          </h3>
          <p className="text-cream/40 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
            Follow Divy Ashish Yoga Sansthan&nbsp;/&nbsp;AN Yoga Institute on social media.
          </p>

          {/* Icon row */}
          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4">
            {liveSocials.map((s) => {
              const icon = SOCIAL_ICONS[s.label] || DEFAULT_ICON;
              const color = s.color || '#d4a843';
              return (
                <motion.a
                  key={s._id || s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  whileHover={{ scale: 1.18, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                  className="group relative w-11 h-11 rounded-full flex items-center justify-center border border-gold/20 bg-white/4 backdrop-blur-sm transition-all duration-300"
                >
                  {/* Glow ring on hover */}
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: `0 0 18px 4px ${color}55`,
                      background: `radial-gradient(ellipse, ${color}18 0%, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                  {/* Icon */}
                  <span
                    className="relative z-10 text-cream/50 transition-colors duration-300"
                    onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  >
                    {icon}
                  </span>
                  {/* Tooltip */}
                  <span
                    className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-medium text-charcoal bg-gold/90 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 shadow-lg"
                    aria-hidden="true"
                  >
                    {s.label}
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gold/90" />
                  </span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="section-divider mt-10 mb-6">
          <img src="/images/logo.png" alt="DAYS logo" className="w-8 h-8 rounded-full object-cover opacity-40" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/30 text-xs text-center sm:text-left">
            © 2026 DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE). All Rights Reserved.
          </p>
          <p className="text-cream/25 text-xs flex items-center gap-1">
            Made with <Heart size={10} className="text-gold/60" /> for wellness
          </p>
        </div>
      </div>
    </footer>
  );
}
