import { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AppProvider } from './context/AppContext';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import FloatingActions from './layouts/FloatingActions';
import PageTransition from './layouts/PageTransition';
import BuddhaLoader from './components/BuddhaLoader';
import InAppDashboard from './components/InAppDashboard';
import ScrollToTop from './components/ScrollToTop';

// ── Lazy-loaded pages ──────────────────────────────────────────────────────
const Home         = lazy(() => import('./pages/Home'));
const Facilitators = lazy(() => import('./pages/Facilitators'));
const Classes      = lazy(() => import('./pages/Classes'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Expertise    = lazy(() => import('./pages/Expertise'));
const About        = lazy(() => import('./pages/About'));
const Contact      = lazy(() => import('./pages/Contact'));
const Reviews      = lazy(() => import('./pages/Reviews'));
const Gallery      = lazy(() => import('./pages/Gallery'));
const Membership   = lazy(() => import('./pages/Membership'));
const Plans        = lazy(() => import('./pages/Plans'));

// ── Page-level loading fallback ────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border border-gold/40 overflow-hidden animate-breathe shrink-0"
          style={{ background: 'radial-gradient(ellipse, rgba(212,168,67,0.15), transparent)' }}
        >
          <img src="/images/logo.png" alt="DAYS logo" className="w-full h-full object-cover" draggable={false} />
        </div>
        <p className="text-cream/30 text-xs tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}

// ── 404 ────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <img src="/images/logo.png" alt="DIVY ASHISH YOGA SANSTHAN logo" className="w-20 h-20 rounded-full object-cover border border-gold/30 mb-4 mx-auto" draggable={false} />
      <h1 className="font-serif text-4xl font-bold text-cream mb-3">Page Not Found</h1>
      <p className="text-cream/50 text-base mb-8">
        The path you seek does not exist. Return to the beginning.
      </p>
      <a href="/" className="btn-primary">Return Home</a>
    </div>
  );
}

// ── Layout wrapper (shared across all routes) ──────────────────────────────
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <FloatingActions />
      <InAppDashboard />
    </div>
  );
}

// ── Router content (uses location for AnimatePresence key) ─────────────────
function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path="/"             element={<Home />} />
            <Route path="/facilitators" element={<Facilitators />} />
            <Route path="/classes"      element={<Classes />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/expertise"    element={<Expertise />} />
            <Route path="/about"        element={<About />} />
            <Route path="/contact"      element={<Contact />} />
            <Route path="/reviews"      element={<Reviews />} />
            <Route path="/gallery"      element={<Gallery />} />
            <Route path="/membership"   element={<Membership />} />
            <Route path="/plans"        element={<Plans />} />
            <Route path="*"             element={<NotFound />} />
          </Routes>
        </PageTransition>
      </Suspense>
    </AppLayout>
    </>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────
export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        {!loaderDone && (
          <BuddhaLoader key="loader" onComplete={() => setLoaderDone(true)} />
        )}
      </AnimatePresence>

      {/* Mount routes immediately — they appear after loader fades */}
      <div
        style={{
          opacity: loaderDone ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: loaderDone ? 'auto' : 'none',
        }}
      >
        <AppRoutes />
      </div>
    </AppProvider>
  );
}
