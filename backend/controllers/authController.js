const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Lead = require('../models/Lead');

// Helper to generate JWT Token
const generateToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'krtech_super_secret_jwt_key_2026_production',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, course } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields: name, email, password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

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
      phone: phone ? phone.trim() : '',
      role: userRole,
      enrolledCourses,
    });

    if (user) {
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

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

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
        message: 'Admin login successful',
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
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

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getMyBookings,
  getMyCourses,
  enrollInCourse,
  getAllStudents,
};
