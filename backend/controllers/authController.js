const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Otp = require('../models/Otp');
const Session = require('../models/Session');
const { sendWelcomeEmail, sendOtpResetEmail } = require('../services/emailService');

// Helper to generate JWT Access Token (30d)
const generateToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'krtech_super_secret_jwt_key_2026_production',
    { expiresIn: '30d' }
  );
};

// Helper to generate secure cryptographic Refresh Token
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
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

// Helper to create and persist session record in MongoDB Atlas
const createSessionRecord = async ({ userId, rememberMe = true, req }) => {
  try {
    const ua = parseUserAgent(req?.headers ? req.headers['user-agent'] : '');
    const ipAddress =
      req?.ip ||
      req?.headers?.['x-forwarded-for'] ||
      req?.socket?.remoteAddress ||
      '127.0.0.1';
    const refreshToken = generateRefreshToken();
    const sessionDays = rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

    const session = await Session.create({
      user: userId,
      refreshToken,
      deviceInfo: ua.deviceInfo,
      browser: ua.browser,
      os: ua.os,
      ipAddress,
      isCurrent: true,
      lastActive: new Date(),
      expiresAt,
    });

    return { refreshToken, session };
  } catch (err) {
    console.warn('Session Creation Notice:', err.message);
    return { refreshToken: generateRefreshToken() };
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, course } = req.body;

    // 1. Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a secure password.' });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase().trim();
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // 3. Password length validation
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // 4. Phone validation (optional field, but if provided, validate length)
    let cleanedPhone = '';
    if (phone && phone.trim()) {
      cleanedPhone = phone.trim();
      const phoneDigits = cleanedPhone.replace(/\D/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        return res.status(400).json({ success: false, message: 'Please provide a valid phone number (7-15 digits).' });
      }
    }

    // Check if user already exists in MongoDB
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Determine user role
    const userRole = role === 'admin' || normalizedEmail === 'admin@krtech.com' ? 'admin' : 'student';

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
      phone: cleanedPhone,
      role: userRole,
      enrolledCourses,
    });

    if (user) {
      // Trigger automated Welcome Email
      sendWelcomeEmail(user).catch((mailErr) => {
        console.warn('Welcome Email Dispatch Notice:', mailErr.message);
      });

      // Generate Refresh Token and persist Session in MongoDB Atlas
      const { refreshToken } = await createSessionRecord({
        userId: user._id,
        rememberMe: true,
        req,
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
        token: generateToken(user._id, user.role, user.email),
        refreshToken,
        message: 'Account registered successfully in MongoDB Atlas!',
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
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
          password: 'admin123',
          role: 'admin',
        });
      }

      const { refreshToken } = await createSessionRecord({
        userId: adminUser._id,
        rememberMe: !!rememberMe,
        req,
      });

      return res.json({
        success: true,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: 'admin',
          phone: adminUser.phone || '+91 98765 43210',
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
      const { refreshToken } = await createSessionRecord({
        userId: user._id,
        rememberMe: !!rememberMe,
        req,
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
        token: generateToken(user._id, user.role, user.email),
        refreshToken,
        message: 'Login successful!',
      });
    } else {
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
      await Session.deleteOne({ refreshToken });
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
    if (req.body.phone !== undefined) user.phone = req.body.phone.trim();
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

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

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
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

    // Invalidate and delete used OTP automatically from Atlas (Requirement 10)
    await Otp.deleteMany({ email: normalizedEmail });

    // Revoke all active sessions on password reset for security
    await Session.deleteMany({ user: user._id });

    res.json({
      success: true,
      message: 'Password updated successfully! You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh access token using valid refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required.' });
    }

    const session = await Session.findOne({
      refreshToken,
      expiresAt: { $gt: new Date() },
    }).populate('user', '-password');

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token. Please sign in again.',
      });
    }

    // Update last activity timestamp
    session.lastActive = new Date();
    await session.save();

    const newAccessToken = generateToken(session.user._id, session.user.role, session.user.email);

    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: session.refreshToken,
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

    const userAgent = req.headers['user-agent'] || '';

    const formattedSessions = sessions.map((s, idx) => {
      const isCurrent = idx === 0 || (s.browser && userAgent.toLowerCase().includes(s.browser.toLowerCase()));
      return {
        id: s._id,
        deviceInfo: s.deviceInfo,
        browser: s.browser,
        os: s.os,
        ipAddress: s.ipAddress,
        lastActive: s.lastActive,
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
    res.json({ success: true, message: 'Device session revoked successfully.' });
  } catch (error) {
    console.error('Revoke Session Error:', error);
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
};
