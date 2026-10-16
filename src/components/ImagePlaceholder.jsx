/**
 * Placeholder shown when no real image is provided.
 * Renders a stylised mandala/lotus SVG with the alt text.
 */
export default function ImagePlaceholder({ alt = 'Image', className = '', aspectRatio = '4/3' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-emerald-deep/60 border border-gold/15 overflow-hidden ${className}`}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt}
    >
      {/* Mini mandala SVG */}
      <svg
        viewBox="0 0 100 100"
        className="w-16 h-16 opacity-30 animate-spin-slower"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="#d4a843" strokeWidth="0.8" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="50" cy="22"
            rx="6" ry="14"
            fill="none"
            stroke="#d4a843"
            strokeWidth="0.7"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="8" fill="rgba(212,168,67,0.15)" stroke="#d4a843" strokeWidth="0.8" />
        <image href="/images/logo.png" x="38" y="38" width="24" height="24" clipPath="circle()" />
      </svg>
      <span className="text-cream/30 text-xs mt-3 text-center px-4 leading-snug">{alt}</span>
      <span className="text-gold/25 text-xs mt-1">[Image Placeholder]</span>
    </div>
  );
}
