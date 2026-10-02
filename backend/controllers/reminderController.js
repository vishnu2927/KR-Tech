const StudyReminder = require('../models/StudyReminder');

// @desc    Get Student Study Reminders
// @route   GET /api/reminders
// @access  Public / Authenticated
const getReminders = async (req, res) => {
  try {
    const studentId = req.user?._id;

    let reminders = [];
    if (studentId) {
      reminders = await StudyReminder.find({ student: studentId }).lean();
    }

    if (!reminders || reminders.length === 0) {
      reminders = [
        {
          _id: "rem-01",
          reminderType: "daily_study",
          time: "20:00",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          channel: "push",
          isActive: true,
          customMessage: "Time for daily coding session! Keep your 14-day streak alive 🔥",
        },
        {
          _id: "rem-02",
          reminderType: "live_class",
          time: "15m_before",
          days: ["Saturday", "Sunday"],
          channel: "whatsapp",
          isActive: true,
          customMessage: "Your Live Class starts in 15 mins! Zoom link ready.",
        },
        {
          _id: "rem-03",
          reminderType: "streak_saver",
          time: "22:30",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          channel: "all",
          isActive: true,
          customMessage: "Don't break your streak! Complete today's 10-min skill quiz.",
        },
      ];
    }

    res.json({
      success: true,
      count: reminders.length,
      reminders,
    });
  } catch (error) {
    console.error('Get Reminders Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or Update Study Reminder
// @route   POST /api/reminders
// @access  Public / Authenticated
const createReminder = async (req, res) => {
  try {
    const { reminderType, time, days, channel, customMessage, isActive } = req.body;
    const studentId = req.user?._id || null;
    const studentEmail = req.user?.email || '';

    let reminder;
    if (studentId) {
      reminder = await StudyReminder.findOneAndUpdate(
        { student: studentId, reminderType: reminderType || 'daily_study' },
        {
          studentEmail,
          time: time || '20:00',
          days: days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          channel: channel || 'push',
          customMessage: customMessage || 'Keep your coding streak burning! 🔥',
          isActive: isActive !== undefined ? isActive : true,
        },
        { upsert: true, new: true }
      );
    } else {
      reminder = {
        _id: `rem-guest-${Date.now()}`,
        reminderType: reminderType || 'daily_study',
        time: time || '20:00',
        days: days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        channel: channel || 'push',
        customMessage: customMessage || 'Keep your coding streak burning! 🔥',
        isActive: isActive !== undefined ? isActive : true,
      };
    }

    res.status(201).json({
      success: true,
      message: 'Study reminder configured successfully',
      reminder,
    });
  } catch (error) {
    console.error('Create Reminder Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReminders,
  createReminder,
};
