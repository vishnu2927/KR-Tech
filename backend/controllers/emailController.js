const EmailLog = require('../models/EmailLog');
const {
  sendEmail,
  sendWelcomeEmail,
  sendDemoBookingEmail,
  sendPaymentSuccessEmail,
  sendCertificateEmail,
  sendOtpResetEmail,
  verifySmtp,
} = require('../services/emailService');
const emailQueue = require('../services/emailQueue');
const {
  getWelcomeTemplate,
  getDemoBookingTemplate,
  getPaymentSuccessTemplate,
  getCertificateDeliveryTemplate,
  getOtpResetTemplate,
} = require('../utils/emailTemplates');

// @desc    Get all Email Logs (Admin)
// @route   GET /api/emails/logs
// @access  Private/Admin
const getEmailLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const template = req.query.template;
    const status = req.query.status;
    const search = req.query.search;

    const query = {};
    if (template && template !== 'All') query.template = template;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { recipient: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { messageId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await EmailLog.countDocuments(query);
    const logs = await EmailLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      logs,
    });
  } catch (error) {
    console.error('Get Email Logs Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Email Dispatch Statistics (Admin)
// @route   GET /api/emails/stats
// @access  Private/Admin
const getEmailStats = async (req, res) => {
  try {
    const totalDispatched = await EmailLog.countDocuments();
    const sentCount = await EmailLog.countDocuments({ status: { $in: ['sent', 'simulated'] } });
    const failedCount = await EmailLog.countDocuments({ status: 'failed' });
    const retriedCount = await EmailLog.countDocuments({ retryCount: { $gt: 0 } });

    const templateStats = await EmailLog.aggregate([
      { $group: { _id: '$template', count: { $sum: 1 } } },
    ]);

    const recentLogs = await EmailLog.find().sort({ createdAt: -1 }).limit(10);
    const queueStatus = emailQueue.getMetrics();

    res.json({
      success: true,
      stats: {
        totalDispatched,
        sentCount,
        failedCount,
        retriedCount,
        deliveryRate: totalDispatched > 0 ? Math.round((sentCount / totalDispatched) * 100) : 100,
        byTemplate: templateStats,
        recentLogs,
        queue: queueStatus,
      },
    });
  } catch (error) {
    console.error('Get Email Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a Test Email across any supported template
// @route   POST /api/emails/send-test
// @access  Public (or Protected Admin)
const sendTestEmail = async (req, res) => {
  try {
    const { to, template, data } = req.body;

    if (!to || !template) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email ("to") and template name ("template") are required.',
      });
    }

    const result = await sendEmail({
      to,
      template,
      data: data || {
        name: 'Test Student',
        courseTitle: 'Enterprise Microservices with Spring Boot 3 & Apache Kafka',
        amount: 14999,
        otp: '489210',
        certId: 'KR-CERT-TEST-2026',
      },
      metadata: { isTest: true },
    });

    if (result.success) {
      res.json({
        success: true,
        message: `Test email (${template}) dispatched successfully to ${to}`,
        details: result,
      });
    } else {
      res.status(500).json({
        success: false,
        message: `Failed to dispatch email: ${result.error}`,
      });
    }
  } catch (error) {
    console.error('Send Test Email Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resend / Retry Email Dispatch from MongoDB Log ID
// @route   POST /api/emails/resend/:id
// @access  Private/Admin (or Public for test runner)
const resendEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await emailQueue.resendEmailLog(id);
    res.json({
      success: true,
      message: 'Email re-queued successfully for transmission',
      details: result,
    });
  } catch (error) {
    console.error('Resend Email Error:', error);
    res.status(error.message.includes('not found') ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Queue Real-Time Metrics
// @route   GET /api/emails/queue-status
// @access  Public
const getQueueStatus = (req, res) => {
  res.json({
    success: true,
    queue: emailQueue.getMetrics(),
  });
};

// @desc    Verify SMTP Connection Status
// @route   GET /api/emails/verify-smtp
// @access  Public
const verifySmtpStatus = async (req, res) => {
  try {
    const status = await verifySmtp();
    res.json({
      success: true,
      smtp: status,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Preview HTML Email Template in Browser
// @route   GET /api/emails/preview/:template
// @access  Public
const previewTemplate = (req, res) => {
  const { template } = req.params;

  let templateObj = null;
  const mockData = {
    name: 'Aditya Sharma',
    email: 'aditya.sharma@krtech.edu',
    course: 'Complete Java Backend Development with Spring Boot & Microservices',
    courseTitle: 'Complete Java Backend Development with Spring Boot & Microservices',
    amount: 14999,
    paymentId: 'pay_live_test_89214710',
    orderId: 'order_test_99214589',
    mentor: 'Rajesh Kumar (Principal Technical Architect)',
    date: 'Sep 20, 2026',
    time: '7:00 PM IST',
    certId: 'KR-CERT-2026-9204',
    grade: 'Distinction (98%)',
    issueDate: 'Sep 17, 2026',
    otp: '849201',
  };

  switch (template) {
    case 'welcome':
      templateObj = getWelcomeTemplate(mockData);
      break;
    case 'demo_booking':
    case 'demo':
      templateObj = getDemoBookingTemplate(mockData);
      break;
    case 'payment_success':
    case 'payment':
      templateObj = getPaymentSuccessTemplate(mockData);
      break;
    case 'certificate_delivery':
    case 'certificate':
      templateObj = getCertificateDeliveryTemplate(mockData);
      break;
    case 'otp_reset':
    case 'otp':
      templateObj = getOtpResetTemplate(mockData);
      break;
    default:
      return res.status(404).send(`<h3>Template '${template}' not found. Available: welcome, demo, payment, certificate, otp</h3>`);
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(templateObj.html);
};

module.exports = {
  getEmailLogs,
  getEmailStats,
  sendTestEmail,
  resendEmail,
  getQueueStatus,
  verifySmtpStatus,
  previewTemplate,
};
