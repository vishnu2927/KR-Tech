const LiveSession = require('../models/LiveSession');
const Attendance = require('../models/Attendance');
const SessionRecording = require('../models/SessionRecording');
const CalendarEvent = require('../models/CalendarEvent');
const Course = require('../models/Course');
const Mentor = require('../models/Mentor');

// ─────────────────────────────────────────────────────────
// @desc    Schedule a new Live Session (Admin/Mentor)
// @route   POST /api/live/schedule
// @access  Private/Admin
// ─────────────────────────────────────────────────────────
const scheduleSession = async (req, res) => {
  try {
    const {
      title, description, courseId, mentorId, mentorName,
      scheduledAt, duration, platform, meetingLink,
      meetingId, meetingPassword, maxAttendees, topics, tags, thumbnail, notes,
    } = req.body;

    if (!title || !courseId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Title, courseId, and scheduledAt are required.',
      });
    }

    // Validate the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    // Resolve mentor name
    let resolvedMentorName = mentorName || '';
    if (mentorId) {
      const mentor = await Mentor.findById(mentorId);
      if (mentor) resolvedMentorName = mentor.name || mentorName || '';
    }

    const session = await LiveSession.create({
      title,
      description: description || '',
      course: courseId,
      mentor: mentorId || undefined,
      mentorName: resolvedMentorName,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 60,
      platform: platform || 'zoom',
      meetingLink: meetingLink || '',
      meetingId: meetingId || '',
      meetingPassword: meetingPassword || '',
      maxAttendees: maxAttendees || 100,
      topics: topics || [],
      tags: tags || [],
      thumbnail: thumbnail || '',
      createdBy: req.user?._id || req.user?.id,
      notes: notes || '',
    });

    // Create a corresponding calendar event
    const endTime = new Date(new Date(scheduledAt).getTime() + (duration || 60) * 60000);
    await CalendarEvent.create({
      title,
      description: description || '',
      eventType: 'live_class',
      startTime: new Date(scheduledAt),
      endTime,
      course: courseId,
      liveSession: session._id,
      createdBy: req.user?._id || req.user?.id,
      meetingLink: meetingLink || '',
    });

    res.status(201).json({
      success: true,
      message: 'Live session scheduled successfully.',
      data: session,
    });
  } catch (error) {
    console.error('Schedule session error:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule session.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get Upcoming Live Sessions
// @route   GET /api/live/upcoming
// @access  Private
// ─────────────────────────────────────────────────────────
const getUpcomingSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const courseId = req.query.courseId;
    const status = req.query.status;

    const query = {};

    // By default, show upcoming + live sessions
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['scheduled', 'live'] };
      query.scheduledAt = { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) }; // include sessions from 2h ago
    }

    if (courseId) {
      query.course = courseId;
    }

    const total = await LiveSession.countDocuments(query);
    const sessions = await LiveSession.find(query)
      .populate('course', 'title slug thumbnail')
      .sort({ scheduledAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: sessions,
    });
  } catch (error) {
    console.error('Get upcoming sessions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming sessions.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get All Sessions (Admin view - includes completed/cancelled)
// @route   GET /api/live/all
// @access  Private/Admin
// ─────────────────────────────────────────────────────────
const getAllSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const status = req.query.status;
    const courseId = req.query.courseId;
    const search = req.query.search;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (courseId) query.course = courseId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { mentorName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await LiveSession.countDocuments(query);
    const sessions = await LiveSession.find(query)
      .populate('course', 'title slug thumbnail')
      .sort({ scheduledAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Attach attendance counts
    const sessionIds = sessions.map(s => s._id);
    const attendanceCounts = await Attendance.aggregate([
      { $match: { session: { $in: sessionIds } } },
      { $group: { _id: '$session', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    attendanceCounts.forEach(a => { countMap[a._id.toString()] = a.count; });

    const enriched = sessions.map(s => ({
      ...s,
      attendeeCount: countMap[s._id.toString()] || s.attendeeCount || 0,
    }));

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: enriched,
    });
  } catch (error) {
    console.error('Get all sessions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sessions.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get Single Session Details
// @route   GET /api/live/session/:id
// @access  Private
// ─────────────────────────────────────────────────────────
const getSessionById = async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .populate('course', 'title slug thumbnail description')
      .lean();

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    // Get attendance list
    const attendance = await Attendance.find({ session: session._id })
      .populate('student', 'name email')
      .sort({ joinedAt: -1 })
      .lean();

    // Get recordings if completed
    const recordings = await SessionRecording.find({ session: session._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        ...session,
        attendance,
        recordings,
        attendeeCount: attendance.length,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch session details.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Join a Live Session (mark attendance)
// @route   POST /api/live/join
// @access  Private
// ─────────────────────────────────────────────────────────
const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const studentId = req.user?._id || req.user?.id;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required.' });
    }

    const session = await LiveSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    if (session.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This session has been cancelled.' });
    }

    // Check existing attendance
    const existing = await Attendance.findOne({ session: sessionId, student: studentId });
    if (existing) {
      return res.json({
        success: true,
        message: 'Already joined this session.',
        data: existing,
      });
    }

    // Determine if late (more than 10 min after scheduled time)
    const now = new Date();
    const scheduledTime = new Date(session.scheduledAt);
    const isLate = now.getTime() > scheduledTime.getTime() + 10 * 60 * 1000;

    const attendance = await Attendance.create({
      session: sessionId,
      student: studentId,
      joinedAt: now,
      status: isLate ? 'late' : 'present',
      deviceInfo: req.headers['user-agent'] || 'Unknown',
      ipAddress: req.ip || '',
    });

    // Update session attendee count
    await LiveSession.findByIdAndUpdate(sessionId, { $inc: { attendeeCount: 1 } });

    // Auto-set session to 'live' if still scheduled
    if (session.status === 'scheduled') {
      await LiveSession.findByIdAndUpdate(sessionId, { status: 'live' });
    }

    res.status(201).json({
      success: true,
      message: `Joined session successfully${isLate ? ' (marked as late)' : ''}.`,
      data: attendance,
    });
  } catch (error) {
    console.error('Join session error:', error);
    if (error.code === 11000) {
      return res.json({ success: true, message: 'Already joined this session.' });
    }
    res.status(500).json({ success: false, message: 'Failed to join session.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Leave a Live Session (update attendance duration)
// @route   POST /api/live/leave
// @access  Private
// ─────────────────────────────────────────────────────────
const leaveSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const studentId = req.user?._id || req.user?.id;

    const attendance = await Attendance.findOne({ session: sessionId, student: studentId });
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    const now = new Date();
    const durationMinutes = Math.round((now - attendance.joinedAt) / 60000);

    attendance.leftAt = now;
    attendance.durationMinutes = durationMinutes;
    await attendance.save();

    res.json({
      success: true,
      message: `Left session. Duration: ${durationMinutes} minutes.`,
      data: attendance,
    });
  } catch (error) {
    console.error('Leave session error:', error);
    res.status(500).json({ success: false, message: 'Failed to leave session.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get Recordings Library
// @route   GET /api/live/recordings
// @access  Private
// ─────────────────────────────────────────────────────────
const getRecordings = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const courseId = req.query.courseId;
    const search = req.query.search;

    const query = { isPublished: true };
    if (courseId) query.course = courseId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await SessionRecording.countDocuments(query);
    const recordings = await SessionRecording.find(query)
      .populate('course', 'title slug')
      .populate('session', 'title scheduledAt mentorName platform')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: recordings,
    });
  } catch (error) {
    console.error('Get recordings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recordings.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Upload / Create a Recording (Admin/Mentor)
// @route   POST /api/live/recordings
// @access  Private/Admin
// ─────────────────────────────────────────────────────────
const createRecording = async (req, res) => {
  try {
    const {
      sessionId, title, description, courseId, recordingUrl,
      duration, fileSize, thumbnail, format, mentorNotes, attachments,
    } = req.body;

    if (!sessionId || !title || !recordingUrl) {
      return res.status(400).json({
        success: false,
        message: 'sessionId, title, and recordingUrl are required.',
      });
    }

    const recording = await SessionRecording.create({
      session: sessionId,
      title,
      description: description || '',
      course: courseId || undefined,
      recordingUrl,
      duration: duration || 0,
      fileSize: fileSize || '',
      thumbnail: thumbnail || '',
      format: format || 'mp4',
      uploadedBy: req.user?._id || req.user?.id,
      mentorNotes: mentorNotes || '',
      attachments: attachments || [],
    });

    res.status(201).json({
      success: true,
      message: 'Recording created successfully.',
      data: recording,
    });
  } catch (error) {
    console.error('Create recording error:', error);
    res.status(500).json({ success: false, message: 'Failed to create recording.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Update Session (Admin - change status, details)
// @route   PUT /api/live/session/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────
const updateSession = async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const allowedFields = [
      'title', 'description', 'scheduledAt', 'duration', 'platform',
      'meetingLink', 'meetingId', 'meetingPassword', 'status',
      'maxAttendees', 'topics', 'tags', 'thumbnail', 'mentorName', 'notes',
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });

    await session.save();

    // Update corresponding calendar event
    if (req.body.scheduledAt || req.body.title || req.body.duration) {
      const calEvent = await CalendarEvent.findOne({ liveSession: session._id });
      if (calEvent) {
        if (req.body.title) calEvent.title = req.body.title;
        if (req.body.scheduledAt) {
          calEvent.startTime = new Date(req.body.scheduledAt);
          calEvent.endTime = new Date(
            new Date(req.body.scheduledAt).getTime() + (req.body.duration || session.duration) * 60000
          );
        }
        if (req.body.meetingLink) calEvent.meetingLink = req.body.meetingLink;
        await calEvent.save();
      }
    }

    res.json({
      success: true,
      message: 'Session updated successfully.',
      data: session,
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ success: false, message: 'Failed to update session.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Delete Session (Admin)
// @route   DELETE /api/live/session/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────
const deleteSession = async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    // Clean up related data
    await Attendance.deleteMany({ session: session._id });
    await CalendarEvent.deleteMany({ liveSession: session._id });
    await LiveSession.findByIdAndDelete(session._id);

    res.json({ success: true, message: 'Session deleted successfully.' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete session.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get Calendar Events for a user/course
// @route   GET /api/live/calendar
// @access  Private
// ─────────────────────────────────────────────────────────
const getCalendarEvents = async (req, res) => {
  try {
    const { month, year, courseId } = req.query;

    const query = {};
    if (courseId) query.course = courseId;

    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      query.startTime = { $gte: startDate, $lte: endDate };
    }

    const events = await CalendarEvent.find(query)
      .populate('course', 'title slug')
      .populate('liveSession', 'status platform meetingLink attendeeCount')
      .sort({ startTime: 1 })
      .lean();

    res.json({
      success: true,
      total: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch calendar events.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Generate .ics Calendar File Download
// @route   GET /api/live/calendar/ics/:sessionId
// @access  Private
// ─────────────────────────────────────────────────────────
const downloadICS = async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.sessionId)
      .populate('course', 'title')
      .lean();

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const startDate = new Date(session.scheduledAt);
    const endDate = new Date(startDate.getTime() + session.duration * 60000);

    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KR Tech//Live Classes//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${session.title}`,
      `DESCRIPTION:${session.description || 'KR Tech Live Session'}\\n\\nCourse: ${session.course?.title || 'N/A'}\\nMentor: ${session.mentorName || 'TBA'}\\nPlatform: ${session.platform}\\nJoin: ${session.meetingLink || 'Link will be shared'}`,
      `LOCATION:${session.meetingLink || 'Online'}`,
      `URL:${session.meetingLink || ''}`,
      `STATUS:CONFIRMED`,
      `UID:${session._id}@krtech.in`,
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:KR Tech Live Class starts in 30 minutes!',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:KR Tech Live Class tomorrow!',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${session.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics"`);
    res.send(icsContent);
  } catch (error) {
    console.error('Download ICS error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate calendar file.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get Student's Attendance History
// @route   GET /api/live/my-attendance
// @access  Private
// ─────────────────────────────────────────────────────────
const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    const total = await Attendance.countDocuments({ student: studentId });
    const records = await Attendance.find({ student: studentId })
      .populate({
        path: 'session',
        select: 'title scheduledAt duration platform mentorName status course',
        populate: { path: 'course', select: 'title slug' },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Live Classes Dashboard Stats (Admin)
// @route   GET /api/live/stats
// @access  Private/Admin
// ─────────────────────────────────────────────────────────
const getLiveStats = async (req, res) => {
  try {
    const [
      totalSessions,
      scheduledSessions,
      liveSessions,
      completedSessions,
      cancelledSessions,
      totalRecordings,
      totalAttendance,
    ] = await Promise.all([
      LiveSession.countDocuments(),
      LiveSession.countDocuments({ status: 'scheduled' }),
      LiveSession.countDocuments({ status: 'live' }),
      LiveSession.countDocuments({ status: 'completed' }),
      LiveSession.countDocuments({ status: 'cancelled' }),
      SessionRecording.countDocuments(),
      Attendance.countDocuments(),
    ]);

    // Average attendance per session
    const avgAttendance = totalSessions > 0
      ? Math.round(totalAttendance / totalSessions)
      : 0;

    // Upcoming sessions (next 7 days)
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const upcomingThisWeek = await LiveSession.countDocuments({
      status: 'scheduled',
      scheduledAt: { $gte: new Date(), $lte: weekFromNow },
    });

    res.json({
      success: true,
      data: {
        totalSessions,
        scheduledSessions,
        liveSessions,
        completedSessions,
        cancelledSessions,
        totalRecordings,
        totalAttendance,
        avgAttendance,
        upcomingThisWeek,
      },
    });
  } catch (error) {
    console.error('Get live stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch live class stats.' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Trigger Session Reminders manually (Admin/Cron)
// @route   POST /api/live/reminders/trigger
// @access  Private/Admin
// ─────────────────────────────────────────────────────────
const triggerReminders = async (req, res) => {
  try {
    const { checkAndSendReminders } = require('../services/sessionReminderService');
    const result = await checkAndSendReminders();
    res.status(200).json({
      success: true,
      message: 'Reminder automation executed.',
      data: result,
    });
  } catch (error) {
    console.error('Trigger reminders error:', error);
    res.status(500).json({ success: false, message: 'Failed to trigger reminders.' });
  }
};

module.exports = {
  scheduleSession,
  getUpcomingSessions,
  getAllSessions,
  getSessionById,
  joinSession,
  leaveSession,
  getRecordings,
  createRecording,
  updateSession,
  deleteSession,
  getCalendarEvents,
  downloadICS,
  getMyAttendance,
  getLiveStats,
  triggerReminders,
};
