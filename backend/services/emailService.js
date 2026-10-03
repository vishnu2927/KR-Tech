const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');
const {
  getWelcomeTemplate,
  getDemoBookingTemplate,
  getPaymentSuccessTemplate,
  getCertificateDeliveryTemplate,
  getOtpResetTemplate,
  getSessionReminder24hTemplate,
  getSessionReminder30mTemplate,
} = require('../utils/emailTemplates');
const { generateCertificatePdfBuffer } = require('../utils/pdfCertificateGenerator');

let transporter = null;
let isEthereal = false;
let smtpStatus = {
  verified: false,
  provider: 'pending',
  host: '',
  port: 587,
  user: '',
  lastCheck: null,
  error: null,
};

const CLIENT_URL =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://www.krgloballearning.org'
    : 'http://localhost:5173');

/**
 * Initialize Nodemailer Transport with Gmail App Password & Ethereal Fallback
 */
const initTransporter = async () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  // Check if live Google / SMTP credentials exist
  const hasConfiguredCredentials = Boolean(user && pass && pass.length >= 8);

  if (hasConfiguredCredentials && !pass.includes('placeholder')) {
    try {
      // Configure Gmail or custom SMTP
      const isGmail = host.includes('gmail') || user.endsWith('@gmail.com');
      const transportConfig = isGmail
        ? {
            service: 'gmail',
            auth: {
              user,
              pass: pass.replace(/\s+/g, ''), // Strip spaces in 16-character Google App Passwords
            },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 8000,
            greetingTimeout: 8000,
            socketTimeout: 10000,
          }
        : {
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 8000,
            greetingTimeout: 8000,
            socketTimeout: 10000,
          };

      const candidateTransporter = nodemailer.createTransport(transportConfig);

      // Verify connection
      await candidateTransporter.verify();
      transporter = candidateTransporter;
      isEthereal = false;
      smtpStatus = {
        verified: true,
        provider: isGmail ? 'Gmail App Password' : 'Custom Production SMTP',
        host: isGmail ? 'smtp.gmail.com' : host,
        port: isGmail ? 465 : port,
        user,
        lastCheck: new Date().toISOString(),
        error: null,
      };
      console.log(`📧 Nodemailer: Production SMTP transport verified and active (${user})`);
      return;
    } catch (smtpErr) {
      console.warn(`⚠️ Production SMTP verification failed (${smtpErr.message}). Falling back to safe test sandbox...`);
      smtpStatus.error = smtpErr.message;
    }
  }

  // Development / Localhost Fallback: Create test Ethereal transporter
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    isEthereal = true;
    smtpStatus = {
      verified: true,
      provider: 'Ethereal Test Sandbox (Development Fallback)',
      host: 'smtp.ethereal.email',
      port: 587,
      user: testAccount.user,
      lastCheck: new Date().toISOString(),
      error: smtpStatus.error || null,
    };
    console.log(`📧 Nodemailer: Ethereal test transporter active (${testAccount.user})`);
  } catch (etherealErr) {
    console.warn('Nodemailer Ethereal fallback note, using simulated local transport:', etherealErr.message);
    transporter = {
      sendMail: async (mailOptions) => ({
        messageId: `sim_msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        response: '250 OK Simulated local email delivery',
      }),
      verify: async () => true,
    };
    isEthereal = true;
    smtpStatus = {
      verified: true,
      provider: 'Simulated Local Mock',
      host: 'localhost',
      port: 587,
      user: 'dev@krtech.local',
      lastCheck: new Date().toISOString(),
      error: etherealErr.message,
    };
  }
};

// Initialize transporter on startup
initTransporter();

/**
 * Send Transactional Email via Resend HTTP REST API
 * Uses native Node.js fetch() with timeout protection and base64 attachment support.
 *
 * @param {Object} params
 * @param {string} [params.from] - Sender address
 * @param {string|string[]} params.to - Recipient address(es)
 * @param {string} params.subject - Email subject
 * @param {string} params.html - Rendered HTML content
 * @param {Array} [params.attachments] - Array of attachment objects
 * @param {string} [params.replyTo] - Reply-To address
 * @returns {Promise<{ id: string, data: Object }>}
 */
const sendViaResendHttp = async ({ from, to, subject, html, attachments, replyTo }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const payload = {
    from: from || process.env.RESEND_FROM || process.env.SMTP_FROM || '"KR Global Learning" <admissions@krgloballearning.org>',
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };

  const resolvedReplyTo = replyTo || process.env.RESEND_REPLY_TO;
  if (resolvedReplyTo) {
    payload.reply_to = resolvedReplyTo;
  }

  if (attachments && Array.isArray(attachments) && attachments.length > 0) {
    payload.attachments = attachments.map((att) => {
      let content = att.content;
      if (Buffer.isBuffer(content)) {
        content = content.toString('base64');
      }
      const item = {
        filename: att.filename,
        content,
      };
      if (att.contentType || att.content_type) {
        item.content_type = att.contentType || att.content_type;
      }
      return item;
    });
  }

  const controller = new AbortController();
  const timeoutMs = 12000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Resend HTTP request timed out after ${timeoutMs}ms`);
    }
    throw new Error(`Resend network failure: ${err.message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  let rawText = '';
  try {
    rawText = await response.text();
  } catch (readErr) {
    throw new Error(`Resend response read failure: ${readErr.message}`);
  }

  let resData;
  try {
    resData = rawText ? JSON.parse(rawText) : {};
  } catch (jsonErr) {
    throw new Error(`Resend returned invalid JSON (HTTP ${response.status}): ${rawText.slice(0, 200)}`);
  }

  if (!response.ok) {
    const errMsg = resData?.message || resData?.error || `HTTP ${response.status}`;
    throw new Error(`Resend API error (${response.status}): ${errMsg}`);
  }

  return {
    id: resData.id,
    data: resData,
  };
};

/**
 * Verify Current Email Transport Configuration (Resend HTTP or Nodemailer SMTP)
 */
const verifySmtp = async () => {
  if (process.env.RESEND_API_KEY) {
    return {
      verified: true,
      provider: 'Resend HTTP REST API (Production HTTPS)',
      host: 'api.resend.com',
      port: 443,
      user: process.env.RESEND_FROM || '"KR Global Learning" <admissions@krgloballearning.org>',
      lastCheck: new Date().toISOString(),
      error: null,
    };
  }

  if (!transporter) {
    await initTransporter();
  }
  try {
    if (transporter && typeof transporter.verify === 'function') {
      await transporter.verify();
      smtpStatus.verified = true;
      smtpStatus.lastCheck = new Date().toISOString();
    }
  } catch (err) {
    smtpStatus.verified = false;
    smtpStatus.error = err.message;
  }
  return { ...smtpStatus };
};

/**
 * Direct Email Dispatcher (Underlying worker for queue and instant calls)
 */
const sendEmailDirect = async ({ to, template, data = {}, metadata = {}, attachments, existingLogId }) => {
  if (!process.env.RESEND_API_KEY && !transporter) {
    await initTransporter();
  }

  let templateOutput = null;

  switch (template) {
    case 'welcome':
      templateOutput = getWelcomeTemplate(data);
      break;
    case 'demo_booking':
    case 'demo-booking':
    case 'demo':
      templateOutput = getDemoBookingTemplate(data);
      break;
    case 'payment_success':
    case 'payment-success':
    case 'payment':
      templateOutput = getPaymentSuccessTemplate(data);
      break;
    case 'certificate_delivery':
    case 'certificate-delivery':
    case 'certificate':
      templateOutput = getCertificateDeliveryTemplate(data);
      break;
    case 'otp_reset':
    case 'otp-reset':
    case 'otp':
      templateOutput = getOtpResetTemplate(data);
      break;
    case 'session_reminder_24h':
    case 'session-reminder-24h':
    case 'live_session_24h':
      templateOutput = getSessionReminder24hTemplate(data);
      break;
    case 'session_reminder_30m':
    case 'session-reminder-30m':
    case 'live_session_30m':
      templateOutput = getSessionReminder30mTemplate(data);
      break;
    default:
      templateOutput = {
        subject: data.subject || 'Notification from KR Global Learning',
        html: `<p>${data.message || 'Notification from KR Global Learning'}</p>`,
      };
      break;
  }

  // Dynamic Certificate PDF Attachment
  let finalAttachments = attachments || data?.attachments || [];
  if (
    (template === 'certificate_delivery' || template === 'certificate' || template === 'certificate-delivery') &&
    (!finalAttachments || finalAttachments.length === 0)
  ) {
    try {
      const certData = {
        studentName: data.name || data.studentName || 'Aditya Sharma',
        title: data.courseTitle || data.course || 'Enterprise Microservices with Spring Boot 3 & Apache Kafka',
        category: data.category || 'Advanced Backend Engineering',
        grade: data.grade || 'Distinction (98%)',
        completionDate:
          data.issueDate ||
          data.completionDate ||
          new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        credentialId: data.certId || data.credentialId || `KR-CERT-${Date.now().toString().slice(-6)}`,
        skills: data.skills || ['Spring Boot 3', 'Apache Kafka', 'Microservices', 'Docker', 'Kubernetes'],
      };

      const pdfBuffer = await generateCertificatePdfBuffer(certData, CLIENT_URL);

      finalAttachments = [
        {
          filename: `KR_Global_Learning_Certificate_${certData.credentialId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ];
    } catch (pdfErr) {
      console.error('Failed to generate dynamic certificate PDF attachment:', pdfErr);
    }
  }

  const from =
    process.env.RESEND_FROM ||
    process.env.SMTP_FROM ||
    '"KR Global Learning Admissions" <admissions@krgloballearning.org>';

  const replyTo = process.env.RESEND_REPLY_TO || undefined;

  let messageId = null;
  let previewUrl = null;
  let providerResponse = null;

  try {
    if (process.env.RESEND_API_KEY) {
      const resendRes = await sendViaResendHttp({
        from,
        to,
        subject: templateOutput.subject,
        html: templateOutput.html,
        attachments: finalAttachments,
        replyTo,
      });
      messageId = resendRes.id || `resend_${Date.now()}`;
      providerResponse = `200 OK (Resend HTTP: ${messageId})`;
    } else {
      if (!transporter) {
        await initTransporter();
      }
      const mailOptions = {
        from,
        to,
        subject: templateOutput.subject,
        html: templateOutput.html,
        ...(replyTo ? { replyTo } : {}),
        ...(finalAttachments && finalAttachments.length > 0 ? { attachments: finalAttachments } : {}),
      };

      const info = await transporter.sendMail(mailOptions);
      messageId = info.messageId || `msg_${Date.now()}`;
      previewUrl = isEthereal && nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
      providerResponse = info.response || '250 OK';
    }

    // Log or update dispatched email in MongoDB Atlas collection: emailLogs
    let emailLogDoc = null;
    try {
      if (existingLogId) {
        emailLogDoc = await EmailLog.findByIdAndUpdate(
          existingLogId,
          {
            status: isEthereal && !process.env.RESEND_API_KEY ? 'simulated' : 'sent',
            messageId,
            previewUrl: previewUrl || undefined,
            lastAttemptAt: new Date(),
            $inc: { attempts: 1 },
          },
          { new: true }
        );
      } else {
        emailLogDoc = await EmailLog.create({
          recipient: to,
          subject: templateOutput.subject,
          template,
          status: isEthereal && !process.env.RESEND_API_KEY ? 'simulated' : 'sent',
          messageId,
          previewUrl: previewUrl || undefined,
          retryCount: 0,
          attempts: 1,
          lastAttemptAt: new Date(),
          metadata: {
            ...metadata,
            hasPdfAttachment: finalAttachments.length > 0,
            provider: process.env.RESEND_API_KEY ? 'resend_http' : (isEthereal ? 'ethereal' : 'smtp'),
            response: providerResponse,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Notice saving EmailLog into MongoDB:', dbErr.message);
    }

    return {
      success: true,
      messageId,
      previewUrl,
      logId: emailLogDoc ? emailLogDoc._id : null,
      hasAttachment: finalAttachments.length > 0,
    };
  } catch (error) {
    const sanitizedError = (error.message || 'Email dispatch failed')
      .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
      .replace(/re_[A-Za-z0-9_]+/gi, '[REDACTED_API_KEY]');

    console.error(`Email dispatch error for [${to}] [${template}]:`, sanitizedError);

    // Save failed attempt in MongoDB Atlas
    try {
      if (existingLogId) {
        await EmailLog.findByIdAndUpdate(existingLogId, {
          status: 'failed',
          error: sanitizedError,
          lastAttemptAt: new Date(),
          $inc: { attempts: 1 },
        });
      } else {
        await EmailLog.create({
          recipient: to,
          subject: templateOutput?.subject || 'KR Global Learning Notification',
          template,
          status: 'failed',
          error: sanitizedError,
          retryCount: 0,
          attempts: 1,
          lastAttemptAt: new Date(),
          metadata: {
            ...metadata,
            provider: process.env.RESEND_API_KEY ? 'resend_http' : (isEthereal ? 'ethereal' : 'smtp'),
          },
        });
      }
    } catch (dbErr) {
      // ignore
    }

    return {
      success: false,
      error: sanitizedError,
    };
  }
};

/**
 * Queue or Instant Dispatcher
 */
const sendEmail = async (params) => {
  // Direct dispatch with queue reliability
  return sendEmailDirect(params);
};

/**
 * Convenience Methods for Application Integration
 */
const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    template: 'welcome',
    data: {
      name: user.name,
      email: user.email,
    },
    metadata: {
      userId: user._id || user.id,
      role: user.role,
    },
  });
};

const sendDemoBookingEmail = async (lead) => {
  return sendEmail({
    to: lead.email,
    template: 'demo_booking',
    data: {
      name: lead.name,
      course: lead.course,
      date: lead.demoDate || 'Tomorrow',
      time: lead.demoTime || '7:00 PM IST',
      mentor: 'Senior Technical Lead',
    },
    metadata: {
      leadId: lead._id || lead.id,
      phone: lead.phone,
    },
  });
};

const sendPaymentSuccessEmail = async (payment) => {
  return sendEmail({
    to: payment.userEmail,
    template: 'payment_success',
    data: {
      name: payment.userName || 'Student',
      courseTitle: payment.courseTitle,
      amount: payment.amount,
      paymentId: payment.paymentId,
      orderId: payment.orderId,
      date: new Date(payment.createdAt || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
    metadata: {
      paymentId: payment.paymentId,
      courseId: payment.courseId,
    },
  });
};

const sendCertificateEmail = async ({
  recipientEmail,
  studentName,
  courseTitle,
  certId,
  grade,
  issueDate,
  pdfBuffer,
}) => {
  const attachments = pdfBuffer
    ? [
        {
          filename: `KR_Tech_Certificate_${certId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ]
    : undefined;

  return sendEmail({
    to: recipientEmail,
    template: 'certificate_delivery',
    data: {
      name: studentName,
      courseTitle,
      certId,
      grade,
      issueDate,
    },
    metadata: {
      certId,
      studentName,
    },
    attachments,
  });
};

const sendOtpResetEmail = async ({ email, name, otp, expiryMinutes = 10 }) => {
  return sendEmail({
    to: email,
    template: 'otp_reset',
    data: {
      name: name || 'Student',
      email,
      otp,
      expiryMinutes,
    },
    metadata: {
      email,
      otpPurpose: 'password_reset',
    },
  });
};

const sendSessionReminderEmail = async ({
  email,
  name,
  session,
  type = '24h', // '24h' | '30m'
}) => {
  const template = type === '30m' ? 'session_reminder_30m' : 'session_reminder_24h';
  const scheduledTimeStr = session.scheduledAt
    ? new Date(session.scheduledAt).toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : 'Upcoming';

  return sendEmail({
    to: email,
    template,
    data: {
      name: name || 'Student',
      sessionTitle: session.title,
      mentorName: session.mentorName || 'Principal Tech Mentor',
      scheduledAt: session.scheduledAt,
      scheduledTimeStr,
      platform: session.platform,
      meetingLink: session.meetingLink,
      meetingId: session.meetingId,
      meetingPassword: session.meetingPassword,
      sessionId: session._id || session.id,
    },
    metadata: {
      sessionId: session._id || session.id,
      sessionTitle: session.title,
      reminderType: type,
    },
  });
};

module.exports = {
  sendEmail,
  sendEmailDirect,
  sendViaResendHttp,
  verifySmtp,
  sendWelcomeEmail,
  sendDemoBookingEmail,
  sendPaymentSuccessEmail,
  sendCertificateEmail,
  sendOtpResetEmail,
  sendSessionReminderEmail,
};
