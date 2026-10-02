const CalendarEvent = require('../models/CalendarEvent');
const LiveSession = require('../models/LiveSession');

// @desc    Get Academic Calendar Events
// @route   GET /api/calendar
// @access  Public / Authenticated
const getCalendarEvents = async (req, res) => {
  try {
    const { month, year, type } = req.query;

    const events = [
      {
        id: "ev-01",
        title: "Spring Boot 3 Microservices Architecture: Kafka Event Streaming",
        type: "live_class",
        startTime: "2026-09-20T14:30:00.000Z",
        endTime: "2026-09-20T16:30:00.000Z",
        mentor: "Rajesh Kumar (Principal Technical Architect)",
        course: "Java Backend Mastery",
        meetingLink: "https://meet.google.com/krtech-live-01",
        status: "upcoming",
        color: "#a855f7",
      },
      {
        id: "ev-02",
        title: "Next.js 15 Server Actions & Optimistic Mutations Clinic",
        type: "live_class",
        startTime: "2026-09-21T13:00:00.000Z",
        endTime: "2026-09-21T15:00:00.000Z",
        mentor: "Amit Verma (Principal Systems Architect)",
        course: "MERN Stack Bootcamp",
        meetingLink: "https://meet.google.com/krtech-live-02",
        status: "upcoming",
        color: "#06b6d4",
      },
      {
        id: "ev-03",
        title: "AWS Solutions Architecture: VPC Transit Gateway Capstone Due",
        type: "assignment_due",
        startTime: "2026-09-22T18:29:59.000Z",
        endTime: "2026-09-22T18:29:59.000Z",
        mentor: "Vikram Nair",
        course: "AWS SAA-C03",
        status: "pending",
        color: "#f59e0b",
      },
      {
        id: "ev-04",
        title: "Global Algorithmic Contest & Coding Sprint",
        type: "contest",
        startTime: "2026-09-24T10:00:00.000Z",
        endTime: "2026-09-24T12:00:00.000Z",
        mentor: "Academic Council",
        course: "System Design & Algorithms",
        status: "upcoming",
        color: "#10b981",
      },
      {
        id: "ev-05",
        title: "1:1 Technical Architecture & Code Review",
        type: "mentorship_1on1",
        startTime: "2026-09-25T15:00:00.000Z",
        endTime: "2026-09-25T16:00:00.000Z",
        mentor: "Deepak Joshi",
        course: "Cloud Systems Accelerator",
        status: "upcoming",
        color: "#ec4899",
      },
    ];

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error('Get Calendar Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCalendarEvents,
};
