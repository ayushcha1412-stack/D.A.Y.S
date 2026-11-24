/**
 * SocialLinks — Reusable social media links component.
 *
 * Usage:
 *   <SocialLinks />                    — full icon row (footer)
 *   <SocialLinks compact />            — smaller icons (navbar drawer)
 *   <SocialLinks showLabels />         — icons + labels (standalone section)
 *
 * URLs are hardcoded here as the single source of truth so they always work
 * even when the backend is offline.
 */
import { motion } from 'framer-motion';

// ── Platform definitions ────────────────────────────────────────────────────
export const SOCIAL_PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://youtube.com/@anyogainstitute?si=Brb66ZglZk4t934c',
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=100071712365099',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    href: 'https://x.com/anyogainstitute',
    color: '#e7e9ea',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/+hkbqbbDBm9E1ZGI1',
    color: '#2AABEE',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://whatsapp.com/channel/0029Vb9FX423AzNKZLNwZS1w',
    color: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/_anyogainstitute?igsh=NnAxeTVhY2E0bmdx',
    color: '#E1306C',
    gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

// ── Main component ──────────────────────────────────────────────────────────
export default function SocialLinks({ compact = false, showLabels = false, className = '' }) {
  const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';
  const btnSize  = compact ? 'w-9 h-9'  : 'w-11 h-11';

  return (
    <div className={`flex items-center flex-wrap gap-3 ${className}`}>
      {SOCIAL_PLATFORMS.map((platform, i) => (
        <motion.a
          key={platform.id}
          href={platform.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow us on ${platform.label}`}
          title={platform.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
          whileHover={{ scale: 1.18, y: -4 }}
          whileTap={{ scale: 0.9 }}
          className={`group relative ${btnSize} rounded-full flex items-center justify-center border border-gold/20 bg-white/4 backdrop-blur-sm transition-all duration-300 shrink-0`}
        >
          {/* Glow on hover */}
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow: `0 0 20px 5px ${platform.color}50`,
              background: platform.gradient
                ? `radial-gradient(ellipse, ${platform.color}20 0%, transparent 70%)`
                : `radial-gradient(ellipse, ${platform.color}18 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />

          {/* Icon */}
          <span
            className={`relative z-10 ${iconSize} text-cream/50 transition-all duration-300 group-hover:scale-110`}
            style={{ color: undefined }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = platform.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '';
            }}
          >
            {platform.icon}
          </span>

          {/* Tooltip (hidden on mobile) */}
          {!compact && (
            <span
              className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium text-charcoal bg-gold/90 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg hidden sm:block"
              aria-hidden="true"
            >
              {platform.label}
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gold/90" />
            </span>
          )}

          {/* Label below icon (showLabels mode) */}
          {showLabels && (
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-cream/40 whitespace-nowrap group-hover:text-gold/70 transition-colors">
              {platform.label}
            </span>
          )}
        </motion.a>
      ))}
    </div>
  );
}
