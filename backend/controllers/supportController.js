const SupportTicket = require('../models/SupportTicket');
const AdminLog = require('../models/AdminLog');

// @desc    Create Support Ticket
// @route   POST /api/support/create
// @access  Public / Authenticated
const createTicket = async (req, res) => {
  try {
    const { studentName, studentEmail, studentPhone, subject, description, category, priority } = req.body;

    if (!studentName || !studentEmail || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and description are required',
      });
    }

    const ticketSeq = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TICK-2026-${ticketSeq}`;

    // SLA calculation: Urgent = 4h, High = 12h, Medium = 24h, Low = 48h
    let slaHours = 24;
    if (priority === 'Urgent') slaHours = 4;
    else if (priority === 'High') slaHours = 12;
    else if (priority === 'Low') slaHours = 48;

    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const ticket = await SupportTicket.create({
      ticketId,
      student: req.user?._id || null,
      studentName,
      studentEmail: studentEmail.toLowerCase().trim(),
      studentPhone: studentPhone || '',
      subject,
      description,
      category: category || 'General Inquiry',
      priority: priority || 'Medium',
      status: 'Open',
      slaDeadline,
      messages: [
        {
          sender: studentName,
          senderRole: 'student',
          message: description,
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully',
      ticket,
    });
  } catch (error) {
    console.error('Create Ticket Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Support Ticket (Admin or staff reply/status change)
// @route   PATCH /api/support/:id
// @access  Private (Admin / Staff)
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, replyMessage, tags } = req.body;

    const ticket = await SupportTicket.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }].filter(Boolean),
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) {
      ticket.status = status;
      if (status === 'Resolved' || status === 'Closed') {
        ticket.resolvedAt = new Date();
      }
    }

    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (tags && Array.isArray(tags)) ticket.tags = tags;

    if (replyMessage && replyMessage.trim()) {
      ticket.messages.push({
        sender: req.user?.name || 'KR Tech Support Admin',
        senderRole: 'admin',
        message: replyMessage.trim(),
        timestamp: new Date(),
      });
    }

    await ticket.save();

    // Log admin action
    try {
      await AdminLog.create({
        adminEmail: req.user?.email || 'admin@krtech.edu',
        adminName: req.user?.name || 'Administrator',
        action: 'UPDATE_TICKET',
        targetEntity: 'Ticket',
        targetId: ticket.ticketId,
        details: `Updated ticket ${ticket.ticketId} status to ${ticket.status}${replyMessage ? ' with reply' : ''}`,
      });
    } catch (logErr) {
      // Non-blocking
    }

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket,
    });
  } catch (error) {
    console.error('Update Ticket Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Support Tickets (Admin Queue with filters)
// @route   GET /api/support
// @access  Private (Admin)
const getTickets = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;

    const query = {};
    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { studentEmail: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    // Auto-seed mock tickets if database is empty for rich demonstration
    const existingCount = await SupportTicket.countDocuments();
    if (existingCount === 0) {
      await SupportTicket.insertMany([
        {
          ticketId: 'TICK-2026-8801',
          studentName: 'Aarav Sharma',
          studentEmail: 'aarav.sharma@gmail.com',
          studentPhone: '+91 98765 11223',
          subject: 'Need GST invoice copy for Spring Boot course enrollment',
          description: 'Company reimburses certification fees; need official GST invoice mentioning KR Tech GSTIN.',
          category: 'Billing & Refunds',
          priority: 'High',
          status: 'Open',
          slaDeadline: new Date(Date.now() + 12 * 3600 * 1000),
          messages: [
            {
              sender: 'Aarav Sharma',
              senderRole: 'student',
              message: 'Company reimburses certification fees; need official GST invoice mentioning KR Tech GSTIN.',
              timestamp: new Date(Date.now() - 3600 * 1000 * 2),
            },
          ],
        },
        {
          ticketId: 'TICK-2026-8802',
          studentName: 'Sneha Patel',
          studentEmail: 'sneha.patel@outlook.com',
          studentPhone: '+91 98234 44556',
          subject: 'Live class Zoom link audio issue during Microservices session',
          description: 'Yesterday evening session mentor voice was fluctuating; recording audio check requested.',
          category: 'Live Class Issue',
          priority: 'Medium',
          status: 'In Progress',
          slaDeadline: new Date(Date.now() + 18 * 3600 * 1000),
          messages: [
            {
              sender: 'Sneha Patel',
              senderRole: 'student',
              message: 'Yesterday evening session mentor voice was fluctuating; recording audio check requested.',
              timestamp: new Date(Date.now() - 3600 * 1000 * 5),
            },
            {
              sender: 'Rajesh Kumar (Mentor)',
              senderRole: 'admin',
              message: 'We have normalized the audio on the Cloud recording. Please check the Recording Library.',
              timestamp: new Date(Date.now() - 3600 * 1000 * 1),
            },
          ],
        },
        {
          ticketId: 'TICK-2026-8803',
          studentName: 'Karan Mehra',
          studentEmail: 'karan.m@gmail.com',
          studentPhone: '+91 99887 77665',
          subject: 'Cloud & DevOps live session scheduling conflict',
          description: 'College end-semester lab exams are on Friday; requesting reschedule to Saturday 6 PM.',
          category: 'Learning Resources & Certifications',
          priority: 'Urgent',
          status: 'Open',
          slaDeadline: new Date(Date.now() + 4 * 3600 * 1000),
          messages: [
            {
              sender: 'Karan Mehra',
              senderRole: 'student',
              message: 'College end-semester lab exams are on Friday; requesting reschedule to Saturday 6 PM.',
              timestamp: new Date(Date.now() - 3600 * 1000 * 1),
            },
          ],
        },
        {
          ticketId: 'TICK-2026-8804',
          studentName: 'Deepika Rao',
          studentEmail: 'deepika.rao@yahoo.com',
          studentPhone: '+91 97654 33221',
          subject: 'Certificate QR code verification name spelling update',
          description: 'My middle name was omitted on the digital certificate; please update and re-issue.',
          category: 'Certificate',
          priority: 'Low',
          status: 'Resolved',
          resolvedAt: new Date(Date.now() - 3600 * 1000 * 4),
          slaDeadline: new Date(Date.now() + 24 * 3600 * 1000),
          messages: [
            {
              sender: 'Deepika Rao',
              senderRole: 'student',
              message: 'My middle name was omitted on the digital certificate; please update and re-issue.',
              timestamp: new Date(Date.now() - 3600 * 1000 * 10),
            },
            {
              sender: 'Admin Team',
              senderRole: 'admin',
              message: 'Credential regenerated with updated name. Verifiable QR ledger refreshed.',
              timestamp: new Date(Date.now() - 3600 * 1000 * 4),
            },
          ],
        },
      ]);
    }

    const tickets = await SupportTicket.find(query).sort({ createdAt: -1 }).lean();

    const stats = {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'Open').length,
      inProgress: tickets.filter((t) => t.status === 'In Progress').length,
      resolved: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length,
      urgent: tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Resolved').length,
    };

    res.json({
      success: true,
      count: tickets.length,
      stats,
      tickets,
    });
  } catch (error) {
    console.error('Get Tickets Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get My Tickets (Student)
// @route   GET /api/support/me
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const email = req.user?.email;
    const tickets = await SupportTicket.find({
      $or: [{ student: req.user?._id }, { studentEmail: email }].filter(Boolean),
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error('Get My Tickets Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTicket,
  updateTicket,
  getTickets,
  getMyTickets,
};
