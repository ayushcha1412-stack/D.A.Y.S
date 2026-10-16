import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Globe, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SectionDivider from '../components/SectionDivider';
import MysticalCard from '../components/MysticalCard';
import ParticleSystem from '../components/ParticleSystem';
import { useApp } from '../context/AppContext';
import { fadeUp, staggerChildren, slideLeft, slideRight, pageTransition } from '../utils/animations';

const INIT = { name: '', phone: '', email: '', service: '', message: '' };
const ERRORS_INIT = {};

function validate(form) {
  const e = {};
  if (!form.name.trim())    e.name    = 'Name is required';
  if (!form.phone.trim())   e.phone   = 'Phone number is required';
  else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit number';
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
  if (!form.service)        e.service = 'Please select a service';
  if (!form.message.trim()) e.message = 'Message is required';
  return e;
}

export default function Contact() {
  const { siteContact: contactInfo, addEnquiry } = useApp();
  const [form, setForm]       = useState(INIT);
  const [errors, setErrors]   = useState(ERRORS_INIT);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Save to owner dashboard
    addEnquiry({
      id:        Date.now(),
      name:      form.name.trim(),
      phone:     form.phone.trim(),
      email:     form.email.trim(),
      service:   form.service,
      message:   form.message.trim(),
      status:    'new',
      date:      new Date().toISOString(),
    });
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 800);
  };

  const reset = () => { setForm(INIT); setErrors(ERRORS_INIT); setSubmitted(false); };

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(17,92,69,0.1) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <ParticleSystem count={8} type="dot" />
        <SectionHeader
          sanskrit="संपर्क करें"
          title="Get In"
          titleHighlight="Touch"
          description="We'd love to hear from you. Reach out for class enquiries, registration, or any questions about your yoga journey."
        />
      </section>

      <SectionDivider className="max-w-5xl mx-auto px-4" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Contact info ── */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-serif text-2xl font-bold text-cream mb-1">
                {contactInfo.name}
              </h2>
              <p className="text-gold/60 text-sm">{contactInfo.subtitle}</p>
              <p className="text-cream/50 text-sm font-devanagari mt-2">{contactInfo.tagline}</p>
            </div>

            {/* Phone cards */}
            {contactInfo.phones.map((phone) => (
              <MysticalCard key={phone} className="p-5 group" hoverLift>
                <a
                  href={`tel:+91${phone}`}
                  className="flex items-center gap-4"
                  aria-label={`Call ${phone}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Phone size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-gold/50 text-xs tracking-widest uppercase mb-0.5">Phone</p>
                    <p className="text-cream font-bold text-xl tracking-wider">{phone}</p>
                  </div>
                </a>
              </MysticalCard>
            ))}

            {/* Website */}
            <MysticalCard className="p-5 group" hoverLift>
              <a
                href={contactInfo.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4"
                aria-label="Visit website"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-mid/15 border border-emerald-mid/25 flex items-center justify-center group-hover:bg-emerald-mid/25 transition-colors">
                  <Globe size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-cream/40 text-xs tracking-widest uppercase mb-0.5">Website</p>
                  <p className="text-cream/80 text-sm">{contactInfo.website}</p>
                </div>
              </a>
            </MysticalCard>

            {/* Address */}
            <MysticalCard className="p-5 group" hoverLift>
              <a
                href={contactInfo.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4"
                aria-label="Get directions — open in Google Maps"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <MapPin size={20} className="text-gold" />
                </div>
                <div>
                  <p className="text-cream/40 text-xs tracking-widest uppercase mb-1">Location</p>
                  <p className="text-cream/80 text-base font-devanagari mb-1">
                    {contactInfo.address.area}, {contactInfo.address.city}
                  </p>
                  <p className="text-cream/55 text-sm">{contactInfo.address.state}, India</p>
                  <p className="text-cream/35 text-xs mt-1">{contactInfo.address.english}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-gold/60 text-xs group-hover:text-gold transition-colors">
                    <MapPin size={11} /> Get Directions ↗
                  </span>
                </div>
              </a>
            </MysticalCard>

            {/* Hours */}
            <MysticalCard className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-cream/40 text-xs tracking-widest uppercase mb-2">Hours</p>
                  {contactInfo.hours.map((h) => (
                    <div key={h.days} className="flex justify-between text-sm mb-1.5">
                      <span className="text-cream/65">{h.days}</span>
                      <span className="text-gold/80 font-medium">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </MysticalCard>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/91${contactInfo.whatsapp}?text=Namaste! I would like to know more about yoga classes at DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE).`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-green-500/30 bg-green-700/15 text-green-400 hover:bg-green-700/25 transition-colors w-full"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={22} />
              <div>
                <p className="font-semibold text-sm">Chat on WhatsApp</p>
                <p className="text-green-400/60 text-xs">Quick response — usually within minutes</p>
              </div>
            </a>
          </motion.div>

          {/* ── Contact form ── */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <MysticalCard className="p-8">
              <h3 className="font-serif text-xl font-bold text-cream mb-6">Send Us a Message</h3>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold/40 flex items-center justify-center mb-5"
                    >
                      <CheckCircle size={36} className="text-gold" />
                    </motion.div>
                    <h4 className="font-serif text-xl font-bold text-cream mb-2">Message Sent!</h4>
                    <p className="text-cream/55 text-sm mb-6 leading-relaxed">
                      Thank you for reaching out. We will get back to you soon.
                      <br />Namaste 🙏
                    </p>
                    <button onClick={reset} className="btn-outline text-sm">
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-cream/60 text-xs tracking-wide uppercase mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`input-field ${errors.name ? 'border-red-500/60' : ''}`}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        autoComplete="name"
                      />
                      {errors.name && (
                        <p id="name-error" className="text-red-400 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-cream/60 text-xs tracking-wide uppercase mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        autoComplete="tel"
                        maxLength={10}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-red-400 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-cream/60 text-xs tracking-wide uppercase mb-1.5">
                        Email (optional)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`input-field ${errors.email ? 'border-red-500/60' : ''}`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-400 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Service */}
                    <div>
                      <label htmlFor="service" className="block text-cream/60 text-xs tracking-wide uppercase mb-1.5">
                        I'm interested in *
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className={`input-field ${errors.service ? 'border-red-500/60' : ''}`}
                        aria-invalid={!!errors.service}
                        aria-describedby={errors.service ? 'service-error' : undefined}
                      >
                        <option value="">Select a service…</option>
                        {contactInfo.services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.service && (
                        <p id="service-error" className="text-red-400 text-xs mt-1">{errors.service}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-cream/60 text-xs tracking-wide uppercase mb-1.5">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your yoga goals or any questions you have…"
                        className={`input-field resize-none ${errors.message ? 'border-red-500/60' : ''}`}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-red-400 text-xs mt-1">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full justify-center disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Sending…
                        </span>
                      ) : (
                        <><Send size={16} /> Send Message</>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </MysticalCard>
          </motion.div>
        </div>
      </section>

      {/* ── Map placeholder ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10" aria-label="Location map">
        <SectionDivider className="mb-8" />
        <MysticalCard className="overflow-hidden">
          <div
            className="w-full h-64 sm:h-80 flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(10,30,18,0.8) 0%, rgba(6,12,8,0.9) 100%)' }}
          >
            <a
              href={contactInfo.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open location in Google Maps"
              className="flex flex-col items-center group"
            >
              <MapPin
                size={40}
                className="text-gold/60 mb-3 group-hover:text-gold transition-colors duration-300 group-hover:scale-110 transform"
              />
            </a>
            <p className="text-cream/60 text-base font-serif">Aliganj, Lucknow, Uttar Pradesh</p>
            <p className="text-cream/35 text-xs mt-1">DIVY ASHISH YOGA SANSTHAN (AN YOGA INSTITUTE)</p>
            <a
              href={contactInfo.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 btn-primary text-xs py-2.5 px-6"
              aria-label="Get directions on Google Maps"
            >
              <MapPin size={13} /> Get Directions
            </a>
          </div>
        </MysticalCard>
      </section>
    </motion.main>
  );
}
