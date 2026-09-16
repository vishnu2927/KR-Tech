const Lead = require('../models/Lead');
const User = require('../models/User');
const Course = require('../models/Course');
const Mentor = require('../models/Mentor');

// @desc    Create a new free demo lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const { name, email, phone, course, preferredTime, timeZone, message } = req.body;

    // Strict field presence validation
    if (!name || !email || !phone || !course) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Phone number and Interested Course are all required.',
      });
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g. yourname@example.com).',
      });
    }

    // Phone number validation (at least 10 digits)
    const cleanPhone = phone.replace(/[\s-+()]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number with at least 10 digits.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Prevent duplicate email submissions in MongoDB Atlas
    const existingLead = await Lead.findOne({ email: normalizedEmail });
    if (existingLead) {
      const bId = existingLead.bookingId || `KRDEMO-${existingLead._id.toString().slice(-6).toUpperCase()}`;
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        bookingId: bId,
        message: `A 1:1 Live Demo is already booked for ${normalizedEmail}. Your active Booking ID is #${bId}. Our lead mentor has been assigned to your profile!`,
        lead: existingLead,
      });
    }

    // Generate distinctive official Booking ID
    const bookingId = `KRDEMO-${Math.floor(100000 + Math.random() * 900000)}`;

    const lead = await Lead.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      course: course.trim(),
      preferredTime: preferredTime || 'Evening (6:00 PM - 9:00 PM)',
      timeZone: timeZone || 'IST (UTC+5:30)',
      message: message || '',
      status: 'New',
      bookingId,
    });

    res.status(201).json({
      success: true,
      message: '1:1 Live Demo class successfully confirmed with your dedicated senior mentor!',
      bookingId,
      lead,
    });
  } catch (error) {
    console.error('Create Lead Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating demo lead' });
  }
};

// @desc    Get all leads (supports filter, search, sort)
// @route   GET /api/leads
// @access  Private/Admin
const getLeads = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error('Get Leads Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead status / notes
// @route   PATCH /api/leads/:id
// @access  Private/Admin
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (status) lead.status = status;
    if (notes !== undefined) lead.notes = notes;

    const updatedLead = await lead.save();

    res.json({
      success: true,
      message: `Lead updated to ${updatedLead.status}`,
      lead: updatedLead,
    });
  } catch (error) {
    console.error('Update Lead Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await Lead.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Delete Lead Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregated stats for Admin Dashboard
// @route   GET /api/leads/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLeads = await Lead.countDocuments({ createdAt: { $gte: today } });
    const scheduledDemos = await Lead.countDocuments({ status: 'Scheduled' });
    const pendingFollowUps = await Lead.countDocuments({ status: 'Contacted' });
    const completedDemos = await Lead.countDocuments({ status: 'Completed' });

    const totalCourses = await Course.countDocuments();
    const totalMentors = await Mentor.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });

    res.json({
      success: true,
      stats: {
        totalLeads,
        todayLeads,
        scheduledDemos,
        pendingFollowUps,
        completedDemos,
        totalCourses: totalCourses || 55,
        totalMentors: totalMentors || 10,
        totalStudents: totalStudents || 250,
      },
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  getAdminStats,
};
