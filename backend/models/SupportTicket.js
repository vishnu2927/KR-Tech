const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    studentPhone: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Ticket subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
    },
    category: {
      type: String,
      enum: [
        'Billing & Refunds',
        'Course Access & LMS',
        'Live Class Issue',
        'Certificate',
        'Learning Resources & Certifications',
        'Technical Issue',
        'General Inquiry',
      ],
      default: 'General Inquiry',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Waiting Customer', 'Resolved', 'Closed'],
      default: 'Open',
      index: true,
    },
    assignedTo: {
      name: { type: String, default: 'Unassigned' },
      email: { type: String, default: '' },
      role: { type: String, default: 'Support Staff' },
    },
    messages: [
      {
        sender: { type: String, required: true },
        senderRole: { type: String, enum: ['student', 'admin', 'system'], default: 'student' },
        message: { type: String, required: true },
        attachments: [{ type: String }],
        timestamp: { type: Date, default: Date.now },
      },
    ],
    slaDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours SLA default
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

supportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema, 'supportTickets');
