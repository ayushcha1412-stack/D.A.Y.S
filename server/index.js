require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const path        = require('path');
const rateLimit   = require('express-rate-limit');

const connectDB               = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// ── Routes ──────────────────────────────────────────────
const authRoutes         = require('./routes/auth');
const facilitatorRoutes  = require('./routes/facilitators');
const classRoutes        = require('./routes/classes');
const planRoutes         = require('./routes/plans');
const achievementRoutes  = require('./routes/achievements');
const galleryRoutes      = require('./routes/gallery');
const reviewRoutes       = require('./routes/reviews');
const enquiryRoutes      = require('./routes/enquiries');
const membershipRoutes   = require('./routes/memberships');
const scheduleRoutes     = require('./routes/schedule');
const configRoutes       = require('./routes/config');
const paymentRoutes      = require('./routes/payment');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect DB ───────────────────────────────────────────
connectDB();

// ── Security ─────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Allow all Vercel preview URLs + production + localhost
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,          // e.g. https://ayuswweb.vercel.app
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin) return cb(null, true);
    // allow any *.vercel.app URL (covers preview deployments)
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// ── Rate limiting ────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login',         strictLimiter);
app.use('/api/auth/admin/login',   strictLimiter);
app.use('/api/contact',            strictLimiter);   // enquiry submissions
app.use('/api/membership',         strictLimiter);   // membership registrations

// ── Body parsers ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Static uploads ───────────────────────────────────────
const uploadsDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadsDir));

// ── Admin dashboard (static HTML) ────────────────────────
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── Health check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'DAYS Yoga API is running.', env: process.env.NODE_ENV });
});

// ── API Routes ───────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/facilitators', facilitatorRoutes);
app.use('/api/classes',      classRoutes);
app.use('/api/plans',        planRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/gallery',      galleryRoutes);
app.use('/api/reviews',      reviewRoutes);
app.use('/api/contact',      enquiryRoutes);
app.use('/api/membership',   membershipRoutes);
app.use('/api/schedule',     scheduleRoutes);
app.use('/api/config',       configRoutes);
app.use('/api/payment',      paymentRoutes);

// ── Error handling ───────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 DAYS Yoga API running on http://localhost:${PORT}`);
  console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`🌿 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
