import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Globe, MapPin, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren } from '../utils/animations';
import SocialLinks from '../components/SocialLinks';

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

  // Services list from admin dashboard SiteConfig
  const services = Array.isArray(contactInfo?.services) && contactInfo.services.length > 0
    ? contactInfo.services.slice(0, 6)
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
          id="connect"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-gold/50 text-xs tracking-[0.35em] uppercase font-devanagari mb-1">
            जुड़ें हमसे
          </p>
          <h3 className="font-serif text-lg font-semibold text-cream mb-1">
            Connect With Us
          </h3>
          <p className="text-cream/40 text-xs mb-7 max-w-sm mx-auto leading-relaxed">
            Follow DIVY ASHISH YOGA SANSTHAN&nbsp;/&nbsp;AN Yoga Institute on social media for daily inspiration, updates and live classes.
          </p>

          {/* Social icons — always visible, hardcoded URLs */}
          <SocialLinks className="justify-center" />
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
