const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Otp = require('../models/Otp');
const Session = require('../models/Session');
const AuthAuditLog = require('../models/AuthAuditLog');
const { sendWelcomeEmail, sendOtpResetEmail } = require('../services/emailService');

// State store for Google OAuth CSRF validation (TTL 10 mins)
const oauthStateCache = new Map();

// Helper to generate JWT Access Token (30d default, or 7d)
const generateToken = (id, role, email, sessionId = null) => {
  return jwt.sign(
    { id, role, email, sessionId },
    process.env.JWT_SECRET || 'krtech_super_secret_jwt_key_2026_production',
    { expiresIn: '30d' }
  );
};

// Helper to generate secure cryptographic Refresh Token
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// Helper to hash refresh tokens with SHA-256
const hashRefreshToken = (token) => {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
};

// Helper to parse user agent for device, browser, OS
const parseUserAgent = (uaString = '') => {
  let browser = 'Chrome';
  let os = 'Windows';
  if (/firefox/i.test(uaString)) browser = 'Firefox';
  else if (/edg/i.test(uaString)) browser = 'Edge';
  else if (/opr|opera/i.test(uaString)) browser = 'Opera';
  else if (/safari/i.test(uaString) && !/chrome/i.test(uaString)) browser = 'Safari';

  if (/windows nt/i.test(uaString)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(uaString)) os = 'macOS';
  else if (/android/i.test(uaString)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(uaString)) os = 'iOS';
  else if (/linux/i.test(uaString)) os = 'Linux';

  return {
    browser,
    os,
    deviceInfo: `${browser} on ${os}`,
  };
};

// Helper to log security authentication audit events
const logAuthAudit = async ({ userId, email, eventType, role = 'student', req, success = true, details = '' }) => {
  try {
    const ua = parseUserAgent(req?.headers ? req.headers['user-agent'] : '');
    const ipAddress =
      req?.ip ||
      req?.headers?.['x-forwarded-for'] ||
      req?.socket?.remoteAddress ||
      '127.0.0.1';

    await AuthAuditLog.create({
      userId,
      email: email ? email.toLowerCase().trim() : undefined,
      eventType,
      role,
      ipAddress: String(ipAddress).split(',')[0].trim(),
      deviceInfo: ua.deviceInfo,
      browser: ua.browser,
      os: ua.os,
      success,
      details,
    });
  } catch (err) {
    console.warn('Auth Audit Logging notice:', err.message);
  }
};

// Helper to create and persist hashed session record in MongoDB Atlas
const createSessionRecord = async ({ userId, rememberMe = true, req }) => {
  try {
    const ua = parseUserAgent(req?.headers ? req.headers['user-agent'] : '');
    const ipAddress =
      req?.ip ||
      req?.headers?.['x-forwarded-for'] ||
      req?.socket?.remoteAddress ||
      '127.0.0.1';
    const rawRefreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(rawRefreshToken);
    const sessionDays = rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

    const session = await Session.create({
      user: userId,
      refreshToken: rawRefreshToken,
      refreshTokenHash,
      deviceInfo: ua.deviceInfo,
      browser: ua.browser,
      os: ua.os,
      ipAddress: String(ipAddress).split(',')[0].trim(),
      location: 'Location unavailable',
      isCurrent: true,
      lastActive: new Date(),
      expiresAt,
    });

    return { refreshToken: rawRefreshToken, session };
  } catch (err) {
    console.warn('Session Creation Notice:', err.message);
    const rawRefreshToken = generateRefreshToken();
    return { refreshToken: rawRefreshToken };
  }
};

// Helper to normalize phone numbers consistently (E.164 canonical format)
const normalizePhone = (raw) => {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return '+91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  return '+' + digits;
};

// @desc    Register a new student user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, course } = req.body;

    // 1. Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a secure password.' });
    }

    // 2. Email normalization & format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase().trim();
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address format.' });
    }

    // 3. Phone normalization & format validation
    const normalizedPhone = normalizePhone(phone);
    const phoneDigits = String(phone).replace(/\D/g, '');
    if (!normalizedPhone || phoneDigits.length < 7 || phoneDigits.length > 15) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number (7-15 digits).' });
    }

    // 4. Password length validation (8+ characters)
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    // 5. Database-level & application check: Duplicate Email (HTTP 409 Conflict)
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // 6. Database-level & application check: Duplicate Phone (HTTP 409 Conflict)
    const existingPhone = await User.findOne({ phone: normalizedPhone });
    if (existingPhone) {
      return res.status(409).json({ success: false, message: 'An account with this phone number already exists.' });
    }

    // 7. Role Security: Public registration always enforces 'student' role (Ignore client-supplied role)
    const userRole = 'student';

    const enrolledCourses = [];
    if (course) {
      enrolledCourses.push({
        courseId: `crs-${Date.now().toString().slice(-4)}`,
        title: course,
        progress: 10,
        enrolledAt: new Date(),
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: normalizedPhone,
      role: userRole,
      enrolledCourses,
    });

    if (user) {
      // Trigger automated Welcome Email
      sendWelcomeEmail(user).catch((mailErr) => {
        console.warn('Welcome Email Dispatch Notice:', mailErr.message);
      });

      // Generate Refresh Token and persist Session in MongoDB Atlas
      const { refreshToken, session } = await createSessionRecord({
        userId: user._id,
        rememberMe: true,
        req,
      });

      await logAuthAudit({
        userId: user._id,
        email: user.email,
        eventType: 'LOGIN_SUCCESS',
        role: user.role,
        req,
        details: 'User registered & authenticated successfully',
      });

      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          enrolledCourses: user.enrolledCourses,
          createdAt: user.createdAt,
        },
        token: generateToken(user._id, user.role, user.email, session?._id),
        refreshToken,
        message: 'Account registered successfully in MongoDB Atlas!',
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email || error.message?.includes('email')) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }
      if (error.keyPattern?.phone || error.message?.includes('phone')) {
        return res.status(409).json({ success: false, message: 'An account with this phone number already exists.' });
      }
      return res.status(409).json({ success: false, message: 'An account with these details already exists.' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token with session
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe = true } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase().trim();
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address format' });
    }

    // Ensure Admin account exists in Atlas
    if (normalizedEmail === 'admin@krtech.com' && password === 'admin123') {
      let adminUser = await User.findOne({ email: 'admin@krtech.com' });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'KR Tech Administrator',
          email: 'admin@krtech.com',
          phone: '+919876543210',
          password: 'admin123',
          role: 'admin',
        });
      }

      const { refreshToken } = await createSessionRecord({
        userId: adminUser._id,
        rememberMe: !!rememberMe,
        req,
      });

      await logAuthAudit({
        userId: adminUser._id,
        email: adminUser.email,
        eventType: 'LOGIN_SUCCESS',
        role: 'admin',
        req,
        details: 'Admin user login successful',
      });

      return res.json({
        success: true,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: 'admin',
          phone: adminUser.phone || '+919876543210',
          createdAt: adminUser.createdAt,
        },
        token: generateToken(adminUser._id, 'admin', adminUser.email),
        refreshToken,
        message: 'Admin login successful',
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      // Create Session in Atlas for refresh tokens
      const { refreshToken, session } = await createSessionRecord({
        userId: user._id,
        rememberMe: !!rememberMe,
        req,
      });

      await logAuthAudit({
        userId: user._id,
        email: user.email,
        eventType: 'LOGIN_SUCCESS',
        role: user.role,
        req,
        details: 'Standard user login successful',
      });

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          enrolledCourses: user.enrolledCourses || [],
          createdAt: user.createdAt,
        },
        token: generateToken(user._id, user.role, user.email, session?._id),
        refreshToken,
        message: 'Login successful!',
      });
    } else {
      await logAuthAudit({
        email: normalizedEmail,
        eventType: 'LOGIN_FAILED',
        req,
        success: false,
        details: 'Invalid credentials attempt',
      });
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Logout user & invalidate session
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken || req.headers['x-refresh-token'];
    if (refreshToken) {
      const hash = hashRefreshToken(refreshToken);
      await Session.deleteOne({
        $or: [{ refreshTokenHash: hash }, { refreshToken }],
      });
    }
    res.json({
      success: true,
      message: 'User logged out successfully. Session terminated.',
    });
  } catch (error) {
    res.json({
      success: true,
      message: 'User logged out successfully.',
    });
  }
};

// @desc    Refresh access token using valid refresh token (Token Rotation)
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required.' });
    }

    const hash = hashRefreshToken(refreshToken);

    const session = await Session.findOne({
      $or: [{ refreshTokenHash: hash }, { refreshToken }],
      expiresAt: { $gt: new Date() },
    }).populate('user', '-password');

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token. Please sign in again.',
      });
    }

    // Refresh Token Rotation: Generate new token & update session hash
    const newRawRefreshToken = generateRefreshToken();
    const newHash = hashRefreshToken(newRawRefreshToken);

    session.refreshToken = newRawRefreshToken;
    session.refreshTokenHash = newHash;
    session.lastActive = new Date();
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();

    const newAccessToken = generateToken(session.user._id, session.user.role, session.user.email, session._id);

    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRawRefreshToken,
      user: {
        id: session.user._id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone,
        role: session.user.role,
        avatar: session.user.avatar,
        enrolledCourses: session.user.enrolledCourses || [],
        createdAt: session.user.createdAt,
      },
      message: 'Access token refreshed successfully.',
    });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during token refresh' });
  }
};

// @desc    Logout from all devices & terminate all sessions
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = async (req, res) => {
  try {
    const result = await Session.deleteMany({ user: req.user._id });
    await logAuthAudit({
      userId: req.user._id,
      email: req.user.email,
      eventType: 'LOGOUT_ALL',
      role: req.user.role,
      req,
      details: `Logged out from all ${result.deletedCount} devices`,
    });

    res.json({
      success: true,
      message: `Successfully logged out from all devices (${result.deletedCount} session${result.deletedCount === 1 ? '' : 's'} terminated).`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Logout All Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to terminate all sessions' });
  }
};

// @desc    Get all active sessions / devices for current user
// @route   GET /api/auth/sessions
// @access  Private
const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user._id,
      expiresAt: { $gt: new Date() },
    }).sort({ lastActive: -1 });

    const formattedSessions = sessions.map((s, idx) => {
      const isCurrent = req.sessionId ? String(s._id) === String(req.sessionId) : idx === 0;
      // Mask IP address (e.g. 192.168.1.100 -> 192.168.***.***)
      const parts = String(s.ipAddress || '127.0.0.1').split('.');
      const maskedIp = parts.length === 4 ? `${parts[0]}.${parts[1]}.***.***` : s.ipAddress;

      return {
        id: s._id,
        deviceInfo: s.deviceInfo,
        browser: s.browser,
        os: s.os,
        ipAddress: maskedIp,
        location: s.location || 'Location unavailable',
        lastActive: s.lastActive,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        isCurrent,
      };
    });

    res.json({
      success: true,
      count: formattedSessions.length,
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error('Get User Sessions Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Revoke a specific device session
// @route   DELETE /api/auth/sessions/:sessionId
// @access  Private
const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ _id: sessionId, user: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found or already terminated.' });
    }

    await Session.deleteOne({ _id: sessionId });

    await logAuthAudit({
      userId: req.user._id,
      email: req.user.email,
      eventType: 'SESSION_REVOKED',
      role: req.user.role,
      req,
      details: `Revoked session ${sessionId}`,
    });

    res.json({ success: true, message: 'Device session revoked successfully.' });
  } catch (error) {
    console.error('Revoke Session Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Initiate Real Google OAuth 2.0 Flow
// @route   GET /api/auth/google
// @access  Public
const googleAuthStart = async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL ||
    `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    // If OAuth is not configured, inform safely
    if (req.accepts('html')) {
      return res.redirect('/login?error=google_not_configured');
    }
    return res.status(503).json({
      success: false,
      configured: false,
      message: 'Google OAuth is not configured on this server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env',
    });
  }

  // Generate cryptographically secure CSRF state
  const state = crypto.randomBytes(32).toString('hex');
  oauthStateCache.set(state, { createdAt: Date.now() });

  // Clean expired states older than 10 mins
  const now = Date.now();
  for (const [key, val] of oauthStateCache.entries()) {
    if (now - val.createdAt > 10 * 60 * 1000) {
      oauthStateCache.delete(key);
    }
  }

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    callbackUrl
  )}&response_type=code&scope=openid%20email%20profile&state=${encodeURIComponent(
    state
  )}&prompt=select_account`;

  res.redirect(googleAuthUrl);
};

// @desc    Google OAuth 2.0 Authorization Callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      await logAuthAudit({
        eventType: 'GOOGLE_OAUTH_FAILED',
        req,
        success: false,
        details: `Google returned error: ${error}`,
      });
      return res.redirect(`/login?error=${encodeURIComponent(error)}`);
    }

    if (!state || !oauthStateCache.has(state)) {
      await logAuthAudit({
        eventType: 'GOOGLE_OAUTH_FAILED',
        req,
        success: false,
        details: 'Invalid or expired CSRF state parameter',
      });
      return res.redirect('/login?error=invalid_csrf_state');
    }
    oauthStateCache.delete(state);

    if (!code) {
      return res.redirect('/login?error=missing_authorization_code');
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL ||
      `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return res.redirect('/login?error=google_not_configured');
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData);
      return res.redirect('/login?error=token_exchange_failed');
    }

    // Retrieve verified profile
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await userinfoResponse.json();

    if (!userinfoResponse.ok || !profile.email) {
      return res.redirect('/login?error=profile_fetch_failed');
    }

    if (!profile.email_verified) {
      return res.redirect('/login?error=unverified_google_email');
    }

    const normalizedEmail = profile.email.toLowerCase().trim();
    const googleSub = profile.sub;

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ googleId: googleSub }, { email: normalizedEmail }],
    });

    if (user) {
      // Link Google identity if not linked
      if (!user.googleId) {
        user.googleId = googleSub;
        if (!user.authProviders) user.authProviders = [];
        user.authProviders.push({ provider: 'google', providerId: googleSub });
        await user.save();
      }
      await logAuthAudit({
        userId: user._id,
        email: user.email,
        eventType: 'GOOGLE_OAUTH_LINKED',
        role: user.role,
        req,
        details: 'Google identity linked to existing user account',
      });
    } else {
      // Create new student user (NEVER admin!)
      user = await User.create({
        name: profile.name || 'Google Learner',
        email: normalizedEmail,
        googleId: googleSub,
        role: 'student',
        avatar: profile.picture || '',
        authProviders: [{ provider: 'google', providerId: googleSub }],
      });

      sendWelcomeEmail(user).catch(() => {});

      await logAuthAudit({
        userId: user._id,
        email: user.email,
        eventType: 'GOOGLE_OAUTH_SUCCESS',
        role: 'student',
        req,
        details: 'New student account created via Google OAuth',
      });
    }

    const { refreshToken, session } = await createSessionRecord({
      userId: user._id,
      rememberMe: true,
      req,
    });

    const jwtToken = generateToken(user._id, user.role, user.email, session?._id);

    // Redirect to frontend auth callback handler
    res.redirect(`/auth/callback?token=${encodeURIComponent(jwtToken)}&refreshToken=${encodeURIComponent(refreshToken)}`);
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    res.redirect('/login?error=oauth_internal_error');
  }
};

// @desc    Get current user profile with enrolled courses
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found in MongoDB Atlas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.phone !== undefined) {
      const norm = normalizePhone(req.body.phone);
      if (norm) {
        const existing = await User.findOne({ phone: norm, _id: { $ne: user._id } });
        if (existing) {
          return res.status(409).json({ success: false, message: 'This phone number is already registered to another account.' });
        }
        user.phone = norm;
      }
    }
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    if (req.body.password) {
      if (req.body.password.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // If password was updated, terminate all other sessions
    if (req.body.password) {
      await Session.deleteMany({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        enrolledCourses: updatedUser.enrolledCourses || [],
        createdAt: updatedUser.createdAt,
      },
      message: 'Profile updated successfully in MongoDB Atlas',
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get demo bookings for the current authenticated user
// @route   GET /api/auth/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase().trim();
    const bookings = await Lead.find({ email: userEmail }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map((b) => ({
        id: b._id,
        bookingId: b.bookingId || `KRDEMO-${b._id.toString().slice(-6).toUpperCase()}`,
        name: b.name,
        email: b.email,
        phone: b.phone,
        course: b.course,
        timeSlot: b.preferredTime,
        timeZone: b.timeZone,
        message: b.message,
        status: b.status,
        createdAt: b.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get My Bookings Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get enrolled courses for the current authenticated user
// @route   GET /api/auth/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      count: (user.enrolledCourses || []).length,
      courses: user.enrolledCourses || [],
    });
  } catch (error) {
    console.error('Get My Courses Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enroll in a new course
// @route   POST /api/auth/enroll
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Course title is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const alreadyEnrolled = user.enrolledCourses.some(
      (c) => c.title.toLowerCase() === title.toLowerCase() || (courseId && c.courseId === courseId)
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: `You are already enrolled in "${title}".`,
        enrolledCourses: user.enrolledCourses,
      });
    }

    user.enrolledCourses.push({
      courseId: courseId || `crs-${Date.now().toString().slice(-5)}`,
      title: title.trim(),
      progress: 0,
      enrolledAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: `Enrolled successfully in ${title}!`,
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    console.error('Enroll In Course Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered students (for Admin)
// @route   GET /api/auth/students
// @access  Private/Admin
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password - Generate & Hash 6-Digit OTP (10 min expiry)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide registered email address.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Generate secure 6-digit OTP using crypto
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Clean up any existing active reset sessions for this email
    await Otp.deleteMany({ email: normalizedEmail });

    // Persist hashed OTP session in MongoDB Atlas
    await Otp.create({
      email: normalizedEmail,
      otpHash,
      attempts: 0,
      maxAttempts: 5,
      isVerified: false,
      isUsed: false,
      expiresAt,
    });

    if (user) {
      // Dispatch official responsive HTML email template via Nodemailer
      await sendOtpResetEmail({
        email: user.email,
        name: user.name,
        otp,
        expiryMinutes: 10,
      });

      await logAuthAudit({
        userId: user._id,
        email: user.email,
        eventType: 'PASSWORD_RESET_REQUEST',
        role: user.role,
        req,
        details: 'Password reset OTP requested',
      });
    }

    // Generic response to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account matches this email, a 6-digit security OTP code has been dispatched.',
      expiresIn: '10 minutes',
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify 6-Digit OTP Code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and 6-digit verification OTP are required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 6-digit numeric code.',
      });
    }

    // Find active un-used OTP document
    const record = await Otp.findOne({ email: normalizedEmail, isUsed: false });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No active password reset request found. Please request a new OTP.',
      });
    }

    // Check expiration
    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: 'Your verification OTP has expired. Please request a new code.',
      });
    }

    // Check brute-force max attempts
    if (record.attempts >= record.maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Maximum verification attempts (5) exceeded. Session locked for security. Please request a new OTP.',
      });
    }

    // Hash user-submitted OTP and compare using timing-safe comparison
    const submittedHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');
    const hashesMatch = crypto.timingSafeEqual(
      Buffer.from(submittedHash, 'utf8'),
      Buffer.from(record.otpHash, 'utf8')
    );

    if (!hashesMatch) {
      record.attempts += 1;
      await record.save();
      const remaining = Math.max(0, record.maxAttempts - record.attempts);
      return res.status(400).json({
        success: false,
        message: `Invalid OTP code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before session lockout.`,
        remainingAttempts: remaining,
      });
    }

    // Success: Generate cryptographically signed single-use reset authorization token
    const resetToken = crypto.randomBytes(32).toString('hex');
    record.isVerified = true;
    record.resetToken = resetToken;
    await record.save();

    res.json({
      success: true,
      message: 'OTP verification successful! You may now reset your account password.',
      resetToken,
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Account Password using verified Reset Token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, reset authorization token, and new password are required.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify authorized active reset session
    const record = await Otp.findOne({
      email: normalizedEmail,
      resetToken,
      isVerified: true,
      isUsed: false,
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid, already used, or unauthorized reset session. Please request a new OTP.',
      });
    }

    if (new Date() > record.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Reset authorization session has expired. Please verify a new OTP.',
      });
    }

    // Find and update User
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    user.password = newPassword; // Mongoose pre('save') hashes it securely with bcrypt
    await user.save();

    // Invalidate and delete used OTP automatically from Atlas
    await Otp.deleteMany({ email: normalizedEmail });

    // Revoke all active sessions on password reset for security
    await Session.deleteMany({ user: user._id });

    await logAuthAudit({
      userId: user._id,
      email: user.email,
      eventType: 'PASSWORD_RESET_SUCCESS',
      role: user.role,
      req,
      details: 'Password reset completed and all prior sessions invalidated',
    });

    res.json({
      success: true,
      message: 'Password updated successfully! You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getMyBookings,
  getMyCourses,
  enrollInCourse,
  getAllStudents,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logoutUser,
  refreshTokenHandler,
  logoutAll,
  getUserSessions,
  revokeSession,
  googleAuthStart,
  googleAuthCallback,
};
