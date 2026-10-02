const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas / Local
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io Real-Time Server Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('typing', ({ roomId, userName }) => {
    socket.to(roomId).emit('user_typing', { roomId, userName });
  });
});

// 1. Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
}));

// 2. CORS Whitelist Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://krgloballearning.com',
  'https://www.krgloballearning.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8443',
  'https://krtech.in',
  'https://krtech.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.krgloballearning.com') ||
      (origin.startsWith('http://localhost:') && process.env.NODE_ENV !== 'production')
    ) {
      return callback(null, true);
    }
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error('CORS Policy: Origin not allowed.'));
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key', 'x-request-id'],
}));

// Request Correlation & Production Structured Logging
const { requestCorrelationAndLogging } = require('./services/monitoringService');
app.use(requestCorrelationAndLogging);

// 3. Global Rate Limiter (300 requests per 15 minutes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', globalLimiter);

// 4. Stricter Rate Limiter for Authentication and Lead Booking
const authLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: 'Submission limit reached for security. Please wait 15 minutes before retrying.',
  },
});
app.use('/api/auth', authLeadLimiter);
app.use('/api/leads', authLeadLimiter);

// 5. Body Parsers with payload size limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Sprint 12.8: Comprehensive Health & Uptime Monitoring
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'connecting_or_error';
  res.json({
    status: 'online',
    service: 'KR GLOBAL LEARNING PRIVATE LIMITED Backend API v12.0 (Production Edition)',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbState,
      name: mongoose.connection.name || 'krtech_atlas_production',
      host: mongoose.connection.host || 'MongoDB Atlas Cluster',
    },
    memoryUsage: {
      heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
    security: {
      helmet: 'Active',
      rateLimiter: 'Active (300 req / 15m)',
      cors: 'Configured for krgloballearning.com',
      ssl: 'Enforced via HTTPS/HSTS',
    },
  });
});

app.get('/api/health/ping', (req, res) => {
  res.status(200).send('PONG');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin/monitoring', require('./routes/monitoringRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/super-admin', require('./routes/superAdminRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/certificate', require('./routes/certificateRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/pwa', require('./routes/pwaRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/invoice', require('./routes/invoiceRoutes'));
app.use('/api/emails', require('./routes/emailRoutes'));
app.use('/api/whatsapp', require('./routes/whatsappRoutes'));
app.use('/api/student', require('./routes/studentDashboardRoutes'));
app.use('/api/dashboard', require('./routes/studentDashboardRoutes'));
app.use('/api/assignment', require('./routes/studentDashboardRoutes'));
app.use('/api/enrollments', require('./routes/studentDashboardRoutes'));
app.use('/api/progress', require('./routes/studentDashboardRoutes'));
app.use('/api/lectures', require('./routes/studentDashboardRoutes'));
app.use('/api/assignments', require('./routes/studentDashboardRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/student/analytics', require('./routes/studentAnalyticsRoutes'));
app.use('/api/portal/lectures', require('./routes/lecturePortalRoutes'));
app.use('/api/live', require('./routes/liveRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/compiler', require('./routes/compilerRoutes'));
app.use('/api/dsa', require('./routes/dsaRoutes'));
app.use('/api/readiness', require('./routes/readinessRoutes'));
app.use('/api/system-design', require('./routes/systemDesignRoutes'));
app.use('/api/lms', require('./routes/lmsPhase9Routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 KR Tech v10.0 Backend + Socket.io running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Start Phase 7 Sprint 7.1 Live Class Reminder Automation (24h + 30m checks)
  try {
    const { startReminderScheduler } = require('./services/sessionReminderService');
    startReminderScheduler(60000); // checks every 60s
  } catch (err) {
    console.warn('Could not initialize session reminder scheduler:', err.message);
  }
});

module.exports = { app, server };
